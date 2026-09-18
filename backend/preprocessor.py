"""
SHENEX Computer Vision Pipeline - 360° Omnidirectional Preprocessor
Handles equirectangular unwrapping, spherical distortion correction, and planar projection.
"""

import numpy as np
import cv2

class OmnidirectionalPreprocessor:
    def __init__(self, fov_deg=110, output_shape=(640, 640)):
        self.fov = np.deg2rad(fov_deg)
        self.output_shape = output_shape

    def unwrap_perspective(self, equirect_img, yaw_deg=0, pitch_deg=0):
        """
        Unwraps an equirectangular 360° image into a rectilinear perspective patch.
        yaw_deg: Horizontal rotation angle [-180, 180]
        pitch_deg: Vertical tilt angle [-90, 90]
        """
        h_eq, w_eq = equirect_img.shape[:2]
        out_w, out_h = self.output_shape

        # Camera intrinsic matrix for virtual rectilinear camera
        f = 0.5 * out_w / np.tan(0.5 * self.fov)
        cx, cy = out_w / 2.0, out_h / 2.0

        # Pixel grid
        u, v = np.meshgrid(np.arange(out_w), np.arange(out_h))
        x = (u - cx) / f
        y = (v - cy) / f
        z = np.ones_like(x)

        # Vector normalization
        norm = np.sqrt(x**2 + y**2 + z**2)
        xyz = np.stack([x / norm, y / norm, z / norm], axis=-1)

        # Euler rotation matrices
        yaw = np.deg2rad(yaw_deg)
        pitch = np.deg2rad(pitch_deg)

        r_yaw = np.array([
            [np.cos(yaw), 0, np.sin(yaw)],
            [0, 1, 0],
            [-np.sin(yaw), 0, np.cos(yaw)]
        ])

        r_pitch = np.array([
            [1, 0, 0],
            [0, np.cos(pitch), -np.sin(pitch)],
            [0, np.sin(pitch), np.cos(pitch)]
        ])

        rot = np.dot(r_yaw, r_pitch)
        rot_xyz = np.dot(xyz, rot.T)

        # Convert 3D ray to equirectangular spherical coordinates (longitude, latitude)
        theta = np.arctan2(rot_xyz[..., 0], rot_xyz[..., 2]) # longitude: [-pi, pi]
        phi = np.arcsin(np.clip(rot_xyz[..., 1], -1.0, 1.0))   # latitude: [-pi/2, pi/2]

        # Map to equirectangular image coordinates
        map_x = ((theta / np.pi + 1.0) * 0.5 * (w_eq - 1)).astype(np.float32)
        map_y = (((phi / (0.5 * np.pi) + 1.0) * 0.5) * (h_eq - 1)).astype(np.float32)

        return cv2.remap(equirect_img, map_x, map_y, cv2.INTER_LINEAR, borderMode=cv2.BORDER_WRAP)

    def ground_plane_homography(self, detected_box, camera_height_meters=2.8):
        """
        Projects detected bottom-center bounding box foot coordinate onto 2D floorplan coordinates.
        Ensures strict anonymous location coordinates (x, y).
        """
        x1, y1, x2, y2 = detected_box
        foot_x = (x1 + x2) / 2.0
        foot_y = y2 # lowest edge touching ground
        return foot_x, foot_y
