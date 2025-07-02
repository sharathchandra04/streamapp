#!/bin/bash

# INPUT=$1
INPUT="input.mp4"
OUTPUT_DIR="output"
SEGMENT_TIME=10

# Create output directory if it doesn't exist
mkdir -p $OUTPUT_DIR

# Generate a unique timestamp for segment filenames
TIMESTAMP=$(date +%Y%m%d%H%M%S)

# Function to encode video at a specific bitrate and resolution
encode() {
  local BITRATE=$1
  local HEIGHT=$2
  local NAME="${HEIGHT}p"
  local OUTPUT_FILE="$OUTPUT_DIR/${NAME}_${TIMESTAMP}_%03d.ts"
  local PLAYLIST_FILE="$OUTPUT_DIR/${NAME}_${TIMESTAMP}.m3u8"
  local MASTER_PLAYLIST="$OUTPUT_DIR/playlist.m3u8"

  echo "Encoding ${NAME}..."

  MAXRATE=$(echo "$BITRATE * 1.07" | bc)
  BUFSIZE=$(echo "$BITRATE * 2" | bc)

  ffmpeg -i $INPUT \
    -vf "scale=-2:$HEIGHT" \
    -c:a aac -ar 48000 -b:a 128k \
    -c:v h264 -profile:v main -crf 20 -sc_threshold 0 \
    -g $(($SEGMENT_TIME * 2)) -keyint_min $(($SEGMENT_TIME * 2)) \
    -hls_time $SEGMENT_TIME -hls_playlist_type event \
    -b:v ${BITRATE}k -maxrate ${MAXRATE%.*}k -bufsize ${BUFSIZE%.*}k \
    -hls_segment_filename "$OUTPUT_FILE" "$PLAYLIST_FILE"

  if [ ! -f "$MASTER_PLAYLIST" ]; then
    echo "#EXTM3U" > "$MASTER_PLAYLIST"
    echo "#EXT-X-VERSION:3" >> "$MASTER_PLAYLIST"
  fi

  if ! grep -q "${NAME}_${TIMESTAMP}.m3u8" "$MASTER_PLAYLIST"; then
    echo "#EXT-X-STREAM-INF:BANDWIDTH=$((${BITRATE} * 1024)),RESOLUTION=${HEIGHT}p" >> "$MASTER_PLAYLIST"
    echo "${NAME}_${TIMESTAMP}.m3u8" >> "$MASTER_PLAYLIST"
  fi
}

# Encode in various bitrates and resolutions
encode 800 360   # 800 kbps, 360p
# encode 1400 480  # 1400 kbps, 480p
# encode 2800 720  # 2800 kbps, 720p
# encode 5000 1080 # 5000 kbps, 1080p

echo "HLS conversion complete. Playlist updated at $OUTPUT_DIR/playlist.m3u8"



# "Taste the goodness of giving back."
# Yushan's summer fund raising event 2024
# "Together, we can make a difference in the lives of children."
# "Every bite brings hope to a child in need."



# Making sweet memories, one bite at a time."
# "Join us in spreading smiles and healing hearts."
# "Helping hands, happy hearts."
# "Join hands, share a meal, change a life."
# "Cooking with love for a cause."
