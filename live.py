import os
import time
import subprocess

WATCH_DIR = "."
SCRIPT_PATH = "live.sh"

def process_video(video_path):
    subprocess.run([SCRIPT_PATH, video_path], check=True)

def main():
    processed_files = set()
    
    while True:
        for filename in os.listdir(WATCH_DIR):
            if filename.endswith(".mp4") and filename not in processed_files:
                video_path = os.path.join(WATCH_DIR, filename)
                process_video(video_path)
                processed_files.add(filename)
                os.remove(video_path)
        
        time.sleep(10)  # Check for new files every 10 seconds

if __name__ == "__main__":
    main()
