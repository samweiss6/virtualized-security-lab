# Presentation — Virtualized Security Lab
*LIS4905 DIS · Samuel Weiss · slide-by-slide content (drop into PowerPoint/
Google Slides, or I can render an HTML/PPTX deck). Bracketed [SCREENSHOT: …]
notes mark where lab/Kibana images go.*

---

### Slide 1 — Title
**Virtualized Security Lab**
Building & monitoring an isolated attack lab on Apple Silicon
Samuel Weiss · LIS4905 Directed Individual Study · Fall 2026 · Instructor: Ebrahim Randeree

---

### Slide 2 — The Goal
- Build a **safe, isolated lab** to practice offensive security hands-on.
- Attack a deliberately vulnerable target, and **prove a SIEM detects it**.
- Constraint that shaped everything: an **Apple-Silicon (M1) Mac, 8 GB RAM** —
  ARM, no x86 virtualization, limited resources.

---

### Slide 3 — Architecture
- **Attacker:** Kali Linux (ARM64) — UTM *Virtualize*
- **Target:** Metasploitable2 (x86_64) — UTM *Emulate*
- **SIEM:** Elasticsearch + Kibana, native ARM on the Mac, fed by **Packetbeat**
- **Network:** UTM **Host-Only** `192.168.128.0/24` — **no route to LAN/internet**
- [SCREENSHOT: README architecture diagram]
```
Kali (.2) --attacks--> Metasploitable2 (.4)
      \--- traffic captured by Packetbeat ---> Elasticsearch + Kibana (host .1)
Both VMs: NO route to the real network/internet (verified)
```

---

### Slide 4 — Key Design Decisions
- **Elastic/Kibana instead of Splunk** — Splunk has no ARM build and x86
  emulation failed on this OS; the proposal allows "a tool *like* Splunk."
- **Native Elastic, not Docker** — official `darwin-aarch64` builds; avoids the
  emulation path that kept failing.
- **Host-only network** — isolation is a hard requirement; verified no internet.

---

### Slide 5 — Real Engineering Challenges (the interesting part)
1. **Kali's GUI never rendered** on any UTM display adapter (ARM virtio-gpu bug).
   → Solved by installing & running Kali entirely over a **serial console**.
2. **Installer booted too slowly off emulated USB** → switched disk to VirtIO.
3. **Metasploitable2 had no network** → its udev rule needs the image's original
   **MAC** (`00:0C:29:FA:DD:2A`); set it and DHCP worked.
4. **Elasticsearch went red** — APFS made it think the disk was 92% full →
   disabled the disk watermark.
- *Takeaway: real labs are iterative; documenting the failures is the learning.*

---

### Slide 6 — The Attacker: Kali
- ARM64 Kali, driven headless via SSH over the host-only net.
- Tooling confirmed: **nmap, Metasploit, hydra, sqlmap, nikto**.
- [SCREENSHOT: SSH session / tool versions]

---

### Slide 7 — Recon (MITRE T1046)
- Full scan found **23 open, outdated services** on the target.
- Highlights: vsftpd, OpenSSH 4.7, Samba 3.x, **UnrealIRCd**, MySQL 5.0.51a,
  Tomcat, **a root bind shell on port 1524**. OS: Linux 2.6.
- [SCREENSHOT: nmap output — logs/nmap_metasploitable2_initial.txt]

---

### Slide 8 — Exploitation (mapped to MITRE ATT&CK)
| Attack | Service | Technique / CVE |
|---|---|---|
| FTP brute force | 21 | T1110 |
| UnrealIRCd backdoor | 6667 | T1190 / CVE-2010-2075 |
| Samba usermap | 445 | T1190 / CVE-2007-2447 |
| Root bind shell | 1524 | T1190 / T1059 |
- [SCREENSHOT: a root shell from one exploit]

---

### Slide 9 — Detection in the SIEM
- Packetbeat captures every packet between attacker and target.
- Each attack is visible in Kibana: the port scan is a **burst of flows to many
  ports**; exploits are **connections to 6667 / 445 / 1524** plus reverse shells.
- [SCREENSHOT: Kibana Network Flows dashboard during attacks]

---

### Slide 10 — Finding ↔ Detection Mapping
- One-to-one table: every attack → the Kibana query/panel that caught it.
- [SCREENSHOT: Kibana Discover filtered to the attack window]
- *(full table in REPORT.md §5)*

---

### Slide 11 — Results & Isolation
- Working, reproducible, **fully isolated** lab — nothing can touch the real network.
- End-to-end: recon → exploit → **detected**, all on one 8 GB laptop.

---

### Slide 12 — Lessons & Next Steps
- ARM + emulation forces creative workarounds (serial console, native Elastic).
- Next: more detections/dashboards, write custom alert rules, finalize the report.
- Repo: github.com/samweiss6/virtualized-security-lab (build log + evidence).
