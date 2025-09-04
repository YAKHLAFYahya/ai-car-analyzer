# AI Car Analyzer Pro

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green.svg)](https://fastapi.tiangolo.com/)

A powerful web application that leverages AI to analyze car images and provide accurate price estimations. Upload single or multiple vehicle photos to get comprehensive analysis of characteristics, condition assessment, and market value estimates.

## ✨ Features

### Core Functionality
- **Multi-Image Analysis**: Upload up to 10 car images simultaneously for comprehensive evaluation
- **AI-Powered Assessment**: Advanced image analysis for vehicle characteristics and condition
- **Price Estimation**: Intelligent pricing based on brand recognition, condition factors, and market data
- **Confidence Scoring**: Reliability indicators for each analysis result

### User Experience
- **Drag & Drop Interface**: Intuitive file upload with visual feedback
- **Real-Time Previews**: Instant image thumbnails with upload progress
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Format Support**: Compatible with JPG, PNG, and WebP image formats

## 🏗️ Architecture

This application follows a modern full-stack architecture:

- **Frontend**: React 18+ with modern hooks and responsive design
- **Backend**: FastAPI server with Ollama LLaVA AI vision model integration
- **AI Model**: Ollama LLaVA for advanced image analysis and car recognition
- **Communication**: RESTful API with JSON data exchange
- **Deployment**: Production-ready build system with Docker support

## 🚀 Quick Start

### Prerequisites

Before running the application, ensure you have:

- **Node.js** v16.0.0 or higher ([Download](https://nodejs.org/))
- **npm** v8.0.0 or higher (comes with Node.js)
- **Python** 3.8+ for the backend server
- **Ollama** installed and running with the LLaVA model
- **FastAPI Backend** server configured and running

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-car-analyzer-pro.git
   cd ai-car-analyzer-pro
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_MAX_FILE_SIZE=10485760
REACT_APP_MAX_FILES=10
```

## 🚀 Backend Setup

### Backend Prerequisites

- **Python 3.8+**
- **Ollama** with LLaVA model
- **FastAPI dependencies**

### Backend Installation

1. **Install Ollama**
   ```bash
   # On macOS
   brew install ollama
   
   # On Linux
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Pull the LLaVA model**
   ```bash
   ollama pull llava
   ```

3. **Install Python dependencies**
   ```bash
   cd backend/  # Navigate to your backend directory
   pip install fastapi uvicorn python-multipart ollama
   ```

4. **Start the backend server**
   ```bash
   python main.py
   # Or using uvicorn directly
   uvicorn main:app --host 0.0.0.0 --port 8000 --reload
   ```

### Backend API Endpoints

The FastAPI backend provides these endpoints:

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/` | GET | Serve frontend HTML | None |
| `/analyze` | POST | Single image analysis (legacy) | `file`: Image file |
| `/analyze-multiple` | POST | Multiple images analysis | `files`: List of images, `analysis_focus`: Optional focus |
| `/health` | GET | Backend health check | None |
| `/api-info` | GET | API version and features info | None |

### Analysis Focus Areas

The backend supports different analysis focus areas:

- **`general`**: Comprehensive vehicle analysis (default)
- **`exterior`**: Focus on paint, body, and exterior condition
- **`interior`**: Focus on seats, dashboard, and interior condition  
- **`wheels`**: Focus on tires, rims, and wheel condition

### API Response Examples

**Single Image Analysis Response:**
```json
{
  "characteristics": {
    "vehicle_type": "sedan",
    "brand": "Toyota",
    "model": "Camry",
    "year": "2020",
    "body_condition": "good",
    "paint_condition": "excellent",
    "market_segment": "mid-range"
  },
  "price_estimation": {
    "estimated_price": 25000,
    "estimated_price_range": "$20,000 - $30,000",
    "brand_factor": 1.0,
    "condition_factor": 0.85,
    "factors_explanation": {
      "positive_factors": ["Excellent paint condition"],
      "negative_factors": [],
      "recommendations": ["Consider professional inspection"]
    }
  },
  "analysis_date": "2025-09-04 10:30:00",
  "success": true,
  "message": "Analysis completed successfully"
}
```

**Multiple Images Analysis Response:**
```json
{
  "consolidated_characteristics": {
    "vehicle_type": "sedan",
    "brand": "Toyota", 
    "model": "Camry",
    "overall_condition": "good"
  },
  "price_estimation": {
    "estimated_price": 25000,
    "estimated_price_range": "$20,000 - $30,000"
  },
  "individual_analyses": [
    {
      "image_name": "exterior.jpg",
      "characteristics": {...},
      "confidence_score": 0.85,
      "analysis_notes": "Detailed analysis text..."
    }
  ],
  "analysis_summary": {
    "total_images": 3,
    "overall_confidence": 0.87,
    "analysis_quality": "High",
    "key_findings": ["Vehicle identified as Toyota Camry (2020)"],
    "condition_assessment": {
      "Body Condition": "good",
      "Paint Condition": "excellent"
    },
    "recommendations": []
  },
  "images_processed": 3,
  "success": true,
  "message": "Successfully analyzed 3 images"
}
```

### Backend Configuration

The backend can be configured through environment variables or direct code modification:

```python
# Model configuration
MODEL_NAME = 'llava'  # Ollama model to use

# Analysis limits
MAX_IMAGES_PER_REQUEST = 10
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

# Price estimation factors
BRAND_MULTIPLIERS = {
    'toyota': 1.0,
    'bmw': 1.5,
    'mercedes': 1.6,
    # ... more brands
}
```

## 🛠️ Development

### Available Scripts

- `npm start` - Start development server
- `npm test` - Run test suite
- `npm run build` - Create production build
- `npm run eject` - Eject from Create React App (irreversible)

### Project Structure

```
ai-car-analyzer-pro/
├── frontend/                   # React frontend application
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── App.js
│   ├── package.json
│   └── .env
├── backend/                    # FastAPI backend server
│   ├── main.py                # Main FastAPI application
│   ├── models/                # Pydantic models
│   ├── services/              # Business logic
│   │   └── car_analyzer.py    # AI analysis service
│   ├── requirements.txt       # Python dependencies
│   └── index.html            # Optional frontend serving
├── docker-compose.yml         # Multi-service deployment
├── README.md
└── .gitignore
```

### Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🚀 Deployment

### Production Build

```bash
npm run build
```

This creates a `build/` directory with optimized, production-ready files.

### Deployment Options

- **Netlify**: Connect your repository for automatic deployments
- **Vercel**: Zero-config deployment with Git integration
- **AWS S3**: Static website hosting with CloudFront CDN
- **Docker**: Containerized deployment for any platform

### Docker Deployment

**Full-stack Docker Compose:**

```yaml
version: '3.8'
services:
  frontend:
    build: 
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend

  backend:
    build:
      context: ./backend  
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    volumes:
      - ollama_models:/root/.ollama
    depends_on:
      - ollama

  ollama:
    image: ollama/ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_models:/root/.ollama
    environment:
      - OLLAMA_HOST=0.0.0.0

volumes:
  ollama_models:
```

**Backend Dockerfile:**

```dockerfile
FROM python:3.9-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile:**

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Install serve to run the built app
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]
```

## 📊 Performance

- **Lighthouse Score**: 95+ (Performance, Accessibility, Best Practices, SEO)
- **Bundle Size**: < 500KB gzipped
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s

## 🔒 Security

- Input validation for all file uploads
- File type verification and sanitization
- Rate limiting on API endpoints
- HTTPS enforcement in production
- Content Security Policy headers

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ImageUpload.test.js
```

### Backend Testing

```bash
# Install test dependencies
pip install pytest pytest-asyncio httpx

# Run backend tests
pytest

# Run with coverage
pytest --cov=main --cov-report=html

# Test specific endpoint
pytest -k "test_analyze_single_image"
```

### API Testing

You can test the backend API directly using curl or tools like Postman:

```bash
# Health check
curl -X GET http://localhost:8000/health

# Single image analysis
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/car/image.jpg" \
  http://localhost:8000/analyze

# Multiple images analysis
curl -X POST \
  -H "Content-Type: multipart/form-data" \
  -F "files=@car1.jpg" \
  -F "files=@car2.jpg" \
  -F "analysis_focus=comprehensive" \
  http://localhost:8000/analyze-multiple
```

## 📝 API Documentation

### Interactive API Documentation

The FastAPI backend provides automatic interactive documentation:

- **Swagger UI**: `http://localhost:8000/docs` (recommended)
- **ReDoc**: `http://localhost:8000/redoc` 
- **OpenAPI JSON**: `http://localhost:8000/openapi.json`

### API Features

- **Automatic validation** of request/response data using Pydantic models
- **Built-in error handling** with detailed error messages
- **CORS enabled** for cross-origin requests from the React frontend
- **Rate limiting** protection (configurable)
- **File upload validation** (size limits, format checking)

### Model Information

The backend uses the **Ollama LLaVA model** for image analysis:

- **Model**: `llava` (Large Language and Vision Assistant)
- **Capabilities**: Advanced image understanding and detailed car analysis
- **Focus areas**: General, exterior, interior, and wheel-specific analysis
- **Confidence scoring**: Automatic confidence assessment for each analysis

For detailed API documentation, visit the backend documentation at:
- Development: `http://localhost:8000/docs`
- Production: `https://your-api-domain.com/docs`

## 🤝 Support

- **Frontend Documentation**: [React Documentation](https://reactjs.org/docs)
- **Backend Documentation**: [FastAPI Documentation](https://fastapi.tiangolo.com/)
- **AI Model**: [Ollama LLaVA Documentation](https://ollama.ai/library/llava)
- **Issues**: [GitHub Issues](https://github.com/yourusername/ai-car-analyzer-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/ai-car-analyzer-pro/discussions)

### Troubleshooting

**Common Issues:**

1. **Backend not starting**: Ensure Ollama is installed and the LLaVA model is pulled
   ```bash
   ollama pull llava
   ```

2. **Image analysis failing**: Check if Ollama service is running
   ```bash
   ollama serve
   ```

3. **CORS errors**: Verify the frontend URL is allowed in the backend CORS settings

4. **Large file uploads failing**: Check file size limits (default 10MB per image)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Vite](https://vitejs.dev/) - Build tool and development server
- [FastAPI](https://fastapi.tiangolo.com/) - Backend framework  
- [Ollama](https://ollama.ai/) - Local AI model serving
- [LLaVA](https://llava-vl.github.io/) - Large Language and Vision Assistant model
- [ESLint](https://eslint.org/) - Code quality and formatting
- Contributors and community members

---

**Made by [Yahya YAKHLAF](https://github.com/yourusername)**