#!/bin/bash
set -euo pipefail

if ! command -v launchctl >/dev/null 2>&1; then
  echo "This helper is intended for macOS." >&2
  exit 1
fi

launchctl setenv OLLAMA_HOST "0.0.0.0:11434"

# The Ollama macOS app must be relaunched to inherit the launch environment.
if pgrep -f "Ollama.app/Contents/MacOS/Ollama" >/dev/null 2>&1 || pgrep -x "Ollama" >/dev/null 2>&1; then
  osascript -e 'tell application "Ollama" to quit' >/dev/null 2>&1 || true
  sleep 2
fi
open -a Ollama

echo "OLLAMA_HOST configured. Wait for Ollama to start, then verify with:"
echo "  lsof -nP -iTCP:11434 -sTCP:LISTEN"
echo "Expected listener: *:11434 or 0.0.0.0:11434"
