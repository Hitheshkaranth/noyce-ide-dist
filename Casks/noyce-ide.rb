# Homebrew cask for Noyce IDE (Apple Silicon).
#
# Use it via a tap:
#   brew tap Hitheshkaranth/noyce https://github.com/Hitheshkaranth/noyce-ide-dist
#   brew install --cask noyce-ide
#
# `version` and `sha256` are bumped automatically by .github/workflows/release-macos.yml
# on every tagged release.
cask "noyce-ide" do
  version "2.0.9"
  sha256 "e263f20992f8be249092b60bf00097ffcb6f9bb14cbe5e93d112a83a3db8b7d1"

  url "https://github.com/Hitheshkaranth/noyce-ide-dist/releases/download/v#{version}/NoyceIDE-#{version}-darwin-arm64.dmg",
      verified: "github.com/Hitheshkaranth/noyce-ide-dist/"
  name "Noyce IDE"
  desc "Hardware & firmware IDE built on Code-OSS (pin config, schematic, BoM, compliance)"
  homepage "https://noyce-ide.tech"

  depends_on arch: :arm64

  app "Noyce IDE.app"

  # Unsigned build — clear the quarantine flag so Gatekeeper opens it normally.
  postflight do
    system_command "/usr/bin/xattr",
                   args: ["-dr", "com.apple.quarantine", "#{appdir}/Noyce IDE.app"]
  end

  zap trash: [
    "~/.noyce-ide",
    "~/Library/Application Support/Noyce IDE",
    "~/Library/Caches/com.noyce.ide",
    "~/Library/Preferences/com.noyce.ide.plist",
    "~/Library/Saved Application State/com.noyce.ide.savedState",
  ]
end
