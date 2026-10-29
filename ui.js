/* PCPartPicker-style UI. Specs are computed lazily per category (the old version evaluated every category at once and crashed). */
(function(){
Object.keys(D).forEach(k=>{const seen={};D[k]=D[k].filter(it=>!seen[it[0]]&&(seen[it[0]]=1))});
const ch={};C.forEach(([k])=>ch[k]=false);
const SYS={a:'Analog',dji:'DJI',ws:'Walksnail',hdz:'HDZero'},TY={L:'Lollipop',D:'Dipole',P:'Pagoda'};
const none=it=>it.length<2;
// per category: [table headers, row cells (last = weight), facets, weight index, quantity]
const COL={
frame:[['Wheelbase','Props','Stack','Motor mount','Weight'],i=>[i[1]+' mm',i[2]+'"',i[3]+' mm',i[4]+' mm',i[5]+' g'],[['Class',i=>i[2]<=2?'Whoop / 2"':i[2]<=3.5?'Toothpick / Micro (2.5-3.5")':i[2]<=5.1?'Freestyle / Race (4-5")':'Long range (6"+)'],['Prop size',i=>i[2]+'"'],['Stack mount',i=>i[3]+' mm']],5,1],
motor:[['Bell Ø','Mount','Cells','Weight'],i=>[i[1]+' mm',i[3]+'x'+i[3]+' mm',i[5][0]+'-'+i[5][1]+'S',i[4]+' g'],[['Stator size',i=>(/(\d{4})(?:\.\d)?(?=\s|$)/.exec(i[0])||[0,'Other'])[1]],['Mount',i=>i[3]+' mm']],4,4],
prop:[['Diameter','Blades','Weight'],i=>[i[1]+'"',i[2],i[3]+' g'],[['Diameter',i=>i[1]+'"'],['Blades',i=>i[2]]],3,4],
fc:[['MCU','Stack','Weight'],i=>[i[2],i[1]+' mm',i[3]+' g'],[['Type',i=>i[4]||'Flight controller only'],['Stack mount',i=>i[1]+' mm'],['MCU',i=>i[2]]],3,1],
esc:[['Current','Stack','Cells','Weight'],i=>[i[2]+' A',i[1]+' mm',i[4][0]+'-'+i[4][1]+'S',i[3]+' g'],[['Type',i=>/AIO ESC/.test(i[0])?'Built into an AIO board':'Standalone 4-in-1 ESC'],['Stack mount',i=>i[1]+' mm']],3,1],
vtx:[['System','Size','Weight'],i=>[SYS[i[1]],i[2]+'x'+i[3]+' mm',i[5]+' g'],[['System',i=>SYS[i[1]]]],5,1],
cam:[['System','Width','Weight'],i=>[SYS[i[5]],i[1]+' mm',i[4]+' g'],[['System',i=>SYS[i[5]]],['Width',i=>i[1]+' mm']],4,1],
rx:[['Protocol','Weight'],i=>[i[1],i[2]+' g'],[['Protocol',i=>i[1]]],2,1],
bat:[['Cells','Capacity','Size (LxWxH)','Weight'],i=>[i[1]+'S',i[2]+' mAh',i[3]+'x'+i[4]+'x'+i[5],i[6]+' g'],[['Cells',i=>i[1]+'S']],6,1],
gps:[['Size','Weight'],i=>none(i)?['—','0 g']:[i[1]+'x'+i[2]+' mm',i[4]+' g'],[],4,1],
ant:[['Type','Length','Weight'],i=>[TY[i[1]],i[2]+' mm',i[3]+' g'],[['Type',i=>TY[i[1]]]],3,1]};
const kv=i=>{const m=/(\d{3,6})\s*KV/i.exec(i[0]);return m?+m[1]:null};
const RNG={frame:[['Wheelbase (mm)',i=>i[1]],['Weight (g)',i=>i[5]]],motor:[['KV',kv],['Weight (g)',i=>i[4]],['Bell diameter (mm)',i=>i[1]]],prop:[['Diameter (in)',i=>i[1]],['Weight (g)',i=>i[3]]],fc:[['Weight (g)',i=>i[3]]],esc:[['Current (A)',i=>i[2]],['Weight (g)',i=>i[3]]],vtx:[['Weight (g)',i=>i[5]]],cam:[['Width (mm)',i=>i[1]],['Weight (g)',i=>i[4]]],rx:[['Weight (g)',i=>i[2]]],bat:[['Capacity (mAh)',i=>i[2]],['Weight (g)',i=>i[6]],['Length (mm)',i=>i[3]]],gps:[['Weight (g)',i=>i[4]]],ant:[['Length (mm)',i=>i[2]]]};
const st=r=>r.hi-r.lo>300?10:r.hi-r.lo>30?1:.1;
const lbl=k=>C.find(c=>c[0]==k)[1].replace(/ \(.*/,'');
const wOf=(k,it)=>none(it)?0:(it[COL[k][3]]||0)*COL[k][4];
const brand=it=>it[0].split(' ')[0];
const fits=(k,it)=>{const f=D.frame[s.frame],e=D.esc[s.esc],v=D.vtx[s.vtx],c=D.cam[s.cam];
return k=='motor'?it[3]==f[4]:k=='prop'?Math.abs(it[1]-f[2])<=.3:(k=='fc'||k=='esc')?it[1]==f[3]:k=='bat'?it[1]>=e[4][0]&&it[1]<=e[4][1]:k=='vtx'?it[1]==c[5]:k=='cam'?it[5]==v[1]:true};
const go=n=>{['bld','pick','c3','wire','bf'].forEach(i=>q(i).style.display=i==n?'block':'none');const t={bld:'tbld',pick:'tbld',c3:'tv',wire:'tw',bf:'tb'}[n];['tbld','tv','tw','tb'].forEach(i=>q(i).className=i==t?'on':'');if(n=='c3')rs()};
q('tbld').onclick=()=>go('bld');q('tv').onclick=()=>go('c3');q('tw').onclick=()=>go('wire');q('tb').onclick=()=>go('bf');
// ---- builder table
function rowsDraw(){let n=0,w=0,h='<table class="pt"><tr><th>Component</th><th>Selection</th><th>Specs</th><th>Weight</th><th></th></tr>';
C.forEach(([k])=>{const it=D[k][s[k]],on=ch[k];if(on&&!none(it))n++;if(on)w+=wOf(k,it);
h+=`<tr><td class="cn">${lbl(k)}</td>`+(on?`<td><span class="pn" data-c="${k}">${it[0]}</span></td><td class="ps">${COL[k][1](it).slice(0,-1).join(' · ')||'—'}</td><td>${wOf(k,it)?wOf(k,it).toFixed(0)+' g'+(COL[k][4]>1?' (x'+COL[k][4]+')':''):'—'}</td><td><button class="btn g" data-r="${k}">Remove</button></td>`:`<td colspan="3" class="dim">Not chosen (3D preview uses ${it[0]})</td><td><button class="btn" data-c="${k}">+ Choose A ${lbl(k)}</button></td>`)+'</tr>'});
h+=`<tr class="tot"><td colspan="3">Total (chosen parts, without wires/screws)</td><td colspan="2">${w.toFixed(0)} g</td></tr></table>`;
q('rows').innerHTML=h;q('rows').onclick=e=>{const c=e.target.dataset.c,r=e.target.dataset.r;if(c)pick(c);if(r){ch[r]=false;s[r]=0;update()}};
q('cnt').textContent=n+' of '+C.length+' parts chosen · '+Object.values(D).reduce((a,b)=>a+b.length,0)+' parts in the database'}
// ---- chooser (filters + sortable table)
function pick(k){const P=q('pick'),cf=COL[k],fac=[['Manufacturer',brand]].concat(cf[2]),sel2={};const rg=(RNG[k]||[]).map(([l,fn])=>{const v=D[k].filter(i=>!none(i)).map(fn).filter(x=>x!=null&&!isNaN(x));return{l,fn,lo:Math.min(...v),hi:Math.max(...v)}}).filter(r=>isFinite(r.lo)&&r.hi>r.lo),rv=rg.map(r=>[r.lo,r.hi]);let sortC=-2,dir=1,last=null,compat=true,txt='';
const vals=fac.map(([l,fn])=>[...new Set(D[k].filter(i=>!none(i)).map(fn))].sort());
P.innerHTML=`<div class="wrap"><button class="btn g" id="bk">← Back to builder</button><h1>Choose A ${lbl(k)}</h1><div class="pk"><div class="flt"><h4>Filters</h4><div class="f"><label><input type="checkbox" id="cp" checked> Only compatible with my build</label></div>${fac.map(([l],j)=>`<h4>${l}</h4><div class="f">${vals[j].map(v=>`<label><input type="checkbox" data-j="${j}" value="${v}"> ${v}</label>`).join('')}</div>`).join('')}${rg.map((r,j)=>`<h4>${r.l}</h4><div class="f" style="padding:6px 10px"><div id="rl${j}">${r.lo} – ${r.hi}</div><input type="range" data-r="${j}" data-e="0" min="${r.lo}" max="${r.hi}" step="${st(r)}" value="${r.lo}" style="width:100%"><input type="range" data-r="${j}" data-e="1" min="${r.lo}" max="${r.hi}" step="${st(r)}" value="${r.hi}" style="width:100%"></div>`).join('')}</div><div class="lst"><input type="text" id="sq" placeholder="Search ${lbl(k).toLowerCase()}s..."><div id="cc" class="ps" style="margin-bottom:6px"></div><table class="pt"><thead><tr><th class="s" data-s="-1">Name</th>${cf[0].map((h,j)=>`<th class="s" data-s="${j}">${h}</th>`).join('')}<th></th></tr></thead><tbody id="tb2"></tbody></table></div></div></div>`;
const draw=()=>{const L=D[k].map((it,i)=>({it,i,c:cf[1](it)})).filter(({it})=>{if(txt&&!it[0].toLowerCase().includes(txt))return false;if(compat&&!fits(k,it))return false;if(none(it))return true;return fac.every(([l,fn],j)=>!sel2[j]||!sel2[j].size||sel2[j].has(String(fn(it))))&&rg.every((r,j)=>{const x=r.fn(it);return x==null||isNaN(x)||(x>=rv[j][0]&&x<=rv[j][1])})});
if(sortC>-2)L.sort((a,b)=>{const x=sortC<0?a.it[0]:a.c[sortC],y=sortC<0?b.it[0]:b.c[sortC],nx=parseFloat(x),ny=parseFloat(y);return(isNaN(nx)||isNaN(ny)?String(x).localeCompare(String(y)):nx-ny)*dir});
q('cc').textContent=L.length+' products';
q('tb2').innerHTML=L.map(({it,i,c})=>`<tr><td><b>${it[0]}</b>${fits(k,it)?'':' <span style="color:#b35c00;font-size:11px">⚠ may not fit</span>'}</td>${c.map(x=>`<td>${x}</td>`).join('')}<td><button class="btn" data-a="${i}">${i==s[k]&&ch[k]?'Selected':'Add'}</button></td></tr>`).join('')||'<tr><td colspan="9" class="dim">No parts match. Untick the compatibility filter to see everything.</td></tr>'};
P.querySelector('thead').onclick=e=>{const j=e.target.dataset.s;if(j==null)return;dir=last==j?-dir:1;last=j;sortC=+j;draw()};
P.querySelectorAll('.flt input[data-j]').forEach(c=>c.onchange=()=>{const j=c.dataset.j;sel2[j]=sel2[j]||new Set();c.checked?sel2[j].add(c.value):sel2[j].delete(c.value);draw()});
q('cp').onchange=e=>{compat=e.target.checked;draw()};q('sq').oninput=e=>{txt=e.target.value.toLowerCase();draw()};q('bk').onclick=()=>go('bld');P.querySelectorAll('input[data-r]').forEach(c=>c.oninput=()=>{const j=+c.dataset.r,e=+c.dataset.e,v=+c.value;rv[j][e]=v;if(rv[j][0]>rv[j][1]){rv[j][1-e]=v;P.querySelector('input[data-r="'+j+'"][data-e="'+(1-e)+'"]').value=v}q('rl'+j).textContent=rv[j][0]+' – '+rv[j][1];draw()});
q('tb2').onclick=e=>{const a=e.target.dataset.a;if(a==null)return;s[k]=+a;ch[k]=true;const it2=D[k][+a];if(k=='fc'&&it2[4]){const ei=D.esc.findIndex(x=>x[0]==it2[0]+' (AIO ESC)');if(ei>=0){s.esc=ei;ch.esc=true}if(it2[5]){const ri=D.rx.findIndex(x=>x[0]==it2[5]);if(ri>=0){s.rx=ri;ch.rx=true}}}update();go('bld')};
draw();go('pick')}
// ---- compatibility box (PCPartPicker style)
window.info=function(){const [f,m,p,fc,e,v,c,r,b,g]=sel(),o=[];const t=(ok,a,w)=>o.push([ok,ok?a:w]);
t(f[3]==fc[1]&&f[3]==e[1],`Frame, flight controller and ESC share the ${f[3]}mm stack pattern.`,`Stack mismatch: frame ${f[3]}mm, FC ${fc[1]}mm, ESC ${e[1]}mm.`);
t(m[3]==f[4],`Motor mount ${m[3]}x${m[3]}mm matches the frame.`,`Motor mount ${m[3]}mm does not match the frame's ${f[4]}mm.`);
t(Math.abs(p[1]-f[2])<=.3,`Propeller size suits the ${f[2]}" frame.`,`Propeller ${p[1]}" does not match the ${f[2]}" frame.`);
t(b[1]>=e[4][0]&&b[1]<=e[4][1],`ESC supports ${b[1]}S.`,`ESC is rated ${e[4][0]}-${e[4][1]}S but the battery is ${b[1]}S.`);
t(b[1]>=m[5][0]&&b[1]<=m[5][1],`Motors suit ${b[1]}S.`,`Motors are typically ${m[5][0]}-${m[5][1]}S but the battery is ${b[1]}S.`);
t(c[5]==v[1],'Camera and VTX use the same video system.',`Camera (${SYS[c[5]]}) and VTX (${SYS[v[1]]}) are different video systems.`);
t(fc[4]?e[0]==fc[0]+' (AIO ESC)':!/AIO ESC/.test(e[0]),'Flight controller and ESC are a matching pair.',fc[4]?`${fc[0]} has a built-in ESC. Choose its "(AIO ESC)" entry.`:`"${e[0]}" belongs to an AIO board; choose that AIO flight controller instead.`);
const W=f[5]+4*m[4]+4*p[3]+fc[3]+e[3]+v[5]+c[4]+r[2]+b[6]+(g[4]||0)+30,bad=o.filter(x=>!x[0]).length;
q('info').innerHTML=`<div class="box"><h3>Compatibility: ${bad?`<span style="color:#b35c00">${bad} warning${bad>1?'s':''}</span>`:'<span class="ok">✓ All checks passed</span>'}</h3>${o.map(([ok,t2])=>`<div class="m ${ok?'ok':'warn'}">${ok?'✓':'⚠ Warning:'} ${t2}</div>`).join('')}</div><div class="box"><h3>Estimated all-up weight: ${Math.round(W)} g</h3><div class="note">Includes about 30 g for wires, screws and straps. Models and pad layouts are parametric from approximate dimensions; verify against each maker's manual.</div></div>`};
// ---- wiring extras
const ow=window.wiring;
window.wiring=function(){ow();const [f,m,p,fc,e,v,c,r,b,g]=sel(),gps=g.length>1,dig=v[1]!='a';
const x=`<g font-size="10"><rect x="20" y="560" width="270" height="80" fill="#fafafa" stroke="#999" rx="5"/><text x="30" y="576" font-weight="bold">Legend / wire gauges</text><line x1="30" y1="588" x2="60" y2="588" stroke="#d22" stroke-width="3"/><text x="66" y="591">Power + (battery 12-14AWG, 5V/9V 26-28AWG)</text><line x1="30" y1="602" x2="60" y2="602" stroke="#111" stroke-width="3"/><text x="66" y="605">Ground / negative</text><line x1="30" y1="616" x2="60" y2="616" stroke="#e8b400" stroke-width="3"/><text x="66" y="619">Signal (28-30AWG) / motor phase A (20-22AWG)</text><line x1="30" y1="630" x2="60" y2="630" stroke="#1a9a3a" stroke-width="3"/><text x="66" y="633">UART TX (from device) to RX of the other</text></g><g font-size="10" fill="#444"><text x="330" y="525">Motor wires: 18-22AWG silicone, tin pads first.</text><text x="330" y="538">Battery lead: XT60, 12-14AWG; capacitor across BAT+/BAT-.</text><text x="330" y="551">ESC to FC: 8-pin harness (VBAT, G, CURR, TLM, M1-M4).</text></g>`;
svg=svg.replace('</svg>',x+'</svg>');const sv=q('wire').querySelector('svg');if(sv)sv.outerHTML=svg;
const W=[['Battery XT60 (+)','ESC BAT+','Red','12-14'],['Battery XT60 (−)','ESC BAT−','Black','12-14'],['Capacitor +/−','ESC BAT+ / BAT−','—','leads ≤10mm'],['ESC M1-M4 (3 pads each)','Motor 1-4 phase wires','Any order (swap two to reverse)','18-22'],['ESC 8-pin','FC 8-pin (VBAT, G, CURR, TLM, M1-M4)','Harness','26-28'],['FC 5V','Receiver 5V','Red','26-28'],['FC G','Receiver GND','Black','26-28'],['FC T2 (TX2)','Receiver RX','Yellow','28-30'],['FC R2 (RX2)','Receiver TX','Green','28-30'],['FC '+(dig?'VBAT':'9V/VBAT')+' pad','VTX V+','Red','24-26'],['FC G','VTX GND','Black','24-26'],['FC T3 (TX3)','VTX RX / SmartAudio','Yellow','28-30'],['FC R3 (RX3)','VTX TX ('+(dig?'MSP':'optional')+')','Green','28-30'],['FC 5V','Camera 5V','Red','28'],['FC G','Camera GND','Black','28'],['Camera VID','VTX VID IN'+(dig?' (or supplied cable)':''),'Yellow','28'],['FC BZ+ / BZ−','Buzzer + / −','Red / Black','28']];
if(gps)W.push(['FC 5V / G','GPS 5V / GND','Red / Black','28'],['FC T4 (TX4)','GPS RX','Yellow','28-30'],['FC R4 (RX4)','GPS TX','Green','28-30']);
q('wire').insertAdjacentHTML('beforeend','<table id="wt"><tr><th>From (pad)</th><th>To</th><th>Wire</th><th>AWG</th></tr>'+W.map(a=>'<tr>'+a.map(c2=>'<td>'+c2+'</td>').join('')+'</tr>').join('')+'</table>')};
// ---- Betaflight guide
function guide(){const [f,m,p,fc,e,v,c,r,b,g,an]=sel(),dig=v[1]!='a',gps=g.length>1,pr=r[1],prov=/ELRS|CRSF/.test(pr)?'CRSF':/SBUS|F\.Port/.test(pr)?'SBUS':/iBus/.test(pr)?'IBUS':/SRXL|Spektrum/.test(pr)?'SRXL2':'CRSF';
const cli=`# Betaflight 4.4/4.5 CLI. Run "diff all" first to back up.\nfeature -RX_PARALLEL_PWM\nfeature RX_SERIAL\n${gps?'feature GPS\nset gps_provider = UBLOX\nset gps_auto_baud = ON\nset gps_auto_config = ON':'# no GPS selected'}\nset serial_rx_provider = ${prov}\nset motor_pwm_protocol = DSHOT600\nset dshot_bidir = ON\nset motor_poles = 14\nset vbat_min_cell_voltage = 330\nset vbat_warning_cell_voltage = 350\nset vbat_max_cell_voltage = 435\nset battery_capacity = ${b[2]}\nset small_angle = 180\nset osd_displayport_device = ${dig?'MSP':'AUTO'}\nsave`;
const S=(n,t)=>`<div class="stp"><b>${n}.</b> ${t}</div>`;
q('bf').innerHTML=`<div><h2>Betaflight setup for this build</h2><p>${f[0]} · ${fc[0]} (${fc[2]}) · ${e[0]} · ${m[0]} · ${b[1]}S. Props OFF for every step. UARTs follow the wiring diagram (RX on UART2, VTX on UART3${gps?', GPS on UART4':''}); change them if your board differs.</p>`+
S(1,`<b>Flash firmware.</b> Connect USB, Firmware Flasher, pick the target for ${fc[0]}, enable Full chip erase, flash.`)+
S(2,`<b>Ports tab.</b> UART2: Serial Rx. UART3: ${dig?'MSP (DisplayPort) for '+v[0]:'VTX (SmartAudio or IRC Tramp)'}.${gps?' UART4: GPS.':''} Save and reboot.`)+
S(3,`<b>Configuration tab.</b> DSHOT600, Bidirectional DShot (needs Bluejay/BLHeli_32 on ${e[0]}), motor poles 14, Receiver: Serial (${prov}). Enable ${gps?'GPS, ':''}OSD. Battery ${b[1]}S, min 3.3V, warn 3.5V, max 4.35V.`)+
S(4,`<b>Receiver tab.</b> ${/ELRS/.test(pr)?'Bind the ExpressLRS receiver first (bind phrase or power-cycle 3 times). ':''}Check sticks move correctly and centre at 1500.`)+
S(5,`<b>Motors tab.</b> Props OFF. Check order and direction: M1 rear-right CCW, M2 front-right CW, M3 rear-left CW, M4 front-left CCW (props-in). Reverse a motor in ESC Configurator or by swapping two phase wires.`)+
S(6,`<b>Modes tab.</b> ARM on AUX1, Flip over after crash (Turtle), Beeper.${gps?' GPS Rescue on a switch.':''} Failsafe stage 2: ${gps?'GPS Rescue (after testing)':'Drop'}.`)+
S(7,`<b>OSD and video.</b> ${dig?'Choose the HD OSD profile for '+v[0]+'.':'Set PAL/NTSC to match the camera and fill the VTX table for '+v[0]+'.'} Never power the VTX without an antenna (${an?an[0]:'antenna'}).`)+
S(8,`<b>PIDs and filters.</b> Presets tab: choose a ${f[2]}-inch preset for ${m[0]}. Enable the RPM filter.`)+
S(9,`<b>First flight.</b> Calibrate the accelerometer on level ground, verify battery voltage, test failsafe with props off, then hover low and slow.`)+
`<h3>CLI snippet</h3><pre>${cli}</pre><button class="btn" onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)">Copy CLI</button><p style="color:#555">Typical starting values only. Check your FC and ESC manuals and Betaflight's docs.</p></div>`}
// ---- safe update so one failing part never freezes the page
const T=(fn,n)=>{try{fn()}catch(e){console.error(n,e)}};
window.update=function(){T(info,'info');T(build,'build');T(rowsDraw,'rows');T(wiring,'wiring');T(guide,'guide')};
update();
})();
