# Virtualized Security Lab — Penetration Test & Detection Report

**Samuel Weiss** — LIS4905 Directed Individual Study, Fall 2026
**Instructor:** Ebrahim Randeree
**Date:** 2026-11-08 (working draft)

> Working draft. Findings A2–A5 and the Detection Summary screenshots are filled
> as attacks are executed; see `Attack_Log.md` for the live log.

## 1. Executive Summary
_(Written last.)_ This project built a fully isolated virtualization lab on an
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

### 4.2 FTP Brute Force (T1110)  ⏳ pending execution
### 4.3 UnrealIRCd 3.2.8.1 Backdoor — CVE-2010-2075 (T1190)  ⏳ pending execution
### 4.4 Samba usermap_script — CVE-2007-2447 (T1190)  ⏳ pending execution
### 4.5 Exposed Root Bind Shell on 1524 (T1190/T1059)  ⏳ pending execution

## 5. Detection Summary
| Finding | ATT&CK ID | Detected? | Kibana Search / Dashboard | Evidence |
|---|---|---|---|---|
| 4.1 Service discovery | T1046 | ✅ | `type:flow` burst, many dports from .2→.4 | _screenshot pending_ |
| 4.2 FTP brute force | T1110 | ⏳ | repeated FTP flows to port 21 | _pending_ |
| 4.3 UnrealIRCd backdoor | T1190 | ⏳ | flow to 6667 + reverse shell to .2 | _pending_ |
| 4.4 Samba usermap | T1190 | ⏳ | SMB flow to 445 + reverse shell | _pending_ |
| 4.5 Root bindshell | T1190 | ⏳ | flow to unusual port 1524 | _pending_ |

## 6. Recommendations
_(Per-finding remediation — patch/retire stale services, disable telnet/rsh,
remove the bind shell, enforce strong credentials, segment the network. Expanded
as findings are finalized.)_

## 7. Conclusion
_(Written last — what the project demonstrated and how it ties to the DIS goals:
hands-on isolated-lab construction, offensive tooling, and SIEM-based detection.)_

## 8. Appendix
- Lab architecture: see `README.md`.
- Full command logs & tool versions: `logs/`.
- Build narrative: `BUILD_LOG.md`.
