# Attack Log — Virtualized Security Lab

Chronological log of attacks run from **Kali (192.168.128.2)** against
**Metasploitable2 (192.168.128.4)** on the isolated UTM host-only network.
Each attack is captured by Packetbeat (Kali `eth0`) → Elasticsearch → Kibana.
Format per `Attack_Log_Template.md`. Entries marked **PLANNED** are staged in
the attack runner and pending execution/evidence.

---

## A1 — Network Service Discovery  ✅ done

- **Date / Week:** 2026-11-08 / Week of check-in 5 prep
- **Technique:** Full TCP port + service/version scan
- **MITRE ATT&CK ID:** T1046 (Network Service Discovery), T1595 (Active Scanning)
- **Target:** Metasploitable2 (192.168.128.4)
- **Tool / Command(s):**
  ```
  nmap -n -sS -sV -O --osscan-guess 192.168.128.4
  ```
- **Result / Output summary:** 23 open services identified — ftp (vsftpd),
  ssh (OpenSSH 4.7p1), telnet, smtp (Postfix), http (Apache 2.2.8),
  rpcbind, netbios/Samba (139/445), rexec/rlogin/rsh (512–514),
  java-rmi (1099), **root bindshell (1524)**, nfs (2049), ftp (ProFTPD 2121),
  mysql 5.0.51a (3306), postgresql (5432), vnc (5900), X11 (6000),
  **UnrealIRCd (6667)**, ajp13 (8009), Tomcat (8180). OS: Linux 2.6.x.
- **Evidence:** `logs/nmap_metasploitable2_initial.txt`
- **Detected by Elastic/Kibana?** Y — port scan appears as a burst of flow
  events from 192.168.128.2 to many dest ports on .4 (Packetbeat `type:flow`).
- **Notes:** Establishes the attack surface for A2–A5.

---

## A2 — FTP Brute Force  ✅ done
- **MITRE ATT&CK ID:** T1110 (Brute Force)
- **Command:** `hydra -L users.txt -P pass.txt -f ftp://192.168.128.4`
- **Result:** Valid credentials recovered — **`msfadmin` / `msfadmin`** on FTP (21).
- **Evidence:** `logs/a2_hydra_ftp.txt`
- **Detected by Elastic/Kibana?** Y — **72 flow events** to port 21 from .2→.4
  (burst of repeated connections = brute-force signature).

## A3 — UnrealIRCd 3.2.8.1 Backdoor  ✅ done
- **MITRE ATT&CK ID:** T1190; **CVE-2010-2075**
- **Command:** `metasploit exploit/unix/irc/unreal_ircd_3281_backdoor`
- **Result:** Command-shell session opened `192.168.128.2:4444 → 192.168.128.4:50090`
  — remote code execution on the target.
- **Evidence:** `logs/a3_unrealircd.txt`
- **Detected by Elastic/Kibana?** Y — **25 flow events** to port 6667 + reverse
  shell flow back to Kali:4444.

## A4 — Samba usermap_script  ✅ done
- **MITRE ATT&CK ID:** T1190; **CVE-2007-2447**
- **Command:** `metasploit exploit/multi/samba/usermap_script`
- **Result:** Command-shell session opened `192.168.128.2:4445 → 192.168.128.4:34697`
  — RCE via the Samba username-map command injection.
- **Evidence:** `logs/a4_samba.txt`
- **Detected by Elastic/Kibana?** Y — **8 flow events** to port 445 + reverse shell flow.

## A5 — Root Bindshell (1524)  ✅ done
- **MITRE ATT&CK ID:** T1190 / T1059
- **Command:** `nc 192.168.128.4 1524`
- **Result:** Instant **root** shell — `uid=0(root) gid=0(root)` on
  `metasploitable 2.6.24-16-server`.
- **Evidence:** `logs/a5_bindshell_root.txt`
- **Detected by Elastic/Kibana?** Y — **30 flow events** to the unusual port 1524.

---

## Log

(Newest last.)
- 2026-11-08 16:04–16:16 — A1 recon + A2–A5 exploits executed and captured.
  All five detected in the SIEM (see `logs/detection_summary.txt`).
