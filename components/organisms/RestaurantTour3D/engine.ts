import * as THREE from "three";
import {
  DEFAULT_TOUR_CONFIG,
  type Ambience,
  type TourConfig,
} from "../../../lib/restaurants/tour-stops";
import { disposeObject, mkBox, mkCyl, mkSph } from "./helpers";

export type EngineOptions = {
  canvas: HTMLCanvasElement;
  tour: TourConfig;
  /** Textures optionnelles a appliquer sur les 4 murs (si photos 360 / scan). */
  wallTextures?: string[];
  initialAmbience?: Ambience;
};

export type EngineHandle = {
  setAmbience: (ambience: Ambience) => void;
  startGuidedTour: () => void;
  stopGuidedTour: () => void;
  goToStop: (index: number) => void;
  getCurrentStopIndex: () => number;
  onStopChange: (cb: (index: number) => void) => () => void;
  dispose: () => void;
};

type AmbiencePreset = {
  ambient: { color: number; intensity: number };
  point: { color: number; intensity: number };
  spot: { color: number; intensity: number };
  bg: number;
  fog: number;
};

const AMBIENCE: Record<Ambience, AmbiencePreset> = {
  dawn: {
    ambient: { color: 0xffd7a8, intensity: 0.6 },
    point: { color: 0xffb97a, intensity: 8 },
    spot: { color: 0xffe2b8, intensity: 30 },
    bg: 0x2a2118,
    fog: 0x2a2118,
  },
  midi: {
    ambient: { color: 0xffffff, intensity: 0.9 },
    point: { color: 0xfff1c9, intensity: 5 },
    spot: { color: 0xffffff, intensity: 20 },
    bg: 0x1a1a1a,
    fog: 0x1a1a1a,
  },
  soir: {
    ambient: { color: 0x7a6a52, intensity: 0.35 },
    point: { color: 0xffb063, intensity: 18 },
    spot: { color: 0xffc98a, intensity: 40 },
    bg: 0x0b0906,
    fog: 0x0b0906,
  },
};

const isMobile = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(pointer: coarse)").matches;

const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const createTourEngine = (opts: EngineOptions): EngineHandle => {
  const { canvas } = opts;
  const tour = opts.tour ?? DEFAULT_TOUR_CONFIG;
  const mobile = isMobile();

  // ---------------- Renderer ----------------
  // En dev avec React StrictMode, l'effet se monte-demonte-remonte : le meme
  // <canvas> peut deja avoir un contexte WebGL alloue. On le recupere et on le
  // passe a Three pour eviter le "Cannot read properties of null (precision)".
  const existingContext =
    (canvas.getContext("webgl2", {
      antialias: !mobile,
      alpha: false,
      depth: true,
      stencil: false,
      powerPreference: "high-performance",
    }) as WebGL2RenderingContext | null) ?? null;

  if (!existingContext) {
    throw new Error(
      "WebGL2 indisponible : impossible de creer le contexte pour la visite 3D.",
    );
  }

  const renderer = new THREE.WebGLRenderer({
    canvas,
    context: existingContext,
    antialias: !mobile,
    alpha: false,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(
    Math.max(canvas.clientWidth, 1),
    Math.max(canvas.clientHeight, 1),
    false,
  );
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.9;
  // Three r152+ : outputColorSpace remplace outputEncoding (user-approved modern API).
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // ---------------- Scene + camera ----------------
  const scene = new THREE.Scene();
  const initialAmbience = opts.initialAmbience ?? tour.ambient;
  const preset0 = AMBIENCE[initialAmbience];
  scene.background = new THREE.Color(preset0.bg);
  scene.fog = new THREE.Fog(preset0.fog, 10, 30);

  const camera = new THREE.PerspectiveCamera(
    55,
    Math.max(canvas.clientWidth / Math.max(canvas.clientHeight, 1), 0.0001),
    0.1,
    200,
  );
  const firstStop = tour.stops[0] ?? DEFAULT_TOUR_CONFIG.stops[0]!;
  camera.position.set(
    firstStop.camera.pos[0],
    firstStop.camera.pos[1],
    firstStop.camera.pos[2],
  );
  const lookAt = new THREE.Vector3(
    firstStop.camera.look[0],
    firstStop.camera.look[1],
    firstStop.camera.look[2],
  );
  camera.lookAt(lookAt);

  // ---------------- Materiaux ----------------
  const floorMat = new THREE.MeshStandardMaterial({
    color: 0x2b1f15,
    roughness: 0.85,
    metalness: 0.05,
  });
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x3a2e24,
    roughness: 0.9,
    metalness: 0,
  });
  const tableMat = new THREE.MeshStandardMaterial({
    color: 0xe8dcc3,
    roughness: 0.6,
  });
  const chairMat = new THREE.MeshStandardMaterial({
    color: 0x6b4a2b,
    roughness: 0.7,
  });
  const metalMat = new THREE.MeshStandardMaterial({
    color: 0xcfa867,
    roughness: 0.35,
    metalness: 0.9,
  });
  const paintingMat = new THREE.MeshStandardMaterial({
    color: 0xa61d2a,
    roughness: 0.8,
  });

  // Apply optional wall textures (photos 360 simplifiees) s'il y en a.
  if (opts.wallTextures && opts.wallTextures.length > 0) {
    const loader = new THREE.TextureLoader();
    const tex = loader.load(opts.wallTextures[0]!);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    wallMat.map = tex;
    wallMat.needsUpdate = true;
  }

  // ---------------- Sol, plafond, murs ----------------
  const ROOM = { w: 16, h: 5, d: 20 };
  const floor = mkBox(
    [ROOM.w, 0.1, ROOM.d],
    [0, -0.05, 0],
    floorMat,
    { receiveShadow: true },
  );
  scene.add(floor);

  const ceiling = mkBox(
    [ROOM.w, 0.1, ROOM.d],
    [0, ROOM.h, 0],
    wallMat,
  );
  scene.add(ceiling);

  const wallBack = mkBox(
    [ROOM.w, ROOM.h, 0.2],
    [0, ROOM.h / 2, -ROOM.d / 2],
    wallMat,
    { receiveShadow: true },
  );
  const wallFront = mkBox(
    [ROOM.w, ROOM.h, 0.2],
    [0, ROOM.h / 2, ROOM.d / 2],
    wallMat,
    { receiveShadow: true },
  );
  const wallLeft = mkBox(
    [0.2, ROOM.h, ROOM.d],
    [-ROOM.w / 2, ROOM.h / 2, 0],
    wallMat,
    { receiveShadow: true },
  );
  const wallRight = mkBox(
    [0.2, ROOM.h, ROOM.d],
    [ROOM.w / 2, ROOM.h / 2, 0],
    wallMat,
    { receiveShadow: true },
  );
  scene.add(wallBack, wallFront, wallLeft, wallRight);

  // ---------------- Tables + chaises ----------------
  const tableGroup = new THREE.Group();
  const tablePositions: Array<[number, number]> = [
    [-3, -3],
    [3, -3],
    [-3, 3],
    [3, 3],
    [0, 0],
  ];
  for (const [x, z] of tablePositions) {
    const top = mkBox([1.8, 0.1, 1.1], [x, 0.85, z], tableMat, {
      castShadow: true,
      receiveShadow: true,
    });
    const leg = mkCyl(0.06, 0.06, 0.85, 12, [x, 0.425, z], metalMat, {
      castShadow: true,
    });
    tableGroup.add(top, leg);
    for (let i = 0; i < 4; i++) {
      const cx = x + (i % 2 === 0 ? -0.85 : 0.85);
      const cz = z + (i < 2 ? -0.5 : 0.5);
      const seat = mkBox([0.45, 0.08, 0.45], [cx, 0.48, cz], chairMat, {
        castShadow: true,
      });
      const back = mkBox([0.45, 0.6, 0.08], [cx, 0.82, cz + 0.19], chairMat, {
        castShadow: true,
      });
      tableGroup.add(seat, back);
    }
  }
  scene.add(tableGroup);

  // ---------------- Tableaux (murs) ----------------
  const paintings: THREE.Mesh[] = [];
  const paintingPositions: Array<{ pos: [number, number, number]; rotY: number }> = [
    { pos: [-ROOM.w / 2 + 0.12, 2.3, -4], rotY: Math.PI / 2 },
    { pos: [-ROOM.w / 2 + 0.12, 2.3, 4], rotY: Math.PI / 2 },
    { pos: [ROOM.w / 2 - 0.12, 2.3, -4], rotY: -Math.PI / 2 },
    { pos: [ROOM.w / 2 - 0.12, 2.3, 4], rotY: -Math.PI / 2 },
  ];
  for (const p of paintingPositions) {
    const frame = mkBox([1.4, 1.8, 0.08], p.pos, paintingMat, {
      castShadow: true,
    });
    frame.rotation.y = p.rotY;
    paintings.push(frame);
    scene.add(frame);
  }

  // ---------------- Chandeliers (avec PointLight) ----------------
  const chandelierPositions: Array<[number, number, number]> = mobile
    ? [[0, 3.5, 0]]
    : [
        [-4, 3.5, -4],
        [4, 3.5, -4],
        [-4, 3.5, 4],
        [4, 3.5, 4],
      ];

  const pointLights: THREE.PointLight[] = [];
  for (const pos of chandelierPositions) {
    const core = mkSph(
      0.25,
      12,
      12,
      pos,
      new THREE.MeshStandardMaterial({
        color: 0xffd88a,
        emissive: 0xffd88a,
        emissiveIntensity: 1.5,
        roughness: 0.4,
      }),
    );
    scene.add(core);
    const arm = mkCyl(
      0.02,
      0.02,
      1.4,
      6,
      [pos[0], pos[1] + 0.7, pos[2]],
      metalMat,
    );
    scene.add(arm);

    const pt = new THREE.PointLight(
      preset0.point.color,
      preset0.point.intensity,
      14,
      1.8,
    );
    pt.position.set(pos[0], pos[1], pos[2]);
    pt.castShadow = !mobile;
    if (pt.castShadow) {
      pt.shadow.mapSize.set(512, 512);
      pt.shadow.radius = 4;
    }
    scene.add(pt);
    pointLights.push(pt);
  }

  // ---------------- SpotLights sur les tableaux ----------------
  const spotLights: THREE.SpotLight[] = [];
  if (!mobile) {
    for (const p of paintingPositions) {
      const spot = new THREE.SpotLight(
        preset0.spot.color,
        preset0.spot.intensity,
        6,
        Math.PI / 8,
        0.4,
        1.2,
      );
      spot.position.set(
        p.pos[0] - Math.sin(p.rotY) * 1.2,
        p.pos[1] + 0.8,
        p.pos[2] - Math.cos(p.rotY) * 0.001,
      );
      const target = new THREE.Object3D();
      target.position.set(p.pos[0], p.pos[1], p.pos[2]);
      scene.add(target);
      spot.target = target;
      scene.add(spot);
      spotLights.push(spot);
    }
  }

  // ---------------- Ambient light ----------------
  const ambientLight = new THREE.AmbientLight(
    preset0.ambient.color,
    preset0.ambient.intensity,
  );
  scene.add(ambientLight);

  // ---------------- Particules ----------------
  const particleCount = mobile ? 120 : 260;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = new Float32Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    particlePositions[i * 3 + 0] = (Math.random() - 0.5) * ROOM.w * 0.9;
    particlePositions[i * 3 + 1] = Math.random() * (ROOM.h - 0.3);
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * ROOM.d * 0.9;
    particleVelocities[i] = 0.1 + Math.random() * 0.25;
  }
  particleGeo.setAttribute(
    "position",
    new THREE.BufferAttribute(particlePositions, 3),
  );
  const particleMat = new THREE.PointsMaterial({
    color: 0xffd27a,
    size: 0.04,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.7,
    depthWrite: false,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // ---------------- Interaction : drag / touch ----------------
  const spherical = new THREE.Spherical();
  const offset = new THREE.Vector3();
  offset.copy(camera.position).sub(lookAt);
  spherical.setFromVector3(offset);

  let userInteracting = false;
  let pointerActive = false;
  let lastX = 0;
  let lastY = 0;

  const onPointerDown = (ev: PointerEvent) => {
    pointerActive = true;
    userInteracting = true;
    lastX = ev.clientX;
    lastY = ev.clientY;
    stopGuidedTour();
    canvas.setPointerCapture(ev.pointerId);
  };
  const onPointerMove = (ev: PointerEvent) => {
    if (!pointerActive) return;
    const dx = ev.clientX - lastX;
    const dy = ev.clientY - lastY;
    lastX = ev.clientX;
    lastY = ev.clientY;
    spherical.theta -= dx * 0.005;
    spherical.phi -= dy * 0.005;
    spherical.phi = Math.max(0.2, Math.min(Math.PI - 0.2, spherical.phi));
  };
  const onPointerUp = (ev: PointerEvent) => {
    pointerActive = false;
    try {
      canvas.releasePointerCapture(ev.pointerId);
    } catch {
      // ignore
    }
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  // ---------------- Resize ----------------
  const onResize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  };
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);
  window.addEventListener("resize", onResize);

  // ---------------- Guided tour ----------------
  let stopIndex = 0;
  let guidedActive = false;
  let guidedStartTime = 0;
  const fromPos = new THREE.Vector3();
  const toPos = new THREE.Vector3();
  const fromLook = new THREE.Vector3();
  const toLook = new THREE.Vector3();
  const currentLook = new THREE.Vector3().copy(lookAt);
  const stopListeners = new Set<(index: number) => void>();

  const notifyStop = (i: number) => {
    stopListeners.forEach((cb) => cb(i));
  };

  const startGuidedTour = () => {
    if (tour.stops.length < 2) return;
    guidedActive = true;
    userInteracting = false;
    guidedStartTime = performance.now();
    fromPos.copy(camera.position);
    fromLook.copy(currentLook);
    const next = tour.stops[(stopIndex + 1) % tour.stops.length]!;
    toPos.set(next.camera.pos[0], next.camera.pos[1], next.camera.pos[2]);
    toLook.set(next.camera.look[0], next.camera.look[1], next.camera.look[2]);
  };

  const stopGuidedTour = () => {
    guidedActive = false;
  };

  const goToStop = (index: number) => {
    const next = tour.stops[index];
    if (!next) return;
    stopGuidedTour();
    userInteracting = false;
    guidedActive = true;
    guidedStartTime = performance.now();
    fromPos.copy(camera.position);
    fromLook.copy(currentLook);
    toPos.set(next.camera.pos[0], next.camera.pos[1], next.camera.pos[2]);
    toLook.set(next.camera.look[0], next.camera.look[1], next.camera.look[2]);
    stopIndex = (index - 1 + tour.stops.length) % tour.stops.length;
  };

  const advanceToNextStop = (now: number) => {
    stopIndex = (stopIndex + 1) % tour.stops.length;
    notifyStop(stopIndex);
    const current = tour.stops[stopIndex]!;
    const next = tour.stops[(stopIndex + 1) % tour.stops.length]!;
    fromPos.set(
      current.camera.pos[0],
      current.camera.pos[1],
      current.camera.pos[2],
    );
    fromLook.set(
      current.camera.look[0],
      current.camera.look[1],
      current.camera.look[2],
    );
    toPos.set(next.camera.pos[0], next.camera.pos[1], next.camera.pos[2]);
    toLook.set(next.camera.look[0], next.camera.look[1], next.camera.look[2]);
    guidedStartTime = now;
  };

  // ---------------- Ambience switching ----------------
  let currentAmbience: Ambience = initialAmbience;
  const setAmbience = (ambience: Ambience) => {
    if (ambience === currentAmbience) return;
    currentAmbience = ambience;
    const preset = AMBIENCE[ambience];
    ambientLight.color.setHex(preset.ambient.color);
    ambientLight.intensity = preset.ambient.intensity;
    for (const pt of pointLights) {
      pt.color.setHex(preset.point.color);
      pt.intensity = preset.point.intensity;
    }
    for (const sp of spotLights) {
      sp.color.setHex(preset.spot.color);
      sp.intensity = preset.spot.intensity;
    }
    (scene.background as THREE.Color).setHex(preset.bg);
    (scene.fog as THREE.Fog).color.setHex(preset.fog);
  };

  // ---------------- Animation loop ----------------
  const clock = new THREE.Clock();
  const animate = () => {
    const dt = clock.getDelta();
    const now = performance.now();

    // Particules
    const posAttr = particleGeo.getAttribute("position") as THREE.BufferAttribute;
    for (let i = 0; i < particleCount; i++) {
      let y = posAttr.array[i * 3 + 1] as number;
      y += particleVelocities[i]! * dt;
      if (y > ROOM.h - 0.3) y = 0.1;
      (posAttr.array as Float32Array)[i * 3 + 1] = y;
    }
    posAttr.needsUpdate = true;

    if (guidedActive) {
      const currentStop = tour.stops[stopIndex]!;
      const elapsed = now - guidedStartTime;
      const duration = currentStop.duration;
      const t = Math.min(elapsed / duration, 1);
      const k = easeInOutCubic(t);
      camera.position.lerpVectors(fromPos, toPos, k);
      currentLook.lerpVectors(fromLook, toLook, k);
      camera.lookAt(currentLook);
      if (t >= 1) advanceToNextStop(now);
    } else if (userInteracting) {
      offset.setFromSpherical(spherical);
      camera.position.copy(currentLook).add(offset);
      camera.lookAt(currentLook);
    }

    renderer.render(scene, camera);
  };
  renderer.setAnimationLoop(animate);

  const onStopChange = (cb: (index: number) => void): (() => void) => {
    stopListeners.add(cb);
    return () => {
      stopListeners.delete(cb);
    };
  };

  const getCurrentStopIndex = (): number => stopIndex;

  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    renderer.setAnimationLoop(null);
    resizeObserver.disconnect();
    window.removeEventListener("resize", onResize);
    canvas.removeEventListener("pointerdown", onPointerDown);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerup", onPointerUp);
    canvas.removeEventListener("pointercancel", onPointerUp);
    disposeObject(scene);
    particleGeo.dispose();
    particleMat.dispose();
    renderer.dispose();
    // On ne force PAS forceContextLoss() ici : en dev avec React StrictMode,
    // l'effet est monte-demonte-remonte sur le meme canvas. Invalider le
    // contexte casse le second mount avec "Cannot read properties of null".
    // Le GC navigateur libere le contexte a la destruction du canvas DOM.
  };

  return {
    setAmbience,
    startGuidedTour,
    stopGuidedTour,
    goToStop,
    getCurrentStopIndex,
    onStopChange,
    dispose,
  };
};

export const isWebGLAvailable = (): boolean => {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
};
