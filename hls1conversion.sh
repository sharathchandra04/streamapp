#!/bin/bash
INPUT=$1
OUTPUT="output"
SEGMENT_TIME=2

# Create output directory
# mkdir -p $OUTPUT

# Create variant playlist file if it doesn't exist
if [ ! -f "$OUTPUT/playlist.m3u8" ]; then
  echo "#EXTM3U" > $OUTPUT/playlist.m3u8
fi

# Function to encode video at a specific bitrate
encode() {
  local BITRATE=$1
  local HEIGHT=$2
  local NAME="${HEIGHT}p"
  local SEQUENCE=$(cat "${NAME}_sequence_number.txt")
  echo "Encoding ${NAME}..."
  echo $SEQUENCE
  MAXRATE=$(echo "$BITRATE * 1.07" | bc)
  BUFSIZE=$(echo "$BITRATE * 2" | bc)
  if [ ! -f "$OUTPUT/${NAME}.m3u8" ]; then
    ffmpeg -i $INPUT \
        -vf "scale=-2:$HEIGHT" \
        -c:a aac -ar 48000 -b:a 128k \
        -c:v h264 -profile:v main -crf 20 -sc_threshold 0 \
        -g $(($SEGMENT_TIME * 2)) -keyint_min $(($SEGMENT_TIME * 2)) \
        -hls_time $SEGMENT_TIME -hls_playlist_type event \
        -start_number $SEQUENCE \
        -b:v ${BITRATE}k -maxrate ${MAXRATE%.*}k -bufsize ${BUFSIZE%.*}k \
        -hls_segment_filename "$OUTPUT/${NAME}_%03d.ts" "$OUTPUT/${NAME}.m3u8"
    sed -i '$ d' "$OUTPUT/${NAME}.m3u8"
  else
    ffmpeg -i $INPUT \
        -vf "scale=-2:$HEIGHT" \
        -c:a aac -ar 48000 -b:a 128k \
        -c:v h264 -profile:v main -crf 20 -sc_threshold 0 \
        -g $(($SEGMENT_TIME * 2)) -keyint_min $(($SEGMENT_TIME * 2)) \
        -hls_time $SEGMENT_TIME -hls_playlist_type event \
        -start_number $SEQUENCE \
        -b:v ${BITRATE}k -maxrate ${MAXRATE%.*}k -bufsize ${BUFSIZE%.*}k \
        -hls_segment_filename "$OUTPUT/${NAME}_%03d.ts" "${NAME}_temp.m3u8"
    FILE1="$OUTPUT/${NAME}.m3u8"
    FILE2="${NAME}_temp.m3u8"
    # TEMP_FILE="temp.txt"
    TOTAL_LINES=$(wc -l < "$FILE2")
    LINES_TO_EXTRACT=$((TOTAL_LINES - 6))
    tail -n +6 "$FILE2" | head -n "$LINES_TO_EXTRACT" >> "$FILE1"
    # TOTAL_LINES_FILE1=$(wc -l < "$FILE1")
    # INSERT_POINT=$((TOTAL_LINES_FILE1 - 1))
    # awk -v insert_point="$INSERT_POINT" -v temp_file="$TEMP_FILE" '
    #     { print }
    #     NR == insert_point {
    #         while ((getline line < temp_file) > 0) {
    #             print line
    #         }
    #     }
    # ' "$FILE1" > "file1_temp.txt"
    # mv "file1_temp.txt" "$FILE1"
    # rm "$TEMP_FILE"
    echo "Lines from $FILE2 have been inserted between the second-to-last and last line of $FILE1"
  fi
  if ! grep -q "${NAME}.m3u8" "$OUTPUT/playlist.m3u8"; then
    echo "#EXT-X-STREAM-INF:BANDWIDTH=$((${BITRATE} * 1024)),RESOLUTION=1280x${HEIGHT}" >> $OUTPUT/playlist.m3u8
    echo "${NAME}.m3u8" >> $OUTPUT/playlist.m3u8
  fi
  # Update the sequence number
  local SEGMENT_COUNT=$(grep -c EXTINF "$OUTPUT/${NAME}.m3u8")
  SEQUENCE=$((SEGMENT_COUNT))
  echo $SEQUENCE > "${NAME}_sequence_number.txt"

#   echo "#EXT-X-STREAM-INF:BANDWIDTH=$((${BITRATE} * 1024)),RESOLUTION=1280x${HEIGHT}" >> $OUTPUT/playlist.m3u8
#   echo "${NAME}.m3u8" >> $OUTPUT/playlist.m3u8
}

# Encode in various bitrates and resolutions
encode 800 360   # 800 kbps, 360p
# encode 1400 480  # 1400 kbps, 480p
# encode 2800 720  # 2800 kbps, 720p
# encode 5000 1080 # 5000 kbps, 1080p

echo "HLS conversion complete. Playlist generated at $OUTPUT/playlist.m3u8"

# https://stackoverflow.com/questions/58454766/videojs-how-to-update-m3u8-playlist-dynamically
#EXT-X-ENDLIST