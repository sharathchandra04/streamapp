#!/bin/bash

INPUT="input.mp4"
OUTPUT_DIR="output"
CLIP_DURATION=30

# Create output directory
mkdir -p $OUTPUT_DIR

# Function to encode video at a specific bitrate and resolution
encode() {
  local BITRATE=$1
  local HEIGHT=$2
  local NAME="${HEIGHT}p"
  local OUTPUT_FILE="$OUTPUT_DIR/${NAME}.mp4"

  echo "Encoding ${NAME}..."

  MAXRATE=$(echo "$BITRATE * 1.07" | bc)
  BUFSIZE=$(echo "$BITRATE * 2" | bc)

  ffmpeg -i $INPUT \
    -vf "scale=-2:$HEIGHT" \
    -t $CLIP_DURATION \
    -c:a aac -ar 48000 -b:a 128k \
    -c:v h264 -profile:v main -crf 20 -sc_threshold 0 \
    -g 48 -keyint_min 48 \
    -b:v ${BITRATE}k -maxrate ${MAXRATE%.*}k -bufsize ${BUFSIZE%.*}k \
    $OUTPUT_FILE
}

# Encode in various bitrates and resolutions
encode 800 360   # 800 kbps, 360p
encode 1400 480  # 1400 kbps, 480p
encode 2800 720  # 2800 kbps, 720p
encode 5000 1080 # 5000 kbps, 1080p

echo "Video conversion complete. Files are located in the $OUTPUT_DIR directory."
