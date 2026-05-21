#!/usr/bin/env bash
# Melvin Operations OS — deploy from gulfshores to GitHub Pages
# Run this from gulfshores@gulfshores
# Usage: bash scripts/deploy-gulfshores.sh

set -e

REPO="thebardchat/melvin_operations_os"
DIR="$HOME/repos/melvin_operations_os"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Melvin Operations OS — gulfshores deploy"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# ── 1. Clone or pull ──────────────────────────────────────────────────────────
if [ -d "$DIR/.git" ]; then
  echo "→ Pulling latest main..."
  git -C "$DIR" checkout main
  git -C "$DIR" pull origin main
else
  echo "→ Cloning repo..."
  mkdir -p "$HOME/repos"
  git clone "https://github.com/$REPO.git" "$DIR"
fi

cd "$DIR"

# ── 2. Install dependencies ───────────────────────────────────────────────────
echo ""
echo "→ Installing dependencies..."
npm install

# ── 3. Build for GitHub Pages ─────────────────────────────────────────────────
echo ""
echo "→ Building (base: /melvin_operations_os/)..."
VITE_BASE_PATH=/melvin_operations_os/ npm run build

echo "  Build complete: $(du -sh dist | cut -f1) in dist/"

# ── 4. Deploy to gh-pages branch ─────────────────────────────────────────────
echo ""
echo "→ Deploying to GitHub Pages..."
npm run deploy

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Done."
echo "  Live at: https://thebardchat.github.io/melvin_operations_os/"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
