import time
import os
import queue
import threading
import boto3
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Global queue for events
event_queue = queue.Queue()


# AWS credentials (ensure AWS CLI or environment variables are configured)
aws_access_key_id = ''
aws_secret_access_key = ''
region_name = 'us-east-1'
bucket_name = '7julysharath'

# Initialize S3 client
s3 = boto3.client('s3', aws_access_key_id=aws_access_key_id,
                  aws_secret_access_key=aws_secret_access_key,
                  region_name=region_name)

class S3Uploader:
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name

    def upload_file(self, file_path):
        file_name = os.path.basename(file_path)
        s3_path = file_name  # You can adjust this based on your S3 bucket structure

        try:
            s3.upload_file(file_path, self.bucket_name, s3_path)
            print(f"Uploaded {file_name} to S3 bucket: {self.bucket_name}") 
        except Exception as e:
            print(f"Failed to upload {file_name} to S3: {str(e)}")

class MyHandler(FileSystemEventHandler):
    # def on_created(self, event):
    #     if not event.is_directory:
    #         event_queue.put((event.event_type, event.src_path))

    def on_modified(self, event):
        if not event.is_directory:
            event_queue.put((event.event_type, event.src_path))

def event_processor():
    s3_uploader = S3Uploader(bucket_name)
    while True:
        try:
            event_type, file_path = event_queue.get(timeout=1)
            # Process the event here
            print(f"Processing event: {event_type} - {file_path}")
            # Example: Upload to S3, process file, etc.
            if event_type in ['created', 'modified']:
                s3_uploader.upload_file(file_path)
        except queue.Empty:
            continue

if __name__ == "__main__":
    path = 'output'  # Directory to monitor
    event_handler = MyHandler()
    observer = Observer()
    observer.schedule(event_handler, path, recursive=True)
    observer.start()

    # Start event processing thread
    event_thread = threading.Thread(target=event_processor)
    event_thread.daemon = True  # Daemonize the thread to exit with the main program
    event_thread.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
