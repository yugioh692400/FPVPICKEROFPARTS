/* UI logic with sidebar dropdowns */
(function(){
const rows=q('sel');
function itemSpecs(k,it){
return {
frame:it[1]+'mm wheelbase · '+it[2]+'" props · '+it[3]+'mm stack',
motor:it[3]+'mm mount · '+it[5][0]+'-'+it[5][1]+'S · '+it[4]+'g',
prop:it[1]+'" diameter · '+it[2]+'-blade · '+it[3]+'g',
fc:it[1]+'mm stack · '+it[2],
esc:it[2]+'A · '+it[1]+'mm stack · '+it[4][0]+'-'+it[4][1]+'S',
vtx:({a:'Analog',dji:'DJI',ws:'Walksnail',hdz:'HDZero'}[it[1]]||'Digital')+' · '+it[5]+'g',
cam:({a:'Analog',dji:'DJI',ws:'Walksnail',hdz:'HDZero'}[it[5]]||'Digital')+' · '+it[1]+'mm',
rx:it[1]+' · '+it[2]+'g',
bat:it[1]+'S · '+it[2]+'mAh · '+it[6]+'g',
gps:it.length>1?it[1]+'x'+it[2]+'mm':'No GPS',
ant:({L:'Lollipop',D:'Dipole',P:'Pagoda'}[it[1]]||'Antenna')+' · '+it[2]+'mm'
}[k]||'';
}

function rowsDraw(){
rows.innerHTML='';let n=0;
C.forEach(([k,l])=>{
const it=D[k][s[k]];if(it.length>1)n++;
const d=document.createElement('div');d.className='r';
const selEl=document.createElement('select');
D[k].forEach((item,i)=>{const opt=new Option(item[0],i);selEl.add(opt)});
selEl.value=s[k];
selEl.onchange=()=>{s[k]=+selEl.value;update()};
d.innerHTML='<div class="cat">'+l+'</div>';
d.appendChild(selEl);
const infoDiv=document.createElement('div');
infoDiv.className='sp';
infoDiv.innerHTML='<span>'+itemSpecs(k,it)+'</span><span>'+(it[4]||it[3]||it[2]||'')+'g</span>';
d.appendChild(infoDiv);
rows.append(d);
});
q('cnt').textContent=n+' parts selected · ~'+Object.values(D).reduce((a,b)=>a+b.length,0)+' in catalog';
}

const tb=q('tb');
const sh=n=>{
q('c3').style.display=n==0?'block':'none';
q('wire').style.display=n==1?'block':'none';
q('bf').style.display=n==2?'block':'none';
['tv','tw','tb'].forEach((i,j)=>q(i).className=j==n?'on':'');
if(n==0)rs();
};
q('tv').onclick=()=>sh(0);q('tw').onclick=()=>sh(1);tb.onclick=()=>sh(2);

const ow=window.wiring;
window.wiring=function(){
if(typeof ow === 'function') ow();
const [f,m,p,fc,e,v,c,r,b,g]=sel(),gps=g.length>1,dig=v[1]!='a';
const x='<g font-size="10"><rect x="20" y="560" width="270" height="80" fill="#fafafa" stroke="#999" rx="5"/><text x="30" y="576" font-weight="bold">Legend / wire gauges</text><line x1="30" y1="588" x2="60" y2="588" stroke="#d22" stroke-width="3"/><text x="66" y="591">Power + (battery 12-14AWG, 5V/9V 26-28AWG)</text><line x1="30" y1="602" x2="60" y2="602" stroke="#111" stroke-width="3"/><text x="66" y="605">Ground / negative</text><line x1="30" y1="616" x2="60" y2="616" stroke="#e8b400" stroke-width="3"/><text x="66" y="619">Signal (28-30AWG) / motor phase A (20-22AWG)</text><line x1="30" y1="630" x2="60" y2="630" stroke="#1a9a3a" stroke-width="3"/><text x="66" y="633">UART TX (from device) → RX of the other</text></g>';
svg=svg.replace('</svg>',x+'</svg>');
if(q('wire').querySelector('svg')) {
  q('wire').querySelector('svg').outerHTML=svg;
}
const W=[['Battery XT60 (+)','ESC BAT+','Red','12-14'],['Battery XT60 (−)','ESC BAT−','Black','12-14'],['Capacitor +/−','ESC BAT+ / BAT−','—','leads ≤10mm'],['ESC M1-M4 (3 pads each)','Motor 1-4 phase wires','Any order (swap two to reverse)','18-22'],['ESC 8-pin','FC 8-pin (VBAT, G, CURR, TLM, M1-M4)','Harness','26-28'],['FC 5V','Receiver 5V','Red','26-28'],['FC G','Receiver GND','Black','26-28'],['FC T2 (TX2)','Receiver RX','Yellow','28-30'],['FC R2 (RX2)','Receiver TX','Green','28-30'],['FC '+(dig?'VBAT':'9V/VBAT')+' pad','VTX V+','Red','24-26'],['FC G','VTX GND','Black','24-26'],['FC T3 (TX3)','VTX RX / SmartAudio','Yellow','28-30'],['FC R3 (RX3)','VTX TX ('+(dig?'MSP':'optional')+')','Green','28-30'],['FC 5V','Camera 5V','Red','28'],['FC G','Camera GND','Black','28'],['Camera VID','VTX VID IN'+(dig?' (or supplied cable)':''),'Yellow','28'],['FC BZ+ / BZ−','Buzzer + / −','Red / Black','28']];
if(gps)W.push(['FC 5V / G','GPS 5V / GND','Red / Black','28'],['FC T4 (TX4)','GPS RX','Yellow','28-30'],['FC R4 (RX4)','GPS TX','Green','28-30']);
q('wire').insertAdjacentHTML('beforeend','<table id="wt"><tr><th>From (pad)</th><th>To</th><th>Wire</th><th>AWG</th></tr>'+W.map(a=>'<tr>'+a.map(c=>'<td>'+c+'</td>').join('')+'</tr>').join('')+'</table>');
};

function guide(){
const [f,m,p,fc,e,v,c,r,b,g]=sel(),dig=v[1]!='a',gps=g.length>1,pr=r[1],prov=/ELRS|CRSF/.test(pr)?'CRSF':/SBUS|F\.Port/.test(pr)?'SBUS':'CRSF',cap=b[2];
const cli=`# Betaflight CLI
feature -RX_PARALLEL_PWM
feature RX_SERIAL
${gps?'feature GPS\nset gps_provider = UBLOX\nset gps_auto_baud = ON\nset gps_auto_config = ON':''}
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
save`;
q('bf').innerHTML=`<div><h2>Betaflight setup for this build</h2><p>${f[0]} · ${fc[0]} · ${e[0]} · ${m[0]} · ${b[1]}S. Take props OFF for every step.</p><div class="stp"><b>1. Flash firmware.</b> Connect USB, choose target <b>${fc[0]}</b>, enable Full chip erase, flash.</div><div class="stp"><b>2. Ports tab.</b> UART2: Serial Rx. UART3: ${dig?'MSP for '+v[0]:'VTX (SmartAudio/Tramp)'}.${gps?' UART4: GPS.':''} Save and reboot.</div><div class="stp"><b>3. Configuration tab.</b> DSHOT600, Bidirectional DShot, Motor poles 14, Serial RX (${prov}), OSD, Battery ${b[1]}S.</div><div class="stp"><b>4. Receiver tab.</b> Verify stick movements and centering at 1500.</div><div class="stp"><b>5. Motors tab.</b> Props OFF. Check spin directions (M1 rear-right CCW, M2 front-right CW, M3 rear-left CW, M4 front-left CCW).</div><div class="stp"><b>6. Modes tab.</b> Set ARM on AUX1, Turtle mode, Beeper.${gps?' GPS Rescue.':''}</div><div class="stp"><b>7. OSD / VTX.</b> Configure OSD elements and VTX channel/power.</div><h3>CLI Snippet</h3><pre>${cli}</pre><button onclick="navigator.clipboard.writeText(this.previousElementSibling.textContent)">Copy CLI</button></div>`;
}

window.update=function(){
  info();
  if(typeof build === 'function') build();
  rowsDraw();
  wiring();
  guide();
};
update();
})();
