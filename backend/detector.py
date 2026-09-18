"""
SHENEX Person Detector
Lightweight, privacy-preserving person detector.
Strictly restricted to class 0 (Person). Zero facial recognition, zero identity embeddings.
"""

import cv2
import numpy as np

class PrivacyPreservingDetector:
    def __init__(self, confidence_threshold=0.45):
        self.conf_threshold = confidence_threshold
        # Initialize OpenCV Default HOG Person Detector as reliable baseline
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

    def detect(self, frame):
        """
        Detects people within a frame.
        Returns a list of anonymous bounding boxes: [[x1, y1, x2, y2, confidence], ...]
        """
        h, w = frame.shape[:2]
        # Resize for high-efficiency detection if frame is large
        scale = 1.0
        if w > 800:
            scale = 800.0 / w
            resized = cv2.resize(frame, (800, int(h * scale)))
        else:
            resized = frame

        boxes, weights = self.hog.detectMultiScale(
            resized,
            winStride=(8, 8),
            padding=(4, 4),
            scale=1.05
        )

        detections = []
        for i, (bx, by, bw, bh) in enumerate(boxes):
            conf = float(weights[i]) if len(weights) > i else 0.8
            # Map coordinates back to original scale
            x1 = int(bx / scale)
            y1 = int(by / scale)
            x2 = int((bx + bw) / scale)
            y2 = int((by + bh) / scale)
            
            # Anonymous bounding box only
            detections.append([x1, y1, x2, y2, conf])

        return detections
