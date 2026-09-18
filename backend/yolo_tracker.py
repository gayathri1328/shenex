"""
SHENEX Real Ultralytics YOLOv8 Person Detection & ByteTrack Multi-Object Tracker
Executes real YOLO inference strictly filtering class 0 (Person).
No facial recognition. No biometric identification.
"""

import cv2
import numpy as np
import os
from ultralytics import YOLO

class RealYOLOTracker:
    def __init__(self, model_weights: str = "yolov8n.pt", conf_threshold: float = 0.35):
        self.model_weights = model_weights
        self.conf_threshold = conf_threshold
        # Load Ultralytics YOLO model
        self.model = YOLO(self.model_weights)

    def process_video(self, video_path: str, sample_fps: float = 3.0, progress_callback=None):
        """
        Processes video using YOLO and ByteTrack tracking.
        sample_fps: Frame sampling rate to optimize CPU/GPU throughput while maintaining temporal accuracy.
        """
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            raise ValueError(f"Cannot open video for YOLO analysis: {video_path}")

        video_fps = float(cap.get(cv2.CAP_PROP_FPS))
        if video_fps <= 0:
            video_fps = 30.0
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_interval = max(1, int(round(video_fps / sample_fps)))

        frame_idx = 0
        processed_frame_count = 0
        raw_detections = []  # list of {frame_idx, timestamp, tracks: [{track_id, box, cx, cy, conf}]}
        all_tracks_dict = {} # track_id -> {'history': [(norm_x, norm_y, timestamp)], 'entry_time', 'exit_time'}

        while True:
            ret, frame = cap.read()
            if not ret:
                break

            if frame_idx % frame_interval == 0:
                timestamp = round(frame_idx / video_fps, 2)
                h, w = frame.shape[:2]

                # Run real Ultralytics YOLO track on frame with ByteTrack
                results = self.model.track(
                    source=frame,
                    persist=True,
                    tracker="bytetrack.yaml",
                    classes=[0],  # COCO Class 0 = Person strictly
                    conf=self.conf_threshold,
                    verbose=False
                )

                frame_active_tracks = []

                if results and len(results) > 0 and results[0].boxes is not None:
                    boxes = results[0].boxes
                    for box in boxes:
                        # Extract bounding box coordinates
                        xyxy = box.xyxy[0].cpu().numpy()
                        x1, y1, x2, y2 = float(xyxy[0]), float(xyxy[1]), float(xyxy[2]), float(xyxy[3])
                        conf = float(box.conf[0].cpu().numpy()) if box.conf is not None else 0.5

                        # Extract persistent tracking ID from ByteTrack
                        track_id = int(box.id[0].cpu().numpy()) if box.id is not None else -1

                        # Foot-ground contact point in normalized coordinates [0..100]
                        norm_cx = round(((x1 + x2) / 2.0 / w) * 100.0, 2)
                        norm_cy = round((y2 / h) * 100.0, 2)

                        track_label = f"Person Track #{track_id}" if track_id > 0 else f"Person (Untracked)"

                        track_record = {
                            "track_id": track_id,
                            "label": track_label,
                            "confidence": round(conf, 3),
                            "box": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                            "cx": norm_cx,
                            "cy": norm_cy,
                            "timestamp": timestamp,
                        }
                        frame_active_tracks.append(track_record)

                        # Update historical trajectory records if track has an assigned ID
                        if track_id > 0:
                            if track_id not in all_tracks_dict:
                                all_tracks_dict[track_id] = {
                                    "track_id": track_id,
                                    "label": track_label,
                                    "entry_time": timestamp,
                                    "exit_time": timestamp,
                                    "history": [],
                                }
                            all_tracks_dict[track_id]["exit_time"] = timestamp
                            all_tracks_dict[track_id]["history"].append([norm_cx, norm_cy, timestamp])

                raw_detections.append({
                    "frame_idx": frame_idx,
                    "timestamp": timestamp,
                    "occupancy": len(frame_active_tracks),
                    "active_tracks": frame_active_tracks,
                })

                processed_frame_count += 1
                if progress_callback and total_frames > 0:
                    pct = min(95, int((frame_idx / total_frames) * 100))
                    progress_callback(pct)

            frame_idx += 1

        cap.release()

        return {
            "processed_frame_count": processed_frame_count,
            "raw_detections": raw_detections,
            "all_tracks": all_tracks_dict,
        }
