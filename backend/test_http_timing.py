import time
import os
import requests

def test_http():
    video_path = os.path.join("backend", "uploads", "AN_1789718900_556aba_demo 3.mp4")
    file_size_mb = os.path.getsize(video_path) / (1024 * 1024)
    print(f"Testing video upload of {video_path} ({file_size_mb:.2f} MB)...")

    # Test 1: Direct backend /api/upload
    print("-" * 50)
    print("Test 1: Direct backend POST http://127.0.0.1:8000/api/upload")
    t0 = time.time()
    with open(video_path, "rb") as f:
        res = requests.post("http://127.0.0.1:8000/api/upload", files={"file": f})
    t_direct_upload = time.time() - t0
    print(f"Status: {res.status_code}, Time: {t_direct_upload:.2f}s")
    if res.ok:
        d = res.json()
        print(f"Server reported processing time: {d.get('processing_time_seconds')}s")

    # Test 2: Direct backend /api/upload-stream
    print("-" * 50)
    print("Test 2: Direct backend POST http://127.0.0.1:8000/api/upload-stream (streaming chunks)")
    t0 = time.time()
    with open(video_path, "rb") as f:
        res = requests.post("http://127.0.0.1:8000/api/upload-stream", files={"file": f}, stream=True)
        chunks_count = 0
        for line in res.iter_lines():
            if line:
                chunks_count += 1
    t_direct_stream = time.time() - t0
    print(f"Status: {res.status_code}, Time: {t_direct_stream:.2f}s, Chunks received: {chunks_count}")

    # Test 3: Via Vite proxy http://localhost:5173/api/upload
    print("-" * 50)
    print("Test 3: Via Vite proxy POST http://localhost:5173/api/upload")
    try:
        t0 = time.time()
        with open(video_path, "rb") as f:
            res = requests.post("http://localhost:5173/api/upload", files={"file": f})
        t_vite_upload = time.time() - t0
        print(f"Status: {res.status_code}, Time: {t_vite_upload:.2f}s")
        if res.ok:
            d = res.json()
            print(f"Server reported processing time: {d.get('processing_time_seconds')}s")
    except Exception as e:
        print(f"Vite proxy error: {e}")

    # Test 4: Via Vite proxy http://localhost:5173/api/upload-stream
    print("-" * 50)
    print("Test 4: Via Vite proxy POST http://localhost:5173/api/upload-stream")
    try:
        t0 = time.time()
        with open(video_path, "rb") as f:
            res = requests.post("http://localhost:5173/api/upload-stream", files={"file": f}, stream=True)
            chunks_count = 0
            for line in res.iter_lines():
                if line:
                    chunks_count += 1
        t_vite_stream = time.time() - t0
        print(f"Status: {res.status_code}, Time: {t_vite_stream:.2f}s, Chunks received: {chunks_count}")
    except Exception as e:
        print(f"Vite stream error: {e}")

if __name__ == "__main__":
    test_http()
