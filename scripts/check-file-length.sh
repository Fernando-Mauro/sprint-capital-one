#!/usr/bin/env bash

MAX_LINES=500
FAILED=0

while IFS= read -r file; do
  lines=$(wc -l < "$file")
  if [ "$lines" -gt "$MAX_LINES" ]; then
    echo "FAIL: $file has $lines lines (max $MAX_LINES)"
    FAILED=1
  fi
done < <(find frontend/src/ -name "*.ts" -o -name "*.tsx")

if [ "$FAILED" -eq 1 ]; then
  echo ""
  echo "One or more files exceed the $MAX_LINES-line limit."
  exit 1
else
  echo "All files within 500-line limit"
fi
