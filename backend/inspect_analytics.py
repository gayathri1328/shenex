import os
import sys
import numpy as np

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from yolo_tracker import RealYOLOTracker
from analyzer import analyze_tracking_data, DEFAULT_ZONES
from video_metadata import extract_video_metadata

videos = [
    "AN_1789711946_fdc6d5_project vedio 2.mp4",
    "AN_1789718900_556aba_demo 3.mp4",
    "AN_1789711827_d1d842_vedio for project.mp4",
]

for v in videos:
    vp = os.path.join(backend_dir, "uploads", v)
    if not os.path.exists(vp):
        continue
    tracker = RealYOLOTracker(os.path.join(backend_dir, "yolov8n.pt"), conf_threshold=0.35)
    # Ensure clean tracker state before each video
    if hasattr(tracker.model, "predictor") and tracker.model.predictor is not None:
        tracker.model.predictor.trackers = None

    out = tracker.process_video(vp, sample_fps=3.0)
    meta = extract_video_metadata(vp)
    res = analyze_tracking_data(out, meta)

    print("=" * 60)
    print(f"VIDEO: {v}")
    print(f"Resolution: {meta['width']}x{meta['height']}, FPS: {meta['fps']}, Total Frames: {meta['total_frames']}")
    print(f"Tracks count: {res['total_unique_tracks']}")
    print(f"Peak Occ: {res['peak_occupancy']} | Avg Occ: {res['average_occupancy']}")
    print(f"Dwell: Avg={res['dwell_time']['average_seconds']}s, Max={res['dwell_time']['max_seconds']}s")
    
    # Calculate coordinate distribution across 4 quadrants:
    # NW: x < 50, y < 50
    # NE: x >= 50, y < 50
    # SW: x < 50, y >= 50
    # SE: x >= 50, y >= 50
    pts = []
    for tid, tr in out["all_tracks"].items():
        for p in tr["history"]:
            pts.append((p[0], p[1]))
    
    total_pts = len(pts)
    if total_pts > 0:
        nw = sum(1 for x, y in pts if x < 50 and y < 50)
        ne = sum(1 for x, y in pts if x >= 50 and y < 50)
        sw = sum(1 for x, y in pts if x < 50 and y >= 50)
        se = sum(1 for x, y in pts if x >= 50 and y >= 50)
        xs = [p[0] for p in pts]
        ys = [p[1] for p in pts]
        print(f"Spatial points: {total_pts} total")
        print(f"  X range: [{min(xs):.1f} .. {max(xs):.1f}], Mean X: {np.mean(xs):.1f}")
        print(f"  Y range: [{min(ys):.1f} .. {max(ys):.1f}], Mean Y: {np.mean(ys):.1f}")
        print(f"  Quadrant breakdown:")
        print(f"    NW: {nw} ({nw*100.0/total_pts:.1f}%)")
        print(f"    NE: {ne} ({ne*100.0/total_pts:.1f}%)")
        print(f"    SW: {sw} ({sw*100.0/total_pts:.1f}%)")
        print(f"    SE: {se} ({se*100.0/total_pts:.1f}%)")

    print("Zones calculated in analyzer.py:")
    for z in res["zones"]:
        print(f"  {z['name']} ({z['id']}): {z['visitors']} visitors, dwellAvg={z['dwellAvg']}s, status={z['status']}")
    print(f"Top Traffic Zone: {res['traffic_analysis']['highest_traffic_zone']}")
    print(f"Lowest Traffic Zone: {res['traffic_analysis']['lowest_traffic_zone']}")

    # Check Heatmap matrix values
    hm = np.array(res["heatmap"])
    print(f"Heatmap shape: {hm.shape}, max: {hm.max():.3f}, non-zero cells: {np.count_nonzero(hm > 0.05)}")
