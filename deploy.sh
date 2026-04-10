#!/bin/bash
# trust.xyz — deploy script
# Run from trust.xyz-live/ directory.
# Usage: ./deploy.sh "optional commit message"

set -e

MSG="${1:-v2.0 update — $(date '+%Y-%m-%d')}"

echo "→ Staging all changes..."
git add -A

echo "→ Committing: $MSG"
git commit -m "$MSG" || echo "(nothing new to commit)"

echo "→ Pushing to origin..."
git push

echo "✓ Deployed: $MSG"
