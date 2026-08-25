# Noyce IDE v2.0.4 Release

Compliance stops being a reading of the current disk and becomes a record. Every surface here used to answer *what is true right now* — useful while working, useless as evidence, because two people on two days saw two different answers and neither could name the configuration the answer was about. This release adds the thing a certification authority actually asks for: as of this commit, what was measured, by what, and what is still outstanding.

## Compliance Run — a new surface

A single command freezes the configuration (commit, working-tree state, assurance level), executes every evidence producer in order, and writes an append-only record under `.noyce/compliance-runs/`. Runs are comparable: the diff reports **objectives**, not percentages — "A-7 objective 5 stopped being satisfied" rather than "MC/DC fell from 82% to 79%". The `assessmentDigest` excludes timestamps and durations, so an unchanged tree reproduces it exactly and a regression is detectable rather than plausible.

Reachable from the launcher, the command palette (**Take a Compliance Run**) and the Welcome grid.

## Annex A is now reported against its real denominators

`annex-a.ts` modelled all 71 Level A objectives across the ten tables and reported coverage as a ratio — and nothing imported it but its own test. The dashboard ran on a 69-objective paraphrase whose Table A-5 carried seven objectives, the DO-178B shape, short exactly the two DO-178C parameter-data-item objectives.

- The assessment is now the status authority everywhere, including the signed certification package. A table with one measured objective out of thirteen reports **"1 of 13"** and can never render as a pass.
- Producers map to objectives through a claim registry that ships only the four mappings this codebase had already established (A-7.5/6/7 structural coverage, A-7.8 coupling), each recording *why* it holds. Everything else is mapped by the project in `.noyce/annex-a/map.json`, read from its own licensed copy of the standard.
- A producer with no mapping still contributes: a table-level claim counted as **unmapped and therefore unauditable**, never as coverage.
- Objective wording is licensed by RTCA and is not shipped. It loads from `.noyce/annex-a/text.json` or stays absent — objectives are identified by number until you supply your copy. Nothing invents a fallback.

## A producer that did not run claims nothing

Not a zero, not a failing claim, not a satisfied claim over an empty set. The fact that it did not run is recorded separately.

- **Coverage analysed but never measured** produces no claim. Obligations computed from source are the denominator; only an instrumented run supplies a numerator.
- **CBMC with zero properties** proves nothing, and says so rather than passing.
- **Coupling with no component pairs** is not fully exercised coupling.
- **The sample trap.** `cbmc-runner` and `codeql-runner` fall back to seeded sample results when the tool is not installed, so a panel always has something to render. That is right for a panel and is fabricated evidence in a signed package. Both results carry `source: 'sample'`, and the run treats it as *did not run*.
- **An unknown working-tree state** is recorded as unknown and blocks export, never rounded down to clean.

## Verification as data, not prose

SVCP and SVR existed as section templates a model wrote prose into, so Tables A-6 and A-7(1–4) had never had a numerator. Verification cases and results are now first-class records — requirements verified, method, normal-range or robustness, host / simulator / target, expected result — with requirements-based coverage computed from them.

- A case with no result is **not-run**. Never a pass, never dropped from the denominator.
- A host result does not discharge target compatibility. A hundred passing host results say nothing about the target computer.
- An unreviewed case is inadmissible at Levels A and B, where the correctness of the verification procedures is itself an objective.
- Level-specific objectives are attributed **only** when requirements carry a level. A project that records none is told its A-6 and A-7 level objectives cannot be attributed, rather than having the gap read as coverage.
- A test the runner never executed leaves its case not-run; a test matching no case is an orphan and discharges nothing.

**Coverage shortfall is resolved, not just measured.** Every uncovered statement, decision and MC/DC obligation is classified — missing case, dead code, deactivated code with its means of prevention, or justified with rationale and approver — and unresolved shortfall blocks the objective regardless of the percentage. A missing verification case is never a resolution.

## Process records — the half of Annex A no analyser reaches

- **Problem reports and change control.** Classification, affected baseline, linked requirements and findings, disposition, approver. A report closed with no disposition, or confirmed by the same person who dispositioned it, is refused. `resolved` counts as open until someone confirms it. Failing verification results raise a report automatically, keyed by case so a persistently failing case keeps one report rather than one per run.
- **Review records with independence.** Independence is **derived** from author ≠ reviewer, not a boolean somebody sets — that is exactly the field a programme under schedule pressure would set wrongly. Per-level rules: A/B broad, C narrowed to the verification data, D none.
- **Conformity review.** The eight-question checklist an SOI #4 opens with — baselines, open problem reports, configuration identification, requirements verified, target execution, coverage, reviews, tool qualification — hashed into the run beside the assessment. A question the recorded evidence cannot answer is **not a pass**; it blocks, and says what is missing.

Together these change what a `process-only` table means: a table backed by records now reads as *substantiated by a named person on a date*, which is what the objective asks for, rather than *proved by a tool*, which it never is.

## Under the hood

- New host command `project/gitStatus` (fixed argument list, no shell) in the Rust core. The build-command allowlist is make/cmake/ninja/cargo and rightly refuses git, so configuration identification needed its own command.
- The certification package gains an **Annex A Objective Coverage** section and a **Compliance Run** section, both hashed like every other. A package built from live state now says it cannot be reproduced.
- 149 tests across four new suites (`test:annex-a`, `test:compliance-run`, `test:verification`, `test:process`), wired into `test:all`.
- 15 unreferenced first-party files removed: two duplicate STM32F407 SVD fixtures superseded by the real parser, an adapter table superseded by the catalog, a notification service superseded by the store reducer, six unused components, and two one-off scripts sitting in the repository root.

## Known gaps

Stated rather than hidden. The Software Configuration Index is not yet produced from the real build, so the conformity review reports "no configuration index has been produced" and question CR-3 fails honestly. The DO-330 tool-qualification register and the CI `--gate` entry point are not in this release.

---

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

- **AI Agent Pipeline:** Nine specialist personas on one auditable thread (Designer, Coder, Tester, Reviewer, Doc Gen, Traceability, plus UI/UX, Frontend, and API Integrator).
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
