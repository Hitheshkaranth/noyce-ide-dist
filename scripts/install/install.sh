#!/usr/bin/env bash
# Noyce IDE — one-line macOS installer.
#
#   curl -fsSL https://raw.githubusercontent.com/<owner>/<repo>/main/scripts/install/install.sh | bash
#
# Downloads the latest Apple-Silicon DMG from GitHub Releases, copies Noyce IDE.app
# into /Applications, and clears the quarantine flag so it opens without the
# "unidentified developer / damaged" Gatekeeper prompt (the build is unsigned).
set -euo pipefail

REPO="${NOYCE_REPO:-Hitheshkaranth/noyce-ide-dist}"   # override with NOYCE_REPO=owner/repo
APP="Noyce IDE.app"
DEST="/Applications"

red()  { printf '\033[31m%s\033[0m\n' "$*"; }
ok()   { printf '\033[32m%s\033[0m\n' "$*"; }
info() { printf '\033[36m%s\033[0m\n' "$*"; }

[[ "$(uname -s)" == "Darwin" ]] || { red "Noyce IDE installs on macOS only."; exit 1; }
if [[ "$(uname -m)" != "arm64" ]]; then
  red "This build targets Apple Silicon (arm64); your Mac is $(uname -m)."; exit 1
fi

info "==> Finding the latest Noyce IDE release for $REPO"
# Pick the first darwin-arm64 .dmg asset from the latest release.
API="https://api.github.com/repos/$REPO/releases/latest"
DMG_URL="$(curl -fsSL "$API" \
  | grep -oE '"browser_download_url": *"[^"]*darwin-arm64[^"]*\.dmg"' \
  | head -1 | sed -E 's/.*"(https[^"]+)"/\1/')"
[[ -n "$DMG_URL" ]] || { red "No darwin-arm64 .dmg found in the latest release of $REPO."; exit 1; }

TMP="$(mktemp -d)"
trap 'hdiutil detach "$MNT" >/dev/null 2>&1 || true; rm -rf "$TMP"' EXIT
DMG="$TMP/noyce-ide.dmg"

info "==> Downloading $(basename "$DMG_URL")"
curl -fSL --progress-bar "$DMG_URL" -o "$DMG"

info "==> Mounting and installing to $DEST"
MNT="$TMP/mnt"; mkdir -p "$MNT"
hdiutil attach "$DMG" -nobrowse -quiet -mountpoint "$MNT"
[[ -d "$MNT/$APP" ]] || { red "DMG does not contain $APP."; exit 1; }

if [[ -d "$DEST/$APP" ]]; then
  info "    Removing previous install"
  rm -rf "$DEST/$APP"
fi
cp -R "$MNT/$APP" "$DEST/"
hdiutil detach "$MNT" >/dev/null 2>&1 || true

# Unsigned build: clear quarantine so Gatekeeper lets it open normally.
xattr -dr com.apple.quarantine "$DEST/$APP" 2>/dev/null || true

ok "==> Installed: $DEST/$APP"
ok "    Launch it from Spotlight or:  open \"$DEST/$APP\""
