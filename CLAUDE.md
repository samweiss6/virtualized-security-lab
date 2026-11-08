# CLAUDE.md — Virtualized Security Lab (LIS4905 DIS)

Guidance for AI assistants working in this repo. Everything here was **verified
against this machine on 2026-11-08**. If a fact looks stale, re-verify before
acting — do not trust it blindly.

## Project
FSU Directed Individual Study (LIS4905), Fall 2026. Build an isolated virtual
security lab: attack a vulnerable target from Kali, monitor/detect with a SIEM,
and write an industry-style pentest + detection report.

- **Repo:** https://github.com/samweiss6/virtualized-security-lab
- **Student:** Samuel Weiss. Instructor: Ebrahim Randeree.

## Deadlines (verified 2026-11-08 with the student)
- **Nov 11, 2026 — presentation deliverable due** (slides/write-up). HARD, near.
- **Nov 18, 2026 — present.**
- **Dec 11, 2026 — semester ends / final report.**
Priority through Nov 11: a *demonstrably working* lab + evidence + slides, not a
polished 5-week build.

## Verified machine facts (2026-11-08)
- Apple **M1**, **8 GB RAM**, macOS **12.3** (Monterey) — "System Preferences".
- `arm64`. Pick ARM-native tooling; avoid x86 emulation where possible.
- ~34 GB free disk (tight — M2/target/Elastic must stay lean).
- **UTM 4.7.5.** CLI: `/Applications/UTM.app/Contents/MacOS/utmctl` (NOT on
  PATH). `utmctl list` works.
- Existing VM: **"Kali Linux"** UUID `66689B96-B3D4-4698-990A-93712C0E82D0`,
  aarch64, Virtualize (Hypervisor=1), 4 GB RAM. **Disk is empty — Kali is NOT
  installed yet** (qcow2 was ~320 KB). Network was **Shared (NAT)** — must be
  **Host Only**.
- Kali ARM64 installer ISO already downloaded: `~/Downloads/kali-linux-2026.2-installer-arm64.iso`.
- `docker` + `colima` installed but **not running**; `podman` absent. Not used —
  SIEM runs natively, not in a container.

## Architecture decisions (do not re-litigate)
- **SIEM = Elasticsearch + Kibana**, run natively from Elastic's official
  `darwin-aarch64` archives. NOT Splunk (no ARM build; emulation failed on this
  OS). Proposal allows "a tool *like* Splunk."
- **No Docker/Colima/emulation for the SIEM.** Native archive only.
- **Network = UTM Host Only.** Kali ↔ target isolated from LAN/internet; host Mac
  can reach both (needed for Elastic to receive logs). No bridge/NAT to real LAN.
- Metasploitable2 = Ubuntu 8.04, too old for Elastic agents → forwards **syslog**
  to the Mac. Filebeat + Packetbeat on the Mac ingest logs + host-only traffic.

## Division of labor
- AI can do: repo/docs, downloads, native Elastic/Beats setup + configs, scripts,
  commits.
- Student must do (GUI/keyboard): boot VMs, run the Kali installer, create +
  boot the Metasploitable2 Emulate VM, set the VM network to Host Only in UTM.

## Conventions
- Attack evidence → `screenshots/` and `logs/`; one Attack Log entry each.
- Record real host-only subnet/IPs in README "Build Notes" once assigned.
- Commit as real progress is made.
- Git commit trailer: `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`.

## Repo layout
- `README.md` — architecture, Build Notes (live).
- `Report_Outline.md` — final report skeleton.
- `Attack_Log_Template.md` — per-attack log format.
- `screenshots/`, `logs/`, `diagrams/` — evidence (currently empty).
