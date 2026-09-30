import os
import sys
import time
import json
import cv2
import requests
import numpy as np

backend_dir = os.path.dirname(os.path.abspath(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from video_metadata import extract_video_metadata
from yolo_tracker import RealYOLOTracker
from analyzer import analyze_tracking_data

def run_measurement():
    video_files = [
        "AN_1789718900_556aba_demo 3.mp4",
        "AN_1789711946_fdc6d5_project vedio 2.mp4",
        "AN_1789711827_d1d842_vedio for project.mp4",
    ]

    tracker = RealYOLOTracker(os.path.join(backend_dir, "yolov8n.pt"), conf_threshold=0.35)

    all_results = {}

    for idx, vf in enumerate(video_files, 1):
        vpath = os.path.join(backend_dir, "uploads", vf)
        if not os.path.exists(vpath):
            print(f"Skipping {vf}, not found.")
            continue

        print(f"\n=======================================================")
        print(f"MEASURING VIDEO {idx}: {vf}")
        print(f"=======================================================")

        # [B] Backend video upload/save time measurement
        t0 = time.time()
        temp_dest = os.path.join(backend_dir, "uploads", f"temp_measure_{vf}")
        with open(vpath, "rb") as src, open(temp_dest, "wb") as dst:
            dst.write(src.read())
        t_b_save = time.time() - t0
        if os.path.exists(temp_dest):
            os.remove(temp_dest)

        # [C] Video metadata extraction time
        t0 = time.time()
        meta = extract_video_metadata(vpath)
        t_c_meta = time.time() - t0

        # [D] YOLO inference & [E] ByteTrack tracking separation
        cap = cv2.VideoCapture(vpath)
        fps = float(cap.get(cv2.CAP_PROP_FPS) or 30.0)
        interval = max(1, int(round(fps / 3.0)))
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

        frame_idx = 0
        total_d_yolo = 0.0
        total_e_bytetrack = 0.0
        sampled_count = 0

        tracker.reset_tracker()

        while True:
            if frame_idx % interval == 0:
                ret, frame = cap.read()
                if not ret: break
                
                # Measure pure YOLO inference (predict)
                t_yolo_start = time.time()
                preds = tracker.model.predict(
                    source=frame,
                    classes=[0],
                    conf=0.35,
                    verbose=False
                )
                t_d = time.time() - t_yolo_start
                total_d_yolo += t_d

                # Measure pure tracking association
                t_track_start = time.time()
                res = tracker.model.track(
                    source=frame,
                    persist=True,
                    tracker="bytetrack.yaml",
                    classes=[0],
                    conf=0.35,
                    verbose=False
                )
                t_track_full = time.time() - t_track_start
                # The difference is the tracking update overhead
                t_e = max(0.001, t_track_full - t_d)
                total_e_bytetrack += t_e

                sampled_count += 1
            else:
                ret = cap.grab()
                if not ret: break
            frame_idx += 1
        cap.release()

        # Run process_video to get clean tracking output for analytics
        t_track_full_start = time.time()
        tracking_output = tracker.process_video(vpath, sample_fps=3.0)
        t_track_pipeline = time.time() - t_track_full_start

        # [F] Analytics calculation & [G] Heatmap generation
        # Let's measure heatmap separately from analytics
        t0 = time.time()
        res_analytics = analyze_tracking_data(tracking_output, meta)
        t_f_plus_g = time.time() - t0

        # Measure heatmap matrix computation isolated
        t0 = time.time()
        grid_res = 50
        hm_grid = np.zeros((grid_res, grid_res), dtype=np.float32)
        for t_rec in tracking_output["raw_detections"]:
            for trk in t_rec["active_tracks"]:
                gx = min(grid_res - 1, max(0, int((trk["cx"] / 100.0) * grid_res)))
                gy = min(grid_res - 1, max(0, int((trk["cy"] / 100.0) * grid_res)))
                hm_grid[gy, gx] += 1.0
        from scipy.ndimage import gaussian_filter
        hm_grid = gaussian_filter(hm_grid, sigma=1.8)
        max_val = hm_grid.max()
        if max_val > 0: hm_grid = hm_grid / max_val
        _ = hm_grid.round(3).tolist()
        t_g_heatmap = time.time() - t0
        t_f_analytics = max(0.001, t_f_plus_g - t_g_heatmap)

        # [I] Total backend processing time (in-process)
        t_i_backend = t_c_meta + total_d_yolo + total_e_bytetrack + t_f_analytics + t_g_heatmap

        # [A], [H], and [J]: Measure via HTTP to localhost:8000
        # 1. Non-streaming endpoint /api/upload
        t0 = time.time()
        with open(vpath, "rb") as f:
            res_upload = requests.post("http://127.0.0.1:8000/api/upload", files={"file": f})
        t_upload_roundtrip = time.time() - t0
        server_reported = res_upload.json().get("processing_time_seconds", t_i_backend)

        # [A] Network transfer / serialization overhead:
        t_a_upload = max(0.01, round(t_upload_roundtrip - server_reported, 3))

        # 2. Streaming endpoint /api/upload-stream
        t0 = time.time()
        chunk_count = 0
        with open(vpath, "rb") as f:
            res_stream = requests.post("http://127.0.0.1:8000/api/upload-stream", files={"file": f}, stream=True)
            for line in res_stream.iter_lines():
                if line: chunk_count += 1
        t_stream_roundtrip = time.time() - t0

        # [H] SSE / progress streaming overhead
        t_h_sse = max(0.001, round(t_stream_roundtrip - t_upload_roundtrip, 3))

        # [J] Total user-visible time (from clicking upload until result arrives via SSE stream)
        t_j_user_visible = round(t_stream_roundtrip, 3)

        result_row = {
            "file": vf,
            "size_mb": meta["file_size_mb"],
            "resolution": f"{meta['width']}x{meta['height']}",
            "total_frames": meta["total_frames"],
            "sampled_frames": sampled_count,
            "A_frontend_upload_s": t_a_upload,
            "B_backend_save_s": round(t_b_save, 3),
            "C_metadata_s": round(t_c_meta, 3),
            "D_yolo_inference_s": round(total_d_yolo, 3),
            "E_bytetrack_s": round(total_e_bytetrack, 3),
            "F_analytics_s": round(t_f_analytics, 3),
            "G_heatmap_s": round(t_g_heatmap, 3),
            "H_sse_overhead_s": t_h_sse,
            "I_backend_total_s": round(t_i_backend, 3),
            "I_server_reported_s": server_reported,
            "J_user_visible_s": t_j_user_visible,
            "stream_chunks": chunk_count,
        }
        all_results[f"Video_{idx}"] = result_row

        print(f"Results for Video {idx}:")
        print(f"  [A] Frontend upload network time:       {t_a_upload:.3f} s")
        print(f"  [B] Backend video file save time:       {t_b_save:.3f} s")
        print(f"  [C] Video metadata extraction time:     {t_c_meta:.3f} s")
        print(f"  [D] YOLO inference time:                {total_d_yolo:.3f} s")
        print(f"  [E] ByteTrack tracking time:            {total_e_bytetrack:.3f} s")
        print(f"  [F] Analytics calculation time:         {t_f_analytics:.3f} s")
        print(f"  [G] Heatmap generation time:            {t_g_heatmap:.3f} s")
        print(f"  [H] SSE / progress streaming overhead:  {t_h_sse:.3f} s")
        print(f"  [I] Total backend processing time:      {t_i_backend:.3f} s (Server reported: {server_reported} s)")
        print(f"  [J] Total user-visible round-trip time: {t_j_user_visible:.3f} s")

    with open(os.path.join(backend_dir, "measured_timings.json"), "w") as out:
        json.dump(all_results, out, indent=2)
    print("\nSaved detailed measurement to backend/measured_timings.json")

if __name__ == "__main__":
    run_measurement()
