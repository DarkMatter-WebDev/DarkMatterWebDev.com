       import * as THREE from 'three';
        import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
        import { GUI } from 'lil-gui';

        // Per-page configuration set via window.FRACTAL_CONFIG before this module loads
        const _cfg = window.FRACTAL_CONFIG || {};

        // --- GLOBAL VARIABLES & SETUP ---
        let scene, camera, renderer, controls;
        let particles, geometry, material;
        let paramsFolder; // To hold dynamic algorithm settings

        let alignedPositions = null; // Store aligned geometry for animation
        let currentCentroid = new THREE.Vector3();
        let currentScaleFactor = 1.0;
        let wasAnimating = false;

        let gui;
        let mouseTarget = { x: 0, y: 0 };
        let mouseSmooth = { x: 0, y: 0 };
        let autoRotOffset = 0;

        // Global State — defaults overridable via window.FRACTAL_CONFIG
        const state = {
            algorithm: _cfg.algorithm || 'Aizawa Sphere',
            color1:    _cfg.color1    || '#ff0055',
            color2:    _cfg.color2    || '#4422ff',
            color3:    _cfg.color3    || '#00ffff',
            pointsCount:    _cfg.pointsCount    !== undefined ? _cfg.pointsCount    : 300000,
            pointSize:      _cfg.pointSize      !== undefined ? _cfg.pointSize      : 0.055,
            opacity:        _cfg.opacity        !== undefined ? _cfg.opacity        : 1.0,
            alignX:         _cfg.alignX         !== undefined ? _cfg.alignX         : 0.0,
            alignY:         _cfg.alignY         !== undefined ? _cfg.alignY         : 0.0,
            rotationSpeedX: _cfg.rotationSpeedX !== undefined ? _cfg.rotationSpeedX : 0.0033,
            rotationSpeedY: _cfg.rotationSpeedY !== undefined ? _cfg.rotationSpeedY : 0.0,
            animatePoints:  _cfg.animatePoints  || false,
            params: {}
        };

        // --- FRACTAL ALGORITHMS DEFINITIONS ---
        // 8 retained favorites, 4 fixed, 5 brand new completely custom algorithms!
        const algorithms = {
            'Aizawa Sphere': {
                type: 'ode',
                defaults: { a: 0.95, b: 0.7, c: 0.6, d: 3.5, e: 0.25, f: 0.1, dt: 0.01 },
                ranges: { 
                    a: [0.1, 2.0, 0.01], b: [0.1, 2.0, 0.01], c: [0.1, 2.0, 0.01], 
                    d: [1.0, 5.0, 0.01], e: [0.1, 1.0, 0.01], f: [0.0, 0.5, 0.01], dt: [0.001, 0.05, 0.001]
                },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let dx = (z - p.b) * x - p.d * y;
                        let dy = p.d * x + (z - p.b) * y;
                        let dz = p.c + p.a * z - Math.pow(z, 3) / 3 - (x * x + y * y) * (1 + p.e * z) + p.f * z * Math.pow(x, 3);
                        x += dx * p.dt; y += dy * p.dt; z += dz * p.dt;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 0.1; y = 0.1; z = 0.1; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Thomas Labyrinth': {
                type: 'ode',
                defaults: { b: 0.19, dt: 0.05 },
                ranges: { b: [0.0, 0.5, 0.001], dt: [0.01, 0.1, 0.001] },
                generate: (p, positions) => {
                    let x = 1.0, y = 0.0, z = 0.0;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let dx = Math.sin(y) - p.b * x;
                        let dy = Math.sin(z) - p.b * y;
                        let dz = Math.sin(x) - p.b * z;
                        x += dx * p.dt; y += dy * p.dt; z += dz * p.dt;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 1; y = 0; z = 0; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Nose-Hoover Braid': {
                type: 'ode',
                defaults: { a: 0.2, dt: 0.01 },
                ranges: { a: [0.1, 5.0, 0.1], dt: [0.001, 0.05, 0.001] },
                generate: (p, positions) => {
                    let x = 1.0, y = 0.0, z = 0.0;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let dx = y;
                        let dy = -x + y * z;
                        let dz = p.a - y * y;
                        x += dx * p.dt; y += dy * p.dt; z += dz * p.dt;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 0.0; z = 0.0; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Four-Wing Butterfly': {
                type: 'ode',
                defaults: { a: 0.2, b: 0.01, c: -0.4, dt: 0.05 },
                ranges: { a: [0.1, 0.5, 0.01], b: [-0.1, 0.1, 0.001], c: [-1.0, 0.0, 0.01], dt: [0.01, 0.1, 0.001] },
                generate: (p, positions) => {
                    let x = 1.0, y = 1.0, z = 1.0;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let dx = p.a * x + y * z;
                        let dy = p.b * x + p.c * y - x * z;
                        let dz = -z - x * y;
                        x += dx * p.dt; y += dy * p.dt; z += dz * p.dt;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 1.0; z = 1.0; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Clifford Cloud': {
                type: 'map',
                defaults: { a: 1.5, b: -1.8, c: 1.6, d: 0.9 },
                ranges: { a: [-3.0, 3.0, 0.01], b: [-3.0, 3.0, 0.01], c: [-3.0, 3.0, 0.01], d: [-3.0, 3.0, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let nx = Math.sin(p.a * y) + p.c * Math.cos(p.a * x);
                        let ny = Math.sin(p.b * x) + p.d * Math.cos(p.b * y);
                        let nz = Math.sin(p.c * z) + p.a * Math.cos(p.d * x);
                        x = nx; y = ny; z = nz;
                        positions.push(x, y, z);
                    }
                }
            },
            'Hopalong Nebula': {
                type: 'map',
                defaults: { a: 2.01, b: -2.53, c: 1.61, d: -0.33, e: 2.0, f: -1.0 },
                ranges: { a: [-3, 3, 0.01], b: [-3, 3, 0.01], c: [-3, 3, 0.01], d: [-3, 3, 0.01], e: [-3, 3, 0.01], f: [-3, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let nx = Math.sin(p.a * y) - Math.cos(p.b * x) + Math.sin(p.e * z);
                        let ny = Math.sin(p.c * x) - Math.cos(p.d * y) + Math.sin(p.f * z);
                        let nz = Math.sin(p.e * x) - Math.cos(p.f * y) + Math.sin(p.a * z);
                        x = nx; y = ny; z = nz;
                        positions.push(x, y, z);
                    }
                }
            },
            'Quantum Lotus': {
                type: 'map',
                defaults: { a: 1.2, b: 0.8, c: -1.5, d: 2.0, e: 0.9, f: 1.5 },
                ranges: { a: [-3, 3, 0.01], b: [-3, 3, 0.01], c: [-3, 3, 0.01], d: [-3, 3, 0.01], e: [0.1, 1.5, 0.01], f: [-3, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let r = Math.sqrt(x*x + y*y);
                        let nx = y * Math.cos(p.a) - x * Math.sin(p.b + r) - z;
                        let ny = x * Math.cos(p.c) + y * Math.sin(p.d + r) - z;
                        let nz = z * p.e + Math.sin(r * p.f);
                        x = nx; y = ny; z = nz;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 0.1; y = 0.1; z = 0.1; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Stellar Web': {
                type: 'map',
                defaults: { a: 2.1, b: -1.5, c: 1.8, d: 2.4, e: -1.2, f: 1.1 },
                ranges: { a: [-3, 3, 0.01], b: [-3, 3, 0.01], c: [-3, 3, 0.01], d: [-3, 3, 0.01], e: [-3, 3, 0.01], f: [-3, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let nx = p.a * Math.sin(y) - Math.cos(p.b * z) * x;
                        let ny = p.c * Math.sin(z) - Math.cos(p.d * x) * y;
                        let nz = p.e * Math.sin(x) - Math.cos(p.f * y) * z;
                        x = nx; y = ny; z = nz;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 0.1; y = 0.1; z = 0.1; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Abyssal Jellyfish': {
                type: 'map',
                defaults: { a: -1.72, b: 1.16, c: -1.35, d: 0.66 },
                ranges: { a: [-3, 3, 0.01], b: [-3, 3, 0.01], c: [-3, 3, 0.01], d: [-10, 10, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let nx = Math.sin(p.a * y) + Math.cos(p.b * z) - Math.sin(p.c * x);
                        let ny = Math.sin(p.a * z) + Math.cos(p.b * x) - Math.sin(p.c * y);
                        let nz = Math.sin(p.a * x) + Math.cos(p.b * y) - Math.sin(p.d * z);
                        x = nx; y = ny; z = nz;
                        positions.push(x, y, z);
                    }
                }
            },
            'Ethereal Loom': {
                type: 'map',
                defaults: { a: 2.1, b: -1.2, c: 1.5 },
                ranges: { a: [-3, 3, 0.01], b: [-3, 3, 0.01], c: [-3, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let nx = Math.sin(p.a * y) * Math.sin(p.b * z) + Math.cos(p.c * x);
                        let ny = Math.sin(p.b * z) * Math.sin(p.c * x) + Math.cos(p.a * y);
                        let nz = Math.sin(p.c * x) * Math.sin(p.a * y) + Math.cos(p.b * z);
                        x = nx; y = ny; z = nz;
                        positions.push(x, y, z);
                    }
                }
            },
            'Chrono Core': {
                type: 'map',
                defaults: { a: 2.5, b: 1.47, c: 0.5, d: 0.1 },
                ranges: { a: [0.1, 3, 0.01], b: [0.1, 3, 0.01], c: [0.1, 3, 0.01], d: [0.1, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let r = Math.sqrt(x*x + y*y + z*z);
                        let nx = Math.sin(p.a * y) + p.b * Math.cos(r);
                        let ny = Math.sin(p.c * z) + p.d * Math.sin(r);
                        let nz = Math.sin(p.a * x) + Math.cos(p.b * r);
                        x = nx; y = ny; z = nz;
                        positions.push(x, y, z);
                    }
                }
            },
            'Crystalline Spire': {
                type: 'ode',
                defaults: { a: 1.75, dt: 0.01 },
                ranges: { a: [1.0, 2.0, 0.01], dt: [0.001, 0.05, 0.001] },
                generate: (p, positions) => {
                    let x = 1.0, y = 0.0, z = 0.0;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let dx = (-p.a * x - 4 * y - 4 * z - y * y) * p.dt;
                        let dy = (-p.a * y - 4 * z - 4 * x - z * z) * p.dt;
                        let dz = (-p.a * z - 4 * x - 4 * y - x * x) * p.dt;
                        x += dx; y += dy; z += dz;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 0.0; z = 0.0; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Void Dragon': {
                type: 'ode',
                defaults: { a: 40.0, b: 3.0, c: 28.0, dt: 0.002 },
                ranges: { a: [10.0, 60.0, 0.1], b: [1.0, 10.0, 0.1], c: [10.0, 50.0, 0.1], dt: [0.001, 0.01, 0.001] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.5, z = -0.6;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let dx = (p.a * (y - x)) * p.dt;
                        let dy = ((p.c - p.a) * x - x * z + p.c * y) * p.dt;
                        let dz = (x * y - p.b * z) * p.dt;
                        x += dx; y += dy; z += dz;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 0.1; y = 0.5; z = -0.6; }
                        positions.push(x, y, z);
                    }
                }
            },
            'Astral Web': {
                type: 'map',
                defaults: { a: 1.1, b: 2.2, c: 1.5, d: 0.8 },
                ranges: { a: [0.1, 3, 0.01], b: [0.1, 3, 0.01], c: [0.1, 3, 0.01], d: [0.1, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let nx = Math.sin(p.a * (y - z)) + p.b * Math.cos(x);
                        let ny = Math.sin(p.c * (z - x)) + p.d * Math.cos(y);
                        let nz = Math.sin(p.a * (x - y)) + p.b * Math.cos(z);
                        x = nx; y = ny; z = nz;
                        positions.push(x, y, z);
                    }
                }
            },
            'Hyperborean Snowflake': {
                type: 'map',
                defaults: { a: 1.5, b: 1.2, c: 1.8, d: 0.5 },
                ranges: { a: [0.1, 3, 0.01], b: [0.1, 3, 0.01], c: [0.1, 3, 0.01], d: [0.1, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let r = Math.sqrt(x*x + y*y + z*z);
                        let nx = Math.cos(p.a * r) * x - Math.sin(p.b * r) * y + p.c * Math.sin(z);
                        let ny = Math.sin(p.a * r) * x + Math.cos(p.b * r) * y + p.c * Math.sin(x);
                        let nz = p.d * Math.cos(r) + Math.sin(y);
                        let f = 1.0 / (1.0 + r*0.05); // Trap scaling
                        x = nx*f; y = ny*f; z = nz*f;
                        positions.push(x, y, z);
                    }
                }
            },
            'Aetheric Crown': {
                type: 'map',
                defaults: { a: 1.2, b: 2.1, c: 1.4, d: 1.5 },
                ranges: { a: [0.1, 3, 0.01], b: [0.1, 3, 0.01], c: [0.1, 3, 0.01], d: [0.1, 3, 0.01] },
                generate: (p, positions) => {
                    let x = 0.1, y = 0.1, z = 0.1;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let nx = Math.cos(p.a * y) + Math.sin(p.b * z) - Math.cos(p.c * x);
                        let ny = Math.cos(p.d * z) + Math.sin(p.a * x) - Math.cos(p.b * y);
                        let nz = Math.cos(p.c * x) + Math.sin(p.d * y) - Math.cos(p.a * z);
                        x = nx; y = ny; z = nz;
                        positions.push(x, y, z);
                    }
                }
            },
            'Plasma Coil': {
                type: 'ode',
                defaults: { s: 20.0, v: 4.272, dt: 0.005 },
                ranges: { s: [1.0, 20.0, 0.1], v: [1.0, 10.0, 0.001], dt: [0.001, 0.02, 0.001] },
                generate: (p, positions) => {
                    let x = 1.0, y = 0.0, z = 0.0;
                    for(let i = 0; i < state.pointsCount; i++) {
                        let dx = (-p.s * (x + y)) * p.dt;
                        let dy = (-y - p.s * x * z) * p.dt;
                        let dz = (p.s * x * y + p.v) * p.dt;
                        x += dx; y += dy; z += dz;
                        if(isNaN(x) || Math.abs(x) > 1000) { x = 1.0; y = 0.0; z = 0.0; }
                        positions.push(x, y, z);
                    }
                }
            }
        };

        // --- HELPER FUNCTIONS ---
        function createCircleTexture() {
            // Create a canvas to draw the circular particle texture
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            // Draw a circle with a slight soft edge for a glowing effect
            const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.8, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 64, 64);
            
            return new THREE.CanvasTexture(canvas);
        }

        // --- INITIALIZATION ---
        function init() {
            const container = document.getElementById('canvas-container');

            // 1. Scene setup
            scene = new THREE.Scene();
            scene.fog = new THREE.FogExp2(isLightTheme() ? FOG_LIGHT : FOG_DARK, 0.015);

            // 2. Camera setup
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 10, 30);

            // 3. Renderer setup
            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Performance optimization
            container.appendChild(renderer.domElement);

            // 4. Controls setup
            controls = new OrbitControls(camera, renderer.domElement);
            controls.enableDamping = true;
            controls.dampingFactor = 0.05;
            controls.autoRotate = false; // We will handle manual rotation
            controls.enableZoom = false; // Let wheel events bubble so page scroll works
            controls.enablePan = false;

            // 5. Geometry and Material setup
            geometry = new THREE.BufferGeometry();
            material = new THREE.PointsMaterial({
                size: state.pointSize,
                vertexColors: true,
                transparent: true,
                opacity: state.opacity,
                map: createCircleTexture(), // Apply the circle texture
                alphaTest: 0.01,            // Discard completely transparent pixels
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            particles = new THREE.Points(geometry, material);
            scene.add(particles);

            // 6. Setup GUI & generate initial fractal
            setupGUI();
            window.addEventListener('resize', onWindowResize);
            if (!_cfg.disableHover) {
                window.addEventListener('mousemove', (e) => {
                    mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
                    mouseTarget.y = -(e.clientY / window.innerHeight) * 2 + 1;
                });
            }

            // Start animation loop
            animate();
        }

        // --- FRACTAL GENERATION LOGIC ---
        /* ── Theme support ──────────────────────────────────────────────────
           A WebGL scene cannot read CSS custom properties, so it listens for
           the sds-themechange event that assets/standard-site-nav.js fires and
           re-derives its palette here.

           Light mode is the "blueprint" treatment: each page's configured
           accent colour is pushed toward ink — heavily darkened and partly
           desaturated — because the saturated neons that read well on black
           (apps.html ships #2bff00 / #ff2424 / #002aff) turn garish and
           low-contrast on paper. Fog switches from near-black to the page
           ground so distant particles fade into the surface instead of
           punching a dark hole in it.
           ──────────────────────────────────────────────────────────────────── */
        const FOG_DARK  = 0x020205;
        const FOG_LIGHT = 0xf4f2ee;

        function isLightTheme() {
            return document.documentElement.getAttribute('data-theme') === 'light';
        }

        // Darken + desaturate toward ink. Keeps enough of the source hue that
        // each page still reads as "its" colour.
        function inkify(hex) {
            const c = new THREE.Color(hex);
            const hsl = { h: 0, s: 0, l: 0 };
            c.getHSL(hsl);
            c.setHSL(hsl.h, Math.min(hsl.s, 0.55), Math.min(hsl.l * 0.32, 0.28));
            return c;
        }

        function themedColor(hex) {
            return isLightTheme() ? inkify(hex) : new THREE.Color(hex);
        }

        function applyThemeToScene() {
            if (scene && scene.fog) {
                scene.fog.color.setHex(isLightTheme() ? FOG_LIGHT : FOG_DARK);
            }
        }

        window.addEventListener('sds-themechange', function () {
            applyThemeToScene();
            // Particle colours are baked into the geometry's colour attribute,
            // so the palette only changes on a rebuild.
            if (typeof updateFractal === 'function' && geometry) updateFractal();
        });

        function updateFractal() {
            const alg = algorithms[state.algorithm];
            const rawPositions = [];
            const colors = [];

            // Execute specific algorithm math
            alg.generate(state.params, rawPositions);

            // Ensure we handle cases where positions might be empty
            if(rawPositions.length === 0) return;

            const actualCount = rawPositions.length / 3;

            // Calculate exact mathematical centroid
            currentCentroid.set(0, 0, 0);
            for(let i = 0; i < rawPositions.length; i += 3) {
                currentCentroid.x += rawPositions[i];
                currentCentroid.y += rawPositions[i+1];
                currentCentroid.z += rawPositions[i+2];
            }
            currentCentroid.divideScalar(actualCount);

            // Find max distance from centroid for scaling
            let maxDist = 0;
            for(let i = 0; i < rawPositions.length; i += 3) {
                let dx = rawPositions[i] - currentCentroid.x;
                let dy = rawPositions[i+1] - currentCentroid.y;
                let dz = rawPositions[i+2] - currentCentroid.z;
                let d = Math.sqrt(dx*dx + dy*dy + dz*dz);
                if(d > maxDist) maxDist = d;
            }

            currentScaleFactor = 15.0 / (maxDist || 1.0);
            
            // Pre-calculate the aligned and scaled static positions
            alignedPositions = new Float32Array(rawPositions.length);
            const matrix = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(state.alignX, state.alignY, 0, 'XYZ'));
            const m = matrix.elements;

            // Prepare colors
            const c1 = themedColor(state.color1);
            const c2 = themedColor(state.color2);
            const c3 = themedColor(state.color3);

            for(let i = 0; i < rawPositions.length; i += 3) {
                // Apply scaling and geometry alignment
                let bx = (rawPositions[i] - currentCentroid.x) * currentScaleFactor;
                let by = (rawPositions[i+1] - currentCentroid.y) * currentScaleFactor;
                let bz = (rawPositions[i+2] - currentCentroid.z) * currentScaleFactor;

                alignedPositions[i]   = m[0] * bx + m[4] * by + m[8] * bz;
                alignedPositions[i+1] = m[1] * bx + m[5] * by + m[9] * bz;
                alignedPositions[i+2] = m[2] * bx + m[6] * by + m[10] * bz;

                // Color calculation based on structural properties
                let distNorm = Math.sqrt(bx*bx + by*by + bz*bz) / 15.0;
                let timeNorm = (i / 3) / actualCount;
                
                // Blend them for a rich aesthetic
                let t = (distNorm * 0.4 + timeNorm * 0.6); 
                t = Math.max(0, Math.min(1, t)); // clamp 0-1

                let col = new THREE.Color();
                if(t < 0.5) {
                    col.copy(c1).lerp(c2, t * 2.0);
                } else {
                    col.copy(c2).lerp(c3, (t - 0.5) * 2.0);
                }
                colors.push(col.r, col.g, col.b);
            }

            // Update BufferGeometry with a copy of alignedPositions
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(alignedPositions), 3));
            geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
            
            geometry.attributes.position.needsUpdate = true;
            geometry.attributes.color.needsUpdate = true;
        }

        // --- CUSTOM ALGORITHM DROPDOWN ---
        // Replaces the native <select> so the list always opens downward on screen
        function patchAlgorithmController() {
            const algRow = Array.from(gui.domElement.querySelectorAll('.controller')).find(el => {
                const lbl = el.querySelector('.name');
                return lbl && lbl.textContent.trim() === 'Algorithm';
            });
            if (!algRow) return;
            const select = algRow.querySelector('select');
            if (!select) return;

            if (!document.getElementById('fcs-style')) {
                const s = document.createElement('style');
                s.id = 'fcs-style';
                s.textContent = `
                    .fcs-btn{width:100%;background:#1a1a22;color:#ccc;border:1px solid #3a3a50;
                        padding:2px 6px;cursor:pointer;font-family:inherit;font-size:11px;
                        text-align:left;display:flex;justify-content:space-between;align-items:center;
                        box-sizing:border-box;}
                    .fcs-btn:hover{background:#22222e;color:#fff;}
                    .fcs-btn::after{content:'▾';opacity:0.6;margin-left:4px;flex-shrink:0;}
                    .fcs-list{position:fixed;z-index:999999;background:#1a1a22;border:1px solid #444;
                        max-height:220px;overflow-y:auto;box-shadow:0 6px 24px rgba(0,0,0,0.85);
                        font-family:inherit;font-size:11px;}
                    .fcs-list button{display:block;width:100%;background:none;color:#bbb;
                        border:none;border-bottom:1px solid #22222a;padding:4px 10px;
                        cursor:pointer;text-align:left;white-space:nowrap;}
                    .fcs-list button:hover{background:#252535;color:#fff;}
                    .fcs-list button.fcs-active{color:#0ff;}
                `;
                document.head.appendChild(s);
            }

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'fcs-btn';
            btn.textContent = select.value;

            const list = document.createElement('div');
            list.className = 'fcs-list';
            list.hidden = true;
            document.body.appendChild(list);

            Object.keys(algorithms).forEach(name => {
                const item = document.createElement('button');
                item.type = 'button';
                item.textContent = name;
                if (name === select.value) item.classList.add('fcs-active');
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    select.value = name;
                    select.dispatchEvent(new Event('change', { bubbles: true }));
                    btn.textContent = name;
                    list.querySelectorAll('button').forEach(b => b.classList.remove('fcs-active'));
                    item.classList.add('fcs-active');
                    list.hidden = true;
                });
                list.appendChild(item);
            });

            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (!list.hidden) { list.hidden = true; return; }
                const rect = btn.getBoundingClientRect();
                const listW = Math.max(rect.width, 180);
                const rawLeft = rect.left;
                const clampedLeft = Math.max(4, Math.min(rawLeft, window.innerWidth - listW - 4));
                list.style.top = (rect.bottom + 2) + 'px';
                list.style.left = clampedLeft + 'px';
                list.style.width = listW + 'px';
                list.hidden = false;
                const active = list.querySelector('.fcs-active');
                if (active) setTimeout(() => active.scrollIntoView({ block: 'nearest' }), 0);
            });

            document.addEventListener('click', () => { list.hidden = true; });

            select.addEventListener('change', () => {
                btn.textContent = select.value;
                list.querySelectorAll('button').forEach(b => {
                    b.classList.toggle('fcs-active', b.textContent === select.value);
                });
            });

            select.style.display = 'none';
            select.parentElement.appendChild(btn);
        }

        // --- GUI SETUP ---
        function setupGUI() {
            gui = new GUI({ title: 'Algorithm Settings' });

            // Main settings
            gui.add(state, 'algorithm', Object.keys(algorithms))
               .name('Algorithm')
               .onChange(onAlgorithmChange);

            const styleFolder = gui.addFolder('Styling & Colors');
            styleFolder.addColor(state, 'color1').name('Core Color').onChange(updateFractal);
            styleFolder.addColor(state, 'color2').name('Mid Color').onChange(updateFractal);
            styleFolder.addColor(state, 'color3').name('Edge Color').onChange(updateFractal);
            
            styleFolder.add(state, 'pointsCount', 10000, 300000, 5000)
                       .name('Point Count')
                       .onChange(updateFractal);
            styleFolder.add(state, 'pointSize', 0.01, 0.2, 0.001)
                       .name('Point Size')
                       .onChange(v => material.size = v);
            styleFolder.add(state, 'opacity', 0.05, 1.0, 0.01)
                       .name('Opacity')
                       .onChange(v => material.opacity = v);
            styleFolder.add(state, 'alignX', -Math.PI, Math.PI, 0.01)
                       .name('Align X')
                       .onChange(updateFractal);
            styleFolder.add(state, 'alignY', -Math.PI, Math.PI, 0.01)
                       .name('Align Y')
                       .onChange(updateFractal);
            styleFolder.add(state, 'rotationSpeedX', -0.05, 0.05, 0.0001)
                       .name('Rotation X');
            styleFolder.add(state, 'rotationSpeedY', -0.05, 0.05, 0.0001)
                       .name('Rotation Y');
            styleFolder.add(state, 'animatePoints')
                       .name('Animate Points');

            // Dynamic parameter folder
            paramsFolder = gui.addFolder('Specific Parameters');
            
            // Initialize first algorithm
            onAlgorithmChange();
            gui.hide();
            window._fractalGUI = gui;
            // Patch native select → custom always-downward dropdown
            setTimeout(patchAlgorithmController, 0);
        }

        // Triggered when selecting a different algorithm
        function onAlgorithmChange() {
            // Remove old specific parameters from GUI
            const controllers = paramsFolder.controllers.slice();
            controllers.forEach(c => c.destroy());

            const alg = algorithms[state.algorithm];
            
            // Deep copy default parameters
            state.params = JSON.parse(JSON.stringify(alg.defaults));

            // Create new GUI sliders for specific parameters
            for(let key in alg.ranges) {
                const range = alg.ranges[key];
                paramsFolder.add(state.params, key, range[0], range[1], range[2] || 0.01)
                            .name(key.charAt(0).toUpperCase() + key.slice(1))
                            .onChange(updateFractal);
            }
            
            // Re-generate visual
            updateFractal();
        }

        // --- EVENT LISTENERS & ANIMATION LOOP ---
        // Resize is debounced and skips mobile height-only changes: collapsing
        // browser chrome fires height-only resizes mid-scroll, and each
        // renderer.setSize() reallocates the WebGL buffer — the background
        // visibly stuttered on phones. Same treatment as the homepage Nova
        // background (index.html, shouldResizeNova).
        let lastRenderW = window.innerWidth;
        let lastRenderH = window.innerHeight;
        let lastDpr = Math.min(window.devicePixelRatio || 1, 2);
        let resizeTimer;
        function onWindowResize() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                const nextW = window.innerWidth;
                const nextH = window.innerHeight;
                const nextDpr = Math.min(window.devicePixelRatio || 1, 2);
                const widthChanged = Math.abs(nextW - lastRenderW) > 2;
                const heightChanged = Math.abs(nextH - lastRenderH) > 2;
                const dprChanged = Math.abs(nextDpr - lastDpr) > 0.01;
                const mobileViewport = window.matchMedia('(max-width: 879.98px)').matches;
                if (mobileViewport && heightChanged && !widthChanged && !dprChanged) return;
                if (!widthChanged && !heightChanged && !dprChanged) return;
                lastRenderW = nextW;
                lastRenderH = nextH;
                lastDpr = nextDpr;
                camera.aspect = nextW / nextH;
                camera.updateProjectionMatrix();
                renderer.setPixelRatio(lastDpr);
                renderer.setSize(nextW, nextH);
            }, 180);
        }

        function animate() {
            requestAnimationFrame(animate);

            if (state.animatePoints && alignedPositions) {
                wasAnimating = true;
                const time = performance.now() * 0.001;
                const positions = geometry.attributes.position.array;
                const len = alignedPositions.length;
                const type = algorithms[state.algorithm].type;
                const pointCount = len / 3;

                if (type === 'ode') {
                    // Flow animation: distinct snakes (segments) travelling along the track
                    const flowSpeed = Math.floor(pointCount * 0.05); // Cover 5% of track per second
                    let offset = Math.floor(time * flowSpeed);
                    
                    const dashLength = Math.floor(pointCount * 0.015); // 1.5% of track is a dash
                    const gapLength = Math.floor(pointCount * 0.03);   // 3% is gap
                    const patternLength = dashLength + gapLength;

                    for (let i = 0; i < len; i += 3) {
                        let ptIdx = i / 3;
                        
                        // Create moving gaps and segments
                        if ((ptIdx % patternLength) < dashLength) {
                            let trackIdx = (ptIdx + offset) % pointCount;
                            let srcI = trackIdx * 3;
                            positions[i]   = alignedPositions[srcI];
                            positions[i+1] = alignedPositions[srcI+1];
                            positions[i+2] = alignedPositions[srcI+2];
                        } else {
                            // Hide points by moving them far off-camera
                            positions[i]   = 999999;
                            positions[i+1] = 999999;
                            positions[i+2] = 999999;
                        }
                    }
                } else if (type === 'map') {
                    // Map animation: Smooth, gentle spatial drift (no flickering)
                    const speed = 0.4;
                    const amp = 0.25;

                    for (let i = 0; i < len; i += 3) {
                        let bx = alignedPositions[i];
                        let by = alignedPositions[i+1];
                        let bz = alignedPositions[i+2];

                        // Spatially coherent displacement to maintain the organic structure
                        positions[i]   = bx + Math.sin(time * speed + by) * amp;
                        positions[i+1] = by + Math.cos(time * speed * 1.1 + bz) * amp;
                        positions[i+2] = bz + Math.sin(time * speed * 0.9 + bx) * amp;
                    }
                }
                geometry.attributes.position.needsUpdate = true;
                
            } else if (wasAnimating && alignedPositions) {
                // Restore static positions when animation is disabled
                const positions = geometry.attributes.position.array;
                for(let i = 0; i < positions.length; i++) {
                    positions[i] = alignedPositions[i];
                }
                geometry.attributes.position.needsUpdate = true;
                wasAnimating = false;
            }

            // Continuous auto-rotation
            if(particles) {
                autoRotOffset += state.rotationSpeedX;
                if (!_cfg.disableHover) {
                    mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * 0.04;
                    mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * 0.04;
                    particles.rotation.y = mouseSmooth.x * 1.5 + autoRotOffset;
                    particles.rotation.x = mouseSmooth.y * 0.6;
                } else {
                    particles.rotation.y = autoRotOffset;
                }
            }

            controls.update();
            renderer.render(scene, camera);
        }

        // Initialize application
        init();