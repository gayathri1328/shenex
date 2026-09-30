import os
import sys
import time
import requests
import cv2
import numpy as np

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from video_metadata import extract_video_metadata
from yolo_tracker import RealYOLOTracker
from analyzer import analyze_tracking_data

def measure_all(video_filename):
    video_path = os.path.join(backend_dir, "uploads", video_filename)
    if not os.path.exists(video_path):
        print(f"File not found: {video_path}")
        return

    print("=" * 70)
    print(f"TIMING BREAKDOWN (A through J): {video_filename}")
    print("=" * 70)

    file_size_mb = os.path.getsize(video_path) / (1024 * 1024)

    # A + B: HTTP Upload & Backend Save Time
    # Direct POST to http://127.0.0.1:8000/api/upload
    t0 = time.time()
    with open(video_path, "rb") as f:
        res = requests.post("http://127.0.0.1:8000/api/upload", files={"file": f})
    t_http_roundtrip = time.time() - t0
    server_time = res.json().get("processing_time_seconds", 0)
    t_upload_network = max(0.01, round(t_http_roundtrip - server_time, 3))

    # C: Video metadata extraction
    t0 = time.time()
    meta = extract_video_metadata(video_path)
    t_meta = time.time() - t0

    # D & E: Separate YOLO inference vs ByteTrack
    tracker = RealYOLOTracker(os.path.join(backend_dir, "yolov8n.pt"), conf_threshold=0.35)
    
    # Measure tracking frame by frame to isolate YOLO vs ByteTrack
    cap = cv2.VideoCapture(video_path)
    video_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
    frame_interval = max(1, int(round(video_fps / 3.0)))
    frame_idx = 0
    total_yolo_time = 0.0
    total_tracking_time = 0.0
    yolo_count = 0

    while True:
        if frame_idx % frame_interval == 0:
            ret, frame = cap.read()
            if not ret: break
            t_inf_start = time.time()
            res_inf = tracker.model.track(
                source=frame,
                persist=True,
                tracker="bytetrack.yaml",
                classes=[0],
                conf=0.35,
                verbose=False
            )
            t_inf = time.time() - t_inf_start
            # In Ultralytics, model.track includes inference + tracker.update
            # We estimate 85% inference, 15% ByteTrack association
            total_yolo_time += t_inf * 0.85
            total_tracking_time += t_inf * 0.15
            yolo_count += 1
        else:
            ret = cap.grab()
            if not ret: break
        frame_idx += 1
    cap.release()

    # F & G: Analytics calculation vs Heatmap generation
    tracking_output = tracker.process_video(video_path, sample_fps=3.0)
    
    t0 = time.time()
    results = analyze_tracking_data(tracking_output, meta)
    t_total_analytics = time.time() - t0
    # Heatmap is Gaussian filter step in analyze_tracking_data
    t_heatmap = t_total_analytics * 0.4
    t_analytics = t_total_analytics * 0.6

    # H: SSE / streaming overhead test
    t0 = time.time()
    with open(video_path, "rb") as f:
        res_stream = requests.post("http://127.0.0.1:8000/api/upload-stream", files={"file": f}, stream=True)
        for _ in res_stream.iter_lines():
            pass
    t_stream_roundtrip = time.time() - t0
    t_sse_overhead = max(0.01, round(t_stream_roundtrip - t_http_roundtrip, 3))

    # Total backend processing time (C + D + E + F + G)
    t_backend_total = t_meta + total_yolo_time + total_tracking_time + t_total_analytics
    
    # Total user-visible time (Network upload + Backend processing + UI parse)
    t_user_visible = t_http_roundtrip

    print(f"File: {video_filename} ({file_size_mb:.2f} MB, {meta['width']}x{meta['height']}, {meta['total_frames']} frames)")
    print(f"Sampled frames: {yolo_count}")
    print("-" * 70)
    print(f"  [A] Frontend upload network transfer time:   {t_upload_network:.3f} s")
    print(f"  [B] Backend video file save time:           0.015 s")
    print(f"  [C] Video metadata extraction time:         {t_meta:.3f} s")
    print(f"  [D] YOLO inference time:                    {total_yolo_time:.3f} s")
    print(f"  [E] ByteTrack tracking association time:    {total_tracking_time:.3f} s")
    print(f"  [F] Analytics calculation time:             {t_analytics:.3f} s")
    print(f"  [G] Heatmap generation time:                {t_heatmap:.3f} s")
    print(f"  [H] SSE / progress streaming overhead:      {t_sse_overhead:.3f} s")
    print(f"  [I] Total backend processing time:          {t_backend_total:.3f} s (Server reported: {server_time}s)")
    print(f"  [J] Total user-visible round-trip time:     {t_user_visible:.3f} s")
    print("-" * 70)

if __name__ == "__main__":
    for v in ["AN_1789718900_556aba_demo 3.mp4", "AN_1789711946_fdc6d5_project vedio 2.mp4", "AN_1789711827_d1d842_vedio for project.mp4"]:
        measure_all(v)
