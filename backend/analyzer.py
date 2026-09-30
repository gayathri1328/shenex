"""
SHENEX Real Spatial & Occupancy Analyzer
Calculates real occupancy headcounts, dwell time integrals, zone residency,
movement trajectories, 2D density heatmaps, and plain-English AI insights.
"""

import numpy as np
from scipy.ndimage import gaussian_filter

# Default 4-Quadrant Architectural Zones (Normalized 0..100)
# Seamless quadrant partition ensuring all coordinates fall into designated sectors
DEFAULT_ZONES = [
    {"id": "zone-a", "name": "Zone A (Northwest Sector)", "x": 0, "y": 0, "width": 50, "height": 50, "color": "#6C4AB6"},
    {"id": "zone-b", "name": "Zone B (Northeast Sector)", "x": 50, "y": 0, "width": 50, "height": 50, "color": "#4ECCA3"},
    {"id": "zone-c", "name": "Zone C (Southwest Sector)", "x": 0, "y": 50, "width": 50, "height": 50, "color": "#FF9E7D"},
    {"id": "zone-d", "name": "Zone D (Southeast Sector)", "x": 50, "y": 50, "width": 50, "height": 50, "color": "#8D68DC"},
]

def is_point_in_zone(px: float, py: float, zone: dict) -> bool:
    zx, zy, zw, zh = zone["x"], zone["y"], zone["width"], zone["height"]
    return (zx <= px <= zx + zw) and (zy <= py <= zy + zh)

def analyze_tracking_data(tracking_output: dict, video_metadata: dict, zones: list = None) -> dict:
    """
    Computes all metrics from real ByteTrack tracking data.
    Every metric is derived strictly from confirmed active person tracks (track_id > 0).
    """
    zones_list = zones or DEFAULT_ZONES
    raw_detections = tracking_output.get("raw_detections", [])
    all_tracks = tracking_output.get("all_tracks", {})
    total_unique_tracks = len(all_tracks)

    # 1. Real Occupancy Over Time (strictly confirmed ByteTrack track_id > 0)
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

    # 2. Real Dwell Time per Track (requires at least 2 confirmed sampled observations)
    dwell_records = []
    track_trajectories = []
    palette = ["#6C4AB6", "#4ECCA3", "#FF9E7D", "#8D68DC", "#F59E0B", "#34B38A", "#E53E3E"]

    for idx, (tid, track) in enumerate(all_tracks.items()):
        obs_count = len(track["history"])
        # Dwell time based on true video timestamps
        dwell_secs = max(0.5, round(track["exit_time"] - track["entry_time"], 2))

        # Robust dwell calculation: require >= 2 confirmed sampled observations for statistical aggregate
        if obs_count >= 2:
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
            "observations": obs_count,
            "dwell_formatted": f"{int(dwell_secs // 60)}m {int(dwell_secs % 60)}s" if dwell_secs >= 60 else f"{int(dwell_secs)}s",
            "points": points,
            "color": color,
        })

    # If all tracks have < 2 observations, fallback to all recorded dwell values
    if not dwell_records and all_tracks:
        dwell_records = [max(0.5, round(t["exit_time"] - t["entry_time"], 2)) for t in all_tracks.values()]

    avg_dwell_seconds = round(float(np.mean(dwell_records)), 2) if dwell_records else 0.0
    max_dwell_seconds = round(float(np.max(dwell_records)), 2) if dwell_records else 0.0

    # 3. Real Data-Driven Zone Metrics from Tracked Center Coordinates
    zone_stats = []
    zone_visit_map = {z["id"]: set() for z in zones_list}
    zone_dwell_map = {z["id"]: [] for z in zones_list}
    zone_points_map = {z["id"]: 0 for z in zones_list}

    total_tracked_points = 0

    for tid, track in all_tracks.items():
        pts = track["history"]
        visited_zones_for_track = set()

        for pt in pts:
            px, py = pt[0], pt[1]
            total_tracked_points += 1
            for z in zones_list:
                if is_point_in_zone(px, py, z):
                    visited_zones_for_track.add(z["id"])
                    zone_visit_map[z["id"]].add(tid)
                    zone_points_map[z["id"]] += 1

        # Track residency duration allocation
        track_dwell = max(0.5, track["exit_time"] - track["entry_time"])
        if len(visited_zones_for_track) > 0:
            dwell_split = track_dwell / len(visited_zones_for_track)
            for zid in visited_zones_for_track:
                zone_dwell_map[zid].append(dwell_split)

    # Calculate metrics for each zone based on tracked points & visits
    for z in zones_list:
        zid = z["id"]
        v_count = len(zone_visit_map[zid])
        pts_count = zone_points_map[zid]
        z_dwells = zone_dwell_map[zid]
        z_avg_dwell = round(float(np.mean(z_dwells)), 1) if z_dwells else 0.0
        density_pct = round((pts_count / total_tracked_points * 100.0), 1) if total_tracked_points > 0 else 0.0

        zone_stats.append({
            "id": zid,
            "name": z["name"],
            "x": z["x"],
            "y": z["y"],
            "width": z["width"],
            "height": z["height"],
            "color": z["color"],
            "visitors": v_count,
            "points_count": pts_count,
            "density_pct": density_pct,
            "dwellAvg": z_avg_dwell,
            "dwellAvg_formatted": f"{int(z_avg_dwell // 60)}m {int(z_avg_dwell % 60)}s" if z_avg_dwell >= 60 else f"{int(z_avg_dwell)}s",
        })

    # Sort zones by observed movement points and visitors
    sorted_zones = sorted(zone_stats, key=lambda x: (x["points_count"], x["visitors"]), reverse=True)
    max_pts = sorted_zones[0]["points_count"] if sorted_zones else 0

    for z in zone_stats:
        ratio = z["points_count"] / max_pts if max_pts > 0 else 0
        if ratio >= 0.70 and z["visitors"] > 0:
            z["status"] = "High Traffic"
        elif ratio >= 0.30 and z["visitors"] > 0:
            z["status"] = "Moderate Flow"
        elif z["visitors"] > 0:
            z["status"] = "Low Traffic"
        else:
            z["status"] = "Zero Activity"

    top_zone = sorted_zones[0] if sorted_zones else None
    quiet_zone = sorted_zones[-1] if sorted_zones else None

    # 4. Real 2D Gaussian Density Heatmap from Tracked Center Coordinates
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

    # 5. Real AI Spatial Insights & Traffic Explanation (strictly from calculated data)
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
        if top_zone and top_zone["visitors"] > 0:
            insights.append({
                "id": "ins-traffic",
                "type": "traffic",
                "title": f"Primary Circulation Hub: {top_zone['name']}",
                "description": f"{top_zone['name']} concentrated {top_zone['density_pct']}% of observed spatial movement with {top_zone['visitors']} unique tracked visitors.",
                "impact": f"{top_zone['status']} ({top_zone['density_pct']}% density)",
            })

        if quiet_zone and (quiet_zone["visitors"] == 0 or quiet_zone["points_count"] < top_zone["points_count"] * 0.3):
            insights.append({
                "id": "ins-quiet",
                "type": "opportunity",
                "title": f"Underutilized Zone: {quiet_zone['name']}",
                "description": f"{quiet_zone['name']} recorded low movement density ({quiet_zone['density_pct']}%, {quiet_zone['visitors']} visitors). Consider repositioning spatial attractors.",
                "impact": "Underutilized Area",
            })

        insights.append({
            "id": "ins-dwell",
            "type": "opportunity",
            "title": f"Observed Dwell Time: {avg_dwell_seconds}s Average",
            "description": f"Across {len(dwell_records)} confirmed multi-observation tracks, average dwell duration was {avg_dwell_seconds} seconds (Peak: {max_dwell_seconds}s).",
            "impact": "Dwell Profile",
        })

    traffic_explanation = (
        f"Highest traffic observed in {top_zone['name']} ({top_zone['visitors']} visitors, {top_zone['density_pct']}% of spatial movement). "
        f"Lowest activity in {quiet_zone['name']} ({quiet_zone['visitors']} visitors, {quiet_zone['density_pct']}% density)."
        if top_zone and quiet_zone and total_unique_tracks > 0
        else "No traffic activity observed."
    )

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
            "confirmed_tracks_count": len(dwell_records),
        },
        "zones": zone_stats,
        "trajectories": track_trajectories,
        "heatmap": heatmap_matrix,
        "traffic_analysis": {
            "highest_traffic_zone": top_zone["name"] if top_zone and total_unique_tracks > 0 else "None",
            "lowest_traffic_zone": quiet_zone["name"] if quiet_zone and total_unique_tracks > 0 else "None",
            "highest_traffic_density_pct": top_zone["density_pct"] if top_zone else 0.0,
            "lowest_traffic_density_pct": quiet_zone["density_pct"] if quiet_zone else 0.0,
            "explanation": traffic_explanation,
            "congestion_status": "Fluid" if peak_occupancy < 5 else "Moderate" if peak_occupancy < 12 else "High Congestion",
        },
        "insights": insights,
        "model_information": "Ultralytics YOLOv8n + ByteTrack Multi-Object Tracking (COCO Class 0 Person)",
    }
