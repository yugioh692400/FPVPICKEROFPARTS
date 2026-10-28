/* Detailed parametric 3D models (mm). Overrides build() from index.html. */
(function(){
const GOLD=0xd4a017,SIL=0xc4c8ce,K=0x1b1c20,BK=0x111114,YEL=0xe8b400,BLU=0x1c6bd8,PUR=0x8a3ac8,RED=0xd22222,GRN=0x1a9a3a,CF={roughness:.35,metalness:.3},MC={};
const mat=(c,o)=>{const k=c+JSON.stringify(o||{});return MC[k]||(MC[k]=new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.55,metalness:.15},o)))};
const add=(g,c,x,y,z,o,par,r)=>{const m=new THREE.Mesh(g,mat(c,o));m.position.set(x,y,z);if(r)m.rotation.set(r[0]||0,r[1]||0,r[2]||0);(par||root).add(m);return m};
const bx=(w,h,d,c,x,y,z,o,par,r)=>add(new THREE.BoxGeometry(w,h,d),c,x,y,z,o,par,r);
const cy=(r,h,c,x,y,z,o,par,r2,n)=>add(new THREE.CylinderGeometry(r,r,h,n||24),c,x,y,z,o,par,r2);
const ball=(x,y,z)=>add(new THREE.SphereGeometry(1.1,10,8),SIL,x,y+.7,z,{metalness:.9,roughness:.3});
function rr(w,h,r){const s=new THREE.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
const hole=(s,x,y,r)=>{const p=new THREE.Path();p.absarc(x,y,r,0,Math.PI*2,true);s.holes.push(p)};
const slot=(s,x,y,w,h)=>{const p=new THREE.Path();p.moveTo(x-w/2,y-h/2);p.lineTo(x+w/2,y-h/2);p.lineTo(x+w/2,y+h/2);p.lineTo(x-w/2,y+h/2);p.closePath();s.holes.push(p)};
const ext=(s,t)=>{const g=new THREE.ExtrudeGeometry(s,{depth:t,bevelEnabled:false,curveSegments:14});g.rotateX(-Math.PI/2);return g};
const plate=(s,t,y,c,o)=>add(ext(s,t),c,0,y,0,o);
function wire(pts,c,r){add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(p[0],p[1],p[2]))),24,r,6,false),c,0,0,0,{roughness:.8})}
window.build=function(){
while(root.children.length)root.remove(root.children[0]);
const [f,m,p,fc,e,v,c,r,b,g]=sel(),pr=f[2],wb=f[1],mn=f[4],at=pr>=6?6:pr>=4.5?5:pr>=3?3:2,aw=pr>=6?18:pr>=4.5?16:pr>=3?10:8,bl=60+pr*9,bw=f[3]+14,sb=f[3]+6,sp=f[3]/2,H=Math.max(34,27+v[4]),eT=7.8,fT=16.8,Rp=p[1]*25.4/2,L=wb/2,k=mn/Math.SQRT2,rb=k+3.5,SP=[1,-1,-1,1],MP=[[1,1],[1,-1],[-1,1],[-1,-1]],sq=[[1,1],[1,-1],[-1,1],[-1,-1]];
const motorHeight = Math.min(m[2], 17);
// ---- frame plates
const bs=new THREE.Shape();bs.moveTo(-bw*.3,bl/2);bs.lineTo(bw*.3,bl/2);bs.lineTo(bw/2,bl*.3);bs.lineTo(bw/2,-bl*.3);bs.lineTo(bw*.3,-bl/2);bs.lineTo(-bw*.3,-bl/2);bs.lineTo(-bw/2,-bl*.3);bs.lineTo(-bw/2,bl*.3);bs.closePath();
sq.forEach(([a,z])=>hole(bs,a*sp,z*sp,1.7));slot(bs,0,bl*.34,bw*.35,7);slot(bs,0,-bl*.34,bw*.35,7);plate(bs,at,-at/2,K,CF);
const xs=Math.min(b[4]/2+1.5,bw/2-5),tp=rr(bw-4,bl*.72,4);sq.forEach(([a,z])=>hole(tp,a*sp,z*sp,1.7));slot(tp,-xs,0,3,12);slot(tp,xs,0,3,12);slot(tp,0,bl*.26,bw*.3,6);plate(tp,3,H,K,CF);
sq.forEach(([a,z])=>{cy(2.5,H+3+at/2,0xff7a1a,a*sp,(H+3-at/2)/2,z*sp,{metalness:.8,roughness:.3},null,null,6);cy(2.7,1.2,BK,a*sp,H+3.6,z*sp,null,null,null,6);cy(2.7,1.2,BK,a*sp,-at/2-.6,z*sp,null,null,null,6)});
// ---- arms, motors, props, motor wires
const as=new THREE.Shape();as.moveTo(0,-aw*.6);as.lineTo(L*.62,-aw*.42);as.lineTo(L,-rb);as.absarc(L,0,rb,-Math.PI/2,Math.PI/2,false);as.lineTo(L*.62,aw*.42);as.lineTo(0,aw*.6);as.closePath();
hole(as,L,0,4.3);[[k,0],[-k,0],[0,k],[0,-k]].forEach(([u,w])=>hole(as,L+u,w,1.2));slot(as,L*.4,0,L*.3,aw*.25);
const ag=ext(as,at),cw=p[1]*2.6,bsh=new THREE.Shape();bsh.moveTo(3,-2.5);bsh.quadraticCurveTo(Rp*.5,-cw*.95,Rp-1,-cw*.22);bsh.quadraticCurveTo(Rp+1,0,Rp-1,cw*.22);bsh.quadraticCurveTo(Rp*.6,cw*.4,3,2.5);bsh.closePath();const bg0=ext(bsh,1.2);
MP.forEach(([sx,sz],i)=>{const mx=sx*L/Math.SQRT2,mz=sz*L/Math.SQRT2,A=Math.atan2(mz,mx),ux=Math.cos(A),uz=Math.sin(A),vx=Math.sin(A),vz=-Math.cos(A),top=at/2+motorHeight,col=SP[i]>0?0xff7a1a:0x2fc7ff,y0=at/2;
add(ag,K,0,-at/2,0,CF,null,[0,-A,0]).position.set(0,-at/2,0);
cy(m[1]*.46,2.5,0x8a8f98,mx,y0+1.25,mz,{metalness:.8,roughness:.3},null,null,40);
[[k,0],[-k,0],[0,k],[0,-k]].forEach(([u,w])=>cy(1.5,1.2,0x222,mx+u*ux+w*vx,y0+3.1,mz+u*uz+w*vz,{metalness:.8},null,null,6));
cy(m[1]*.36,4,0xb87333,mx,y0+4,mz,{metalness:.6,roughness:.4});
const hb=motorHeight-6;cy(m[1]/2,hb,0x4a5560,mx,y0+6+hb/2,mz,{metalness:.75,roughness:.3},null,null,48);
[.3,.62].forEach(t=>cy(m[1]/2+.15,.7,0x1c2026,mx,y0+6+hb*t,mz,null,null,null,48));
cy(m[1]*.3,.4,0x22262c,mx,top+.2,mz,null,null,null,32);
for(let q2=0;q2<6;q2++){const a=q2*Math.PI/3;cy(1.8,.5,BK,mx+Math.cos(a)*m[1]*.38,top+.2,mz+Math.sin(a)*m[1]*.38,null,null,null,10)}
cy(1.5,7,SIL,mx,top+2.5,mz,{metalness:.9,roughness:.2},null,null,12);
const gp=new THREE.Group();gp.position.set(mx,top+1.5,mz);root.add(gp);cy(6,3,col,0,0,0,null,gp);
for(let q2=0;q2<p[2];q2++){const bg=new THREE.Group();bg.rotation.y=q2*2*Math.PI/p[2];add(bg0,col,0,-.6,0,{transparent:true,opacity:.88,roughness:.4},bg,[SP[i]*.3,0,0]);gp.add(bg)}
cy(4.2,3,col,mx,top+4.8,mz,{metalness:.8,roughness:.3},null,null,6);
[YEL,BLU,PUR].forEach((wc,j)=>{const o2=(j-1)*1.6;wire([[mx-ux*m[1]*.4+o2*vx,y0+3,mz-uz*m[1]*.4+o2*vz],[mx*.5+o2*vx,y0+1.2,mz*.5+o2*vz],[sx*(sb/2-2),eT+.9,sz*sb*.2+(j-1)*3.5]],wc,.5+pr*.06)});
lab('M'+(i+1),mx,top+16,mz)});
// ---- ESC board
const bd=(y,col)=>{const s=rr(sb,sb,3);sq.forEach(([a,z])=>hole(s,a*sp,z*sp,1.7));plate(s,1.6,y,col,{roughness:.45,metalness:.2})};
bd(6.2,0x0d3b22);bd(15.2,0x15183a);
sq.forEach(([qx,qz])=>{for(let i=0;i<3;i++)bx(3.2,1,3.4,BK,qx*sb*.22+(i-1)*4,eT+.5,qz*5)});
bx(5,1,5,BK,0,eT+.5,0);for(let i=-3;i<=3;i++)bx(1.6,.8,1.1,0x9a6a2a,i*3.6,eT+.4,sb/2-9);
[-6,6].forEach(x=>{bx(5.5,.4,5.5,GOLD,x,eT+.2,sb/2-4);ball(x,eT,sb/2-4)});
MP.forEach(([sx,sz],i)=>[0,1,2].forEach(j=>{const x=sx*(sb/2-2),z=sz*sb*.2+(j-1)*3.5;bx(2.4,.4,2.4,GOLD,x,eT+.2,z);ball(x,eT+.2,z)}));
cy(4.5,11,BK,0,eT+4,sb/2+6,null,null,null,28);cy(4.6,1,SIL,0,eT+9.4,sb/2+6);
[-6,6].forEach(x=>wire([[x,eT+.6,sb/2-4],[x*.6,eT+1,sb/2+1],[x*.4,eT+3,sb/2+5]],x<0?BK:RED,.6));
// ---- FC board
bx(7,1,7,BK,-4,fT+.5,2);bx(7.8,.3,7.8,SIL,-4,fT+.2,2,{metalness:.9});bx(3,.9,3,BK,6,fT+.45,-6);bx(4,1.2,3,BK,5,fT+.6,6);
bx(8.4,3,6.5,SIL,10,fT+1.5,-sb/2+3.3,{metalness:.8,roughness:.3});bx(12,3,3.5,0xeeeeee,-4,fT+1.5,sb/2-6);bx(11,1.3,10,SIL,-8,fT+.65,-5,{metalness:.8});
bx(1,.6,.6,0x2aa4ff,-12,fT+.3,-11);bx(1,.6,.6,0x2aff55,-12,fT+.3,-9);
const fp=(x,z,cc)=>{bx(2.2,.4,2.2,GOLD,x,fT+.2,z);if(cc!=null)ball(x,fT+.2,z)},cr=[RED,BK,YEL,GRN];
for(let i=0;i<4;i++){fp(-sb/2+2,-sb/2+5+i*3.6,1);fp(-sb/2+2,2+i*3.6,g.length>1?1:null);fp(sb/2-2,-sb/2+5+i*3.6,1)}
fp(sb/2-2,3,1);fp(sb/2-2,6.6,1);fp(-3,-sb/2+2,1);fp(3,-sb/2+2,1);for(let i=0;i<8;i++)fp(-11.2+i*3.2,sb/2-2);
// ---- receiver, buzzer, wires
const rxz=sb/2+8;bx(10,1,14,0x1a1a1a,10,12.5,rxz);bx(4,1,4,BK,10,13.4,rxz);
for(let i=0;i<4;i++)wire([[-sb/2+2,fT+.5,-sb/2+5+i*3.6],[-sb/2-6,14,-5+i*3],[8+i*.8,12.9,rxz-4]],cr[i],.3);
cy(6,8,BK,-8,9,-sb/2-6,{roughness:.8});cy(1,.3,0x333,-8,13.2,-sb/2-6);wire([[-3,fT+.5,-sb/2+2],[-5,13,-sb/2-2],[-6,9,-sb/2-4]],RED,.3);wire([[3,fT+.5,-sb/2+2],[0,11,-sb/2-4],[-10,9,-sb/2-4]],BK,.3);
// ---- VTX
bx(v[2],1.6,v[3],0x161616,0,24.8,0);bx(v[2]*.7,v[4]-2,v[3]*.7,SIL,0,25.6+(v[4]-2)/2,0,{metalness:.9,roughness:.25});
if(v[1]!='a')for(let i=0;i<5;i++)bx(.8,2.5,v[3]*.7,0x888c94,-v[2]*.25+i*v[2]*.125,25.6+v[4]-1,0,{metalness:.8});
cy(1.5,2,GOLD,0,25,v[3]/2+1,{metalness:.9},null,[Math.PI/2,0,0]);wire([[0,25,v[3]/2+1],[0,23,bl/2],[-8,22,bl/2+8]],BK,.6);
for(let i=0;i<4;i++)wire([[sb/2-2,fT+.5,-sb/2+5+i*3.6],[sb/2+4,fT+5,-8+i*3],[v[2]/2-2,25.6,-v[3]/2+4+i*2]],cr[i],.3);
// ---- camera + cable
const cg=new THREE.Group(),cz=-bl/2+c[3]/2+2,cyy=at/2+c[2]/2+2;cg.position.set(0,cyy,cz);cg.rotation.x=.44;root.add(cg);
bx(c[1],c[2],c[3]*.55,0x2a2d33,0,0,c[3]*.22,{roughness:.5,metalness:.4},cg);cy(c[1]*.38,c[3]*.45,0x1a1c20,0,0,-c[3]*.28,{metalness:.7},cg,[Math.PI/2,0,0],32);
cy(c[1]*.41,2,SIL,0,0,-c[3]*.5,{metalness:.9,roughness:.2},cg,[Math.PI/2,0,0],32);cy(c[1]*.27,.5,0x0a1230,0,0,-c[3]*.5-1.1,{metalness:.9,roughness:.05},cg,[Math.PI/2,0,0],32);
[-1,1].forEach(sx=>bx(2,c[2]+6,c[3]+3,K,sx*(c[1]/2+1.5),0,0,CF,cg));
[0,1].forEach(j=>wire([[sb/2-2,fT+.5,3+j*3.6],[sb/2+6,fT-3,-4],[(j-.5)*3,cyy,-bl/2+c[3]+3]],j?BK:RED,.3));
// ---- battery, strap, XT60
const by=H+4+b[5]/2,bt=by+b[5]/2;
bx(b[4],b[5],b[3],0x2457c5,0,by,0,{roughness:.4,metalness:.1});bx(b[4]*.8,.3,b[3]*.62,0xf2f2f2,0,bt+.15,0,{roughness:.8});bx(b[4]*.5,.2,b[3]*.14,0xff7a1a,0,bt+.4,b[3]*.14);
[-1,1].forEach(s2=>bx(b[4]+.4,b[5]+.4,3,0x1d3f8c,0,by,s2*(b[3]/2-1.5)));
bx(2*xs+3,1.2,10,0x222,0,bt+.9,0,{roughness:.9});[-1,1].forEach(s2=>bx(1.2,bt-(H+3),10,0x222,s2*xs,(bt+H+3)/2,0,{roughness:.9}));bx(10,1.4,6,SIL,0,bt+1.9,0,{metalness:.9});
bx(8,5,16,YEL,0,by,b[3]/2+8);[-1,1].forEach(s2=>cy(1.5,2,GOLD,s2*2.6,by,b[3]/2+16.5,{metalness:.9},null,[Math.PI/2,0,0],12));bx(10,3,4,0xeeeeee,b[4]/2-5,by-b[5]/2+2.5,b[3]/2+3);
[[-6,BK],[6,RED]].forEach(([x,cc])=>wire([[x,eT+.6,sb/2-4],[x,10,sb/2+12],[x*.4,by-2,b[3]/2+4]],cc,1.2));
if(g.length>1){const gz=b[3]/2-g[1]/2-4;bx(g[2],g[3]-1,g[1],0x222,0,bt+1+(g[3]-1)/2,gz);bx(g[2]-4,.8,g[1]-4,0xe0dcc8,0,bt+g[3]+.2,gz);for(let i=0;i<4;i++)wire([[-sb/2+2,fT+.5,2+i*3.6],[-sb/2-4,14,10],[-8,by,b[3]/2+6],[(i-1.5)*1.5,bt+2,gz+g[1]/2]],cr[i],.3)}
};
})();
