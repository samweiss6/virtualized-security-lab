const pptxgen = require('pptxgenjs');
const p = new pptxgen();
p.layout = 'LAYOUT_WIDE';
p.author = 'Samuel Weiss';
p.title = 'Virtualized Security Lab';

const NAVY='0E1E33', MUTE='64748B', PAPER='F4F7FB', CARD='FFFFFF', INK='1C2A38',
      RED='E5484D', AMBER='D98A24', TEAL='148B98', TEALD='0E6E79', GREEN='2E9E57',
      LINE='DCE6F0', CYAN='17AEBE', WHITE='FFFFFF';
const HEAD='Arial', BODY='Arial', SKETCH='Comic Sans MS';
const IC='/Users/samw/Documents/DISFALL2026/diagrams/icons/';
const SS='/Users/samw/Documents/DISFALL2026/screenshots/';
const PENGUIN=IC+'kali_penguin.png', TARGET=IC+'target_server.png', EYE=IC+'siem_eye.png', BLOCK=IC+'internet_blocked.png';
const EW=13.33, EH=7.5, M=0.6;

function bg(s,c){ s.background={color:c}; }
function tb(s,t,o){ s.addText(t, Object.assign({isTextBox:true,fontFace:BODY,color:INK}, o)); }
function title(s,t,o){ o=o||{}; tb(s,t,Object.assign({x:M,y:0.42,w:EW-2*M,h:0.9,fontFace:HEAD,bold:true,fontSize:34,color:o.color||INK},o)); }
function footer(s,n){ tb(s,'Virtualized Security Lab  ·  LIS4905 DIS  ·  S. Weiss',{x:M,y:EH-0.42,w:9,h:0.3,fontSize:9,color:MUTE});
  tb(s,String(n),{x:EW-1.1,y:EH-0.42,w:0.5,h:0.3,fontSize:9,color:MUTE,align:'right'}); }
function arrow(s,x1,y1,x2,y2,o){ o=o||{}; s.addShape(p.ShapeType.line,{x:x1,y:y1,w:x2-x1,h:y2-y1,line:{color:o.color||INK,width:o.width||3,endArrowType:'triangle',dashType:o.dash||'solid'}}); }
function sketch(s,t,o){ tb(s,t,Object.assign({fontFace:SKETCH,color:INK,align:'center',fontSize:12},o)); }
function card(s,x,y,w,h,fill){ s.addShape(p.ShapeType.roundRect,{x,y,w,h,rectRadius:0.1,fill:{color:fill||CARD},line:{color:LINE,width:1},shadow:{type:'outer',color:'9AA7B4',blur:6,offset:2,angle:90,opacity:0.3}}); }

// 1 — TITLE
let s=p.addSlide(); bg(s,NAVY);
tb(s,'VIRTUALIZED SECURITY LAB',{x:M,y:1.5,w:EW-2*M,h:1.1,fontFace:HEAD,bold:true,fontSize:52,color:WHITE});
tb(s,'Build an isolated attack lab — then prove a SIEM catches every move',{x:M,y:2.7,w:EW-2*M,h:0.6,fontSize:20,color:'B9C7D8'});
s.addImage({path:PENGUIN,x:2.4,y:4.2,w:1.7,h:1.7});
arrow(s,4.3,5.05,6.3,5.05,{color:RED,width:5}); sketch(s,'attacks',{x:4.3,y:4.55,w:2.0,h:0.4,color:'F3A3A5'});
s.addImage({path:TARGET,x:6.5,y:4.2,w:1.7,h:1.7});
s.addImage({path:EYE,x:9.4,y:4.1,w:1.9,h:1.9});
arrow(s,6.0,4.3,9.4,4.6,{color:CYAN,width:3,dash:'dash'}); arrow(s,7.4,4.3,10.0,4.5,{color:CYAN,width:3,dash:'dash'});
sketch(s,'the SIEM watches',{x:9.2,y:5.9,w:2.3,h:0.4,color:'8FD8E0'});
tb(s,'Samuel Weiss   ·   LIS4905 Directed Individual Study   ·   Fall 2026   ·   Instructor: E. Randeree',{x:M,y:6.7,w:EW-2*M,h:0.4,fontSize:13,color:'8698AC'});

// 2 — THE BIG IDEA
s=p.addSlide(); bg(s,PAPER); title(s,'The big idea, in plain terms');
tb(s,[
 {text:'Two computers inside one laptop: an attacker and a deliberately weak victim.',options:{bullet:{code:'2022'},breakLine:true}},
 {text:'Attack the victim with real hacker tools.',options:{bullet:{code:'2022'},breakLine:true}},
 {text:'A SIEM (security monitor) records everything and shows the attack.',options:{bullet:{code:'2022'},breakLine:true}},
 {text:'Fully sealed — no route to the real internet.',options:{bullet:{code:'2022'},breakLine:true}},
 {text:'All on one 8 GB Apple-M1 laptop (which ruled out the usual tools).',options:{bullet:{code:'2022'}}},
],{x:M,y:1.7,w:5.9,h:3.8,fontSize:17,color:INK,paraSpaceAfter:15});
card(s,6.9,1.6,5.8,4.5,CARD);
s.addImage({path:PENGUIN,x:7.2,y:3.1,w:1.5,h:1.5}); sketch(s,'KALI\n(attacker)',{x:7.0,y:4.55,w:1.9,h:0.6,color:RED,bold:true});
arrow(s,8.85,3.85,10.2,3.85,{color:RED,width:5}); sketch(s,'attacks',{x:8.8,y:3.35,w:1.6,h:0.4,color:RED});
s.addImage({path:TARGET,x:10.2,y:3.05,w:1.5,h:1.5}); sketch(s,'TARGET\n(weak on purpose)',{x:9.7,y:4.55,w:2.5,h:0.6,color:AMBER,bold:true});
s.addImage({path:EYE,x:9.0,y:1.75,w:1.4,h:1.4}); arrow(s,9.6,3.0,9.5,3.2,{color:TEAL,width:3,dash:'dash'});
sketch(s,'SIEM watches & records',{x:7.5,y:1.95,w:1.6,h:1.0,color:TEALD,fontSize:11,align:'left'});
footer(s,2);

// 3 — ARCHITECTURE (+ isolation)
s=p.addSlide(); bg(s,PAPER); title(s,'How the lab is wired — and sealed');
s.addShape(p.ShapeType.roundRect,{x:M,y:1.5,w:EW-2*M,h:4.0,rectRadius:0.12,fill:{color:'EAF1FA'},line:{color:'9DBBE0',width:2,dashType:'dash'}});
tb(s,'Host-Only network  ·  192.168.128.0/24  ·  NO route to the internet (verified)',{x:M+0.2,y:1.6,w:10,h:0.4,fontSize:13,bold:true,color:'2A5C9A'});
s.addImage({path:PENGUIN,x:1.4,y:2.6,w:1.6,h:1.6}); sketch(s,'KALI — attacker\n192.168.128.2',{x:0.9,y:4.2,w:2.7,h:0.7,color:RED,bold:true,fontSize:13});
s.addImage({path:TARGET,x:10.3,y:2.6,w:1.6,h:1.6}); sketch(s,'Metasploitable2 — target\n192.168.128.4',{x:9.3,y:4.2,w:3.7,h:0.7,color:AMBER,bold:true,fontSize:13});
arrow(s,3.2,3.3,10.1,3.3,{color:RED,width:5}); sketch(s,'attacks (scan → exploit)',{x:4.7,y:2.8,w:4.0,h:0.4,color:RED,fontSize:13});
s.addImage({path:EYE,x:5.95,y:4.15,w:1.45,h:1.45});
sketch(s,'Elastic SIEM (on the Mac) · .1 — captures all traffic',{x:3.9,y:5.55,w:5.6,h:0.4,color:TEALD,bold:true,fontSize:12});
arrow(s,5.0,3.45,6.4,4.2,{color:TEAL,width:3,dash:'dash'}); arrow(s,8.4,3.45,7.0,4.2,{color:TEAL,width:3,dash:'dash'});
s.addImage({path:BLOCK,x:11.95,y:1.6,w:1.0,h:1.0});
footer(s,3);

// 4 — RECON → EXPLOITATION
s=p.addSlide(); bg(s,PAPER); title(s,'Recon → break in');
s.addImage({path:PENGUIN,x:11.5,y:0.3,w:1.1,h:1.1});
tb(s,[
 {text:'Recon first: ',options:{bold:true,color:TEAL}},
 {text:'nmap scanned all 65,535 ports and found 23 open, outdated services — then four of them became a way in.',options:{}},
],{x:M,y:1.35,w:10.6,h:0.6,fontSize:15,color:INK});
const erows=[
 ['Service','Technique / CVE','What we got'],
 ['Full port scan','T1046 — recon','65,596 ports probed; 23 services found'],
 ['FTP (port 21)','T1110 — brute force','Cracked login  msfadmin : msfadmin'],
 ['UnrealIRCd (6667)','CVE-2010-2075','Remote shell on the target'],
 ['Samba (445)','CVE-2007-2447','Remote shell (runs as root)'],
 ['Bind shell (1524)','T1190 — exposed backdoor','Instant root — uid=0, no password'],
];
s.addTable(erows.map((r,ri)=>r.map(c=>({text:c,options:{
   bold: ri===0 || ri===erows.length-1,
   color: ri===0?WHITE:INK,
   fill:{color: ri===0?TEALD : (ri===erows.length-1?'FFF4E6' : (ri%2?CARD:'EEF3F9'))},
   align:'left', valign:'middle', fontSize:14}}))),
 {x:M,y:2.05,w:EW-2*M,colW:[3.7,4.4,EW-2*M-3.7-4.4],rowH:0.64,border:{type:'solid',color:LINE,pt:1},margin:7,fontFace:BODY});
tb(s,'A weak password, two unpatched services, and a literal backdoor.',{x:M,y:6.1,w:EW-2*M,h:0.4,fontSize:14,italic:true,color:MUTE});
footer(s,4);

// 5 — PROOF
s=p.addSlide(); bg(s,NAVY); title(s,'Proof: we became root',{color:WHITE});
tb(s,'The real terminal output from the attack — captured as evidence.',{x:M,y:1.35,w:EW-2*M,h:0.4,fontSize:15,color:'B9C7D8'});
const w08=11.6,h08=w08*0.1132;
s.addShape(p.ShapeType.roundRect,{x:M-0.05,y:2.0,w:w08+0.1,h:h08+0.3,rectRadius:0.06,fill:{color:'0A1626'},line:{color:GREEN,width:1.5}});
s.addImage({path:SS+'08_terminal_root_shell.png',x:M,y:2.15,w:w08,h:h08});
tb(s,'uid=0(root) = complete control of the target machine.',{x:M,y:2.15+h08+0.35,w:EW-2*M,h:0.4,fontSize:14,bold:true,color:GREEN});
const w09=11.6,h09=w09*0.0756;
s.addShape(p.ShapeType.roundRect,{x:M-0.05,y:4.3,w:w09+0.1,h:h09+0.3,rectRadius:0.06,fill:{color:'0A1626'},line:{color:CYAN,width:1.5}});
s.addImage({path:SS+'09_terminal_hydra_crack.png',x:M,y:4.45,w:w09,h:h09});
tb(s,'hydra guessed the FTP password in seconds: msfadmin : msfadmin.',{x:M,y:4.45+h09+0.3,w:EW-2*M,h:0.4,fontSize:14,bold:true,color:CYAN});
footer(s,5);

// 6 — DETECTION
s=p.addSlide(); bg(s,NAVY); title(s,'The SIEM sees it all',{color:WHITE});
s.addImage({path:EYE,x:11.6,y:0.35,w:1.1,h:1.1});
tb(s,'Packetbeat records every packet. The attack is impossible to miss.',{x:M,y:1.35,w:10,h:0.4,fontSize:15,color:'B9C7D8'});
const w01=5.8,h01=w01*0.548;
s.addShape(p.ShapeType.roundRect,{x:0.6,y:1.9,w:w01+0.2,h:h01+0.2,rectRadius:0.06,fill:{color:WHITE}});
s.addImage({path:SS+'01_flows_connections_portscan_spike.png',x:0.7,y:2.0,w:w01,h:h01});
tb(s,'▲ The port scan: one giant spike to ~65k flows.',{x:0.7,y:2.1+h01+0.1,w:w01,h:0.4,fontSize:12,color:'B9C7D8'});
const w05=5.8,h05=w05*0.3958;
s.addShape(p.ShapeType.roundRect,{x:6.85,y:1.9,w:w05+0.2,h:h05+0.2,rectRadius:0.06,fill:{color:WHITE}});
s.addImage({path:SS+'05_overview_transaction_types.png',x:6.95,y:2.0,w:w05,h:h05});
tb(s,'▲ ~260,000 flow events indexed during the attack window.',{x:6.95,y:2.1+h05+0.1,w:w05,h:0.4,fontSize:12,color:'B9C7D8'});
footer(s,6);

// 7 — MAPPING (+ isolation proof)
s=p.addSlide(); bg(s,PAPER); title(s,'Every attack → how the SIEM caught it');
const mrows=[
 ['Attack','MITRE ATT&CK','What the SIEM showed'],
 ['Port scan','T1046','65,596 distinct ports from .2 → .4'],
 ['FTP brute force','T1110','72 flows to port 21 (burst)'],
 ['UnrealIRCd backdoor','T1190','25 flows to 6667 + reverse shell'],
 ['Samba usermap','T1190','8 flows to 445 + reverse shell'],
 ['Root bind shell','T1190','30 flows to unusual port 1524'],
];
s.addTable(mrows.map((r,ri)=>r.map(c=>({text:c,options:{
   bold:ri===0, color:ri===0?WHITE:INK,
   fill:{color:ri===0?TEALD:(ri%2?CARD:'EEF3F9')}, align:'left', valign:'middle', fontSize:14}}))),
 {x:M,y:1.75,w:EW-2*M,colW:[3.6,3.0,EW-2*M-6.6],rowH:0.58,border:{type:'solid',color:LINE,pt:1},margin:7,fontFace:BODY});
card(s,M,5.35,EW-2*M,0.95,'ECFAF6');
s.addImage({path:BLOCK,x:0.85,y:5.5,w:0.65,h:0.65});
tb(s,[
 {text:'Isolation, proven: ',options:{bold:true,color:GREEN}},
 {text:'the only IPs in the SIEM were .1 / .2 / .4 — no public internet address anywhere.',options:{}},
],{x:1.7,y:5.5,w:10.8,h:0.65,fontSize:14,color:INK,valign:'middle'});
footer(s,7);

// 8 — RESULTS
s=p.addSlide(); bg(s,NAVY);
tb(s,'What it proves — and what’s next',{x:M,y:0.5,w:EW-2*M,h:0.9,fontFace:HEAD,bold:true,fontSize:34,color:WHITE});
tb(s,[
 {text:'A complete security loop — build → attack → detect — on one 8 GB laptop.',options:{bullet:{code:'2022'},breakLine:true}},
 {text:'Five real exploits (incl. CVE-2010-2075 & CVE-2007-2447), all captured.',options:{bullet:{code:'2022'},breakLine:true}},
 {text:'ARM + emulation forced creative fixes: serial-console install, native Elastic.',options:{bullet:{code:'2022'},breakLine:true}},
 {text:'Documenting the failures was the real learning.',options:{bullet:{code:'2022'}}},
],{x:M,y:1.7,w:7.4,h:2.6,fontSize:17,color:'DCE6F2',paraSpaceAfter:14});
tb(s,'Next steps',{x:M,y:4.5,w:6,h:0.4,fontSize:16,bold:true,color:CYAN});
tb(s,'Custom alert rules  ·  richer dashboards  ·  more attack scenarios  ·  finalize the report.',{x:M,y:4.9,w:7.4,h:0.8,fontSize:14,color:'B9C7D8'});
s.addImage({path:PENGUIN,x:8.9,y:2.0,w:1.5,h:1.5}); arrow(s,10.3,2.75,11.2,2.75,{color:RED,width:4}); s.addImage({path:EYE,x:11.0,y:2.0,w:1.5,h:1.5});
tb(s,'github.com/samweiss6/virtualized-security-lab',{x:M,y:6.6,w:EW-2*M,h:0.4,fontSize:13,color:'8FD8E0'});

p.writeFile({fileName:'/Users/samw/Documents/DISFALL2026/Virtualized_Security_Lab_8slide.pptx'}).then(f=>console.log('WROTE',f));
