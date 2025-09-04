from pydantic import BaseModel
from typing import Dict, Any, List

class ImageAnalysisResult(BaseModel):
    image_name: str
    characteristics: Dict[str, str]
    confidence_score: float
    analysis_notes: str

class MultiImageAnalysisResponse(BaseModel):
    consolidated_characteristics: Dict[str, str]
    price_estimation: Dict[str, Any]
    individual_analyses: List[ImageAnalysisResult]
    analysis_summary: Dict[str, Any]
    analysis_date: str
    success: bool
    message: str
    images_processed: int

class AnalysisResponse(BaseModel):
    characteristics: Dict[str, str]
    price_estimation: Dict[str, Any]
    raw_analysis: str
    analysis_date: str
    success: bool
    message: str