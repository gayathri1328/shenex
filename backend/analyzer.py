"""
SHENEX Real Spatial & Occupancy Analyzer
Calculates real occupancy headcounts, dwell time integrals, zone residency,
movement trajectories, 2D density heatmaps, and plain-English AI insights.
"""

import numpy as np
from scipy.ndimage import gaussian_filter

# Default 4-Quadrant Architectural Zones (Normalized 0..100)
DEFAULT_ZONES = [
    {"id": "zone-a", "name": "Zone A (Northwest Lounge)", "x": 5, "y": 5, "width": 42, "height": 42, "color": "#6C4AB6"},
    {"id": "zone-b", "name": "Zone B (Northeast Concourse)", "x": 53, "y": 5, "width": 42, "height": 42, "color": "#4ECCA3"},
    {"id": "zone-c", "name": "Zone C (Southwest Workstations)", "x": 5, "y": 53, "width": 42, "height": 42, "color": "#FF9E7D"},
    {"id": "zone-d", "name": "Zone D (Southeast Meeting Nook)", "x": 53, "y": 53, "width": 42, "height": 42, "color": "#8D68DC"},
]

def is_point_in_zone(px: float, py: float, zone: dict) -> bool:
    return (zone["x"] <= px <= zone["x"] + zone["width"]) and (zone["y"] <= py <= zone["y"] + zone["height"])

def analyze_tracking_data(tracking_output: dict, video_metadata: dict, zones: list = None) -> dict:
    """
    Computes all PR-02 metrics from real video tracking data.
    Every metric is derived from actual detections.
    """
    zones_list = zones or DEFAULT_ZONES
    raw_detections = tracking_output.get("raw_detections", [])
    all_tracks = tracking_output.get("all_tracks", {})
    total_unique_tracks = len(all_tracks)

    # 1. Real Occupancy Over Time
    occupancy_timeline = []
    occupancies = []

    for item in raw_detections:
        occ = item["occupancy"]
        occupancies.append(occ)
        occupancy_timeline.append({
            "timestamp": item["timestamp"],
            "time_formatted": f"{int(item['timestamp'] // 60):02d}:{int(item['timestamp'] % 60):02d}",
            "count": occ,
        })

    peak_occupancy = max(occupancies) if occupancies else 0
    average_occupancy = round(float(np.mean(occupancies)), 2) if occupancies else 0.0

    # 2. Real Dwell Time per Track
    dwell_records = []
    track_trajectories = []
    palette = ["#6C4AB6", "#4ECCA3", "#FF9E7D", "#8D68DC", "#F59E0B", "#34B38A", "#E53E3E"]

    for idx, (tid, track) in enumerate(all_tracks.items()):
        dwell_secs = max(0.5, round(track["exit_time"] - track["entry_time"], 2))
        dwell_records.append(dwell_secs)
        
        # Color assignment
        color = palette[idx % len(palette)]
        points = [[round(pt[0], 1), round(pt[1], 1)] for pt in track["history"]]

        track_trajectories.append({
            "id": f"#{tid:03d}" if isinstance(tid, int) else str(tid),
            "label": track["label"],
            "entry_time": track["entry_time"],
            "exit_time": track["exit_time"],
            "dwell_seconds": dwell_secs,
            "dwell_formatted": f"{int(dwell_secs // 60)}m {int(dwell_secs % 60)}s" if dwell_secs >= 60 else f"{int(dwell_secs)}s",
            "points": points,
            "color": color,
        })

    avg_dwell_seconds = round(float(np.mean(dwell_records)), 2) if dwell_records else 0.0
    max_dwell_seconds = round(float(np.max(dwell_records)), 2) if dwell_records else 0.0

    # 3. Real Zone Metrics
    zone_stats = []
    zone_visit_map = {z["id"]: set() for z in zones_list}
    zone_dwell_map = {z["id"]: [] for z in zones_list}

    for tid, track in all_tracks.items():
        # Check presence per point
        pts = track["history"]
        visited_zones_for_track = set()

        for pt in pts:
            px, py = pt[0], pt[1]
            for z in zones_list:
                if is_point_in_zone(px, py, z):
                    visited_zones_for_track.add(z["id"])
                    zone_visit_map[z["id"]].add(tid)

        # Track residency duration allocation
        track_dwell = max(0.5, track["exit_time"] - track["entry_time"])
        if len(visited_zones_for_track) > 0:
            dwell_split = track_dwell / len(visited_zones_for_track)
            for zid in visited_zones_for_track:
                zone_dwell_map[zid].append(dwell_split)

    # Rank zones to determine real traffic classification
    all_visit_counts = [len(zone_visit_map[z["id"]]) for z in zones_list]
    max_visits = max(all_visit_counts) if all_visit_counts and max(all_visit_counts) > 0 else 1

    for z in zones_list:
        zid = z["id"]
        v_count = len(zone_visit_map[zid])
        z_dwells = zone_dwell_map[zid]
        z_avg_dwell = round(float(np.mean(z_dwells)), 1) if z_dwells else 0.0

        # Objective traffic categorization based on computed metrics
        relative_ratio = v_count / max_visits if max_visits > 0 else 0
        if relative_ratio >= 0.75 and v_count > 0:
            status = "High Traffic"
        elif relative_ratio >= 0.35 and v_count > 0:
            status = "Moderate Flow"
        elif v_count > 0:
            status = "Low Traffic"
        else:
            status = "Zero Activity"

        zone_stats.append({
            "id": zid,
            "name": z["name"],
            "x": z["x"],
            "y": z["y"],
            "width": z["width"],
            "height": z["height"],
            "color": z["color"],
            "visitors": v_count,
            "dwellAvg": z_avg_dwell,
            "dwellAvg_formatted": f"{int(z_avg_dwell // 60)}m {int(z_avg_dwell % 60)}s" if z_avg_dwell >= 60 else f"{int(z_avg_dwell)}s",
            "status": status,
        })

    # 4. Real 2D Gaussian Density Heatmap
    # Grid 50x50 to keep JSON light and responsive for browser canvas
    grid_res = 50
    heatmap_grid = np.zeros((grid_res, grid_res), dtype=np.float32)

    for tid, track in all_tracks.items():
        for pt in track["history"]:
            norm_x, norm_y = pt[0], pt[1]
            gx = int(np.clip((norm_x / 100.0) * (grid_res - 1), 0, grid_res - 1))
            gy = int(np.clip((norm_y / 100.0) * (grid_res - 1), 0, grid_res - 1))
            heatmap_grid[gy, gx] += 1.0

    if np.max(heatmap_grid) > 0:
        heatmap_grid = gaussian_filter(heatmap_grid, sigma=2.5)
        max_v = np.max(heatmap_grid)
        if max_v > 0:
            heatmap_grid = heatmap_grid / max_v

    heatmap_matrix = heatmap_grid.round(3).tolist()

    # 5. Real AI Spatial Insights (Formulated strictly from calculated data)
    insights = []
    if total_unique_tracks == 0:
        insights.append({
            "id": "ins-empty",
            "type": "alert",
            "title": "Zero People Detected",
            "description": "No human presence was detected across the duration of this video. Verify camera field-of-view, lighting, or upload a video with occupant movement.",
            "impact": "No Occupancy Observed",
        })
    else:
        # Find highest traffic zone
        sorted_zones = sorted(zone_stats, key=lambda x: x["visitors"], reverse=True)
        top_zone = sorted_zones[0]
        quiet_zone = sorted_zones[-1]

        if top_zone["visitors"] > 0:
            insights.append({
                "id": "ins-traffic",
                "type": "traffic",
                "title": f"Primary Circulation Hub: {top_zone['name']}",
                "description": f"{top_zone['name']} recorded the highest concentration of occupant presence with {top_zone['visitors']} unique tracked visits.",
                "impact": f"{top_zone['status']} ({top_zone['visitors']} visits)",
            })

        if quiet_zone["visitors"] == 0 or quiet_zone["visitors"] < top_zone["visitors"] * 0.3:
            insights.append({
                "id": "ins-quiet",
                "type": "opportunity",
                "title": f"Underutilized Zone: {quiet_zone['name']}",
                "description": f"{quiet_zone['name']} recorded low foot traffic ({quiet_zone['visitors']} visits). Consider repositioning spatial attractors or directional signage.",
                "impact": "Underutilized Area",
            })

        insights.append({
            "id": "ins-dwell",
            "type": "opportunity",
            "title": f"Observed Dwell Time: {avg_dwell_seconds}s Median",
            "description": f"Across {total_unique_tracks} unique anonymous tracks, average dwell duration was {avg_dwell_seconds} seconds (Peak: {max_dwell_seconds}s).",
            "impact": "Dwell Profile",
        })

    return {
        "total_unique_tracks": total_unique_tracks,
        "peak_occupancy": peak_occupancy,
        "average_occupancy": average_occupancy,
        "occupancy_timeline": occupancy_timeline,
        "dwell_time": {
            "average_seconds": avg_dwell_seconds,
            "average_formatted": f"{int(avg_dwell_seconds // 60)}m {int(avg_dwell_seconds % 60)}s" if avg_dwell_seconds >= 60 else f"{int(avg_dwell_seconds)}s",
            "max_seconds": max_dwell_seconds,
            "max_formatted": f"{int(max_dwell_seconds // 60)}m {int(max_dwell_seconds % 60)}s" if max_dwell_seconds >= 60 else f"{int(max_dwell_seconds)}s",
        },
        "zones": zone_stats,
        "trajectories": track_trajectories,
        "heatmap": heatmap_matrix,
        "traffic_analysis": {
            "highest_traffic_zone": sorted_zones[0]["name"] if total_unique_tracks > 0 else "None",
            "lowest_traffic_zone": sorted_zones[-1]["name"] if total_unique_tracks > 0 else "None",
            "congestion_status": "Fluid" if peak_occupancy < 5 else "Moderate" if peak_occupancy < 12 else "High Congestion",
        },
        "insights": insights,
        "model_information": "Ultralytics YOLOv8n + ByteTrack Multi-Object Tracking (COCO Class 0 Person)",
    }
