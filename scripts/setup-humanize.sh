#!/usr/bin/env bash
# Install the `humanize` and `ai-check` writing skills for this repo.
#
# These two skills back the site's voice rules (no em dashes, banned vocabulary,
# human-sounding prose). `humanize` rewrites flat or AI-sounding copy; `ai-check`
# scores a draft for AI tells before it ships. Handy for QA-ing marketing copy.
#
# Run from anywhere:
#   bash scripts/setup-humanize.sh
#
# The clone lands OUTSIDE this repo (default ~/humanize) so it never shows up as
# an untracked file in tesora-www. install.sh symlinks the two skill dirs into
# your agent's skills directory, so a later `git pull` in the clone updates them.
#
# Override the clone location with HUMANIZE_DIR, e.g.:
#   HUMANIZE_DIR=/opt/humanize bash scripts/setup-humanize.sh

set -euo pipefail

REPO_URL="https://github.com/harshaneel/humanize.git"
HUMANIZE_DIR="${HUMANIZE_DIR:-$HOME/humanize}"

if [ -d "$HUMANIZE_DIR/.git" ]; then
  echo "Updating existing clone at $HUMANIZE_DIR"
  git -C "$HUMANIZE_DIR" pull --ff-only
else
  echo "Cloning $REPO_URL into $HUMANIZE_DIR"
  git clone "$REPO_URL" "$HUMANIZE_DIR"
fi

# `all` installs into ~/.claude, ~/.codex, and ~/.agents skill dirs.
# Pass a target (claude | codex | chatgpt | all) as the first argument to narrow it.
bash "$HUMANIZE_DIR/install.sh" "${1:-all}"

echo ""
echo "Done. Ask your agent to 'humanize this paragraph' or 'run ai-check on this text'."
