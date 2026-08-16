# Noyce IDE v2.0.3 Release

Follow-up to `2.0.2`. Surfaces open as themselves, and code viewing belongs to the native Code-OSS editor.

## Changes

- **Traceability Graph opens full pane.** The tile used to open the editor shell with the graph docked into a secondary rail — a tile named after a graph gave you an empty editor and a side strip. Every launcher tile now opens its own surface. Fitted to a whole pane the graph sits at 65% rather than 21%, so requirement, source and test labels are readable without zooming.
- **The webview's Monaco pane is retired from the launcher.** Code-OSS is already the editor in that window, with the explorer, tabs, git decorations and language services; the panel was mirroring the host's open file into a second, weaker copy.
- **Three mirroring paths removed**, each of which also forced the panel onto the editor surface (`OPEN_FILE` and `REPLACE_OPEN_FILES` both set `activeView: 'editor'`): the initial-file hydration on project load, the shared-workspace sync, and the full-shell's "a file is open, so show the editor" rule.
- **`Open` from a Noyce surface opens the native editor** at the requested line — via `vscode.open`, so registered custom editors (Markdown WYSIWYG, PDF viewer) still take precedence — instead of revealing the webview shell.
- The surface count on the launcher is derived from the grid instead of written down; it read "Twenty-one" while twenty-six tiles were rendered.

## Fixes to analysis surfaces

- **Register Knowledge could never index a manual inside the IDE.** It downloaded the vendor PDF and then reported *No reference manual indexed* with `No "GlobalWorkerOptions.workerSrc" specified.` pdf.js decides it is running under Node by checking that it is *not* inside Electron, and the extension host is exactly that, so it took its browser path and demanded a worker — while under plain `node` the same call parses a 1,892-page manual in 2.2s. With the worker path set, indexing completes: the TI **SPMS433** datasheet yields **876 registers, 654 with bit fields, 592 documented rules**, each page-cited.
- **Code Scanning always fell back to sample findings.** `codeql database analyze` was given `--download` unconditionally, sending the CLI to GitHub's package registry for `codeql/cpp-queries`; a CLI older than the one that published the pack cannot parse the manifest it gets back (`Unrecognized field "digest"`). The flag is now passed only when CodeQL came from `PATH` — the vendored bundle ships its own query packs, so the suite resolves locally and the scan runs offline. A real `security-extended` run over the firmware now completes and reports honestly (0 alerts on this codebase).
- **Firmware Memory stopped giving TI projects STM32CubeIDE instructions.** A Code Composer project links with `armcl` and a `.cmd` command file and has neither `-Wl,-Map=` nor those menus — and the analyser reads GNU ld maps only, so following the advice would not have populated the view either. The empty state now names the linker it found and states what is not supported.

## Screenshots

Every capture in the README is taken from the running Code-OSS build with the `/office` **Canister Main Controller** firmware loaded, and the analysis surfaces are captured **after** their analysis has run — CBMC 6.9.0 with 70/70 properties discharged, a completed CodeQL scan, the indexed reference manual.

---

# Noyce IDE v2.0.2 Release

A correctness release for the workbench surface. Every fault below was found by reading the rendered views in the running Code-OSS build with a real `/office` firmware project loaded, and every fix was verified by measuring the live DOM there — none of them is a type error, a lint error, or something the test suite would have caught.

## Fixes

- **The React mount node had no height.** `#root` was `height: auto` and collapsed to its content — 203px inside a 793px window — so every `h-full` below it resolved against a collapsed box and self-sizing panes (the traceability graph most visibly) drew into a fraction of their pane.
- **Every HeroUI button was rendering without its surface.** Cascade layers are ordered by first mention, and `components` (HeroUI) was registered before `base` (Tailwind preflight), so preflight's `button { background-color:#0000; border-radius:0 }` overrode `.button { background-color: var(--button-bg) }` product-wide. Primary actions read as plain text. Undone in the base layer, so component defaults return and call-site utilities still win.
- **Traceability graph** now fits the whole graph including node labels (fitting on node circles alone clipped the outermost names), re-centres its force simulation when the pane resizes instead of orbiting the size it was constructed with, and re-frames on **Reset** rather than snapping to a fixed 100% zoom.
- **Editor status bar** no longer describes a file that is not open: the `plaintext` chip, the static `MISRA` chip and a three-segment bar hardcoded to 45/30/25 are gone. It reports the file, its language when known, and the trace-tag count — the only measured value it ever had. It also stops printing a project-root file's name twice and stops advising you to open a project folder when one is open.
- **CI/CD Pipeline** header no longer shows a fabricated `DCO-5000-103 Qualification Build` identifier for every project and run; the `YAML Source` tab no longer wraps and clips inside its own pill.
- **Coupling matrix** labels elide from the middle, so `AUTO_SEQUENCE.c` and `AUTO_SEQUENCE.h` no longer truncate to the same `AUTO_SEQU…` in adjacent rows and columns.
- **Test Explorer** `AI Generate` / `Run All` and the **Static Analysis** toolbar (`Scan`, `Refresh`, `Fix All`, `Export Findings`) render as buttons.
- **DO-178C Documents** no longer offers two identical `Blank SRS` buttons in its empty state.
- Secondary-sidebar and bottom-panel section headers can grow with their content instead of clipping at a fixed height.

## Tooling

- `npm run qc:capture` drives the running Code-OSS build through all 26 Noyce surfaces and screenshots each one, with readiness measured on the pixels so a blank pane cannot pass.
- `npm run test:qc` holds the repository to nine UI/host invariants, each encoding a fault that shipped once.

---

# Noyce IDE v2.0.1 Release

## Fixes

- Fixed Data & Control Coupling access from the Compliance Dashboard in the native Code-OSS shell.
- Improved coupling analysis for embedded C projects by handling preprocessor directives and declaration-only `extern` globals correctly.
- Fixed Quality Trend metric calculation/export behavior and verified screen updates after issue fixes.
- Fixed DO-178C document workflow regressions, including generated DOCX opening and document editor launch behavior.
- Fixed STM32 workflow regressions around `.ioc` pin configuration parsing and package fallback handling.

---

# Noyce IDE v1.0.0 "Lovelace" Release

We are proud to announce the first stable release of **Noyce IDE**, the world's first AI-native development environment designed specifically for safety-critical embedded systems.

## Key Highlights

- **AI Agent Pipeline:** A six-step automated engineering workflow (Designer -> Coder -> Tester -> Reviewer -> Doc Gen -> Traceability).
- **Safety-First Traceability:** Automated requirement mapping and @req/@verification annotation scanning.
- **Embedded Mastery:** Deep integration with STM32CubeIDE and CCS project imports.
- **Hardware Control:** Live register views, memory monitors, and serial/Modbus diagnostics.
- **Modern Tech Stack:** Built with Tauri v2, React 18, and Rust for peak desktop performance.

## Enhancements in this Release

- **AI Studio Sync:** New `distill` mechanism to synchronize local codebase context with Google AI Studio.
- **Improved Visuals:** Revamped TitleBar, TopBar, and Welcome screens with a high-fidelity "Noyce" aesthetic.
- **Build System:** Enhanced native build directory resolution for complex project structures.
- **Stability:** Fixed UI lifecycle errors in the hardware recorder and store hooks.

## Installation

1. Download the installer for your platform from the [releases page](https://github.com/Hitheshkaranth/noyce-ide-dist/releases).
2. Run the installer and follow the on-screen instructions.
3. Add your Gemini API key in the Model settings to enable the AI pipeline.

---
*Noyce IDE is private and proprietary. For support or enterprise licenses, contact the maintainers.*
