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

## A2 — FTP Brute Force  ⏳ PLANNED

- **Technique:** Credential brute force against FTP (21)
- **MITRE ATT&CK ID:** T1110 (Brute Force)
- **Tool / Command(s):** `hydra -L users.txt -P pass.txt ftp://192.168.128.4`
- **Expected detection:** repeated FTP connections / auth attempts in Packetbeat.
- **Evidence:** _pending — `logs/a2_hydra_ftp.txt`_

## A3 — UnrealIRCd 3.2.8.1 Backdoor  ⏳ PLANNED

- **Technique:** Exploit backdoor command execution in UnrealIRCd on 6667
- **MITRE ATT&CK ID:** T1190 (Exploit Public-Facing Application); **CVE-2010-2075**
- **Tool / Command(s):** `metasploit exploit/unix/irc/unreal_ircd_3281_backdoor`
- **Expected detection:** connection to 6667 + reverse shell flow to Kali.
- **Evidence:** _pending — `logs/a3_unrealircd.txt`_

## A4 — Samba usermap_script  ⏳ PLANNED

- **Technique:** Command injection via Samba username map script
- **MITRE ATT&CK ID:** T1190; **CVE-2007-2447**
- **Tool / Command(s):** `metasploit exploit/multi/samba/usermap_script`
- **Expected detection:** SMB connection to 445 + reverse shell flow.
- **Evidence:** _pending — `logs/a4_samba.txt`_

## A5 — Root Bindshell (1524)  ⏳ PLANNED

- **Technique:** Connect to the exposed root bind shell left open on 1524
- **MITRE ATT&CK ID:** T1190 / T1059 (Command and Scripting Interpreter)
- **Tool / Command(s):** `nc 192.168.128.4 1524`
- **Expected detection:** flow to the unusual port 1524.
- **Evidence:** _pending — `logs/a5_bindshell.txt`_

---

## Log

(Newest last; updated as attacks are executed.)
- 2026-11-08 — A1 recon completed and captured.
