#!/bin/bash

# Define your file path
FILE_PATH="1.txt"

# Continuously print the contents of the file and remove it
while true
do
    if [ -f "$FILE_PATH" ]; then
        cat "$FILE_PATH"
        rm "$FILE_PATH"
    fi
    sleep 1  # Adjust sleep time as needed
done
