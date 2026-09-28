# SHENEX ✦ Spatial Intelligence Platform
> **"See the Space. Understand the Movement."**  
> *AI-Powered Occupancy & Movement Pattern Analysis for 360° Indoor Spaces*  
> **Hackathon Problem:** PR-02 — Intelligent Occupancy Pattern Analysis

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-6C4AB6?style=for-the-badge&logo=vercel&logoColor=white)](https://temporary-sonic-harp-ey7i9eg.vercel.app)
[![Deployment Guide](https://img.shields.io/badge/Deployment-Render_+_Vercel-4ECCA3?style=for-the-badge&logo=render&logoColor=white)](DEPLOYMENT.md)
[![Model](https://img.shields.io/badge/Model-Ultralytics_YOLOv8n-8D68DC?style=for-the-badge&logo=python&logoColor=white)](backend/)

---

## 🌟 Overview & Product Vision
**SHENEX** is a spatial computer vision platform that analyzes 360° omnidirectional and fisheye surveillance footage to recognize human occupancy and movement patterns in indoor spaces. 

Rather than looking like a generic cold surveillance system, SHENEX marries:
- **Premium AI SaaS design**: Soft plum, royal purple, lavender, warm cream, and mint aesthetic.
- **Bespoke Hand-Drawn Cute Doodle System**: Contextual SVG illustrations representing cameras, eyes, movement trails, dwell clocks, heatmaps, and spatial AI.
- **Privacy-by-Design Architecture**: **100% Anonymous Centroid Tracking**. Strictly zero facial recognition, zero demographic inference, and zero biometric storage.
- **Dual Engine Architecture**: Client-side high-fidelity simulation engine with 3 preloaded 360° space presets, paired with a modular Python FastAPI backend.

---

## 🚀 Key Features (PR-02 Requirements)

1. **👥 Occupancy Intelligence**
   - Headcount analysis across observation periods.
   - Peak hour saturation tracking and capacity compliance monitoring.

2. **🗺️ 2D Spatial Heatmaps**
   - Gaussian Kernel Density Estimation (KDE) on unwrapped 2D floorplans.
   - Dynamic palette switcher (Soft Plum/Amber or Thermal Fire).

3. **👣 Movement Patterns & Vectors**
   - Trajectory reconstruction linking anonymous tracks across frames.
   - Directional vector fields and origin-to-destination transition Markov flows.

4. **⏱️ Dwell Time Estimation**
   - Exact temporal dwell time integrals: $\text{Dwell} = \sum (t_{\text{in\_zone}} \cdot \Delta t)$.
   - Classification of fast transit vs lingering engagement.

5. **🚦 Traffic Zones**
   - High-traffic vs low-traffic automated zone classification.
   - Turnover velocity and circulation friction scoring.

6. **🧠 AI Spatial Insights**
   - Automated plain-English spatial architectural recommendations.
   - Bottleneck warnings and dead-zone mitigation strategies.
   - One-click exportable spatial audit reports (`.json`).

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework**: Vite + React 18
- **Styling**: Vanilla CSS design system with custom CSS variables and glassmorphic elevations
- **Visuals & Doodles**: Bespoke SVG Doodle Component Library (`DoodleEye`, `DoodleCamera`, `DoodleCCTV`, `DoodleFootprints`, `DoodleClock`, `DoodleHeatmap`, `DoodleBrain`, `DoodleRadar`, `DoodleZone`, `DoodleSparkle`, `DoodleArrow`)
- **Canvas Engine**: HTML5 2D Canvas rendering Gaussian density distributions and motion trails

### Backend CV Service
- **Framework**: Python 3.10+ / FastAPI / Uvicorn
- **Computer Vision**: OpenCV (`opencv-python-headless`), NumPy, SciPy
- **Algorithms**:
  - Spherical equirectangular unwrapping
  - Centroid foot-contact ground plane projection
  - Ray-casting point-in-polygon zone indexing
  - 2D Gaussian KDE smoothing matrix

---

## 💻 Quick Start & Running Locally

### 1. Frontend Application
```bash
# Install dependencies
npm install

# Run local development server
npm run dev
```
Open your browser at `http://localhost:5173`.

### 2. Python Computer Vision Backend (Optional)
```bash
cd backend
pip install -r requirements.txt
python app.py
```
The FastAPI backend will start at `http://127.0.0.1:8000`.

---

## 📁 Project Structure

```
sheNex/
├── index.html                  # HTML entry with Plus Jakarta Sans & Outfit fonts
├── vite.config.js              # Vite config with proxy to FastAPI
├── package.json                # React 18, Lucide, Vite
├── README.md                   # Project documentation
├── backend/
│   ├── app.py                  # FastAPI REST endpoints
│   ├── preprocessor.py         # 360° equirectangular unwrapping & ground homography
│   ├── detector.py             # Privacy-preserving person detector
│   ├── tracker.py              # Anonymous multi-object spatial tracker
│   ├── spatial_analyzer.py     # Dwell time integrals & Gaussian KDE heatmaps
│   └── requirements.txt        # Python backend dependencies
└── src/
    ├── main.jsx                # React root mount
    ├── App.jsx                 # Master application router & state controller
    ├── index.css               # Design system, brand palette, and animations
    ├── components/
    │   ├── Navigation.jsx      # Header with doodle logo & responsive links
    │   ├── Footer.jsx          # Plum footer with privacy pledge
    │   ├── HeroVisualization.jsx # Floating interactive hero floorplan visualizer
    │   ├── FloorplanViewer.jsx # Interactive 2D canvas with heatmap & flow layers
    │   ├── TimeSlider.jsx      # Chronological timeline scrubbing controller
    │   ├── StatCard.jsx        # Reusable metric card with doodle accents
    │   └── doodles/            # Complete hand-drawn cute doodle library
    ├── pages/
    │   ├── LandingPage.jsx     # Landing page with hero visual & 6 feature cards
    │   ├── FeaturesPage.jsx    # Deep dive into the 6 PR-02 requirements
    │   ├── HowItWorksPage.jsx  # Technical 6-stage CV pipeline breakdown
    │   ├── PrivacyPage.jsx     # Privacy-first architecture (zero facial recognition)
    │   ├── UploadPage.jsx      # Video dropzone + 3 curated 360° indoor presets
    │   ├── ProcessingPage.jsx  # Real-time scanning visualizer with 7-stage checklist
    │   ├── DashboardPage.jsx   # Master spatial intelligence dashboard
    │   ├── ZoneAnalysisPage.jsx# Zone breakdown, dwell time bars, and traffic status
    │   ├── MovementPage.jsx    # Transition flow Markov chains & speed analysis
    │   ├── InsightsPage.jsx    # AI spatial recommendations & report export
    │   └── NotFoundPage.jsx    # 404 state with cute doodle eye
    ├── data/
    │   └── demoPresets.js      # 3 Rich indoor 360° datasets with trajectories & zones
    └── services/
        ├── cvSimulationEngine.js # Client-side real-time spatial simulation engine
        └── apiService.js       # API client communicating with FastAPI backend
```

---

## 🔒 Privacy & Ethical AI Guarantee
- **Strictly No Facial Recognition**: Algorithms compute bounding box centroids only.
- **Anonymous Session Tokens**: Every person is assigned a temporary token (`#001`, `#002`) that expires upon exit.
- **No Biometric Storage**: Frames are analyzed in memory and discarded. Zero facial embeddings or demographic profiles.
