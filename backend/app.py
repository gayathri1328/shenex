"""
SHENEX Real Computer Vision Backend Service
FastAPI + Ultralytics YOLOv8 + ByteTrack Tracker (PR-02)
"""

from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
import time
import uuid
import os
import sys
import shutil
import json
import queue
import threading

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from video_metadata import extract_video_metadata
from yolo_tracker import RealYOLOTracker
from analyzer import analyze_tracking_data, DEFAULT_ZONES

app = FastAPI(
    title="SHENEX Computer Vision Service (PR-02)",
    description="Real Occupancy & Movement Pattern Analysis powered by Ultralytics YOLOv8",
    version="2.0.0"
)

# Enable CORS for local Vite development frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
TEST_DIR = os.path.join(os.path.dirname(__file__), "test_videos")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(TEST_DIR, exist_ok=True)

# In-memory singleton YOLO model instance
yolo_tracker_instance = None

def get_tracker():
    global yolo_tracker_instance
    if yolo_tracker_instance is None:
        model_path = os.path.join(os.path.dirname(__file__), "yolov8n.pt")
        if not os.path.exists(model_path):
            model_path = "yolov8n.pt"
        yolo_tracker_instance = RealYOLOTracker(model_weights=model_path, conf_threshold=0.35)
    return yolo_tracker_instance

@app.get("/api/health")
def health_check():
    return {
        "status": "online",
        "service": "SHENEX Real Computer Vision Pipeline",
        "model": "Ultralytics YOLOv8n + ByteTrack",
        "person_class_only": True,
        "zero_biometrics": True,
        "version": "2.0.0",
    }

@app.post("/api/upload")
@app.post("/api/analyze")
async def analyze_video(
    file: UploadFile = File(...),
    zones_json: str = Form(None)
):
    """
    Analyzes an uploaded video file using real Ultralytics YOLOv8.
    Generates a unique analysis_id for every execution.
    Never returns hardcoded or cached numbers.
    """
    start_time = time.time()
    analysis_id = f"AN_{int(time.time())}_{uuid.uuid4().hex[:6]}"

    # Save uploaded video to temp storage
    file_extension = os.path.splitext(file.filename)[1] or ".mp4"
    temp_filename = f"{analysis_id}_{file.filename}"
    temp_filepath = os.path.join(UPLOAD_DIR, temp_filename)

    try:
        with open(temp_filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 1. Extract Real Metadata
        metadata = extract_video_metadata(temp_filepath)

        # Parse custom zones if provided
        zones = None
        if zones_json:
            try:
                zones = json.loads(zones_json)
            except Exception:
                zones = None

        # 2. Run Real Ultralytics YOLO + ByteTrack
        tracker = get_tracker()
        tracking_output = tracker.process_video(temp_filepath, sample_fps=3.0)

        # 3. Compute Real Metrics
        results = analyze_tracking_data(tracking_output, metadata, zones=zones)

        processing_time = round(time.time() - start_time, 2)

        # Construct Final Result Object
        payload = {
            "analysis_id": analysis_id,
            "video_metadata": metadata,
            "total_unique_tracks": results["total_unique_tracks"],
            "peak_occupancy": results["peak_occupancy"],
            "average_occupancy": results["average_occupancy"],
            "occupancy_timeline": results["occupancy_timeline"],
            "dwell_time": results["dwell_time"],
            "zones": results["zones"],
            "trajectories": results["trajectories"],
            "heatmap": results["heatmap"],
            "traffic_analysis": results["traffic_analysis"],
            "insights": results["insights"],
            "processing_time_seconds": processing_time,
            "model_information": results["model_information"],
        }

        return payload

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Computer Vision analysis failed: {str(e)}")


@app.post("/api/upload-stream")
async def analyze_video_stream(
    file: UploadFile = File(...),
    zones_json: str = Form(None)
):
    """
    Streams real-time frame-by-frame progress and returns the final analysis payload.
    Prevents frontend from stalling at 60%.
    """
    start_time = time.time()
    analysis_id = f"AN_{int(time.time())}_{uuid.uuid4().hex[:6]}"

    temp_filename = f"{analysis_id}_{file.filename}"
    temp_filepath = os.path.join(UPLOAD_DIR, temp_filename)

    with open(temp_filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    zones = None
    if zones_json:
        try:
            zones = json.loads(zones_json)
        except Exception:
            zones = None

    def event_stream():
        q = queue.Queue()

        def worker():
            try:
                def on_progress(pct, stage, cur=0, tot=0):
                    q.put({
                        "type": "progress",
                        "stageIndex": 2 if pct < 30 else 3 if pct < 85 else 4,
                        "percent": pct,
                        "progressPercent": pct,
                        "stage": stage,
                        "current": cur,
                        "total": tot
                    })

                on_progress(5, "Reading video & extracting metadata...")
                metadata = extract_video_metadata(temp_filepath)

                on_progress(10, "Detecting people & tracking with ByteTrack...")
                tracker = get_tracker()
                tracking_output = tracker.process_video(temp_filepath, sample_fps=3.0, progress_callback=on_progress)

                on_progress(90, "Calculating occupancy & dwell integrals...")
                results = analyze_tracking_data(tracking_output, metadata, zones=zones)

                on_progress(96, "Generating spatial heatmap & density zones...")
                processing_time = round(time.time() - start_time, 2)

                payload = {
                    "analysis_id": analysis_id,
                    "video_metadata": metadata,
                    "total_unique_tracks": results["total_unique_tracks"],
                    "peak_occupancy": results["peak_occupancy"],
                    "average_occupancy": results["average_occupancy"],
                    "occupancy_timeline": results["occupancy_timeline"],
                    "dwell_time": results["dwell_time"],
                    "zones": results["zones"],
                    "trajectories": results["trajectories"],
                    "heatmap": results["heatmap"],
                    "traffic_analysis": results["traffic_analysis"],
                    "insights": results["insights"],
                    "processing_time_seconds": processing_time,
                    "model_information": results["model_information"],
                }

                q.put({
                    "type": "complete",
                    "stageIndex": 7,
                    "percent": 100,
                    "progressPercent": 100,
                    "stage": "Analysis complete!",
                    "payload": payload
                })
            except Exception as exc:
                q.put({"type": "error", "message": str(exc)})
            finally:
                q.put(None)

        threading.Thread(target=worker, daemon=True).start()

        while True:
            item = q.get()
            if item is None:
                break
            yield json.dumps(item) + "\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@app.post("/api/analyze-scenario")
def analyze_scenario(scenario_id: str):
    """
    Executes real YOLO analysis on one of the 3 generated test scenario videos.
    """
    scenario_files = {
        "test_a": "test_video_1person.mp4",
        "test_b": "test_video_3people.mp4",
        "test_c": "test_video_dwell.mp4",
    }

    if scenario_id not in scenario_files:
        raise HTTPException(status_code=400, detail="Invalid scenario ID. Choose test_a, test_b, or test_c.")

    filename = scenario_files[scenario_id]
    filepath = os.path.join(TEST_DIR, filename)

    if not os.path.exists(filepath):
        from generate_test_scenarios import generate_video_a, generate_video_b, generate_video_c
        if scenario_id == "test_a":
            generate_video_a(filepath)
        elif scenario_id == "test_b":
            generate_video_b(filepath)
        elif scenario_id == "test_c":
            generate_video_c(filepath)

    start_time = time.time()
    analysis_id = f"AN_TEST_{scenario_id.upper()}_{int(time.time())}"

    metadata = extract_video_metadata(filepath)
    tracker = get_tracker()
    tracking_output = tracker.process_video(filepath, sample_fps=3.0)
    results = analyze_tracking_data(tracking_output, metadata)
    processing_time = round(time.time() - start_time, 2)

    return {
        "analysis_id": analysis_id,
        "scenario_name": scenario_id.upper(),
        "video_metadata": metadata,
        "total_unique_tracks": results["total_unique_tracks"],
        "peak_occupancy": results["peak_occupancy"],
        "average_occupancy": results["average_occupancy"],
        "occupancy_timeline": results["occupancy_timeline"],
        "dwell_time": results["dwell_time"],
        "zones": results["zones"],
        "trajectories": results["trajectories"],
        "heatmap": results["heatmap"],
        "traffic_analysis": results["traffic_analysis"],
        "insights": results["insights"],
        "processing_time_seconds": processing_time,
        "model_information": results["model_information"],
    }


@app.post("/api/analyze-scenario-stream")
def analyze_scenario_stream(scenario_id: str):
    """
    Streams real-time frame progress for test scenarios.
    """
    scenario_files = {
        "test_a": "test_video_1person.mp4",
        "test_b": "test_video_3people.mp4",
        "test_c": "test_video_dwell.mp4",
    }

    if scenario_id not in scenario_files:
        raise HTTPException(status_code=400, detail="Invalid scenario ID. Choose test_a, test_b, or test_c.")

    filename = scenario_files[scenario_id]
    filepath = os.path.join(TEST_DIR, filename)

    if not os.path.exists(filepath):
        from generate_test_scenarios import generate_video_a, generate_video_b, generate_video_c
        if scenario_id == "test_a":
            generate_video_a(filepath)
        elif scenario_id == "test_b":
            generate_video_b(filepath)
        elif scenario_id == "test_c":
            generate_video_c(filepath)

    start_time = time.time()
    analysis_id = f"AN_TEST_{scenario_id.upper()}_{int(time.time())}"

    def event_stream():
        q = queue.Queue()

        def worker():
            try:
                def on_progress(pct, stage, cur=0, tot=0):
                    q.put({
                        "type": "progress",
                        "stageIndex": 2 if pct < 30 else 3 if pct < 85 else 4,
                        "percent": pct,
                        "progressPercent": pct,
                        "stage": stage,
                        "current": cur,
                        "total": tot
                    })

                on_progress(5, f"Loading verified test scenario: {scenario_id.upper()}...")
                metadata = extract_video_metadata(filepath)

                on_progress(10, "Detecting people & tracking with ByteTrack...")
                tracker = get_tracker()
                tracking_output = tracker.process_video(filepath, sample_fps=3.0, progress_callback=on_progress)

                on_progress(90, "Calculating occupancy & dwell integrals...")
                results = analyze_tracking_data(tracking_output, metadata)

                on_progress(96, "Generating spatial heatmap & density zones...")
                processing_time = round(time.time() - start_time, 2)

                payload = {
                    "analysis_id": analysis_id,
                    "scenario_name": scenario_id.upper(),
                    "video_metadata": metadata,
                    "total_unique_tracks": results["total_unique_tracks"],
                    "peak_occupancy": results["peak_occupancy"],
                    "average_occupancy": results["average_occupancy"],
                    "occupancy_timeline": results["occupancy_timeline"],
                    "dwell_time": results["dwell_time"],
                    "zones": results["zones"],
                    "trajectories": results["trajectories"],
                    "heatmap": results["heatmap"],
                    "traffic_analysis": results["traffic_analysis"],
                    "insights": results["insights"],
                    "processing_time_seconds": processing_time,
                    "model_information": results["model_information"],
                }

                q.put({
                    "type": "complete",
                    "stageIndex": 7,
                    "percent": 100,
                    "progressPercent": 100,
                    "stage": "Analysis complete!",
                    "payload": payload
                })
            except Exception as exc:
                q.put({"type": "error", "message": str(exc)})
            finally:
                q.put(None)

        threading.Thread(target=worker, daemon=True).start()

        while True:
            item = q.get()
            if item is None:
                break
            yield json.dumps(item) + "\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


# Optional: Serve built frontend if dist/ directory exists
dist_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "dist"))
if os.path.exists(dist_dir):
    from fastapi.staticfiles import StaticFiles
    from fastapi.responses import FileResponse
    assets_dir = os.path.join(dist_dir, "assets")
    if os.path.exists(assets_dir):
        app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if full_path.startswith("api"):
            raise HTTPException(status_code=404, detail="API route not found")
        candidate_file = os.path.join(dist_dir, full_path)
        if os.path.isfile(candidate_file):
            return FileResponse(candidate_file)
        index_file = os.path.join(dist_dir, "index.html")
        if os.path.isfile(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="File not found")

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
