<div align="center">

<img src="icons_resources/logo_horizontal.png" alt="Noyce IDE" width="620" />

### The AI-native IDE for safety-critical embedded engineering

A Code-OSS desktop workbench that puts **requirements, source, DO-178C certification evidence, hardware tooling and a multi-agent AI pipeline** in one window, for firmware teams working to DO-178C, ISO 26262 and MISRA C.

[![Version](https://img.shields.io/badge/version-2.0.6-00e676?style=flat-square)](https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest)
[![CI](https://github.com/Hitheshkaranth/noyce_ide/actions/workflows/ci-runtime-smoke.yml/badge.svg)](https://github.com/Hitheshkaranth/noyce_ide/actions/workflows/ci-runtime-smoke.yml)
[![Code OSS](https://img.shields.io/badge/Built%20on-Code--OSS-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)](https://github.com/microsoft/vscode)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![shadcn/ui](https://img.shields.io/badge/UI-shadcn%2Fui-000000?style=flat-square)](https://ui.shadcn.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Rust](https://img.shields.io/badge/Rust-Sidecar-CE412B?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](#license)

[**What's new**](#whats-new-in-206) · [**Tour**](#a-tour-of-the-ide) · [**Features**](#features) · [**Quick start**](#quick-start) · [**Architecture**](#architecture) · [**Release notes**](RELEASE_NOTES.md) · [**Download**](https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest)

</div>

---

## Why Noyce IDE

Safety-critical firmware work is usually spread across a requirements manager, two static analysers, a traceability spreadsheet, a coverage tool, a CI dashboard, an AI assistant and a vendor IDE. None of them knows what the others measured, so the certification evidence is assembled by hand at the end.

Noyce IDE keeps all of it in one Code-OSS workbench, against the code that is actually open:

- **Evidence is measured, not asserted.** Each DO-178C Annex A objective is graded only from its own mapped evidence. A producer that did not run claims nothing, sample data is never counted, and an objective is *satisfied* only after an independent human review recorded on the project roster.
- **Agents do the drafting; engineers decide.** Specialist agents (system designer, coder, tester, reviewer, document generator…) draft requirements, tests, documents and judgment decisions. Every agent edit becomes a change set gated on build, unit tests and MISRA, and every proposal waits for a person to accept it.
- **The whole DO-178C document set.** 17 life-cycle documents (PSAC, SDP, SVP, SCMP, SQAP, SRS, SDD, SVCP, SVR, SAS, SCI and the rest) authored from the workspace, completed through a review queue and baselined with a hash.
- **Real tools underneath.** CBMC, CodeQL, cppcheck/clang-tidy, LLVM MC/DC coverage, probe-rs, GNU ld maps and CMSIS-SVD — run by the IDE, with their results kept as reproducible records under the project's `.noyce/` folder.
- **Hardware-aware.** Pin maps from STM32CubeMX and TivaWare, register views from SVD and the vendor reference manual, HardFault decoding, serial and logic-analyser views.
- **Local-first AI.** Works with LM Studio, Ollama and vLLM on your own hardware, or with Gemini, Anthropic and OpenAI, and shows the live model, token rate and usage for every call.

---

## What's new in 2.0.6

**A new interface.** The whole IDE moved from HeroUI to **shadcn/ui** (Radix primitives, Tailwind 4, React 19) on a single dark theme, with one visual language for work in progress across every surface.

**DO-178C DAL A, end to end.** Taking a real motor-controller code base from prototype to DAL A inside the IDE drove this release:
- **Document completion.** Every open item in a document is classified as a proposal, an engineer decision or missing evidence, and each has a way to close. A document can be issued only when nothing is open.
- **Agent-proposed decisions.** Engineering-judgment sections (software level, partitioning, certification basis…) are drafted by an agent with rationale, evidence and confidence, and wait in a review queue. Acceptance is recorded as an independent review.
- **Requirements and design.** An HLR editor with per-requirement lint, system-requirement import (CSV, ReqIF-lite, Markdown), and LLR authoring accepted only by a human review.
- **Real independence.** Reviews carry who authored and who reviewed; AI reviews are labelled AI-assisted and earn no independence credit.
- **Problem reports and CCB.** AC/AMC 20-189 classification, safety effect, CCB decisions and independent closure.
- **Set consistency.** Contradictions between documents block a baseline unless a named person records a waiver.
- **Verification tooling.** Requirements-based tests per HLR/LLR, CBMC harnesses per function with a vacuity check, and on-target test runs over probe-rs and RTT.

**Annex A objective workbench.** Map each objective to the evidence that discharges it, and record checklists and qualified reviews against it. All 71 Level A objectives are reported as ratios.

**AI Orchestrator, live.** The kanban board shows each card's phase, tokens and rate as it runs. Compliance objectives become cards with one canonical id, and a worker pool runs them concurrently.

**Accuracy fixes.**
- Zero findings counts as a clean scan only if a scan actually ran.
- CodeQL is not counted as measured by default.
- A cyber posture score needs a vulnerability source.
- Exported HTML reports escape the text they include.
- Agent file writes are confined to the project.
- A failed audit-ledger write is recorded rather than lost.

**Faster scans.** Source scans skip the IDE's own `.noyce/` output: the annotation scan went from 25,356 files to 113, and the workspace tree from 15,003 nodes to 149.

**Separate embedding server.** Semantic Search and agent grounding can embed through their own server (for example a local Ollama `nomic-embed-text`) when the chat server cannot embed, set under AI Models → Embeddings with a save-and-test check.

**Agents panel.**
- Shows the model the server actually serves.
- Sends the API key to key-protected vLLM servers.
- No longer overlaps itself in a narrow sidebar.

The full history is in [docs/RELEASE_NOTES.md](RELEASE_NOTES.md).

---

## A tour of the IDE

> Every screenshot is captured from the running **Code-OSS Electron build** with a **real firmware project open**: the STM32G431 **H-Bridge motor controller** taken to DAL A inside the IDE. Analyses (MISRA, CBMC, CodeQL, MC/DC, coupling, architecture) were run against that project for the capture. Nothing here is a mockup.

### Getting started

<img src="docs/screenshots/2.0.6/00-getting-started.png" alt="Getting Started: recent projects and the grid of workbench surfaces" />

Recent projects, project creation and import (STM32CubeIDE, TI Tiva/CCS, MPLAB X, generic folder), and one-click access to every surface.

### AI

#### AI Orchestrator: a kanban board of specialist agents

<img src="docs/screenshots/2.0.6/01-ai-orchestrator.png" alt="AI Orchestrator kanban with live model, concurrency and sprint progress" />

Objectives become cards routed to specialist agents along a handoff chain. The header reports the live model, its context window, concurrency, sprint progress and items awaiting review. Cards show what actually ran — tokens, rate, evidence — and never claim work that did not happen.

<table>
<tr>
<td width="50%"><b>AI Models</b>: global model, per-agent overrides, endpoint, API key, generation and concurrency settings<br><img src="docs/screenshots/2.0.6/02-ai-models.png" alt="AI Models" /></td>
<td width="50%"><b>Agents Chat</b>: persona chat with handoff, edit proposals and the live model<br><img src="docs/screenshots/2.0.6/03-agents-chat.png" alt="Agents Chat" /></td>
</tr>
</table>

### Requirements and traceability

#### Requirements & Evidence

<img src="docs/screenshots/2.0.6/05-requirements.png" alt="Requirements register with per-requirement evidence ledger" />

The requirement register read from the life-cycle documents and `@req` annotations, with a per-requirement evidence ledger linking design, source, tests and reviews.

<table>
<tr>
<td width="50%"><b>Requirements Authoring</b>: HLRs written into SRS-001 with lint and system trace<br><img src="docs/screenshots/2.0.6/06-requirements-authoring.png" alt="Requirements Authoring" /></td>
<td width="50%"><b>Low-Level Requirements</b>: LLR drafts per function, accepted by human review<br><img src="docs/screenshots/2.0.6/07-low-level-requirements.png" alt="Low-Level Requirements" /></td>
</tr>
<tr>
<td width="50%"><b>Traceability Graph</b>: requirement ↔ document ↔ source ↔ test<br><img src="docs/screenshots/2.0.6/08-traceability-graph.png" alt="Traceability Graph" /></td>
<td width="50%"><b>Annotation Navigator</b>: every <code>@req</code> / <code>@verification</code> tag in the code<br><img src="docs/screenshots/2.0.6/09-annotations.png" alt="Annotation Navigator" /></td>
</tr>
<tr>
<td width="50%"><b>Semantic Search</b>: retrieval over code and requirements through a configurable embedding server<br><img src="docs/screenshots/2.0.6/04-semantic-search.png" alt="Semantic Search" /></td>
<td width="50%"></td>
</tr>
</table>

### DO-178C compliance

#### Compliance Dashboard

<img src="docs/screenshots/2.0.6/10-compliance-dashboard.png" alt="Compliance Dashboard with Annex A objectives and structural coverage" />

DO-178C objectives for the selected level, graded from mapped evidence: requirements linked, design allocation, verification, analysis findings and structural coverage, with the Annex A objective table below. Objectives route to their specialist agent, and one action assembles the signed **Certification Evidence Package**.

#### Compliance Run: one reproducible record

<img src="docs/screenshots/2.0.6/11-compliance-run.png" alt="Compliance Run record with measured objectives" />

A run freezes the configuration (commit, tree state, level), executes every evidence producer and writes a hashed, append-only record. Runs compare at the level of objectives, so a regression reads as *"A-7 objective 5 stopped being satisfied"*.

<table>
<tr>
<td width="50%"><b>Certification Readiness</b>: readiness score, blockers and a ranked closure queue<br><img src="docs/screenshots/2.0.6/12-certification-readiness.png" alt="Certification Readiness" /></td>
<td width="50%"><b>Evidence Records</b>: verification cases, problem reports, CCB, change sets, MISRA deviations, reviews, roster, tool qualification<br><img src="docs/screenshots/2.0.6/13-evidence-records.png" alt="Evidence Records" /></td>
</tr>
<tr>
<td width="50%"><b>DO-178C Documents</b>: the 17-document set, authored, completed and baselined<br><img src="docs/screenshots/2.0.6/23-do178c-documents.png" alt="DO-178C Documents" /></td>
<td width="50%"><b>Document Reader</b>: formal <code>.docx</code> output with cover, TOC and numbered sections<br><img src="docs/screenshots/2.0.6/24-document-reader.png" alt="Document Reader" /></td>
</tr>
<tr>
<td width="50%"><b>Immutable Audit Trail</b>: hash-chained ledger of every review, decision and export<br><img src="docs/screenshots/2.0.6/26-audit-trail.png" alt="Immutable Audit Trail" /></td>
<td width="50%"><b>Review Workflow</b>: reviews with author / reviewer independence<br><img src="docs/screenshots/2.0.6/27-review-workflow.png" alt="Review Workflow" /></td>
</tr>
</table>

### Verification and analysis

#### MC/DC structural coverage, measured

<img src="docs/screenshots/2.0.6/19-mcdc-coverage.png" alt="MC/DC Structural Coverage with measured per-module coverage" />

Statement, decision and MC/DC obligations come from the project's own source. Coverage is measured with LLVM `-fcoverage-mcdc` on the host and attributed to the module under test, and the test environment is stated alongside the numbers.

<table>
<tr>
<td width="50%"><b>Static Analysis (MISRA)</b>: cppcheck / clang-tidy findings decoded by rule, with fix and deviation flows<br><img src="docs/screenshots/2.0.6/14-misra-diagnostics.png" alt="MISRA Diagnostics" /></td>
<td width="50%"><b>Analysis Tools</b>: the 755-tool catalogue filtered to your stack, with a runnable subset<br><img src="docs/screenshots/2.0.6/15-analysis-tools.png" alt="Analysis Tools" /></td>
</tr>
<tr>
<td width="50%"><b>CBMC Formal Verification</b>: bounded model checking with per-LLR harnesses<br><img src="docs/screenshots/2.0.6/16-formal-verification.png" alt="CBMC Formal Verification" /></td>
<td width="50%"><b>CodeQL Code Scanning</b>: SARIF alerts with data-flow paths<br><img src="docs/screenshots/2.0.6/17-codeql-scanning.png" alt="CodeQL Code Scanning" /></td>
</tr>
<tr>
<td width="50%"><b>Test Explorer</b>: requirement-linked tests, host runs and on-target runs<br><img src="docs/screenshots/2.0.6/18-test-explorer.png" alt="Test Explorer" /></td>
<td width="50%"><b>Data & Control Coupling</b>: DO-178C A-7 objective 8 from call edges and shared data<br><img src="docs/screenshots/2.0.6/20-coupling.png" alt="Data and Control Coupling" /></td>
</tr>
<tr>
<td width="50%"><b>Object Code Traceability</b>: instructions the DWARF line table cannot attribute to source<br><img src="docs/screenshots/2.0.6/21-object-code-trace.png" alt="Object Code Traceability" /></td>
<td width="50%"><b>Quality Trend</b>: findings and coverage over time<br><img src="docs/screenshots/2.0.6/22-quality-trend.png" alt="Quality Trend" /></td>
</tr>
<tr>
<td width="50%"><b>Cyber Assurance</b>: source-derived SBOM, CVE and CWE posture (DO-326A / ED-202A)<br><img src="docs/screenshots/2.0.6/25-cyber-assurance.png" alt="Cyber Assurance" /></td>
<td width="50%"><b>CI/CD Pipeline</b>: analysis, build, unit, HIL and document stages<br><img src="docs/screenshots/2.0.6/29-build-pipeline.png" alt="CI/CD Pipeline" /></td>
</tr>
</table>

### Code and architecture

#### Project Graph

<img src="docs/screenshots/2.0.6/33-project-graph.png" alt="Project Graph of functions, files and macros" />

Functions, files and macros as an entry-flow graph, with code ownership (project / vendor / generated), libraries, callers, callees and macro use for the selected symbol.

<table>
<tr>
<td width="50%"><b>System Architecture</b>: a C4 model recovered from source, with Structurizr / Mermaid / draw.io export<br><img src="docs/screenshots/2.0.6/31-architecture.png" alt="System Architecture" /></td>
<td width="50%"><b>Archify Diagrams</b>: architecture diagrams rendered and validated in the IDE<br><img src="docs/screenshots/2.0.6/32-archify.png" alt="Archify Diagrams" /></td>
</tr>
<tr>
<td width="50%"><b>Project Truth Graph</b>: what the project states versus what the code shows<br><img src="docs/screenshots/2.0.6/34-project-truth-graph.png" alt="Project Truth Graph" /></td>
<td width="50%"><b>Project Templates</b>: start from a firmware template<br><img src="docs/screenshots/2.0.6/30-project-templates.png" alt="Project Templates" /></td>
</tr>
<tr>
<td width="50%"><b>Team Activity</b>: who did what across the project<br><img src="docs/screenshots/2.0.6/28-team-activity.png" alt="Team Activity" /></td>
<td width="50%"></td>
</tr>
</table>

### Hardware

<table>
<tr>
<td width="50%"><b>Schematic Viewer</b>: searchable schematic PDF with auto-BoM and an inferred component graph<br><img src="docs/screenshots/2.0.6/35-schematic.png" alt="Schematic Viewer" /></td>
<td width="50%"><b>BoM Studio</b>: bill of materials from the schematic<br><img src="docs/screenshots/2.0.6/36-bom-studio.png" alt="BoM Studio" /></td>
</tr>
<tr>
<td width="50%"><b>Pin Configurator</b>: the MCU package and pin assignments from <code>.ioc</code> or TivaWare source<br><img src="docs/screenshots/2.0.6/37-pin-configurator.png" alt="Pin Configurator" /></td>
<td width="50%"><b>Peripherals & Pin Map</b>: every peripheral and its pins from the detected configuration<br><img src="docs/screenshots/2.0.6/38-peripherals.png" alt="Peripherals and Pin Map" /></td>
</tr>
<tr>
<td width="50%"><b>Register Inspector</b>: CMSIS-SVD peripherals with bit-field decode<br><img src="docs/screenshots/2.0.6/39-register-inspector.png" alt="Register Inspector" /></td>
<td width="50%"><b>Register Knowledge</b>: the vendor reference manual indexed to page-cited registers<br><img src="docs/screenshots/2.0.6/40-register-knowledge.png" alt="Register Knowledge" /></td>
</tr>
<tr>
<td width="50%"><b>Firmware Memory & Stack</b>: flash/RAM budget from the GNU ld map and worst-case stack from <code>.su</code><br><img src="docs/screenshots/2.0.6/41-firmware-memory.png" alt="Firmware Memory and Stack" /></td>
<td width="50%"><b>Memory View</b>: target memory over the debug probe<br><img src="docs/screenshots/2.0.6/42-memory-view.png" alt="Memory View" /></td>
</tr>
<tr>
<td width="50%"><b>Debug Probe</b>: probe-rs attach, run control, flash and RTT<br><img src="docs/screenshots/2.0.6/43-debug-probe.png" alt="Debug Probe" /></td>
<td width="50%"><b>HardFault Analyzer</b>: Cortex-M CFSR/HFSR decoded, symbolised with the <code>.map</code><br><img src="docs/screenshots/2.0.6/44-fault-analyzer.png" alt="HardFault Analyzer" /></td>
</tr>
</table>

### Signals and lab

<table>
<tr>
<td width="50%"><b>Logic Analyzer</b>: SPI / PWM / SWO waveforms<br><img src="docs/screenshots/2.0.6/45-signal-viewer.png" alt="Logic Analyzer" /></td>
<td width="50%"><b>Serial Bridge</b>: real UART/USB serial I/O through the Rust sidecar<br><img src="docs/screenshots/2.0.6/46-serial-monitor.png" alt="Serial Bridge" /></td>
</tr>
<tr>
<td width="50%"><b>Modbus Monitor</b><br><img src="docs/screenshots/2.0.6/47-modbus.png" alt="Modbus Monitor" /></td>
<td width="50%"><b>Live Data Dashboard</b><br><img src="docs/screenshots/2.0.6/48-live-data.png" alt="Live Data Dashboard" /></td>
</tr>
<tr>
<td width="50%"><b>Energy Profiler</b><br><img src="docs/screenshots/2.0.6/49-energy-profiler.png" alt="Energy Profiler" /></td>
<td width="50%"><b>Data Recorder</b><br><img src="docs/screenshots/2.0.6/50-data-recorder.png" alt="Data Recorder" /></td>
</tr>
<tr>
<td width="50%"><b>HIL Test Runner</b><br><img src="docs/screenshots/2.0.6/51-hil-runner.png" alt="HIL Test Runner" /></td>
<td width="50%"><b>FPGA Workspace</b> and <b>Synthesis</b><br><img src="docs/screenshots/2.0.6/52-fpga-workspace.png" alt="FPGA Workspace" /></td>
</tr>
</table>

Surfaces that need a connected target (probe, serial, logic analyser) say so and show labelled simulated data until one is attached.

---

## Features

| Area | Surfaces |
| --- | --- |
| **AI** | AI Orchestrator (kanban, handoff chain, live model / tokens / rate, worker pool) · Agents Chat (personas, handoff, edit proposals) · AI Models (global + per-agent models, endpoint, API key, embedding server, concurrency) · Inline completions · code-lens agent actions · Google ADK runner · providers: LM Studio, vLLM, Ollama, Open WebUI, Gemini, Anthropic, OpenAI, OpenRouter, Claude / Codex / Gemini CLI |
| **Requirements** | Requirements & Evidence (per-requirement evidence ledger) · Requirements Authoring (HLR lint, system-requirement import) · Low-Level Requirements · Traceability Graph · Annotation Navigator · Semantic Search (separate embedding server, e.g. Ollama) |
| **DO-178C compliance** | Compliance Dashboard · Annex A objective workbench (all 71 Level A objectives) · Compliance Run (hashed, reproducible) · Certification Readiness · Evidence Records (verification cases, problem reports, CCB, change sets, MISRA deviations, reviews, SQA/CM/liaison, roster, tool qualification, parameter data) · Certification Evidence Package (SHA-256 anchored) · ISO 26262 framework setting and ASIL coverage levels |
| **Documents** | 17 DO-178C documents (PSAC, SDP, SVP, SCMP, SQAP, SRSTD, SDSTD, SCSTD, SRS, SDD, ICD, TRACE, SVCP, SVR, SECI, SCI, SAS) · completion workflow · agent-proposed decisions with review queue · baselines · formal `.docx` Document Reader · Markdown WYSIWYG editor |
| **Verification** | MC/DC + decision + statement coverage (LLVM, measured) · CBMC formal verification with per-LLR harnesses · CodeQL code scanning · MISRA static analysis (cppcheck, clang-tidy) · 755-tool analysis catalogue · Test Explorer (host + on-target) · Data & Control Coupling · Object Code Traceability · Quality Trend · Cyber Assurance (SBOM, CVE, CWE) |
| **Process** | Immutable hash-chained audit trail · Review Workflow with derived independence · Team Activity · change sets gated on build / tests / MISRA · CI/CD Pipeline |
| **Code & architecture** | Native Code-OSS editor · Project Graph (clustering by directory / layer / community) · Project Truth Graph · System Architecture (C4, Structurizr, Mermaid, draw.io) · Archify diagrams · Project Templates |
| **Hardware** | Schematic Viewer (OCR, auto-BoM, component graph) · BoM Studio · Pin Configurator · Peripherals & Pin Map · Register Inspector (SVD) · Register Knowledge (reference manual) · Firmware Memory & Stack · Memory View · Debug Probe (probe-rs) · HardFault Analyzer |
| **Signals & lab** | Logic Analyzer · Serial Bridge · Modbus Monitor · Live Data Dashboard · Energy Profiler · Data Recorder · HIL Test Runner · FPGA Workspace & Synthesis |
| **Importers & builds** | STM32CubeIDE / CubeMX `.ioc` · TI Tiva (TivaWare) / Code Composer Studio · MPLAB X · generic folder · portable Makefile builds from CubeIDE, CCS, Keil MDK and CubeMX projects |

---

## Quick start

### Download

Installers for macOS (Apple silicon) and Windows (x64) are published on the [distribution releases page](https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest).

They are also published to GitHub Packages as [`ghcr.io/hitheshkaranth/noyce-ide`](https://github.com/Hitheshkaranth/noyce-ide-dist/pkgs/container/noyce-ide):

```bash
oras pull ghcr.io/hitheshkaranth/noyce-ide:2.0.6      # or :latest
brew tap Hitheshkaranth/noyce https://github.com/Hitheshkaranth/noyce_ide
brew install --cask noyce-ide                         # macOS
```

### Build from source

Prerequisites: Node 22, Python 3, Git, and on Windows the Visual Studio Build Tools with the VC v142 Spectre libraries.

```bash
npm ci
npm run build                       # webview bundle (tsc + vite)

# macOS / Linux, with an already-prepared Code-OSS checkout
npm run workbench:launch -- /path/to/firmware

# Windows, first time
npm run codeoss:bootstrap:windows   # prepare third_party/code-oss
npm run workbench:launch
```

`npm run workbench:doctor` (or `workbench:doctor:windows`) diagnoses missing prerequisites. See [`docs/windows-code-oss-remediation.md`](https://github.com/Hitheshkaranth/noyce_ide/blob/main/docs/windows-code-oss-remediation.md) and [`docs/packaging-macos.md`](https://github.com/Hitheshkaranth/noyce_ide/blob/main/docs/packaging-macos.md).

For fast UI iteration without the desktop shell, `npm run dev` serves the React surfaces with sample data at `http://localhost:5173`.

### Verify

```bash
npm run check          # build + cargo check on the Rust sidecar
npm run test:all       # unit, integration and quality-invariant suites
npm run smoke:ui       # Playwright smoke (CI gate)
npm run qc:capture     # screenshot every surface from the running Code-OSS build
```

`qc:capture` needs the workbench running with a project open and the debug port enabled:

```bash
node apps/noyce-workbench/scripts/launch-checkout-workbench.mjs \
  --sync-product --remote-debugging-port=9222 /path/to/firmware
```

---

## Architecture

```text
Noyce IDE
├── Code-OSS desktop shell (Electron)
│   ├── Noyce product.json overlay + rebrand patch
│   └── First-party extensions
│       core-ui · compliance · lifecycle · agents · chat · hardware ·
│       telemetry · stm32 · fpga · project-graph · architecture
│
├── React 19 + TypeScript surfaces (src/, built by Vite)
│   ├── shadcn/ui on Radix + Tailwind 4, dark theme
│   └── compliance, documents, verification, AI, hardware, graphs …
│
├── Rust sidecar (services/noyce-core) — JSON-RPC over stdio
│   ├── workspace IO and project import (.ioc / CCS / MPLAB / Tiva)
│   ├── static analysis, MISRA, CBMC dispatch
│   └── serial, probe-rs debug bridge, hardware enumeration
│
└── Services
    ├── CodeGraph (packages/codegraph) — symbol index
    ├── noyce-adk-runner — Google ADK agent runner
    └── noyce-semantica — reference-manual indexing
```

**The project stays clean.** Everything the IDE generates for a project (evidence, documents, the audit ledger, analysis scratch) goes under `<project>/.noyce/`, which carries its own `.gitignore`. The IDE never writes to the project root or edits existing files unless you approve an agent change set.

Noyce-owned configuration is kept separate from the vendored Code-OSS checkout: `scripts/lib/codeoss-pin.json` pins the upstream commit and Node version, and the bootstrap renders `product.json`, applies the rebrand patch and copies the overlay assets.

### Repository layout

| Path | Role |
| --- | --- |
| `src/` | React surfaces and services (compliance, documents, verification, AI, hardware, graphs) |
| `extensions/` | First-party Code-OSS extensions |
| `packages/` | `codegraph` symbol index and `noyce-hardware` plugin |
| `services/` | Rust sidecar, ADK runner, Semantica |
| `crates/` | STM32 and Tiva importers, project model |
| `apps/noyce-workbench/` | Product template, checkout sync, overlay assets, rebrand patch |
| `third_party/code-oss/` | Pinned upstream Code-OSS |
| `tests/` | Unit, integration, invariant and Playwright suites |
| `scripts/` | Bootstrap, QC capture and release scripts |

---

## Build & release

| Workflow | Trigger | Output |
| --- | --- | --- |
| `ci-runtime-smoke.yml` | push / PR to `main` | build + Playwright smoke |
| `build-verify.yml`, `lint.yml`, `rust.yml` | push / PR | type check, lint, Rust |
| `release-macos.yml` | tag `v*` or manual | Apple-silicon `.dmg` attached to the release |
| `release-windows.yml` | tag `v*` or manual | Windows x64 installer attached to the release |

```bash
npm version <x.y.z> --no-git-tag-version
gh release create v<x.y.z> --target main --latest   # both installer workflows start from the tag
```

---

## Tech stack

**UI**: React 19 · TypeScript 5.6 · shadcn/ui · Radix · Tailwind 4 · Vite 8 · Monaco · D3 · xterm.js
**Desktop**: Code-OSS · Electron · first-party extensions
**Native**: Rust · tokio · serialport · probe-rs
**Analysis**: CBMC · CodeQL · cppcheck · clang-tidy · LLVM coverage
**AI**: LM Studio · vLLM · Ollama · Gemini · Anthropic · OpenAI · Google ADK

---

## Distribution

End-user downloads are at [`Hitheshkaranth/noyce-ide-dist`](https://github.com/Hitheshkaranth/noyce-ide-dist). This repository holds the source; the dist repository ships the installers.

## License

Proprietary. © 2026 Noyce IDE. All rights reserved.

---

<div align="center">

<sub>Built for engineers who ship firmware that has to be right.</sub>

</div>
