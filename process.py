import os
import subprocess
import time
# def process_segments():
#     while True:
#         for file in os.listdir('.'):
#             if file.endswith('.lock'):
#                 video_file = file.replace('.lock', '.mp4')
#                 if os.path.exists(video_file):
#                     # Process the video file with FFmpeg
#                     output_hls = video_file.replace('.mp4', '.m3u8')
#                     subprocess.call(['ffmpeg', '-i', video_file, '-codec: copy', '-start_number', '0', '-hls_time', '2', '-hls_list_size', '0', '-f', 'hls', output_hls])
                    
#                     # Remove the lock file after processing
#                     os.remove(file)
#                     print(f"Processed and removed: {file}")

#         time.sleep(5)  # Check every 5 seconds

def convert_to_hls(input_file):
    # Step 1: Read the file (assuming this step is for initialization and metadata handling)
    print(f"Processing {input_file}...")
    # Step 2: Convert into HLS format using shell script
    script_path = 'hls1conversion.sh'  # Replace with your actual script path
    if not os.path.exists(script_path):
        print(f"Error: HLS conversion script '{script_path}' not found.")
        return
    
    # Execute the shell script to convert to HLS
    try:
        subprocess.run(['bash', script_path, input_file], check=True)
        print("Conversion to HLS completed successfully.")
    except subprocess.CalledProcessError as e:
        print(f"Error: HLS conversion failed with error: {e}")
        return
    
    # Step 3: Update corresponding m3u8 files (Assuming this is done by the shell script itself)
    # Step 4: Remove the file after processing is done
    try:
        os.remove(input_file)
        print(f"File '{input_file}' removed after processing.")
    except OSError as e:
        print(f"Error: Failed to remove '{input_file}': {e}")

def process_mp4_files():
    while True:
        for file in os.listdir('.'):
            if file.endswith('.lock'):
                video_file = file.replace('.lock', '.mp4')
                if os.path.exists(video_file):
                    # Process the video file with FFmpeg
                    # output_hls = video_file.replace('.mp4', '.m3u8')
                    convert_to_hls(video_file)
                    os.remove(file)
                    # os.remove(video_file)
                    print(f"Processed and removed: {file}")
        # time.sleep(1)  # Check every 5 seconds
    # while True:
    #     mp4_files = [f for f in os.listdir() if f.endswith('.mp4')]
    #     if mp4_files:
    #         for mp4_file in mp4_files:
    #             mp4_path = os.path.join('', mp4_file)
    #             convert_to_hls(mp4_path)
    #     else:
    #         print("No MP4 files found. Waiting for new files...")
    #     time.sleep(1)

if __name__ == "__main__":
    for  i in ["360p_sequence_number.txt", "480p_sequence_number.txt", "720p_sequence_number.txt", "1080p_sequence_number.txt"]:
        filename = i
        with open(filename, 'w') as file:
            file.write("0")
    print(f"The number 0 has been written to {filename}")
    process_mp4_files()