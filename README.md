# Pakistan Smog Density Heatmap 🌫️🗺️

## 🌟 Features

### Interactive Visualization
- Color-gradient heatmap (blue = low, red = extreme smog)
- Dynamic intensity rendering based on real-time data
- Customizable radius and blur effects for optimal display

### Location Comparison
- Compare smog levels between any two geographic points
- Visual markers with popup details
- Normalized data representation (0-100% scale)

### Technical Features
- React frontend with Leaflet mapping
- Flask backend API serving AQI data
- Responsive design for all devices
- Easy-to-use coordinate input system

## 🛠️ Tech Stack

**Frontend**:
- React.js (v18+)
- Leaflet (v1.9+) with leaflet.heat plugin
- HTML5/CSS3 (Flexbox/Grid layout)

**Backend**:
- Python (v3.8+)
- Flask (v2.0+)
- Flask-CORS for cross-origin support

**Data Processing**:
- Real-time AQI/smog data normalization
- Geographic coordinate validation
- Dynamic heatmap intensity calculation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)
- Git

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/VE-Vaniya/HeatMap.git
   cd pakistan-smog-heatmap
    cd frontend
    npm install
    cd ../backend
    python -m venv venv
# Linux/Mac:
    source venv/bin/activate
# Windows:
    .\venv\Scripts\activate
    pip install -r requirements.txt
    flask run
