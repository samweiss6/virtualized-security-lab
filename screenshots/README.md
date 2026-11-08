# Screenshots — SIEM Detection Evidence

Captured from Kibana (`packetbeat-*`) on 2026-11-08, covering the attack window
(~15:00–15:16 local). All traffic is confined to the host-only `192.168.128.0/24`
network — no external IPs appear, which is itself evidence of isolation.

| File | Dashboard / View | What it shows |
|---|---|---|
| `01_flows_connections_portscan_spike.png` | Flows — Connections over time | Single **~65,000 unique-flow spike** at 15:00 — the full-port nmap scan (A1). |
| `02_flows_host_traffic_isolation.png` | Flows — Network Traffic Between Hosts | Attacker `192.168.128.2` → target `192.168.128.4` (14.7 MB). Only `.1/.2/.4` present → **isolation confirmed**. |
| `03_flows_top_source_attacker.png` | Flows — Top Hosts Creating Traffic | ~20 MB spike sourced from the attacker `.2`. |
| `04_flows_top_dest_target.png` | Flows — Top Hosts Receiving Traffic | Matching spike received by the target `.4`. |
| `05_overview_transaction_types.png` | Overview — Transaction Types | **~260,000 flow events** indexed during the window (scale of the scan). |
| `06_overview_errors_latency.png` | Overview — Errors / latency | Error + latency spikes at 15:00–15:30 as the exploits (A3–A5) hit services. |
| `07_discover_destination_ports.png` | Discover — `destination.port` field | Port spread across the scan (**"Other" = 90.4%** of 5,000 samples); attacked service ports 21/80/139/1524/6667 visible. |

Terminal evidence (root shell, credential crack) is text in `../logs/`
(`a5_bindshell_root.txt`, `a2_hydra_ftp.txt`); screenshots of it may be added later.
