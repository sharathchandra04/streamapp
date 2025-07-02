import cv2
import numpy as np
import pyautogui
import time
import os
from datetime import datetime

def get_filename():
    return f"screen_{datetime.now().strftime('%Y%m%d%H%M%S')}"

def record_screen(filename, duration=2):
    screen_size = pyautogui.size()
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")  # For .mp4 output
    video_filename = f"{filename}.mp4"
    lock_filename = f"{filename}.lock"
    
    out = cv2.VideoWriter(video_filename, fourcc, 20.0, (screen_size.width, screen_size.height))

    start_time = time.time()
    while time.time() - start_time < duration:
        img = pyautogui.screenshot()
        frame = np.array(img)
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        out.write(frame)

    out.release()

    # Create lock file to indicate recording is complete
    with open(lock_filename, 'w') as f:
        f.write("")

if __name__ == "__main__":
    while True:
        filename = get_filename()
        record_screen(filename)
        print(f"Recorded: {filename}.mp4")
        # time.sleep(2)  # Wait for 2 seconds before recording the next segment
