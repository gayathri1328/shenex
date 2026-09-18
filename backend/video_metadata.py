"""
SHENEX Real Video Metadata Extractor
Uses OpenCV to extract real metadata from uploaded video streams.
"""

import cv2
import os

def extract_video_metadata(video_path: str) -> dict:
    """
    Extracts real physical video metadata using OpenCV.
    Does not invent or mock values.
    """
    if not os.path.exists(video_path):
        raise FileNotFoundError(f"Video file not found at: {video_path}")

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        raise ValueError(f"OpenCV could not open video file: {video_path}")

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = float(cap.get(cv2.CAP_PROP_FPS))
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    if fps <= 0:
        fps = 30.0  # Fallback default if stream does not report FPS header

    duration_seconds = round(total_frames / fps, 2) if fps > 0 else 0.0
    filename = os.path.basename(video_path)
    file_size_bytes = os.path.getsize(video_path)
    file_size_mb = round(file_size_bytes / (1024 * 1024), 2)

    cap.release()

    return {
        "filename": filename,
        "width": width,
        "height": height,
        "fps": round(fps, 2),
        "total_frames": total_frames,
        "duration_seconds": duration_seconds,
        "duration_formatted": f"{int(duration_seconds // 60):02d}:{int(duration_seconds % 60):02d}",
        "file_size_mb": file_size_mb,
        "aspect_ratio": f"{width}:{height}" if width and height else "Unknown",
        "is_360_equirectangular": width >= 2 * height if width and height else False,
    }
