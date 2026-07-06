/* Business template — animation & interaction logic.
   Adapted from the source site's landing.js: same motion system
   (WebGL field, custom cursor, GSAP scroll choreography, Matter.js
   physics chips, pinned pipeline + horizontal showcase). Content is
   read from window.SITE_CONFIG (filled into the DOM by render.js,
   which runs before this file). */
window.addEventListener("load",function(){ var d=document.documentElement; if(!d.classList.contains("ldr-live")) d.classList.add("loaded"); });

(function(){
  "use strict";
  var root=document.documentElement;
  var CFG=window.SITE_CONFIG||{};
  var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  var soft=reduce;
  var canHover=matchMedia("(hover: hover) and (pointer: fine)").matches;
  var coarse=matchMedia("(pointer: coarse)").matches;
  var small=matchMedia("(max-width: 767px)").matches;
  var lowMem=(navigator.deviceMemory && navigator.deviceMemory<=4);
  var hasGSAP=!!window.gsap, hasST=hasGSAP&&!!window.ScrollTrigger, hasLenis=!!window.Lenis, hasTHREE=!!window.THREE, hasMatter=!!window.Matter;
  var lerp=function(a,b,n){return a+(b-a)*n;}, clamp=function(v,a,b){return Math.min(b,Math.max(a,v));};
  var acc=(CFG.business&&CFG.business.accent)||{indigo:"#6d5dfc",cyan:"#3ad6ff",magenta:"#ff48d0"};
  var ACCENTS={ indigo:acc.indigo, cyan:acc.cyan, magenta:acc.magenta };

  var P={ x:innerWidth/2, y:innerHeight/2, nx:0, ny:0 };
  window.addEventListener("mousemove",function(e){ P.x=e.clientX; P.y=e.clientY; P.nx=(e.clientX/innerWidth)*2-1; P.ny=(e.clientY/innerHeight)*2-1; },{passive:true});
  var ACTIVITY={v:0}; function surge(a){ ACTIVITY.v=Math.min(1.6, ACTIVITY.v+(a||0.6)); }
  window.addEventListener("pointerdown",function(){ surge(0.9); },{passive:true});

  /* ===== always-on ===== */
  (function nav(){ var el=document.getElementById("nav"); if(!el)return; var on=function(){ el.classList.toggle("scrolled",(scrollY||pageYOffset)>80); }; on(); addEventListener("scroll",on,{passive:true}); })();
  document.querySelectorAll('a[href="#"]').forEach(function(a){ a.addEventListener("click",function(e){ e.preventDefault(); }); });

  /* interim hero demo-card actions: copy/download the first scenario's output */
  (function pmapStatic(){
    var c=document.getElementById("pmCopy"), d=document.getElementById("pmDl"); if(!c&&!d) return;
    var scen=(CFG.demo&&CFG.demo.scenarios&&CFG.demo.scenarios[0])||null;
    var text=scen?scen.output:"";
    var dlName=(scen&&scen.file?scen.file:"estimate")+".pdf.txt";
    function ack(b,t,r){ b.textContent=t; b.classList.add("ok"); setTimeout(function(){ b.textContent=r; b.classList.remove("ok"); },1400); }
    var copyLabel=c?c.textContent:"Copy", dlLabel=d?d.textContent:"Download";
    if(c) c.addEventListener("click",function(){ var done=function(){ ack(c,"Copied ✓",copyLabel); }; var fb=function(){ try{ var ta=document.createElement("textarea"); ta.value=text; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); done(); }catch(e){} }; if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(text).then(done).catch(fb); } else fb(); });
    if(d) d.addEventListener("click",function(){ try{ var b=new Blob([text],{type:"text/plain"}), u=URL.createObjectURL(b), a=document.createElement("a"); a.href=u; a.download=dlName; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function(){ URL.revokeObjectURL(u); },1000); ack(d,"Saved ✓",dlLabel); }catch(e){} });
  })();

  /* ===== live generation — streams a prepared estimate from SITE_CONFIG.demo.scenarios ===== */
  (function generate(){
    var sec=document.getElementById("generate"); if(!sec) return;
    var body=document.getElementById("genBody"), metaEl=document.getElementById("genMeta"), statsEl=document.getElementById("genStats");
    var copyBtn=document.getElementById("genCopy"), dlBtn=document.getElementById("genDl"), replay=document.getElementById("genReplay"), gen=document.getElementById("gen"), ideaEl=sec.querySelector(".gen-user .idea");
    if(!body) return;
    var SETS=(CFG.demo&&CFG.demo.scenarios)||[];
    if(!SETS.length) return;

    var TEXT="", tokens=[], dlName="estimate.txt";
    var timer=null, tick=null, started=0, idx=0, node=null, caret=null, runId=0;
    function fmt(ms){ var s=Math.floor(ms/1000); return Math.floor(s/60)+":"+String(s%60).padStart(2,"0"); }
    function clearBody(){ while(body.firstChild) body.removeChild(body.firstChild); }
    function halt(){ if(timer){clearTimeout(timer);timer=null;} if(tick){clearInterval(tick);tick=null;} }
    function tickMeta(){ var n=node?node.data.length:0; metaEl.textContent="Generating… "+fmt(Date.now()-started)+(n?" · "+n.toLocaleString()+" chars":""); }
    function step(){
      var burst=2+Math.floor(Math.random()*2);
      for(var k=0;k<burst && idx<tokens.length;k++){ node.data+=tokens[idx++]; }
      body.scrollTop=body.scrollHeight;
      if(idx<tokens.length){ timer=setTimeout(step, 6+Math.random()*12); } else { finish(); }
    }
    function finish(){
      halt(); gen.classList.remove("run");
      if(caret&&caret.parentNode) caret.parentNode.removeChild(caret);
      metaEl.textContent="Ready";
      statsEl.textContent=((Date.now()-started)/1000).toFixed(1)+"s  ·  "+TEXT.length.toLocaleString()+" chars";
      copyBtn.disabled=false; dlBtn.disabled=false; body.scrollTop=0;
    }
    function stream(text){
      TEXT=text; tokens=TEXT.match(/\s+|\S+/g)||[]; idx=0;
      clearBody(); node=document.createTextNode(""); body.appendChild(node);
      caret=document.createElement("span"); caret.className="caret"; body.appendChild(caret);
      started=Date.now(); tick=setInterval(tickMeta,1000); tickMeta(); step();
    }
    function run(){
      var my=++runId; halt(); gen.classList.add("run"); node=null; caret=null;
      copyBtn.disabled=true; dlBtn.disabled=true; copyBtn.classList.remove("ok"); dlBtn.classList.remove("ok"); copyBtn.textContent="Copy"; dlBtn.textContent=".md";
      statsEl.textContent=""; metaEl.textContent="warming up…";
      clearBody();
      var think=document.createElement("span"); think.className="thinking";
      think.innerHTML='<span class="tdots"><span></span><span></span><span></span></span> warming up…';
      body.appendChild(think);
      var pick=SETS[Math.floor(Math.random()*SETS.length)];
      if(ideaEl) ideaEl.textContent=pick.idea;
      dlName=(pick.file?pick.file:"estimate")+".txt";
      var warm=new Promise(function(r){ setTimeout(r,650); });
      Promise.all([warm, Promise.resolve(pick.output)]).then(function(arr){ if(my===runId) stream(arr[1]); });
    }
    if(copyBtn) copyBtn.addEventListener("click",function(){ if(copyBtn.disabled)return; var ok=function(){ copyBtn.classList.add("ok"); copyBtn.textContent="Copied"; setTimeout(function(){copyBtn.classList.remove("ok");copyBtn.textContent="Copy";},1500); }; if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(TEXT).then(ok).catch(function(){}); } else ok(); });
    if(dlBtn) dlBtn.addEventListener("click",function(){ if(dlBtn.disabled)return; try{ var b=new Blob([TEXT],{type:"text/plain"}),u=URL.createObjectURL(b),a=document.createElement("a"); a.href=u; a.download=dlName; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(function(){URL.revokeObjectURL(u);},1000); dlBtn.classList.add("ok"); dlBtn.textContent="Saved"; setTimeout(function(){dlBtn.classList.remove("ok");dlBtn.textContent=".md";},1500); }catch(e){} });
    if(replay) replay.addEventListener("click", run);
    if("IntersectionObserver" in window){ var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ io.disconnect(); run(); } }); },{threshold:0.35}); io.observe(sec); } else run();
  })();

  /* ===== WebGL engine field (particles) ===== */
  var GL=null;
  function initGL(){
    if(!hasTHREE || lowMem || small) return false;
    var canvas=document.getElementById("gl"); if(!canvas) return false;
    var THREE=window.THREE, renderer;
    try{ renderer=new THREE.WebGLRenderer({canvas:canvas, antialias:false, alpha:true, powerPreference:"high-performance"}); }catch(e){ return false; }
    renderer.setPixelRatio(0.8);
    renderer.setSize(innerWidth, innerHeight, false);
    var scene=new THREE.Scene(), cam=new THREE.Camera();
    var NUM=7;
    var trailXY=new Float32Array(NUM*2), trailI=new Float32Array(NUM);
    var uni={
      uTime:{value:0}, uAmb:{value:0.06}, uAspect:{value:innerWidth/innerHeight},
      uTrail:{value:trailXY}, uTrailI:{value:trailI},
      uA:{value:new THREE.Color("#241f63")}, uB:{value:new THREE.Color(ACCENTS.cyan)}, uC:{value:new THREE.Color(ACCENTS.magenta)}
    };
    var vert="varying vec2 vUv; void main(){ vUv=uv; gl_Position=vec4(position,1.0); }";
    var frag=[
      "precision highp float; varying vec2 vUv;",
      "uniform float uTime,uAmb,uAspect; uniform vec2 uTrail["+NUM+"]; uniform float uTrailI["+NUM+"]; uniform vec3 uA,uB,uC;",
      "float hash(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }",
      "float vn(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f); return mix(mix(hash(i),hash(i+vec2(1.,0.)),u.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),u.x),u.y); }",
      "float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<3;i++){ v+=a*vn(p); p*=2.03; a*=.5; } return v; }",
      "void main(){ vec2 p=(vUv-0.5); p.x*=uAspect;",
      " float t=uTime*0.06;",
      " float field=0.0;",
      " for(int i=0;i<"+NUM+";i++){ vec2 d=p-uTrail[i]; field += uTrailI[i]*0.004/(dot(d,d)+0.003); }",
      " float amb=fbm(p*2.4 + t*1.3); amb*=amb; field += amb*uAmb;",
      " float f=clamp(field,0.0,1.7);",
      " vec3 col=mix(vec3(0.015,0.016,0.05), uA, smoothstep(0.06,0.55,f));",
      " col=mix(col, uB, smoothstep(0.45,1.05,f));",
      " col=mix(col, uC, smoothstep(1.0,1.6,f));",
      " col *= smoothstep(0.0,0.16,f)*0.9 + 0.1;",
      " col *= 1.0 - 0.5*dot(p*vec2(0.72,1.0), p);",
      " gl_FragColor=vec4(col,1.0); }"
    ].join("\n");
    var mesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2), new THREE.ShaderMaterial({uniforms:uni, vertexShader:vert, fragmentShader:frag, depthTest:false, depthWrite:false}));
    scene.add(mesh);

    var gscene=new THREE.Scene();
    var pcam=new THREE.PerspectiveCamera(55, innerWidth/innerHeight, 0.1, 120);
    pcam.position.set(0, 2.4, 13);
    var galaxy=null, galGroup=null, gUni=null, galBaseSpin=(soft?0.014:0.05), galKick=0, camTX=0, camTY=2.4;
    try{ (function buildGalaxy(){
      var COUNT=6000, ARMS=3, RMAX=7.0, TWIST=1.4, RND=0.36, RNDP=2.7;
      var pos=new Float32Array(COUNT*3), col=new Float32Array(COUNT*3), asc=new Float32Array(COUNT), asd=new Float32Array(COUNT);
      var cIn=new THREE.Color("#ffe6b8"), cMid=new THREE.Color(ACCENTS.magenta), cOut=new THREE.Color(ACCENTS.cyan), tmp=new THREE.Color();
      for(var i=0;i<COUNT;i++){
        var r=Math.pow(Math.random(),1.4)*RMAX, branch=(i%ARMS)/ARMS*Math.PI*2.0, twist=r*TWIST;
        var sx=Math.pow(Math.random(),RNDP)*(Math.random()<0.5?1:-1)*RND*r;
        var sy=Math.pow(Math.random(),RNDP)*(Math.random()<0.5?1:-1)*RND*r*0.45;
        var sz=Math.pow(Math.random(),RNDP)*(Math.random()<0.5?1:-1)*RND*r;
        pos[i*3]=Math.cos(branch+twist)*r+sx; pos[i*3+1]=sy*0.5; pos[i*3+2]=Math.sin(branch+twist)*r+sz;
        var f=r/RMAX;
        if(f<0.5){ tmp.copy(cIn).lerp(cMid, f/0.5); } else { tmp.copy(cMid).lerp(cOut, (f-0.5)/0.5); }
        col[i*3]=tmp.r; col[i*3+1]=tmp.g; col[i*3+2]=tmp.b;
        asc[i]=0.55+Math.random()*Math.random()*2.6; asd[i]=Math.random();
      }
      var g=new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos,3));
      g.setAttribute("aColor", new THREE.BufferAttribute(col,3));
      g.setAttribute("aScale", new THREE.BufferAttribute(asc,1));
      g.setAttribute("aSeed", new THREE.BufferAttribute(asd,1));
      gUni={ uTime:{value:0}, uSize:{value:28.0}, uPR:{value:renderer.getPixelRatio()}, uFlare:{value:0} };
      var gv=[
        "precision highp float;",
        "attribute vec3 aColor; attribute float aScale, aSeed;",
        "uniform float uTime,uSize,uPR,uFlare;",
        "varying vec3 vColor; varying float vTw;",
        "void main(){ vColor=aColor;",
        " vec4 mv=modelViewMatrix*vec4(position,1.0);",
        " float tw=0.55+0.45*sin(uTime*1.6+aSeed*6.2831);",
        " vTw=tw; gl_Position=projectionMatrix*mv;",
        " gl_PointSize=clamp(uSize*aScale*tw*(1.0+uFlare*0.9)*uPR/max(0.001,-mv.z), 0.0, 42.0); }"
      ].join("\n");
      var gf=[
        "precision highp float;",
        "varying vec3 vColor; varying float vTw; uniform float uFlare;",
        "void main(){ float d=length(gl_PointCoord-0.5); if(d>0.5) discard;",
        " float a=pow(smoothstep(0.5,0.0,d),1.7), core=smoothstep(0.16,0.0,d);",
        " vec3 c=vColor*(0.64+0.64*vTw)+core*0.14+uFlare*0.4*vColor;",
        " gl_FragColor=vec4(c, a*(0.72+0.35*vTw)); }"
      ].join("\n");
      galaxy=new THREE.Points(g, new THREE.ShaderMaterial({uniforms:gUni, vertexShader:gv, fragmentShader:gf, blending:THREE.AdditiveBlending, depthTest:false, depthWrite:false, transparent:true}));
      galGroup=new THREE.Group(); galGroup.rotation.x=-1.02; galGroup.position.set(1.75,-0.9,0); galGroup.add(galaxy); gscene.add(galGroup);
    })(); }catch(e){ galaxy=null; }

    addEventListener("resize",function(){ renderer.setSize(innerWidth,innerHeight,false); uni.uAspect.value=innerWidth/innerHeight; pcam.aspect=innerWidth/innerHeight; pcam.updateProjectionMatrix(); if(gUni)gUni.uPR.value=renderer.getPixelRatio(); },{passive:true});
    canvas.addEventListener("webglcontextlost",function(e){ e.preventDefault(); visible=false; stop(); root.classList.remove("gl-on"); GL=null; },false);
    var lastMoveT=-9999; addEventListener("mousemove",function(){ lastMoveT=uni.uTime.value; },{passive:true});

    var raf=null, last=null, visible=true, scrollAmb=0;
    var smp=new THREE.Vector2(0,0), prev=new THREE.Vector2(0,0);
    function frame(now){ if(last===null)last=now; var dt=Math.min(0.05,(now-last)/1000); last=now;
      uni.uTime.value+=dt; ACTIVITY.v=Math.max(0, ACTIVITY.v-dt*0.8);
      var a=uni.uAspect.value, idle=(uni.uTime.value-lastMoveT)>2.5, tx, ty;
      if(idle){ var tt=uni.uTime.value; tx=Math.cos(tt*0.35)*0.55*a; ty=Math.sin(tt*0.5)*0.32; }
      else { tx=P.nx*0.5*a; ty=-P.ny*0.5; }
      if(idle){ smp.x=lerp(smp.x,tx,0.02); smp.y=lerp(smp.y,ty,0.02); } else { smp.x=tx; smp.y=ty; }
      var speed=Math.hypot(smp.x-prev.x, smp.y-prev.y);
      for(var i=NUM-1;i>0;i--){ trailXY[i*2]=trailXY[(i-1)*2]; trailXY[i*2+1]=trailXY[(i-1)*2+1]; trailI[i]=trailI[i-1]*0.7; }
      trailXY[0]=smp.x; trailXY[1]=smp.y;
      trailI[0]=clamp((idle?0.10:0.16)+speed*4.0+ACTIVITY.v*0.4, idle?0.10:0.16, 1.0);
      prev.x=smp.x; prev.y=smp.y;
      scrollAmb*=0.92; uni.uAmb.value=0.06+scrollAmb;
      if(galaxy){
        gUni.uTime.value+=dt; galKick*=0.94;
        galaxy.rotation.y+=(galBaseSpin+galKick)*dt;
        gUni.uFlare.value=lerp(gUni.uFlare.value, Math.min(1.0,ACTIVITY.v), 0.2);
        var pAmp=soft?0.4:1.0;
        camTX=lerp(camTX, P.nx*1.9*pAmp, 0.035); camTY=lerp(camTY, 2.4-P.ny*1.35*pAmp, 0.035);
        pcam.position.x=camTX; pcam.position.y=camTY; pcam.lookAt(0,0,0);
      }
      renderer.render(scene,cam);
      if(galaxy){ renderer.autoClear=false; renderer.render(gscene,pcam); renderer.autoClear=true; }
      raf=requestAnimationFrame(frame); }
    function start(){ if(!raf&&visible){ last=null; raf=requestAnimationFrame(frame); } }
    function stop(){ if(raf){ cancelAnimationFrame(raf); raf=null; } }
    document.addEventListener("visibilitychange",function(){ visible=!document.hidden; visible?start():stop(); });
    root.classList.add("gl-on"); start();
    GL={ scrollPulse:function(v){ scrollAmb=Math.min(0.35, v); galKick=Math.min(0.6, galKick+v*1.2); } };
    return true;
  }

  /* ===== custom cursor ===== */
  function initCursor(){
    if(!canHover || coarse) return;
    var dot=document.querySelector(".cursor"), ring=document.querySelector(".cursor-ring"), label=ring&&ring.querySelector(".clabel"); if(!dot||!ring)return;
    root.classList.add("has-cursor");
    var rx=P.x, ry=P.y;
    (function loop(){ dot.style.transform="translate("+P.x+"px,"+P.y+"px) translate(-50%,-50%)"; rx=lerp(rx,P.x,0.18); ry=lerp(ry,P.y,0.18); ring.style.transform="translate("+rx+"px,"+ry+"px) translate(-50%,-50%)"; requestAnimationFrame(loop); })();
    addEventListener("mousedown",function(){ ring.classList.add("down"); }); addEventListener("mouseup",function(){ ring.classList.remove("down"); });
    document.querySelectorAll("[data-cursor],a,button").forEach(function(el){ el.addEventListener("mouseenter",function(){ ring.classList.add("hover"); if(label) label.textContent=el.getAttribute("data-cursor")||""; }); el.addEventListener("mouseleave",function(){ ring.classList.remove("hover"); if(label) label.textContent=""; }); });
  }

  /* ===== click ripple ===== */
  function initRipple(){ addEventListener("pointerdown",function(e){ if(!hasGSAP)return; var r=document.createElement("div"); r.className="ripple"; r.style.left=e.clientX+"px"; r.style.top=e.clientY+"px"; document.body.appendChild(r); gsap.fromTo(r,{scale:0,opacity:0.9,xPercent:-50,yPercent:-50},{scale:6,opacity:0,duration:0.7,ease:"power2.out",onComplete:function(){ r.remove(); }}); },{passive:true}); }

  /* ===== neon cursor trail ===== */
  function initTrail(){
    if(!canHover||coarse) return;
    var cv=document.createElement("canvas"); cv.className="cursor-trail"; cv.setAttribute("aria-hidden","true");
    document.body.appendChild(cv);
    var ctx=cv.getContext("2d"); if(!ctx) return;
    var DPR=Math.min(2, window.devicePixelRatio||1), W=0, H=0;
    function size(){ W=innerWidth; H=innerHeight; cv.width=Math.floor(W*DPR); cv.height=Math.floor(H*DPR); cv.style.width=W+"px"; cv.style.height=H+"px"; ctx.setTransform(DPR,0,0,DPR,0,0); }
    size(); addEventListener("resize", size, {passive:true});
    var COLORS=[ACCENTS.cyan, ACCENTS.magenta, ACCENTS.indigo];
    function rgba(hex,a){ var n=parseInt(hex.slice(1),16); return "rgba("+((n>>16)&255)+","+((n>>8)&255)+","+(n&255)+","+a.toFixed(3)+")"; }
    var parts=[], lx=P.x, ly=P.y, raf=null;
    function ensure(){ if(!raf) raf=requestAnimationFrame(loop); }
    addEventListener("mousemove", function(e){
      var x=e.clientX, y=e.clientY, dx=x-lx, dy=y-ly, n=Math.min(5, Math.floor(Math.hypot(dx,dy)/7));
      for(var i=0;i<n;i++){ var t=(i+1)/n;
        parts.push({ x:lx+dx*t, y:ly+dy*t, vx:-dx*0.04+(Math.random()-0.5)*0.8, vy:-dy*0.04+(Math.random()-0.5)*0.8, life:1, r:1.6+Math.random()*2.6, c:COLORS[(Math.random()*COLORS.length)|0] });
      }
      if(parts.length>160) parts.splice(0, parts.length-160);
      lx=x; ly=y; ensure();
    }, {passive:true});
    function loop(){
      ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation="lighter";
      var fade=soft?0.075:0.045;
      for(var i=parts.length-1;i>=0;i--){ var p=parts[i];
        p.life-=fade; if(p.life<=0){ parts.splice(i,1); continue; }
        p.x+=p.vx; p.y+=p.vy; p.vx*=0.96; p.vy*=0.96;
        var rad=p.r*(0.5+p.life)*2.2, a=p.life*p.life*0.55;
        var g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rad);
        g.addColorStop(0, rgba(p.c,a)); g.addColorStop(1, rgba(p.c,0));
        ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,rad,0,6.2832); ctx.fill();
      }
      ctx.globalCompositeOperation="source-over";
      if(parts.length){ raf=requestAnimationFrame(loop); } else { raf=null; }
    }
    document.addEventListener("visibilitychange",function(){ if(document.hidden){ if(raf){ cancelAnimationFrame(raf); raf=null; } } else if(parts.length){ ensure(); } });
  }

  /* ===== tilt (spring) ===== */
  function initTilt(){ if(!canHover||coarse)return; document.querySelectorAll("[data-tilt]").forEach(function(card){ var rx=0,ry=0,tx=0,ty=0,raf=null,active=false; function rndr(){ rx=lerp(rx,tx,0.12); ry=lerp(ry,ty,0.12); card.style.transform="perspective(900px) rotateY("+rx+"deg) rotateX("+ry+"deg)"; if(active||Math.abs(rx-tx)>0.01||Math.abs(ry-ty)>0.01){ raf=requestAnimationFrame(rndr);} else raf=null; } card.addEventListener("mousemove",function(e){ var r=card.getBoundingClientRect(); var px=(e.clientX-r.left)/r.width-0.5, py=(e.clientY-r.top)/r.height-0.5; tx=px*9; ty=-py*9; card.style.setProperty("--mx",(px*100+50)+"%"); card.style.setProperty("--my",(py*100+50)+"%"); active=true; if(!raf)raf=requestAnimationFrame(rndr); }); card.addEventListener("mouseleave",function(){ tx=0; ty=0; active=false; if(!raf)raf=requestAnimationFrame(rndr); }); }); }

  /* ===== split text into chars (for headings) ===== */
  function splitChars(el){
    if(el.dataset.split2)return; el.dataset.split2="1";
    var walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT,null), nodes=[]; while(walker.nextNode())nodes.push(walker.currentNode);
    nodes.forEach(function(node){ var txt=node.textContent; var frag=document.createDocumentFragment();
      var tokens=txt.split(/(\s+)/);
      tokens.forEach(function(tok){
        if(tok===""){ return; }
        if(/^\s+$/.test(tok)){ frag.appendChild(document.createTextNode(tok)); return; }
        var w=document.createElement("span"); w.className="word";
        for(var i=0;i<tok.length;i++){ var c=document.createElement("span"); c.className="char"; c.textContent=tok[i]; w.appendChild(c); }
        frag.appendChild(w);
      });
      node.parentNode.replaceChild(frag,node); });
    return el.querySelectorAll(".char");
  }

  /* ===== magnetic + per-letter move-away ===== */
  function initMagnetic(){
    if(!canHover||coarse||!hasGSAP)return;
    document.querySelectorAll("[data-magnetic]").forEach(function(el){
      var qx=gsap.quickTo(el,"x",{duration:0.4,ease:"power3"}), qy=gsap.quickTo(el,"y",{duration:0.4,ease:"power3"});
      el.addEventListener("mousemove",function(e){ var r=el.getBoundingClientRect(); qx((e.clientX-(r.left+r.width/2))*0.4); qy((e.clientY-(r.top+r.height/2))*0.35); });
      el.addEventListener("mouseleave",function(){ qx(0); qy(0); });
    });
    document.querySelectorAll("[data-magtext] span").forEach(function(span){
      var txt=span.textContent; span.textContent=""; var chars=[];
      for(var i=0;i<txt.length;i++){ var s=document.createElement("span"); s.className="mchar"; s.textContent=txt[i]===" "?" ":txt[i]; span.appendChild(s); chars.push(s); }
      var setters=chars.map(function(c){ return { x:gsap.quickTo(c,"x",{duration:0.3,ease:"power3"}), y:gsap.quickTo(c,"y",{duration:0.3,ease:"power3"}) }; });
      var host=span.closest("[data-magtext]");
      host.addEventListener("mousemove",function(e){ chars.forEach(function(c,i){ var r=c.getBoundingClientRect(); var dx=e.clientX-(r.left+r.width/2), dy=e.clientY-(r.top+r.height/2); var dist=Math.hypot(dx,dy); var f=clamp(1-dist/90,0,1); setters[i].x(-dx*0.4*f); setters[i].y(-dy*0.4*f); }); });
      host.addEventListener("mouseleave",function(){ setters.forEach(function(s){ s.x(0); s.y(0); }); });
    });
  }

  /* ===== count-up ===== */
  function countUp(el){ var to=parseFloat(el.getAttribute("data-count"))||0, pad=parseInt(el.getAttribute("data-pad")||"0",10), o={v:0};
    gsap.to(o,{ v:to, duration:1.4, ease:"power2.out", onUpdate:function(){ var n=Math.round(o.v); el.textContent=pad?String(n).padStart(pad,"0"):n; } }); }

  /* ===== Matter.js neon field (cursor repulsion + drag) ===== */
  function initPhysics(){
    var host=document.getElementById("phys"); if(!host)return; var chips=[].slice.call(host.querySelectorAll(".pchip"));
    if(!chips.length || small || coarse || !hasMatter){ host.classList.add("static"); return; }
    var M=window.Matter;
    try{
      var W=host.clientWidth, H=host.clientHeight, engine=M.Engine.create(); engine.gravity.y=0;
      var bodies=chips.map(function(chip){ var cw=chip.offsetWidth||90, ch=chip.offsetHeight||30; var b=M.Bodies.rectangle(20+Math.random()*(W-40),20+Math.random()*(H-40),cw,ch,{chamfer:{radius:ch/2},frictionAir:0.06,restitution:0.7,render:{visible:false}}); b._chip=chip; b._w=cw; b._h=ch; return b; });
      var wall=120, walls=[ M.Bodies.rectangle(W/2,H+wall/2,W+400,wall,{isStatic:true}), M.Bodies.rectangle(W/2,-wall/2,W+400,wall,{isStatic:true}), M.Bodies.rectangle(-wall/2,H/2,wall,H+400,{isStatic:true}), M.Bodies.rectangle(W+wall/2,H/2,wall,H+400,{isStatic:true}) ];
      M.Composite.add(engine.world, bodies.concat(walls));
      var mc=M.MouseConstraint.create(engine,{ mouse:M.Mouse.create(host), constraint:{ stiffness:0.2, render:{visible:false} } });
      M.Composite.add(engine.world, mc);
      var ms=mc.mouse; if(ms.element){ ms.element.removeEventListener("wheel",ms.mousewheel); ms.element.removeEventListener("DOMMouseScroll",ms.mousewheel); }
      function syncDOM(){ for(var i=0;i<bodies.length;i++){ var b=bodies[i]; b._chip.style.transform="translate("+(b.position.x-b._w/2)+"px,"+(b.position.y-b._h/2)+"px) rotate("+b.angle+"rad)"; } }
      M.Events.on(engine,"beforeUpdate",function(){ var rect=host.getBoundingClientRect(); var mxp=P.x-rect.left, myp=P.y-rect.top;
        if(mxp>-40&&mxp<W+40&&myp>-40&&myp<H+40){ for(var i=0;i<bodies.length;i++){ var b=bodies[i]; var dx=b.position.x-mxp, dy=b.position.y-myp, d=Math.hypot(dx,dy); if(d<150&&d>0.001){ var f=(1-d/150)*0.5; M.Body.applyForce(b,b.position,{x:(dx/d)*f*0.012,y:(dy/d)*f*0.012}); } } }
        for(var j=0;j<bodies.length;j++){ var bb=bodies[j]; var cx=bb.position.x-W/2, cy=bb.position.y-H/2; M.Body.applyForce(bb,bb.position,{x:-cx*0.0000016,y:-cy*0.0000016}); } });
      M.Events.on(engine,"afterUpdate",syncDOM);
      var runner=M.Runner.create(), running=false;
      function run(){ if(!running){ running=true; M.Runner.run(runner,engine); } } function pause(){ if(running){ running=false; M.Runner.stop(runner); } }
      if("IntersectionObserver" in window){ new IntersectionObserver(function(es){ es.forEach(function(e){ e.isIntersecting?run():pause(); }); },{threshold:0.05}).observe(host); } else run();
      addEventListener("resize",function(){ W=host.clientWidth; H=host.clientHeight; M.Body.setPosition(walls[0],{x:W/2,y:H+wall/2}); M.Body.setPosition(walls[1],{x:W/2,y:-wall/2}); M.Body.setPosition(walls[3],{x:W+wall/2,y:H/2}); },{passive:true});
      syncDOM();
    }catch(e){ host.classList.add("static"); }
  }

  /* ===== section dots + per-section accent ===== */
  function initSections(lenis){
    var dots=[].slice.call(document.querySelectorAll(".dots button"));
    dots.forEach(function(d){ d.addEventListener("click",function(){ var t=document.getElementById(d.getAttribute("data-dot")); if(!t)return; if(lenis)lenis.scrollTo(t,{offset:-60}); else t.scrollIntoView({behavior:"smooth"}); }); });
    if(!("IntersectionObserver" in window))return;
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ var id=e.target.getAttribute("data-section"); var acc2=e.target.getAttribute("data-accent"); if(acc2&&ACCENTS[acc2]) root.style.setProperty("--accent",ACCENTS[acc2]); dots.forEach(function(x){ var on=x.getAttribute("data-dot")===id; x.classList.toggle("on",on); if(on)x.setAttribute("aria-current","true"); else x.removeAttribute("aria-current"); }); } }); },{threshold:0, rootMargin:"-45% 0px -45% 0px"});
    document.querySelectorAll("[data-section]").forEach(function(s){ io.observe(s); });
  }

  /* ===== loader ===== */
  function runLoader(done){
    var el=document.getElementById("loader"); var fired=false;
    function finish(){ if(fired)return; fired=true; if(el)el.style.display="none"; done(); }
    if(!el){ finish(); return; }
    if(reduce || !hasGSAP){ el.style.display="none"; done(); return; }
    var word=((CFG.business&&CFG.business.shortName)||"BIZ").toUpperCase(), wEl=document.getElementById("lword"), spans=[];
    for(var i=0;i<word.length;i++){ var s=document.createElement("span"); s.textContent=word[i]; wEl.appendChild(s); spans.push(s); }
    var glyphs="ABCDEFGHIJKLMNOPQRSTUVWXYZ#@%&01"; var num=document.getElementById("lnum");
    var bar=document.getElementById("lbar"), C=2*Math.PI*54; if(bar){ bar.style.strokeDasharray=C; bar.style.strokeDashoffset=C; }
    root.classList.add("ldr-live");
    var o={v:0};
    var tl=gsap.timeline({ onComplete:finish });
    tl.to(o,{ v:100, duration:1.5, ease:"power2.inOut", onUpdate:function(){ var p=o.v/100, n=Math.round(o.v); if(num)num.textContent=n; if(bar)bar.style.strokeDashoffset=C*(1-p);
        var resolved=Math.floor(p*word.length);
        for(var k=0;k<word.length;k++){ if(k<resolved){ spans[k].textContent=word[k]; spans[k].classList.add("lit"); } else { spans[k].textContent=glyphs[Math.floor(Math.random()*glyphs.length)]; } }
      }, onComplete:function(){ spans.forEach(function(s,i){ s.textContent=word[i]; s.classList.add("lit"); }); } });
    tl.to(".loader-inner",{ opacity:0, y:-16, duration:0.4, ease:"power2.in" },"+=0.15");
    tl.to(".l-cols i",{ scaleY:0, duration:0.7, stagger:0.06, ease:"power4.inOut" },"-=0.1");
    setTimeout(function(){ if(!fired){ tl.kill(); finish(); } },4200);
  }

  /* ===== motion build ===== */
  function build(){
    root.classList.add("motion");
    gsap.registerPlugin(ScrollTrigger);

    var lenis=null;
    if(hasLenis){ lenis=new Lenis({ duration:1.1, smoothWheel:true }); lenis.on("scroll",ScrollTrigger.update); gsap.ticker.add(function(t){ lenis.raf(t*1000); }); gsap.ticker.lagSmoothing(0); }
    document.querySelectorAll('a[href^="#"]').forEach(function(a){ a.addEventListener("click",function(e){ var id=a.getAttribute("href"); if(id.length<2)return; var t=document.querySelector(id); if(!t)return; e.preventDefault(); if(lenis)lenis.scrollTo(t,{offset:-60}); else t.scrollIntoView({behavior:"smooth"}); }); });

    document.querySelectorAll("[data-split]").forEach(function(h){ splitChars(h); });

    var bar=document.querySelector(".scroll-bar");
    addEventListener("scroll",function(){ var max=document.documentElement.scrollHeight-innerHeight; var p=max>0?clamp((scrollY||pageYOffset)/max,0,1):0; if(bar)bar.style.transform="scaleX("+p+")"; },{passive:true});
    if(hasST){ ScrollTrigger.create({ onUpdate:function(self){ var v=Math.abs(self.getVelocity()); if(GL)GL.scrollPulse(clamp(v/4000,0,0.5)); } }); }

    initSections(lenis);

    /* HERO intro */
    var heroChars=document.querySelectorAll(".hero h1 .char");
    var tl=gsap.timeline({ defaults:{ ease:"power3.out" } });
    tl.set(".hero h1 .char",{ filter:"blur(8px)" })
      .to(".hero h1 .char",{ y:0, opacity:1, filter:"blur(0px)", duration:0.8, stagger:0.025, onComplete:function(){ heroChars.forEach(function(c){ c.style.willChange="auto"; }); } })
      .from(".hero-sub",{ y:18, opacity:0, duration:0.7 },"-=0.5")
      .from(".hero-cta",{ y:18, opacity:0, duration:0.6 },"-=0.45")
      .from(".hero-tags",{ y:14, opacity:0, duration:0.5 },"-=0.4")
      .from(".pmap",{ y:30, opacity:0, duration:0.8 },"-=0.7")
      .from(".hud",{ opacity:0, y:8, duration:0.5, stagger:0.05 },"-=0.5")
      .add(function(){ document.querySelectorAll(".hud [data-count]").forEach(countUp); surge(1.0); },"-=0.2");

    document.querySelectorAll("[data-split]").forEach(function(h){ if(h.closest(".hero"))return; gsap.to(h.querySelectorAll(".char"),{ y:0, opacity:1, duration:0.7, stagger:0.02, ease:"power3.out", scrollTrigger:{ trigger:h, start:"top 85%", once:true } }); });

    ScrollTrigger.batch(".reveal",{ start:"top 85%", once:true, onEnter:function(b){ gsap.to(b,{ opacity:1, y:0, duration:0.8, stagger:0.09, ease:"power3.out" }); } });
    ScrollTrigger.batch(".reveal-l",{ start:"top 85%", once:true, onEnter:function(b){ gsap.to(b,{ opacity:1, x:0, duration:0.8, stagger:0.08, ease:"power3.out" }); } });

    var dt={ trigger:".dissect", start:"top 80%", once:true };
    gsap.to(".dhl",{ scaleX:1, duration:0.6, stagger:0.15, ease:"power3.out", scrollTrigger:dt });
    gsap.to(".dtag",{ opacity:1, x:0, duration:0.5, stagger:0.15, ease:"power2.out", scrollTrigger:dt });

    (function(){ var stage=document.querySelector(".stage"); if(!stage)return; var steps=gsap.utils.toArray(".step"), dots=gsap.utils.toArray("#pipeline .rail-dot"), fills=gsap.utils.toArray("#pipeline .rail-fill"), n=steps.length;
      ScrollTrigger.create({ trigger:".pipe-inner", start:"top 14%", end:"+="+(n*90)+"%", pin:".pipe-inner", scrub:true, anticipatePin:1,
        onUpdate:function(self){ var p=self.progress, idx=Math.min(n-1,Math.floor(p*n)); steps.forEach(function(s,i){ s.classList.toggle("on",i===idx); }); dots.forEach(function(d,i){ d.classList.toggle("on",i<=idx); }); fills.forEach(function(f,i){ f.style.transform="scaleX("+clamp(p*n-i,0,1)+")"; }); } }); })();

    (function(){ var sec=document.querySelector(".show"), pin=sec&&sec.querySelector(".hpin"), track=sec&&sec.querySelector(".htrack"), prog=sec&&sec.querySelector(".hprog>i"); if(!sec||!track)return; if(small){ sec.classList.add("stacked"); return; }
      var dist=function(){ return Math.max(0,track.scrollWidth-innerWidth); };
      gsap.to(track,{ x:function(){ return -dist(); }, ease:"none", scrollTrigger:{ trigger:pin, start:"top top", end:function(){ return "+="+dist(); }, pin:pin, pinSpacing:true, scrub:1, invalidateOnRefresh:true, onUpdate:function(self){ if(prog)prog.style.transform="scaleX("+self.progress+")"; } } });
      var skew=gsap.quickSetter(".scard","skewX","deg"); ScrollTrigger.create({ onUpdate:function(self){ skew(clamp(self.getVelocity()/-320,-12,12)); } }); })();

    ScrollTrigger.refresh();
    if(document.readyState!=="complete"){ addEventListener("load",function(){ ScrollTrigger.refresh(); }); }
    if(document.fonts&&document.fonts.ready){ document.fonts.ready.then(function(){ ScrollTrigger.refresh(); }); }
  }

  /* ===== boot ===== */
  try{ initGL(); }catch(e){}
  try{ initCursor(); }catch(e){}
  try{ initRipple(); }catch(e){}
  try{ initTrail(); }catch(e){}
  try{ initTilt(); }catch(e){}
  try{ initPhysics(); }catch(e){}

  runLoader(function(){
    if(hasGSAP && hasST){
      try{ build(); }catch(e){ root.classList.remove("motion"); try{ document.querySelectorAll(".char,.reveal,.reveal-l,.dtag").forEach(function(el){ el.style.opacity="1"; el.style.transform="none"; }); }catch(_){} }
      try{ initMagnetic(); }catch(e){}
    } else {
      document.querySelectorAll(".char,.reveal,.reveal-l,.dtag").forEach(function(el){ el.style.opacity="1"; el.style.transform="none"; });
    }
  });
})();
