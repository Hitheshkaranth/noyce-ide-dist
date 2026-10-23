<div align="center">

<img src="icons_resources/logo_horizontal.png" alt="Noyce IDE" width="560" />

<h3>The AI-native workbench for firmware that has to certify.</h3>

<p>Requirements, source, DO-178C evidence, hardware tooling and fifteen specialist agents —<br/>in one Code-OSS window, against the code that is actually open.</p>

<p>
<a href="https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest"><img src="https://img.shields.io/badge/Download-2.0.8-111111?style=for-the-badge&logo=github&logoColor=white" alt="Download 2.0.8" /></a>&nbsp;
<a href="https://noyce-ide.tech"><img src="https://img.shields.io/badge/Website-noyce--ide.tech-111111?style=for-the-badge&logo=safari&logoColor=white" alt="Website" /></a>&nbsp;
<a href="https://noyce-ide.tech/docs"><img src="https://img.shields.io/badge/User_manual-111111?style=for-the-badge&logo=bookstack&logoColor=white" alt="User manual" /></a>&nbsp;
<a href="RELEASE_NOTES.md"><img src="https://img.shields.io/badge/Release_notes-111111?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Release notes" /></a>
</p>

<sub>macOS (Apple silicon) · Windows x64 &nbsp;|&nbsp; DO-178C · ISO 26262 · MISRA C:2025 &nbsp;|&nbsp; Local or cloud models</sub>

<br/><br/>

<img src="docs/readme/tour.gif" alt="Noyce IDE 2.0.6 running on the H-Bridge motor controller: requirements, AI orchestrator, traceability, compliance and documents" width="100%" />

<sub>Recorded in the running IDE on a real STM32G431 motor controller. Real clicks, real data.</sub>

</div>

<br/>

<table>
<tr>
<td align="center" width="20%"><h2>17</h2><sub>DO-178C documents<br/>issued from the workspace</sub></td>
<td align="center" width="20%"><h2>1,002</h2><sub>CBMC properties<br/>proved, 0 failed</sub></td>
<td align="center" width="20%"><h2>15</h2><sub>specialist agents<br/>on one board</sub></td>
<td align="center" width="20%"><h2>71</h2><sub>Annex A objectives<br/>graded, none rounded up</sub></td>
<td align="center" width="20%"><h2>53</h2><sub>full-pane surfaces<br/>in one window</sub></td>
</tr>
</table>

<p align="center">
<a href="#see-it-work"><b>See it work</b></a> &nbsp;·&nbsp;
<a href="#a-real-dal-a-run"><b>DAL A run</b></a> &nbsp;·&nbsp;
<a href="#whats-new-in-206"><b>What's new</b></a> &nbsp;·&nbsp;
<a href="#every-surface"><b>Every surface</b></a> &nbsp;·&nbsp;
<a href="#install"><b>Install</b></a> &nbsp;·&nbsp;
<a href="#architecture"><b>Architecture</b></a>
</p>

---

## Why Noyce

Safety-critical firmware is usually spread across a requirements manager, two static analysers, a traceability spreadsheet, a coverage tool, a CI dashboard, a chatbot and a vendor IDE. None of them knows what the others measured, so the certification evidence gets stitched together by hand at the end.

Noyce keeps it in one place.

<table>
<tr>
<td width="50%" valign="top">

#### 🧾 &nbsp;Evidence is measured, not asserted
Each Annex A objective is graded only from its own mapped evidence. A tool that did not run claims nothing, sample data never counts, and *satisfied* needs an independent human review.

</td>
<td width="50%" valign="top">

#### 🤝 &nbsp;Agents draft, engineers decide
System Designer, Coder, Tester, Reviewer, Doc Author and ten more draft requirements, tests, documents and decisions. Every edit is a change set gated on build, tests and MISRA.

</td>
</tr>
<tr>
<td width="50%" valign="top">

#### 🔬 &nbsp;Real tools underneath
CBMC, CodeQL, cppcheck, clang-tidy, LLVM MC/DC, probe-rs, GNU ld maps and CMSIS-SVD — run by the IDE, kept as reproducible records under `.noyce/`.

</td>
<td width="50%" valign="top">

#### 🔌 &nbsp;Hardware-aware, local-first
Pin maps from CubeMX and TivaWare, page-cited registers from the reference manual, HardFault decoding. Models run on LM Studio, vLLM or Ollama — or the cloud, if you choose.

</td>
</tr>
</table>

---

## See it work

Short clips recorded in Noyce IDE 2.0.6 on the H-Bridge project. Click any frame to play it.

<table>
<tr>
<td width="50%"><a href="media/demo/requirements.mp4"><img src="media/demo/requirements.jpg" alt="Requirements & Evidence" /></a><br/><b>Requirements & Evidence</b><br/><sub>Select a requirement; its evidence ledger follows.</sub></td>
<td width="50%"><a href="media/demo/traceability.mp4"><img src="media/demo/traceability.jpg" alt="Traceability Graph" /></a><br/><b>Traceability Graph</b><br/><sub>Requirement to code to test. Gaps show as gaps.</sub></td>
</tr>
<tr>
<td width="50%"><a href="media/demo/orchestrator.mp4"><img src="media/demo/orchestrator.jpg" alt="AI Orchestrator" /></a><br/><b>AI Orchestrator</b><br/><sub>Fifteen agents on one board, grouped by agent or status.</sub></td>
<td width="50%"><a href="media/demo/documents.mp4"><img src="media/demo/documents.jpg" alt="DO-178C Documents" /></a><br/><b>DO-178C Documents</b><br/><sub>The 17-document library, filtered and opened.</sub></td>
</tr>
<tr>
<td width="50%"><a href="media/demo/mcdc.mp4"><img src="media/demo/mcdc.jpg" alt="MC/DC Coverage" /></a><br/><b>MC/DC Coverage</b><br/><sub>Measured with LLVM, attributed per module.</sub></td>
<td width="50%"><a href="media/demo/compliance.mp4"><img src="media/demo/compliance.jpg" alt="Compliance Dashboard" /></a><br/><b>Compliance Dashboard</b><br/><sub>All 71 Level A objectives, graded from evidence.</sub></td>
</tr>
<tr>
<td width="50%"><a href="media/demo/architecture.mp4"><img src="media/demo/architecture.jpg" alt="System Architecture" /></a><br/><b>System Architecture</b><br/><sub>A C4 model recovered from the source tree.</sub></td>
<td width="50%"><a href="media/demo/audit.mp4"><img src="media/demo/audit.jpg" alt="Audit Trail" /></a><br/><b>Immutable Audit Trail</b><br/><sub>Every action hash-chained to the one before.</sub></td>
</tr>
</table>

<p align="center"><a href="media/demo/noyce-2.0.6-demo.mp4"><b>▶ Watch the full 95-second demo</b></a></p>

<details>
<summary><b>More clips</b>: coupling, document reader, firmware memory, HardFault</summary>
<br/>

<table>
<tr>
<td width="50%"><a href="media/demo/coupling.mp4"><img src="media/demo/coupling.jpg" alt="Data & Control Coupling" /></a><br/><b>Data & Control Coupling</b></td>
<td width="50%"><a href="media/demo/reader.mp4"><img src="media/demo/reader.jpg" alt="Document Reader" /></a><br/><b>Document Reader</b></td>
</tr>
<tr>
<td width="50%"><a href="media/demo/memory.mp4"><img src="media/demo/memory.jpg" alt="Firmware Memory & Stack" /></a><br/><b>Firmware Memory & Stack</b></td>
<td width="50%"><a href="media/demo/hardfault.mp4"><img src="media/demo/hardfault.jpg" alt="HardFault Analyzer" /></a><br/><b>HardFault Analyzer</b> <sub>(built-in example dump)</sub></td>
</tr>
</table>

</details>

---

## A real DAL A run

The STM32G431 H-Bridge motor controller was taken from prototype to a DO-178C DAL A document set inside the IDE. Every fix that run demanded shipped in 2.0.6. The result is reported the way an auditor would read it — including what is still open.

<table>
<tr>
<td width="55%" valign="top">

```mermaid
%%{init: {'theme':'dark','themeVariables':{'pie1':'#4ade80','pie2':'#facc15','pie3':'#6b7280','pie4':'#374151','pieStrokeColor':'#111','pieOuterStrokeWidth':'0px','pieSectionTextColor':'#111'}}}%%
pie showData
    title Annex A · 71 Level A objectives
    "Satisfied" : 5
    "Partial" : 36
    "Open" : 27
    "N/A" : 3
```

</td>
<td width="45%" valign="top">

| Result | |
| --- | --- |
| DO-178C documents issued | **17** |
| High-level requirements | **15** |
| Host tests | **57** |
| CBMC properties proved | **1,002** |
| MISRA findings | **549 → 210**, rest deviated |

**5 of 71 objectives satisfied.** The Software Accomplishment Summary states non-compliance, and the IDE shows the same gap list — not a green dashboard.

</td>
</tr>
</table>

<sub>Still open on this project: low-level requirements · system requirements · target and timing tests · independent human review and SQA · coupling analysis · object-code analysis · qualified build · authority engagement.</sub>

### The rules the IDE holds itself to

> **A tool that did not run claims nothing.** Coverage that was analysed but never measured, CBMC with zero properties and sample fallbacks all count as did-not-run.
>
> **Zero findings counts only after a scan.** A clean result needs a scan that actually ran.
>
> **AI earns no independence credit.** Reviews record author and reviewer from the project roster; AI-assisted reviews are labelled and never satisfy independence.

---

## What's new in 2.0.8

<table>
<tr>
<td width="50%" valign="top">

**📥 Import that works.** The import wizard takes a Code Composer Studio folder or an STM32CubeIDE `.ioc`. It opens the project, detects the part, and fetches and indexes its reference manual.

**🔨 Build in the IDE.** TI CCS projects build with ⇧⌘B and native tasks. A Build view shows errors, warnings, duration and FLASH/SRAM from the map, and Build Status lists the last 10 TI and STM32 builds.

**🧰 STM32 builds that explain themselves.** Validate Toolchain says whether you can build, flash and debug, and why not. CubeIDE makefiles from another computer are detected, and a generated makefile builds instead. The configured Arm toolchain wins over `PATH`.

</td>
<td width="50%" valign="top">

**📋 One Review Inbox.** Every human touchpoint in one Supply / Decide / Sign queue, each item opening the surface that closes it.

**🔁 Requirements from the prototype.** System requirements are recovered from the code, the `.ioc` and the ICD tables, with provenance, and validated only by a person on the roster.

**📖 A user manual.** 21 pages at [noyce-ide.tech/docs](https://noyce-ide.tech/docs), with every screenshot taken in the IDE, including import-to-build walkthroughs for a TI and an STM32 project.

</td>
</tr>
</table>

## What's new in 2.0.7

<table>
<tr>
<td width="50%" valign="top">

**🛩️ A second DAL A field run.** A TI Tiva power-distribution controller was taken through DAL A with a local Qwen model over Tailscale. The run logged 75 issues, and all of them are fixed.

**✍️ Signed issue.** Issuing a document is a signed act by the people on the roster, and each signature references the audit ledger. The SVR and SAS cannot be issued until verification has run.

**🔗 Linked LLRs.** LLRs are pre-linked to HLRs, with model parent suggestions. The traceability graph shows the LLR level.

</td>
<td width="50%" valign="top">

**🗂️ Document library and figures.** A Finder-style library with live writing state. Mermaid and Archify figures appear in the Docs panel and in `.docx` exports. A project template can be imported from a corporate `.docx`.

**🧠 Local models.** vLLM context handling is fixed. The docs swarm reports what happened to each section, and one failed document no longer ends a batch.

**📏 Measured numbers.** MC/DC is read from LLVM 19+ exports. CodeQL traces the managed build. TI CCS projects build.

</td>
</tr>
</table>

## What's new in 2.0.6

<table>
<tr>
<td width="50%" valign="top">

**🎨 A new interface.** The whole IDE moved from HeroUI to **shadcn/ui** (Radix, Tailwind 4, React 19) on one dark theme.

**📄 DO-178C DAL A, end to end.** Document completion, agent-proposed decisions with a review queue, an HLR editor with lint, real author/reviewer independence, problem reports and CCB, and set-consistency checks that block a baseline.

**🎯 Annex A objective workbench.** Map each objective to the evidence that discharges it; all 71 Level A objectives reported as ratios.

</td>
<td width="50%" valign="top">

**⚡ AI Orchestrator, live.** Each card shows its phase, tokens and rate as it runs; a worker pool runs objectives concurrently.

**✅ Accuracy fixes.** Zero findings needs a real scan; CodeQL not counted as measured by default; exported HTML escaped; agent writes confined to the project.

**🚀 Faster scans.** The annotation scan went from 25,356 files to 113 by skipping the IDE's own `.noyce/` output.

**🧠 Separate embedding server**, and an Agents panel that shows the model the server actually serves.

</td>
</tr>
</table>

<p align="right"><a href="RELEASE_NOTES.md">Full release notes →</a></p>

---

## Every surface

> Every screenshot is captured from the running **Code-OSS Electron build** with the H-Bridge project open. Nothing here is a mockup. Expand a section to browse it.

<details open>
<summary><b>🏁 &nbsp;Getting started</b> &nbsp;<sub>1 surface</sub></summary>
<br/>

<img src="docs/screenshots/2.0.6/00-getting-started.png" alt="Getting Started: recent projects and the grid of workbench surfaces" />

Recent projects, project creation and import (STM32CubeIDE, TI Tiva/CCS, MPLAB X, generic folder), and one-click access to every surface.

</details>

<details>
<summary><b>🤖 &nbsp;AI</b> &nbsp;<sub>3 surfaces</sub></summary>
<br/>

##### AI Orchestrator: a kanban board of specialist agents

<img src="docs/screenshots/2.0.6/01-ai-orchestrator.png" alt="AI Orchestrator kanban with live model, concurrency and sprint progress" />

Objectives become cards routed to specialist agents along a handoff chain. The header reports the live model, its context window, concurrency, sprint progress and items awaiting review. Cards show what actually ran — tokens, rate, evidence — and never claim work that did not happen.

<table>
<tr>
<td width="50%"><b>AI Models</b>: global model, per-agent overrides, endpoint, API key, generation and concurrency settings<br><img src="docs/screenshots/2.0.6/02-ai-models.png" alt="AI Models" /></td>
<td width="50%"><b>Agents Chat</b>: persona chat with handoff, edit proposals and the live model<br><img src="docs/screenshots/2.0.6/03-agents-chat.png" alt="Agents Chat" /></td>
</tr>
</table>

</details>

<details>
<summary><b>🔗 &nbsp;Requirements and traceability</b> &nbsp;<sub>6 surfaces</sub></summary>
<br/>

##### Requirements & Evidence

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

</details>

<details>
<summary><b>🛡️ &nbsp;DO-178C compliance</b> &nbsp;<sub>8 surfaces</sub></summary>
<br/>

##### Compliance Dashboard

<img src="docs/screenshots/2.0.6/10-compliance-dashboard.png" alt="Compliance Dashboard with Annex A objectives and structural coverage" />

DO-178C objectives for the selected level, graded from mapped evidence: requirements linked, design allocation, verification, analysis findings and structural coverage, with the Annex A objective table below. Objectives route to their specialist agent, and one action assembles the signed **Certification Evidence Package**.

##### Compliance Run: one reproducible record

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

</details>

<details>
<summary><b>🔬 &nbsp;Verification and analysis</b> &nbsp;<sub>11 surfaces</sub></summary>
<br/>

##### MC/DC structural coverage, measured

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

</details>

<details>
<summary><b>🧭 &nbsp;Code and architecture</b> &nbsp;<sub>6 surfaces</sub></summary>
<br/>

##### Project Graph

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

</details>

<details>
<summary><b>🔌 &nbsp;Hardware</b> &nbsp;<sub>10 surfaces</sub></summary>
<br/>

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

</details>

<details>
<summary><b>📈 &nbsp;Signals and lab</b> &nbsp;<sub>8 surfaces</sub></summary>
<br/>

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

</details>

<sub>Surfaces that need a connected target (probe, serial, logic analyser) say so and show labelled simulated data until one is attached.</sub>

<details>
<summary><b>The full feature list</b></summary>
<br/>

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

</details>

---

## Install

Download the installer for **macOS (Apple silicon)** or **Windows (x64)** from the [latest release](https://github.com/Hitheshkaranth/noyce-ide-dist/releases/latest), or:

```bash
# Homebrew (macOS)
brew tap Hitheshkaranth/noyce https://github.com/Hitheshkaranth/noyce_ide
brew install --cask noyce-ide

# GitHub Packages
oras pull ghcr.io/hitheshkaranth/noyce-ide:2.0.7      # or :latest
```

Then open the vendor project you already have — STM32CubeIDE, TI Code Composer / TivaWare, MPLAB X, or any folder — and point **AI Models** at a local server (LM Studio, vLLM, Ollama) or a cloud provider.

<details>
<summary><b>Build from source</b></summary>
<br/>

The source lives in [`Hitheshkaranth/noyce_ide`](https://github.com/Hitheshkaranth/noyce_ide). Prerequisites: Node 22, Python 3, Git, and on Windows the Visual Studio Build Tools with the VC v142 Spectre libraries.

```bash
npm ci
npm run build                       # webview bundle (tsc + vite)

# macOS / Linux, with an already-prepared Code-OSS checkout
npm run workbench:launch -- /path/to/firmware

# Windows, first time
npm run codeoss:bootstrap:windows   # prepare third_party/code-oss
npm run workbench:launch
```

`npm run workbench:doctor` (or `workbench:doctor:windows`) diagnoses missing prerequisites.

```bash
npm run check          # build + cargo check on the Rust sidecar
npm run test:all       # unit, integration and quality-invariant suites
npm run smoke:ui       # Playwright smoke (CI gate)
```

</details>

---

## Architecture

```mermaid
flowchart LR
    FW["Firmware project<br/>CubeIDE · CCS · MPLAB"] --> IDE
    subgraph IDE["Noyce IDE · Code-OSS + Electron"]
        direction TB
        UI["React 19 surfaces<br/>shadcn/ui · Tailwind 4"]
        AG["15 specialist agents<br/>Orchestrator · RAG"]
        RS["Rust sidecar<br/>import · analysis · probe-rs · serial"]
        UI <--> AG
        UI <--> RS
    end
    IDE <--> M["Your models<br/>LM Studio · vLLM · Ollama · cloud"]
    IDE --> T["Real tools<br/>CBMC · CodeQL · LLVM · cppcheck"]
    IDE --> N[".noyce/<br/>documents · evidence · audit ledger"]
```

**The project stays clean.** Everything the IDE generates — evidence, documents, the audit ledger, analysis scratch — goes under `<project>/.noyce/`, which carries its own `.gitignore`. The IDE never edits your files unless you approve an agent change set.

<p>
<img src="https://img.shields.io/badge/Code--OSS-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white" alt="Code-OSS" />
<img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React 19" />
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
<img src="https://img.shields.io/badge/shadcn%2Fui-000000?style=flat-square&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
<img src="https://img.shields.io/badge/Tailwind_4-0F172A?style=flat-square&logo=tailwindcss&logoColor=38BDF8" alt="Tailwind 4" />
<img src="https://img.shields.io/badge/Rust-CE412B?style=flat-square&logo=rust&logoColor=white" alt="Rust" />
<img src="https://img.shields.io/badge/CBMC-333333?style=flat-square" alt="CBMC" />
<img src="https://img.shields.io/badge/CodeQL-2F363D?style=flat-square&logo=github&logoColor=white" alt="CodeQL" />
<img src="https://img.shields.io/badge/probe--rs-333333?style=flat-square" alt="probe-rs" />
</p>

---

## Distribution

This repository ships the installers and the [noyce-ide.tech](https://noyce-ide.tech) website. The source is in [`Hitheshkaranth/noyce_ide`](https://github.com/Hitheshkaranth/noyce_ide).

## License

Proprietary. © 2026 Noyce IDE. All rights reserved.

<br/>

<div align="center">
<img src="icons_resources/icon_large.png" alt="" width="48" />
<br/>
<sub>Built for engineers who ship firmware that has to be right.</sub>
</div>
