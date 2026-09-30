import os
import sys
import numpy as np

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from yolo_tracker import RealYOLOTracker
from analyzer import analyze_tracking_data
from video_metadata import extract_video_metadata

def run_tests():
    v1_path = os.path.join(backend_dir, "uploads", "AN_1789718900_556aba_demo 3.mp4")
    v2_path = os.path.join(backend_dir, "uploads", "AN_1789711946_fdc6d5_project vedio 2.mp4")

    print("=" * 60)
    print("TESTING TRACKER SINGLETON & CONSECUTIVE RUNS")
    print("=" * 60)

    tracker = RealYOLOTracker(os.path.join(backend_dir, "yolov8n.pt"), conf_threshold=0.35)

    # 1. Process Video 1
    m1 = extract_video_metadata(v1_path)
    out1 = tracker.process_video(v1_path, sample_fps=3.0)
    res1 = analyze_tracking_data(out1, m1)
    tids1 = list(out1["all_tracks"].keys())

    print(f"Video 1 ({m1['filename']}):")
    print(f"  Tracks: {len(tids1)} (min ID: {min(tids1)}, max ID: {max(tids1)})")
    print(f"  Peak Occ: {res1['peak_occupancy']} | Avg Occ: {res1['average_occupancy']}")
    print(f"  Avg Dwell: {res1['dwell_time']['average_seconds']}s (from {res1['dwell_time']['confirmed_tracks_count']} confirmed tracks)")
    print(f"  Top Zone: {res1['traffic_analysis']['highest_traffic_zone']} ({res1['traffic_analysis']['highest_traffic_density_pct']}%)")
    print(f"  Explanation: {res1['traffic_analysis']['explanation']}")

    # 2. Process Video 2 on the SAME tracker instance
    m2 = extract_video_metadata(v2_path)
    out2 = tracker.process_video(v2_path, sample_fps=3.0)
    res2 = analyze_tracking_data(out2, m2)
    tids2 = list(out2["all_tracks"].keys())

    print("-" * 60)
    print(f"Video 2 ({m2['filename']}) [Same tracker instance]:")
    print(f"  Tracks: {len(tids2)} (min ID: {min(tids2)}, max ID: {max(tids2)})")
    print(f"  Peak Occ: {res2['peak_occupancy']} | Avg Occ: {res2['average_occupancy']}")
    print(f"  Avg Dwell: {res2['dwell_time']['average_seconds']}s (from {res2['dwell_time']['confirmed_tracks_count']} confirmed tracks)")
    print(f"  Top Zone: {res2['traffic_analysis']['highest_traffic_zone']} ({res2['traffic_analysis']['highest_traffic_density_pct']}%)")
    print(f"  Explanation: {res2['traffic_analysis']['explanation']}")

    # Check whether tracker state reset succeeded
    print("=" * 60)
    print("VALIDATION CHECKS:")
    reset_passed = (min(tids2) <= 2) # started fresh from 1
    print(f"  [1] ByteTrack Reset Check: {'PASSED' if reset_passed else 'FAILED'} (V2 started at fresh ID #{min(tids2)})")

    occ_only_positive = all(item["occupancy"] == len([t for t in item["active_tracks"] if t["track_id"] > 0]) for item in out2["raw_detections"])
    print(f"  [2] Occupancy strictly track_id > 0: {'PASSED' if occ_only_positive else 'FAILED'}")

    different_occupancy = res1["peak_occupancy"] != res2["peak_occupancy"] or res1["average_occupancy"] != res2["average_occupancy"]
    print(f"  [3] Occupancy differs between videos: {'PASSED' if different_occupancy else 'FAILED'} (V1: {res1['peak_occupancy']}/{res1['average_occupancy']} vs V2: {res2['peak_occupancy']}/{res2['average_occupancy']})")

    different_dwell = res1["dwell_time"]["average_seconds"] != res2["dwell_time"]["average_seconds"]
    print(f"  [4] Dwell time differs between videos: {'PASSED' if different_dwell else 'FAILED'} (V1: {res1['dwell_time']['average_seconds']}s vs V2: {res2['dwell_time']['average_seconds']}s)")

    hm1 = np.array(res1["heatmap"])
    hm2 = np.array(res2["heatmap"])
    different_heatmap = not np.allclose(hm1, hm2)
    print(f"  [5] Heatmap differs between videos: {'PASSED' if different_heatmap else 'FAILED'}")

if __name__ == "__main__":
    run_tests()
