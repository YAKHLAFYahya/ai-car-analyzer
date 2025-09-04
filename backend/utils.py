import re
from collections import Counter
from config import CHARACTERISTIC_PATTERNS

def determine_focus_area(filename, index):
    """Determine focus area based on filename or position"""
    focus_area = "general"
    filename_lower = filename.lower() if filename else f"image_{index}"
    
    if any(word in filename_lower for word in ['interior', 'inside', 'dashboard', 'seat']):
        focus_area = "interior"
    elif any(word in filename_lower for word in ['wheel', 'tire', 'rim']):
        focus_area = "wheels"
    elif any(word in filename_lower for word in ['exterior', 'outside', 'body']):
        focus_area = "exterior"
    
    return focus_area

def parse_characteristics(analysis_text):
    """Parse characteristics from analysis text"""
    characteristics = {}
    
    for key, pattern in CHARACTERISTIC_PATTERNS.items():
        match = re.search(pattern, analysis_text, re.IGNORECASE)
        if match:
            characteristics[key] = match.group(1).strip()
        else:
            characteristics[key] = "Not specified"
    
    return characteristics

def calculate_confidence_score(characteristics):
    """Calculate confidence score based on how many characteristics were identified"""
    identified = sum(1 for v in characteristics.values() if v not in ["Not specified", "Unknown", "Not visible", ""])
    total = len(characteristics)
    return min(identified / total, 1.0)

def get_most_common_value(values):
    """Get most common value from a list, or first if all unique"""
    if not values:
        return "Not determined"
    try:
        return Counter(values).most_common(1)[0][0]
    except:
        return values[0]

def get_positive_factors(characteristics):
    """Get positive factors that increase price"""
    factors = []
    if 'luxury' in characteristics.get('market_segment', '').lower():
        factors.append("Luxury vehicle segment")
    if 'excellent' in characteristics.get('body_condition', '').lower():
        factors.append("Excellent body condition")
    if 'low' in characteristics.get('mileage_category', '').lower():
        factors.append("Low estimated mileage")
    return factors

def get_negative_factors(characteristics):
    """Get negative factors that decrease price"""
    factors = []
    if 'poor' in str(characteristics.get('body_condition', '')).lower():
        factors.append("Poor body condition")
    if 'damaged' in str(characteristics.get('damage', '')).lower():
        factors.append("Visible damage present")
    if 'high' in characteristics.get('mileage_category', '').lower():
        factors.append("High estimated mileage")
    return factors

def get_price_recommendations(characteristics):
    """Get price-related recommendations"""
    recommendations = []
    if any('poor' in str(v).lower() for v in characteristics.values()):
        recommendations.append("Consider professional inspection before purchase")
    if 'modifications' in characteristics and characteristics['modifications'] != 'Not specified':
        recommendations.append("Check if modifications affect warranty or insurance")
    return recommendations