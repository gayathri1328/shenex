"""
SHENEX Test Scenario Video Generator (OpenCV + Real Pedestrian Features)
Uses real image assets from Ultralytics to generate test videos where
Ultralytics YOLOv8 detects:
- Test A: 1 Person
- Test B: 3 People across zones
- Test C: 2 People dwelling in Zone A
"""

import cv2
import numpy as np
import os
from ultralytics.utils import ASSETS

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "test_videos")
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_person_crops():
    """Extracts real person crops from Ultralytics built-in assets."""
    bus_path = os.path.join(ASSETS, "bus.jpg")
    zidane_path = os.path.join(ASSETS, "zidane.jpg")

    bus_img = cv2.imread(bus_path)
    zidane_img = cv2.imread(zidane_path)

    # Person 1 from bus (standing on left)
    p1 = bus_img[220:740, 40:240]
    p1 = cv2.resize(p1, (110, 260))

    # Person 2 from bus (center right)
    p2 = bus_img[230:720, 660:800]
    p2 = cv2.resize(p2, (100, 250))

    # Person 3 from zidane (left figure)
    p3 = zidane_img[160:700, 140:480]
    p3 = cv2.resize(p3, (120, 260))

    return [p1, p2, p3]

def overlay_transparent(background, overlay, x, y):
    """Pastes overlay person image onto background at (x, y)."""
    h_bg, w_bg = background.shape[:2]
    h_ov, w_ov = overlay.shape[:2]

    # Clip boundaries
    x1, y1 = max(0, int(x)), max(0, int(y))
    x2, y2 = min(w_bg, int(x + w_ov)), min(h_bg, int(y + h_ov))

    ov_x1, ov_y1 = 0, 0
    ov_x2 = x2 - x1
    ov_y2 = y2 - y1

    if ov_x2 <= 0 or ov_y2 <= 0:
        return

    # Direct copy with slight soft border
    background[y1:y2, x1:x2] = overlay[ov_y1:ov_y2, ov_x1:ov_x2]

def generate_video_a(output_path, crops=None, width=720, height=540, fps=30, duration_sec=5):
    """TEST A: 1 Real Person walking horizontally across frame."""
    if crops is None:
        crops = get_person_crops()
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    total_frames = fps * duration_sec
    person = crops[0]

    for f in range(total_frames):
        # Indoor concourse background
        frame = np.full((height, width, 3), (242, 238, 246), dtype=np.uint8)
        # Perspective floor lines
        for gy in range(height // 2, height, 35):
            cv2.line(frame, (0, gy), (width, gy), (220, 212, 228), 1)
        for gx in range(0, width, 60):
            cv2.line(frame, (gx, height // 2), (int(gx * 1.2), height), (220, 212, 228), 1)

        # Person 1 traverses from x=60 to x=540
        px = 60 + (f / total_frames) * (width - 200)
        py = height - 300
        overlay_transparent(frame, person, px, py)

        cv2.putText(frame, "SHENEX REAL TEST A: 1 Person", (24, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (60, 30, 75), 2)
        out.write(frame)

    out.release()
    print(f"Generated: {output_path}")

def generate_video_b(output_path, crops=None, width=720, height=540, fps=30, duration_sec=5):
    """TEST B: 3 Real People moving across multi-zones."""
    if crops is None:
        crops = get_person_crops()
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    total_frames = fps * duration_sec

    p1, p2, p3 = crops[0], crops[1], crops[2]
    # Resize slightly for depth perspective
    p1_s = cv2.resize(p1, (85, 200))
    p2_s = cv2.resize(p2, (95, 220))
    p3_s = cv2.resize(p3, (110, 250))

    for f in range(total_frames):
        frame = np.full((height, width, 3), (240, 236, 245), dtype=np.uint8)
        for gy in range(height // 2, height, 35):
            cv2.line(frame, (0, gy), (width, gy), (218, 210, 225), 1)

        # Person 1 in Zone A (Northwest)
        p1_x = 60 + (f / total_frames) * 100
        p1_y = 120
        overlay_transparent(frame, p1_s, p1_x, p1_y)

        # Person 2 in Zone B (Northeast)
        p2_x = width - 200 - (f / total_frames) * 90
        p2_y = 130
        overlay_transparent(frame, p2_s, p2_x, p2_y)

        # Person 3 in Zone C/D (Foreground circulation)
        p3_x = width * 0.4 + np.sin(f * 0.05) * 60
        p3_y = height - 280
        overlay_transparent(frame, p3_s, p3_x, p3_y)

        cv2.putText(frame, "SHENEX REAL TEST B: 3 People", (24, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (60, 30, 75), 2)
        out.write(frame)

    out.release()
    print(f"Generated: {output_path}")

def generate_video_c(output_path, crops=None, width=720, height=540, fps=30, duration_sec=6):
    """TEST C: 2 Real People dwelling in Zone A (Northwest)."""
    if crops is None:
        crops = get_person_crops()
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    total_frames = fps * duration_sec

    p1, p3 = crops[0], crops[2]
    p1_s = cv2.resize(p1, (90, 210))
    p3_s = cv2.resize(p3, (100, 230))

    for f in range(total_frames):
        frame = np.full((height, width, 3), (243, 238, 246), dtype=np.uint8)
        for gy in range(height // 2, height, 35):
            cv2.line(frame, (0, gy), (width, gy), (220, 212, 228), 1)

        # Both people dwelling in Zone A with slight natural micro-sway
        p1_x = 80 + np.sin(f * 0.05) * 4
        p1_y = 140
        overlay_transparent(frame, p1_s, p1_x, p1_y)

        p3_x = 180 + np.cos(f * 0.04) * 4
        p3_y = 150
        overlay_transparent(frame, p3_s, p3_x, p3_y)

        cv2.putText(frame, "SHENEX REAL TEST C: 2 People Dwelling", (24, 36), cv2.FONT_HERSHEY_SIMPLEX, 0.75, (60, 30, 75), 2)
        out.write(frame)

    out.release()
    print(f"Generated: {output_path}")

def main():
    crops = get_person_crops()
    generate_video_a(os.path.join(OUTPUT_DIR, "test_video_1person.mp4"), crops)
    generate_video_b(os.path.join(OUTPUT_DIR, "test_video_3people.mp4"), crops)
    generate_video_c(os.path.join(OUTPUT_DIR, "test_video_dwell.mp4"), crops)
    print("Real person test scenario videos generated successfully!")

if __name__ == "__main__":
    main()
