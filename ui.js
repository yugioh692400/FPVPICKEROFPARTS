/* PCPartPicker-style UI + Betaflight guide + wiring extras */
(function(){
const st=document.createElement('style');st.textContent=`body{grid-template-columns:480px 1fr}aside{padding:0;background:#161b22}
#hd{padding:14px 16px;background:linear-gradient(90deg,#ff7a1a,#c4410c);color:#000}#hd h1{margin:0;color:#000;font-size:20px}#hd small{opacity:.8}
.r{display:grid;grid-template-columns:96px 1fr auto;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid #263040}.r:hover{background:#1c2430}
.cat{font-size:11px;color:#8a96a6;text-transform:uppercase;letter-spacing:.06em}.nm{font-weight:600}.sp{font-size:12px;color:#8a96a6;margin-top:2px}.w{font-size:12px;color:#8a96a6}
.ch{background:#ff7a1a;color:#000;font-weight:600}.bad{color:#ffb020;font-size:12px}
#md{position:fixed;inset:0;background:rgba(0,0,0,.65);display:none;align-items:center;justify-content:center;z-index:9}#mb{background:#1a2029;width:min(680px,94vw);max-height:84vh;display:flex;flex-direction:column;border-radius:10px;overflow:hidden}
#mb input[type=text]{margin:12px;padding:9px;background:#10141a;border:1px solid #3a4655;border-radius:6px;color:#e6eaf0}#ml{overflow:auto}
.it{display:grid;grid-template-columns:1fr auto;padding:9px 14px;border-top:1px solid #263040;cursor:pointer}.it:hover{background:#243040}
#bf{position:absolute;inset:0;display:none;overflow:auto;padding:18px 24px;background:#f4f6f8;color:#111;line-height:1.5}#bf>div{max-width:900px;margin:auto}
#bf h2{color:#c4410c}#bf pre{background:#111;color:#9fe;padding:12px;border-radius:8px;overflow:auto;font-size:12px}#bf .stp{background:#fff;border:1px solid #d5dbe2;border-radius:8px;padding:10px 14px;margin:10px 0}
#wt{max-width:1000px;margin:6px auto;border-collapse:collapse;font-size:12px;width:100%}#wt td,#wt th{border:1px solid #cfd6de;padding:4px 8px;text-align:left}#wt th{background:#e6ebf0}`;document.head.append(st);
const bf=document.createElement('div');bf.id='bf';q('view').append(bf);
const md=document.createElement('div');md.id='md';md.innerHTML='<div id="mb"><input type="text" id="mq" placeholder="Search parts..."><label style="margin:0 14px 8px;display:flex;gap:6px;color:#e6eaf0"><input type="checkbox" id="mc" checked style="width:auto"> Show only compatible with my frame</label><div id="ml"></div></div>';document.body.append(md);
md.onclick=e=>{if(e.target==md)md.style.display='none'};
const sp=(k,it)=>({frame:`${it[1]}mm · ${it[2]}" · ${it[3]}mm stack · ${it[4]}mm motor`,motor:`${it[3]}x${it[3]}mm · ${it[5][0]}-${it[5][1]}S · ${it[4]}g`,prop:`${it[1]}" · ${it[2]}-blade · ${it[3]}g`,fc:`${it[2]} · ${it[1]}mm stack`,esc:`${it[2]}A · ${it[1]}mm · ${it[4][0]}-${it[4][1]}S`,vtx:`${{a:'Analog',dji:'DJI',ws:'Walksnail',hdz:'HDZero'}[it[1]]} · ${it[5]}g`,cam:`${{a:'Analog',dji:'DJI',ws:'Walksnail',hdz:'HDZero'}[it[5]]} · ${it[1]}mm`,rx:`${it[1]} · ${it[2]}g`,bat:`${it[1]}S · ${it[2]}mAh · ${it[6]}g`,gps:it.length>1?`${it[1]}x${it[2]}mm`:'No GPS',ant:`${{L:'Lollipop',D:'Dipole',P:'Pagoda'}[it[1]]} · ${it[2]}mm`}[k]);
const fits=(k,it)=>{const f=D.frame[s.frame],e=D.esc[s.esc];return k=='motor'?it[3]==f[4]:k=='prop'?Math.abs(it[1]-f[2])<=.3:k=='fc'||k=='esc'?it[1]==f[3]:k=='bat'?it[1]>=e[4][0]&&it[1]<=e[4][1]:true};
const wt=(k,it)=>({frame:5,motor:4,prop:3,fc:3,esc:3,vtx:5,cam:4,rx:2,bat:6,gps:4,ant:3}[k]);
function open(k,l){const ml=q('ml'),qs=q('mq'),cb=q('mc');md.style.display='flex';qs.value='';const draw=()=>{const t=qs.value.toLowerCase();ml.innerHTML='';D[k].forEach((it,i)=>{if(t&&!it[0].toLowerCase().includes(t))return;const ok=fits(k,it);if(cb.checked&&!ok)return;const d=document.createElement('div');d.className='it';d.innerHTML=`<div><b>${it[0]}</b><div class="sp">${sp(k,it)}</div></div><div class="${ok?'w':'bad'}">${ok?(i==s[k]?'✓ selected':''):'⚠ may not fit'}</div>`;d.onclick=()=>{s[k]=i;md.style.display='none';update()};ml.append(d)});if(!ml.children.length)ml.innerHTML='<div class="it">No matches</div>'};qs.oninput=draw;cb.onchange=draw;draw();qs.focus()}
const hd=document.createElement('div');hd.id='hd';hd.innerHTML='<h1>FPV Quad Part Picker</h1><small id="cnt"></small>';const rows=document.createElement('div');
q('sel').style.display='none';const side=document.querySelector('aside');side.prepend(rows);side.prepend(hd);
function rowsDraw(){rows.innerHTML='';let n=0;C.forEach(([k,l])=>{const it=D[k][s[k]];if(it.length>1)n++;const d=document.createElement('div');d.className='r';d.innerHTML=`<div class="cat">${l.replace(/ \(.*/,'')}</div><div><div class="nm">${it[0]}</div><div class="sp">${sp(k,it)}</div></div><button class="ch">Change</button>`;d.querySelector('button').onclick=()=>open(k,l);rows.append(d)});q('cnt').textContent=n+' parts selected · '+Object.values(D).reduce((a,b)=>a+b.length,0)+' parts in catalog'}
// ---- tabs
const tb=document.createElement('button');tb.textContent='Betaflight setup';tb.id='tb';q('tw').after(tb);
const sh=n=>{q('c3').style.display=n==0?'block':'none';q('wire').style.display=n==1?'block':'none';bf.style.display=n==2?'block':'none';['tv','tw','tb'].forEach((i,j)=>q(i).className=j==n?'on':'');if(n==0)rs()};
q('tv').onclick=()=>sh(0);q('tw').onclick=()=>sh(1);tb.onclick=()=>sh(2);
// ---- wiring extras
const ow=window.wiring;
window.wiring=function(){ow();const [f,m,p,fc,e,v,c,r,b,g]=sel(),gps=g.length>1,dig=v[1]!='a';
const x=`<g font-size="10"><rect x="20" y="560" width="270" height="80" fill="#fafafa" stroke="#999" rx="5"/><text x="30" y="576" font-weight="bold">Legend / wire gauges</text>
<line x1="30" y1="588" x2="60" y2="588" stroke="#d22" stroke-width="3"/><text x="66" y="591">Power + (battery 12-14AWG, 5V/9V 26-28AWG)</text>
<line x1="30" y1="602" x2="60" y2="602" stroke="#111" stroke-width="3"/><text x="66" y="605">Ground / negative</text>
<line x1="30" y1="616" x2="60" y2="616" stroke="#e8b400" stroke-width="3"/><text x="66" y="619">Signal (28-30AWG) / motor phase A (20-22AWG)</text>
<line x1="30" y1="630" x2="60" y2="630" stroke="#1a9a3a" stroke-width="3"/><text x="66" y="633">UART TX (from device) → RX of the other</text></g>
<g font-size="10" fill="#444"><text x="330" y="525" >Motor wires: 18-22AWG silicone, ~${(Math.max(30,f[1]*.35)).toFixed(0)}mm each, tin pads first.</text><text x="330" y="538">Battery lead: XT60, 12-14AWG; cap across BAT+/BAT-.</text>
<text x="330" y="551">ESC → FC: 8-pin harness (VBAT, G, CURR, TLM, M1-M4) or soldered.</text>
<rect x="580" y="330" width="130" height="14" fill="#fff" stroke="#999"/><text x="585" y="341">LED_STRIP pad (optional, 5V/G)</text>
<text x="590" y="70">Digital VTX: use supplied cable</text></g>`;
svg=svg.replace('</svg>',x+'</svg>');q('wire').querySelector('svg').outerHTML=svg;
const W=[['Battery XT60 (+)','ESC BAT+','Red','12-14'],['Battery XT60 (−)','ESC BAT−','Black','12-14'],['Capacitor +/−','ESC BAT+ / BAT−','—','leads ≤10mm'],['ESC M1-M4 (3 pads each)','Motor 1-4 phase wires','Any order (swap two to reverse)','18-22'],['ESC 8-pin','FC 8-pin (VBAT, G, CURR, TLM, M1-M4)','Harness','26-28'],['FC 5V','Receiver 5V','Red','26-28'],['FC G','Receiver GND','Black','26-28'],['FC T2 (TX2)','Receiver RX','Yellow','28-30'],['FC R2 (RX2)','Receiver TX','Green','28-30'],['FC '+(dig?'VBAT':'9V/VBAT')+' pad','VTX V+','Red','24-26'],['FC G','VTX GND','Black','24-26'],['FC T3 (TX3)','VTX RX / SmartAudio','Yellow','28-30'],['FC R3 (RX3)','VTX TX ('+(dig?'MSP':'optional')+')','Green','28-30'],['FC 5V','Camera 5V','Red','28'],['FC G','Camera GND','Black','28'],['Camera VID','VTX VID IN'+(dig?' (or supplied cable)':''),'Yellow','28'],['FC BZ+ / BZ−','Buzzer + / −','Red / Black','28']];
if(gps)W.push(['FC 5V / G','GPS 5V / GND','Red / Black','28'],['FC T4 (TX4)','GPS RX','Yellow','28-30'],['FC R4 (RX4)','GPS TX','Green','28-30']);
q('wire').insertAdjacentHTML('beforeend','<table id="wt"><tr><th>From (pad)</th><th>To</th><th>Wire</th><th>AWG</th></tr>'+W.map(a=>'<tr>'+a.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</table>')};
// ---- Betaflight guide
function guide(){const [f,m,p,fc,e,v,c,r,b,g]=sel(),dig=v[1]!='a',gps=g.length>1,pr=r[1],prov=/ELRS|CRSF/.test(pr)?'CRSF':/SBUS|F\.Port/.test(pr)?'SBUS':/iBus/.test(pr)?'IBUS':/Spektrum|SRXL/.test(pr)?'SRXL2':'CRSF',cap=b[2];
const cli=`# Betaflight 4.4/4.5 CLI. Review, then paste in the CLI tab. Always run "diff all" first to back up.
feature -RX_PARALLEL_PWM
feature RX_SERIAL
${gps?'feature GPS\nset gps_provider = UBLOX\nset gps_auto_baud = ON\nset gps_auto_config = ON':'# no GPS selected'}
set serial_rx_provider = ${prov}
set motor_pwm_protocol = DSHOT600
set dshot_bidir = ON
set motor_poles = 14
set vbat_min_cell_voltage = 330
set vbat_warning_cell_voltage = 350
set vbat_max_cell_voltage = 435
set battery_capacity = ${cap}
set small_angle = 180
set osd_displayport_device = ${dig?'MSP':'AUTO'}
set name = ${f[2]}INCH
save`;
bf.innerHTML=`<div><h2>Betaflight setup for this build</h2><p>${f[0]} · ${fc[0]} (${fc[2]}) · ${e[0]} · ${m[0]} · ${b[1]}S. Take props OFF for every step until the final check. Settings below follow the wiring diagram UARTs (RX on UART2, VTX on UART3${gps?', GPS on UART4':''}); change them if your board uses different UARTs.</p>
<div class="stp"><b>1. Flash firmware.</b> Open the Betaflight Configurator, connect USB, Firmware Flasher tab, choose the target for <b>${fc[0]}</b> (or "${fc[2]}" generic), enable "Full chip erase", flash.</div>
<div class="stp"><b>2. Ports tab.</b> UART2: enable <b>Serial Rx</b>. UART3: ${dig?'enable <b>MSP</b> (DisplayPort / OSD) for '+v[0]:'under Peripherals pick <b>VTX (SmartAudio)</b> or <b>VTX (IRC Tramp)</b>'}.${gps?' UART4: <b>GPS</b>, auto baud.':''} Save and reboot.</div>
<div class="stp"><b>3. Configuration tab.</b> ESC/Motor protocol <b>DSHOT600</b>, enable <b>Bidirectional DShot</b> (needs Bluejay/BLHeli_32 ESC firmware: ${e[0]}), motor poles 14, Receiver mode <b>Serial (via UART)</b> with <b>${prov}</b>. Enable ${gps?'GPS, ':''}OSD. Set Arming angle 180, Battery: ${b[1]} cells, min 3.3V, warn 3.5V, max 4.35V.</div>
<div class="stp"><b>4. Receiver tab.</b> ${/ELRS/.test(pr)?'Bind your ExpressLRS receiver first (bind phrase in the ELRS Configurator, or power-cycle 3x to enter bind mode).':'Bind the receiver per its manual.'} Move sticks: Roll/Pitch/Yaw/Throttle must be correct, centered at 1500, throttle 1000-2000. Mapping AETR1234.</div>
<div class="stp"><b>5. Motors tab.</b> Props OFF. Check order and spin direction matches the 3D model (M1 rear-right CCW, M2 front-right CW, M3 rear-left CW, M4 front-left CCW, props-in). To reverse a motor use ESC Configurator (Bluejay) or swap two motor wires. Set the "Motor direction" in the Configurator if you flip them with DShot reversing.</div>
<div class="stp"><b>6. Modes tab.</b> ARM on AUX1 (high), ANGLE/HORIZON optional on AUX2, <b>Flip over after crash</b> (Turtle) on a switch, Beeper on AUX3.${gps?' GPS Rescue on a switch.':''} Failsafe tab: stage 2 = ${gps?'GPS Rescue (after a test)':'Drop'}.</div>
<div class="stp"><b>7. OSD and video.</b> ${dig?'Select '+v[0]+'-compatible font in the OSD, set video format HD in the OSD tab.':'Pick PAL/NTSC to match the camera. VTX tab: choose band/channel/power; fill in a VTX table for '+v[0]+' (see the manufacturer\'s JSON).'} Never power the VTX without an antenna attached (${D.ant&&D.ant[s.ant]?D.ant[s.ant][0]:'antenna'}).</div>
<div class="stp"><b>8. PID/filters.</b> Betaflight Presets tab → pick a preset matching a ${f[2]}-inch frame and motor ${m[0]}. Enable RPM filter (needs bidirectional DShot). Keep default rates, then tune.</div>
<div class="stp"><b>9. First flight checklist.</b> Calibrate accelerometer on level ground; check battery voltage reading; check gyro moves correctly in the Setup tab; test failsafe by turning the radio off with props removed; check ARM works; then hover test low and slow.</div>
<h3>CLI snippet (${b[1]}S, ${m[0]})</h3><pre>${cli}</pre><button onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)">Copy CLI</button>
<p style="color:#555">Safety: settings are typical starting points. Check your FC's and ESC's manual (UART numbers, voltage limits) and follow Betaflight's own docs before flying. Wire polarity mistakes destroy electronics.</p></div>`}
const ou=window.update;window.update=function(){ou();rowsDraw();guide()};
update();
})();
