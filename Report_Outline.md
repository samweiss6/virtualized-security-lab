# Report Outline — Virtualized Security Lab

Industry-style pentest / SOC detection report skeleton. Fill in as findings
come in during Weeks 4–10; finalize in Weeks 11–13.

## Title Page
- Virtualized Security Lab — Penetration Test & Detection Report
- Samuel Weiss — LIS4905 Directed Individual Study, Fall 2026
- Instructor: Ebrahim Randeree
- Date

## 1. Executive Summary
[1–2 paragraphs, written last: what was tested, what was found at a high
level, whether detections worked, and the overall takeaway — written for a
non-technical reader.]

## 2. Scope & Rules of Engagement
- Testing was conducted exclusively within an isolated virtual lab (UTM
  host-only network on a local Mac). No production or third-party systems
  were in scope.
- In scope: Metasploitable2 (target, UTM Emulate/x86_64)
- Attacking system: Kali Linux (UTM Virtualize/ARM64)
- Monitoring system: Splunk (Docker container on host)
- Testing window: [dates]

## 3. Methodology
[Describe the approach — recon → vulnerability identification → exploitation
→ post-exploitation → detection validation. Name the tools used (nmap,
Metasploit, etc.) and reference a framework if used (e.g. PTES, MITRE
ATT&CK).]

## 4. Findings
One subsection per attack/vulnerability. Repeat this block per finding:

### 4.x [Finding name]
- **MITRE ATT&CK ID:** [e.g. T1046 — Network Service Scanning]
- **Severity:** [Critical / High / Medium / Low]
- **Description:** [what the vulnerability/weakness is]
- **Steps to Reproduce:** [numbered commands]
- **Evidence:** [screenshot/log reference — see /screenshots]
- **Impact:** [what an attacker could do with this]

## 5. Detection Summary
Table mapping each finding to the Splunk search/dashboard that caught it:

| Finding | ATT&CK ID | Detected? | Splunk Search / Dashboard | Evidence |
|---|---|---|---|---|
| | | | | |

## 6. Recommendations
[Remediation per finding — what would fix or reduce the risk in a real
environment.]

## 7. Conclusion
[Summary of what the project demonstrated, lessons learned, and how it ties
to the DIS goals — hands-on experience, Security+ prep, etc.]

## 8. Appendix
- Full command logs
- Tool versions
- Lab architecture diagram (see README)
