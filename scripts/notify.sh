#!/bin/bash
# Send a Telegram notification to Mike
# Usage: ./scripts/notify.sh "Your message here"
# 
# Used by the Optomitron agent to report status.
# Requires openclaw CLI to be installed and configured.

MESSAGE="${1:-No message provided}"

openclaw message send \
  --channel telegram \
  --message "$MESSAGE" \
  2>/dev/null

echo "✅ Notified: ${MESSAGE}"
