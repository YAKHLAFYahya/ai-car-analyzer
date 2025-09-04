from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
import base64
from datetime import datetime
from typing import List, Optional
import uvicorn

from config import MAX_IMAGES_PER_REQUEST, API_VERSION, API_TITLE
from models import ImageAnalysisResult, MultiImageAnalysisResponse, AnalysisResponse
from analyzer import (
    analyze_single_car_image, consolidate_multiple_analyses, 
    generate_analysis_summary, estimate_price_factors
)
from utils import parse_characteristics, calculate_confidence_score, determine_focus_area

app = FastAPI(title=API_TITLE, version=API_VERSION)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def read_root():
    with open("index.html", 'r', encoding='utf-8') as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_car(file: UploadFile = File(...)):
    """Single image analysis (backward compatibility)"""
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        image_data = await file.read()
        image_base64 = base64.b64encode(image_data).decode()
        
        raw_analysis = analyze_single_car_image(image_base64, file.filename)
        characteristics = parse_characteristics(raw_analysis)
        price_estimation = estimate_price_factors(characteristics)
        
        return AnalysisResponse(
            characteristics=characteristics,
            price_estimation=price_estimation,
            raw_analysis=raw_analysis,
            analysis_date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            success=True,
            message="Analysis completed successfully"
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.post("/analyze-multiple", response_model=MultiImageAnalysisResponse)
async def analyze_multiple_car_images(
    files: List[UploadFile] = File(...),
    analysis_focus: Optional[str] = Form("comprehensive")
):
    """Analyze multiple images of the same car for comprehensive assessment"""
    
    if len(files) > MAX_IMAGES_PER_REQUEST:
        raise HTTPException(status_code=400, detail=f"Maximum {MAX_IMAGES_PER_REQUEST} images allowed")
    
    if not files:
        raise HTTPException(status_code=400, detail="At least one image is required")
    
    # Validate all files are images
    for file in files:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail=f"File {file.filename} must be an image")
    
    try:
        individual_analyses = []
        
        for i, file in enumerate(files):
            image_data = await file.read()
            image_base64 = base64.b64encode(image_data).decode()
            
            # Determine focus area based on filename or position
            focus_area = determine_focus_area(file.filename, i)
            
            # Analyze the image
            raw_analysis = analyze_single_car_image(
                image_base64, 
                file.filename or f"image_{i+1}",
                focus_area
            )
            
            characteristics = parse_characteristics(raw_analysis)
            confidence_score = calculate_confidence_score(characteristics)
            
            individual_analyses.append(ImageAnalysisResult(
                image_name=file.filename or f"image_{i+1}",
                characteristics=characteristics,
                confidence_score=confidence_score,
                analysis_notes=raw_analysis
            ))
        
        # Consolidate all analyses
        consolidated_characteristics, overall_confidence = consolidate_multiple_analyses(individual_analyses)
        
        # Generate price estimation based on consolidated data
        price_estimation = estimate_price_factors(consolidated_characteristics)
        
        # Generate analysis summary
        analysis_summary = generate_analysis_summary(
            individual_analyses, 
            consolidated_characteristics, 
            overall_confidence
        )
        
        return MultiImageAnalysisResponse(
            consolidated_characteristics=consolidated_characteristics,
            price_estimation=price_estimation,
            individual_analyses=individual_analyses,
            analysis_summary=analysis_summary,
            analysis_date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            success=True,
            message=f"Successfully analyzed {len(files)} images",
            images_processed=len(files)
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Multi-image analysis failed: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api-info")
async def api_info():
    return {
        "version": API_VERSION,
        "features": [
            "Single image analysis",
            "Multiple image analysis",
            "Comprehensive car assessment",
            "Price estimation",
            "Condition evaluation"
        ],
        "endpoints": {
            "/analyze": "Single image analysis (legacy)",
            "/analyze-multiple": "Multiple images analysis (recommended)",
            "/health": "API health check",
            "/api-info": "API information"
        },
        "limits": {
            "max_images_per_request": MAX_IMAGES_PER_REQUEST,
            "max_file_size": "10MB per image",
            "supported_formats": ["JPG", "PNG", "WebP"]
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)