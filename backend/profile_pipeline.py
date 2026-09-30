import time
import os
import sys
import cv2

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from video_metadata import extract_video_metadata
from yolo_tracker import RealYOLOTracker
from analyzer import analyze_tracking_data

def profile():
    video_dir = os.path.join(os.path.dirname(__file__), "uploads")
    candidates = [
        "AN_1789711946_fdc6d5_project vedio 2.mp4",
        "AN_1789718900_556aba_demo 3.mp4",
        "AN_1789711827_d1d842_vedio for project.mp4",
    ]
    tracker = RealYOLOTracker(os.path.join(os.path.dirname(__file__), "yolov8n.pt"), conf_threshold=0.35)

    for c in candidates:
        target = os.path.join(video_dir, c)
        if not os.path.exists(target):
            continue
        print("=" * 60)
        print(f"Profiling video: {c}")
        t_start = time.time()
        meta = extract_video_metadata(target)
        t_meta = time.time() - t_start

        t0 = time.time()
        tracking_output = tracker.process_video(target, sample_fps=3.0)
        t_track = time.time() - t0

        t0 = time.time()
        results = analyze_tracking_data(tracking_output, meta)
        t_analyze = time.time() - t0
        total_time = time.time() - t_start

        print(f"Res: {meta['width']}x{meta['height']}, FPS: {meta['fps']}, Total Frames: {meta['total_frames']}")
        print(f"Metadata: {t_meta:.3f}s | Tracking ({tracking_output['processed_frame_count']} frames): {t_track:.3f}s | Analytics: {t_analyze:.3f}s | TOTAL: {total_time:.3f}s")
        print(f"Unique tracks: {results['total_unique_tracks']} | Peak occ: {results['peak_occupancy']} | Avg occ: {results['average_occupancy']} | Avg dwell: {results['dwell_time']['average_seconds']}s")
        print(f"Top traffic zone: {results['traffic_analysis']['highest_traffic_zone']}")

    print("=" * 50)
    print(f"Total unique tracks: {results['total_unique_tracks']}")
    print(f"Peak occupancy:      {results['peak_occupancy']}")
    print(f"Average occupancy:   {results['average_occupancy']}")
    print(f"Average dwell (s):   {results['dwell_time']['average_seconds']}")
    print(f"Trajectories count:  {len(results['trajectories'])}")
    print(f"Highest traffic zone:{results['traffic_analysis']['highest_traffic_zone']}")

if __name__ == "__main__":
    profile()
