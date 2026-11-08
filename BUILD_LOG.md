# Build Log — Virtualized Security Lab

Timestamped record of the lab build. Times are host-Mac local (CST, UTC−6)
unless noted. Kali/M2 guest clocks are set to Eastern, so their timestamps
run +1h. Newest entries at the bottom.

## 2026-11-08 (build day 1)

- **09:12** — Project folder `~/Documents/DISFALL2026` empty; session started.
- **09:24** — Cloned `virtualized-security-lab` repo. Verified machine: Apple
  **M1, 8 GB RAM, macOS 12.3**, `arm64`. UTM **4.7.5** (CLI at
  `/Applications/UTM.app/Contents/MacOS/utmctl`). One pre-existing UTM VM
  "Kali Linux" (aarch64, Virtualize) but its disk was empty — Kali was never
  actually installed. ~30 GB free disk.
- **~09:30** — Reclaimed disk: cleared regenerable caches, trashed installed-app
  DMGs (Docker/Chrome/VirtualBox/etc.). Confirmed decisions: SIEM = Elastic/
  Kibana (native arm64, not Splunk); network = UTM Host Only; no x86 emulation
  for the SIEM.
- **~09:35** — Updated repo: replaced Splunk→Elastic across README/report/attack
  log; added CLAUDE.md with verified machine facts. *(commit)*
- **~09:36–09:45** — Kali install attempts. Set VM network to **Host Only**.
  Hit two blockers: (1) UTM imported the Kali ISO as a **USB disk** that was far
  too slow to boot → fixed by switching the installer drive to **VirtIO**;
  (2) the VM's **graphical console never renders the Linux installer** on any
  display adapter (virtio-gpu-pci / virtio-ramfb / virtio-ramfb-gl) — GRUB shows,
  then blank. `nomodeset` made it worse (arm64 has no VGA text fallback).
- **10:09** — Metasploitable2 download finished & verified (825 MB zip →
  `Metasploitable.vmdk` + VMware config).
- **10:17** — **Workaround that unblocked everything:** added a UTM **TCP-server
  serial console** (port 4321) and booted the Kali text installer with
  `console=ttyAMA0,115200 DEBIAN_FRONTEND=text`. Drove the entire install over
  `nc 127.0.0.1 4321`: language/locale/keyboard, network (DHCP works on the
  host-only net but **no default route** = isolated, as desired), user `kali`/
  `kali`, guided partitioning onto the 68.7 GB disk, Xfce + top-10 tools.
- **~10:40** — Kali install completed (~14 GB used).
- **~11:00** — Removed the installer disk so UEFI boots the real disk; the
  installed Kali also comes up on serial (`kali login:` on ttyAMA0). Logged in,
  enabled SSH, installed a key from the Mac. **Kali reachable at
  `192.168.128.2`** via `ssh -i ~/.ssh/kali_lab kali@192.168.128.2`. Confirmed
  tools: nmap, metasploit, hydra, sqlmap, nikto. Internet access verified
  blocked. *(commits)*
- **11:20** — Elasticsearch + Kibana 8.18.2 (darwin-aarch64) downloaded.
- **11:21** — Hand-built the **Metasploitable2** UTM Emulate VM (x86_64,
  i440fx/qemu64/TCG, e1000 on host-only, IDE from the vmdk) by writing its
  `config.plist` directly. QEMU launched cleanly first try.
- **~11:26** — M2 had no network: its udev persistent-net rule binds the NIC to
  the image's **original MAC**. Set the VM NIC to `00:0C:29:FA:DD:2A`; after a
  `dhclient eth0` on the M2 console, **M2 came up at `192.168.128.4`**.
- **~11:30** — Elasticsearch running (native arm64, bound to loopback +
  `192.168.128.1` only), cluster `lab-siem`, green.
- **11:35** — First recon from Kali: full `nmap -sV -O` of M2 saved to
  `logs/`. Classic Metasploitable2 surface present (vsftpd, OpenSSH 4.7, Samba,
  UnrealIRCd 6667, MySQL 5.0.51a, Tomcat 8180, NFS, root bindshell 1524, …).
  *(commit — lab operational)*
- **11:37** — Started Kibana (bound to `192.168.128.1:5601`); downloaded
  Packetbeat 8.18.2 (arm64) to sniff the host-only interface into Elasticsearch.
- **11:39** — Kibana still initializing (first-start bundle optimization, slow
  under tight RAM). Build log created.
- **11:45** — Elasticsearch went **red**: its disk-allocation watermark read the
  APFS container as 92.5% full (macOS reports only ~17 GB usable against the
  228 GB container), blocking shard allocation and hanging Kibana. Disabled the
  disk threshold decider (lab-safe, persisted to `elasticsearch.yml`) → ES
  **green**, Kibana **available** at `http://192.168.128.1:5601`.
- **11:50** — Loaded Packetbeat index templates + prebuilt dashboards into
  Kibana. Decided to run Packetbeat **on Kali** (sniffing eth0) rather than the
  Mac, to avoid a host sudo prompt and keep Mac RAM for ES/Kibana.
