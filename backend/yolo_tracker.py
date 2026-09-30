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
        # Load Ultralytics YOLO model once
        self.model = YOLO(self.model_weights)

    def reset_tracker(self):
        """
        Resets ByteTrack state so a new video starts with clean, isolated tracking state.
        Ensures track IDs restart from 1 and never carry over from Video A into Video B.
        Reuses the already loaded YOLO model weights without re-instantiating.
        """
        try:
            from ultralytics.trackers.basetrack import BaseTrack
            BaseTrack._count = 0
        except Exception:
            pass

        if hasattr(self.model, 'predictor') and self.model.predictor is not None:
            if hasattr(self.model.predictor, 'trackers') and self.model.predictor.trackers:
                for tr in self.model.predictor.trackers:
                    try:
                        tr.reset()
                    except Exception:
                        pass
                try:
                    delattr(self.model.predictor, 'trackers')
                except Exception:
                    pass

    def process_video(self, video_path: str, sample_fps: float = 3.0, progress_callback=None):
        """
        Processes video using YOLO and ByteTrack tracking.
        sample_fps: Frame sampling rate to optimize CPU/GPU throughput while maintaining temporal accuracy.
        """
        # 1. Reset ByteTrack tracker state cleanly for every new video
        self.reset_tracker()

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
        raw_detections = []  # list of {frame_idx, timestamp, occupancy, active_tracks}
        all_tracks_dict = {} # track_id -> {'history': [(norm_cx, norm_cy, timestamp)], 'entry_time', 'exit_time', ...}

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

                        # Tracked person normalized center coordinates [0..100] for spatial density
                        cx = (x1 + x2) / 2.0
                        cy = (y1 + y2) / 2.0
                        norm_cx = round((cx / w) * 100.0, 2)
                        norm_cy = round((cy / h) * 100.0, 2)

                        # Foot contact point coordinates [0..100] preserved for ground plane reference
                        foot_cx = norm_cx
                        foot_cy = round((y2 / h) * 100.0, 2)

                        # STRICT VALIDATION: Only valid ByteTrack IDs (track_id > 0) are confirmed tracked people
                        if track_id > 0:
                            track_label = f"Person Track #{track_id}"
                            track_record = {
                                "track_id": track_id,
                                "label": track_label,
                                "confidence": round(conf, 3),
                                "box": [round(x1, 1), round(y1, 1), round(x2, 1), round(y2, 1)],
                                "cx": norm_cx,
                                "cy": norm_cy,
                                "foot_cx": foot_cx,
                                "foot_cy": foot_cy,
                                "timestamp": timestamp,
                            }
                            frame_active_tracks.append(track_record)

                            # Update historical trajectory records
                            if track_id not in all_tracks_dict:
                                all_tracks_dict[track_id] = {
                                    "track_id": track_id,
                                    "label": track_label,
                                    "entry_time": timestamp,
                                    "exit_time": timestamp,
                                    "history": [],
                                    "foot_history": [],
                                }
                            all_tracks_dict[track_id]["exit_time"] = timestamp
                            all_tracks_dict[track_id]["history"].append([norm_cx, norm_cy, timestamp])
                            all_tracks_dict[track_id]["foot_history"].append([foot_cx, foot_cy, timestamp])

                # Real occupancy is strictly the count of valid active ByteTrack tracks at this timestamp
                current_occupancy = len(frame_active_tracks)

                raw_detections.append({
                    "frame_idx": frame_idx,
                    "timestamp": timestamp,
                    "occupancy": current_occupancy,
                    "active_tracks": frame_active_tracks,
                })

                processed_frame_count += 1
                if progress_callback and total_frames > 0:
                    pct = min(88, 10 + int((frame_idx / total_frames) * 78))
                    expected_samples = max(1, total_frames // frame_interval)
                    progress_callback(pct, f"Detecting people & tracking with ByteTrack (frame {processed_frame_count}/{expected_samples})...", processed_frame_count, expected_samples)

            frame_idx += 1

        cap.release()

        return {
            "processed_frame_count": processed_frame_count,
            "raw_detections": raw_detections,
            "all_tracks": all_tracks_dict,
        }
