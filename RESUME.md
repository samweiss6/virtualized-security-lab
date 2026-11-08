# Resume the Lab

Everything was shut down **cleanly** (VMs powered off, Elasticsearch/Kibana
stopped). All data and configs persist. To bring the lab back up:

## Fastest: ask Claude
Just say "resume the lab" and I'll run the steps below and verify.

## Manual steps

Paths:
- UTM CLI: `/Applications/UTM.app/Contents/MacOS/utmctl`
- Elastic: `~/lab-downloads/elastic/elasticsearch-8.18.2` and `kibana-8.18.2`
- SSH to Kali: `ssh -i ~/.ssh/kali_lab kali@192.168.128.2` (user `kali` / `kali`)

1. **Start the VMs** (M2 boots clean in ~60 s → `192.168.128.4`; Kali → `192.168.128.2`):
   ```
   /Applications/UTM.app/Contents/MacOS/utmctl start "Metasploitable2"
   /Applications/UTM.app/Contents/MacOS/utmctl start "Kali Linux"
   ```
2. **Start Elasticsearch, then Kibana** (on the Mac):
   ```
   ~/lab-downloads/elastic/elasticsearch-8.18.2/bin/elasticsearch   # wait ~45s
   ~/lab-downloads/elastic/kibana-8.18.2/bin/kibana                 # wait ~60s
   ```
   Kibana UI: http://192.168.128.1:5601
3. **Restart Packetbeat capture on Kali:**
   ```
   ssh -i ~/.ssh/kali_lab kali@192.168.128.2 'sudo setsid /home/kali/start-pb.sh >/tmp/pb.log 2>&1 </dev/null &'
   ```
4. **Verify:** `ssh -i ~/.ssh/kali_lab kali@192.168.128.2 'ping -c2 192.168.128.4'`

## IMPORTANT — do not force-stop Metasploitable2
Force-stopping dirties its disk and triggers an hour-long fsck. Always shut it
down cleanly: `echo 'shutdown -h now' | nc 192.168.128.4 1524` (root bindshell),
or power it off from its own console. Kali: `ssh ... 'sudo poweroff'`.

## RAM note (8 GB Mac)
Running Kali + M2 + Elasticsearch + Kibana at once is heavy. For a smooth
session, run only what you need: e.g. stop Kibana while generating attack
traffic, start it when you want to view dashboards.
