#!/bin/bash

FILE1="file1.txt"
FILE2="output/720p.m3u8"
TEMP_FILE="temp.txt"

# Get the total number of lines in FILE2
TOTAL_LINES=$(wc -l < "$FILE2")

# Calculate the number of lines to extract (excluding first 5 and the last line)
LINES_TO_EXTRACT=$((TOTAL_LINES - 6))

# Extract the desired lines from FILE2 and store in a temporary file
echo $TOTAL_LINES
echo $LINES_TO_EXTRACT
echo $(tail -n +6 "$FILE2")

tail -n +6 "$FILE2" | head -n "$LINES_TO_EXTRACT" > "$TEMP_FILE"
cat "$FILE2"
cat "$TEMP_FILE"
# Get the total number of lines in FILE1
TOTAL_LINES_FILE1=$(wc -l < "$FILE1")

# Calculate the line number just before the last line
INSERT_POINT=$((TOTAL_LINES_FILE1 - 1))

# Split FILE1 into two parts, insert lines from TEMP_FILE between them
awk -v insert_point="$INSERT_POINT" -v temp_file="$TEMP_FILE" '
    { print }
    NR == insert_point {
        while ((getline line < temp_file) > 0) {
            print line
        }
    }
' "$FILE1" > "file1_temp.txt"

# Replace original FILE1 with the updated file
mv "file1_temp.txt" "$FILE1"

# Clean up temporary files
rm "$TEMP_FILE"

echo "Lines from $FILE2 have been inserted between the second-to-last and last line of $FILE1"