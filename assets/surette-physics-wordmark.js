(() => {
  const MOBILE_QUERY = "(max-width: 767px)";
  const root = document.querySelector(".sds-physics-wordmark:not(.sds-physics-wordmark--sub)");
  const line = root?.querySelector(".sds-physics-wordmark__line");
  // "EVERYTHING FALLS APART" (and its localized variants) opt out of physics
  // entirely: they render as plain static text rather than falling/interactive
  // letters. They are excluded from the physics contexts below, and marked
  // visible up front so the apps loader's is-visible gate is still satisfied.
  const STATIC_SUB_WORDS = new Set(["falls-apart", "todo-falla"]);
  const collectSubRoots = () => [...document.querySelectorAll(".sds-physics-wordmark--sub")]
    .filter((el) => !STATIC_SUB_WORDS.has(el.getAttribute("data-word")));
  const subRoots = collectSubRoots();
  document.querySelectorAll(".sds-physics-wordmark--sub").forEach((el) => {
    if (STATIC_SUB_WORDS.has(el.getAttribute("data-word"))) {
      el.classList.add("is-visible", "is-static");
    }
  });
  const wordmark = document.querySelector(".sds-wordmark");
  const catalogSection = document.querySelector(".sds-hero + section");
  const FALL_LAYER_ID = "sds-physics-fall-layer";
  if (!root || !line) return;

  let wordmarkContexts = [
    { root, line, withIntro: true },
    ...subRoots.map((subRoot) => ({
      root: subRoot,
      line: subRoot.querySelector(".sds-physics-wordmark__line"),
      withIntro: false
    })).filter((ctx) => ctx.line)
  ];

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const HOLD_MS = 1350;
  const INTRO_FIRST_PAUSE_MS = 480;
  const INTRO_FILL_STEP_MS = 260;
  const INTRO_FILL_PAUSE_MS = 220;
  const INTRO_FILL_SETTLE_MS = 140;
  const INTRO_COLOR_MIX_LEAD = 1.18;
  const INTRO_FALL_MAX_MS = 2800;
  const INTRO_SETTLE_RETURN_MS = 1200;
  const INTRO_LETTER_MAX_MS = 9000;
  const OFFSCREEN_PAD = 180;
  const REMATERIALIZE_DELAY_MS = 380;
  const SETTLE_RETURN_MS = 2600;
  const REMATERIALIZE_SETTLE_MIN_MS = 800;
  const REMATERIALIZE_MAX_WAIT_MS = 4500;
  const REMATERIALIZE_FORCE_RETURN_DURATION = 0.62;
  const REMATERIALIZE_FORCE_SPAWN_DURATION = 0.78;
  const REST_VELOCITY = 0.12;
  const REST_ANGULAR = 0.015;
  const GROUP_SETTLE_SPEED = 1.28;
  const GROUP_SETTLE_ANGULAR = 0.11;
  const SETTLE_ACTIVE_SPEED = 2.75;
  const SETTLE_ACTIVE_ANGULAR = 0.34;
  const SETTLE_SPEED_WINDOW_MS = 520;
  const MOBILE_GROUP_SETTLE_SPEED = 1.48;
  const MOBILE_SETTLE_ACTIVE_SPEED = 3.05;
  const MOBILE_SETTLE_ACTIVE_ANGULAR = 0.38;
  const MOBILE_ACCEL_SETTLE_DAMP = 0.12;

  const physicsEnabled = !prefersReducedMotion;
  let userPhysicsDisabled = false;
  const frozenBodyIds = new Set();
  const isPhysicsInteractive = () => physicsEnabled && !userPhysicsDisabled;
  const PHYSICS_PREF_KEY = "sds:physicsEnabled";
  const MOBILE_MARK_ID = "sds-physics-mobile-mark";
  const MOBILE_MARK_SELECTOR = ".sds-hero__brand-mark";
  const MOBILE_MARK_SPACER_CLASS = "sds-hero__brand-mark-spacer";
  const MOBILE_MARK_COLLAPSE_DELAY_MS = 880;
  const MOBILE_MARK_COLLAPSE_DURATION = 1.08;
  const BRAND_MARK_HOME_RETURN_DURATION = 0.42;
  const MOBILE_MARK_LABEL = "mobile-brand-mark";
  const DESKTOP_MARK_ID = "sds-physics-desktop-mark";
  const DESKTOP_MARK_LABEL = "desktop-brand-mark";
  const DESKTOP_MARK_WALL_RESTITUTION_HIGH = 0.968;
  const DESKTOP_MARK_WALL_RESTITUTION_LOW = 0.948;
  const DESKTOP_MARK_LAUNCH_WALL_RESTITUTION_HIGH = 0.964;
  const DESKTOP_MARK_FLOOR_RESTITUTION_OFFSET = 0.06;
  const DESKTOP_MARK_FLOOR_IMPULSE_SCALE = 0.78;
  const DESKTOP_MARK_FLOOR_BOUNCE_DECAY_EXTRA = 0.72;
  const DESKTOP_MARK_FLOOR_MIN_REBOUND_VELOCITY = 1.05;
  const DESKTOP_MARK_FLOOR_HORIZONTAL_DAMPING = 0.82;
  const DESKTOP_MARK_FLOOR_SETTLE_FRICTION_AIR = 0.024;
  const DESKTOP_MARK_FLOOR_SETTLE_FRICTION_AIR_SLOW = 0.038;
  const DESKTOP_MARK_IMPULSE_MULT_HIGH = 1.1;
  const DESKTOP_MARK_IMPULSE_MULT_LOW = 1.02;
  const DESKTOP_MARK_LAUNCH_WALL_BOOST_HIGH = 1.045;
  const DESKTOP_MARK_LAUNCH_WALL_BOOST_LOW = 1.008;
  const DESKTOP_MARK_BOUNCE_DECAY_PER_HIT = 0.82;
  const DESKTOP_MARK_BOUNCE_DECAY_PER_HIT_SETTLING = 0.68;
  const DESKTOP_MARK_SETTLE_SPEED_THRESHOLD = 4.8;
  const DESKTOP_MARK_SETTLE_FRICTION_AIR = 0.018;
  const DESKTOP_MARK_SETTLE_FRICTION_AIR_SLOW = 0.028;
  const DESKTOP_MARK_LAUNCH_VELOCITY_Y = -18.5;
  const DESKTOP_MARK_LAUNCH_VELOCITY_X = 8.2;
  const DESKTOP_MARK_LAUNCH_CLICK_SPEED = 5.8;
  const DESKTOP_MARK_LAUNCH_CLICK_RESET_SPEED = 8.2;
  const DESKTOP_MARK_LAUNCH_CLICK_SPEED_INSTANT = 3.4;
  const DESKTOP_MARK_LAUNCH_CLICK_ANGULAR = 0.26;
  const DESKTOP_MARK_LAUNCH_CLICK_RESET_ANGULAR = 0.34;
  const DESKTOP_MARK_LAUNCH_CLICK_FRAMES = 2;
  const DESKTOP_MARK_LAUNCH_BOUNCE_REFILL = 0.32;
  const DESKTOP_MARK_LAUNCH_ARM_DELAY_MS = 280;
  const DESKTOP_MARK_LAUNCH_LAYER_Z = "85";
  const DESKTOP_MARK_UPWARD_PASS_VY = -0.02;
  const WORDMARK_LETTER_KNOCK_MIN_SPEED = 0.45;
  // Main idle knock floor: 0.56 sits between subline parity (0.45) and harsh 0.68 tuning.
  const MAIN_WORDMARK_KNOCK_MIN_SPEED = 0.56;
  const MOBILE_MARK_FLOOR_RESTITUTION = 0.84;
  const MOBILE_MARK_SCROLL_RELEASE_BANNER_PAD = 6;
  const MOBILE_MENU_BARRIER_LABEL = "mobile-menu-barrier";
  const MOBILE_MENU_BARRIER_THICKNESS = 14;
  const MOBILE_MENU_BARRIER_PAD = 6;
  const MOBILE_MENU_BARRIER_FALLBACK_OFFSET = 80;
  const MOBILE_MARK_SCROLL_FLOOR_FALL_VY = 2.6;
  const MOBILE_MARK_SCROLL_FLOOR_SETTLE_PAD = 14;
  const MOBILE_MARK_SCROLL_KNOCK_COOLDOWN_MS = 480;
  const MOBILE_MARK_SCROLL_FLOOR_SNAP_PX = 26;
  const MOBILE_MARK_SCROLL_FLOOR_SETTLE_VY = 1.15;
  const GALLERY_FLOOR_SPAN_INSET = 4;
  const BANNER_CEILING_LABEL = "banner-ceiling";
  const BANNER_CEILING_THICKNESS = 14;
  const BANNER_CEILING_FALLBACK_Y = 64;
  const VIEW_WALL_LABELS = new Set([
    "view-top",
    "view-bottom",
    "view-left",
    "view-right",
    BANNER_CEILING_LABEL
  ]);
  const BRAND_MARK_UPWARD_PASS_EXEMPT_LABELS = new Set([
    BANNER_CEILING_LABEL,
    "view-left",
    "view-right"
  ]);
  const MOBILE_BRAND_MARK_UPWARD_PASS_EXEMPT_LABELS = new Set([
    ...BRAND_MARK_UPWARD_PASS_EXEMPT_LABELS,
    MOBILE_MENU_BARRIER_LABEL
  ]);
  const MOBILE_HERO_ZONE_PAD = 20;
  const MOBILE_MAIN_LETTER_KNOCK_COLLIDER_Y_OFFSET = 20;
  const GALLERY_FLOOR_LABEL = "gallery-floor";
  const INTRO_RGB_COLORS = ["#00F0FF", "#39FF14", "#FF2D55", "#7000FF"];

  const pickIntroRgbColor = () => (
    INTRO_RGB_COLORS[Math.floor(Math.random() * INTRO_RGB_COLORS.length)]
  );
  const BRAND_MARK_FLOOR_LABELS = new Set(["view-bottom", GALLERY_FLOOR_LABEL]);
  const BRAND_MARK_LABELS = new Set([MOBILE_MARK_LABEL, DESKTOP_MARK_LABEL]);
  const COLLISION_CATEGORY_MAIN_WORDMARK = 0x0002;
  const COLLISION_CATEGORY_SUBLINE_WORDMARK = 0x0004;
  const COLLISION_CATEGORY_BRAND_MARK = 0x0008;
  const COLLISION_CATEGORY_ENVIRONMENT = 0x0010;
  const COLLISION_MASK_ALL = 0xFFFF;
  const WORDMARK_LETTER_BODY_LABEL_RE = /^surette-char-\d+$/;
  const WORDMARK_LETTER_COLLIDER_LABEL_RE = /^surette-char-collider-(\d+)$/;
  const WORDMARK_LETTER_KNOCK_DEPTH = 0.28;
  // Main knock depth: slightly below 0.36 so collider overlap feels crisp without dead misses.
  const MAIN_WORDMARK_KNOCK_DEPTH = 0.32;
  const WORDMARK_LETTER_KNOCK_COOLDOWN_MS = 220;
  // Main knock cooldown: 280ms — shorter than 340, still above subline 220.
  const MAIN_WORDMARK_KNOCK_COOLDOWN_MS = 280;
  const LETTER_REMARERIALIZE_ENGAGE_COOLDOWN_MS = 620;
  const LETTER_HOVER_ENGAGE_DEBOUNCE_MS = 300;
  // Main hover debounce: 360ms pairs with 620ms remat cooldown without double-locking engage.
  const MAIN_LETTER_HOVER_ENGAGE_DEBOUNCE_MS = 360;
  const LETTER_HOVER_MOTION_THRESHOLD_PX = 4;
  // Main hover motion: 5.5px — between subline 4px and stiff 7px re-engage gate.
  const MAIN_LETTER_HOVER_MOTION_THRESHOLD_PX = 5.5;
  const MAIN_KNOCK_IMPULSE_BRAND_MARK = 1.55;
  const MAIN_KNOCK_IMPULSE_SUBLINE = 1.38;
  const BRAND_MARK_MAIN_KNOCK_ENTRY_SPEED_RATIO = 0.52;
  // Main overlap pad: 1.02 — looser than 0.92 so brand/subline hits register reliably.
  const MAIN_WORDMARK_KNOCK_OVERLAP_PAD = 1.02;
  const RETURN_TWEEN_EASE = "power2.inOut";
  const SUBLINE_COLLIDER_PAD = 1.22;
  const WORDMARK_LETTER_KNOCK_OVERLAP_PAD = 1.1;
  const WORDMARK_LETTER_MENU_BARRIER_LABELS = new Set([
    BANNER_CEILING_LABEL,
    "view-top"
  ]);

  const DESKTOP_MARK_PHYSICS = {
    friction: 0.003,
    frictionStatic: 0.008,
    frictionAir: 0.005,
    restitution: 0.958,
    density: 0.00058
  };

  const DESKTOP_MARK_BODY_RESTITUTION_HIGH = 0.965;
  const DESKTOP_MARK_BODY_RESTITUTION_LOW = 0.942;

  const lerpDesktopMark = (low, high, t) => low + (high - low) * t;

  const getDesktopMarkBounceIntensity = () => (
    Math.max(0, Math.min(1, desktopBrandMark?.bounceIntensity ?? 0))
  );

  const syncDesktopMarkBodyRestitution = () => {
    if (!desktopBrandMark?.body) return;
    const intensity = getDesktopMarkBounceIntensity();
    desktopBrandMark.body.restitution = lerpDesktopMark(
      DESKTOP_MARK_BODY_RESTITUTION_LOW,
      DESKTOP_MARK_BODY_RESTITUTION_HIGH,
      intensity
    );
  };

  const getDesktopMarkSurfaceRestitution = () => {
    const intensity = getDesktopMarkBounceIntensity();
    const high = desktopBrandMark?.screenBounceMode
      ? DESKTOP_MARK_LAUNCH_WALL_RESTITUTION_HIGH
      : DESKTOP_MARK_WALL_RESTITUTION_HIGH;
    return lerpDesktopMark(DESKTOP_MARK_WALL_RESTITUTION_LOW, high, intensity);
  };

  const getDesktopMarkFloorRestitution = () => (
    Math.max(0.84, getDesktopMarkSurfaceRestitution() - DESKTOP_MARK_FLOOR_RESTITUTION_OFFSET)
  );

  const getDesktopMarkBodySpeed = () => (
    desktopBrandMark?.body
      ? Math.hypot(desktopBrandMark.body.velocity.x, desktopBrandMark.body.velocity.y)
      : 0
  );

  const getDesktopMarkBounceDecayPerHit = () => {
    const speed = getDesktopMarkBodySpeed();
    if (speed < DESKTOP_MARK_SETTLE_SPEED_THRESHOLD) {
      const settleT = 1 - speed / DESKTOP_MARK_SETTLE_SPEED_THRESHOLD;
      return lerpDesktopMark(
        DESKTOP_MARK_BOUNCE_DECAY_PER_HIT,
        DESKTOP_MARK_BOUNCE_DECAY_PER_HIT_SETTLING,
        settleT
      );
    }
    return DESKTOP_MARK_BOUNCE_DECAY_PER_HIT;
  };

  const decayDesktopMarkBounceIntensity = () => {
    if (!desktopBrandMark) return;
    desktopBrandMark.bounceIntensity = Math.max(
      0,
      getDesktopMarkBounceIntensity() * getDesktopMarkBounceDecayPerHit()
    );
    syncDesktopMarkBodyRestitution();
    refreshEnvironmentColliders();
  };

  if (!physicsEnabled) {
    wordmarkContexts.forEach((ctx) => ctx.root.classList.add("is-static"));
    if (window.gsap) {
      window.gsap.from(line, { opacity: 0, y: 10, duration: 0.75, ease: "power2.out" });
    }
    return;
  }

  if (!window.gsap || !window.SplitType || !window.Matter) {
    wordmarkContexts.forEach((ctx) => ctx.root.classList.add("is-static"));
    return;
  }

  if (window.__sdsPhysicsWordmarkBooted) return;
  window.__sdsPhysicsWordmarkBooted = true;

  if (window.matchMedia(MOBILE_QUERY).matches) {
    root.classList.add("is-mobile-physics");
  }

  const { Engine, Runner, Bodies, Body, Composite, Events } = window.Matter;
  const gsap = window.gsap;

  let split = null;
  let subSplits = [];
  let engine = null;
  let runner = null;
  let runnerActive = false;
  let pairs = [];
  let environmentBodies = [];
  let rafSync = 0;
  let lowPerformance = false;
  let mobileMark = null;
  let desktopBrandMark = null;
  let desktopBrandMarkReleasing = false;
  let lastDesktopMarkScrollY = 0;
  let lastMobileMarkScrollY = 0;
  let brandMarkScrollBound = false;
  let mobileMarkEarlyReleaseBound = false;
  let mobileMarkEarlyReleaseHandler = null;
  let desktopBrandMarkLetterHitsEnabled = false;
  let desktopMarkLaunchLayerBound = false;
  let mobileMarkLaunchLayerBound = false;
  let mobileMarkLetterHitsEnabled = false;
  let brandMarkCollapseTimer = 0;
  let brandMarkSpacer = null;
  let brandMarkParkingActive = false;
  let physicsDisablePending = false;
  let physicsDisableSession = 0;
  let accelListener = null;
  let accelBound = false;
  let frameBudget = [];
  let afterUpdateHandler = null;
  let collisionHandlerBound = false;
  let refreshCollidersRaf = 0;
  const wordmarkLetterKnockCooldowns = new Map();
  const wordmarkLetterBounceCooldowns = new Map();
  let lastPointerPos = null;
  let pointerMotionTrackerBound = false;
  let pointerMotionHandler = null;
  let resizeHandlerBound = false;
  let pageDestroyed = false;
  let introRunning = false;
  let introComplete = false;
  let introAbortRequested = false;
  const introDelayTimers = new Set();
  let lastBannerKnockScrollY = -1;
  let desktopLaunchPointerHandler = null;
  let desktopLaunchClickHandler = null;
  let mobileLaunchPointerHandler = null;
  let mobileLaunchClickHandler = null;
  let desktopBrandMarkEngageHandler = null;
  let physicsToggleChangeHandler = null;
  const originalLayout = [];

  const LETTER_PHYSICS = {
    friction: 0.006,
    frictionStatic: 0.015,
    frictionAir: 0.011,
    // Main restitution: 0.91 — livelier than 0.86 without subline-level bounce.
    restitution: 0.91,
    density: 0.0007
  };

  const SUBLINE_LETTER_PHYSICS = {
    friction: 0.004,
    frictionStatic: 0.01,
    frictionAir: 0.009,
    restitution: 0.972,
    density: 0.00068
  };

  const SUBLINE_MAX_SPEED = 16;
  const SUBLINE_CALM_SPEED = 7;
  const SUBLINE_HOT_START_RATIO = 0.7;
  const SUBLINE_HOT_RESTITUTION_FLOOR = 0.22;
  const SUBLINE_HOT_FRICTION_AIR = 0.052;
  const SUBLINE_HOT_ANGULAR_DAMP = 0.86;
  const SUBLINE_FLOOR_BOUNCE_LIMIT = 2;
  const SUBLINE_FLOOR_BOUNCE_COOLDOWN_MS = 180;
  const SUBLINE_FLOOR_SPENT_RESTITUTION = 0.25;
  const SUBLINE_FLOOR_SPENT_FRICTION_AIR = 0.048;
  const SUBLINE_FLOOR_MIN_DOWNWARD_VY = 0.2;
  const SUBLINE_FLOOR_LABELS = new Set(["view-bottom", GALLERY_FLOOR_LABEL]);
  const MAIN_LETTER_MAX_SPEED = 11;
  const MAIN_LETTER_INTRO_MAX_SPEED = 8.5;
  const MAIN_LETTER_BOUNCE_COOLDOWN_MS = 110;
  const MAIN_LETTER_IMPACT_SPEED_CAP = 10;
  const MAIN_LETTER_INTRO_IMPACT_SPEED_CAP = 7.5;

  const CARD_PHYSICS = {
    isStatic: true,
    friction: 0.015,
    restitution: 0.9,
    render: { visible: false }
  };

  const BUMP_PHYSICS = {
    isStatic: true,
    friction: 0.003,
    restitution: 0.68,
    render: { visible: false }
  };

  const SUBLINE_LETTER_COLLIDER_PHYSICS = {
    isStatic: true,
    friction: 0.012,
    restitution: 0.96,
    render: { visible: false }
  };

  const BUMP_DOT_RADIUS = 2;

  const getMobilePhysicsActive = () => window.matchMedia(MOBILE_QUERY).matches;
  const getDesktopPhysicsActive = () => !getMobilePhysicsActive();

  const CARD_TOP_THICKNESS = 14;
  const CARD_TOP_INSET = 5;
  const LEAD_BUMP_TARGETS = [
    { word: "Mobile", charOffset: 0 },
    { word: "CRM", charOffset: 0 },
    { word: "operations", charOffset: 0 }
  ];

  const waitForFonts = async () => {
    try {
      await Promise.all([
        document.fonts.load('700 1em "Archivo Expanded"'),
        document.fonts.load('600 11px "JetBrains Mono"')
      ]);
      await document.fonts.ready;
    } catch (error) {
      // Continue with fallback stack.
    }
  };

  const isWhitespaceChar = (char) => !char?.textContent?.trim();

  const resetSystemRowStyles = () => {
    const systemRow = document.querySelector(".sds-wordmark__system");
    if (!systemRow) return;
    systemRow.style.width = "";
    systemRow.style.maxWidth = "";
    systemRow.style.fontSize = "";
  };

  const measureLineBox = (lineEl) => {
    const chars = [...lineEl.querySelectorAll(".char")];
    const hasAbsoluteChars = chars.length > 0
      && chars.every((char) => window.getComputedStyle(char).position === "absolute");

    if (hasAbsoluteChars) {
      const charRects = chars.map((char) => char.getBoundingClientRect());
      const left = Math.min(...charRects.map((rect) => rect.left));
      const right = Math.max(...charRects.map((rect) => rect.right));
      const top = Math.min(...charRects.map((rect) => rect.top));
      const bottom = Math.max(...charRects.map((rect) => rect.bottom));
      return {
        width: Math.ceil(right - left),
        height: Math.max(1, Math.ceil(bottom - top))
      };
    }

    const lineRect = lineEl.getBoundingClientRect();
    return {
      width: Math.ceil(lineRect.width),
      height: Math.max(1, Math.ceil(lineRect.height))
    };
  };

  const measureSplitGhostBox = (lineEl) => {
    const splitText = lineEl?.getAttribute("data-split");
    if (!splitText) return null;

    const styleSource = lineEl.closest(".sds-hero__sub")
      || lineEl.closest(".sds-physics-wordmark--sub")
      || lineEl;
    const computed = window.getComputedStyle(styleSource);
    const probe = document.createElement("span");
    probe.textContent = splitText;
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = [
      "position:absolute",
      "left:-9999px",
      "top:0",
      "visibility:hidden",
      "white-space:nowrap",
      "pointer-events:none",
      "margin:0",
      "padding:0",
      "border:0"
    ].join(";");
    probe.style.fontFamily = computed.fontFamily || '"JetBrains Mono", monospace';
    probe.style.fontSize = computed.fontSize || "11px";
    probe.style.fontWeight = computed.fontWeight || "600";
    probe.style.letterSpacing = computed.letterSpacing || "0.14em";
    probe.style.lineHeight = computed.lineHeight || "1.4";
    probe.style.textTransform = "uppercase";

    document.body.appendChild(probe);
    const rect = probe.getBoundingClientRect();
    probe.remove();

    if (!rect.width) return null;
    return {
      width: Math.ceil(rect.width),
      height: Math.max(1, Math.ceil(rect.height))
    };
  };

  const reserveSublineBox = (ctx) => {
    const styledWidth = parseFloat(ctx.line.style.width);
    const styledHeight = parseFloat(ctx.line.style.minHeight);
    if (styledWidth >= 8 && styledHeight >= 1) {
      return {
        width: Math.ceil(styledWidth),
        height: Math.ceil(styledHeight)
      };
    }

    const measured = measureLineBox(ctx.line);
    const ghost = measureSplitGhostBox(ctx.line);
    if (ghost && ghost.width > measured.width) {
      return {
        width: ghost.width,
        height: Math.max(measured.height, ghost.height)
      };
    }

    return measured;
  };

  const applySublineReservedBox = (ctx, box) => {
    if (!box || box.width < 8) return;

    const arena = ctx.root.querySelector(".sds-physics-wordmark__arena");
    const widthPx = `${box.width}px`;
    const heightPx = `${box.height}px`;

    ctx.line.style.width = widthPx;
    ctx.line.style.minHeight = heightPx;
    ctx.root.style.width = widthPx;
    ctx.root.style.maxWidth = "none";

    if (arena) {
      arena.style.width = widthPx;
      arena.style.minHeight = heightPx;
    }
  };

  const updateWordmarkArena = (ctx = wordmarkContexts[0]) => {
    if (!ctx?.line || !ctx?.root) return;

    const isSubline = ctx.root.classList.contains("sds-physics-wordmark--sub");
    if (isSubline) {
      applySublineReservedBox(ctx, reserveSublineBox(ctx));
      return;
    }

    ctx.line.style.width = "auto";
    ctx.root.style.maxWidth = "100%";

    const lineWidth = Math.ceil(ctx.line.getBoundingClientRect().width);
    if (lineWidth >= 24) {
      ctx.root.style.width = `${lineWidth}px`;
    }

    const arena = ctx.root.querySelector(".sds-physics-wordmark__arena");
    if (arena) {
      arena.style.minHeight = `${Math.ceil(ctx.line.getBoundingClientRect().height)}px`;
    }
  };

  const updateAllWordmarkArenas = () => {
    const systemRow = document.querySelector(".sds-wordmark__system");
    if (systemRow) {
      systemRow.style.width = "";
      systemRow.style.maxWidth = "";
    }
    wordmarkContexts.forEach((ctx) => updateWordmarkArena(ctx));
  };

  const arenaEl = (ctx = wordmarkContexts[0]) => ctx?.root?.querySelector(".sds-physics-wordmark__arena");

  const getFallLayer = () => {
    let layer = document.getElementById(FALL_LAYER_ID);
    if (!layer) {
      layer = document.createElement("div");
      layer.id = FALL_LAYER_ID;
      layer.className = "sds-physics-fall-layer";
      document.body.appendChild(layer);
    }
    return layer;
  };

  const measureCharSlot = (char, lineRect) => {
    const computed = window.getComputedStyle(char);
    const rect = char.getBoundingClientRect();
    const isSpace = isWhitespaceChar(char);
    const width = isSpace
      ? Math.max(rect.width * 0.88, 3)
      : Math.max(rect.width * 0.88, 8);
    const height = isSpace
      ? Math.max(rect.height * 0.88, 6)
      : Math.max(rect.height * 0.88, 8);

    if (computed.position === "absolute" && char.style.left && char.style.top) {
      const left = parseFloat(char.style.left);
      const top = parseFloat(char.style.top);
      if (Number.isFinite(left) && Number.isFinite(top)) {
        return { char, x: left, y: top, width, height, angle: 0 };
      }
    }

    return {
      char,
      x: rect.left - lineRect.left + rect.width * 0.5,
      y: rect.top - lineRect.top + rect.height * 0.5,
      width,
      height,
      angle: 0
    };
  };

  const measurePairsInlineReflow = (lineEl) => {
    const chars = [...lineEl.querySelectorAll(".char")];
    if (!chars.length) return [];

    const snapshots = chars.map((char) => ({
      char,
      position: char.style.position,
      left: char.style.left,
      top: char.style.top,
      transform: char.style.transform,
      margin: char.style.margin
    }));

    chars.forEach((char) => {
      char.style.position = "static";
      char.style.left = "";
      char.style.top = "";
      char.style.transform = "";
      char.style.margin = "0";
    });

    const lineRect = lineEl.getBoundingClientRect();
    const measured = chars.map((char) => measureCharSlot(char, lineRect));

    snapshots.forEach(({ char, position, left, top, transform, margin }) => {
      char.style.position = position;
      char.style.left = left;
      char.style.top = top;
      char.style.transform = transform;
      char.style.margin = margin;
    });

    return measured;
  };

  const measurePairs = (lineEl) => {
    const lineRect = lineEl.getBoundingClientRect();
    const chars = [...lineEl.querySelectorAll(".char")];
    if (!chars.length) return [];

    const measured = chars.map((char) => measureCharSlot(char, lineRect));
    const uniqueKeys = new Set(measured.map((item) => `${item.x.toFixed(3)},${item.y.toFixed(3)}`));

    if (chars.length > 1 && uniqueKeys.size === 1) {
      return measurePairsInlineReflow(lineEl);
    }

    return measured;
  };

  const clearLockedTypography = (lineEl) => {
    lineEl.style.fontSize = "";
    lineEl.style.letterSpacing = "";
    lineEl.style.lineHeight = "";

    lineEl.querySelectorAll(".char").forEach((char) => {
      char.style.fontSize = "";
      char.style.letterSpacing = "";
      char.style.lineHeight = "";
    });
  };

  const stabilizeWordmarkTypography = (lineEl) => {
    const isSubline = Boolean(lineEl.closest(".sds-physics-wordmark--sub"));
    const styleSource = isSubline
      ? (lineEl.closest(".sds-hero__sub") || lineEl.closest(".sds-physics-wordmark--sub") || lineEl)
      : lineEl;
    const computed = window.getComputedStyle(styleSource);
    const fontSize = computed.fontSize;
    const letterSpacing = computed.letterSpacing;
    const lineHeight = computed.lineHeight;

    lineEl.style.fontSize = fontSize;
    lineEl.style.letterSpacing = letterSpacing;
    lineEl.style.lineHeight = lineHeight;

    lineEl.querySelectorAll(".char").forEach((char) => {
      char.style.fontSize = fontSize;
      char.style.letterSpacing = letterSpacing;
      char.style.lineHeight = lineHeight;
    });
  };

  const lockLineBox = (lineEl) => {
    const { width, height } = measureLineBox(lineEl);
    const displayMode = lineEl.closest(".sds-physics-wordmark--sub") ? "inline-block" : "block";
    lineEl.style.display = displayMode;
    lineEl.style.width = `${width}px`;
    lineEl.style.minHeight = `${height}px`;
  };

  const getLineTargetViewport = (slot, lineEl) => {
    const lineRect = lineEl.getBoundingClientRect();
    return {
      x: lineRect.left + slot.x,
      y: lineRect.top + slot.y
    };
  };

  const persistCharSlot = (char, slot) => {
    char.dataset.slotX = String(slot.x);
    char.dataset.slotY = String(slot.y);
  };

  const syncLayoutItemSlot = (item, pair = null) => {
    if (!item?.char) return;

    const stored = originalLayout.find((entry) => entry.char === item.char);
    if (stored) {
      stored.x = item.x;
      stored.y = item.y;
      stored.width = item.width;
      stored.height = item.height;
      stored.angle = item.angle;
    }

    if (pair?.slot) {
      pair.slot.x = item.x;
      pair.slot.y = item.y;
      pair.slot.width = item.width;
      pair.slot.height = item.height;
      pair.slot.angle = item.angle;
    }

    persistCharSlot(item.char, item);
  };

  const commitPairSlotFromDom = (pair) => {
    if (!pair?.char || !pair?.line || !pair?.slot) return pair?.slot;

    const lineRect = pair.line.getBoundingClientRect();
    const rect = pair.char.getBoundingClientRect();
    if (!rect.width || !rect.height) return pair.slot;

    pair.slot.x = rect.left - lineRect.left + rect.width * 0.5;
    pair.slot.y = rect.top - lineRect.top + rect.height * 0.5;
    pair.slot.width = Math.max(rect.width * 0.88, 8);
    pair.slot.height = Math.max(rect.height * 0.88, 8);

    if (pair.layout) {
      pair.layout.x = pair.slot.x;
      pair.layout.y = pair.slot.y;
      pair.layout.width = pair.slot.width;
      pair.layout.height = pair.slot.height;
    }

    persistCharSlot(pair.char, pair.slot);
    return pair.slot;
  };

  const hydratePairSlot = (pair) => {
    if (!pair?.slot || !pair?.char) return pair?.slot;

    const datasetX = parseFloat(pair.char.dataset.slotX);
    const datasetY = parseFloat(pair.char.dataset.slotY);
    if (Number.isFinite(datasetX) && Number.isFinite(datasetY)) {
      pair.slot.x = datasetX;
      pair.slot.y = datasetY;
    } else {
      const stored = originalLayout.find((entry) => entry.char === pair.char);
      if (stored) {
        pair.slot.x = stored.x;
        pair.slot.y = stored.y;
        pair.slot.width = stored.width;
        pair.slot.height = stored.height;
        pair.slot.angle = stored.angle;
      }
    }

    if (pair.layout) {
      pair.layout.x = pair.slot.x;
      pair.layout.y = pair.slot.y;
      pair.layout.width = pair.slot.width;
      pair.layout.height = pair.slot.height;
      pair.layout.angle = pair.slot.angle;
    }

    return pair.slot;
  };

  const getPairRematerializeTarget = (pair) => {
    hydratePairSlot(pair);
    return getLineTargetViewport(pair.slot, pair.line);
  };

  const applyCharLayout = (item, pair = null) => {
    if (pair?.shakeTimeline) {
      pair.shakeTimeline.kill();
      pair.shakeTimeline = null;
    }
    gsap.killTweensOf(item.char);
    item.char.style.transform = "none";
    gsap.set(item.char, {
      clearProps: "all",
      x: 0,
      y: 0,
      xPercent: 0,
      yPercent: 0,
      rotation: 0,
      scale: 1
    });
    if (isWhitespaceChar(item.char)) {
      item.char.classList.add("is-space-char");
      item.char.removeAttribute("tabindex");
      item.char.style.pointerEvents = "none";
      item.char.style.cursor = "default";
    } else {
      item.char.setAttribute("tabindex", "0");
      item.char.style.pointerEvents = "auto";
      item.char.style.cursor = "";
    }
    item.char.style.position = "absolute";
    item.char.style.left = `${item.x}px`;
    item.char.style.top = `${item.y}px`;
    item.char.style.width = "";
    item.char.style.height = "";
    item.char.style.margin = "0";
    item.char.style.opacity = "1";
    item.char.style.zIndex = "";
    item.char.style.filter = "";
    item.char.style.transform = `translate(-50%, -50%) rotate(${item.angle}rad)`;
    item.char.classList.remove(
      "is-falling-char",
      "is-rematerializing-char",
      "is-loosening-char",
      "is-cycle-active",
      "is-intro-filling"
    );
    clearIntroFillStyle(item.char);
    syncLayoutItemSlot(item, pair);
  };

  const restoreCharToLine = (item, pair = null) => {
    const targetLine = pair?.line || item?.line || line;
    if (!targetLine.contains(item.char)) {
      targetLine.appendChild(item.char);
    }
    applyCharLayout(item, pair);
  };

  const applyDomFromLayout = (layout) => {
    layout.forEach((item) => restoreCharToLine(item));
  };

  const captureOriginalLayout = () => {
    originalLayout.length = 0;
    let globalIndex = 0;

    wordmarkContexts.forEach((ctx) => {
      measurePairs(ctx.line).forEach((item) => {
        originalLayout.push({
          ...item,
          char: item.char,
          index: globalIndex,
          line: ctx.line,
          root: ctx.root,
          withIntro: ctx.withIntro
        });
        globalIndex += 1;
      });
    });
  };

  const initPairRegistry = () => {
    pairs = originalLayout.map((item) => {
      if (!item.withIntro) {
        item.char.classList.add("is-subline-char");
      }
      return {
        char: item.char,
        index: item.index,
        line: item.line,
        root: item.root,
        withIntro: item.withIntro,
        layout: item,
        slot: {
          x: item.x,
          y: item.y,
          width: item.width,
          height: item.height,
          angle: item.angle
        },
        body: null,
        released: false,
        fallen: false,
        loosening: false,
        rematerializing: false,
        settledSince: null,
        settleSpeedPeak: 0,
        settleSpeedSampleAt: 0,
        lowEnergySince: null,
        releaseRotation: null,
        releaseCommitted: false,
        cycleActive: false,
        shakeRunId: 0,
        shakeTimeline: null,
        introTintColor: null,
        sublineHot: false,
        sublineFloorBounces: 0,
        sublineFloorBounceCooldown: 0,
        engageCooldownUntil: 0,
        lastEngageAttemptAt: 0,
        hoverArmRequired: false,
        width: item.width,
        height: item.height
      };
    });
  };

  const syncPairSlotFromDomIfOnLine = (pair) => {
    if (!pair?.char || !pair?.line?.contains(pair.char)) return;
    if (pair.released || pair.body || pair.rematerializing || pair.loosening) return;
    commitPairSlotFromDom(pair);
  };

  const restorePairToLineSlot = (pair) => {
    syncPairSlotFromDomIfOnLine(pair);
    restoreCharToLine(slotLayoutItem(pair), pair);
  };

  const repairStalePair = (pair) => {
    if (pair.cycleActive || pair.rematerializing || pair.loosening) return;
    if (!pair.released && !pair.fallen && !pair.releaseCommitted && !pair.body) return;
    if (pair.body && engine) Composite.remove(engine.world, pair.body);
    resetLetterCycle(pair);
  };

  const syncWordmarkIdleState = () => {
    lowPerformance = false;
    frameBudget.length = 0;
    groupSettledSince = null;

    pairs.forEach((pair) => {
      if (pair.cycleActive || pair.rematerializing || pair.loosening) return;
      resetLetterCycle(pair);
      restorePairToLineSlot(pair);
    });
  };

  const finalizeWordmarkGroupIdle = () => {
    lowPerformance = false;
    frameBudget.length = 0;
    groupSettledSince = null;
    wordmarkContexts.forEach((ctx) => {
      ctx.root.classList.remove("is-falling", "is-rematerializing");
    });
    wordmark?.classList.remove("is-physics-falling");
  };

  const isWordmarkFullyIdle = () => (
    !hasActiveLetters()
    && !pairs.some((entry) => entry.cycleActive || entry.rematerializing || entry.loosening)
  );

  const isPairEngageCooldownActive = (pair, now = performance.now()) => (
    now < (pair?.engageCooldownUntil || 0)
  );

  const ensurePointerMotionTracker = () => {
    if (pointerMotionTrackerBound) return;
    pointerMotionTrackerBound = true;
    pointerMotionHandler = (event) => {
      lastPointerPos = { x: event.clientX, y: event.clientY };
    };
    document.addEventListener("pointermove", pointerMotionHandler, { passive: true });
  };

  const getPointerMotionDelta = (event) => {
    const movement = Math.hypot(event.movementX || 0, event.movementY || 0);
    if (movement > 0) return movement;
    if (!lastPointerPos) return 0;
    return Math.hypot(
      event.clientX - lastPointerPos.x,
      event.clientY - lastPointerPos.y
    );
  };

  const isPointerOverCharBounds = (char) => {
    if (!lastPointerPos || !char) return false;
    const rect = char.getBoundingClientRect();
    const { x, y } = lastPointerPos;
    return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
  };

  const clearLetterHoverArm = (pair) => {
    if (!pair) return;
    pair.hoverArmRequired = false;
  };

  const armLetterHoverEngage = (pair) => {
    if (!pair) return;
    ensurePointerMotionTracker();
    pair.hoverArmRequired = isPointerOverCharBounds(pair.char);
  };

  const getLetterHoverEngageDebounceMs = (pair) => (
    pair?.withIntro ? MAIN_LETTER_HOVER_ENGAGE_DEBOUNCE_MS : LETTER_HOVER_ENGAGE_DEBOUNCE_MS
  );

  const getLetterHoverMotionThresholdPx = (pair) => (
    pair?.withIntro ? MAIN_LETTER_HOVER_MOTION_THRESHOLD_PX : LETTER_HOVER_MOTION_THRESHOLD_PX
  );

  const canEngageLetterFromHover = (pair, event) => {
    if (!pair || !event) return true;
    if (event.type === "pointerdown") return true;
    if (getMobilePhysicsActive()) return true;
    if (!pair.hoverArmRequired) return true;
    return getPointerMotionDelta(event) >= getLetterHoverMotionThresholdPx(pair);
  };

  const engageLetterFromInteraction = (char, event) => {
    if (isWhitespaceChar(char)) return;
    const pair = getPair(char);
    if (!pair) return;

    if (event?.type === "focus" || event?.type === "focusin") {
      engageIntroLetter(char);
      return;
    }

    if (event?.type === "pointerdown") {
      clearLetterHoverArm(pair);
      engageIntroLetter(char);
      return;
    }

    ensurePointerMotionTracker();
    if (!canEngageLetterFromHover(pair, event)) return;

    clearLetterHoverArm(pair);
    engageIntroLetter(char);
  };

  const handleLetterHoverMotion = (event) => {
    const pair = getPair(event.currentTarget);
    if (!pair?.hoverArmRequired || getMobilePhysicsActive()) return;
    if (getPointerMotionDelta(event) < getLetterHoverMotionThresholdPx(pair)) return;
    clearLetterHoverArm(pair);
    engageIntroLetter(event.currentTarget);
  };

  const handleLetterHoverLeave = (event) => {
    const pair = getPair(event.currentTarget);
    if (!pair || isPairEngageCooldownActive(pair)) return;
    clearLetterHoverArm(pair);
  };

  const canEngageLetter = (pair, { allowDuringIntro = false } = {}) => {
    if (userPhysicsDisabled) return false;
    if (!pair?.root) return false;
    if (!pair.root.classList.contains("is-split")) return false;
    if (pair.root.classList.contains("is-static")) return false;
    if (pair.rematerializing || pair.loosening) return false;
    if (isPairEngageCooldownActive(pair)) return false;
    if (introRunning && pair.withIntro && !allowDuringIntro) return false;
    return pair.root.classList.contains("is-ready");
  };

  const engageLetter = (char, { allowDuringIntro = false } = {}) => {
    const pair = getPair(char);
    if (!pair) return;
    if (!canEngageLetter(pair, { allowDuringIntro })) return;

    const now = performance.now();
    if (now - (pair.lastEngageAttemptAt || 0) < getLetterHoverEngageDebounceMs(pair)) return;
    pair.lastEngageAttemptAt = now;

    repairStalePair(pair);
    if (pair.cycleActive || pair.releaseCommitted) return;
    releaseLetter(pair);
  };

  const engageIntroLetter = (char) => {
    if (userPhysicsDisabled) return;
    const pair = getPair(char);
    if (!pair) return;

    if (introRunning && pair.withIntro) {
      abortLoadIntro();
    }

    engageLetter(char);
  };

  const getMainLetterMaxSpeed = () => (
    introRunning ? MAIN_LETTER_INTRO_MAX_SPEED : MAIN_LETTER_MAX_SPEED
  );

  const getMainLetterImpactSpeedCap = () => (
    introRunning ? MAIN_LETTER_INTRO_IMPACT_SPEED_CAP : MAIN_LETTER_IMPACT_SPEED_CAP
  );

  const clampBodyToMaxSpeed = (body, maxSpeed) => {
    if (!body || maxSpeed <= 0) return 0;
    const speed = Math.hypot(body.velocity.x, body.velocity.y);
    if (speed <= maxSpeed) return speed;
    const scale = maxSpeed / speed;
    Body.setVelocity(body, {
      x: body.velocity.x * scale,
      y: body.velocity.y * scale
    });
    return maxSpeed;
  };

  const getNormalizedWordmarkImpactSpeed = (body) => {
    if (!body) return 0;
    return Math.min(
      Math.hypot(body.velocity.x, body.velocity.y),
      getMainLetterImpactSpeedCap()
    );
  };

  const getMainKnockImpulseScale = (targetPair, sourceBody) => {
    if (!targetPair?.withIntro || !sourceBody) return 1;
    if (BRAND_MARK_LABELS.has(sourceBody.label)) return MAIN_KNOCK_IMPULSE_BRAND_MARK;
    const sourceIndex = parseWordmarkLetterBodyIndex(sourceBody.label);
    if (sourceIndex !== null) {
      const sourcePair = pairs[sourceIndex];
      if (sourcePair && !sourcePair.withIntro) return MAIN_KNOCK_IMPULSE_SUBLINE;
    }
    return 1;
  };

  const knockLetterFromWordmarkImpact = (targetPair, sourceBody, { allowDuringIntro = false } = {}) => {
    if (userPhysicsDisabled) return;
    if (!targetPair) return;
    if (!canEngageLetter(targetPair, { allowDuringIntro })) return;
    repairStalePair(targetPair);
    if (targetPair.cycleActive || targetPair.releaseCommitted) return;

    targetPair.cycleActive = true;
    targetPair.releaseCommitted = true;
    targetPair.releaseRotation = (
      targetPair.withIntro
        ? (targetPair.index % 2 === 0 ? -0.9 : 0.15)
        : -3 + (targetPair.index * 1.05) % 6
    ) + (Math.random() - 0.5) * 1.2;

    try {
      ensurePhysicsWorld();
      targetPair.root.classList.add("is-falling");
      beginPhysics(targetPair);

      if (targetPair.body && sourceBody) {
        const isMainTarget = Boolean(targetPair.withIntro);
        const impactSpeed = isMainTarget
          ? getNormalizedWordmarkImpactSpeed(sourceBody)
          : Math.hypot(sourceBody.velocity.x, sourceBody.velocity.y);
        const sourceBoost = isMainTarget ? getMainKnockImpulseScale(targetPair, sourceBody) : 1;
        const impulseCap = isMainTarget ? 1.35 : 1.15;
        const impulseScale = Math.min(impulseCap, 0.44 + impactSpeed * 0.1) * sourceBoost;
        const dirX = impactSpeed > 0.01 ? sourceBody.velocity.x / Math.hypot(sourceBody.velocity.x, sourceBody.velocity.y) : 0;
        const dirY = impactSpeed > 0.01 ? sourceBody.velocity.y / Math.hypot(sourceBody.velocity.x, sourceBody.velocity.y) : 1;
        const impulseXScale = isMainTarget ? 0.42 : 0.36;
        const impulseYScale = isMainTarget ? 0.68 : 0.58;
        Body.setVelocity(targetPair.body, {
          x: dirX * impactSpeed * impulseScale * impulseXScale + (Math.random() - 0.5) * 0.3,
          y: Math.max(dirY * impactSpeed * impulseScale * impulseYScale, isMainTarget ? 1.05 : 0.85)
        });
        clampBodyToMaxSpeed(
          targetPair.body,
          isMainTarget ? getMainLetterMaxSpeed() : SUBLINE_MAX_SPEED
        );
        Body.setAngularVelocity(
          targetPair.body,
          sourceBody.angularVelocity * 0.45 + (Math.random() - 0.5) * 0.04
        );
      }
    } catch (error) {
      abortLetterRelease(targetPair);
    }
  };

  const getCharViewportCenter = (pair) => {
    const rect = pair.char.getBoundingClientRect();
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5
    };
  };

  const syncPairSlotFromPaintedCenter = (pair) => {
    if (!pair?.char || !pair?.line) return pair?.slot;

    const lineRect = pair.line.getBoundingClientRect();
    const painted = getCharViewportCenter(pair);
    const rect = pair.char.getBoundingClientRect();
    if (!rect.width || !rect.height) return pair.slot;

    pair.slot.x = painted.x - lineRect.left;
    pair.slot.y = painted.y - lineRect.top;
    pair.slot.width = Math.max(rect.width * 0.88, 8);
    pair.slot.height = Math.max(rect.height * 0.88, 8);

    if (pair.layout) {
      pair.layout.x = pair.slot.x;
      pair.layout.y = pair.slot.y;
      pair.layout.width = pair.slot.width;
      pair.layout.height = pair.slot.height;
    }

    persistCharSlot(pair.char, pair.slot);
    return pair.slot;
  };

  const handoffCharToGsapShakeAnchor = (pair) => {
    const char = pair.char;
    // Main letters rest with CSS translate(-50%, -50%); anchoring with the same
    // -50%/-50% offset keeps the painted center fixed for ANY transform-origin,
    // so the shake pivot can move to center (main) without a Y snap.
    const shakeOrigin = pair.withIntro ? "50% 50%" : "50% 62%";

    char.classList.add("is-loosening-char");
    char.style.position = "absolute";
    char.style.width = "";
    char.style.height = "";
    char.style.margin = "0";

    const hasLineAnchor = Number.isFinite(parseFloat(char.style.left))
      && Number.isFinite(parseFloat(char.style.top));
    if (!hasLineAnchor) {
      char.style.left = `${pair.slot.x}px`;
      char.style.top = `${pair.slot.y}px`;
    }

    gsap.set(char, { clearProps: "filter,opacity,color" });

    // Wipe the raw CSS transform that applyCharLayout wrote directly (bypassing
    // GSAP), so GSAP rebuilds its cache from a clean baseline rather than a
    // stale xPercent=0 snapshot that conflicts with the inline translate(-50%,-50%).
    char.style.transform = "";

    gsap.set(char, {
      immediateRender: true,
      x: 0,
      y: 0,
      xPercent: -50,
      yPercent: -50,
      rotation: 0,
      scale: 1,
      transformOrigin: shakeOrigin,
      force3D: true,
      overwrite: "auto"
    });
  };

  const slotLayoutItem = (pair) => {
    hydratePairSlot(pair);
    return {
      char: pair.char,
      x: pair.slot.x,
      y: pair.slot.y,
      width: pair.slot.width,
      height: pair.slot.height,
      angle: pair.slot.angle
    };
  };

  const clearShakeHandoff = (pair) => {
    pair.releaseRotation = null;
  };

  const isBodyAtRest = (body) => {
    const speed = Math.hypot(body.velocity.x, body.velocity.y);
    return speed < REST_VELOCITY && Math.abs(body.angularVelocity) < REST_ANGULAR;
  };

  let groupSettledSince = null;

  const getBodySpeed = (body) => Math.hypot(body.velocity.x, body.velocity.y);

  const samplePairSettleSpeed = (pair, now) => {
    if (!pair.body) return 0;
    const speed = getBodySpeed(pair.body);
    if (!pair.settleSpeedSampleAt || now - pair.settleSpeedSampleAt > SETTLE_SPEED_WINDOW_MS) {
      pair.settleSpeedPeak = speed;
      pair.settleSpeedSampleAt = now;
    } else {
      pair.settleSpeedPeak = Math.max(pair.settleSpeedPeak || 0, speed);
    }
    return pair.settleSpeedPeak;
  };

  const resetPairSettleSample = (pair) => {
    pair.settleSpeedPeak = 0;
    pair.settleSpeedSampleAt = 0;
    pair.lowEnergySince = null;
  };

  const getSettleThresholds = () => (
    getMobilePhysicsActive()
      ? {
        groupSpeed: MOBILE_GROUP_SETTLE_SPEED,
        groupAngular: GROUP_SETTLE_ANGULAR,
        activeSpeed: MOBILE_SETTLE_ACTIVE_SPEED,
        activeAngular: MOBILE_SETTLE_ACTIVE_ANGULAR
      }
      : {
        groupSpeed: GROUP_SETTLE_SPEED,
        groupAngular: GROUP_SETTLE_ANGULAR,
        activeSpeed: SETTLE_ACTIVE_SPEED,
        activeAngular: SETTLE_ACTIVE_ANGULAR
      }
  );

  const isPairActivelyBouncing = (pair) => {
    if (!pair.body) return false;
    const { activeSpeed, activeAngular } = getSettleThresholds();
    const speed = getBodySpeed(pair.body);
    return speed >= activeSpeed
      || Math.abs(pair.body.angularVelocity) >= activeAngular;
  };

  const isPairVisuallySettled = (pair, peakSpeed) => {
    if (!pair.body) return false;
    const { groupSpeed, groupAngular } = getSettleThresholds();
    return peakSpeed < groupSpeed
      && Math.abs(pair.body.angularVelocity) < groupAngular;
  };

  const getActiveSettlePairs = () => {
    const offscreenThreshold = window.innerHeight + OFFSCREEN_PAD;
    return pairs.filter((pair) => {
      if (!pair.released || pair.fallen || pair.rematerializing || !pair.body) return false;
      return pair.body.position.y < offscreenThreshold;
    });
  };

  const isLetterGroupVisuallyIdle = (now) => {
    const active = getActiveSettlePairs();
    if (!active.length) return false;

    let maxPeak = 0;
    for (const pair of active) {
      if (isPairActivelyBouncing(pair)) return false;
      maxPeak = Math.max(maxPeak, samplePairSettleSpeed(pair, now));
    }

    const { groupSpeed } = getSettleThresholds();
    return maxPeak < groupSpeed;
  };

  const getMobileAccelGravityScale = () => {
    if (!getMobilePhysicsActive() || !hasActiveLetters()) return 1;

    const now = performance.now();
    if (isLetterGroupVisuallyIdle(now)) return MOBILE_ACCEL_SETTLE_DAMP;

    const { activeSpeed } = getSettleThresholds();
    const active = getActiveSettlePairs();
    const lowEnergyCutoff = activeSpeed * 0.55;
    if (
      active.length
      && active.every((pair) => pair.body && getBodySpeed(pair.body) < lowEnergyCutoff)
    ) {
      return MOBILE_ACCEL_SETTLE_DAMP;
    }

    return 1;
  };

  const isPairEffectivelySettled = (pair, now, groupIdle) => {
    if (!pair.body || isPairActivelyBouncing(pair)) return false;
    if (isBodyAtRest(pair.body)) return true;
    if (groupIdle) return true;
    const peakSpeed = samplePairSettleSpeed(pair, now);
    return isPairVisuallySettled(pair, peakSpeed);
  };

  const getPair = (char) => pairs.find((entry) => entry.char === char);

  const hasActiveLetters = () => pairs.some((pair) => pair.released && !pair.fallen && !pair.rematerializing);

  const hasActivePhysicsBodies = () => (
    hasActiveLetters()
    || Boolean(mobileMark?.body && mobileMark.released)
    || Boolean(desktopBrandMark?.body && desktopBrandMark.released)
  );

  const removeEnvironmentBodies = () => {
    if (!engine) return;
    environmentBodies.forEach((body) => Composite.remove(engine.world, body));
    environmentBodies = [];
  };

  const getPrimaryTextNode = (element) => {
    if (!element) return null;

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    while (node) {
      if (node.textContent.trim()) return node;
      node = walker.nextNode();
    }

    return null;
  };

  const getTextRangeRect = (element, start, end) => {
    const textNode = getPrimaryTextNode(element);
    if (!textNode) return null;

    const max = textNode.textContent.length;
    const safeStart = Math.max(0, Math.min(start, max));
    const safeEnd = Math.max(safeStart, Math.min(end, max));
    const range = document.createRange();

    range.setStart(textNode, safeStart);
    range.setEnd(textNode, safeEnd);

    const rect = range.getBoundingClientRect();
    if (rect.width < 0.5 && rect.height < 0.5) return null;

    return rect;
  };

  const createBumpCollider = (rect, label, radius = BUMP_DOT_RADIUS) => {
    const centerX = rect.left + rect.width * 0.5;
    const centerY = rect.top + rect.height * 0.68;

    return Bodies.circle(centerX, centerY, radius, {
      ...BUMP_PHYSICS,
      label
    });
  };

  const buildLeadTextColliders = () => {
    const lead = document.querySelector(".sds-hero__lead");
    if (!lead) return [];

    const text = lead.textContent || "";
    const bodies = [];
    const usedOffsets = new Set();

    LEAD_BUMP_TARGETS.forEach((target) => {
      const wordIndex = text.indexOf(target.word);
      if (wordIndex === -1) return;

      const charIndex = wordIndex + target.charOffset;
      if (usedOffsets.has(charIndex)) return;

      const rect = getTextRangeRect(lead, charIndex, charIndex + 1);
      if (!rect) return;

      usedOffsets.add(charIndex);
      bodies.push(createBumpCollider(rect, `lead-${target.word}-${charIndex}`, BUMP_DOT_RADIUS));
    });

    return bodies;
  };

  const getPageScrollY = () => window.scrollY || window.pageYOffset || 0;

  const getNavBannerElement = () => {
    if (getMobilePhysicsActive()) {
      return document.querySelector(".md\\:hidden > header.fixed.top-0")
        || document.querySelector(".md\\:hidden header.fixed")
        || document.querySelector("header.fixed.top-0");
    }

    return document.querySelector("nav.hidden.md\\:flex.fixed.top-0")
      || document.querySelector("nav.fixed.top-0.w-full")
      || document.querySelector("nav.fixed.top-0")
      || document.querySelector("header.fixed.top-0");
  };

  const getNavBannerBottomY = () => {
    const banner = getNavBannerElement();
    if (!banner) return BANNER_CEILING_FALLBACK_Y;

    const rect = banner.getBoundingClientRect();
    if (rect.bottom > 0) return rect.bottom;

    const main = document.querySelector("main");
    if (main) {
      const mainStyles = window.getComputedStyle(main);
      const paddingTop = parseFloat(mainStyles.paddingTop) || 0;
      if (paddingTop > 0) return Math.min(paddingTop, window.innerHeight * 0.22);
    }

    return BANNER_CEILING_FALLBACK_Y;
  };

  const getMobileHomeServicesMenuElement = () => {
    const mobileRoot = document.querySelector(".md\\:hidden");
    return mobileRoot?.querySelector("nav.fixed.bottom-0")
      || mobileRoot?.querySelector("nav.fixed")
      || document.querySelector("nav.fixed.bottom-0");
  };

  const getMobileHomeServicesMenuTopY = () => {
    const menu = getMobileHomeServicesMenuElement();
    if (!menu) {
      return window.innerHeight - MOBILE_MENU_BARRIER_FALLBACK_OFFSET;
    }

    const rect = menu.getBoundingClientRect();
    if (rect.top > 0 && rect.top < window.innerHeight) {
      return rect.top;
    }

    return window.innerHeight - MOBILE_MENU_BARRIER_FALLBACK_OFFSET;
  };

  const isDesktopBrandMarkGalleryAnchored = () => (
    getDesktopPhysicsActive()
    && desktopBrandMark?.released
    && desktopBrandMark.floorAnchor === "gallery"
  );

  const isMobileBrandMarkGalleryAnchored = () => (
    getMobilePhysicsActive()
    && mobileMark?.released
    && mobileMark.floorAnchor === "gallery"
  );

  const getActiveGalleryAnchoredMark = () => {
    if (isDesktopBrandMarkGalleryAnchored()) return desktopBrandMark;
    if (isMobileBrandMarkGalleryAnchored()) return mobileMark;
    return null;
  };

  const getViewportBottomFloorY = () => window.innerHeight - 30;

  const groupGalleryTileRectsByRow = (rects) => {
    const rows = [];

    rects.forEach((rect) => {
      const row = rows.find((entry) => Math.abs(entry.top - rect.top) < 2);
      if (row) {
        row.rects.push(rect);
      } else {
        rows.push({ top: rect.top, rects: [rect] });
      }
    });

    return rows.sort((a, b) => a.top - b.top);
  };

  const getGalleryFloorMetrics = () => {
    const section = catalogSection || document.querySelector(".sds-hero + section");
    const tiles = section ? [...section.querySelectorAll(".app-tile")] : [];
    const bottomY = getViewportBottomFloorY();

    if (!tiles.length) {
      if (!section) {
        const galleryFloorY = bottomY - 220;
        return {
          galleryFloorY,
          galleryFloorYs: [galleryFloorY],
          bottomFloorY: bottomY,
          centerX: window.innerWidth * 0.5,
          width: Math.min(window.innerWidth * 0.72, 960),
          leftX: window.innerWidth * 0.14,
          rightX: window.innerWidth * 0.86
        };
      }

      const rect = section.getBoundingClientRect();
      const galleryFloorY = rect.top + 12;
      return {
        galleryFloorY,
        galleryFloorYs: [galleryFloorY],
        bottomFloorY: bottomY,
        centerX: rect.left + rect.width * 0.5,
        width: rect.width,
        leftX: rect.left,
        rightX: rect.right
      };
    }

    const rects = tiles.map((tile) => tile.getBoundingClientRect());
    const minTop = Math.min(...rects.map((rect) => rect.top));
    const minLeft = Math.min(...rects.map((rect) => rect.left));
    const maxRight = Math.max(...rects.map((rect) => rect.right));
    const galleryFloorYs = groupGalleryTileRectsByRow(rects).map(
      (row) => row.top + CARD_TOP_INSET
    );

    return {
      galleryFloorY: minTop + CARD_TOP_INSET,
      galleryFloorYs,
      bottomFloorY: bottomY,
      centerX: (minLeft + maxRight) * 0.5,
      width: maxRight - minLeft,
      leftX: minLeft,
      rightX: maxRight
    };
  };

  const getMobileGalleryCardFloorYs = () => {
    const section = catalogSection || document.querySelector(".sds-hero + section");
    const tiles = section ? [...section.querySelectorAll(".app-tile")] : [];

    if (!tiles.length) {
      const { galleryFloorY } = getGalleryFloorMetrics();
      return [galleryFloorY];
    }

    return tiles.map((tile) => tile.getBoundingClientRect().top + CARD_TOP_INSET);
  };

  const getGalleryFloorYs = () => {
    if (getMobilePhysicsActive()) {
      return getMobileGalleryCardFloorYs();
    }

    const { galleryFloorYs, galleryFloorY } = getGalleryFloorMetrics();
    return galleryFloorYs?.length ? galleryFloorYs : [galleryFloorY];
  };

  const getMobileHeroZoneBottomY = () => {
    const hero = document.querySelector(".sds-hero");
    if (hero) {
      return hero.getBoundingClientRect().bottom;
    }

    const section = catalogSection || document.querySelector(".sds-hero + section");
    if (section) {
      return section.getBoundingClientRect().top;
    }

    return getWordmarkLetterHitUnlockY();
  };

  const isMobileMarkInGalleryZone = (mark = mobileMark) => {
    if (!getMobilePhysicsActive() || !mark?.body) return false;
    return mark.body.position.y >= getMobileHeroZoneBottomY() - MOBILE_HERO_ZONE_PAD;
  };

  const shouldIncludeMobileHeroBlockades = () => {
    if (!getMobilePhysicsActive() || !mobileMark?.released) return true;
    return !isMobileMarkInGalleryZone();
  };

  const getBrandMarkUpwardPassExemptLabels = () => {
    if (getMobilePhysicsActive() && mobileMark?.released) {
      return MOBILE_BRAND_MARK_UPWARD_PASS_EXEMPT_LABELS;
    }
    return BRAND_MARK_UPWARD_PASS_EXEMPT_LABELS;
  };

  const isNearGalleryFloorY = (bodyY) => (
    getGalleryFloorYs().some(
      (galleryFloorY) => bodyY >= galleryFloorY - 32 && bodyY <= galleryFloorY + 56
    )
  );

  const isNearDesktopBrandMarkFloor = (bodyY) => {
    const { bottomFloorY } = getGalleryFloorMetrics();
    return isNearGalleryFloorY(bodyY)
      || (bodyY >= bottomFloorY - 36 && bodyY <= bottomFloorY + 44);
  };

  const getGalleryCenterFloorSpan = () => {
    const metrics = getGalleryFloorMetrics();
    const rawWidth = metrics.rightX - metrics.leftX;
    const spanWidth = Math.max(rawWidth - GALLERY_FLOOR_SPAN_INSET * 2, 80);

    return {
      galleryFloorY: metrics.galleryFloorY,
      centerX: (metrics.leftX + metrics.rightX) * 0.5,
      spanWidth
    };
  };

  const getNearestGalleryFloorY = (bodyY) => {
    const floorYs = getGalleryFloorYs();
    if (!floorYs.length) return bodyY;

    return floorYs.reduce((nearest, floorY) => (
      Math.abs(floorY - bodyY) < Math.abs(nearest - bodyY) ? floorY : nearest
    ), floorYs[0]);
  };

  const buildGalleryFloorColliders = (restitution = 0.84) => {
    const { centerX, spanWidth } = getGalleryCenterFloorSpan();
    const { galleryFloorYs, galleryFloorY } = getGalleryFloorMetrics();
    const floorYs = galleryFloorYs?.length ? galleryFloorYs : [galleryFloorY];

    return floorYs.map((galleryFloorY) => (
      Bodies.rectangle(centerX, galleryFloorY, spanWidth, CARD_TOP_THICKNESS, {
        isStatic: true,
        friction: 0.02,
        restitution,
        render: { visible: false },
        label: GALLERY_FLOOR_LABEL
      })
    ));
  };

  const buildMobileGalleryCardFloorColliders = (restitution = MOBILE_MARK_FLOOR_RESTITUTION) => {
    const section = catalogSection || document.querySelector(".sds-hero + section");
    const tiles = section ? [...section.querySelectorAll(".app-tile")] : [];

    if (!tiles.length) {
      return buildGalleryFloorColliders(restitution);
    }

    return tiles.map((tile) => {
      const rect = tile.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return null;

      return Bodies.rectangle(
        rect.left + rect.width * 0.5,
        rect.top + CARD_TOP_INSET,
        rect.width * 0.96,
        CARD_TOP_THICKNESS,
        {
          isStatic: true,
          friction: 0.02,
          restitution,
          render: { visible: false },
          label: GALLERY_FLOOR_LABEL
        }
      );
    }).filter(Boolean);
  };

  const buildBannerCeilingCollider = (restitution = 0.94) => {
    const pad = 36;
    const w = window.innerWidth;
    const bannerBottomY = getNavBannerBottomY();

    return Bodies.rectangle(
      w * 0.5,
      bannerBottomY + BANNER_CEILING_THICKNESS * 0.5,
      w + pad * 2,
      BANNER_CEILING_THICKNESS,
      {
        isStatic: true,
        friction: 0.02,
        restitution,
        render: { visible: false },
        label: BANNER_CEILING_LABEL
      }
    );
  };

  const buildMobileMenuBarrierCollider = (restitution = 0.72) => {
    const pad = 36;
    const w = window.innerWidth;
    const menuTopY = getMobileHomeServicesMenuTopY();

    return Bodies.rectangle(
      w * 0.5,
      menuTopY + MOBILE_MENU_BARRIER_THICKNESS * 0.5,
      w + pad * 2,
      MOBILE_MENU_BARRIER_THICKNESS,
      {
        isStatic: true,
        friction: 0.02,
        restitution,
        render: { visible: false },
        label: MOBILE_MENU_BARRIER_LABEL
      }
    );
  };

  const buildViewportBounds = (options = 0.94) => {
    const pad = 36;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const config = typeof options === "number"
      ? { restitution: options, floorRestitution: options, includeBottom: true, includeTop: true }
      : {
        restitution: options.restitution ?? 0.94,
        floorRestitution: options.floorRestitution ?? options.restitution ?? 0.94,
        includeBottom: options.includeBottom !== false,
        includeTop: options.includeTop !== false
      };
    const sideWall = {
      isStatic: true,
      friction: 0.02,
      restitution: config.restitution,
      render: { visible: false }
    };
    const floorWall = {
      ...sideWall,
      restitution: config.floorRestitution
    };

    const bounds = [
      Bodies.rectangle(-pad * 0.5, h * 0.5, pad, h + pad * 2, { ...sideWall, label: "view-left" }),
      Bodies.rectangle(w + pad * 0.5, h * 0.5, pad, h + pad * 2, { ...sideWall, label: "view-right" })
    ];

    if (config.includeTop) {
      bounds.unshift(
        Bodies.rectangle(w * 0.5, -pad * 0.5, w + pad * 2, pad, { ...sideWall, label: "view-top" })
      );
    }

    if (config.includeBottom) {
      bounds.push(
        Bodies.rectangle(w * 0.5, h + pad * 0.5, w + pad * 2, pad, { ...floorWall, label: "view-bottom" })
      );
    }

    return bounds;
  };

  const shouldSkipCardCollidersForDesktopMarkFall = () => (
    getDesktopPhysicsActive()
    && desktopBrandMark?.released
    && !desktopBrandMark.hasReachedFloor
  );

  const shouldSkipCardCollidersForMobileMarkGallery = () => (
    getMobilePhysicsActive()
    && mobileMark?.released
    && isMobileMarkInGalleryZone()
  );

  const shouldSkipCardColliders = () => {
    if (shouldSkipCardCollidersForDesktopMarkFall()) return true;
    if (shouldSkipCardCollidersForMobileMarkGallery()) return true;
    if (
      getDesktopPhysicsActive()
      && desktopBrandMark?.released
      && !hasActiveLetters()
    ) {
      return true;
    }
    return false;
  };

  const applyDesktopMarkBounceImpulse = (markBody, floorLabel = "") => {
    const intensity = getDesktopMarkBounceIntensity();
    if (!markBody || intensity < 0.05) return;

    const impactSpeed = Math.max(
      Math.abs(markBody.velocity.y),
      Math.hypot(markBody.velocity.x, markBody.velocity.y) * 0.72
    );
    if (impactSpeed < 0.22) return;

    const isBrandMarkFloor = BRAND_MARK_FLOOR_LABELS.has(floorLabel);
    const impulseMult = lerpDesktopMark(
      DESKTOP_MARK_IMPULSE_MULT_LOW,
      DESKTOP_MARK_IMPULSE_MULT_HIGH,
      intensity
    ) * (isBrandMarkFloor ? DESKTOP_MARK_FLOOR_IMPULSE_SCALE : 1);

    if (markBody.velocity.y > 0.04) {
      Body.setVelocity(markBody, {
        x: markBody.velocity.x * (isBrandMarkFloor ? DESKTOP_MARK_FLOOR_HORIZONTAL_DAMPING : 0.93),
        y: -Math.max(
          impactSpeed * impulseMult,
          isBrandMarkFloor ? DESKTOP_MARK_FLOOR_MIN_REBOUND_VELOCITY : 1.6
        )
      });
    } else if (desktopBrandMark.screenBounceMode) {
      const wallBoost = lerpDesktopMark(
        DESKTOP_MARK_LAUNCH_WALL_BOOST_LOW,
        DESKTOP_MARK_LAUNCH_WALL_BOOST_HIGH,
        intensity
      );
      Body.setVelocity(markBody, {
        x: markBody.velocity.x * wallBoost,
        y: markBody.velocity.y * wallBoost
      });
    }

    decayDesktopMarkBounceIntensity();
    if (isBrandMarkFloor) {
      desktopBrandMark.bounceIntensity = Math.max(
        0,
        getDesktopMarkBounceIntensity() * DESKTOP_MARK_FLOOR_BOUNCE_DECAY_EXTRA
      );
      syncDesktopMarkBodyRestitution();
      refreshEnvironmentColliders();
    }
    checkDesktopMarkLaunchReady();
  };

  const handleDesktopBrandMarkFloorContact = (markBody, floorLabel = "") => {
    if (floorLabel === GALLERY_FLOOR_LABEL) {
      setDesktopBrandMarkFloorAnchor("gallery");
    } else if (floorLabel === "view-bottom") {
      setDesktopBrandMarkFloorAnchor("viewport");
    }

    markDesktopBrandMarkFloorReached();
    applyDesktopMarkBounceImpulse(markBody, floorLabel);
  };

  // ---------------------------------------------------------------------------
  // Mark dead-zone overlay
  //
  // A transparent, pointer-events:auto <div> in the fall layer that tracks the
  // icon's position every physics frame.  Because it sits inside the fall layer
  // (z-index: 43, above all page content) and explicitly sets pointer-events:auto
  // it absorbs hover, pointerdown AND click events before they can ever reach an
  // app-tile link beneath the icon — regardless of the icon's launchReady state.
  // ---------------------------------------------------------------------------

  const createMarkDeadZone = (mark, isDesktop) => {
    if (!mark) return;
    const pad = BRAND_MARK_CLICK_BLOCK_PAD;
    const el = document.createElement("div");
    el.className = "sds-physics-mark-dead-zone";
    el.style.cssText = (
      "position:fixed;"
      + "left:-9999px;top:0;"
      + `width:${mark.width + pad * 2}px;`
      + `height:${mark.height + pad * 2}px;`
      + "pointer-events:auto;"
      + "background:transparent;"
      + "touch-action:manipulation;"
    );

    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (userPhysicsDisabled) return;
      if (!isDesktop) {
        launchBrandMarkFromCard(mobileMark);
      } else if (desktopBrandMark?.launchReady) {
        launchDesktopBrandMark();
      }
    });

    // Block the follow-up click so it cannot fall through to links below.
    el.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });

    getFallLayer().appendChild(el);
    mark.deadZoneEl = el;
  };

  const syncMarkDeadZone = (mark) => {
    if (!mark?.deadZoneEl || !mark.body) return;
    const pad = BRAND_MARK_CLICK_BLOCK_PAD;
    mark.deadZoneEl.style.left = `${mark.body.position.x - mark.width * 0.5 - pad}px`;
    mark.deadZoneEl.style.top  = `${mark.body.position.y - mark.height * 0.5 - pad}px`;
  };

  const destroyMarkDeadZone = (mark) => {
    mark?.deadZoneEl?.remove();
    if (mark) mark.deadZoneEl = null;
  };

  const setMarkDeadZoneCursor = (mark, cursor) => {
    if (mark?.deadZoneEl) mark.deadZoneEl.style.cursor = cursor;
  };

  // ---------------------------------------------------------------------------

  const syncBrandMarkDom = (mark) => {
    if (!mark?.released || !mark.body) return;
    gsap.set(mark.el, {
      x: mark.body.position.x,
      y: mark.body.position.y,
      xPercent: -50,
      yPercent: -50,
      rotation: mark.body.angle * (180 / Math.PI)
    });
    syncMarkDeadZone(mark);
  };

  const syncMobileMark = () => syncBrandMarkDom(mobileMark);

  const syncDesktopBrandMark = () => syncBrandMarkDom(desktopBrandMark);

  const setDesktopBrandMarkFloorAnchor = (anchor) => {
    if (!desktopBrandMark) return;
    if (desktopBrandMark.floorAnchor === anchor) return;

    desktopBrandMark.floorAnchor = anchor;
    lastDesktopMarkScrollY = getPageScrollY();
    desktopBrandMark.el?.classList.toggle("is-gallery-anchored", anchor === "gallery");
    getFallLayer().classList.toggle("is-desktop-mark-gallery-anchored", anchor === "gallery");
    refreshEnvironmentColliders();
  };

  const setMobileBrandMarkFloorAnchor = (anchor) => {
    if (!mobileMark) return;
    if (mobileMark.floorAnchor === anchor) return;

    mobileMark.floorAnchor = anchor;
    lastMobileMarkScrollY = getPageScrollY();
    mobileMark.el?.classList.toggle("is-gallery-anchored", anchor === "gallery");
    getFallLayer().classList.toggle("is-mobile-mark-gallery-anchored", anchor === "gallery");
    refreshEnvironmentColliders();
  };

  const shiftGalleryAnchoredPhysicsByScrollDelta = (delta) => {
    if (!delta) return;

    const anchoredMark = getActiveGalleryAnchoredMark();
    if (!anchoredMark?.body || anchoredMark.scrollKnockFalling) return;

    const markBody = anchoredMark.body;
    Body.setPosition(markBody, {
      x: markBody.position.x,
      y: markBody.position.y - delta
    });

    environmentBodies
      .filter((body) => body.label === GALLERY_FLOOR_LABEL)
      .forEach((galleryFloor) => {
        Body.setPosition(galleryFloor, {
          x: galleryFloor.position.x,
          y: galleryFloor.position.y - delta
        });
      });
  };

  const canReleaseMobileBrandMarkOnScroll = () => (
    isPhysicsInteractive()
    && getMobilePhysicsActive()
    && !lowPerformance
    && !mobileMark
  );

  const canReleaseMobileBrandMarkEarly = () => (
    canReleaseMobileBrandMarkOnScroll()
    && root.classList.contains("is-ready")
  );

  const getBrandMarkScrollReleaseThresholdY = () => (
    getNavBannerBottomY() + MOBILE_MARK_SCROLL_RELEASE_BANNER_PAD
  );

  const getBrandMarkScrollReleaseSource = () => {
    const source = document.querySelector(MOBILE_MARK_SELECTOR);
    if (!source || source.classList.contains("sds-hero__brand-mark--physics-captured")) {
      return null;
    }
    return source;
  };

  const getMobileBrandMarkEarlyReleaseSource = () => getBrandMarkScrollReleaseSource();

  const isBrandMarkSourceAtScrollReleaseThreshold = (source) => {
    if (!source) return false;
    return source.getBoundingClientRect().top <= getBrandMarkScrollReleaseThresholdY();
  };

  const tryReleaseMobileBrandMarkEarly = (options = {}) => {
    const { allowBeforeReady = false } = options;
    const canRelease = allowBeforeReady
      ? canReleaseMobileBrandMarkOnScroll()
      : canReleaseMobileBrandMarkEarly();
    if (!canRelease) return false;
    if (!getMobileBrandMarkEarlyReleaseSource()) return false;

    spawnMobileBrandMark();
    ensureMobileAccel();
    return Boolean(mobileMark);
  };

  const checkMobileBrandMarkScrollRelease = () => {
    if (!canReleaseMobileBrandMarkOnScroll()) return;

    const source = getBrandMarkScrollReleaseSource();
    if (!isBrandMarkSourceAtScrollReleaseThreshold(source)) return;

    tryReleaseMobileBrandMarkEarly({ allowBeforeReady: true });
  };

  const canReleaseDesktopBrandMarkOnScroll = () => (
    isPhysicsInteractive()
    && getDesktopPhysicsActive()
    && !lowPerformance
    && !desktopBrandMark
    && !desktopBrandMarkReleasing
    && !mobileMark
  );

  const checkDesktopBrandMarkScrollRelease = () => {
    if (!canReleaseDesktopBrandMarkOnScroll()) return;

    const source = getBrandMarkScrollReleaseSource();
    if (!isBrandMarkSourceAtScrollReleaseThreshold(source)) return;

    engageDesktopBrandMark();
  };

  const runBannerKnockLooseChecks = () => {
    if (userPhysicsDisabled) return;
    checkMobileBrandMarkScrollRelease();
    checkDesktopBrandMarkScrollRelease();
  };

  const syncBannerKnockLooseFromScroll = () => {
    const scrollY = getPageScrollY();
    if (scrollY === lastBannerKnockScrollY) return;
    lastBannerKnockScrollY = scrollY;
    runBannerKnockLooseChecks();
  };

  const getMobileMarkHalfHeight = (mark) => Math.max((mark?.height || 40) * 0.45, 12);

  const getMobileMarkTopEdgeY = (mark) => {
    if (!mark?.body) return Infinity;
    return mark.body.position.y - getMobileMarkHalfHeight(mark);
  };

  const getMobileMarkBottomEdgeY = (mark) => {
    if (!mark?.body) return -Infinity;
    return mark.body.position.y + getMobileMarkHalfHeight(mark);
  };

  const isMobileMarkIntersectingMenuTop = (mark = mobileMark) => {
    if (!mark?.body) return false;

    const menuTopY = getMobileHomeServicesMenuTopY();
    const topEdge = getMobileMarkTopEdgeY(mark);
    const bottomEdge = getMobileMarkBottomEdgeY(mark);
    const bandTop = menuTopY - MOBILE_MENU_BARRIER_PAD;
    const bandBottom = menuTopY + MOBILE_MENU_BARRIER_THICKNESS + MOBILE_MENU_BARRIER_PAD;

    return bottomEdge >= bandTop && topEdge <= bandBottom;
  };

  const getMobileViewportBottomSettleY = (mark = mobileMark) => {
    const halfHeight = getMobileMarkHalfHeight(mark);
    const menuTopY = getMobileHomeServicesMenuTopY();
    return menuTopY - halfHeight - MOBILE_MARK_SCROLL_FLOOR_SETTLE_PAD;
  };

  const beginMobileMarkScrollKnockFall = (mark) => {
    if (!mark?.body || mark.scrollKnockFalling) return;

    const now = performance.now();
    if (now < (mark.scrollKnockCooldownUntil || 0)) return;

    const halfHeight = getMobileMarkHalfHeight(mark);
    const menuTopY = getMobileHomeServicesMenuTopY();
    const releaseY = menuTopY + halfHeight + MOBILE_MARK_SCROLL_FLOOR_SETTLE_PAD;

    mark.scrollKnockFalling = true;
    mark.scrollKnockTargetFloorY = getMobileViewportBottomSettleY(mark);
    mark.activeGalleryFloorY = null;
    mark.menuKnockCount = (mark.menuKnockCount || 0) + 1;

    if (mark.floorAnchor === "gallery") {
      mark.floorAnchor = "viewport";
      mark.el?.classList.remove("is-gallery-anchored");
      getFallLayer().classList.remove("is-mobile-mark-gallery-anchored");
      lastMobileMarkScrollY = getPageScrollY();
    }

    Body.setPosition(mark.body, {
      x: mark.body.position.x,
      y: releaseY
    });
    Body.setVelocity(mark.body, {
      x: mark.body.velocity.x * 0.32,
      y: MOBILE_MARK_SCROLL_FLOOR_FALL_VY
    });
    Body.setAngularVelocity(mark.body, mark.body.angularVelocity * 0.35);

    refreshEnvironmentColliders();
    syncBrandMarkDom(mark);
  };

  const finishMobileMarkScrollKnockFall = (mark) => {
    if (!mark?.scrollKnockFalling) return;

    mark.scrollKnockFalling = false;
    mark.scrollKnockTargetFloorY = null;
    mark.scrollKnockCooldownUntil = performance.now() + MOBILE_MARK_SCROLL_KNOCK_COOLDOWN_MS;
    setMobileBrandMarkFloorAnchor("viewport");
  };

  const checkMobileMarkMenuTopKnock = (scrollY, lastScrollY) => {
    if (!getMobilePhysicsActive() || !mobileMark?.released || !mobileMark.body) return;
    if (mobileMark.scrollKnockFalling) return;
    if (performance.now() < (mobileMark.scrollKnockCooldownUntil || 0)) return;
    if (scrollY === lastScrollY) return;
    if (!isMobileMarkIntersectingMenuTop(mobileMark)) return;

    beginMobileMarkScrollKnockFall(mobileMark);
  };

  const updateMobileMarkScrollKnockFall = () => {
    if (!mobileMark?.scrollKnockFalling || !mobileMark.body) return;

    const { y } = mobileMark.body.position;
    const vy = mobileMark.body.velocity.y;
    const targetFloorY = mobileMark.scrollKnockTargetFloorY ?? getMobileViewportBottomSettleY(mobileMark);

    const settled = y >= targetFloorY - MOBILE_MARK_SCROLL_FLOOR_SNAP_PX
      && Math.abs(y - targetFloorY) <= MOBILE_MARK_SCROLL_FLOOR_SNAP_PX
      && Math.abs(vy) <= MOBILE_MARK_SCROLL_FLOOR_SETTLE_VY;

    if (!settled) return;

    Body.setPosition(mobileMark.body, {
      x: mobileMark.body.position.x,
      y: targetFloorY
    });
    Body.setVelocity(mobileMark.body, {
      x: mobileMark.body.velocity.x * 0.18,
      y: 0
    });
    Body.setAngularVelocity(mobileMark.body, mobileMark.body.angularVelocity * 0.2);

    finishMobileMarkScrollKnockFall(mobileMark);
  };

  const checkMobileHeroGalleryZoneTransition = () => {
    if (!getMobilePhysicsActive() || !mobileMark?.released) return;

    const inGallery = isMobileMarkInGalleryZone();
    if (inGallery === mobileMark.wasInGalleryZone) return;

    mobileMark.wasInGalleryZone = inGallery;
    refreshEnvironmentColliders();
  };

  const onBrandMarkScroll = () => {
    const scrollY = getPageScrollY();
    lastBannerKnockScrollY = scrollY;
    runBannerKnockLooseChecks();
    const previousMobileScrollY = lastMobileMarkScrollY;
    const anchoredMark = getActiveGalleryAnchoredMark();

    if (getMobilePhysicsActive() && mobileMark?.released) {
      checkMobileMarkMenuTopKnock(scrollY, previousMobileScrollY);
      if (mobileMark.scrollKnockFalling && scrollY !== previousMobileScrollY) {
        refreshEnvironmentColliders();
      }
    }

    if (!anchoredMark) {
      lastDesktopMarkScrollY = scrollY;
      lastMobileMarkScrollY = scrollY;
      return;
    }

    const lastY = anchoredMark === desktopBrandMark
      ? lastDesktopMarkScrollY
      : lastMobileMarkScrollY;
    const delta = scrollY - lastY;

    if (anchoredMark === desktopBrandMark) {
      lastDesktopMarkScrollY = scrollY;
    } else {
      lastMobileMarkScrollY = scrollY;
    }

    if (!delta) return;

    shiftGalleryAnchoredPhysicsByScrollDelta(delta);
    syncBrandMarkDom(anchoredMark);
  };

  const bindBrandMarkScroll = () => {
    if (brandMarkScrollBound) return;
    brandMarkScrollBound = true;
    lastDesktopMarkScrollY = getPageScrollY();
    lastMobileMarkScrollY = getPageScrollY();
    lastBannerKnockScrollY = getPageScrollY();
    window.addEventListener("scroll", onBrandMarkScroll, { passive: true });
    window.requestAnimationFrame(() => {
      runBannerKnockLooseChecks();
    });
  };

  const checkBrandMarkFloorAnchorTransition = (mark, setFloorAnchor) => {
    if (!mark?.body || !mark.released || mark.floorAnchor !== "gallery") return;

    const { bottomFloorY } = getGalleryFloorMetrics();
    const floorYs = getGalleryFloorYs();
    const topGalleryFloorY = Math.min(...floorYs);
    const bottomGalleryFloorY = Math.max(...floorYs);
    const { y } = mark.body.position;
    const vy = mark.body.velocity.y;

    if (vy < DESKTOP_MARK_UPWARD_PASS_VY && y < topGalleryFloorY - 36) {
      if (mark === mobileMark) {
        mark.activeGalleryFloorY = null;
      }
      setFloorAnchor("viewport");
      return;
    }

    if (y > bottomGalleryFloorY + 96 && y >= bottomFloorY - 72) {
      if (mark === mobileMark) {
        mark.activeGalleryFloorY = null;
      }
      setFloorAnchor("viewport");
    }
  };

  const checkDesktopBrandMarkFloorAnchor = () => {
    if (!getDesktopPhysicsActive()) return;
    checkBrandMarkFloorAnchorTransition(desktopBrandMark, setDesktopBrandMarkFloorAnchor);
  };

  const checkMobileBrandMarkFloorAnchor = () => {
    if (!getMobilePhysicsActive()) return;
    checkBrandMarkFloorAnchorTransition(mobileMark, setMobileBrandMarkFloorAnchor);
  };

  const handleMobileBrandMarkFloorContact = (markBody, floorLabel = "") => {
    if (floorLabel === GALLERY_FLOOR_LABEL) {
      if (mobileMark?.scrollKnockFalling) {
        const downwardVy = markBody.velocity.y;
        if (downwardVy > 0.28) {
          Body.setVelocity(markBody, {
            x: markBody.velocity.x * 0.42,
            y: -downwardVy * MOBILE_MARK_FLOOR_RESTITUTION
          });
        }
        return;
      }

      if (mobileMark) {
        mobileMark.activeGalleryFloorY = getNearestGalleryFloorY(markBody.position.y);
      }
      setMobileBrandMarkFloorAnchor("gallery");
      return;
    }

    if (floorLabel === "view-bottom") {
      if (mobileMark) {
        mobileMark.activeGalleryFloorY = null;
      }
      if (mobileMark?.scrollKnockFalling) {
        finishMobileMarkScrollKnockFall(mobileMark);
      }
      setMobileBrandMarkFloorAnchor("viewport");
    }
  };

  const handleMobileBrandMarkMenuBarrierContact = (markBody) => {
    if (!getMobilePhysicsActive() || !mobileMark?.released || !mobileMark.body) return;
    if (mobileMark.scrollKnockFalling) return;
    if (performance.now() < (mobileMark.scrollKnockCooldownUntil || 0)) return;
    if (markBody.velocity.y <= 0.08) return;

    beginMobileMarkScrollKnockFall(mobileMark);
  };

  const getHeroCopy = () => document.querySelector(".sds-hero__copy");

  const restoreBrandMarkSource = () => {
    const source = document.querySelector(MOBILE_MARK_SELECTOR);
    if (!source) return;

    window.clearTimeout(brandMarkCollapseTimer);
    brandMarkCollapseTimer = 0;

    const heroCopy = getHeroCopy();
    if (heroCopy) {
      heroCopy.classList.remove("sds-hero__copy--mark-collapsed");
    }

    if (brandMarkSpacer) {
      gsap.killTweensOf(brandMarkSpacer);
      brandMarkSpacer.style.removeProperty("overflow");
      brandMarkSpacer.style.removeProperty("height");
      brandMarkSpacer.style.removeProperty("margin-top");
      brandMarkSpacer.style.removeProperty("margin-bottom");
      brandMarkSpacer.remove();
      brandMarkSpacer = null;
    }

    gsap.killTweensOf(source);
    source.style.removeProperty("display");
    source.classList.remove("sds-hero__brand-mark--physics-captured", "sds-hero__brand-mark--physics-freeze");
  };

  const getSpacerCollapseDistance = (spacer) => {
    const computed = window.getComputedStyle(spacer);
    const marginTop = parseFloat(computed.marginTop) || 0;
    const marginBottom = parseFloat(computed.marginBottom) || 0;
    return Math.ceil(spacer.offsetHeight + marginTop + marginBottom);
  };

  const createBrandMarkSpacer = (source, measuredRect) => {
    const computed = window.getComputedStyle(source);
    const spacer = document.createElement("div");
    spacer.className = MOBILE_MARK_SPACER_CLASS;
    spacer.setAttribute("aria-hidden", "true");
    spacer.style.height = `${Math.ceil(measuredRect.height)}px`;
    spacer.style.width = `${Math.ceil(measuredRect.width)}px`;
    spacer.style.marginTop = computed.marginTop;
    spacer.style.marginRight = computed.marginRight;
    spacer.style.marginBottom = computed.marginBottom;
    spacer.style.marginLeft = computed.marginLeft;
    source.parentNode.insertBefore(spacer, source);
    brandMarkSpacer = spacer;
    return spacer;
  };

  const hideBrandMarkSourceInstant = (source) => {
    source.classList.add("sds-hero__brand-mark--physics-captured");
  };

  const collapseBrandMarkSpacer = () => {
    const spacer = brandMarkSpacer;
    const heroCopy = getHeroCopy();
    if (!spacer || !heroCopy) return;

    const shift = getSpacerCollapseDistance(spacer);
    if (!shift) {
      spacer.remove();
      brandMarkSpacer = null;
      heroCopy.classList.add("sds-hero__copy--mark-collapsed");
      return;
    }

    heroCopy.classList.add("sds-hero__copy--mark-collapsed");
    gsap.killTweensOf(spacer);
    spacer.style.overflow = "hidden";

    gsap.to(spacer, {
      height: 0,
      marginTop: 0,
      marginBottom: 0,
      duration: MOBILE_MARK_COLLAPSE_DURATION,
      ease: "power2.out",
      onComplete: () => {
        spacer.remove();
        if (brandMarkSpacer === spacer) {
          brandMarkSpacer = null;
        }
      }
    });
  };

  const scheduleBrandMarkSpacerCollapse = () => {
    window.clearTimeout(brandMarkCollapseTimer);
    brandMarkCollapseTimer = window.setTimeout(
      () => collapseBrandMarkSpacer(),
      MOBILE_MARK_COLLAPSE_DELAY_MS
    );
  };

  const teardownDesktopBrandMark = () => {
    if (desktopBrandMark) {
      window.clearTimeout(desktopBrandMark.launchArmTimer);
      if (desktopBrandMark.launchClickHandler) {
        desktopBrandMark.el?.removeEventListener("pointerdown", desktopBrandMark.launchClickHandler);
        desktopBrandMark.el?.removeEventListener("click", desktopBrandMark.launchClickHandler);
      }
      destroyMarkDeadZone(desktopBrandMark);
      if (desktopBrandMark.body && engine) {
        Composite.remove(engine.world, desktopBrandMark.body);
      }
      desktopBrandMark.el?.remove();
      desktopBrandMark = null;
    }

    const layer = getFallLayer();
    layer.classList.remove(
      "is-desktop-mark-launchable",
      "is-desktop-mark-gallery-anchored",
      "is-mobile-mark-gallery-anchored"
    );
    layer.style.removeProperty("z-index");
    desktopBrandMarkLetterHitsEnabled = false;
    restoreBrandMarkSource();

    if (!hasActiveLetters() && !mobileMark?.released) {
      root.classList.remove("is-falling");
      wordmark?.classList.remove("is-physics-falling");
    }

    if (engine) {
      refreshEnvironmentColliders();
    }
  };

  const teardownMobilePhysics = () => {
    if (accelListener) {
      window.removeEventListener("deviceorientation", accelListener, true);
      accelListener = null;
    }
    accelBound = false;

    if (mobileMark) {
      if (mobileMark.body && engine) {
        Composite.remove(engine.world, mobileMark.body);
      }
      destroyMarkDeadZone(mobileMark);
      mobileMark.el?.remove();
      mobileMark = null;
    }

    mobileMarkLetterHitsEnabled = false;
    getFallLayer().classList.remove("is-mobile-mark-gallery-anchored");

    const earlyReleaseSource = document.querySelector(MOBILE_MARK_SELECTOR);
    if (earlyReleaseSource && mobileMarkEarlyReleaseHandler) {
      earlyReleaseSource.removeEventListener("pointerdown", mobileMarkEarlyReleaseHandler);
      earlyReleaseSource.removeEventListener("click", mobileMarkEarlyReleaseHandler);
    }
    mobileMarkEarlyReleaseHandler = null;
    mobileMarkEarlyReleaseBound = false;

    restoreBrandMarkSource();
    root.classList.remove("is-mobile-physics");

    if (engine) {
      engine.gravity.x = 0;
      engine.gravity.y = 0.2;
    }
  };

  const setupMobilePhysics = () => {
    if (!getMobilePhysicsActive()) return;
    root.classList.add("is-mobile-physics");
    getFallLayer();

    const source = getMobileBrandMarkEarlyReleaseSource();
    if (source) {
      source.classList.add("sds-hero__brand-mark--physics-freeze");
    }

    bindMobileBrandMarkEarlyRelease();
  };

  const bindMobileBrandMarkEarlyRelease = () => {
    if (mobileMarkEarlyReleaseBound || !getMobilePhysicsActive()) return;

    const source = document.querySelector(MOBILE_MARK_SELECTOR);
    if (!source) return;

    mobileMarkEarlyReleaseHandler = (event) => {
      if (!getMobilePhysicsActive()) return;
      // Always consume the interaction when mobile physics is active so the
      // source element never lets a click fall through to links below it,
      // regardless of whether the early-release attempt succeeds.
      event.preventDefault();
      event.stopPropagation();
      tryReleaseMobileBrandMarkEarly();
    };

    mobileMarkEarlyReleaseBound = true;
    source.addEventListener("pointerdown", mobileMarkEarlyReleaseHandler);
    source.addEventListener("click", mobileMarkEarlyReleaseHandler);
  };

  const bindAccelerometer = () => {
    if (accelBound || !engine) return;

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    accelListener = (event) => {
      if (!engine || !getMobilePhysicsActive() || userPhysicsDisabled) return;

      const gamma = event.gamma;
      const beta = event.beta;
      if (gamma == null || beta == null) return;

      const accelScale = getMobileAccelGravityScale();
      engine.gravity.x = clamp(gamma / 38, -1.1, 1.1) * accelScale;
      engine.gravity.y = clamp((beta - 48) / 52 + 0.42, 0.1, 1.1) * accelScale;
      if (accelScale < 1) {
        engine.gravity.y = Math.max(engine.gravity.y, 0.2 * accelScale);
      }
    };

    window.addEventListener("deviceorientation", accelListener, true);
    accelBound = true;
  };

  const requestAccelerometerAccess = async () => {
    if (accelBound) return true;

    if (typeof DeviceOrientationEvent !== "undefined"
      && typeof DeviceOrientationEvent.requestPermission === "function") {
      try {
        const state = await DeviceOrientationEvent.requestPermission();
        if (state !== "granted") return false;
      } catch (error) {
        return false;
      }
    }

    return true;
  };

  const ensureMobileAccel = async () => {
    if (!getMobilePhysicsActive() || accelBound) return;
    const granted = await requestAccelerometerAccess();
    if (granted) bindAccelerometer();
  };

  const spawnMobileBrandMark = () => {
    if (!getMobilePhysicsActive() || mobileMark || lowPerformance || userPhysicsDisabled) return;

    const source = document.querySelector(MOBILE_MARK_SELECTOR);
    if (!source) return;

    ensurePhysicsWorld();

    source.classList.add("sds-hero__brand-mark--physics-freeze");

    const sourceRect = source.getBoundingClientRect();
    if (sourceRect.width < 4 || sourceRect.height < 4) {
      source.classList.remove("sds-hero__brand-mark--physics-freeze");
      return;
    }

    const startX = sourceRect.left + sourceRect.width * 0.5;
    const startY = sourceRect.top + sourceRect.height * 0.5;
    const width = sourceRect.width;
    const height = sourceRect.height;
    const bodyWidth = Math.max(width * 0.9, 12);
    const bodyHeight = Math.max(height * 0.9, 12);

    const el = source.cloneNode(true);
    el.id = MOBILE_MARK_ID;
    el.className = "sds-physics-mobile-mark";
    el.removeAttribute("width");
    el.removeAttribute("height");
    el.style.position = "fixed";
    el.style.left = "0";
    el.style.top = "0";
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.margin = "0";
    el.style.pointerEvents = "none";
    el.style.zIndex = "44";
    el.style.animation = "none";
    el.style.transform = "none";
    el.style.willChange = "transform";

    const layer = getFallLayer();

    createBrandMarkSpacer(source, sourceRect);
    hideBrandMarkSourceInstant(source);
    layer.appendChild(el);

    gsap.set(el, {
      x: startX,
      y: startY,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      rotation: 0,
      force3D: true
    });

    const body = Bodies.rectangle(startX, startY, bodyWidth, bodyHeight, {
      ...LETTER_PHYSICS,
      chamfer: { radius: 4 },
      label: MOBILE_MARK_LABEL
    });

    Body.setPosition(body, { x: startX, y: startY });
    Body.setVelocity(body, { x: 0, y: 0 });
    Body.setAngularVelocity(body, 0);
    Body.set(body, { collisionFilter: getBrandMarkCollisionFilter() });

    mobileMarkLetterHitsEnabled = false;
    mobileMark = {
      el,
      body,
      released: true,
      width,
      height,
      floorAnchor: "viewport",
      activeGalleryFloorY: null,
      scrollKnockFalling: false,
      scrollKnockTargetFloorY: null,
      scrollKnockCooldownUntil: 0,
      menuKnockCount: 0,
      wasInGalleryZone: false
    };
    createMarkDeadZone(mobileMark, false);
    lastMobileMarkScrollY = getPageScrollY();
    bindBrandMarkScroll();
    Composite.add(engine.world, body);
    syncMobileMark();

    if (!runnerActive) {
      startRunner();
    }

    window.requestAnimationFrame(() => {
      refreshEnvironmentColliders();
    });

    scheduleBrandMarkSpacerCollapse();
  };

  const createBrandMarkClone = (source, sourceRect, config) => {
    const { id, className } = config;
    const width = sourceRect.width;
    const height = sourceRect.height;
    const el = source.cloneNode(true);

    el.id = id;
    el.className = className;
    el.removeAttribute("width");
    el.removeAttribute("height");
    el.style.position = "fixed";
    el.style.left = "0";
    el.style.top = "0";
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.margin = "0";
    el.style.pointerEvents = "none";
    el.style.zIndex = "44";
    el.style.animation = "none";
    el.style.transform = "none";
    el.style.willChange = "transform";

    return el;
  };

  const releaseBrandMarkIntoPhysics = ({
    source,
    sourceRect,
    cloneConfig,
    bodyPhysics,
    bodyLabel,
    initialVelocity,
    initialAngularVelocity
  }) => {
    const startX = sourceRect.left + sourceRect.width * 0.5;
    const startY = sourceRect.top + sourceRect.height * 0.5;
    const width = sourceRect.width;
    const height = sourceRect.height;
    const bodyWidth = Math.max(width * 0.9, 12);
    const bodyHeight = Math.max(height * 0.9, 12);
    const el = createBrandMarkClone(source, sourceRect, cloneConfig);
    const layer = getFallLayer();

    createBrandMarkSpacer(source, sourceRect);
    hideBrandMarkSourceInstant(source);
    layer.appendChild(el);

    gsap.set(el, {
      x: startX,
      y: startY,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      rotation: 0,
      force3D: true
    });

    const body = Bodies.rectangle(startX, startY, bodyWidth, bodyHeight, {
      ...bodyPhysics,
      chamfer: { radius: 4 },
      label: bodyLabel
    });

    Body.setPosition(body, { x: startX, y: startY });
    Body.setVelocity(body, initialVelocity || { x: 0, y: 0 });
    Body.setAngularVelocity(body, initialAngularVelocity || 0);
    Body.set(body, { collisionFilter: getBrandMarkCollisionFilter() });

    const mark = { el, body, released: true, width, height };
    Composite.add(engine.world, body);
    syncBrandMarkDom(mark);

    if (!runnerActive) {
      startRunner();
    }

    window.requestAnimationFrame(() => {
      refreshEnvironmentColliders();
    });

    scheduleBrandMarkSpacerCollapse();

    return mark;
  };

  const markDesktopBrandMarkFloorReached = () => {
    if (!desktopBrandMark) return;

    desktopBrandMark.hasReachedFloor = true;

    if (!desktopBrandMarkLetterHitsEnabled) {
      desktopBrandMarkLetterHitsEnabled = true;
      applyBrandMarkCollisionFilter(desktopBrandMark);
      refreshEnvironmentColliders();
    }

    if (!desktopBrandMark.launchReady) {
      armDesktopBrandMarkLaunch();
    }
  };

  const activateDesktopBrandMarkLetterHits = () => {
    markDesktopBrandMarkFloorReached();
  };

  const armDesktopBrandMarkLaunch = () => {
    if (!desktopBrandMark || desktopBrandMark.launchReady || !desktopBrandMark.hasReachedFloor) return;

    window.clearTimeout(desktopBrandMark.launchArmTimer);
    desktopBrandMark.launchArmTimer = window.setTimeout(() => {
      if (!desktopBrandMark || desktopBrandMark.launchReady || !desktopBrandMark.hasReachedFloor) return;
      if (desktopBrandMark.body && isDesktopBrandMarkSlowEnoughToClick(desktopBrandMark.body)) {
        setDesktopBrandMarkLaunchReady(true);
        return;
      }
      checkDesktopMarkLaunchReady();
    }, DESKTOP_MARK_LAUNCH_ARM_DELAY_MS);
  };

  const BRAND_MARK_LAUNCH_HIT_PAD = 10;
  // Slightly larger dead-zone used to block click events that follow a
  // pointerdown on or near the icon so no link behind it can be triggered.
  const BRAND_MARK_CLICK_BLOCK_PAD = 24;

  const isPointerOnBrandMark = (event, mark) => {
    if (!mark?.el || !mark.released) return false;

    const rect = mark.el.getBoundingClientRect();
    const pad = BRAND_MARK_LAUNCH_HIT_PAD;

    return (
      event.clientX >= rect.left - pad
      && event.clientX <= rect.right + pad
      && event.clientY >= rect.top - pad
      && event.clientY <= rect.bottom + pad
    );
  };

  const isPointerOnDesktopBrandMark = (event) => isPointerOnBrandMark(event, desktopBrandMark);

  // Wider hit-test used only for click-blocking; gives a small dead-zone
  // around the icon so a click can never fall through to links below it.
  const isPointerNearBrandMark = (event, mark) => {
    if (!mark?.el || !mark.released) return false;
    const rect = mark.el.getBoundingClientRect();
    const pad = BRAND_MARK_CLICK_BLOCK_PAD;
    return (
      event.clientX >= rect.left - pad
      && event.clientX <= rect.right + pad
      && event.clientY >= rect.top - pad
      && event.clientY <= rect.bottom + pad
    );
  };

  const bindDesktopBrandMarkElementLaunch = () => {
    if (!desktopBrandMark?.el || desktopBrandMark.launchClickHandler) return;

    const onLaunchClick = (event) => {
      if (userPhysicsDisabled || !desktopBrandMark?.launchReady) return;
      event.preventDefault();
      event.stopPropagation();
      launchDesktopBrandMark();
    };

    desktopBrandMark.launchClickHandler = onLaunchClick;
    desktopBrandMark.el.addEventListener("pointerdown", onLaunchClick);
    desktopBrandMark.el.addEventListener("click", onLaunchClick);
  };

  const bindDesktopBrandMarkLaunchLayer = () => {
    if (desktopMarkLaunchLayerBound) return;

    desktopLaunchPointerHandler = (event) => {
      if (
        userPhysicsDisabled
        || !getDesktopPhysicsActive()
        || !isPointerOnDesktopBrandMark(event)
      ) {
        return;
      }

      // Always consume the event when the pointer lands on the brand mark while
      // desktop physics is active — even if it is not yet launch-ready.  This
      // prevents the click from falling through to links beneath the bouncing
      // icon.  The launch action is only triggered once the mark is ready.
      event.preventDefault();
      event.stopPropagation();

      if (desktopBrandMark?.launchReady) {
        launchDesktopBrandMark();
      }
    };

    // Block the click event that the browser fires after the pointerdown.
    // Without this, the launch action fires on pointerdown (which sets
    // pointer-events:none on the element), and the subsequent click passes
    // straight through to any link sitting beneath the icon.
    desktopLaunchClickHandler = (event) => {
      if (
        userPhysicsDisabled
        || !getDesktopPhysicsActive()
        || !isPointerNearBrandMark(event, desktopBrandMark)
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("pointerdown", desktopLaunchPointerHandler, true);
    document.addEventListener("click", desktopLaunchClickHandler, true);
    desktopMarkLaunchLayerBound = true;
  };

  const bindMobileBrandMarkLaunchLayer = () => {
    if (mobileMarkLaunchLayerBound) return;

    mobileLaunchPointerHandler = (event) => {
      if (userPhysicsDisabled || !getMobilePhysicsActive()) return;

      const mark = getVisibleLaunchableBrandMark();
      if (mark !== mobileMark || !isPointerOnBrandMark(event, mark)) return;

      event.preventDefault();
      event.stopPropagation();
      launchBrandMarkFromCard(mark);
    };

    // Block the click that follows a pointerdown on the mobile mark so it
    // cannot reach any link beneath the bouncing icon.
    mobileLaunchClickHandler = (event) => {
      if (userPhysicsDisabled || !getMobilePhysicsActive()) return;
      if (!isPointerNearBrandMark(event, mobileMark)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    document.addEventListener("pointerdown", mobileLaunchPointerHandler, true);
    document.addEventListener("click", mobileLaunchClickHandler, true);
    mobileMarkLaunchLayerBound = true;
  };

  const setDesktopBrandMarkLaunchReady = (ready) => {
    if (!desktopBrandMark?.el) return;

    const layer = getFallLayer();
    const wasReady = desktopBrandMark.launchReady;
    desktopBrandMark.launchReady = ready;
    desktopBrandMark.el.style.pointerEvents = ready ? "auto" : "none";
    desktopBrandMark.el.style.cursor = ready ? "pointer" : "";
    desktopBrandMark.el.classList.toggle("is-launch-ready", ready);
    setMarkDeadZoneCursor(desktopBrandMark, ready ? "pointer" : "default");
    layer.classList.toggle("is-desktop-mark-launchable", ready);

    if (ready) {
      if (getDesktopMarkBounceIntensity() < DESKTOP_MARK_LAUNCH_BOUNCE_REFILL) {
        desktopBrandMark.bounceIntensity = DESKTOP_MARK_LAUNCH_BOUNCE_REFILL;
        syncDesktopMarkBodyRestitution();
        refreshEnvironmentColliders();
      }
      layer.style.zIndex = DESKTOP_MARK_LAUNCH_LAYER_Z;
      bindDesktopBrandMarkElementLaunch();
    } else if (wasReady) {
      layer.style.removeProperty("z-index");
    }
  };

  const applyBrandMarkLaunchImpulse = (mark) => {
    if (!mark?.body) return false;

    const body = mark.body;
    const launchSign = Math.random() < 0.5 ? -1 : 1;

    if (mark === desktopBrandMark) {
      desktopBrandMark.screenBounceMode = true;
      desktopBrandMark.bounceIntensity = Math.max(getDesktopMarkBounceIntensity(), 0.74);
      desktopBrandMark.slowFrames = 0;
      window.clearTimeout(desktopBrandMark.launchArmTimer);
      setDesktopBrandMarkLaunchReady(false);
      syncDesktopMarkBodyRestitution();
      activateDesktopBrandMarkLetterHits();
    }

    Body.setVelocity(body, {
      x: launchSign * (DESKTOP_MARK_LAUNCH_VELOCITY_X * (0.72 + Math.random() * 0.56)),
      y: DESKTOP_MARK_LAUNCH_VELOCITY_Y - Math.random() * 2.8
    });
    Body.setAngularVelocity(body, launchSign * (0.18 + Math.random() * 0.2));

    root.classList.add("is-falling");
    wordmark?.classList.add("is-physics-falling");
    refreshEnvironmentColliders();

    if (!runnerActive) {
      startRunner();
    }

    return true;
  };

  const launchDesktopBrandMark = () => {
    if (
      userPhysicsDisabled
      || !getDesktopPhysicsActive()
      || !desktopBrandMark?.body
      || !desktopBrandMark.launchReady
    ) {
      return;
    }

    applyBrandMarkLaunchImpulse(desktopBrandMark);
  };

  const isBrandMarkInViewport = (mark) => {
    if (!mark?.el || !mark.released) return false;

    const rect = mark.el.getBoundingClientRect();
    return (
      rect.bottom > 0
      && rect.top < window.innerHeight
      && rect.right > 0
      && rect.left < window.innerWidth
    );
  };

  const getVisibleLaunchableBrandMark = () => {
    if (
      getDesktopPhysicsActive()
      && desktopBrandMark?.released
      && isBrandMarkInViewport(desktopBrandMark)
    ) {
      return desktopBrandMark;
    }

    if (
      getMobilePhysicsActive()
      && mobileMark?.released
      && isBrandMarkInViewport(mobileMark)
    ) {
      return mobileMark;
    }

    return null;
  };

  const launchBrandMarkFromCard = (mark) => {
    if (!mark?.body || prefersReducedMotion || lowPerformance) return false;
    ensurePhysicsWorld();
    return applyBrandMarkLaunchImpulse(mark);
  };

  const applyDesktopMarkSettlingFriction = () => {
    if (!desktopBrandMark?.body || !desktopBrandMark.hasReachedFloor) return;

    const speed = getDesktopMarkBodySpeed();
    const body = desktopBrandMark.body;
    const baseFrictionAir = DESKTOP_MARK_PHYSICS.frictionAir;
    const nearFloor = isNearDesktopBrandMarkFloor(body.position.y);

    if (speed < 2.2) {
      body.frictionAir = nearFloor
        ? DESKTOP_MARK_FLOOR_SETTLE_FRICTION_AIR_SLOW
        : DESKTOP_MARK_SETTLE_FRICTION_AIR_SLOW;
    } else if (speed < DESKTOP_MARK_SETTLE_SPEED_THRESHOLD) {
      body.frictionAir = nearFloor
        ? DESKTOP_MARK_FLOOR_SETTLE_FRICTION_AIR
        : DESKTOP_MARK_SETTLE_FRICTION_AIR;
    } else {
      body.frictionAir = baseFrictionAir;
    }
  };

  const softenDesktopMarkBounceBetweenHits = () => {
    if (!desktopBrandMark?.body || !desktopBrandMark.hasReachedFloor) return;

    const intensity = getDesktopMarkBounceIntensity();
    if (intensity <= 0.04) return;

    const speed = getDesktopMarkBodySpeed();
    if (speed > 9.5) return;

    const nearFloor = isNearDesktopBrandMarkFloor(desktopBrandMark.body.position.y);
    let decayStep = nearFloor ? 0.006 : 0.0035;
    if (speed < 2.2) {
      decayStep = nearFloor ? 0.022 : 0.014;
    } else if (speed < DESKTOP_MARK_SETTLE_SPEED_THRESHOLD) {
      decayStep = nearFloor ? 0.013 : 0.008;
    } else if (speed < 7) {
      decayStep = nearFloor ? 0.009 : 0.0055;
    }

    const next = Math.max(0, intensity - decayStep);
    if (next === intensity) return;

    desktopBrandMark.bounceIntensity = next;
    syncDesktopMarkBodyRestitution();

    if (Math.abs(next - intensity) > 0.018) {
      refreshEnvironmentColliders();
    }
  };

  const isDesktopBrandMarkSlowEnoughToClick = (body) => {
    const speed = Math.hypot(body.velocity.x, body.velocity.y);
    const angularSpeed = Math.abs(body.angularVelocity);
    return speed < DESKTOP_MARK_LAUNCH_CLICK_SPEED
      && angularSpeed < DESKTOP_MARK_LAUNCH_CLICK_ANGULAR;
  };

  const isDesktopBrandMarkTooFastToArm = (body) => {
    const speed = Math.hypot(body.velocity.x, body.velocity.y);
    const angularSpeed = Math.abs(body.angularVelocity);
    return speed > DESKTOP_MARK_LAUNCH_CLICK_RESET_SPEED
      || angularSpeed > DESKTOP_MARK_LAUNCH_CLICK_RESET_ANGULAR;
  };

  const checkDesktopMarkLaunchReady = () => {
    if (
      !getDesktopPhysicsActive()
      || !desktopBrandMark?.body
      || desktopBrandMark.launchReady
      || !desktopBrandMark.hasReachedFloor
    ) {
      if (desktopBrandMark && !desktopBrandMark.launchReady) {
        desktopBrandMark.slowFrames = 0;
      }
      return;
    }

    applyDesktopMarkSettlingFriction();
    softenDesktopMarkBounceBetweenHits();

    const body = desktopBrandMark.body;

    if (isDesktopBrandMarkTooFastToArm(body)) {
      desktopBrandMark.slowFrames = 0;
      return;
    }

    if (!isDesktopBrandMarkSlowEnoughToClick(body)) {
      return;
    }

    if (Math.hypot(body.velocity.x, body.velocity.y) < DESKTOP_MARK_LAUNCH_CLICK_SPEED_INSTANT) {
      setDesktopBrandMarkLaunchReady(true);
      return;
    }

    desktopBrandMark.slowFrames = (desktopBrandMark.slowFrames || 0) + 1;
    if (desktopBrandMark.slowFrames >= DESKTOP_MARK_LAUNCH_CLICK_FRAMES) {
      setDesktopBrandMarkLaunchReady(true);
    }
  };

  const engageDesktopBrandMark = () => {
    if (
      !getDesktopPhysicsActive()
      || userPhysicsDisabled
      || desktopBrandMarkReleasing
      || desktopBrandMark
      || mobileMark
      || lowPerformance
    ) {
      return;
    }

    const source = document.querySelector(MOBILE_MARK_SELECTOR);
    if (!source || source.classList.contains("sds-hero__brand-mark--physics-captured")) return;

    desktopBrandMarkReleasing = true;

    try {
      ensurePhysicsWorld();
      source.classList.add("sds-hero__brand-mark--physics-freeze");

      const sourceRect = source.getBoundingClientRect();
      if (sourceRect.width < 4 || sourceRect.height < 4) {
        source.classList.remove("sds-hero__brand-mark--physics-freeze");
        return;
      }

      desktopBrandMarkLetterHitsEnabled = false;
      desktopBrandMark = releaseBrandMarkIntoPhysics({
        source,
        sourceRect,
        cloneConfig: {
          id: DESKTOP_MARK_ID,
          className: "sds-physics-desktop-mark"
        },
        bodyPhysics: DESKTOP_MARK_PHYSICS,
        bodyLabel: DESKTOP_MARK_LABEL,
        initialVelocity: { x: 0, y: 0 },
        initialAngularVelocity: 0
      });
      desktopBrandMark.bounceIntensity = 0.94;
      desktopBrandMark.hasReachedFloor = false;
      desktopBrandMark.launchReady = false;
      desktopBrandMark.slowFrames = 0;
      desktopBrandMark.floorAnchor = "viewport";
      createMarkDeadZone(desktopBrandMark, true);
      lastDesktopMarkScrollY = getPageScrollY();
      bindBrandMarkScroll();
      syncDesktopMarkBodyRestitution();

      root.classList.add("is-falling");
      wordmark?.classList.add("is-physics-falling");
    } finally {
      desktopBrandMarkReleasing = false;
    }
  };

  const isBrandMarkMainWordmarkHitsBlocked = () => (
    (getDesktopPhysicsActive()
      && desktopBrandMark?.released
      && !desktopBrandMarkLetterHitsEnabled)
    || (getMobilePhysicsActive()
      && mobileMark?.released
      && !mobileMarkLetterHitsEnabled)
  );

  const getMainWordmarkCollisionFilter = () => ({
    category: COLLISION_CATEGORY_MAIN_WORDMARK,
    mask: COLLISION_MASK_ALL,
    group: 0
  });

  const getSublineWordmarkCollisionFilter = () => ({
    category: COLLISION_CATEGORY_SUBLINE_WORDMARK,
    mask: COLLISION_MASK_ALL,
    group: 0
  });

  const getEnvironmentCollisionFilter = () => ({
    category: COLLISION_CATEGORY_ENVIRONMENT,
    mask: COLLISION_MASK_ALL,
    group: 0
  });

  const tagEnvironmentBody = (body) => {
    if (!body) return body;
    body.collisionFilter = getEnvironmentCollisionFilter();
    return body;
  };

  const getBrandMarkCollisionFilter = () => {
    const filter = {
      category: COLLISION_CATEGORY_BRAND_MARK,
      mask: COLLISION_MASK_ALL,
      group: 0
    };

    if (isBrandMarkMainWordmarkHitsBlocked()) {
      filter.mask = COLLISION_CATEGORY_SUBLINE_WORDMARK;
    }

    return filter;
  };

  const applyBrandMarkCollisionFilter = (mark) => {
    if (!mark?.body) return;
    Body.set(mark.body, { collisionFilter: getBrandMarkCollisionFilter() });
  };

  const shouldSkipBrandMarkMainWordmarkKnock = (targetPair) => (
    Boolean(targetPair?.withIntro && isBrandMarkMainWordmarkHitsBlocked())
  );

  const isPairWordmarkColliderPresent = (pair) => (
    pair
    && !pair.withIntro
    && !pair.released
    && !pair.fallen
    && !pair.rematerializing
    && !pair.body
  );

  const isPairWordmarkKnockTarget = (pair) => (
    isPairWordmarkColliderPresent(pair)
    && !pair.cycleActive
    && !pair.releaseCommitted
    && !isPairEngageCooldownActive(pair)
  );

  const isPairMainLetterKnockTarget = (pair) => (
    pair
    && pair.withIntro
    && !pair.released
    && !pair.fallen
    && !pair.rematerializing
    && !pair.body
    && !pair.cycleActive
    && !pair.releaseCommitted
    && !isPairEngageCooldownActive(pair)
  );

  const isPairWordmarkKnockColliderPresent = (pair) => {
    if (introRunning && pair?.withIntro) {
      return false;
    }

    if (pair?.withIntro && isBrandMarkMainWordmarkHitsBlocked()) {
      return false;
    }

    return isPairWordmarkColliderPresent(pair) || isPairMainLetterKnockTarget(pair);
  };

  const getWordmarkKnockColliderViewport = (pair) => {
    const base = pair.withIntro
      ? getCharViewportCenter(pair)
      : getLineTargetViewport(pair.slot, pair.line);

    if (getMobilePhysicsActive() && pair.withIntro) {
      return {
        x: base.x,
        y: base.y + MOBILE_MAIN_LETTER_KNOCK_COLLIDER_Y_OFFSET
      };
    }

    return base;
  };

  const getWordmarkLetterHitUnlockY = () => {
    const wordmarkEl = wordmark || line;
    return wordmarkEl.getBoundingClientRect().bottom + 36;
  };

  const checkMobileMarkLetterHitUnlock = () => {
    if (mobileMarkLetterHitsEnabled || !mobileMark?.body) return;

    if (mobileMark.body.position.y >= getWordmarkLetterHitUnlockY()) {
      mobileMarkLetterHitsEnabled = true;
      applyBrandMarkCollisionFilter(mobileMark);
      refreshEnvironmentColliders();
    }
  };

  const checkDesktopMarkLetterHitUnlock = () => {
    if (
      !getDesktopPhysicsActive()
      || desktopBrandMarkLetterHitsEnabled
      || !desktopBrandMark?.body
    ) {
      return;
    }

    if (isNearDesktopBrandMarkFloor(desktopBrandMark.body.position.y)) {
      markDesktopBrandMarkFloorReached();
    }
  };

  const shouldBuildWordmarkLetterColliders = () => {
    if (!wordmarkContexts.some((ctx) => ctx.root.classList.contains("is-ready"))) {
      return false;
    }

    if (introRunning) {
      return true;
    }

    if (hasActiveLetters()) {
      return true;
    }

    if (wordmark?.classList.contains("is-physics-falling")) {
      return true;
    }

    if (pairs.some((pair) => isPairWordmarkKnockTarget(pair) || isPairMainLetterKnockTarget(pair))) {
      return true;
    }

    const mobileHits = getMobilePhysicsActive()
      && mobileMark?.released
      && shouldIncludeMobileHeroBlockades();
    const desktopHits = getDesktopPhysicsActive()
      && desktopBrandMark?.released;

    return mobileHits || desktopHits;
  };

  const buildWordmarkLetterColliders = () => {
    if (!shouldBuildWordmarkLetterColliders()) {
      return [];
    }

    return pairs.map((pair) => {
      if (!isPairWordmarkKnockColliderPresent(pair)) return null;

      const { x, y } = getWordmarkKnockColliderViewport(pair);
      return Bodies.rectangle(
        x,
        y,
        pair.width * SUBLINE_COLLIDER_PAD,
        pair.height * SUBLINE_COLLIDER_PAD,
        {
          ...SUBLINE_LETTER_COLLIDER_PHYSICS,
          chamfer: { radius: 2 },
          label: `surette-char-collider-${pair.index}`,
          collisionFilter: pair.withIntro
            ? getMainWordmarkCollisionFilter()
            : getSublineWordmarkCollisionFilter()
        }
      );
    }).filter(Boolean);
  };

  const isBrandMarkPassingUpward = (markBody) => (
    markBody.velocity.y < DESKTOP_MARK_UPWARD_PASS_VY
  );

  const isBrandMarkEnvironmentCollider = (body) => (
    Boolean(body?.isStatic)
    && !BRAND_MARK_LABELS.has(body.label)
  );

  const isReleasedWordmarkLetterBody = (body) => (
    Boolean(body?.label) && WORDMARK_LETTER_BODY_LABEL_RE.test(body.label)
  );

  const isIntroFallingMainLetterBody = (body) => {
    if (!introRunning || !isReleasedWordmarkLetterBody(body)) return false;
    const match = body.label.match(/^surette-char-(\d+)$/);
    if (!match) return false;
    const pair = pairs[Number(match[1])];
    return Boolean(pair?.withIntro);
  };

  const suppressIntroMainLetterColliderCollisions = (event) => {
    if (!introRunning) return;

    event.pairs.forEach((pair) => {
      const letterBody = isIntroFallingMainLetterBody(pair.bodyA)
        ? pair.bodyA
        : isIntroFallingMainLetterBody(pair.bodyB)
          ? pair.bodyB
          : null;
      if (!letterBody) return;

      const otherBody = pair.bodyA === letterBody ? pair.bodyB : pair.bodyA;
      if (!WORDMARK_LETTER_COLLIDER_LABEL_RE.test(otherBody.label)) return;

      pair.isActive = false;
    });
  };

  const suppressWordmarkLetterBannerCollisions = (event) => {
    event.pairs.forEach((pair) => {
      const letterBody = isReleasedWordmarkLetterBody(pair.bodyA)
        ? pair.bodyA
        : isReleasedWordmarkLetterBody(pair.bodyB)
          ? pair.bodyB
          : null;
      if (!letterBody) return;

      const otherBody = pair.bodyA === letterBody ? pair.bodyB : pair.bodyA;
      if (!WORDMARK_LETTER_MENU_BARRIER_LABELS.has(otherBody.label)) return;

      pair.isActive = false;
    });
  };

  const isSublinePhysicsLabel = (label) => {
    const colliderIndex = parseWordmarkLetterColliderIndex(label);
    if (colliderIndex !== null) {
      return Boolean(pairs[colliderIndex] && !pairs[colliderIndex].withIntro);
    }

    const bodyIndex = parseWordmarkLetterBodyIndex(label);
    if (bodyIndex !== null) {
      return Boolean(pairs[bodyIndex] && !pairs[bodyIndex].withIntro);
    }

    return false;
  };

  const suppressBrandMarkNonSublineCollisionsDuringTextOnlyDrop = (event) => {
    if (!isBrandMarkMainWordmarkHitsBlocked()) return;

    event.pairs.forEach((pair) => {
      const labels = [pair.bodyA.label, pair.bodyB.label];
      const brandLabel = labels.find((label) => BRAND_MARK_LABELS.has(label));
      if (!brandLabel) return;

      const otherBody = pair.bodyA.label === brandLabel ? pair.bodyB : pair.bodyA;
      if (isSublinePhysicsLabel(otherBody.label)) return;

      pair.isActive = false;
    });
  };

  const suppressBrandMarkUpwardCollisions = (event) => {
    event.pairs.forEach((pair) => {
      const labels = [pair.bodyA.label, pair.bodyB.label];
      const brandLabel = labels.find((label) => BRAND_MARK_LABELS.has(label));
      if (!brandLabel) return;

      const markBody = pair.bodyA.label === brandLabel ? pair.bodyA : pair.bodyB;
      const otherBody = pair.bodyA === markBody ? pair.bodyB : pair.bodyA;

      // The view-top wall has no ceiling for the brand mark — pass through freely
      // in both directions so it can fall back into the viewport after being knocked
      // upward past the top edge.
      if (otherBody.label === "view-top" && isBrandMarkEnvironmentCollider(otherBody)) {
        pair.isActive = false;
        return;
      }

      if (!isBrandMarkPassingUpward(markBody) || !isBrandMarkEnvironmentCollider(otherBody)) {
        return;
      }
      if (getBrandMarkUpwardPassExemptLabels().has(otherBody.label)) {
        return;
      }
      if (WORDMARK_LETTER_COLLIDER_LABEL_RE.test(otherBody.label)) {
        return;
      }

      pair.isActive = false;
    });
  };

  const isSublineFloorBody = (body) => {
    if (!body?.label || !body.isStatic) return false;
    if (SUBLINE_FLOOR_LABELS.has(body.label)) return true;
    return body.label.startsWith("app-card-top-");
  };

  const isSublineFloorBounceSpent = (pair) => (
    (pair.sublineFloorBounces || 0) >= SUBLINE_FLOOR_BOUNCE_LIMIT
  );

  const applySublineFloorBouncePhysics = (pair) => {
    if (!pair?.body || pair.withIntro) return;

    if (isSublineFloorBounceSpent(pair)) {
      Body.set(pair.body, {
        restitution: SUBLINE_FLOOR_SPENT_RESTITUTION,
        frictionAir: Math.max(pair.body.frictionAir, SUBLINE_FLOOR_SPENT_FRICTION_AIR)
      });
      return;
    }

    Body.set(pair.body, {
      restitution: SUBLINE_LETTER_PHYSICS.restitution,
      frictionAir: SUBLINE_LETTER_PHYSICS.frictionAir
    });
  };

  const handleSublineFloorCollisions = (event) => {
    if (userPhysicsDisabled) return;

    const now = performance.now();
    event.pairs.forEach((collision) => {
      const { bodyA, bodyB } = collision;
      const letterBody = isReleasedWordmarkLetterBody(bodyA)
        ? bodyA
        : isReleasedWordmarkLetterBody(bodyB)
          ? bodyB
          : null;
      if (!letterBody) return;

      const floorBody = bodyA === letterBody ? bodyB : bodyA;
      if (!isSublineFloorBody(floorBody)) return;

      const index = parseWordmarkLetterBodyIndex(letterBody.label);
      if (index === null) return;

      const pair = pairs[index];
      if (!pair || pair.withIntro || !pair.released || pair.fallen || pair.rematerializing) return;
      if (letterBody.velocity.y < SUBLINE_FLOOR_MIN_DOWNWARD_VY) return;
      if (now - (pair.sublineFloorBounceCooldown || 0) < SUBLINE_FLOOR_BOUNCE_COOLDOWN_MS) return;

      pair.sublineFloorBounceCooldown = now;
      pair.sublineFloorBounces = (pair.sublineFloorBounces || 0) + 1;
      applySublineFloorBouncePhysics(pair);
    });
  };

  const handleBrandMarkLetterCollisions = (event) => {
    event.pairs.forEach((collision) => {
      const { bodyA, bodyB, depth } = collision;
      const labels = [bodyA.label, bodyB.label];
      const brandLabel = labels.find((label) => BRAND_MARK_LABELS.has(label));
      if (!brandLabel) return;

      if (brandLabel === DESKTOP_MARK_LABEL) {
        const markBody = bodyA.label === DESKTOP_MARK_LABEL ? bodyA : bodyB;
        const otherLabel = bodyA.label === DESKTOP_MARK_LABEL ? bodyB.label : bodyA.label;
        const floorLabel = labels.find((label) => BRAND_MARK_FLOOR_LABELS.has(label));

        if (floorLabel) {
          if (isBrandMarkPassingUpward(markBody)) {
            return;
          }
          handleDesktopBrandMarkFloorContact(markBody, floorLabel);
          return;
        }

        const wallLabel = labels.find((label) => VIEW_WALL_LABELS.has(label));
        if (wallLabel && desktopBrandMark.screenBounceMode) {
          // view-top is fully transparent to the brand mark — no impulse in either direction.
          if (wallLabel === "view-top") {
            return;
          }
          if (isBrandMarkPassingUpward(markBody) && !getBrandMarkUpwardPassExemptLabels().has(wallLabel)) {
            return;
          }
          applyDesktopMarkBounceImpulse(markBody, wallLabel);
          return;
        }

        if (isBrandMarkPassingUpward(markBody)) {
          return;
        }
      }

      if (brandLabel === MOBILE_MARK_LABEL) {
        const markBody = bodyA.label === MOBILE_MARK_LABEL ? bodyA : bodyB;
        const menuBarrierLabel = labels.find((label) => label === MOBILE_MENU_BARRIER_LABEL);

        if (menuBarrierLabel) {
          if (!isBrandMarkPassingUpward(markBody)) {
            handleMobileBrandMarkMenuBarrierContact(markBody);
          }
          return;
        }

        const floorLabel = labels.find((label) => BRAND_MARK_FLOOR_LABELS.has(label));

        if (floorLabel) {
          if (isBrandMarkPassingUpward(markBody)) {
            return;
          }
          handleMobileBrandMarkFloorContact(markBody, floorLabel);
          return;
        }

        if (isBrandMarkPassingUpward(markBody)) {
          return;
        }
      }
    });
  };

  const parseWordmarkLetterBodyIndex = (label) => {
    const match = label?.match(/^surette-char-(\d+)$/);
    return match ? Number(match[1]) : null;
  };

  const parseWordmarkLetterColliderIndex = (label) => {
    const match = label?.match(WORDMARK_LETTER_COLLIDER_LABEL_RE);
    return match ? Number(match[1]) : null;
  };

  const applySublineBounceImpulse = (movingBody, sublineBody, depth = 0, { sourceIndex = null, now = performance.now() } = {}) => {
    if (!movingBody || !sublineBody) return;

    const bodyIndex = sourceIndex ?? parseWordmarkLetterBodyIndex(movingBody.label);
    const sourcePair = bodyIndex !== null ? pairs[bodyIndex] : null;
    const isMainLetter = Boolean(sourcePair?.withIntro);

    if (isMainLetter && bodyIndex !== null) {
      const lastBounce = wordmarkLetterBounceCooldowns.get(bodyIndex) || 0;
      if (now - lastBounce < MAIN_LETTER_BOUNCE_COOLDOWN_MS) return;
      wordmarkLetterBounceCooldowns.set(bodyIndex, now);
    }

    const dx = sublineBody.position.x - movingBody.position.x;
    const dy = sublineBody.position.y - movingBody.position.y;
    const len = Math.hypot(dx, dy) || 1;
    const rawSpeed = Math.hypot(movingBody.velocity.x, movingBody.velocity.y);
    if (rawSpeed < WORDMARK_LETTER_KNOCK_MIN_SPEED * 0.55) return;

    const impactSpeed = isMainLetter
      ? getNormalizedWordmarkImpactSpeed(movingBody)
      : rawSpeed;
    const depthScale = Math.max(0.45, Math.min(1, (depth || 0) / WORDMARK_LETTER_KNOCK_DEPTH));
    let bounceScale = Math.min(1.05, 0.42 + impactSpeed * 0.1) * depthScale;
    const bounceStrengthX = isMainLetter ? 0.24 : 0.42;
    const bounceStrengthY = isMainLetter ? 0.3 : 0.52;

    if (isMainLetter) {
      bounceScale *= introRunning ? 0.34 : 0.5;
    }

    Body.setVelocity(movingBody, {
      x: movingBody.velocity.x - (dx / len) * impactSpeed * bounceScale * bounceStrengthX,
      y: movingBody.velocity.y - (dy / len) * impactSpeed * bounceScale * bounceStrengthY
    });

    if (isMainLetter) {
      clampBodyToMaxSpeed(movingBody, getMainLetterMaxSpeed());
    }
  };

  const applyWordmarkImpactToReleasedLetter = (targetPair, targetIndex, sourceBody, depth, now) => {
    if (!targetPair?.released || !targetPair.body) return false;

    const isMainLetter = Boolean(targetPair.withIntro);
    const { knockMinSpeed, knockDepth, knockCooldown } = getWordmarkLetterKnockThresholds(targetPair);
    if ((depth || 0) < knockDepth * 0.85) return false;

    const impactSpeed = Math.hypot(sourceBody.velocity.x, sourceBody.velocity.y);
    if (impactSpeed < knockMinSpeed) return false;

    const lastKnock = wordmarkLetterKnockCooldowns.get(targetIndex) || 0;
    if (now - lastKnock < knockCooldown) return false;
    wordmarkLetterKnockCooldowns.set(targetIndex, now);

    const dx = targetPair.body.position.x - sourceBody.position.x;
    const dy = targetPair.body.position.y - sourceBody.position.y;
    const len = Math.hypot(dx, dy) || 1;
    const normalizedImpact = isMainLetter
      ? getNormalizedWordmarkImpactSpeed(sourceBody)
      : impactSpeed;
    const sourceBoost = isMainLetter ? getMainKnockImpulseScale(targetPair, sourceBody) : 1;
    const impulseScale = Math.min(isMainLetter ? 1.28 : 1.1, 0.38 + normalizedImpact * 0.09) * sourceBoost;
    let impulseXMult = isMainLetter ? 0.24 : 0.28;
    let impulseYMult = isMainLetter ? 0.32 : 0.36;
    if (isMainLetter && BRAND_MARK_LABELS.has(sourceBody.label)) {
      impulseXMult = 0.4;
      impulseYMult = 0.54;
    } else if (isMainLetter) {
      const sourceIndex = parseWordmarkLetterBodyIndex(sourceBody.label);
      const sourcePair = sourceIndex !== null ? pairs[sourceIndex] : null;
      if (sourcePair && !sourcePair.withIntro) {
        impulseXMult = 0.34;
        impulseYMult = 0.46;
      }
    }
    const impulseX = (dx / len) * normalizedImpact * impulseScale * impulseXMult;
    const impulseY = (dy / len) * normalizedImpact * impulseScale * impulseYMult;

    Body.setVelocity(targetPair.body, {
      x: targetPair.body.velocity.x + impulseX,
      y: targetPair.body.velocity.y + impulseY
    });
    clampBodyToMaxSpeed(
      targetPair.body,
      isMainLetter ? getMainLetterMaxSpeed() : SUBLINE_MAX_SPEED
    );
    applySublineBounceImpulse(sourceBody, targetPair.body, depth, {
      sourceIndex: parseWordmarkLetterBodyIndex(sourceBody.label),
      now
    });
    return true;
  };

  const applyWordmarkImpactToReleasedSubline = applyWordmarkImpactToReleasedLetter;

  const getWordmarkLetterKnockThresholds = (targetPair) => {
    if (targetPair?.withIntro) {
      return {
        knockMinSpeed: introRunning
          ? MAIN_WORDMARK_KNOCK_MIN_SPEED * 0.32
          : MAIN_WORDMARK_KNOCK_MIN_SPEED * 0.52,
        knockDepth: introRunning
          ? MAIN_WORDMARK_KNOCK_DEPTH * 0.42
          : MAIN_WORDMARK_KNOCK_DEPTH * 0.62,
        knockCooldown: MAIN_WORDMARK_KNOCK_COOLDOWN_MS
      };
    }

    return {
      knockMinSpeed: introRunning
        ? WORDMARK_LETTER_KNOCK_MIN_SPEED * 0.3
        : WORDMARK_LETTER_KNOCK_MIN_SPEED * 0.42,
      knockDepth: introRunning
        ? WORDMARK_LETTER_KNOCK_DEPTH * 0.4
        : WORDMARK_LETTER_KNOCK_DEPTH * 0.58,
      knockCooldown: WORDMARK_LETTER_KNOCK_COOLDOWN_MS
    };
  };

  const getBrandMarkKnockEntryMinSpeed = () => (
    introRunning
      ? MAIN_WORDMARK_KNOCK_MIN_SPEED * 0.28
      : MAIN_WORDMARK_KNOCK_MIN_SPEED * BRAND_MARK_MAIN_KNOCK_ENTRY_SPEED_RATIO
  );

  const getMainWordmarkKnockOverlapPad = () => MAIN_WORDMARK_KNOCK_OVERLAP_PAD;

  const tryKnockSublineFromImpact = (targetPair, targetIndex, sourceBody, depth, now) => {
    if (!targetPair || targetPair.withIntro) return false;
    if (!isPairWordmarkKnockTarget(targetPair)) return false;

    const { knockMinSpeed, knockDepth, knockCooldown } = getWordmarkLetterKnockThresholds(targetPair);
    const impactSpeed = Math.hypot(sourceBody.velocity.x, sourceBody.velocity.y);
    if ((depth || 0) < knockDepth) return false;
    if (impactSpeed < knockMinSpeed) return false;

    const lastKnock = wordmarkLetterKnockCooldowns.get(targetIndex) || 0;
    if (now - lastKnock < knockCooldown) return false;
    wordmarkLetterKnockCooldowns.set(targetIndex, now);

    knockLetterFromWordmarkImpact(targetPair, sourceBody, { allowDuringIntro: true });
    applySublineBounceImpulse(
      sourceBody,
      { position: getLineTargetViewport(targetPair.slot, targetPair.line) },
      depth,
      { sourceIndex: parseWordmarkLetterBodyIndex(sourceBody.label), now }
    );
    return true;
  };

  const tryKnockMainLetterFromImpact = (targetPair, targetIndex, sourceBody, depth, now) => {
    if (!targetPair?.withIntro || !isPairMainLetterKnockTarget(targetPair)) return false;

    const { knockMinSpeed, knockDepth, knockCooldown } = getWordmarkLetterKnockThresholds(targetPair);
    const impactSpeed = Math.hypot(sourceBody.velocity.x, sourceBody.velocity.y);
    if ((depth || 0) < knockDepth) return false;
    if (impactSpeed < knockMinSpeed) return false;

    const lastKnock = wordmarkLetterKnockCooldowns.get(targetIndex) || 0;
    if (now - lastKnock < knockCooldown) return false;
    wordmarkLetterKnockCooldowns.set(targetIndex, now);

    knockLetterFromWordmarkImpact(targetPair, sourceBody, { allowDuringIntro: true });
    applySublineBounceImpulse(
      sourceBody,
      { position: getWordmarkKnockColliderViewport(targetPair) },
      depth,
      { sourceIndex: parseWordmarkLetterBodyIndex(sourceBody.label), now }
    );
    return true;
  };

  const handleSublineBodyBodyCollision = (bodyIndexA, bodyIndexB, bodyA, bodyB, depth, now) => {
    const pairA = pairs[bodyIndexA];
    const pairB = pairs[bodyIndexB];
    if (!pairA || !pairB) return;

    const sublineA = !pairA.withIntro;
    const sublineB = !pairB.withIntro;
    if (!sublineA && !sublineB) return;

    if (sublineB && pairB.released && pairB.body && pairA.released && pairA.body) {
      applyWordmarkImpactToReleasedSubline(pairB, bodyIndexB, bodyA, depth, now);
    }
    if (sublineA && pairA.released && pairA.body && pairB.released && pairB.body) {
      applyWordmarkImpactToReleasedSubline(pairA, bodyIndexA, bodyB, depth, now);
    }

    if (sublineB && !pairB.released && pairA.released && pairA.body && pairA.withIntro) {
      tryKnockSublineFromImpact(pairB, bodyIndexB, bodyA, depth, now);
    }
    if (sublineA && !pairA.released && pairB.released && pairB.body && pairB.withIntro) {
      tryKnockSublineFromImpact(pairA, bodyIndexA, bodyB, depth, now);
    }
  };

  const processWordmarkLetterKnockCollision = (collision, now) => {
    const { bodyA, bodyB, depth } = collision;

    const bodyIndexA = parseWordmarkLetterBodyIndex(bodyA.label);
    const bodyIndexB = parseWordmarkLetterBodyIndex(bodyB.label);
    const colliderIndexA = parseWordmarkLetterColliderIndex(bodyA.label);
    const colliderIndexB = parseWordmarkLetterColliderIndex(bodyB.label);

    let sourceBody = null;
    let sourceIndex = null;
    let targetIndex = null;

    if (bodyIndexA !== null && colliderIndexB !== null) {
      sourceBody = bodyA;
      sourceIndex = bodyIndexA;
      targetIndex = colliderIndexB;
    } else if (bodyIndexB !== null && colliderIndexA !== null) {
      sourceBody = bodyB;
      sourceIndex = bodyIndexB;
      targetIndex = colliderIndexA;
    } else if (bodyIndexA !== null && bodyIndexB !== null) {
      handleSublineBodyBodyCollision(bodyIndexA, bodyIndexB, bodyA, bodyB, depth, now);
      return;
    } else {
      return;
    }

    const sourcePair = pairs[sourceIndex];
    const targetPair = pairs[targetIndex];

    if (
      sourcePair?.released
      && sourcePair.body
      && !sourcePair.withIntro
      && targetPair?.withIntro
    ) {
      if (targetPair.released && targetPair.body) {
        applyWordmarkImpactToReleasedLetter(targetPair, targetIndex, sourceBody, depth, now);
        return;
      }
      tryKnockMainLetterFromImpact(targetPair, targetIndex, sourceBody, depth, now);
      return;
    }

    if (!sourcePair?.released || !sourcePair.body || !sourcePair.withIntro) return;
    if (!targetPair || targetPair.withIntro) return;

    if (targetPair.released && targetPair.body) {
      applyWordmarkImpactToReleasedSubline(targetPair, targetIndex, sourceBody, depth, now);
      return;
    }

    tryKnockSublineFromImpact(targetPair, targetIndex, sourceBody, depth, now);
  };

  const handleWordmarkLetterKnockCollisions = (event) => {
    const now = performance.now();
    event.pairs.forEach((collision) => processWordmarkLetterKnockCollision(collision, now));
  };

  const isSublineKnockLabel = (label) => {
    if (WORDMARK_LETTER_COLLIDER_LABEL_RE.test(label)) return true;
    const bodyIndex = parseWordmarkLetterBodyIndex(label);
    const pair = bodyIndex !== null ? pairs[bodyIndex] : null;
    return Boolean(pair?.released && pair.body);
  };

  const getReleasedBrandMarkForKnock = (brandLabel) => {
    if (brandLabel === MOBILE_MARK_LABEL) {
      return mobileMark?.released && mobileMark.body ? mobileMark : null;
    }
    if (brandLabel === DESKTOP_MARK_LABEL) {
      return desktopBrandMark?.released && desktopBrandMark.body ? desktopBrandMark : null;
    }
    return null;
  };

  const processBrandMarkSublineKnockCollision = (collision, now) => {
    const { bodyA, bodyB, depth } = collision;
    const labels = [bodyA.label, bodyB.label];
    const brandLabel = labels.find((label) => BRAND_MARK_LABELS.has(label));
    if (!brandLabel || !getReleasedBrandMarkForKnock(brandLabel)) return;

    const markBody = bodyA.label === brandLabel ? bodyA : bodyB;
    const otherBody = bodyA === markBody ? bodyB : bodyA;
    const otherLabel = otherBody.label;
    if (!isSublineKnockLabel(otherLabel)) return;

    const colliderIndex = parseWordmarkLetterColliderIndex(otherLabel);
    if (colliderIndex !== null) {
      const targetPair = pairs[colliderIndex];
      if (!targetPair) return;
      if (targetPair.released && targetPair.body) {
        if (shouldSkipBrandMarkMainWordmarkKnock(targetPair)) return;
        applyWordmarkImpactToReleasedLetter(targetPair, colliderIndex, markBody, depth, now);
        return;
      }
      if (targetPair.withIntro) {
        if (isBrandMarkMainWordmarkHitsBlocked()) return;
        tryKnockMainLetterFromImpact(targetPair, colliderIndex, markBody, depth, now);
        return;
      }
      tryKnockSublineFromImpact(targetPair, colliderIndex, markBody, depth, now);
      return;
    }

    const bodyIndex = parseWordmarkLetterBodyIndex(otherLabel);
    if (bodyIndex === null) return;
    const targetPair = pairs[bodyIndex];
    if (!targetPair || !targetPair.released || !targetPair.body) return;
    if (shouldSkipBrandMarkMainWordmarkKnock(targetPair)) return;
    applyWordmarkImpactToReleasedLetter(targetPair, bodyIndex, markBody, depth, now);
  };

  const handleBrandMarkSublineKnockCollisions = (event) => {
    const now = performance.now();
    event.pairs.forEach((collision) => processBrandMarkSublineKnockCollision(collision, now));
  };

  const wordmarkKnockBoxesOverlap = (ax, ay, ahw, ahh, bx, by, bhw, bhh) => (
    ax - ahw < bx + bhw
    && ax + ahw > bx - bhw
    && ay - ahh < by + bhh
    && ay + ahh > by - bhh
  );

  const getWordmarkKnockMinSpeed = () => (
    introRunning
      ? WORDMARK_LETTER_KNOCK_MIN_SPEED * 0.3
      : WORDMARK_LETTER_KNOCK_MIN_SPEED * 0.42
  );

  const applySublineKnockOverlapsFromBody = (body, moverWidth, moverHeight, now, knockMinSpeed) => {
    const speed = Math.hypot(body.velocity.x, body.velocity.y);
    if (speed < knockMinSpeed) return;

    const { x: bx, y: by } = body.position;
    const bhw = moverWidth * 0.5 * WORDMARK_LETTER_KNOCK_OVERLAP_PAD;
    const bhh = moverHeight * 0.5 * WORDMARK_LETTER_KNOCK_OVERLAP_PAD;
    let knockApplied = false;

    pairs.forEach((targetPair) => {
      if (knockApplied || targetPair.withIntro) return;

      const targetIndex = targetPair.index;

      if (targetPair.released && targetPair.body) {
        const { x: tx, y: ty } = targetPair.body.position;
        const thw = targetPair.width * 0.5;
        const thh = targetPair.height * 0.5;
        if (!wordmarkKnockBoxesOverlap(bx, by, bhw, bhh, tx, ty, thw, thh)) return;
        knockApplied = applyWordmarkImpactToReleasedLetter(
          targetPair,
          targetIndex,
          body,
          WORDMARK_LETTER_KNOCK_DEPTH,
          now
        );
        return;
      }

      if (!isPairWordmarkKnockTarget(targetPair)) return;

      const { x: tx, y: ty } = getLineTargetViewport(targetPair.slot, targetPair.line);
      const thw = targetPair.width * 0.5 * SUBLINE_COLLIDER_PAD;
      const thh = targetPair.height * 0.5 * SUBLINE_COLLIDER_PAD;
      if (!wordmarkKnockBoxesOverlap(bx, by, bhw, bhh, tx, ty, thw, thh)) return;

      knockApplied = tryKnockSublineFromImpact(
        targetPair,
        targetIndex,
        body,
        WORDMARK_LETTER_KNOCK_DEPTH,
        now
      );
    });

    if (!knockApplied) {
      const sourceIndex = parseWordmarkLetterBodyIndex(body.label);
      const sourcePair = sourceIndex !== null ? pairs[sourceIndex] : null;
      if (sourcePair && !sourcePair.withIntro) {
        const mainOverlapPad = getMainWordmarkKnockOverlapPad();
        pairs.forEach((targetPair) => {
          if (knockApplied || !targetPair.withIntro) return;
          if (!isPairMainLetterKnockTarget(targetPair)) return;

          const targetIndex = targetPair.index;
          const { x: tx, y: ty } = getWordmarkKnockColliderViewport(targetPair);
          const thw = targetPair.width * 0.5 * mainOverlapPad;
          const thh = targetPair.height * 0.5 * mainOverlapPad;
          if (!wordmarkKnockBoxesOverlap(bx, by, bhw, bhh, tx, ty, thw, thh)) return;

          knockApplied = tryKnockMainLetterFromImpact(
            targetPair,
            targetIndex,
            body,
            MAIN_WORDMARK_KNOCK_DEPTH,
            now
          );
        });
      }
    }
  };

  const applyBrandMarkKnockOverlapsFromBody = (body, moverWidth, moverHeight, now, knockMinSpeed) => {
    const speed = Math.hypot(body.velocity.x, body.velocity.y);
    const entrySpeed = Math.min(knockMinSpeed, getBrandMarkKnockEntryMinSpeed());
    if (speed < entrySpeed) return;

    const textOnlyDrop = isBrandMarkMainWordmarkHitsBlocked();
    const { x: bx, y: by } = body.position;
    const bhw = moverWidth * 0.5 * WORDMARK_LETTER_KNOCK_OVERLAP_PAD;
    const bhh = moverHeight * 0.5 * WORDMARK_LETTER_KNOCK_OVERLAP_PAD;
    let knockApplied = false;

    pairs.forEach((targetPair) => {
      if (knockApplied) return;
      if (shouldSkipBrandMarkMainWordmarkKnock(targetPair)) return;

      const targetIndex = targetPair.index;

      if (targetPair.released && targetPair.body) {
        const { x: tx, y: ty } = targetPair.body.position;
        const thw = targetPair.width * 0.5;
        const thh = targetPair.height * 0.5;
        if (!wordmarkKnockBoxesOverlap(bx, by, bhw, bhh, tx, ty, thw, thh)) return;
        knockApplied = applyWordmarkImpactToReleasedLetter(
          targetPair,
          targetIndex,
          body,
          WORDMARK_LETTER_KNOCK_DEPTH,
          now
        );
        return;
      }

      if (targetPair.withIntro) {
        if (!isPairMainLetterKnockTarget(targetPair)) return;
        const { x: tx, y: ty } = getWordmarkKnockColliderViewport(targetPair);
        const mainOverlapPad = getMainWordmarkKnockOverlapPad();
        const thw = targetPair.width * 0.5 * mainOverlapPad;
        const thh = targetPair.height * 0.5 * mainOverlapPad;
        if (!wordmarkKnockBoxesOverlap(bx, by, bhw, bhh, tx, ty, thw, thh)) return;
        knockApplied = tryKnockMainLetterFromImpact(
          targetPair,
          targetIndex,
          body,
          MAIN_WORDMARK_KNOCK_DEPTH,
          now
        );
        return;
      }

      if (!isPairWordmarkKnockTarget(targetPair)) return;

      const { x: tx, y: ty } = getLineTargetViewport(targetPair.slot, targetPair.line);
      const thw = targetPair.width * 0.5 * SUBLINE_COLLIDER_PAD;
      const thh = targetPair.height * 0.5 * SUBLINE_COLLIDER_PAD;
      if (!wordmarkKnockBoxesOverlap(bx, by, bhw, bhh, tx, ty, thw, thh)) return;

      knockApplied = tryKnockSublineFromImpact(
        targetPair,
        targetIndex,
        body,
        WORDMARK_LETTER_KNOCK_DEPTH,
        now
      );
    });
  };

  const checkWordmarkLetterKnockOverlaps = () => {
    if (userPhysicsDisabled) return;

    const now = performance.now();
    const knockMinSpeed = getWordmarkKnockMinSpeed();
    const movers = pairs.filter((pair) => (
      pair.released
      && pair.body
      && !pair.fallen
      && !pair.rematerializing
    ));

    movers.forEach((sourcePair) => {
      applySublineKnockOverlapsFromBody(
        sourcePair.body,
        sourcePair.width,
        sourcePair.height,
        now,
        knockMinSpeed
      );
    });

    if (getDesktopPhysicsActive() && desktopBrandMark?.released && desktopBrandMark.body) {
      applyBrandMarkKnockOverlapsFromBody(
        desktopBrandMark.body,
        desktopBrandMark.width,
        desktopBrandMark.height,
        now,
        knockMinSpeed
      );
    }

    if (getMobilePhysicsActive() && mobileMark?.released && mobileMark.body) {
      applyBrandMarkKnockOverlapsFromBody(
        mobileMark.body,
        mobileMark.width,
        mobileMark.height,
        now,
        knockMinSpeed
      );
    }
  };

  const syncWordmarkLetterColliderPositions = () => {
    if (!engine || !environmentBodies.length) return;
    const shouldSync = introRunning
      || hasActiveLetters()
      || wordmark?.classList.contains("is-physics-falling")
      || pairs.some((pair) => isPairWordmarkKnockTarget(pair) || isPairMainLetterKnockTarget(pair));
    if (!shouldSync) return;

    environmentBodies.forEach((body) => {
      const index = parseWordmarkLetterColliderIndex(body.label);
      if (index === null) return;

      const pair = pairs[index];
      if (!pair || !isPairWordmarkKnockColliderPresent(pair)) return;

      const { x, y } = getWordmarkKnockColliderViewport(pair);
      Body.setPosition(body, { x, y });
    });
  };

  const bindMobileMarkCollisions = () => {
    if (collisionHandlerBound || !engine) return;
    Events.on(engine, "collisionStart", suppressIntroMainLetterColliderCollisions);
    Events.on(engine, "collisionActive", suppressIntroMainLetterColliderCollisions);
    Events.on(engine, "collisionStart", suppressWordmarkLetterBannerCollisions);
    Events.on(engine, "collisionActive", suppressWordmarkLetterBannerCollisions);
    Events.on(engine, "collisionStart", suppressBrandMarkUpwardCollisions);
    Events.on(engine, "collisionActive", suppressBrandMarkUpwardCollisions);
    Events.on(engine, "collisionStart", suppressBrandMarkNonSublineCollisionsDuringTextOnlyDrop);
    Events.on(engine, "collisionActive", suppressBrandMarkNonSublineCollisionsDuringTextOnlyDrop);
    Events.on(engine, "collisionStart", handleBrandMarkLetterCollisions);
    Events.on(engine, "collisionStart", handleBrandMarkSublineKnockCollisions);
    Events.on(engine, "collisionActive", handleBrandMarkSublineKnockCollisions);
    Events.on(engine, "collisionStart", handleWordmarkLetterKnockCollisions);
    Events.on(engine, "collisionActive", handleWordmarkLetterKnockCollisions);
    Events.on(engine, "collisionStart", handleSublineFloorCollisions);
    collisionHandlerBound = true;
  };

  const buildCardColliders = () => {
    if (shouldSkipCardColliders()) {
      return [];
    }

    const tiles = catalogSection
      ? [...catalogSection.querySelectorAll(".app-tile")]
      : [...document.querySelectorAll(".downloads-main .app-tile")];

    return tiles.map((tile, index) => {
      const rect = tile.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) return null;
      return Bodies.rectangle(
        rect.left + rect.width * 0.5,
        rect.top + CARD_TOP_INSET,
        rect.width * 0.96,
        CARD_TOP_THICKNESS,
        { ...CARD_PHYSICS, label: `app-card-top-${index}` }
      );
    }).filter(Boolean);
  };

  const scheduleRefreshEnvironmentColliders = () => {
    if (!engine) return;
    if (refreshCollidersRaf) return;
    refreshCollidersRaf = window.requestAnimationFrame(() => {
      refreshCollidersRaf = 0;
      refreshEnvironmentColliders();
    });
  };

  const refreshEnvironmentColliders = () => {
    if (!engine) return;
    if (refreshCollidersRaf) {
      window.cancelAnimationFrame(refreshCollidersRaf);
      refreshCollidersRaf = 0;
    }
    removeEnvironmentBodies();
    const brandMarkTextOnlyDrop = isBrandMarkMainWordmarkHitsBlocked();

    environmentBodies = [
      ...(brandMarkTextOnlyDrop ? [] : buildCardColliders()),
      ...(!brandMarkTextOnlyDrop && shouldIncludeMobileHeroBlockades()
        ? buildLeadTextColliders()
        : []),
      ...buildWordmarkLetterColliders()
    ];

    if (!brandMarkTextOnlyDrop) {
      if (getMobilePhysicsActive()) {
        if (mobileMark?.released) {
          environmentBodies.push(...buildViewportBounds({
            restitution: MOBILE_MARK_FLOOR_RESTITUTION,
            floorRestitution: MOBILE_MARK_FLOOR_RESTITUTION,
            includeBottom: true,
            includeTop: false
          }));
          environmentBodies.push(buildBannerCeilingCollider(MOBILE_MARK_FLOOR_RESTITUTION));
          environmentBodies.push(buildMobileMenuBarrierCollider(MOBILE_MARK_FLOOR_RESTITUTION));
          environmentBodies.push(...buildMobileGalleryCardFloorColliders(MOBILE_MARK_FLOOR_RESTITUTION));
        } else if (hasActiveLetters()) {
          environmentBodies.push(...buildViewportBounds({
            restitution: DESKTOP_MARK_WALL_RESTITUTION_LOW,
            floorRestitution: DESKTOP_MARK_WALL_RESTITUTION_LOW,
            includeBottom: true,
            includeTop: false
          }));
          environmentBodies.push(buildBannerCeilingCollider(DESKTOP_MARK_WALL_RESTITUTION_LOW));
          environmentBodies.push(...buildMobileGalleryCardFloorColliders(DESKTOP_MARK_WALL_RESTITUTION_LOW));
        } else {
          environmentBodies.push(...buildViewportBounds());
        }
      } else if (desktopBrandMark?.released) {
        const surfaceRestitution = getDesktopMarkSurfaceRestitution();
        const floorRestitution = getDesktopMarkFloorRestitution();

        environmentBodies.push(...buildViewportBounds({
          restitution: surfaceRestitution,
          floorRestitution,
          includeBottom: true,
          includeTop: false
        }));
        environmentBodies.push(buildBannerCeilingCollider(surfaceRestitution));
        environmentBodies.push(...buildGalleryFloorColliders(floorRestitution));
      } else if (hasActiveLetters()) {
        environmentBodies.push(...buildViewportBounds({
          restitution: DESKTOP_MARK_WALL_RESTITUTION_LOW,
          floorRestitution: DESKTOP_MARK_WALL_RESTITUTION_LOW,
          includeBottom: true
        }));
        environmentBodies.push(...buildGalleryFloorColliders(DESKTOP_MARK_WALL_RESTITUTION_LOW));
      }
    }

    environmentBodies.forEach((body) => {
      if (WORDMARK_LETTER_COLLIDER_LABEL_RE.test(body.label)) return;
      tagEnvironmentBody(body);
    });

    Composite.add(engine.world, environmentBodies);
  };

  const ensurePhysicsWorld = () => {
    if (engine) return;

    engine = Engine.create({
      gravity: { x: 0, y: 0.2 },
      enableSleeping: false,
      positionIterations: 16,
      velocityIterations: 16
    });
    runner = Runner.create({
      delta: 1000 / 60,
      isFixed: true
    });

    refreshEnvironmentColliders();
    bindMobileMarkCollisions();

    afterUpdateHandler = () => {
      if (userPhysicsDisabled) return;

      syncBannerKnockLooseFromScroll();

      const activeLetters = hasActiveLetters();
      const mobileMarkActive = Boolean(mobileMark?.body && mobileMark.released);
      const desktopMarkActive = Boolean(desktopBrandMark?.body && desktopBrandMark.released);
      const needsKnockColliderSync = introRunning
        || activeLetters
        || wordmark?.classList.contains("is-physics-falling")
        || pairs.some((pair) => isPairWordmarkKnockTarget(pair) || isPairMainLetterKnockTarget(pair));

      if (needsKnockColliderSync) {
        syncWordmarkLetterColliderPositions();
      }

      if (activeLetters || desktopMarkActive || mobileMarkActive) {
        checkWordmarkLetterKnockOverlaps();
      }

      if (activeLetters) {
        calmMainLetters();
        calmSublineLetters();
      }

      if (activeLetters || mobileMarkActive || desktopMarkActive) {
        syncDomFromBodies();
      }

      if (mobileMarkActive) {
        checkMobileMarkLetterHitUnlock();
        checkMobileBrandMarkFloorAnchor();
        updateMobileMarkScrollKnockFall();
      }

      if (desktopMarkActive) {
        checkDesktopMarkLetterHitUnlock();
        checkDesktopBrandMarkFloorAnchor();
        checkDesktopMarkLaunchReady();
      }

      if (getMobilePhysicsActive()) {
        checkMobileHeroGalleryZoneTransition();
      }

      if (activeLetters) {
        checkSettledLetters();
        checkFallenLetters();
      }

      maybeStopRunner();
    };
    Events.on(engine, "afterUpdate", afterUpdateHandler);
    if (!userPhysicsDisabled) startRunner();
  };

  const portalCharToViewport = (pair, rotationDeg = 0) => {
    const char = pair.char;
    const layer = getFallLayer();
    const center = {
      ...getCharViewportCenter(pair),
      rotationDeg
    };

    gsap.killTweensOf(char);
    layer.appendChild(char);
    char.style.position = "fixed";
    char.style.left = "0";
    char.style.top = "0";
    char.style.margin = "0";
    char.style.width = "auto";
    char.style.height = "auto";
    char.style.pointerEvents = "none";
    char.style.zIndex = "43";
    char.style.transform = "none";

    gsap.set(char, {
      x: center.x,
      y: center.y,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      rotation: rotationDeg,
      transformOrigin: "50% 62%"
    });

    return center;
  };

  const getSublineBodySpeed = (body) => Math.hypot(body.velocity.x, body.velocity.y);

  const getSublineBaseRestitution = (pair) => (
    isSublineFloorBounceSpent(pair)
      ? SUBLINE_FLOOR_SPENT_RESTITUTION
      : SUBLINE_LETTER_PHYSICS.restitution
  );

  const getSublineBaseFrictionAir = (pair) => (
    isSublineFloorBounceSpent(pair)
      ? Math.max(SUBLINE_LETTER_PHYSICS.frictionAir, SUBLINE_FLOOR_SPENT_FRICTION_AIR)
      : SUBLINE_LETTER_PHYSICS.frictionAir
  );

  const resetSublineLetterPhysics = (pair) => {
    if (!pair?.body) return;
    Body.set(pair.body, {
      restitution: getSublineBaseRestitution(pair),
      frictionAir: getSublineBaseFrictionAir(pair)
    });
  };

  const calmSublineLetterBody = (pair) => {
    if (pair.withIntro || !pair.released || pair.fallen || pair.rematerializing || !pair.body) {
      return;
    }

    const body = pair.body;
    let speed = getSublineBodySpeed(body);

    if (speed > SUBLINE_MAX_SPEED) {
      const scale = SUBLINE_MAX_SPEED / speed;
      Body.setVelocity(body, {
        x: body.velocity.x * scale,
        y: body.velocity.y * scale
      });
      speed = SUBLINE_MAX_SPEED;
    }

    const hotStart = SUBLINE_MAX_SPEED * SUBLINE_HOT_START_RATIO;
    const baseRestitution = getSublineBaseRestitution(pair);
    const baseFrictionAir = getSublineBaseFrictionAir(pair);

    if (speed >= hotStart) {
      pair.sublineHot = true;
      const hotT = Math.min(1, (speed - hotStart) / (SUBLINE_MAX_SPEED - hotStart));
      Body.set(body, {
        restitution: baseRestitution + (SUBLINE_HOT_RESTITUTION_FLOOR - baseRestitution) * hotT,
        frictionAir: baseFrictionAir + (SUBLINE_HOT_FRICTION_AIR - baseFrictionAir) * hotT
      });
      const av = body.angularVelocity;
      if (Math.abs(av) > 0.002) {
        Body.setAngularVelocity(body, av * (1 - hotT * (1 - SUBLINE_HOT_ANGULAR_DAMP)));
      }
      return;
    }

    if (!pair.sublineHot) return;

    if (speed < SUBLINE_CALM_SPEED) {
      pair.sublineHot = false;
      resetSublineLetterPhysics(pair);
      return;
    }

    const coolT = (speed - SUBLINE_CALM_SPEED) / (hotStart - SUBLINE_CALM_SPEED);
    const t = Math.max(0, Math.min(1, coolT));
    Body.set(body, {
      restitution: SUBLINE_HOT_RESTITUTION_FLOOR + (baseRestitution - SUBLINE_HOT_RESTITUTION_FLOOR) * t,
      frictionAir: SUBLINE_HOT_FRICTION_AIR + (baseFrictionAir - SUBLINE_HOT_FRICTION_AIR) * t
    });
  };

  const calmSublineLetters = () => {
    pairs.forEach(calmSublineLetterBody);
  };

  const calmMainLetterBody = (pair) => {
    if (!pair.withIntro || !pair.released || pair.fallen || pair.rematerializing || !pair.body) {
      return;
    }
    clampBodyToMaxSpeed(pair.body, getMainLetterMaxSpeed());
  };

  const calmMainLetters = () => {
    pairs.forEach(calmMainLetterBody);
  };

  const syncDomFromBodies = () => {
    pairs.forEach((pair) => {
      if (!pair.released || pair.fallen || pair.rematerializing || !pair.body) return;
      gsap.set(pair.char, {
        x: Math.round(pair.body.position.x * 10) / 10,
        y: Math.round(pair.body.position.y * 10) / 10,
        xPercent: -50,
        yPercent: -50,
        scale: 1,
        rotation: Math.round(pair.body.angle * (180 / Math.PI) * 100) / 100
      });
    });
    syncMobileMark();
    syncDesktopBrandMark();
  };

  const checkSettledLetters = () => {
    const now = performance.now();
    const offscreenThreshold = window.innerHeight + OFFSCREEN_PAD;
    const groupIdle = isLetterGroupVisuallyIdle(now);

    if (groupIdle) {
      if (groupSettledSince === null) {
        groupSettledSince = now;
      }
    } else {
      groupSettledSince = null;
    }

    const groupSettleAge = groupSettledSince ? now - groupSettledSince : 0;
    const forceGroupReturn = !introRunning && groupIdle && groupSettleAge >= REMATERIALIZE_MAX_WAIT_MS;
    const normalReturnMs = introRunning ? INTRO_SETTLE_RETURN_MS : SETTLE_RETURN_MS;
    const minReturnMs = introRunning
      ? Math.min(INTRO_SETTLE_RETURN_MS, REMATERIALIZE_SETTLE_MIN_MS)
      : REMATERIALIZE_SETTLE_MIN_MS;

    pairs.forEach((pair) => {
      if (!pair.released || pair.fallen || pair.rematerializing || !pair.body) {
        pair.settledSince = null;
        resetPairSettleSample(pair);
        return;
      }

      if (pair.body.position.y >= offscreenThreshold) {
        pair.settledSince = null;
        resetPairSettleSample(pair);
        return;
      }

      samplePairSettleSpeed(pair, now);

      if (isPairActivelyBouncing(pair)) {
        pair.lowEnergySince = null;
      } else if (pair.lowEnergySince === null) {
        pair.lowEnergySince = now;
      }

      const lowEnergyAge = pair.lowEnergySince ? now - pair.lowEnergySince : 0;
      const forceStragglerReturn = getMobilePhysicsActive()
        && !introRunning
        && lowEnergyAge >= REMATERIALIZE_MAX_WAIT_MS;
      const effectivelySettled = isPairEffectivelySettled(pair, now, groupIdle)
        || (forceStragglerReturn && lowEnergyAge >= REMATERIALIZE_SETTLE_MIN_MS);

      if (!effectivelySettled) {
        pair.settledSince = null;
        return;
      }

      if (pair.settledSince === null) {
        pair.settledSince = now;
        if (!forceStragglerReturn) return;
      }

      const settleAge = now - pair.settledSince;
      const accelerated = forceGroupReturn || forceStragglerReturn || settleAge >= REMATERIALIZE_MAX_WAIT_MS;
      const readyToReturn = accelerated
        || (settleAge >= normalReturnMs && settleAge >= minReturnMs);

      if (readyToReturn) {
        pair.settledSince = null;
        returnLetterToSlot(pair, { accelerated });
      }
    });
  };

  const checkFallenLetters = () => {
    const threshold = window.innerHeight + OFFSCREEN_PAD;
    const groupAgeAtFall = groupSettledSince ? performance.now() - groupSettledSince : 0;

    pairs.forEach((pair) => {
      if (!pair.released || pair.fallen || pair.rematerializing || !pair.body) return;
      if (pair.body.position.y <= threshold) return;

      pair.fallen = true;
      pair.released = false;
      pair.settledSince = null;
      resetPairSettleSample(pair);
      Composite.remove(engine.world, pair.body);
      pair.body = null;
      pair.char.style.opacity = "0";

      const accelerated = groupAgeAtFall >= REMATERIALIZE_MAX_WAIT_MS;
      window.setTimeout(
        () => rematerializeLetter(pair, { accelerated }),
        REMATERIALIZE_DELAY_MS
      );
    });
  };

  const returnLetterToSlot = (pair, { accelerated = false, onComplete } = {}) => {
    if (!pair || pair.rematerializing || !pair.body) return;

    const body = pair.body;
    const currentX = body.position.x;
    const currentY = body.position.y;
    const currentRot = body.angle * (180 / Math.PI);

    pair.rematerializing = true;
    pair.released = false;
    pair.fallen = false;
    pair.settledSince = null;
    resetPairSettleSample(pair);
    Composite.remove(engine.world, body);
    pair.body = null;

    pair.char.classList.remove("is-falling-char");
    pair.char.classList.add("is-rematerializing-char");
    pair.root.classList.add("is-rematerializing");
    pair.char.style.zIndex = String(43 + pair.index);

    const layer = getFallLayer();
    if (!layer.contains(pair.char)) {
      layer.appendChild(pair.char);
    }

    const { x: targetX, y: targetY } = getPairRematerializeTarget(pair);

    gsap.killTweensOf(pair.char);
    pair.char.style.position = "fixed";
    pair.char.style.left = "0";
    pair.char.style.top = "0";
    pair.char.style.pointerEvents = "none";
    pair.char.style.opacity = "1";
    pair.char.style.zIndex = String(43 + pair.index);
    pair.char.style.transform = "none";

    gsap.set(pair.char, {
      x: currentX,
      y: currentY,
      xPercent: -50,
      yPercent: -50,
      scale: 1,
      rotation: currentRot,
      filter: "blur(0px)"
    });

    const returnDuration = accelerated
      ? REMATERIALIZE_FORCE_RETURN_DURATION + Math.random() * 0.08
      : 0.92 + Math.random() * 0.16;
    const returnTween = {
      x: targetX,
      y: targetY,
      rotation: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: returnDuration,
      ease: RETURN_TWEEN_EASE,
      overwrite: "auto",
      onComplete: () => {
        finishLetterRematerialize(pair);
        onComplete?.();
      }
    };

    if (introRunning && pair.introTintColor) {
      returnTween.color = "#ffffff";
    }

    gsap.to(pair.char, returnTween);
  };

  const primeCharForShakeLoose = (pair) => {
    const char = pair.char;
    const targetLine = pair.line;

    if (!targetLine.contains(char)) {
      targetLine.appendChild(char);
    }

    // Stop in-flight tweens while the char still sits at its painted position.
    gsap.killTweensOf(char);

    if (targetLine.contains(char)) {
      syncPairSlotFromPaintedCenter(pair);
    } else {
      hydratePairSlot(pair);
      const lineRect = targetLine.getBoundingClientRect();
      const { x: viewX, y: viewY } = getCharViewportCenter(pair);
      pair.slot.x = viewX - lineRect.left;
      pair.slot.y = viewY - lineRect.top;
    }

    handoffCharToGsapShakeAnchor(pair);
  };

  const shakeLoose = (pair, runId) => new Promise((resolve) => {
    const char = pair.char;
    // Main wordmark: use R (idx 2) and E (idx 3) base values for all letters —
    // small magnitude keeps the shake visually consistent with those two.
    const endRotation = (
      pair.withIntro
        ? (pair.index % 2 === 0 ? -0.9 : 0.15)
        : -3 + (pair.index * 1.05) % 6
    ) + (Math.random() - 0.5) * 1.2;
    const nudgeBase = pair.withIntro ? 0.2 : 0.35;
    const nudgeJitter = pair.withIntro ? 0.11 : 0.25;
    const endNudgeX = (endRotation >= 0 ? nudgeBase : -nudgeBase) + (Math.random() - 0.5) * nudgeJitter;
    const releaseY = pair.withIntro ? 0.34 + Math.random() * 0.14 : 0.45 + Math.random() * 0.2;
    let settled = false;

    const finishShake = () => {
      if (settled || pair.shakeRunId !== runId) return;
      settled = true;
      pair.releaseRotation = gsap.getProperty(char, "rotation") || endRotation;
      pair.shakeTimeline = null;
      resolve();
    };

    if (pair.shakeTimeline) {
      pair.shakeTimeline.kill();
      pair.shakeTimeline = null;
    }

    primeCharForShakeLoose(pair);

    const timeline = gsap.timeline({
      onComplete: finishShake,
      onInterrupt: finishShake
    });

    pair.shakeTimeline = timeline;

    timeline.to(char, {
      x: `+=${endNudgeX}`,
      y: `+=${releaseY}`,
      rotation: endRotation,
      scale: 1,
      duration: pair.withIntro ? 0.13 : 0.11,
      ease: pair.withIntro ? "sine.out" : "power2.out"
    });
  });

  const beginPhysics = (pair) => {
    const releaseRotation = pair.releaseRotation ?? gsap.getProperty(pair.char, "rotation") ?? 0;
    const tiltRad = releaseRotation * (Math.PI / 180);
    const center = portalCharToViewport(pair, releaseRotation);

    const letterPhysics = pair.withIntro ? LETTER_PHYSICS : SUBLINE_LETTER_PHYSICS;
    const body = Bodies.rectangle(center.x, center.y, pair.width, pair.height, {
      isStatic: false,
      angle: tiltRad,
      ...letterPhysics,
      chamfer: { radius: 2 },
      label: `surette-char-${pair.index}`,
      collisionFilter: pair.withIntro
        ? getMainWordmarkCollisionFilter()
        : getSublineWordmarkCollisionFilter()
    });

    const spinSign = releaseRotation >= 0 ? 1 : -1;
    const introFallBoost = introRunning && pair.withIntro;
    Body.setVelocity(body, introFallBoost
      ? {
        x: (Math.random() - 0.5) * 0.22,
        y: 1.1 + Math.random() * 0.35
      }
      : { x: 0, y: 0 });
    Body.setAngularVelocity(body, spinSign * (0.003 + Math.random() * 0.005));

    pair.body = body;
    clearShakeHandoff(pair);
    pair.released = true;
    pair.fallen = false;
    pair.settledSince = null;
    resetPairSettleSample(pair);
    pair.sublineHot = false;
    pair.sublineFloorBounces = 0;
    pair.sublineFloorBounceCooldown = 0;
    pair.char.classList.remove("is-loosening-char");
    pair.char.classList.add("is-falling-char");
    pair.char.style.opacity = "1";
    pair.char.style.zIndex = String(43 + pair.index);
    // Flush stale environment bodies (including this letter's own static collider from the
    // previous cycle) synchronously before the dynamic body enters the world.  Without this,
    // the padded static collider (22 % larger than the body) is still present at the same
    // centre, the body spawns fully inside it, and Matter.js fires a large lateral separation
    // impulse that shoots the letter to the edge of the screen on every re-engagement.
    refreshEnvironmentColliders();
    Composite.add(engine.world, body);
    syncDomFromBodies();
    startRunner();
  };

  const resetLetterCycle = (pair) => {
    if (pair.shakeTimeline) {
      pair.shakeTimeline.kill();
      pair.shakeTimeline = null;
    }
    pair.cycleActive = false;
    pair.releaseCommitted = false;
    pair.loosening = false;
    pair.released = false;
    pair.fallen = false;
    pair.rematerializing = false;
    pair.settledSince = null;
    resetPairSettleSample(pair);
    pair.sublineHot = false;
    pair.sublineFloorBounces = 0;
    pair.sublineFloorBounceCooldown = 0;
    clearShakeHandoff(pair);
    pair.body = null;
    pair.char.classList.remove("is-loosening-char", "is-cycle-active", "is-engage-cooldown");
    pair.char.style.pointerEvents = "auto";
    pair.char.style.cursor = "";
    pair.char.style.zIndex = "";
    pair.hoverArmRequired = false;
  };

  const abortLetterRelease = (pair) => {
    resetLetterCycle(pair);
    restorePairToLineSlot(pair);
  };

  const releaseLetter = async (pair) => {
    if (userPhysicsDisabled) return;
    if (!pair || pair.cycleActive || pair.releaseCommitted || pair.loosening || pair.rematerializing) {
      return;
    }

    pair.cycleActive = true;
    pair.releaseCommitted = true;

    const runId = ++pair.shakeRunId;
    pair.loosening = true;
    pair.char.classList.add("is-cycle-active");
    pair.char.style.pointerEvents = "none";

    if (pair.withIntro && pair.char.classList.contains("is-intro-filling")) {
      freezeIntroFillLetter(pair);
    }

    try {
      ensurePhysicsWorld();
      await shakeLoose(pair, runId);

      if (!pair.cycleActive || pair.shakeRunId !== runId) {
        abortLetterRelease(pair);
        return;
      }

      if (lowPerformance) {
        abortLetterRelease(pair);
        return;
      }

      pair.root.classList.add("is-falling");
      if (pair.withIntro) {
        wordmark?.classList.add("is-physics-falling");
      }
      beginPhysics(pair);
    } catch (error) {
      abortLetterRelease(pair);
    } finally {
      if (pair.shakeRunId === runId) {
        pair.loosening = false;
      }
    }
  };

  const pickSpawnPoint = (index) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const margin = 100;
    const slots = [
      { x: -margin, y: h * 0.1 + (index * 41) % (h * 0.3) },
      { x: w + margin, y: h * 0.18 + (index * 57) % (h * 0.36) },
      { x: w * (0.06 + (index % 5) * 0.17), y: -margin },
      { x: w * (0.78 + (index % 3) * 0.06), y: -margin - 40 },
      { x: -margin, y: h * 0.52 + (index % 3) * 52 },
      { x: w + margin, y: h * 0.58 + (index % 4) * 40 },
      { x: w * (0.1 + (index % 4) * 0.2), y: h + margin }
    ];
    return slots[index % slots.length];
  };

  const rematerializeLetter = (pair, { accelerated = false, onComplete } = {}) => {
    if (!pair || pair.rematerializing) return;

    pair.rematerializing = true;
    pair.fallen = false;
    pair.released = false;
    pair.settledSince = null;
    resetPairSettleSample(pair);
    pair.char.classList.remove("is-falling-char");
    pair.char.classList.add("is-rematerializing-char");
    pair.char.style.zIndex = String(43 + pair.index);

    const layer = getFallLayer();
    if (!layer.contains(pair.char)) {
      layer.appendChild(pair.char);
    }

    const spawn = pickSpawnPoint(pair.index);
    const { x: targetX, y: targetY } = getPairRematerializeTarget(pair);
    const spawnAngle = (Math.random() - 0.5) * 1.35;

    pair.char.style.position = "fixed";
    pair.char.style.left = "0";
    pair.char.style.top = "0";
    pair.char.style.pointerEvents = "none";
    pair.char.style.zIndex = String(43 + pair.index);

    gsap.set(pair.char, {
      x: spawn.x,
      y: spawn.y,
      xPercent: -50,
      yPercent: -50,
      rotation: spawnAngle * (180 / Math.PI),
      opacity: 0,
      scale: 0.38,
      filter: "blur(8px)"
    });

    const returnDuration = accelerated
      ? REMATERIALIZE_FORCE_SPAWN_DURATION + Math.random() * 0.1
      : introRunning
        ? 1.32 + Math.random() * 0.42
        : 1.08 + Math.random() * 0.28;
    const returnTween = {
      x: targetX,
      y: targetY,
      rotation: 0,
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      duration: returnDuration,
      ease: RETURN_TWEEN_EASE,
      overwrite: "auto",
      onComplete: () => {
        finishLetterRematerialize(pair);
        onComplete?.();
      }
    };

    if (introRunning && pair.introTintColor) {
      returnTween.color = "#ffffff";
    }

    gsap.to(pair.char, returnTween);
  };

  const resolveIntroLetter = (pair) => {
    if (!pair.introResolve) return;
    const done = pair.introResolve;
    pair.introResolve = null;
    done();
  };

  const armLetterEngageCooldown = (pair) => {
    const cooldownMs = LETTER_REMARERIALIZE_ENGAGE_COOLDOWN_MS;
    pair.engageCooldownUntil = performance.now() + cooldownMs;
    pair.char.classList.add("is-engage-cooldown");
    pair.char.style.pointerEvents = "none";

    window.setTimeout(() => {
      if (performance.now() < pair.engageCooldownUntil) return;
      requestAnimationFrame(() => {
        if (performance.now() < pair.engageCooldownUntil) return;
        pair.char.classList.remove("is-engage-cooldown");
        armLetterHoverEngage(pair);
        if (!pair.cycleActive && !pair.rematerializing && !pair.loosening) {
          pair.char.style.pointerEvents = "auto";
        }
      });
    }, cooldownMs);
  };

  const finishLetterRematerialize = (pair) => {
    gsap.killTweensOf(pair.char);

    if (pair.introTintColor) {
      pair.char.style.removeProperty("color");
      pair.introTintColor = null;
    }

    // Do NOT re-measure the char's viewport position here.  When the user scrolls
    // during a rematerialize tween the char ends up at a stale viewport position
    // and commitPairSlotFromDom would corrupt pair.slot by adding the scroll delta.
    // The dataset values written by syncPairSlotFromPaintedCenter at cycle-start
    // are line-relative and always correct; slotLayoutItem reads those directly.
    restoreCharToLine(slotLayoutItem(pair), pair);
    resetLetterCycle(pair);
    resolveIntroLetter(pair);
    armLetterEngageCooldown(pair);

    if (isWordmarkFullyIdle()) {
      finalizeWordmarkGroupIdle();
    }

    if (
      (getMobilePhysicsActive() && mobileMark)
      || desktopBrandMark?.released
      || pairs.some((entry) => isPairWordmarkKnockTarget(entry) || isPairMainLetterKnockTarget(entry))
    ) {
      scheduleRefreshEnvironmentColliders();
    }
  };

  const trackPerformance = (now) => {
    if (!runnerActive) return;
    frameBudget.push(now);
    if (frameBudget.length > 30) frameBudget.shift();
    if (frameBudget.length < 30) return;

    const elapsed = frameBudget[29] - frameBudget[0];
    const fps = (frameBudget.length - 1) / (elapsed / 1000);
    if (fps >= 28) return;

    lowPerformance = true;
    pairs.forEach((pair) => {
      if (pair.body && engine) Composite.remove(engine.world, pair.body);
      pair.body = null;
      pair.released = false;
      pair.fallen = false;
      resetLetterCycle(pair);
      restorePairToLineSlot(pair);
    });
    teardownMobilePhysics();
    teardownDesktopBrandMark();
    stopRunner();
    frameBudget.length = 0;
    wordmarkContexts.forEach((ctx) => {
      ctx.root.classList.remove("is-falling", "is-rematerializing");
    });
    wordmark?.classList.remove("is-physics-falling");
  };

  const startRunner = () => {
    if (!engine || runnerActive || lowPerformance || userPhysicsDisabled) return;
    Runner.run(runner, engine);
    runnerActive = true;

    const loop = (now) => {
      if (!runnerActive) return;
      trackPerformance(now);
      rafSync = requestAnimationFrame(loop);
    };
    rafSync = requestAnimationFrame(loop);
  };

  const stopRunner = () => {
    if (runner && runnerActive) {
      Runner.stop(runner);
      runnerActive = false;
    }
    cancelAnimationFrame(rafSync);
  };

  const freezePhysicsBody = (body) => {
    if (!body || body.isStatic || frozenBodyIds.has(body.id)) return;
    Body.setVelocity(body, { x: 0, y: 0 });
    Body.setAngularVelocity(body, 0);
    Body.setStatic(body, true);
    frozenBodyIds.add(body.id);
  };

  const unfreezeAllPhysicsBodies = () => {
    if (!engine) return;

    Composite.allBodies(engine.world).forEach((body) => {
      if (!frozenBodyIds.has(body.id)) return;
      Body.setStatic(body, false);
      frozenBodyIds.delete(body.id);
    });
  };

  const getBrandMarkHomeRect = () => {
    if (brandMarkSpacer) {
      return brandMarkSpacer.getBoundingClientRect();
    }

    const source = document.querySelector(MOBILE_MARK_SELECTOR);
    if (!source) return null;

    if (!source.classList.contains("sds-hero__brand-mark--physics-captured")) {
      return source.getBoundingClientRect();
    }

    source.classList.remove("sds-hero__brand-mark--physics-captured");
    source.style.visibility = "hidden";
    source.style.pointerEvents = "none";
    const rect = source.getBoundingClientRect();
    source.classList.add("sds-hero__brand-mark--physics-captured");
    source.style.removeProperty("visibility");
    source.style.removeProperty("pointer-events");
    return rect;
  };

  const getBrandMarkHomeCenter = () => {
    const rect = getBrandMarkHomeRect();
    if (!rect || rect.width < 1 || rect.height < 1) return null;
    return {
      x: rect.left + rect.width * 0.5,
      y: rect.top + rect.height * 0.5
    };
  };

  const finishParkMobileBrandMark = () => {
    destroyMarkDeadZone(mobileMark);
    mobileMark = null;
    mobileMarkLetterHitsEnabled = false;
    getFallLayer().classList.remove("is-mobile-mark-gallery-anchored");
    restoreBrandMarkSource();
    if (engine) refreshEnvironmentColliders();
  };

  const completeBrandMarkPark = (mark, finish) => {
    if (!mark) {
      finish?.();
      return;
    }

    gsap.killTweensOf(mark.el);

    if (mark.body && engine) {
      if (frozenBodyIds.has(mark.body.id)) {
        frozenBodyIds.delete(mark.body.id);
      }
      Composite.remove(engine.world, mark.body);
    }

    mark.el?.remove();
    finish?.();
  };

  const parkBrandMarkToHome = (mark, finish) => {
    if (!mark?.released || !mark.el) {
      finish?.();
      return;
    }

    const home = getBrandMarkHomeCenter();
    if (!home) {
      completeBrandMarkPark(mark, finish);
      return;
    }

    if (mark.body) {
      Body.setVelocity(mark.body, { x: 0, y: 0 });
      Body.setAngularVelocity(mark.body, 0);
      if (!mark.body.isStatic) {
        Body.setStatic(mark.body, true);
      }
    }

    gsap.to(mark.el, {
      x: home.x,
      y: home.y,
      rotation: 0,
      duration: BRAND_MARK_HOME_RETURN_DURATION,
      ease: "power2.inOut",
      onComplete: () => {
        completeBrandMarkPark(mark, finish);
      }
    });
  };

  const cancelBrandMarkParking = () => {
    const snapAndFinish = (mark, finish) => {
      if (!mark?.released) {
        finish?.();
        return;
      }

      gsap.killTweensOf(mark.el);
      const home = getBrandMarkHomeCenter();
      if (home && mark.el) {
        gsap.set(mark.el, { x: home.x, y: home.y, rotation: 0 });
      }
      completeBrandMarkPark(mark, finish);
    };

    if (desktopBrandMark?.released) {
      snapAndFinish(desktopBrandMark, () => teardownDesktopBrandMark());
    }

    if (mobileMark?.released) {
      snapAndFinish(mobileMark, finishParkMobileBrandMark);
    }

    brandMarkParkingActive = false;
  };

  const parkActiveBrandMarksForToggle = () => {
    const jobs = [];

    if (desktopBrandMark?.released && desktopBrandMark.el) {
      jobs.push(new Promise((resolve) => {
        parkBrandMarkToHome(desktopBrandMark, () => {
          teardownDesktopBrandMark();
          resolve();
        });
      }));
    }

    if (mobileMark?.released && mobileMark.el) {
      jobs.push(new Promise((resolve) => {
        parkBrandMarkToHome(mobileMark, () => {
          finishParkMobileBrandMark();
          resolve();
        });
      }));
    }

    if (!jobs.length) return Promise.resolve();

    brandMarkParkingActive = true;
    return Promise.all(jobs).finally(() => {
      brandMarkParkingActive = false;
    });
  };

  const haltActiveInteractionsForDisable = () => {
    introDelayTimers.forEach((timer) => window.clearTimeout(timer));
    introDelayTimers.clear();
    introAbortRequested = true;

    pairs.forEach((pair) => {
      if (pair.introFillTimeline) {
        freezeIntroFillLetter(pair);
      }
      if (pair.introFillResolve) {
        pair.introFillResolve = null;
      }
      cancelIntroLetterTimers(pair);

      if (pair.shakeTimeline && !pair.rematerializing && !pair.body) {
        pair.shakeTimeline.kill();
        pair.shakeTimeline = null;
      }

      pair.settledSince = null;
      resetPairSettleSample(pair);

      if (!pair.rematerializing) {
        gsap.killTweensOf(pair.char, "x,y,rotation,scale,opacity,filter,color");
      }
    });

    groupSettledSince = null;

    if (introRunning) {
      introRunning = false;
    }
  };

  const pairNeedsPhysicsDisableReturn = (pair) => (
    pair.body
    || pair.fallen
    || pair.released
    || pair.rematerializing
    || pair.cycleActive
    || pair.loosening
  );

  const waitForPairRematerialize = (pair) => new Promise((resolve) => {
    const step = () => {
      if (!pair.rematerializing) {
        resolve();
        return;
      }
      requestAnimationFrame(step);
    };
    step();
  });

  const returnPairForPhysicsDisable = (pair) => new Promise((resolve) => {
    if (!pair) {
      resolve();
      return;
    }

    if (pair.rematerializing) {
      waitForPairRematerialize(pair).then(resolve);
      return;
    }

    const finish = () => resolve();

    if (pair.body) {
      returnLetterToSlot(pair, { accelerated: true, onComplete: finish });
      if (!pair.rematerializing) finish();
      return;
    }

    if (pair.fallen || pair.released || pair.cycleActive || pair.loosening) {
      if (pair.shakeTimeline) {
        pair.shakeTimeline.kill();
        pair.shakeTimeline = null;
      }
      pair.loosening = false;
      pair.cycleActive = false;
      pair.releaseCommitted = false;
      pair.char.classList.remove("is-cycle-active");
      rematerializeLetter(pair, { accelerated: true, onComplete: finish });
      if (!pair.rematerializing) finish();
      return;
    }

    resolve();
  });

  const returnAllLettersForPhysicsDisable = () => {
    const jobs = pairs
      .filter(pairNeedsPhysicsDisableReturn)
      .map((pair) => returnPairForPhysicsDisable(pair));
    return jobs.length ? Promise.all(jobs) : Promise.resolve();
  };

  const finalizePhysicsDisable = () => {
    if (engine) {
      syncDomFromBodies();
      pairs.forEach((pair) => {
        if (pair.body) freezePhysicsBody(pair.body);
      });
      stopRunner();
    }
  };

  const disablePhysics = () => {
    if (userPhysicsDisabled) return;
    userPhysicsDisabled = true;
    document.documentElement.dataset.sdsPhysicsDisabled = "true";

    const session = ++physicsDisableSession;
    physicsDisablePending = true;
    haltActiveInteractionsForDisable();

    void Promise.all([
      returnAllLettersForPhysicsDisable(),
      parkActiveBrandMarksForToggle()
    ]).finally(() => {
      if (session !== physicsDisableSession) return;
      physicsDisablePending = false;
      finalizePhysicsDisable();
    });
  };

  const enablePhysics = () => {
    if (!userPhysicsDisabled) return;
    physicsDisableSession += 1;
    physicsDisablePending = false;
    userPhysicsDisabled = false;
    delete document.documentElement.dataset.sdsPhysicsDisabled;

    if (brandMarkParkingActive || desktopBrandMark?.el || mobileMark?.el) {
      cancelBrandMarkParking();
    }

    unfreezeAllPhysicsBodies();

    if (engine && hasActivePhysicsBodies()) {
      startRunner();
    }
  };

  const savePhysicsPref = (enabled) => {
    try { localStorage.setItem(PHYSICS_PREF_KEY, enabled ? "1" : "0"); } catch (_) {}
  };

  const loadPhysicsPref = () => {
    try {
      const v = localStorage.getItem(PHYSICS_PREF_KEY);
      return v === null ? null : v !== "0";
    } catch (_) { return null; }
  };

  const bindPhysicsToggle = () => {
    const toggleRoot = document.querySelector(".sds-physics-toggle");
    const toggle = document.getElementById("sds-physics-toggle-input");
    if (!toggle || !toggleRoot) return;

    // Restore the user's saved preference across page loads and language
    // versions.  We apply this before the rest of init() runs so that
    // playLoadIntro() and all physics guards see the correct state from
    // the very first frame.
    const savedPref = loadPhysicsPref();
    if (savedPref === false) {
      toggle.checked = false;
      userPhysicsDisabled = true;
      document.documentElement.dataset.sdsPhysicsDisabled = "true";
    }

    const syncToggleUi = () => {
      const physicsOn = toggle.checked;
      toggle.setAttribute("aria-checked", String(physicsOn));
      toggleRoot.classList.toggle("is-physics-on", physicsOn);
      const textEl = toggleRoot.querySelector(".sds-physics-toggle__text");
      const isEs = textEl?.textContent?.trim() === "Física";
      toggle.setAttribute(
        "aria-label",
        physicsOn
          ? (isEs ? "Física activada" : "Physics enabled")
          : (isEs ? "Física desactivada" : "Physics disabled")
      );
    };

    physicsToggleChangeHandler = () => {
      if (toggle.checked) {
        enablePhysics();
      } else {
        disablePhysics();
      }
      savePhysicsPref(toggle.checked);
      syncToggleUi();
    };

    toggle.addEventListener("change", physicsToggleChangeHandler);

    syncToggleUi();
  };

  const maybeStopRunner = () => {
    if (introRunning) return;
    if (!hasActivePhysicsBodies()) {
      stopRunner();
    }
  };

  const settleFrames = (count = 2) => new Promise((resolve) => {
    const step = (remaining) => {
      if (remaining <= 0) {
        resolve();
        return;
      }
      requestAnimationFrame(() => step(remaining - 1));
    };
    step(count);
  });

  const revealWordmark = () => new Promise((resolve) => {
    root.classList.remove("is-booting");
    gsap.set(line, { opacity: 1, y: 0 });
    resolve();
  });

  const prepareSplitLayout = () => {
    gsap.killTweensOf(line);
    gsap.set(line, { clearProps: "transform" });
    gsap.set(line, { opacity: 0, y: 14 });

    wordmarkContexts.forEach((ctx) => {
      stabilizeWordmarkTypography(ctx.line);
      lockLineBox(ctx.line);
    });

    captureOriginalLayout();
    initPairRegistry();

    wordmarkContexts.forEach((ctx) => {
      ctx.root.classList.add("is-split", "is-ready");
    });

    markSublineWordsVisible();

    applyDomFromLayout(originalLayout);
    updateAllWordmarkArenas();
    root.classList.remove("is-intro");
    ensurePhysicsWorld();
    refreshEnvironmentColliders();
    window.requestAnimationFrame(() => {
      runBannerKnockLooseChecks();
    });

    window.dispatchEvent(new CustomEvent("sds-apps-ready", {
      detail: { phase: "split-ready" }
    }));
  };

  const shuffleLetters = (items) => {
    const order = [...items];
    for (let i = order.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  };

  const delay = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

  const cancellableIntroDelay = (ms) => new Promise((resolve) => {
    if (introAbortRequested) {
      resolve();
      return;
    }

    const timer = window.setTimeout(() => {
      introDelayTimers.delete(timer);
      resolve();
    }, ms);
    introDelayTimers.add(timer);
  });

  const cancelIntroLetterTimers = (pair) => {
    if (pair.introFallTimer != null) {
      window.clearTimeout(pair.introFallTimer);
      pair.introFallTimer = null;
    }
    if (pair.introSafetyTimer != null) {
      window.clearTimeout(pair.introSafetyTimer);
      pair.introSafetyTimer = null;
    }
  };

  const resolveIntroFillWait = (pair) => {
    if (!pair.introFillResolve) return;
    const done = pair.introFillResolve;
    pair.introFillResolve = null;
    done();
  };

  const freezeIntroFillLetter = (pair) => {
    const { char } = pair;
    if (!char.classList.contains("is-intro-filling")) return;

    if (pair.introFillTimeline) {
      pair.introFillTimeline.kill();
      pair.introFillTimeline = null;
    }

    gsap.killTweensOf(char, "--intro-fill");
    gsap.killTweensOf(char, "--intro-color-mix");
    char.classList.add("is-intro-fill-frozen");
    char.style.animation = "none";
    syncIntroFillTint(char);
    stopIntroTintSync(char);
    pair.introTintColor = getIntroFillSettledColor(char);
  };

  const finishLoadIntroEarly = () => {
    introRunning = false;
    introComplete = true;
    root.classList.remove("is-load-intro", "is-falling", "is-rematerializing");
    wordmark?.classList.remove("is-physics-falling");

    if (getMobilePhysicsActive() && !mobileMark) {
      spawnMobileBrandMark();
      ensureMobileAccel();
    }

    runBannerKnockLooseChecks();
  };

  const abortLoadIntro = () => {
    if (!introRunning || introAbortRequested) return false;

    introAbortRequested = true;
    introDelayTimers.forEach((timer) => window.clearTimeout(timer));
    introDelayTimers.clear();

    pairs.filter((pair) => pair.withIntro).forEach((pair) => {
      if (pair.introFillResolve) {
        freezeIntroFillLetter(pair);
        resolveIntroFillWait(pair);
      }

      cancelIntroLetterTimers(pair);
      resolveIntroLetter(pair);
    });

    finishLoadIntroEarly();
    window.dispatchEvent(new CustomEvent("sds-wordmark-intro-abort"));
    return true;
  };

  const forceIntroLetterHome = (pair) => {
    if (!introRunning || !pair.introResolve) return;
    if (pair.rematerializing) return;

    if (pair.body) {
      returnLetterToSlot(pair);
      return;
    }

    if (pair.fallen) {
      rematerializeLetter(pair);
      return;
    }

    if (pair.cycleActive) {
      if (pair.shakeTimeline) {
        pair.shakeTimeline.kill();
        pair.shakeTimeline = null;
      }
      pair.loosening = false;
      rematerializeLetter(pair);
    }
  };

  const abortIntroLetter = (pair) => {
    if (pair.body && engine) Composite.remove(engine.world, pair.body);
    pair.body = null;
    gsap.killTweensOf(pair.char);
    clearIntroFillStyle(pair.char);
    abortLetterRelease(pair);
    resolveIntroLetter(pair);
  };

  const clearIntroFillStyle = (char) => {
    stopIntroTintSync(char);
    gsap.killTweensOf(char, "--intro-fill");
    gsap.killTweensOf(char, "--intro-color-mix");
    char.classList.remove("is-intro-filling", "is-intro-fill-frozen");
    delete char.dataset.introOverlay;
    char.style.removeProperty("--intro-color");
    char.style.removeProperty("--intro-fill");
    char.style.removeProperty("--intro-color-mix");
    char.style.removeProperty("--intro-tint");
    char.style.removeProperty("--intro-color");
    char.style.removeProperty("--intro-scan-offset");
    char.style.removeProperty("-webkit-text-fill-color");
    char.style.backgroundImage = "";
    char.style.backgroundClip = "";
    char.style.webkitBackgroundClip = "";
  };

  const buildIntroFillTargets = () => {
    const targets = [];
    let progress = 0;

    while (progress < 100) {
      const remaining = 100 - progress;
      const chunk = remaining * (0.2 + Math.random() * 0.22);
      progress = Math.min(100, progress + Math.max(chunk, remaining < 18 ? remaining : 8));
      targets.push(Math.round(progress));
    }

    if (targets[targets.length - 1] !== 100) {
      targets.push(100);
    }

    return targets;
  };

  const introTintSyncs = new Map();

  const syncIntroFillTint = (char) => {
    const styles = window.getComputedStyle(char);
    const mix = parseFloat(
      char.style.getPropertyValue("--intro-color-mix") || styles.getPropertyValue("--intro-color-mix")
    );
    const introColor = (
      char.style.getPropertyValue("--intro-color")
      || styles.getPropertyValue("--intro-color")
      || "#00F0FF"
    ).trim();

    if (!Number.isFinite(mix) || !introColor) {
      char.style.setProperty("--intro-tint", "#ffffff");
      return;
    }

    char.style.setProperty(
      "--intro-tint",
      gsap.utils.interpolate("#ffffff", introColor, Math.max(0, Math.min(1, mix / 100)))
    );
  };

  const startIntroTintSync = (char) => {
    stopIntroTintSync(char);
    const tick = () => syncIntroFillTint(char);
    introTintSyncs.set(char, tick);
    gsap.ticker.add(tick);
    syncIntroFillTint(char);
  };

  const stopIntroTintSync = (char) => {
    const tick = introTintSyncs.get(char);
    if (!tick) return;
    gsap.ticker.remove(tick);
    introTintSyncs.delete(char);
  };

  const getIntroFillSettledColor = (char) => {
    const tint = char.style.getPropertyValue("--intro-tint")
      || window.getComputedStyle(char).getPropertyValue("--intro-tint");
    if (tint && tint !== "#ffffff") {
      return tint.trim();
    }

    const introColor = char.style.getPropertyValue("--intro-color")
      || window.getComputedStyle(char).getPropertyValue("--intro-color");
    if (introColor && introColor.trim()) {
      return introColor.trim();
    }
    return "#ffffff";
  };

  const animateIntroFill = (pair) => new Promise((resolve) => {
    if (introAbortRequested) {
      resolve();
      return;
    }

    const { char } = pair;
    char.classList.add("is-intro-filling");
    const letterText = char.textContent.trim();
    if (letterText) {
      char.dataset.introOverlay = letterText;
    }
    char.style.setProperty("--intro-fill", "0%");
    char.style.setProperty("--intro-color-mix", "0%");
    char.style.setProperty("--intro-tint", "#ffffff");
    const introColor = pickIntroRgbColor();
    char.style.setProperty("--intro-color", introColor);
    char.style.setProperty("--intro-scan-offset", `${(Math.random() * 8).toFixed(2)}px`);
    startIntroTintSync(char);

    const targets = buildIntroFillTargets();
    pair.introFillResolve = resolve;
    const timeline = gsap.timeline({
      onComplete: () => {
        pair.introFillResolve = null;
        pair.introFillTimeline = null;
        const settledColor = getIntroFillSettledColor(char);
        clearIntroFillStyle(char);
        char.style.color = settledColor;
        pair.introTintColor = settledColor;
        resolve();
      }
    });
    pair.introFillTimeline = timeline;

    targets.forEach((target, index) => {
      const colorMixTarget = Math.min(100, Math.round(target * INTRO_COLOR_MIX_LEAD));
      timeline.to(char, {
        "--intro-fill": `${target}%`,
        "--intro-color-mix": `${colorMixTarget}%`,
        duration: (INTRO_FILL_STEP_MS + Math.random() * 180) / 1000,
        ease: "power2.inOut"
      });

      if (index < targets.length - 1) {
        timeline.to({}, {
          duration: (INTRO_FILL_PAUSE_MS + Math.random() * 280) / 1000
        });
      }
    });
  });

  const runIntroLetter = async (pair) => {
    await animateIntroFill(pair);
    if (introAbortRequested) return;

    await cancellableIntroDelay(INTRO_FILL_SETTLE_MS + Math.random() * 90);
    if (introAbortRequested) return;

    const completion = new Promise((resolve) => {
      pair.introResolve = resolve;
    });

    refreshEnvironmentColliders();
    await releaseLetter(pair);
    if (introAbortRequested) return;

    if (!pair.body && !pair.released && !pair.rematerializing && !pair.fallen) {
      resolveIntroLetter(pair);
      return;
    }

    pair.introFallTimer = window.setTimeout(() => forceIntroLetterHome(pair), INTRO_FALL_MAX_MS);
    pair.introSafetyTimer = window.setTimeout(() => abortIntroLetter(pair), INTRO_LETTER_MAX_MS);

    await completion;

    cancelIntroLetterTimers(pair);
  };

  const markSublineWordsVisible = () => {
    wordmarkContexts.forEach((ctx) => {
      if (!ctx.withIntro) {
        ctx.root.classList.add("is-visible");
      }
    });
  };

  const playLoadIntro = async () => {
    if (lowPerformance) {
      introComplete = true;
      return;
    }

    if (userPhysicsDisabled) {
      introComplete = true;
      return;
    }

    introRunning = true;
    introAbortRequested = false;
    root.classList.add("is-load-intro");
    ensurePhysicsWorld();
    refreshEnvironmentColliders();
    startRunner();

    const order = shuffleLetters(pairs.filter((pair) => pair.withIntro));
    const introRuns = [];

    for (let i = 0; i < order.length; i += 1) {
      if (lowPerformance || introAbortRequested) break;

      introRuns.push(runIntroLetter(order[i]));
    }

    if (!introAbortRequested) {
      await Promise.all(introRuns);
    }

    if (introAbortRequested) {
      return;
    }

    introRunning = false;
    introComplete = true;
    root.classList.remove("is-load-intro", "is-falling", "is-rematerializing");
    wordmark?.classList.remove("is-physics-falling");
    syncWordmarkIdleState();

    if (getMobilePhysicsActive() && !mobileMark) {
      spawnMobileBrandMark();
      ensureMobileAccel();
    }

    runBannerKnockLooseChecks();
  };

  const bindLetterInteractions = () => {
    ensurePointerMotionTracker();
    originalLayout.forEach((item) => {
      if (item.char.dataset.physicsLetterBound === "true") return;
      item.char.dataset.physicsLetterBound = "true";
      if (isWhitespaceChar(item.char)) return;

      item.char.addEventListener("pointerenter", (event) => engageLetterFromInteraction(item.char, event));
      item.char.addEventListener("pointermove", handleLetterHoverMotion);
      item.char.addEventListener("pointerleave", handleLetterHoverLeave);
      item.char.addEventListener("focus", (event) => engageLetterFromInteraction(item.char, event));
    });
  };

  const bindInteractions = () => {
    bindDesktopBrandMarkHover();
    ensurePointerMotionTracker();

    const handleEngage = (event) => {
      if (userPhysicsDisabled) return;
      if (getMobilePhysicsActive()) {
        ensureMobileAccel();
      }

      const char = event.target.closest(".char");
      const pair = char ? getPair(char) : null;
      if (!char || !pair) return;
      engageLetterFromInteraction(char, event);
    };

    wordmarkContexts.forEach((ctx) => {
      const arena = arenaEl(ctx);
      if (!arena || arena.dataset.physicsArenaBound === "true") return;
      arena.dataset.physicsArenaBound = "true";

      arena.addEventListener("pointerenter", (event) => {
        if (event.target.closest(".char")) return;
        handleEngage(event);
      }, true);
      arena.addEventListener("pointerdown", handleEngage);
      ctx.line.addEventListener("focusin", (event) => {
        const char = event.target.closest(".char");
        const pair = char ? getPair(char) : null;
        if (!char || !pair) return;
        engageLetterFromInteraction(char, event);
      });
    });

    bindLetterInteractions();
  };

  const bindDesktopBrandMarkHover = () => {
    const brandMarkSource = document.querySelector(MOBILE_MARK_SELECTOR);
    if (!brandMarkSource || brandMarkSource.dataset.desktopFallBound === "true") return;

    desktopBrandMarkEngageHandler = () => {
      if (userPhysicsDisabled || !getDesktopPhysicsActive()) return;
      engageDesktopBrandMark();
    };

    brandMarkSource.dataset.desktopFallBound = "true";
    brandMarkSource.addEventListener("pointerenter", desktopBrandMarkEngageHandler);
    brandMarkSource.addEventListener("pointerdown", desktopBrandMarkEngageHandler);
  };

  const destroyPhysicsPage = () => {
    if (pageDestroyed) return;
    pageDestroyed = true;
    window.__sdsPhysicsWordmarkDestroyed = true;

    haltActiveInteractionsForDisable();

    introTintSyncs.forEach((_, char) => stopIntroTintSync(char));
    introTintSyncs.clear();

    window.clearTimeout(brandMarkCollapseTimer);
    brandMarkCollapseTimer = 0;
    introDelayTimers.forEach((timer) => window.clearTimeout(timer));
    introDelayTimers.clear();

    cancelAnimationFrame(rafSync);
    rafSync = 0;
    if (refreshCollidersRaf) {
      cancelAnimationFrame(refreshCollidersRaf);
      refreshCollidersRaf = 0;
    }

    teardownMobilePhysics();
    teardownDesktopBrandMark();

    pairs.forEach((pair) => {
      if (pair.shakeTimeline) {
        pair.shakeTimeline.kill();
        pair.shakeTimeline = null;
      }
      if (pair.introFillTimeline) {
        pair.introFillTimeline.kill();
        pair.introFillTimeline = null;
      }
      if (pair.char) {
        gsap.killTweensOf(pair.char);
      }
      if (pair.body && engine) {
        Composite.remove(engine.world, pair.body);
      }
      pair.body = null;
    });

    gsap.killTweensOf(line);
    gsap.killTweensOf(wordmarkContexts.map((ctx) => ctx.line));

    stopRunner();

    if (engine) {
      if (afterUpdateHandler) {
        Events.off(engine, "afterUpdate", afterUpdateHandler);
        afterUpdateHandler = null;
      }
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      engine = null;
      runner = null;
      collisionHandlerBound = false;
    }

    environmentBodies = [];
    frozenBodyIds.clear();
    wordmarkLetterKnockCooldowns.clear();
    wordmarkLetterBounceCooldowns.clear();
    runnerActive = false;
    introRunning = false;
    userPhysicsDisabled = true;

    if (brandMarkScrollBound) {
      window.removeEventListener("scroll", onBrandMarkScroll);
      brandMarkScrollBound = false;
    }

    if (resizeHandlerBound) {
      window.removeEventListener("resize", onPhysicsResize);
      resizeHandlerBound = false;
    }

    if (pointerMotionTrackerBound && pointerMotionHandler) {
      document.removeEventListener("pointermove", pointerMotionHandler);
      pointerMotionTrackerBound = false;
      pointerMotionHandler = null;
    }

    if (desktopMarkLaunchLayerBound && desktopLaunchPointerHandler) {
      document.removeEventListener("pointerdown", desktopLaunchPointerHandler, true);
      desktopMarkLaunchLayerBound = false;
      desktopLaunchPointerHandler = null;
    }

    if (desktopLaunchClickHandler) {
      document.removeEventListener("click", desktopLaunchClickHandler, true);
      desktopLaunchClickHandler = null;
    }

    if (mobileMarkLaunchLayerBound && mobileLaunchPointerHandler) {
      document.removeEventListener("pointerdown", mobileLaunchPointerHandler, true);
      mobileMarkLaunchLayerBound = false;
      mobileLaunchPointerHandler = null;
    }

    if (mobileLaunchClickHandler) {
      document.removeEventListener("click", mobileLaunchClickHandler, true);
      mobileLaunchClickHandler = null;
    }

    const brandMarkSource = document.querySelector(MOBILE_MARK_SELECTOR);
    if (brandMarkSource && desktopBrandMarkEngageHandler) {
      brandMarkSource.removeEventListener("pointerenter", desktopBrandMarkEngageHandler);
      brandMarkSource.removeEventListener("pointerdown", desktopBrandMarkEngageHandler);
      delete brandMarkSource.dataset.desktopFallBound;
      desktopBrandMarkEngageHandler = null;
    }

    const physicsToggle = document.getElementById("sds-physics-toggle-input");
    if (physicsToggle && physicsToggleChangeHandler) {
      physicsToggle.removeEventListener("change", physicsToggleChangeHandler);
      physicsToggleChangeHandler = null;
    }

    const fallLayer = document.getElementById(FALL_LAYER_ID);
    if (fallLayer) {
      fallLayer.replaceChildren();
    }
  };

  window.__sdsPhysicsTeardown = destroyPhysicsPage;

  window.addEventListener("pagehide", () => {
    destroyPhysicsPage();
  }, { capture: true });

  window.addEventListener("beforeunload", () => {
    destroyPhysicsPage();
  }, { capture: true });

  window.addEventListener("pageshow", (event) => {
    if (event.persisted) {
      window.location.reload();
    }
  }, { capture: true });

  const onPhysicsResize = () => {
    if (pageDestroyed) return;
    if (!wordmarkContexts.some((ctx) => ctx.root.classList.contains("is-split"))) return;

    runBannerKnockLooseChecks();

    const wasMobile = root.classList.contains("is-mobile-physics");
    const nowMobile = getMobilePhysicsActive();

    if (desktopBrandMark?.released && engine && !nowMobile) {
      lastDesktopMarkScrollY = getPageScrollY();
      refreshEnvironmentColliders();
    }

    if (mobileMark?.released && engine && nowMobile) {
      lastMobileMarkScrollY = getPageScrollY();
      refreshEnvironmentColliders();
    }

    if (nowMobile && !wasMobile) {
      teardownDesktopBrandMark();
      setupMobilePhysics();
      if (introComplete && !mobileMark) void spawnMobileBrandMark();
    } else if (!nowMobile && wasMobile) {
      teardownMobilePhysics();
    }

    if (introRunning || hasActiveLetters() || pairs.some((pair) => pair.cycleActive || pair.rematerializing || pair.loosening)) {
      if (engine && nowMobile) refreshEnvironmentColliders();
      return;
    }

    wordmarkContexts.forEach((ctx) => {
      clearLockedTypography(ctx.line);
      stabilizeWordmarkTypography(ctx.line);
      lockLineBox(ctx.line);
    });
    updateAllWordmarkArenas();
    captureOriginalLayout();
    initPairRegistry();
    pairs.forEach((pair) => applyCharLayout(slotLayoutItem(pair), pair));
    bindLetterInteractions();
    if (engine) refreshEnvironmentColliders();
  };

  markSublineWordsVisible();

  const init = async () => {
    bindPhysicsToggle();
    bindDesktopBrandMarkHover();
    bindDesktopBrandMarkLaunchLayer();
    bindMobileBrandMarkLaunchLayer();
    bindBrandMarkScroll();
    await waitForFonts();
    setupMobilePhysics();
    resetSystemRowStyles();
    root.classList.add("is-intro", "is-booting");
    gsap.set(line, { opacity: 0, y: 14 });

    await delay(HOLD_MS);

    split = new window.SplitType(line, { types: "chars" });
    subSplits = wordmarkContexts
      .filter((ctx) => !ctx.withIntro)
      .map((ctx) => new window.SplitType(ctx.line, { types: "chars" }));
    await settleFrames(2);
    prepareSplitLayout();
    bindInteractions();
    await settleFrames(2);
    await revealWordmark();
    await delay(INTRO_FIRST_PAUSE_MS);
    playLoadIntro();
  };

  init();

  resizeHandlerBound = true;
  window.addEventListener("resize", onPhysicsResize);
})();
