"""
SHENEX Multi-Object Spatial Tracker
Maintains persistent anonymous IDs and trajectory histories across frames.
"""

import numpy as np
from collections import deque

class AnonymousSpatialTracker:
    def __init__(self, max_disappeared=30, max_distance=75):
        self.next_id = 1
        self.tracks = {}  # track_id -> {'centroid': (x, y), 'box': [...], 'disappeared': int, 'history': deque}
        self.max_disappeared = max_disappeared
        self.max_distance = max_distance

    def register(self, centroid, box):
        track_id = f"#{self.next_id:03d}"
        self.tracks[track_id] = {
            'id': track_id,
            'centroid': centroid,
            'box': box,
            'disappeared': 0,
            'history': deque([centroid], maxlen=100),
            'dwell_frames': 1,
        }
        self.next_id += 1

    def deregister(self, track_id):
        if track_id in self.tracks:
            del self.tracks[track_id]

    def update(self, detections):
        """
        Updates active tracks with new frame detections.
        detections: list of [x1, y1, x2, y2, conf]
        """
        if len(detections) == 0:
            for track_id in list(self.tracks.keys()):
                self.tracks[track_id]['disappeared'] += 1
                if self.tracks[track_id]['disappeared'] > self.max_disappeared:
                    self.deregister(track_id)
            return self.get_active_tracks()

        # Compute centroids for current detections
        input_centroids = np.zeros((len(detections), 2), dtype="int")
        for i, (x1, y1, x2, y2, _) in enumerate(detections):
            # Centroid at foot contact point
            cx = int((x1 + x2) / 2.0)
            cy = int(y2)
            input_centroids[i] = (cx, cy)

        if len(self.tracks) == 0:
            for i in range(len(detections)):
                self.register(tuple(input_centroids[i]), detections[i])
        else:
            track_ids = list(self.tracks.keys())
            track_centroids = [t['centroid'] for t in self.tracks.values()]

            # Compute Euclidean distances
            D = np.linalg.norm(np.array(track_centroids)[:, np.newaxis] - input_centroids, axis=2)

            rows = D.min(axis=1).argsort()
            cols = D.argmin(axis=1)[rows]

            used_rows = set()
            used_cols = set()

            for (row, col) in zip(rows, cols):
                if row in used_rows or col in used_cols:
                    continue

                if D[row, col] > self.max_distance:
                    continue

                track_id = track_ids[row]
                self.tracks[track_id]['centroid'] = tuple(input_centroids[col])
                self.tracks[track_id]['box'] = detections[col]
                self.tracks[track_id]['disappeared'] = 0
                self.tracks[track_id]['history'].append(tuple(input_centroids[col]))
                self.tracks[track_id]['dwell_frames'] += 1

                used_rows.add(row)
                used_cols.add(col)

            unused_rows = set(range(len(track_ids))).difference(used_rows)
            for row in unused_rows:
                track_id = track_ids[row]
                self.tracks[track_id]['disappeared'] += 1
                if self.tracks[track_id]['disappeared'] > self.max_disappeared:
                    self.deregister(track_id)

            unused_cols = set(range(len(detections))).difference(used_cols)
            for col in unused_cols:
                self.register(tuple(input_centroids[col]), detections[col])

        return self.get_active_tracks()

    def get_active_tracks(self):
        active = []
        for tid, data in self.tracks.items():
            if data['disappeared'] == 0:
                active.append({
                    'id': tid,
                    'centroid': data['centroid'],
                    'box': data['box'],
                    'dwell_frames': data['dwell_frames'],
                    'history': list(data['history']),
                })
        return active
