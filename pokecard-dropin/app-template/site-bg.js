/* ============================================================
   Living "Depth Mesh" background — faithful port of the effect on
   1shotgen.com/signup. Self-contained: builds its own canvases/layers
   and runs a cursor-reactive WebGL gradient-mesh nebula + parallax glow
   orbs + drifting particle stars. Include on any page AFTER three.min.js:
     <script defer src="/vendor/three.min.js"></script>
     <script defer src="/site-bg.js"></script>
   The .aurora element (if present) is a pure-CSS fallback shown only
   when WebGL is unavailable — the opaque mesh covers it otherwise.

   Shader palette note: the nebula colors below are the same indigo /
   cyan / magenta as the business accents by default. To retint it,
   edit cAmethyst / cAqua / cEmerald in the fragment shader.
   ============================================================ */
(function () {
  "use strict";
  var THREE = window.THREE;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(pointer: fine)").matches;

  /* ---- build background DOM (prepended so content paints above) ---- */
  var root = document.createElement("div");
  root.className = "site-bg";
  root.setAttribute("aria-hidden", "true");
  root.innerHTML =
    '<canvas id="site-mesh"></canvas>' +
    '<div class="site-depth">' +
      '<div class="orb orb--a" data-depth="10"></div>' +
      '<div class="orb orb--b" data-depth="18"></div>' +
      '<div class="orb orb--c" data-depth="26"></div>' +
      '<div class="orb orb--d" data-depth="14"></div>' +
    "</div>" +
    '<canvas id="site-particles"></canvas>';
  if (document.body) document.body.insertBefore(root, document.body.firstChild);

  var meshCanvas = root.querySelector("#site-mesh");
  var pCanvas = root.querySelector("#site-particles");
  var orbs = Array.prototype.slice.call(root.querySelectorAll(".orb"));

  /* ---- pointer ---- */
  var pointer = { tx: 0, ty: 0, x: 0, y: 0, ux: 0.5, uy: 0.5, sux: 0.5, suy: 0.5, active: 0, targetActive: 0 };
  function setPointer(cx, cy) {
    pointer.ux = cx / window.innerWidth;
    pointer.uy = cy / window.innerHeight;
    pointer.tx = pointer.ux * 2 - 1;
    pointer.ty = pointer.uy * 2 - 1;
    pointer.targetActive = 1;
  }
  if (finePointer) {
    window.addEventListener("pointermove", function (e) { if (e.pointerType !== "touch") setPointer(e.clientX, e.clientY); }, { passive: true });
    window.addEventListener("pointerleave", function () { pointer.targetActive = 0; });
  }
  window.addEventListener("touchmove", function (e) { if (e.touches.length) setPointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });

  /* ---- WebGL mesh ---- */
  var renderer, scene, camera, material, glOk = true;
  var vert = "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy,0.0,1.0); }";
  var frag = [
    "precision highp float;",
    "varying vec2 vUv;",
    "uniform float uTime; uniform vec2 uRes; uniform vec2 uPointer; uniform float uActive; uniform float uReduce;",
    "vec3 hash3(vec2 p){ vec3 q=vec3(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)),dot(p,vec2(419.2,371.9))); return fract(sin(q)*43758.5453); }",
    "float noise(vec2 p){ vec2 i=floor(p),f=fract(p); vec2 u=f*f*(3.0-2.0*f);",
    "  float a=hash3(i).x,b=hash3(i+vec2(1.,0.)).x,c=hash3(i+vec2(0.,1.)).x,d=hash3(i+vec2(1.,1.)).x;",
    "  return mix(mix(a,b,u.x),mix(c,d,u.x),u.y); }",
    "float fbm(vec2 p){ float v=0.0,amp=0.5; mat2 rot=mat2(0.8,-0.6,0.6,0.8);",
    "  for(int i=0;i<5;i++){ v+=amp*noise(p); p=rot*p*2.02; amp*=0.5; } return v; }",
    "vec3 hueShift(vec3 c, float a){ const vec3 k=vec3(0.57735027); float ca=cos(a),sa=sin(a);",
    "  return c*ca + cross(k,c)*sa + k*dot(k,c)*(1.0-ca); }",
    "void main(){",
    "  vec2 uv=vUv; float aspect=uRes.x/max(uRes.y,1.0);",
    "  vec2 p=uv; p.x*=aspect;",
    "  vec2 ptr=uPointer; ptr.y=1.0-ptr.y; vec2 ptrA=vec2(ptr.x*aspect, ptr.y);",
    "  float t = uTime*0.26;",
    "  vec2 toP=ptrA-p; float d=length(toP);",
    "  float bulge=exp(-d*d*7.0)*(0.18+0.12*uActive); vec2 warped=p-toP*bulge;",
    "  vec2 flow = vec2(uTime*0.075, uTime*0.045 + sin(uTime*0.16 + warped.x*2.2)*0.06);",
    "  vec2 base = warped*1.6 + flow;",
    "  vec2 q=vec2(fbm(base+vec2(0.,t)), fbm(base+vec2(5.2,-t)));",
    "  vec2 r=vec2(fbm(base+q*1.4+vec2(1.7,9.2)+t*0.8), fbm(base+q*1.4+vec2(8.3,2.8)-t*0.6));",
    "  float f=fbm(base+r*1.2);",
    "  vec3 cVoid=vec3(0.020,0.024,0.055);",
    "  vec3 cAmethyst=vec3(0.427,0.365,0.988);",
    "  vec3 cSapphire=vec3(0.300,0.420,0.980);",
    "  vec3 cAqua=vec3(0.227,0.839,1.000);",
    "  vec3 cEmerald=vec3(1.000,0.282,0.816);",
    "  vec3 cRose=vec3(1.000,0.400,0.800);",
    "  vec3 col=mix(cVoid,cAmethyst,smoothstep(0.18,0.85,f));",
    "  col=mix(col,cSapphire,smoothstep(0.30,0.95,length(q)));",
    "  col=mix(col,cAqua,smoothstep(0.55,1.05,r.x+0.4));",
    "  col=mix(col,cEmerald,smoothstep(0.46,1.00,f+r.y*0.5)*0.98);",
    "  col=mix(col,cRose,smoothstep(0.80,1.15,q.x+f)*0.28);",
    "  float depth=smoothstep(0.1,0.9,f);",
    "  col*=0.32+0.66*depth;",
    "  float hue = sin(uTime*0.045)*0.7;",
    "  col=hueShift(col,hue);",
    "  float glow=exp(-d*d*9.0);",
    "  col+=glow*(0.16+0.30*uActive)*vec3(0.75,0.85,1.0);",
    "  col+=exp(-d*d*40.0)*(0.10*uActive)*vec3(1.0,0.86,0.45);",
    "  float vig=smoothstep(1.25,0.25,length((uv-0.5)*vec2(aspect,1.0))*1.35);",
    "  col=mix(cVoid*0.6,col,vig);",
    "  col+=(hash3(uv*uRes+t).x-0.5)*0.025;",
    "  gl_FragColor=vec4(max(col,0.0),1.0);",
    "}"
  ].join("\n");

  function initGL() {
    if (!THREE) { glOk = false; meshCanvas.style.display = "none"; return; }
    try {
      renderer = new THREE.WebGLRenderer({ canvas: meshCanvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch (e) { glOk = false; meshCanvas.style.display = "none"; return; }
    renderer.setClearColor(0x04050d, 1);
    scene = new THREE.Scene(); camera = new THREE.Camera();
    material = new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, depthTest: false, depthWrite: false,
      uniforms: { uTime: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uPointer: { value: new THREE.Vector2(0.5, 0.5) }, uActive: { value: 0 }, uReduce: { value: reduceMotion ? 1 : 0 } } });
    var geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]), 3));
    geo.setAttribute("uv", new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));
    var quad = new THREE.Mesh(geo, material); quad.frustumCulled = false; scene.add(quad);
    resizeGL();
  }
  function resizeGL() {
    if (!renderer) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    material.uniforms.uRes.value.set(window.innerWidth * dpr, window.innerHeight * dpr);
  }
  initGL();

  /* ---- particles ---- */
  var pctx = pCanvas.getContext("2d");
  var particles = [], pW = 0, pH = 0, pDpr = 1;
  function resizeParticles() {
    pDpr = Math.min(window.devicePixelRatio || 1, 2);
    pW = window.innerWidth; pH = window.innerHeight;
    pCanvas.width = Math.floor(pW * pDpr); pCanvas.height = Math.floor(pH * pDpr);
    pctx.setTransform(pDpr, 0, 0, pDpr, 0, 0);
    var count = Math.round(Math.min(80, (pW * pH) / 24000));
    var tints = ["180,200,255", "150,225,255", "200,180,255", "255,170,235"];
    particles = [];
    for (var i = 0; i < count; i++) particles.push({
      x: Math.random() * pW, y: Math.random() * pH, z: Math.random() * 0.8 + 0.2, r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12 - 0.05, tw: Math.random() * Math.PI * 2,
      tint: tints[(Math.random() * tints.length) | 0] });
  }
  function drawParticles(dt) {
    pctx.clearRect(0, 0, pW, pH);
    pctx.globalCompositeOperation = "lighter";
    for (var i = 0; i < particles.length; i++) {
      var s = particles[i];
      s.x += s.vx * dt * 0.06; s.y += s.vy * dt * 0.06; s.tw += dt * 0.002 * s.z;
      if (s.x < -4) s.x = pW + 4; else if (s.x > pW + 4) s.x = -4;
      if (s.y < -4) s.y = pH + 4; else if (s.y > pH + 4) s.y = -4;
      var ox = pointer.x * 26 * s.z, oy = pointer.y * 26 * s.z;
      var a = (0.16 + 0.5 * s.z) * (0.5 + 0.5 * (0.5 + 0.5 * Math.sin(s.tw)));
      pctx.beginPath(); pctx.arc(s.x + ox, s.y + oy, s.r * (0.7 + 0.6 * s.z), 0, Math.PI * 2);
      pctx.fillStyle = "rgba(" + s.tint + "," + a.toFixed(3) + ")"; pctx.fill();
    }
    pctx.globalCompositeOperation = "source-over";
  }
  resizeParticles();

  /* ---- loop ---- */
  function damp(c, t, l, dt) { return c + (t - c) * (1 - Math.exp(-l * dt)); }
  var last = performance.now(), running = true, elapsed = 0;
  function frame(now) {
    if (!running) return;
    var dt = Math.min(now - last, 48); last = now; var dts = dt / 1000; elapsed += dt;
    pointer.x = damp(pointer.x, pointer.tx, 6, dts); pointer.y = damp(pointer.y, pointer.ty, 6, dts);
    pointer.sux = damp(pointer.sux, pointer.ux, 7, dts); pointer.suy = damp(pointer.suy, pointer.uy, 7, dts);
    pointer.active = damp(pointer.active, pointer.targetActive, 4, dts);
    if (renderer && glOk) {
      material.uniforms.uTime.value = elapsed / 1000;
      material.uniforms.uPointer.value.set(pointer.sux, pointer.suy);
      material.uniforms.uActive.value = pointer.active;
      renderer.render(scene, camera);
    }
    drawParticles(dt);
    var ot = elapsed / 1000;
    orbs.forEach(function (orb, i) {
      var depth = parseFloat(orb.dataset.depth || "12");
      var dx = Math.sin(ot * 0.18 + i * 1.7) * 14 - pointer.x * depth;
      var dy = Math.cos(ot * 0.15 + i * 2.1) * 14 - pointer.y * depth;
      orb.style.transform = "translate3d(" + dx.toFixed(2) + "px," + dy.toFixed(2) + "px,0)";
    });
    requestAnimationFrame(frame);
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) running = false;
    else { running = true; last = performance.now(); requestAnimationFrame(frame); }
  });
  var rRaf = 0;
  window.addEventListener("resize", function () { if (rRaf) return; rRaf = requestAnimationFrame(function () { rRaf = 0; resizeGL(); resizeParticles(); }); });
  requestAnimationFrame(frame);
})();
