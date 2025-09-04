# Configuration settings and constants

MODEL_NAME = 'llava'

# Brand multipliers for price estimation
BRAND_MULTIPLIERS = {
    'toyota': 1.0, 'honda': 1.0, 'nissan': 0.9,
    'bmw': 1.5, 'mercedes': 1.6, 'audi': 1.4,
    'lexus': 1.3, 'acura': 1.2,
    'ford': 0.8, 'chevrolet': 0.8, 'hyundai': 0.9,
    'renault': 0.85, 'peugeot': 0.85, 'volkswagen': 1.1,
    'porsche': 2.0, 'ferrari': 3.0, 'lamborghini': 3.5
}

# Condition multipliers for price estimation
CONDITION_MULTIPLIERS = {
    'excellent': 1.0, 'good': 0.85, 'fair': 0.7, 'poor': 0.5
}

# Base prices by market segment
SEGMENT_BASE_PRICES = {
    'luxury': 50000, 'sports': 45000, 'mid-range': 25000,
    'economy': 15000, 'commercial': 30000
}

# Focus area prompts for analysis
FOCUS_PROMPTS = {
    "general": """
    Analyze this car image and extract the following characteristics:
    
    1. VEHICLE TYPE: (sedan, SUV, hatchback, coupe, convertible, truck, etc.)
    2. BRAND/MAKE: (Toyota, BMW, Mercedes, etc.)
    3. MODEL: (if identifiable)
    4. APPROXIMATE YEAR: (estimate based on design)
    5. BODY CONDITION: (excellent, good, fair, poor - look for dents, scratches, rust)
    6. PAINT CONDITION: (excellent, good, faded, scratched, damaged)
    7. WHEEL/TIRE CONDITION: (new, good, worn, damaged)
    8. SIZE CATEGORY: (compact, mid-size, full-size, luxury)
    9. SPECIAL FEATURES: (sunroof, spoiler, custom wheels, etc.)
    10. ESTIMATED MILEAGE CATEGORY: (low, medium, high - based on wear visible)
    11. MARKET SEGMENT: (economy, mid-range, luxury, sports, commercial)
    12. NOTABLE DAMAGE: (any visible damage that would affect price)
    13. INTERIOR CONDITION: (if visible - excellent, good, fair, poor)
    14. MODIFICATIONS: (any aftermarket modifications visible)
    15. CONFIDENCE_LEVEL: (high, medium, low - how confident are you in this analysis)
    
    Be specific and detailed. If you can't determine something, say "Unknown" or "Not visible".
    Focus on details that would affect the car's market value.
    """,
    
    "exterior": """
    Focus specifically on the EXTERIOR condition of this car:
    
    1. PAINT CONDITION: Detail any scratches, dents, rust, fading
    2. BODY PANELS: Check alignment, gaps, damage
    3. BUMPERS: Condition, cracks, misalignment
    4. LIGHTS: Headlights, taillights, indicators condition
    5. WINDOWS: Cracks, tinting, condition
    6. MIRRORS: Condition and completeness
    7. TRIM: Chrome, plastic trim condition
    8. OVERALL_EXTERIOR_GRADE: (excellent, good, fair, poor)
    
    Rate the exterior condition and note any issues that would affect resale value.
    """,
    
    "interior": """
    Focus specifically on the INTERIOR condition of this car:
    
    1. SEAT_CONDITION: Wear, tears, stains, material type
    2. DASHBOARD: Cracks, wear, functionality
    3. STEERING_WHEEL: Condition, wear patterns
    4. ELECTRONICS: Visible screen, controls condition
    5. UPHOLSTERY: Overall condition, material quality
    6. CLEANLINESS: Overall interior cleanliness
    7. WEAR_PATTERNS: Signs of heavy use or care
    8. OVERALL_INTERIOR_GRADE: (excellent, good, fair, poor)
    
    Assess the interior condition and note any issues affecting value.
    """,
    
    "wheels": """
    Focus specifically on WHEELS and TIRES:
    
    1. TIRE_CONDITION: Tread depth, wear patterns, age
    2. WHEEL_CONDITION: Scratches, dents, curb damage
    3. TIRE_BRAND: If visible, tire brand and quality
    4. WHEEL_TYPE: Alloy, steel, aftermarket, stock
    5. SIZE: Estimate wheel/tire size
    6. ALIGNMENT_ISSUES: Uneven wear patterns
    7. OVERALL_WHEEL_GRADE: (excellent, good, fair, poor)
    
    Evaluate the wheels and tires condition for safety and value impact.
    """
}

# Regex patterns for parsing characteristics
CHARACTERISTIC_PATTERNS = {
    'vehicle_type': r'VEHICLE TYPE:?\s*(.+)',
    'brand': r'BRAND/MAKE:?\s*(.+)',
    'model': r'MODEL:?\s*(.+)',
    'year': r'APPROXIMATE YEAR:?\s*(.+)',
    'body_condition': r'BODY CONDITION:?\s*(.+)',
    'paint_condition': r'PAINT CONDITION:?\s*(.+)',
    'wheel_condition': r'WHEEL/TIRE CONDITION:?\s*(.+)',
    'size_category': r'SIZE CATEGORY:?\s*(.+)',
    'special_features': r'SPECIAL FEATURES:?\s*(.+)',
    'mileage_category': r'ESTIMATED MILEAGE CATEGORY:?\s*(.+)',
    'market_segment': r'MARKET SEGMENT:?\s*(.+)',
    'damage': r'NOTABLE DAMAGE:?\s*(.+)',
    'interior_condition': r'INTERIOR CONDITION:?\s*(.+)',
    'modifications': r'MODIFICATIONS:?\s*(.+)',
    'confidence_level': r'CONFIDENCE_LEVEL:?\s*(.+)',
    'overall_exterior_grade': r'OVERALL_EXTERIOR_GRADE:?\s*(.+)',
    'overall_interior_grade': r'OVERALL_INTERIOR_GRADE:?\s*(.+)',
    'overall_wheel_grade': r'OVERALL_WHEEL_GRADE:?\s*(.+)',
}

# API configuration
MAX_IMAGES_PER_REQUEST = 10
API_VERSION = "2.0.0"
API_TITLE = "Car Analyzer API"