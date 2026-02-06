#!/bin/bash
# Send a Telegram notification to Mike
# Usage: ./scripts/notify.sh "Your message here"
#
# Used by the Optomitron agent to report status.

MESSAGE="${1:-No message provided}"

openclaw message send \
  --channel telegram \
  --target "1762827333" \
  --message "$MESSAGE" \
  2>/dev/null

echo "✅ Notified"
