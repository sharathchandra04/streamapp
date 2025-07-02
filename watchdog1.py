import boto3
import os
import time
from datetime import datetime, timedelta
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from botocore.exceptions import NoCredentialsError

# AWS credentials are taken from the environment or AWS CLI configuration
s3 = boto3.client('s3')
local_directory = 'output'
s3_bucket = 'your-s3-bucket-name'
sync_interval = 5  # Time in seconds between syncs

class S3SyncHandler(FileSystemEventHandler):
    def on_created(self, event):
        if not event.is_directory:
            file_path = event.src_path
            upload_file(file_path)

def upload_file(file_path):
    """Upload a file to an S3 bucket"""
    file_name = os.path.basename(file_path)
    object_name = os.path.relpath(file_path, local_directory).replace("\\", "/")

    try:
        s3.upload_file(file_path, s3_bucket, object_name)
        print(f"Uploaded {file_name} to {s3_bucket}/{object_name}")
    except FileNotFoundError:
        print(f"The file {file_name} was not found")
    except NoCredentialsError:
        print("Credentials not available")

def sync_directory  ():
    for root, dirs, files in os.walk(local_directory):
        for file in files:
            local_path = os.path.join(root, file)
            file_modified_time = datetime.fromtimestamp(os.path.getmtime(local_path))
            current_time = datetime.now()
            threshold_time = current_time - timedelta(seconds=sync_interval)

            if file_modified_time >= threshold_time:
                upload_file(local_path)

if __name__ == "__main__":
    event_handler = S3SyncHandler()
    observer = Observer()
    observer.schedule(event_handler, local_directory, recursive=True)
    observer.start()

    try:
        while True:
            sync_directory()
            time.sleep(sync_interval)
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
