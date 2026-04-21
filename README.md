# Noyce IDE — Distribution

Public distribution repository for **Noyce IDE**, a desktop IDE for
safety-critical embedded development. It pairs a React/Vite frontend with a
Rust/Tauri native backend and a Gemini-driven multi-agent pipeline for
design, coding, review, and traceability workflows.

This repository **only hosts the download landing page and release
artifacts** — source code lives upstream at
[`Hitheshkaranth/noyce_ide`](https://github.com/Hitheshkaranth/noyce_ide).

---

## Download

Get the latest build from the [Releases page](https://github.com/Hitheshkaranth/noyce-ide-dist/releases)
or use the direct link below.

| Platform | Architecture | File |
|----------|--------------|------|
| macOS    | Apple Silicon (arm64) | [`Noyce_macOS_aarch64.dmg`](https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest/download/Noyce_macOS_aarch64.dmg) |
| Windows  | x64 | coming soon |
| Linux    | x64 | coming soon |

After installing, open the app and add your **Gemini API key** in the model
settings to enable the AI agent pipeline. Only Gemini is wired for
execution today — Ollama / Anthropic / OpenAI entries appear in the
model-selection UI but are not yet connected.

## What's in the Build

- **Desktop shell** — Tauri v2 + React 18 + TypeScript with the Monaco
  editor
- **Native backend** — Rust commands for filesystem IO, project scan, build
  execution, serial-port and debug-probe enumeration, and STM32 / CCS /
  MPLAB import helpers
- **Embedded import wizard** — STM32CubeIDE (`.ioc`), Code Composer Studio,
  MPLAB X / NetBeans, and generic folders
- **Compliance & traceability** — MISRA diagnostics, requirements explorer,
  traceability graph, document generation
- **Hardware panels** — peripheral registers, memory view, serial / Modbus
  monitors, signal viewer, debug probe panel, schematic viewer
- **Agent pipeline** — Gemini-driven system designer, coder, tester,
  reviewer, document generator, traceability monitor, UI/UX designer,
  frontend developer, API integrator

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Monaco, D3 / d3-force, xterm.js
**Native:** Rust, Tauri v2, `serialport`, `probe-rs`, `walkdir`, `tokio`

## Getting Started

1. Download and install the macOS build from the table above.
2. Launch **Noyce IDE** and open **Model Settings**.
3. Paste a Gemini API key. Default store config is provider `gemini`,
   model `gemini-2.0-flash`.
4. Use **Noyce: Import Project…** to pull in an STM32CubeIDE, CCS, MPLAB,
   or generic project.
5. Click **Build Project** — the native backend runs `make -j4`, resolving
   candidate build directories (`./`, `Debug/`, `STM32CubeIDE/Debug/`,
   `build/`). An `.ioc` file is detected but not translated into a build
   system; the project must already be buildable.
6. Trigger **Run Demo** or a stage entry to exercise the agent pipeline.

## Current Limitations

These carry over from the upstream release notes:

- STM32 import detects projects but does not synthesize a build system
  from `.ioc` metadata
- Build execution assumes a `make`-based project
- Several enterprise, MISRA, test, and hardware views are partially
  simulated
- Ollama / Anthropic / OpenAI UI providers are not wired for execution

## Building from Source

This repo does not contain source. To build locally, clone upstream:

```bash
git clone https://github.com/Hitheshkaranth/noyce_ide.git
cd noyce_ide
npm install
npm run tauri:dev        # run the desktop shell
npm run tauri:build      # produce a packaged installer
```

Prerequisites: Node 22, Rust + Cargo, Tauri v2 OS dependencies, plus
`make` / `arm-none-eabi-gcc` / `openocd` for embedded workflows.

---

## Repository Contents

| Path | Purpose |
|------|---------|
| `index.html` | Public download landing page served from this repo |
| `noyce_logo.png` | Brand asset |
| `README.md` | You are here |
| _GitHub Releases_ | Signed installer artifacts per version |

`index.html`'s primary **Download for macOS** button resolves to
`releases/latest/download/Noyce_macOS_aarch64.dmg`, so as long as every
published release includes a macOS DMG with that exact filename, the
button will always serve the newest build — no page edits required.

## Publishing a Release

When cutting a new version:

1. **Build the installers** from the upstream
   [`noyce_ide`](https://github.com/Hitheshkaranth/noyce_ide) repo
   (`npm run tauri:build` / `npm run package:mac` /
   `npm run package:win`) and collect the artifacts.
2. **Rename the macOS artifact** to exactly `Noyce_macOS_aarch64.dmg` so
   the landing-page link continues to resolve. Other platforms may keep
   their default filenames.
3. **Create the release** from this directory:

   ```sh
   gh release create vX.Y.Z \
     --title "Noyce IDE vX.Y.Z" \
     --notes-file RELEASE_NOTES.md \
     ./Noyce_macOS_aarch64.dmg \
     ./Noyce_X.Y.Z_x64-setup.exe \
     ./Noyce_X.Y.Z_x64_en-US.msi
   ```

4. **Verify** the `latest` alias updated:

   ```sh
   gh release view --repo Hitheshkaranth/noyce-ide-dist
   curl -I https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest/download/Noyce_macOS_aarch64.dmg
   ```

   A `302` redirect to the new tag confirms the landing page is serving
   the fresh build.

5. **Do not edit `index.html`** unless the artifact filename, size label,
   or platform matrix changes.

### Release notes template

```md
## Noyce IDE vX.Y.Z

### Downloads
- **macOS** (Apple Silicon) — `Noyce_macOS_aarch64.dmg`
- **Windows** — `Noyce_X.Y.Z_x64-setup.exe` / `Noyce_X.Y.Z_x64_en-US.msi`

### Highlights
- …

### Fixed
- …

### Known issues
- …
```

---

## License

Private / proprietary. For support or enterprise licensing, contact the
maintainers.
