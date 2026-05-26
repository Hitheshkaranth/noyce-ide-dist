<div align="center">

<img src="icons_resources/logo_horizontal.png" alt="Noyce IDE" width="620" />

### The AI-native IDE for safety-critical embedded engineering

Bring requirements, code, certification evidence, hardware tooling, and a multi-agent AI pipeline into one Code-OSS-based workbench — purpose-built for **DO-178C**, **ISO 26262**, and **MISRA-grade** firmware teams.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Code OSS](https://img.shields.io/badge/Built%20on-Code--OSS-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white)](https://github.com/microsoft/vscode)
[![Electron](https://img.shields.io/badge/Electron-Latest-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org/)
[![Rust](https://img.shields.io/badge/Rust-Sidecar-CE412B?style=flat-square&logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![Monaco](https://img.shields.io/badge/Monaco-Editor-1E1E1E?style=flat-square&logo=microsoft&logoColor=white)](https://microsoft.github.io/monaco-editor/)
[![D3](https://img.shields.io/badge/D3.js-7.x-F9A03C?style=flat-square&logo=d3.js&logoColor=white)](https://d3js.org/)
[![Playwright](https://img.shields.io/badge/Tested-Playwright-2EAD33?style=flat-square&logo=playwright&logoColor=white)](https://playwright.dev/)
[![Releases](https://img.shields.io/github/v/release/Hitheshkaranth/noyce-ide-dist?style=flat-square&color=00e676)](https://github.com/Hitheshkaranth/noyce-ide-dist/releases)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=flat-square)](#license)

[**Download**](#download) · [**Features**](#features) · [**Architecture**](#architecture) · [**Quick Start**](#quick-start) · [**Source**](https://github.com/Hitheshkaranth/noyce_ide)

</div>

---

## Why Noyce IDE

Modern safety-critical firmware work is fragmented across requirements managers, static analyzers, traceability matrices, CI dashboards, AI assistants, and a stack of vendor IDEs. **Noyce IDE collapses all of that into one Code-OSS workbench** with first-class support for:

- **Hardware-aware editing** — pin maps, peripheral registers, RTOS thread state, schematic views, signal/protocol decoders.
- **Certification evidence built-in** — DO-178C Table A objectives, MISRA rule decoding, MC/DC coverage, immutable audit trail.
- **A multi-agent AI pipeline** — system designer, coder, reviewer, tester, doc generator, traceability monitor — each with its own configurable model provider.
- **Real CI surfaces** — build, static analysis, unit, HIL, and traceability stages in one live pipeline view.

It looks like the IDE you already use. It works the way safety teams already audit.

---

## Screenshots

### Multi-agent orchestrator — plan, dispatch, and run the agent pipeline

<img src="screenshots/04-ai-orchestrator.png" alt="AI Orchestrator with kanban sprint" />

The Orchestrator is a kanban board where each card carries a persona (System Designer, Software Engineer, Test Engineer, Doc Specialist, Reviewer Agent) and moves Backlog → To Do → In Progress → Handover → Done. Agent runs are queued into a sprint and dispatched in parallel.

### DO-178C compliance evidence — at-a-glance and audit-ready

<img src="screenshots/02-compliance-dashboard.png" alt="Compliance dashboard with DO-178C Table A" />

Requirements linked, design evidence, verification evidence, and open MISRA findings — all derived live from the active project. The DO-178C Table A objective table calls out exactly which objectives need attention and what's required to close them.

### Traceability graph — REQ ↔ Design ↔ Test, visualised

<img src="screenshots/03-traceability-graph.png" alt="Traceability graph" />

A D3 force-directed graph that ties requirements (`SYS-REQ-001`, …) to source files, design notes, and test cases. Verified links render green; orphans and gaps render red.

### CI/CD pipeline — embedded build stages with live logs

<img src="screenshots/06-build-pipeline.png" alt="CI/CD pipeline with static analysis, build, unit, HIL, docs" />

Static Analysis → Build → Unit Tests → HIL Tests → Docs & Traceability. Live log streams in-pane, with per-stage status. Built for STM32, Tiva, PIC32, and generic Cortex-M targets.

### Project graph — symbol, file, and macro topology

<img src="screenshots/01-project-graph.png" alt="Project graph" />

A live dependency view of every function, file, and macro in the workspace. Click any symbol to see its callers, callees, and macro neighbourhood — independent of toolchain.

### AI model preferences — multi-provider, per-persona

<img src="screenshots/05-ai-models.png" alt="AI models page" />

One screen to wire **Gemini, Anthropic, OpenAI, Ollama (local), LM Studio (local)** to the six agent roles. Switch a single role to a local model for confidential workloads; keep the rest on a cloud provider.

### Safety review hub — deviation approval with AI pre-check

<img src="screenshots/08-review-workflow.png" alt="Safety Review Hub" />

Every code review packet carries linked changesets, AI agent pre-check results (PASS / pass-with-deviation), and a traceability monitor's verdict. Reviewers approve, reject, or escalate — and the decision is signed into the immutable audit log.

### Project templates — enterprise-grade scaffolds

<img src="screenshots/07-project-templates.png" alt="Project templates: CAN, PWR, BMS" />

Cert-ready starter projects for canister controllers, power distribution units, battery management systems, and flight data recorders — each pre-mapped to a traceability matrix and a compliance profile.

### Single AI launcher — Orchestrator, Agents Chat, and Models in one place

<img src="screenshots/09-noyce-ai-launcher.png" alt="Noyce AI activity bar with Agents Chat" />

One activity-bar icon ("Noyce AI") opens a tree launcher with all AI surfaces, the persistent **Agents** chat panel (with per-message model selection), and the **Agent History** thread browser. The chat panel can be dragged to the right sidebar to mimic VS Code Chat.

---

## Features

| Category | Surfaces |
| --- | --- |
| **Compliance & Certification** | Compliance Dashboard · Traceability Graph · Requirements Explorer · MISRA Diagnostics · MC/DC Coverage · Annotation Navigator · Audit Log |
| **Hardware-aware editing** | Pin Configurator · Peripheral Registers · Memory View · RTOS Thread Viewer · Schematic Viewer · Debug Probe Panel · Fault Analyzer (Cortex-M CFSR decoded) · Linker Memory Map |
| **Signal & protocol** | Logic-analyzer Signal Viewer · Serial Monitor · Modbus Monitor · Energy Profiler (LoRa / BLE / sense-burst presets) · Live Data Dashboard (Power / Motor / Comms) |
| **CI / Build** | Build Pipeline (Static Analysis / Build / Unit / HIL / Docs) · Build Size Treemap · Project Templates · Project Graph |
| **AI** | Multi-agent Orchestrator · Agents Chat with persona + per-call model selection · Provider settings (Gemini / Anthropic / OpenAI / Ollama / LM Studio / Codex CLI / Claude CLI) · Inline completions · Code-lens agent actions |
| **Team & lifecycle** | Team Activity · Review Workflow · Audit Log · Project Templates |
| **Importers** | STM32CubeIDE `.ioc` · TI Tiva (TivaWare) · Code Composer Studio · MPLAB X / NetBeans · Generic folder |

---

## Architecture

```text
Noyce IDE (single Electron process tree)
├── Code-OSS desktop shell
│   ├── Noyce product.json overlay + rebrand patch
│   └── 10 Noyce extensions (core-ui, stm32, fpga, telemetry,
│       compliance, hardware, lifecycle, project-graph, agents,
│       core)
│
├── React 18 + TypeScript UI bundle (Vite)
│   ├── Workbench surfaces (compliance, build, AI, hardware, …)
│   ├── Monaco editor · D3 graphs · xterm.js · Tailwind
│   └── Density-responsive panels (sidebar ↔ editor-tab)
│
└── Rust sidecar  (services/noyce-core/)
    ├── JSON-RPC over stdio
    ├── Workspace IO, project import (.ioc / CCS / MPLAB / Tiva)
    ├── Static-analysis + MISRA scanners
    └── Hardware enumeration (serial, debug probes, JTAG)
```

The release path keeps Noyce-owned config separate from the vendored Code-OSS checkout: `scripts/lib/codeoss-pin.json` pins upstream commit + Node version; `npm run codeoss:bootstrap:windows` prepares the checkout, renders `apps/noyce-workbench/generated/product.json`, syncs it into Code-OSS, applies the tracked patch, and copies overlay files (icons, badge, welcome).

---

## Download

| Platform | Architecture | File |
| --- | --- | --- |
| macOS | Apple Silicon (arm64) | [`Noyce_macOS_aarch64.dmg`](https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest/download/Noyce_macOS_aarch64.dmg) |
| Windows | x64 | [`NoyceIDE-win32-x64.exe`](https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest) (system installer) |
| Linux | x64 | coming soon |

> After install, open **AI Models** (Noyce AI → AI Models) and add a provider key. Gemini, Anthropic, and OpenAI accept cloud keys; Ollama and LM Studio auto-discover locally.

---

## Quick Start

```bash
# 1. Install the build (above)
# 2. Launch Noyce IDE
# 3. Open the project to certify
File ▸ Open Folder ▸  <your-firmware-repo>

# 4. Configure a model
Cmd/Ctrl + Alt + N ▸ "AI Models"  →  paste API key  →  assign to agent roles

# 5. Run the pipeline
Cmd/Ctrl + Alt + N + G        # Run Agent Pipeline
Cmd/Ctrl + Alt + N + B        # Open Build Pipeline
Cmd/Ctrl + Alt + N + C        # Compliance Dashboard
Cmd/Ctrl + Alt + N + M        # MISRA Diagnostics
```

The **Scan Workspace** action in the Compliance Dashboard discovers `@req`, `@verification`, and `@design` markers in source comments and populates the traceability graph in one pass.

---

## Tech Stack

**Frontend** — React 18 · TypeScript 5.6 · Vite 5 · Tailwind 3 · Monaco · D3 · xterm.js
**Desktop shell** — Code-OSS · Electron · 10 first-party VS Code extensions
**Native sidecar** — Rust · `tokio` · `serialport` · `probe-rs` · `walkdir`
**AI providers** — Google Gemini · Anthropic · OpenAI · Ollama · LM Studio · Codex CLI · Claude CLI
**Quality** — TypeScript strict · Playwright smoke + feature tour · `cargo check`

---

## Status

- **macOS Apple Silicon** — release-grade
- **Windows x64** — installer build via GitHub Actions on `v*` tags
- **Linux** — roadmap
- **AI providers** — Gemini ready in build; Anthropic / OpenAI / Ollama / LM Studio wired through the agents extension; Codex CLI and Claude CLI route through local CLIs

---

## Source

The full source lives at [`Hitheshkaranth/noyce_ide`](https://github.com/Hitheshkaranth/noyce_ide). This repository ships the **download landing page** and **release artifacts** only.

## License

Proprietary — © 2026 Noyce IDE. All rights reserved.

---

<div align="center">

<sub>Built for engineers who ship firmware that has to be right.</sub>

</div>
