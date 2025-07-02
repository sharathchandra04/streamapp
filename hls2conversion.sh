
#!/bin/bash

INPUT="input1.mp4"
OUTPUT="output"
SEGMENT_TIME=2

# Create variant playlist file
echo "#EXTM3U" > $OUTPUT/playlist.m3u8

# Function to encode video at a specific bitrate
encode() {
  local BITRATE=$1
  local HEIGHT=$2
  local NAME="${HEIGHT}p"

  echo "Encoding ${NAME}..."

  MAXRATE=$(echo "$BITRATE * 1.07" | bc)
  BUFSIZE=$(echo "$BITRATE * 2" | bc)

  ffmpeg -i $INPUT \
    -vf "scale=-2:$HEIGHT" \
    -c:a aac -ar 48000 -b:a 128k \
    -c:v h264 -profile:v main -crf 20 -sc_threshold 0 \
    -g $(($SEGMENT_TIME * 2)) -keyint_min $(($SEGMENT_TIME * 2)) \
    -hls_time $SEGMENT_TIME -hls_playlist_type vod \
    -b:v ${BITRATE}k -maxrate ${MAXRATE%.*}k -bufsize ${BUFSIZE%.*}k \
    -hls_segment_filename "$OUTPUT/${NAME}_%Y%m%d%H%M%S_%03d.ts" "$OUTPUT/${NAME}.m3u8"

  echo "#EXT-X-STREAM-INF:BANDWIDTH=$((${BITRATE} * 1024)),RESOLUTION=1280x${HEIGHT}" >> $OUTPUT/playlist.m3u8
  echo "${NAME}.m3u8" >> $OUTPUT/playlist.m3u8
}

# Encode in various bitrates and resolutions
encode 800 360   # 800 kbps, 360p
encode 1400 480  # 1400 kbps, 480p
encode 2800 720  # 2800 kbps, 720p
encode 5000 1080 # 5000 kbps, 1080p

echo "HLS conversion complete. Playlist generated at $OUTPUT/playlist.m3u8"
