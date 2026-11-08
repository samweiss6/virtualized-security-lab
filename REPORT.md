# Virtualized Security Lab — Penetration Test & Detection Report

**Samuel Weiss** — LIS4905 Directed Individual Study, Fall 2026
**Instructor:** Ebrahim Randeree
**Date:** 2026-11-08 (working draft)

> All five attacks executed and detected (2026-11-08). Live log in
> `Attack_Log.md`; detection data in `logs/detection_summary.txt`; Kibana
> dashboard screenshots in `screenshots/` (indexed in `screenshots/README.md`).

## 1. Executive Summary
This project built a fully isolated virtualization lab on an
Apple-Silicon Mac to safely practice offensive security and validate that an
Elastic/Kibana SIEM detects the activity. An attacker VM (Kali Linux) was used
to enumerate and exploit a deliberately vulnerable target (Metasploitable2) on a
host-only network with no path to the real LAN or internet, while Packetbeat fed
all network activity into Elasticsearch for detection in Kibana.

## 2. Scope & Rules of Engagement
- All testing was confined to an **isolated UTM host-only network** on a local
  Mac (`192.168.128.0/24`). No production or third-party systems were in scope.
  Isolation was verified (the target/attacker cannot reach the internet).
- **In scope — target:** Metasploitable2 (UTM Emulate / x86_64) — `192.168.128.4`
- **Attacking system:** Kali Linux (UTM Virtualize / ARM64) — `192.168.128.2`
- **Monitoring system:** Elasticsearch + Kibana (native darwin-aarch64 on the
  host) with Packetbeat on the attacker's interface — host `192.168.128.1`
- **Testing window:** November 2026.

## 3. Methodology
Approach followed a standard pentest flow mapped to **MITRE ATT&CK**:
recon → vulnerability identification → exploitation → validation that the SIEM
detected each step. Tools: **nmap** (discovery), **hydra** (brute force),
**Metasploit Framework** (exploitation), **netcat** (direct access). Detection
was validated by querying the `packetbeat-*` indices in Elasticsearch/Kibana.

## 4. Findings

### 4.1 Exposed, Unpatched Network Services (recon)  ✅
- **MITRE ATT&CK ID:** T1046 — Network Service Discovery
- **Severity:** Informational (enables all later findings)
- **Description:** A full TCP scan of the target revealed 23 open services, many
  years out of date: vsftpd (21), OpenSSH 4.7p1 (22), telnet (23), Apache 2.2.8
  (80), Samba 3.x (139/445), rexec/rlogin/rsh (512–514), Java-RMI (1099), a
  **root bind shell on 1524**, NFS (2049), MySQL 5.0.51a (3306), PostgreSQL
  (5432), VNC (5900), **UnrealIRCd on 6667**, and Tomcat (8180). OS: Linux 2.6.x.
- **Steps to Reproduce:** `nmap -n -sS -sV -O 192.168.128.4`
- **Evidence:** `logs/nmap_metasploitable2_initial.txt`
- **Impact:** Each stale service is a candidate for exploitation; several have
  well-known remote-code-execution vulnerabilities (see 4.2–4.5).

### 4.2 FTP Brute Force (T1110)  ✅
- **Severity:** High — weak, guessable credentials on an exposed service.
- **Description/Result:** `hydra` recovered valid FTP credentials
  **`msfadmin` / `msfadmin`** on port 21.
- **Evidence:** `logs/a2_hydra_ftp.txt`; `screenshots/09_terminal_hydra_crack.png`
- **Impact:** Authenticated access; foothold for further compromise.

### 4.3 UnrealIRCd 3.2.8.1 Backdoor — CVE-2010-2075 (T1190)  ✅
- **Severity:** Critical — unauthenticated remote code execution.
- **Description/Result:** The backdoored UnrealIRCd on 6667 executed attacker
  commands; a reverse shell opened (`192.168.128.2:4444 → .4:50090`).
- **Evidence:** `logs/a3_unrealircd.txt`
- **Impact:** Remote code execution on the target.

### 4.4 Samba usermap_script — CVE-2007-2447 (T1190)  ✅
- **Severity:** Critical — unauthenticated RCE via username-map command injection.
- **Description/Result:** Reverse shell opened (`192.168.128.2:4445 → .4:34697`).
- **Evidence:** `logs/a4_samba.txt`
- **Impact:** Remote code execution (Samba runs as root on this host).

### 4.5 Exposed Root Bind Shell on 1524 (T1190/T1059)  ✅
- **Severity:** Critical — direct root shell, no exploit required.
- **Description/Result:** `nc 192.168.128.4 1524` yielded an immediate **root**
  shell: `uid=0(root) gid=0(root)` on kernel 2.6.24.
- **Evidence:** `logs/a5_bindshell_root.txt`; `screenshots/08_terminal_root_shell.png`
- **Impact:** Full system compromise.

## 5. Detection Summary
| Finding | ATT&CK ID | Detected? | Kibana / ES signal | Evidence |
|---|---|---|---|---|
| 4.1 Service discovery | T1046 | ✅ | **65,596 distinct dest ports** .2→.4 | `logs/detection_A1_portscan.txt` |
| 4.2 FTP brute force | T1110 | ✅ | **72 flows** to port 21 (burst) | `logs/detection_summary.txt` |
| 4.3 UnrealIRCd backdoor | T1190 | ✅ | **25 flows** to 6667 + reverse shell | `logs/detection_summary.txt` |
| 4.4 Samba usermap | T1190 | ✅ | **8 flows** to 445 + reverse shell | `logs/detection_summary.txt` |
| 4.5 Root bindshell | T1190 | ✅ | **30 flows** to unusual port 1524 | `logs/detection_summary.txt` |

All detections verified via Elasticsearch aggregation queries over `packetbeat-*`
(attack window 2026-11-08 16:04–16:16).

### 5.1 Figures (Kibana)
Screenshots are in `screenshots/` (captions in `screenshots/README.md`):
- **Fig. 1** — `01_flows_connections_portscan_spike.png`: the ~65,000-flow spike (A1 port scan).
- **Fig. 2** — `02_flows_host_traffic_isolation.png`: attacker→target traffic; only `.1/.2/.4` present (isolation).
- **Fig. 3–4** — `03_flows_top_source_attacker.png`, `04_flows_top_dest_target.png`: spike sourced from `.2`, received by `.4`.
- **Fig. 5** — `05_overview_transaction_types.png`: ~260,000 flow events during the window.
- **Fig. 6** — `06_overview_errors_latency.png`: error/latency spikes as exploits hit services.
- **Fig. 7** — `07_discover_destination_ports.png`: port spread + attacked service ports (21/80/139/1524/6667).

## 6. Recommendations
Remediation is ordered by the severity of the finding it addresses. On a real
host every item below would be a prerequisite to returning the system to service.

| # | Finding | Recommendation | Priority |
|---|---|---|---|
| R1 | 4.5 Root bind shell (1524) | Remove the bind shell entirely; it is a backdoor with no legitimate use. Audit `inetd`/`xinetd` and startup scripts for any service granting unauthenticated shells. | **Immediate** |
| R2 | 4.3 UnrealIRCd / 4.4 Samba RCE | Patch or retire the vulnerable daemons. UnrealIRCd 3.2.8.1 (CVE-2010-2075) and Samba 3.x usermap (CVE-2007-2447) are both fixed in current releases; if the services are not needed, uninstall them. | **Immediate** |
| R3 | 4.1 Exposed services | Reduce attack surface: disable cleartext/legacy services (telnet, rexec/rlogin/rsh, finger) and close every port without a documented business need. Default-deny at a host firewall. | High |
| R4 | 4.2 Weak FTP credentials | Enforce strong, unique credentials and lockout; remove default accounts (`msfadmin`). Prefer key-based SFTP over anonymous/password FTP. | High |
| R5 | All | **Patch management** — the root cause across findings is years-out-of-date software. Establish a regular patch cadence and track installed versions. | High |
| R6 | All | **Network segmentation & monitoring** — keep exposed services on an isolated segment and keep the kind of flow-level monitoring demonstrated here (Packetbeat → Elastic) in place so exploitation attempts are detected, not just prevented. | Medium |

Metasploitable2 is intentionally vulnerable and is **not** meant to be patched —
it exists as a safe target. The recommendations above are written as they would
apply to a production host exhibiting the same findings, which is the point of the
exercise.

## 7. Conclusion
This project met the goals set for the Directed Individual Study. On a single
resource-constrained Apple-Silicon laptop, it delivered a **fully isolated,
reproducible security lab** and demonstrated the complete defensive loop:
build → attack → detect.

- **Lab construction.** An attacker (Kali, ARM64 virtualized) and a deliberately
  vulnerable target (Metasploitable2, x86_64 emulated) were stood up on a UTM
  host-only network with **no route to the real LAN or internet** — isolation
  that was explicitly verified before any attack.
- **Offensive tooling.** A standard pentest flow — reconnaissance, vulnerability
  identification, exploitation, and validation — was executed with nmap, hydra,
  the Metasploit Framework, and netcat, and mapped to **MITRE ATT&CK**. All five
  planned actions (T1046, T1110, two T1190 RCEs, and a direct root shell)
  succeeded, culminating in `uid=0(root)` on the target.
- **Detection.** Every action was captured by Packetbeat and confirmed in the
  Elastic/Kibana SIEM via aggregation queries over `packetbeat-*` — from the
  65,596-port scan down to the individual service flows (ports 21, 445, 1524,
  6667) and the reverse-shell callbacks.

Beyond the results, the real learning was in the **engineering workarounds** the
platform forced (serial-console install, native ARM Elastic instead of Splunk,
pristine-disk recovery of the emulated target) — all documented in `BUILD_LOG.md`.
The lab now serves as a foundation for future work: custom detection rules,
richer dashboards, and additional attack scenarios.

## 8. Appendix
- Lab architecture: `diagrams/architecture.svg` (source: `architecture.mmd`); see also `README.md`.
- Full command logs & tool versions: `logs/`.
- Build narrative: `BUILD_LOG.md`.
