import os
import sys
import time
import json
import queue
import threading

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from video_metadata import extract_video_metadata
from yolo_tracker import RealYOLOTracker
from analyzer import analyze_tracking_data

def benchmark_video(video_filename):
    video_path = os.path.join(backend_dir, "uploads", video_filename)
    if not os.path.exists(video_path):
        print(f"File not found: {video_path}")
        return

    print("=" * 65)
    print(f"DETAILED BENCHMARK: {video_filename}")
    print("=" * 65)

    file_size_mb = round(os.path.getsize(video_path) / (1024 * 1024), 2)
    print(f"File Size: {file_size_mb} MB")

    # Step B: Disk read/write copy time simulation (upload save)
    t0 = time.time()
    dest_temp = os.path.join(backend_dir, "uploads", f"temp_bench_{video_filename}")
    with open(video_path, "rb") as f_in, open(dest_temp, "wb") as f_out:
        f_out.write(f_in.read())
    t_save = time.time() - t0
    if os.path.exists(dest_temp):
        os.remove(dest_temp)

    # Step C: Metadata extraction
    t0 = time.time()
    meta = extract_video_metadata(video_path)
    t_meta = time.time() - t0

    # Step D & E: YOLO + ByteTrack
    tracker = RealYOLOTracker(os.path.join(backend_dir, "yolov8n.pt"), conf_threshold=0.35)
    
    # Measure tracking with progress callback vs without
    progress_events = []
    def on_progress(pct, stage, cur=0, tot=0):
        progress_events.append((time.time(), pct, stage))

    t0 = time.time()
    tracking_output = tracker.process_video(video_path, sample_fps=3.0, progress_callback=on_progress)
    t_track = time.time() - t0

    # Step F & G: Analytics & Heatmap calculation
    t0 = time.time()
    results = analyze_tracking_data(tracking_output, meta)
    t_analytics = time.time() - t0

    # Step H: SSE Queue serialization overhead
    t0 = time.time()
    payload = {
        "video_metadata": meta,
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
    }
    serialized = json.dumps(payload)
    t_serialize = time.time() - t0

    total_time = t_save + t_meta + t_track + t_analytics + t_serialize

    print(f"Resolution: {meta['width']}x{meta['height']}, FPS: {meta['fps']}, Total Frames: {meta['total_frames']}")
    print(f"Sampled frames: {tracking_output['processed_frame_count']}")
    print("-" * 65)
    print(f"  [B] Backend file save/copy time:      {t_save:.3f} s")
    print(f"  [C] Metadata extraction time:        {t_meta:.3f} s")
    print(f"  [D+E] YOLO inference + ByteTrack:     {t_track:.3f} s")
    print(f"  [F+G] Analytics + Heatmap generation: {t_analytics:.3f} s")
    print(f"  [H] JSON Serialization overhead:     {t_serialize:.3f} s (payload: {len(serialized)//1024} KB)")
    print(f"  [I] Total backend processing time:   {total_time:.3f} s")
    print("-" * 65)
    print(f"Progress callbacks count: {len(progress_events)}")
    print(f"Unique tracks: {results['total_unique_tracks']} | Peak occ: {results['peak_occupancy']} | Avg occ: {results['average_occupancy']}")
    print(f"Top traffic zone: {results['traffic_analysis']['highest_traffic_zone']}")

if __name__ == "__main__":
    for v in ["AN_1789718900_556aba_demo 3.mp4", "AN_1789711946_fdc6d5_project vedio 2.mp4", "AN_1789711827_d1d842_vedio for project.mp4"]:
        benchmark_video(v)
