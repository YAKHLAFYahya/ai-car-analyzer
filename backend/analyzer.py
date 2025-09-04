import ollama
import re
import statistics
from datetime import datetime
from collections import defaultdict
from config import (
    MODEL_NAME, FOCUS_PROMPTS, BRAND_MULTIPLIERS, CONDITION_MULTIPLIERS, 
    SEGMENT_BASE_PRICES
)
from utils import (
    parse_characteristics, calculate_confidence_score, get_most_common_value,
    get_positive_factors, get_negative_factors, get_price_recommendations
)

def analyze_single_car_image(image_data, image_name="", focus_area="general"):
    """Analyze a single car image with specific focus"""
    prompt = FOCUS_PROMPTS.get(focus_area, FOCUS_PROMPTS["general"])
    
    try:
        response = ollama.chat(
            model=MODEL_NAME,
            messages=[{
                'role': 'user',
                'content': prompt,
                'images': [image_data]
            }]
        )
        
        return response['message']['content']
    except Exception as e:
        raise Exception(f"Failed to analyze image {image_name}: {str(e)}")

def consolidate_multiple_analyses(analyses_results):
    """Consolidate multiple image analyses into a single comprehensive result"""
    all_characteristics = defaultdict(list)
    confidence_scores = []
    
    # Collect all characteristics from all analyses
    for result in analyses_results:
        confidence_scores.append(result.confidence_score)
        for key, value in result.characteristics.items():
            if value not in ["Not specified", "Unknown", "Not visible", ""]:
                all_characteristics[key].append(value)
    
    # Consolidate characteristics using majority vote or best available info
    consolidated = {}
    for key, values in all_characteristics.items():
        consolidated[key] = get_most_common_value(values)
    
    # Fill in missing keys
    all_keys = set()
    for result in analyses_results:
        all_keys.update(result.characteristics.keys())
    
    for key in all_keys:
        if key not in consolidated:
            consolidated[key] = "Not determined"
    
    # Calculate overall confidence
    overall_confidence = statistics.mean(confidence_scores) if confidence_scores else 0.0
    
    return consolidated, overall_confidence

def generate_analysis_summary(individual_analyses, consolidated_characteristics, overall_confidence):
    """Generate a summary of the multi-image analysis"""
    summary = {
        'total_images': len(individual_analyses),
        'overall_confidence': round(overall_confidence, 2),
        'analysis_quality': 'High' if overall_confidence > 0.7 else 'Medium' if overall_confidence > 0.4 else 'Low',
        'key_findings': [],
        'condition_assessment': {},
        'recommendations': []
    }
    
    # Key findings
    brand = consolidated_characteristics.get('brand', 'Unknown')
    model = consolidated_characteristics.get('model', 'Unknown')
    year = consolidated_characteristics.get('year', 'Unknown')
    
    if brand != 'Unknown':
        summary['key_findings'].append(f"Vehicle identified as {brand} {model} ({year})")
    
    # Condition assessment
    conditions = {}
    for key in ['body_condition', 'paint_condition', 'wheel_condition', 'interior_condition']:
        value = consolidated_characteristics.get(key, 'Not determined')
        if value != 'Not determined':
            conditions[key.replace('_', ' ').title()] = value
    
    summary['condition_assessment'] = conditions
    
    # Recommendations
    if overall_confidence < 0.5:
        summary['recommendations'].append("Consider uploading clearer images for better analysis")
    
    if any('poor' in str(v).lower() for v in conditions.values()):
        summary['recommendations'].append("Vehicle shows signs of wear - consider professional inspection")
    
    return summary

def estimate_price_factors(characteristics):
    """Estimate price factors based on consolidated characteristics"""
    brand = characteristics.get('brand', '').lower()
    
    # Use the worst condition among all condition factors
    conditions = [
        characteristics.get('body_condition', '').lower(),
        characteristics.get('paint_condition', '').lower(),
        characteristics.get('interior_condition', '').lower(),
        characteristics.get('wheel_condition', '').lower()
    ]
    
    condition_scores = []
    for cond in conditions:
        if cond in CONDITION_MULTIPLIERS:
            condition_scores.append(CONDITION_MULTIPLIERS[cond])
    
    # Use average condition score, but weight it conservatively
    condition_factor = min(condition_scores) if condition_scores else 0.8
    
    segment = characteristics.get('market_segment', '').lower()
    
    base_price = SEGMENT_BASE_PRICES.get(segment, 20000)
    brand_factor = next((v for k, v in BRAND_MULTIPLIERS.items() if k in brand), 1.0)
    
    estimated_price = base_price * brand_factor * condition_factor
    
    # Adjust based on year if available
    try:
        year_str = characteristics.get('year', '')
        year_match = re.search(r'(\d{4})', year_str)
        if year_match:
            year = int(year_match.group(1))
            current_year = datetime.now().year
            age = current_year - year
            age_factor = max(0.3, 1.0 - (age * 0.05))  # 5% depreciation per year, minimum 30%
            estimated_price *= age_factor
    except:
        pass
    
    return {
        'estimated_price_range': f"${estimated_price*0.8:,.0f} - ${estimated_price*1.2:,.0f}",
        'estimated_price': int(estimated_price),
        'base_price': base_price,
        'brand_factor': brand_factor,
        'condition_factor': condition_factor,
        'factors_explanation': {
            'positive_factors': get_positive_factors(characteristics),
            'negative_factors': get_negative_factors(characteristics),
            'recommendations': get_price_recommendations(characteristics)
        }
    }