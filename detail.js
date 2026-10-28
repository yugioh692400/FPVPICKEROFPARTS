/* Render quality + extra detail layer */
(function(){
const ob=window.build,SIL=0xc4c8ce,GOLD=0xd4a017,BK=0x111114,MC={};
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFSoftShadowMap;R.toneMapping=THREE.ACESFilmicToneMapping;R.toneMappingExposure=1.2;R.outputEncoding=THREE.sRGBEncoding;
const gr=new THREE.Mesh(new THREE.CircleGeometry(700,64),new THREE.MeshStandardMaterial({color:0x1d242e,roughness:.95}));gr.rotation.x=-Math.PI/2;gr.position.y=-16;gr.receiveShadow=true;sc.add(gr);sc.fog=new THREE.Fog(0x151a22,520,1200);
dl1.position.set(180,380,220);dl1.intensity=1.1;dl1.castShadow=true;dl1.shadow.mapSize.set(2048,2048);Object.assign(dl1.shadow.camera,{left:-260,right:260,top:260,bottom:-260,near:10,far:900});
const rim=new THREE.DirectionalLight(0x88aaff,.6);rim.position.set(-220,140,-260);sc.add(rim);
const tc=document.createElement('canvas');tc.width=tc.height=32;const cx=tc.getContext('2d');for(let i=0;i<4;i++)for(let j=0;j<4;j++){cx.fillStyle=(i+j)%2?'#2d3038':'#141519';cx.fillRect(i*8,j*8,8,8);cx.fillStyle='rgba(255,255,255,.05)';for(let t=0;t<8;t+=2)cx.fillRect(i*8,j*8+t,8,1)}
const tx=new THREE.CanvasTexture(tc);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.repeat.set(.25,.25);tx.anisotropy=4;
const CFm=new THREE.MeshStandardMaterial({color:0xffffff,map:tx,roughness:.3,metalness:.35});
const mat=(c,o)=>{const k=c+JSON.stringify(o||{});return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.5,metalness:.2},o)))};
const add=(g,c,x,y,z,o,par,r)=>{const m=new THREE.Mesh(g,mat(c,o));m.position.set(x,y,z);if(r)m.rotation.set(r[0]||0,r[1]||0,r[2]||0);(par||root).add(m);return m};
const bx=(w,h,d,c,x,y,z,o,par,r)=>add(new THREE.BoxGeometry(w,h,d),c,x,y,z,o,par,r);
const cy=(r,h,c,x,y,z,o,par,r2,n)=>add(new THREE.CylinderGeometry(r,r,h,n||20),c,x,y,z,o,par,r2);
const tor=(R1,t,c,x,y,z,o,par,r2)=>add(new THREE.TorusGeometry(R1,t,8,36),c,x,y,z,o,par,r2);
const M={metalness:.9,roughness:.25};
const screw=(x,y,z,r=1.5,par,rot)=>{const g=new THREE.Group();g.position.set(x,y,z);if(rot)g.rotation.set(rot[0],rot[1],rot[2]);(par||root).add(g);cy(r*1.7,.5,SIL,0,0,0,M,g);cy(r,1.4,0x2a2d33,0,.95,0,M,g,null,24);cy(r*.55,.3,BK,0,1.65,0,null,g,null,6);return g};
const nut=(x,y,z,r=1.5)=>cy(r*1.8,r*1.2,SIL,x,y,z,M,null,null,6);
window.build=function(){ob();
const [f,m,p,fc,e,v,c,r,b,g,an]=sel(),pr=f[2],wb=f[1],mn=f[4],at=pr>=6?6:pr>=4.5?5:pr>=3?3:2,aw=pr>=6?18:pr>=4.5?16:pr>=3?10:8,bl=60+pr*9,bw=f[3]+14,sb=f[3]+6,sp=f[3]/2,L=wb/2,k=mn/Math.SQRT2,H=Math.max(34,27+v[4]),rxz=sb/2+8;
const motorHeight = Math.min(m[2], 17);
const sr=Math.max(1,mn/10),MP=[[1,1],[1,-1],[-1,1],[-1,-1]];
MP.forEach(([sx,sz],i)=>{const mx=sx*L/Math.SQRT2,mz=sz*L/Math.SQRT2,A=Math.atan2(mz,mx),ux=Math.cos(A),uz=Math.sin(A),vx=Math.sin(A),vz=-Math.cos(A),top=at/2+motorHeight,y0=at/2,col=[0xff7a1a,0x2fc7ff][i%3?(i==1||i==2?1:0):0];
[[k,0],[-k,0],[0,k],[0,-k]].forEach(([u,w])=>{const X=mx+u*ux+w*vx,Z=mz+u*uz+w*vz;cy(sr*2.1,.5,SIL,X,-y0-.25,Z,M,null,null,16);screw(X,-y0-.3,Z,sr*1.4,null,[Math.PI,0,0])});
for(let q=0;q<12;q++){const a=q*Math.PI/6;bx(2.2,3.5,1.6,0xb87333,mx+Math.cos(a)*m[1]*.4,y0+4,mz+Math.sin(a)*m[1]*.4,{metalness:.6,roughness:.4},null,[0,-a,0])}
tor(m[1]*.4,.5,col,mx,top+.5,mz,M,null,[Math.PI/2,0,0]);tor(m[1]*.5,.4,0x15171b,mx,y0+6.5,mz,null,null,[Math.PI/2,0,0]);
cy(5.2,.5,SIL,mx,top+2.5,mz,M,null,null,24);tor(1.9,.35,SIL,mx,top+6.4,mz,M,null,[Math.PI/2,0,0]);
if(pr>=4.5){const bs=new THREE.Shape(),w=aw*.7,l0=L*.45;bs.moveTo(-l0/2,-w/2);bs.lineTo(l0/2,-w/2);bs.lineTo(l0/2,w/2);bs.lineTo(-l0/2,w/2);bs.closePath();const gg=new THREE.ExtrudeGeometry(bs,{depth:2,bevelEnabled:false});gg.rotateX(-Math.PI/2);gg.translate(L*.34,0,0);add(gg,0x1b1c20,0,y0,0,{roughness:.35,metalness:.3},null,[0,-A,0]);
[.2,.34,.48].forEach(t=>{const X=ux*L*t,Z=uz*L*t;screw(X,y0+2,Z,1.3);nut(X,-y0-.8,Z,1.3)})}
});
const cg=new THREE.Group();cg.position.set(0,at/2+c[2]/2+2,-bl/2+c[3]/2+2);cg.rotation.x=.44;root.add(cg);
const lw=c[1]*.4,zf=-c[3]*.5;
tor(lw,.55,GOLD,0,0,zf-.4,M,cg);tor(lw*.78,.35,0x2244aa,0,0,zf-.9,{metalness:.7,roughness:.3},cg);
add(new THREE.SphereGeometry(c[1]*.24,28,14,0,Math.PI*2,0,Math.PI/2),0x0b1c4a,0,0,zf-1.2,{metalness:1,roughness:.04,envMapIntensity:1},cg,[-Math.PI/2,0,0]);
cy(c[1]*.14,.2,0x7a5cff,.5,.5,zf-2.9,{metalness:1,roughness:0,transparent:true,opacity:.6},cg,[Math.PI/2,0,0]);
for(let q=0;q<3;q++){const a=q*2.094+.5;cy(.5,.5,SIL,Math.cos(a)*lw*.95,Math.sin(a)*lw*.95,zf-.5,M,cg,[Math.PI/2,0,0],10)}
bx(c[1]-2,c[2]-2,1.2,0x15183a,0,0,c[3]*.5+.5,null,cg);bx(6,3,3,0xeeeeee,0,-c[2]/2+2,c[3]*.5+2.5,null,cg);bx(3,1,3,BK,3,3,c[3]*.5+1.4,null,cg);
[-1,1].forEach(sx=>[-1,1].forEach(sz=>screw(sx*(c[1]/2+2.5),0,sz*c[3]*.25,1.1,cg,[0,0,-sx*Math.PI/2])));
const vy=25.6;for(let q=0;q<14;q++){const a=q*47.3;bx(1.3,.5,.8,q%3?0x2a2a2a:0x9a6a2a,((a%7)/7-.5)*v[2]*.9,vy+.25,(((a*1.7)%7)/7-.5)*v[3]*.9)}
bx(1.2,.6,1.2,0x00ff66,v[2]/2-3,vy+.3,v[3]/2-3);bx(8,3,3.5,0xeeeeee,-v[2]/4,vy+1.5,-v[3]/2+3);cy(1.6,2.6,GOLD,v[2]/2-3,vy+1.3,-v[3]/2+4,M);
bx(10,3,14,0xff7a1a,-8,0,bl/2-3,{roughness:.9,metalness:0});bx(6,26,5,0xff7a1a,-8,12,bl/2+8,{roughness:.9,metalness:0});screw(-8,-1.5,bl/2-1,1.2,null,[Math.PI,0,0]);
const aL=an?an[2]:60,ty=an?an[1]:'L',ag=new THREE.Group();ag.position.set(-8,26,bl/2+9);ag.rotation.x=1.15;root.add(ag);
cy(2.2,5,0xc9a227,0,2.5,0,M,ag);cy(3,1.6,SIL,0,1,0,M,ag,null,6);
if(ty=='L'){cy(.9,aL-9,BK,0,5+(aL-9)/2,0,null,ag,null,10);cy(7,1.2,0x15171b,0,aL-2,0,null,ag,null,30);tor(7,.6,0x1a9a3a,0,aL-2,0,null,ag,[Math.PI/2,0,0])}
else if(ty=='P'){cy(1,aL*.4,BK,0,5+aL*.2,0,null,ag);for(let q=0;q<4;q++)cy(3.2+q*1.4,1.2,q%2?0x15171b:0x1a9a3a,0,aL*.45+q*3.5,0,null,ag,null,28)}
else{cy(2,aL-5,BK,0,5+(aL-5)/2,0,null,ag,null,14);cy(2.1,6,0xff7a1a,0,aL-2,0,null,ag,null,14)}
const rg=new THREE.Group();rg.position.set(10,12.8,rxz+8);rg.rotation.x=1.25;root.add(rg);cy(.7,34,BK,0,17,0,null,rg,null,8);cy(1.4,13,0x222,0,6,0,null,rg,null,10);cy(.75,12,0xd22222,0,36,0,null,rg,null,8);
root.traverse(o=>{if(!o.isMesh)return;o.castShadow=o.receiveShadow=true;if(o.material.color&&o.material.color.getHex()==0x1b1c20&&!o.material.map)o.material=CFm})};
})();
