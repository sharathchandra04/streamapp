#!/bin/bash

OUTPUT_DIR="output"
PLAYLIST_FILE="$OUTPUT_DIR/playlist.m3u8"

# Create output directory if it doesn't exist
mkdir -p $OUTPUT_DIR

# Function to create HLS variant playlist for a specific resolution
create_variant_playlist() {
    local HEIGHT=$1
    local BITRATE=$2
    local NAME="${HEIGHT}p"
    local VARIANT_FILE="$OUTPUT_DIR/${NAME}.m3u8"

    echo "Creating HLS variant playlist for ${NAME}..."

    # Write variant playlist entry
    echo "#EXTM3U" > $VARIANT_FILE
    echo "#EXT-X-VERSION:3" >> $VARIANT_FILE
    echo "#EXT-X-STREAM-INF:BANDWIDTH=${BITRATE}000,RESOLUTION=${HEIGHT}x?" >> $VARIANT_FILE
    echo "playlist_${NAME}.m3u8" >> $VARIANT_FILE

    # Append variant playlist to master playlist
    echo "#EXT-X-STREAM-INF:BANDWIDTH=${BITRATE}000,RESOLUTION=${HEIGHT}x?" >> $PLAYLIST_FILE
    echo "playlist_${NAME}.m3u8" >> $PLAYLIST_FILE
}

# Create master playlist (playlist.m3u8)
echo "Creating master playlist..."

echo "#EXTM3U" > $PLAYLIST_FILE
echo "#EXT-X-VERSION:3" >> $PLAYLIST_FILE

# Create variant playlists for each resolution
create_variant_playlist 360 800
create_variant_playlist 480 1400
create_variant_playlist 720 2800
create_variant_playlist 1080 5000

echo "HLS playlist creation complete. Files are located in the $OUTPUT_DIR directory."
