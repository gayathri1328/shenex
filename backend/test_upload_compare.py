import requests

videos = [
    ('Test A (1 Person)', r'c:\Users\GAYATHRI\OneDrive\Desktop\sheNex\backend\test_videos\test_video_1person.mp4'),
    ('Test B (3 People)', r'c:\Users\GAYATHRI\OneDrive\Desktop\sheNex\backend\test_videos\test_video_3people.mp4'),
    ('Test C (2 People Dwell)', r'c:\Users\GAYATHRI\OneDrive\Desktop\sheNex\backend\test_videos\test_video_dwell.mp4'),
]

for label, vpath in videos:
    with open(vpath, 'rb') as f:
        res = requests.post('http://localhost:5173/api/upload', files={'file': f})
        data = res.json()
        print(f"=== {label} ===")
        print(f"Analysis ID: {data.get('analysis_id')}")
        print(f"Video File: {data.get('video_metadata', {}).get('filename')}")
        print(f"Duration: {data.get('video_metadata', {}).get('duration_seconds')}s ({data.get('video_metadata', {}).get('total_frames')} frames)")
        print(f"Total Unique Tracks: {data.get('total_unique_tracks')}")
        print(f"Peak Occupancy: {data.get('peak_occupancy')}")
        print(f"Average Occupancy: {data.get('average_occupancy')}")
        print(f"Avg Dwell Time: {data.get('dwell_time', {}).get('average_dwell_seconds')}s")
        print(f"Max Dwell Time: {data.get('dwell_time', {}).get('max_dwell_seconds')}s")
        print(f"Highest Traffic Zone: {data.get('traffic_analysis', {}).get('highest_traffic_zone')}")
        print(f"Lowest Traffic Zone: {data.get('traffic_analysis', {}).get('lowest_traffic_zone')}")
        print(f"Trajectories Tracked: {len(data.get('trajectories', []))}")
        print(f"Heatmap Rows: {len(data.get('heatmap', []))} x {len(data.get('heatmap', [[0]])[0])}")
        print(f"Processing Time: {data.get('processing_time_seconds')}s")
        print()
