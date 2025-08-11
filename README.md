# Pakistan Smog Density Heatmap 🌫️🗺️

![Heatmap Visualization](screenshot.png) <!-- Add your screenshot path here -->

A React + Leaflet application that visualizes smog density across Pakistan using interactive heatmaps, powered by Flask backend data.

## 🌟 Features

- **Interactive Heatmap Visualization**
  - Color-coded smog density (blue → red gradient)
  - Dynamic intensity rendering
  - Customizable radius and blur effects

- **Location Comparison**
  - Compare smog levels between two geographic points
  - Side-by-side marker visualization
  - Normalized data representation (0-100% scale)

- **Technical Implementation**
  - React frontend with Leaflet maps
  - Leaflet.heat plugin for performant heatmaps
  - Flask backend API for AQI data
  - Responsive design for all screen sizes

## 🛠️ Tech Stack

**Frontend**:
- React.js
- Leaflet (with leaflet.heat plugin)
- HTML5/CSS3

**Backend**:
- Python Flask
- REST API endpoints

**Data**:
- Real-time AQI/smog data
- Geographic coordinate processing

## 🚀 Installation

### Frontend Setup
```bash
# Clone repository
git clone https://github.com/yourusername/pakistan-smog-heatmap.git
cd pakistan-smog-heatmap/frontend

# Install dependencies
npm install

# Start development server
npm start
