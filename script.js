"use strict";

const movies = [
  {
    id: 1,
    title: "Big Buck Bunny",
    room: 1,
    description:
      "Big Buck Bunny est un court-metrage d'animation humoristique. Il raconte l'histoire d'un grand lapin calme et gentil qui decide de se defendre face a trois petits animaux qui troublent sa tranquillite.",
    posterPath: "assets/images/film1-poster.png",
    trailerPath: "assets/videos/film1-trailer.mp4",
    moviePath: "assets/videos/film1.mp4"
  },
  {
    id: 2,
    title: "Sintel",
    room: 2,
    description:
      "Sintel est un court-metrage d'aventure et de fantasy. Il suit une jeune heroine dans une quete mysterieuse liee a une creature appelee Scales.",
    posterPath: "assets/images/film2-poster.png",
    trailerPath: "assets/videos/film2-trailer.mp4",
    moviePath: "assets/videos/film2.mp4"
  }
];

let selectedMovie = null;
let selectedRoom = null;
let hasTicket = false;
let currentScene = "street";
let movieStarted = false;
let currentMovieVideo = null;

const movementSettings = {
  speed: 2.5,
  keyboardEnabled: true,
  vrJoystickEnabled: true,
  invertForwardBackward: false,
  invertLeftRight: false
};

const joystickSettings = {
  deadzone: 0.15,
  speed: 2.0,
  invertY: false,
  invertX: false
};

const receptionistSpeech =
  "Bonjour et bienvenue au CineVR. Aujourd'hui, deux films sont disponibles. Vous pouvez choisir librement le film que vous voulez voir. Cliquez sur une affiche pour voir sa description et sa bande-annonce. Apres votre choix, je vous donnerai votre ticket.";

// Level design centralise : les scenes sont d'abord construites par zones, puis decorees.
const sceneLayouts = {
  street: {
    cameraStart: { position: "0 1.6 8.2", rotation: "0 0 0" },
    entranceDoor: { position: "0 1.35 -5.78", rotation: "0 0 0" },
    instructionPanel: { position: "0 2.45 -3.85", rotation: "0 0 0" },
    leftPosterPosition: { position: "-3.95 1.75 -5.42", rotation: "0 0 0" },
    rightPosterPosition: { position: "3.95 1.75 -5.42", rotation: "0 0 0" },
    leftGuard: { position: "-1.85 0 -3.85", rotation: "0 12 0" },
    rightGuard: { position: "1.85 0 -3.85", rotation: "0 -12 0" },
    soundButton: { position: "-5.55 1.15 -2.65", rotation: "0 28 0" },
    teleportPoints: [
      "streetFacade",
      "streetGuardLeft",
      "streetGuardRight",
      "streetEntrance"
    ]
  },
  lobby: {
    cameraStart: { position: "0 1.6 6.8", rotation: "0 0 0" },
    dialoguePanelPosition: { position: "-2.85 2.25 -5.35", rotation: "0 12 0" },
    previewScreenPosition: { position: "0 2.58 -6.52", rotation: "0 0 0" },
    previewInfoPosition: { position: "0 2.22 1.45", rotation: "0 0 0" },
    previewButtonPosition: { position: "0 1.02 1.35", rotation: "0 0 0" },
    ticketPanelPosition: { position: "2.85 1.55 1.45", rotation: "0 -12 0" },
    continueButtonPosition: { position: "2.85 0.78 1.45", rotation: "0 -12 0" },
    leftPosterPosition: { position: "-4.65 1.75 -2.45", rotation: "0 24 0" },
    rightPosterPosition: { position: "4.65 1.75 -2.45", rotation: "0 -24 0" },
    receptionDesk: { position: "0 0.58 -5.35", rotation: "0 0 0" },
    receptionist: { position: "0 0.72 -4.88", rotation: "0 0 0" },
    teleportPoints: [
      "lobbyCenter",
      "lobbyPosterLeft",
      "lobbyPosterRight",
      "lobbyPreview",
      "lobbyDesk",
      "lobbyExit"
    ]
  },
  hallway: {
    cameraStart: { position: "0 1.6 5.8", rotation: "0 0 0" },
    ticketReminder: { position: "0 2.25 1.4", rotation: "0 0 0" },
    room1Door: { position: "-4.85 1.35 -1.85", rotation: "0 90 0" },
    room2Door: { position: "4.85 1.35 -1.85", rotation: "0 -90 0" },
    teleportPoints: [
      "hallwayStart",
      "hallwayTicket",
      "hallwayRoom1",
      "hallwayRoom2"
    ]
  },
  cinemaRoom: {
    cameraStart: { position: "0 1.6 6.2", rotation: "0 0 0" },
    screen: { position: "0 2.65 -7.2", rotation: "0 0 0" },
    seatTarget: { position: "0 1.2 0.35", rotation: "0 0 0" },
    rows: 4,
    seatsPerSide: 3
  }
};

const teleportTargets = {
  streetFacade: {
    label: "Vue facade",
    position: { x: 0, y: 0, z: 5.4 },
    lookAt: { x: 0, y: 1.8, z: -5.6 }
  },
  streetEntrance: {
    label: "Entree cinema",
    position: { x: 0, y: 0, z: -2.4 },
    lookAt: { x: 0, y: 1.6, z: -5.8 }
  },
  streetGuardLeft: {
    label: "Gardien gauche",
    position: { x: -1.85, y: 0, z: -2.6 },
    lookAt: { x: -1.85, y: 1.45, z: -3.85 }
  },
  streetGuardRight: {
    label: "Gardien droit",
    position: { x: 1.85, y: 0, z: -2.6 },
    lookAt: { x: 1.85, y: 1.45, z: -3.85 }
  },
  lobbyCenter: {
    label: "Accueil",
    position: { x: 0, y: 0, z: 3.5 },
    lookAt: { x: 0, y: 1.7, z: -5.0 }
  },
  lobbyDesk: {
    label: "Comptoir",
    position: { x: 0, y: 0, z: -3.45 },
    lookAt: { x: 0, y: 1.65, z: -4.9 }
  },
  lobbyPosterLeft: {
    label: "Poster Big Buck Bunny",
    position: { x: -3.25, y: 0, z: -0.95 },
    lookAt: { x: -4.65, y: 1.75, z: -2.45 }
  },
  lobbyPosterRight: {
    label: "Poster Sintel",
    position: { x: 3.25, y: 0, z: -0.95 },
    lookAt: { x: 4.65, y: 1.75, z: -2.45 }
  },
  lobbyPreview: {
    label: "Ecran",
    position: { x: 0, y: 0, z: -2.25 },
    lookAt: { x: 0, y: 2.2, z: -6.45 }
  },
  lobbyExit: {
    label: "Vers salles",
    position: { x: 2.85, y: 0, z: 2.25 },
    lookAt: { x: 2.85, y: 1.35, z: 1.45 }
  },
  hallwayStart: {
    label: "Debut couloir",
    position: { x: 0, y: 0, z: 3.4 },
    lookAt: { x: 0, y: 1.6, z: -3.0 }
  },
  hallwayTicket: {
    label: "Ticket",
    position: { x: 0, y: 0, z: 0.5 },
    lookAt: { x: 0, y: 2.2, z: 1.4 }
  },
  hallwayRoom1: {
    label: "Salle 1",
    position: { x: -2.8, y: 0, z: -1.85 },
    lookAt: { x: -4.85, y: 1.35, z: -1.85 }
  },
  hallwayRoom2: {
    label: "Salle 2",
    position: { x: 2.8, y: 0, z: -1.85 },
    lookAt: { x: 4.85, y: 1.35, z: -1.85 }
  },
  cinemaEntrance: {
    label: "Entree salle",
    position: { x: 0, y: 0, z: 4.85 },
    lookAt: { x: 0, y: 2.2, z: -7.2 }
  },
  cinemaSeat: {
    label: "Siege",
    position: { x: 0, y: 0, z: 0.35 },
    lookAt: { x: 0, y: 2.2, z: -7.2 },
    cameraHeight: 1.2,
    seated: true
  }
};

const palette = {
  black: "#05070c",
  night: "#080d16",
  wall: "#111827",
  panel: "#0b1320",
  metal: "#778394",
  metalDark: "#202a37",
  white: "#f7fbff",
  yellow: "#f7d85c",
  amber: "#ffbd57",
  cyan: "#57d7ff",
  blue: "#1c72ff",
  violet: "#8c5cff",
  magenta: "#ff5cc8",
  red: "#8f1f2d",
  redDark: "#3a0710",
  carpet: "#260710",
  concrete: "#3f454d",
  asphalt: "#111214",
  glass: "#83eaff",
  green: "#69f0ae"
};

const app = {
  scene: null,
  world: null,
  assets: null,
  cameraRig: null,
  camera: null,
  messageEntity: null,
  dialogueEntity: null,
  dialogueEntities: [],
  billboardPanels: [],
  guardEntities: [],
  guardGreetingPlayed: false,
  activeTimers: [],
  activeIntervals: [],
  activeVideos: [],
  activeAssetElements: [],
  activeAnimations: [],
  previewSurface: null,
  previewLayer: null,
  previewInfoPanel: null,
  cinemaSurface: null,
  cinemaLayer: null,
  ticketGroup: null,
  cinemaControls: null,
  restartControl: null,
  projectorBeam: null,
  cinemaLightEntities: [],
  receptionistHead: null,
  receptionistArms: [],
  audioContext: null,
  masterGain: null,
  ambientNodes: [],
  audioReady: false,
  audioMuted: false,
  keys: new Set(),
  lastMoveTs: 0,
  hasUserInteraction: false,
  seated: false,
  seatInProgress: false,
  launchButton: null,
  sitButton: null,
  projectorSoundInterval: null
};

document.addEventListener("DOMContentLoaded", () => {
  app.scene = document.querySelector("#scene");
  app.world = document.querySelector("#world");
  app.assets = document.querySelector("#asset-library");
  app.cameraRig = document.querySelector("#camera-rig");
  app.camera = document.querySelector("#camera");

  app.scene.addEventListener("loaded", () => {
    document.body.classList.add("is-ready");
  });

  setupMovementControls();
  showStreetScene();
});

function setAttrs(entity, attrs) {
  Object.entries(attrs).forEach(([name, value]) => {
    if (value !== undefined && value !== null) {
      entity.setAttribute(name, value);
    }
  });
  return entity;
}

function createEl(tagName, attrs = {}, parent = app.world) {
  const entity = document.createElement(tagName);
  setAttrs(entity, attrs);
  if (parent) {
    parent.appendChild(entity);
  }
  return entity;
}

function createGroup(attrs = {}, parent = app.world) {
  return createEl("a-entity", attrs, parent);
}

function placeCamera(layout) {
  app.cameraRig.setAttribute("position", layout.cameraStart.position);
  app.cameraRig.setAttribute("rotation", layout.cameraStart.rotation);
  app.camera.setAttribute("position", "0 0 0");
  app.camera.setAttribute("rotation", "0 0 0");
}

function parsePosition(value) {
  if (typeof value === "string") {
    const [x, y, z] = value.split(/\s+/).map(Number);
    return { x, y, z };
  }
  return value;
}

function trackTimeout(callback, delay) {
  const id = window.setTimeout(() => {
    app.activeTimers = app.activeTimers.filter((timerId) => timerId !== id);
    callback();
  }, delay);
  app.activeTimers.push(id);
  return id;
}

function trackInterval(callback, delay) {
  const id = window.setInterval(callback, delay);
  app.activeIntervals.push(id);
  return id;
}

function setupMovementControls() {
  document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if (["w", "z", "s", "a", "q", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) {
      event.preventDefault();
      markInteraction();
      app.keys.add(key);
    }
  });
  document.addEventListener("keyup", (event) => {
    app.keys.delete(event.key.toLowerCase());
  });
  requestAnimationFrame(updateMovementLoop);
}

function updateMovementLoop(timestamp) {
  if (!app.lastMoveTs) {
    app.lastMoveTs = timestamp;
  }
  const delta = Math.min(0.05, (timestamp - app.lastMoveTs) / 1000);
  app.lastMoveTs = timestamp;

  updateKeyboardMovement(delta);
  updateVRJoystickMovement(delta);
  checkStreetGreetingProximity();
  updateBillboardPanels();

  requestAnimationFrame(updateMovementLoop);
}

function updateKeyboardMovement(deltaTime) {
  if (!movementSettings.keyboardEnabled || app.seatInProgress || movieStarted) {
    return;
  }
  const forwardPressed = app.keys.has("w") || app.keys.has("z") || app.keys.has("arrowup");
  const backPressed = app.keys.has("s") || app.keys.has("arrowdown");
  const leftPressed = app.keys.has("a") || app.keys.has("q") || app.keys.has("arrowleft");
  const rightPressed = app.keys.has("d") || app.keys.has("arrowright");

  if (!forwardPressed && !backPressed && !leftPressed && !rightPressed) {
    return;
  }

  let forwardAmount = Number(forwardPressed) - Number(backPressed);
  let rightAmount = Number(rightPressed) - Number(leftPressed);
  if (movementSettings.invertForwardBackward) forwardAmount *= -1;
  if (movementSettings.invertLeftRight) rightAmount *= -1;
  moveCameraRig(forwardAmount, rightAmount, deltaTime, movementSettings.speed);
}

function updateVRJoystickMovement(deltaTime) {
  if (!movementSettings.vrJoystickEnabled || app.seatInProgress || movieStarted || !navigator.getGamepads) {
    return;
  }
  const gamepads = Array.from(navigator.getGamepads()).filter(Boolean);
  for (const gamepad of gamepads) {
    if (!gamepad.axes || gamepad.axes.length < 2) continue;
    const axisX = Math.abs(gamepad.axes[2] || 0) > joystickSettings.deadzone || Math.abs(gamepad.axes[3] || 0) > joystickSettings.deadzone
      ? gamepad.axes[2]
      : gamepad.axes[0];
    const axisY = Math.abs(gamepad.axes[2] || 0) > joystickSettings.deadzone || Math.abs(gamepad.axes[3] || 0) > joystickSettings.deadzone
      ? gamepad.axes[3]
      : gamepad.axes[1];
    const x = Math.abs(axisX || 0) > joystickSettings.deadzone ? axisX : 0;
    const y = Math.abs(axisY || 0) > joystickSettings.deadzone ? axisY : 0;
    if (!x && !y) continue;
    let forwardAmount = -y;
    let rightAmount = x;
    if (joystickSettings.invertY) forwardAmount *= -1;
    if (joystickSettings.invertX) rightAmount *= -1;
    moveCameraRig(forwardAmount, rightAmount, deltaTime, joystickSettings.speed);
    break;
  }
}

function moveCameraRig(forwardAmount, rightAmount, deltaTime, speed) {
  if (!app.cameraRig || !app.camera) {
    return;
  }
  const THREE = AFRAME.THREE;
  const forward = new THREE.Vector3();
  app.camera.object3D.getWorldDirection(forward);
  // In this A-Frame setup getWorldDirection points along the camera object's +Z axis,
  // which is the opposite of the visual viewing direction. Negate once, then derive
  // right/left from that corrected forward vector.
  forward.negate();
  forward.y = 0;
  if (forward.lengthSq() < 0.0001) {
    return;
  }
  forward.normalize();
  const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();
  const move = new THREE.Vector3()
    .addScaledVector(forward, forwardAmount)
    .addScaledVector(right, rightAmount);
  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(speed * deltaTime);
    app.cameraRig.object3D.position.add(move);
    app.cameraRig.object3D.position.y = app.seated ? 1.2 : 1.6;
  }
}

function markInteraction() {
  app.hasUserInteraction = true;
}

function stopActiveVideos() {
  app.activeVideos.forEach((video) => {
    if (video === currentMovieVideo) {
      return;
    }
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.remove();
  });
  app.activeVideos = app.activeVideos.filter((video) => video === currentMovieVideo);
}

function stopMovieVideo() {
  if (!currentMovieVideo) {
    return;
  }
  try {
    currentMovieVideo.pause();
    currentMovieVideo.currentTime = 0;
    currentMovieVideo.removeAttribute("src");
    currentMovieVideo.load();
  } catch (error) {
    // The browser may reject resetting a detached video; cleanup still continues.
  }
  currentMovieVideo.remove();
  app.activeVideos = app.activeVideos.filter((video) => video !== currentMovieVideo);
  currentMovieVideo = null;
}

function stopSpeech() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

function stopAllSounds() {
  app.ambientNodes.forEach((nodeSet) => {
    try {
      nodeSet.oscillator.stop();
    } catch (error) {
      // Oscillator may already be stopped.
    }
    try {
      nodeSet.gain.disconnect();
    } catch (error) {
      // Gain may already be disconnected.
    }
  });
  app.ambientNodes = [];
}

function stopMovieAnimation() {
  app.activeIntervals.forEach((id) => window.clearInterval(id));
  app.activeTimers.forEach((id) => window.clearTimeout(id));
  app.activeIntervals = [];
  app.activeTimers = [];

  stopMovieVideo();
  stopActiveVideos();
  stopSpeech();
  stopAllSounds();

  app.activeAssetElements.forEach((asset) => asset.remove());
  app.activeAssetElements = [];
  app.activeAnimations = [];
}

function clearScene() {
  stopMovieAnimation();
  app.messageEntity = null;
  app.dialogueEntity = null;
  app.dialogueEntities = [];
  app.billboardPanels = [];
  app.guardEntities = [];
  app.previewSurface = null;
  app.previewLayer = null;
  app.previewInfoPanel = null;
  app.cinemaSurface = null;
  app.cinemaLayer = null;
  app.ticketGroup = null;
  app.cinemaControls = null;
  app.restartControl = null;
  app.projectorBeam = null;
  app.cinemaLightEntities = [];
  app.receptionistHead = null;
  app.receptionistArms = [];
  app.seated = false;
  app.seatInProgress = false;
  app.launchButton = null;
  app.sitButton = null;
  app.projectorSoundInterval = null;

  while (app.world.firstChild) {
    app.world.removeChild(app.world.firstChild);
  }
}

function createText(value, attrs = {}, parent = app.world) {
  const text = createEl("a-text", attrs, parent);
  text.setAttribute("value", value);
  text.setAttribute("align", attrs.align || "center");
  text.setAttribute("baseline", attrs.baseline || "center");
  text.setAttribute("color", attrs.color || palette.white);
  text.setAttribute("width", attrs.width || 4);
  text.setAttribute("wrap-count", attrs["wrap-count"] || 34);
  text.setAttribute("font", attrs.font || "kelsonsans");
  return text;
}

function createReadableTextPanel(text, position, rotation = "0 0 0", options = {}) {
  const width = options.width || 4.4;
  const height = options.height || Math.max(0.72, Math.min(2.1, 0.48 + text.length / 120));
  const panel = createGroup({ position, rotation, class: options.className || "" });
  createEl(
    "a-plane",
    {
      width,
      height,
      position: "0 0 0",
      material: `shader: flat; color: ${options.panelColor || "#07111f"}; opacity: ${options.opacity || 0.92}; transparent: true; side: double`
    },
    panel
  );
  createEl(
    "a-box",
    {
      width,
      height: 0.04,
      depth: 0.025,
      position: `0 ${height / 2 + 0.025} 0.025`,
      material: `color: ${options.accent || palette.cyan}; emissive: ${options.accent || palette.cyan}; emissiveIntensity: 0.75`
    },
    panel
  );
  createText(
    text,
    {
      position: "0 0 0.045",
      color: options.color || palette.white,
      width: width - 0.24,
      "wrap-count": options.wrapCount || 42
    },
    panel
  );
  return panel;
}

function createTextPanel(text, position, rotation = "0 0 0", width = 4, options = {}) {
  return createReadableTextPanel(text, position, rotation, { ...options, width });
}

function makeClickable(entity, callback, hoverTarget = entity) {
  entity.classList.add("clickable");
  entity.addEventListener("click", (event) => {
    markInteraction();
    event.stopPropagation();
    callback(event);
  });
  entity.addEventListener("mouseenter", () => {
    hoverTarget.setAttribute("scale", "1.035 1.035 1.035");
  });
  entity.addEventListener("mouseleave", () => {
    hoverTarget.setAttribute("scale", "1 1 1");
  });
  return entity;
}

function createButton(label, position, rotation = "0 0 0", callback, options = {}) {
  const button = createGroup({ position, rotation, class: options.className || "" });
  const width = options.width || Math.max(1.6, Math.min(3.4, label.length * 0.13 + 0.75));
  const height = options.height || 0.44;
  const textWidth = options.textWidth || Math.max(0.8, width - 0.18);
  const bg = createEl(
    "a-box",
    {
      width,
      height,
      depth: 0.09,
      position: "0 0 0",
      material: `color: ${options.color || "#1f5f86"}; emissive: ${options.emissive || palette.cyan}; emissiveIntensity: 0.34; roughness: 0.35`
    },
    button
  );
  createEl(
    "a-box",
    {
      width: width + 0.08,
      height: height + 0.08,
      depth: 0.026,
      position: "0 0 -0.04",
      material: `color: ${options.frame || palette.white}; opacity: 0.24; transparent: true`
    },
    button
  );
  createText(
    label,
    {
      position: "0 0 0.07",
      color: options.textColor || palette.white,
      width: textWidth,
      "wrap-count": options.wrapCount || 22
    },
    button
  );
  const hitZone = createEl(
    "a-plane",
    {
      width: width + 0.35,
      height: height + 0.24,
      position: "0 0 0.13",
      material: "shader: flat; color: #ffffff; opacity: 0.001; transparent: true; side: double"
    },
    button
  );
  makeClickable(bg, callback, button);
  makeClickable(hitZone, callback, button);
  return button;
}

function createGround(size, color, position = "0 0 0", repeat = "1 1") {
  return createEl("a-plane", {
    width: size.width,
    height: size.height,
    rotation: "-90 0 0",
    position,
    material: `color: ${color}; roughness: 0.92; metalness: 0.02; repeat: ${repeat}`
  });
}

function createWall(position, scale, color, emissive = "#000000") {
  return createEl("a-box", {
    position,
    scale,
    material: `color: ${color}; roughness: 0.65; metalness: 0.15; emissive: ${emissive}; emissiveIntensity: 0.06`
  });
}

async function fileExists(path) {
  try {
    const response = await fetch(path, { method: "HEAD", cache: "no-store" });
    return response.ok;
  } catch (error) {
    try {
      const response = await fetch(path, { method: "GET", cache: "no-store", headers: { Range: "bytes=0-0" } });
      return response.ok;
    } catch (fallbackError) {
      return false;
    }
  }
}

async function applyPosterImageIfAvailable(movie, posterSurface) {
  const exists = await fileExists(movie.posterPath);
  if (!exists || !posterSurface.isConnected) {
    return;
  }

  const image = document.createElement("img");
  image.id = `poster-${movie.id}-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  image.src = movie.posterPath;
  image.alt = movie.title;
  app.assets.appendChild(image);
  app.activeAssetElements.push(image);
  posterSurface.setAttribute("material", `shader: flat; src: #${image.id}; color: #ffffff; side: double`);
}

function getTeleportTarget(targetKey) {
  if (typeof targetKey === "string") {
    return teleportTargets[targetKey] ? { ...teleportTargets[targetKey], key: targetKey } : null;
  }
  if (targetKey && targetKey.position && targetKey.lookAt) {
    return targetKey;
  }
  return null;
}

function createTeleportPoint(targetKey) {
  const target = getTeleportTarget(targetKey);
  if (!target) {
    return null;
  }
  const point = createGroup({ position: `${target.position.x} 0.035 ${target.position.z}` });
  createEl(
    "a-cylinder",
    {
      radius: 0.16,
      height: 0.018,
      position: "0 0 0",
      material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.32; opacity: 0.24; transparent: true`
    },
    point
  );
  createEl(
    "a-ring",
    {
      "radius-inner": 0.075,
      "radius-outer": 0.12,
      rotation: "-90 0 0",
      position: "0 0.02 0",
      material: `color: ${palette.white}; emissive: ${palette.cyan}; emissiveIntensity: 0.35; opacity: 0.48; transparent: true`
    },
    point
  );
  createText(
    target.label,
    {
      position: "0 0.035 0.25",
      rotation: "-90 0 0",
      color: palette.white,
      width: 0.72,
      "wrap-count": 14
    },
    point
  );
  const hit = createEl(
    "a-cylinder",
    {
      radius: 0.25,
      height: 0.04,
      position: "0 0.02 0",
      material: "color: #ffffff; opacity: 0.001; transparent: true"
    },
    point
  );
  makeClickable(hit, () => teleportTo(target.key || targetKey), point);
  return point;
}

function addTeleportPoints(points) {
  points.forEach((targetKey) => createTeleportPoint(targetKey));
}

function lookAtTarget(targetPosition, fromPosition = null) {
  const from = fromPosition || app.cameraRig.object3D.position;
  const target = parsePosition(targetPosition);
  const dx = target.x - from.x;
  const dz = target.z - from.z;
  const yaw = AFRAME.THREE.MathUtils.radToDeg(Math.atan2(-dx, -dz));
  return `0 ${yaw.toFixed(2)} 0`;
}

function faceRigToward(targetLookAt, fromPosition = null) {
  if (!app.cameraRig || !targetLookAt) {
    return;
  }
  const rotation = lookAtTarget(targetLookAt, fromPosition);
  app.cameraRig.setAttribute("animation__teleportrot", {
    property: "rotation",
    dur: 420,
    easing: "easeInOutSine",
    to: rotation
  });
  app.camera.setAttribute("rotation", "0 0 0");
}

function teleportTo(targetKey) {
  const target = getTeleportTarget(targetKey);
  if (!target) {
    showMessage("Destination de teleportation introuvable.");
    return;
  }
  const cameraHeight = target.cameraHeight || (app.seated ? 1.2 : 1.6);
  const rigTarget = { x: target.position.x, y: cameraHeight, z: target.position.z };
  if (target.seated) {
    app.seated = true;
    if (app.sitButton) app.sitButton.setAttribute("visible", "false");
    if (app.launchButton && !movieStarted) app.launchButton.setAttribute("visible", "true");
  }
  playValidationSound();
  app.cameraRig.setAttribute("animation__teleport", {
    property: "position",
    dur: 450,
    easing: "easeInOutSine",
    to: `${rigTarget.x} ${rigTarget.y} ${rigTarget.z}`
  });
  faceRigToward(target.lookAt, rigTarget);
  showMessage(`Deplacement : ${target.label}`);
}

function getPlayerWorldPosition() {
  const position = new AFRAME.THREE.Vector3();
  if (app.camera) {
    app.camera.object3D.getWorldPosition(position);
  }
  return position;
}

function getSpeakerPosition(speaker) {
  if (!speaker) return { x: 0, y: 1.8, z: -2 };
  if (typeof speaker === "string" || typeof speaker.x === "number") {
    return parsePosition(speaker);
  }
  const worldPosition = new AFRAME.THREE.Vector3();
  speaker.object3D.getWorldPosition(worldPosition);
  return { x: worldPosition.x, y: worldPosition.y, z: worldPosition.z };
}

function faceEntityToPlayer(entity) {
  if (!entity || !entity.object3D || !app.camera) {
    return;
  }
  const playerPosition = getPlayerWorldPosition();
  entity.object3D.lookAt(playerPosition);
}

function updateBillboardPanels() {
  app.billboardPanels = app.billboardPanels.filter((entity) => entity && entity.isConnected);
  app.billboardPanels.forEach((entity) => faceEntityToPlayer(entity));
}

function registerBillboard(entity) {
  app.billboardPanels.push(entity);
  faceEntityToPlayer(entity);
  return entity;
}

function createDialogueBubble(text, speakerPosition, options = {}) {
  const base = getSpeakerPosition(speakerPosition);
  const position = {
    x: base.x + (options.offsetX ?? 0.75),
    y: base.y + (options.offsetY ?? 1.45),
    z: base.z + (options.offsetZ ?? 0.1)
  };
  const bubble = createReadableTextPanel(
    text,
    `${position.x} ${position.y} ${position.z}`,
    "0 0 0",
    {
      width: options.width || 3.4,
      height: options.height || Math.max(0.58, Math.min(1.35, 0.44 + text.length / 135)),
      color: options.color || palette.white,
      accent: options.accent || palette.yellow,
      panelColor: options.panelColor || "#07111f",
      opacity: options.opacity || 0.94,
      wrapCount: options.wrapCount || 38,
      className: options.className || "dialogue-bubble"
    }
  );
  registerBillboard(bubble);
  app.dialogueEntities.push(bubble);
  if (options.replace !== false && app.dialogueEntity && app.dialogueEntity.isConnected) {
    app.dialogueEntity.remove();
  }
  app.dialogueEntity = bubble;
  if (options.duration !== 0) {
    trackTimeout(() => {
      if (bubble.isConnected) bubble.remove();
      app.dialogueEntities = app.dialogueEntities.filter((entity) => entity !== bubble);
      if (app.dialogueEntity === bubble) app.dialogueEntity = null;
    }, options.duration || 6200);
  }
  return bubble;
}

function updateDialogueFacingPlayer(dialogueEntity) {
  faceEntityToPlayer(dialogueEntity);
}

function showDialogueNearSpeaker(speaker, text, options = {}) {
  return createDialogueBubble(text, speaker, options);
}

function showPlayerFacingPanel(text, distance = 2.6, height = 1.65) {
  const player = getPlayerWorldPosition();
  const forward = new AFRAME.THREE.Vector3();
  app.camera.object3D.getWorldDirection(forward);
  forward.y = 0;
  if (forward.lengthSq() < 0.0001) {
    forward.set(0, 0, -1);
  }
  forward.normalize();
  const position = {
    x: player.x + forward.x * distance,
    y: height,
    z: player.z + forward.z * distance
  };
  const panel = createReadableTextPanel(text, `${position.x} ${position.y} ${position.z}`, "0 0 0", {
    width: 3.8,
    height: 0.6,
    color: palette.yellow,
    accent: palette.yellow,
    panelColor: "#101820",
    wrapCount: 34,
    className: "message-panel"
  });
  registerBillboard(panel);
  return panel;
}

function showMessageNearPlayer(text) {
  if (app.messageEntity) {
    app.messageEntity.remove();
  }
  app.messageEntity = showPlayerFacingPanel(text, 2.8, 1.72);
  trackTimeout(() => {
    if (app.messageEntity) {
      app.messageEntity.remove();
      app.messageEntity = null;
    }
  }, 3200);
  return app.messageEntity;
}

function showMessageNearObject(text, objectPosition) {
  if (app.messageEntity) {
    app.messageEntity.remove();
  }
  app.messageEntity = createDialogueBubble(text, objectPosition, {
    offsetX: 0,
    offsetY: 1.25,
    width: 3.3,
    height: 0.62,
    accent: palette.yellow,
    color: palette.yellow,
    duration: 3200
  });
  return app.messageEntity;
}

function showMessage(text) {
  return showMessageNearPlayer(text);
}

function initAudio() {
  markInteraction();
  if (app.audioReady) {
    if (app.audioContext && app.audioContext.state === "suspended") {
      app.audioContext.resume();
    }
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    showMessage("Audio Web non disponible. Les sous-titres restent actifs.");
    return;
  }
  app.audioContext = new AudioContextClass();
  app.masterGain = app.audioContext.createGain();
  app.masterGain.gain.value = app.audioMuted ? 0 : 0.22;
  app.masterGain.connect(app.audioContext.destination);
  app.audioReady = true;
  playValidationSound();
  playAmbientSound(currentScene);
}

function unlockAudioAfterUserGesture() {
  initAudio();
  if (app.audioContext && app.audioContext.state === "suspended") {
    app.audioContext.resume();
  }
}

function playTone(frequency, duration = 0.12, type = "sine", gain = 0.09) {
  if (!app.audioReady || app.audioMuted || !app.audioContext) {
    return;
  }
  const oscillator = app.audioContext.createOscillator();
  const gainNode = app.audioContext.createGain();
  oscillator.type = type;
  oscillator.frequency.value = frequency;
  gainNode.gain.setValueAtTime(0.0001, app.audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(gain, app.audioContext.currentTime + 0.015);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, app.audioContext.currentTime + duration);
  oscillator.connect(gainNode);
  gainNode.connect(app.masterGain);
  oscillator.start();
  oscillator.stop(app.audioContext.currentTime + duration + 0.03);
}

function playClickSound() {
  playTone(660, 0.09, "triangle", 0.06);
}

function playValidationSound() {
  playTone(880, 0.11, "sine", 0.07);
  trackTimeout(() => playTone(1175, 0.12, "sine", 0.05), 80);
}

function playDoorSound() {
  playTone(180, 0.22, "sawtooth", 0.055);
  trackTimeout(() => playTone(290, 0.18, "triangle", 0.045), 120);
}

function playAmbientSound(sceneName) {
  if (!app.audioReady || app.audioMuted || !app.audioContext) {
    return;
  }
  stopAllSounds();
  const configs = {
    street: [
      { frequency: 75, type: "sine", gain: 0.012 },
      { frequency: 140, type: "triangle", gain: 0.007 }
    ],
    lobby: [
      { frequency: 110, type: "sine", gain: 0.012 },
      { frequency: 220, type: "triangle", gain: 0.006 }
    ],
    hallway: [
      { frequency: 95, type: "sine", gain: 0.01 },
      { frequency: 175, type: "triangle", gain: 0.006 }
    ],
    cinemaRoom: [
      { frequency: 60, type: "sine", gain: 0.012 },
      { frequency: 120, type: "triangle", gain: 0.005 }
    ]
  };
  (configs[sceneName] || configs.street).forEach((config) => {
    const oscillator = app.audioContext.createOscillator();
    const gainNode = app.audioContext.createGain();
    oscillator.type = config.type;
    oscillator.frequency.value = config.frequency;
    gainNode.gain.value = config.gain;
    oscillator.connect(gainNode);
    gainNode.connect(app.masterGain);
    oscillator.start();
    app.ambientNodes.push({ oscillator, gain: gainNode });
  });
}

function playCinemaAmbient() {
  playAmbientSound("cinemaRoom");
}

function playProjectorSound() {
  playTone(92, 0.18, "square", 0.045);
  app.projectorSoundInterval = trackInterval(() => playTone(86, 0.05, "square", 0.018), 950);
}

function playMovieStartSound() {
  playTone(330, 0.15, "triangle", 0.07);
  trackTimeout(() => playTone(520, 0.14, "triangle", 0.06), 120);
  trackTimeout(() => playTone(760, 0.18, "sine", 0.05), 260);
}

function toggleMute() {
  initAudio();
  app.audioMuted = !app.audioMuted;
  if (app.masterGain) {
    app.masterGain.gain.value = app.audioMuted ? 0 : 0.22;
  }
  if (currentMovieVideo) {
    currentMovieVideo.muted = app.audioMuted;
    currentMovieVideo.volume = app.audioMuted ? 0 : 0.85;
  }
  showMessage(app.audioMuted ? "Son coupe" : "Son active");
}

function createSoundButtons(position = "-4.8 1.0 -2.4", rotation = "0 20 0") {
  const getLabel = () => (app.audioMuted || !app.audioReady ? "Activer le son" : "Couper le son");
  let soundButton;
  const refreshLabel = () => {
    const labelText = soundButton?.querySelector("a-text");
    if (labelText) {
      labelText.setAttribute("value", getLabel());
    }
  };

  soundButton = createButton(getLabel(), position, rotation, () => {
    if (!app.audioReady) {
      initAudio();
      app.audioMuted = false;
      if (currentScene === "street") {
        triggerGuardGreeting(true);
      }
      showMessage("Son active");
      refreshLabel();
      return;
    }
    toggleMute();
    if (currentScene === "street" && !app.audioMuted) {
      triggerGuardGreeting(true);
    }
    refreshLabel();
  }, {
    width: 1.8,
    height: 0.34,
    color: "#263241",
    emissive: palette.cyan
  });
  return soundButton;
}

function speakReceptionist(text) {
  stopSpeech();
  createReceptionSubtitle(text);
  if (!("speechSynthesis" in window) || !app.hasUserInteraction) {
    animateReceptionistTalking(true);
    trackTimeout(() => animateReceptionistTalking(false), 2800);
    return;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.95;
  utterance.pitch = 1.02;
  utterance.volume = app.audioMuted ? 0 : 0.9;
  utterance.onstart = () => animateReceptionistTalking(true);
  utterance.onend = () => animateReceptionistTalking(false);
  utterance.onerror = () => animateReceptionistTalking(false);
  window.speechSynthesis.speak(utterance);
}

function createReceptionSubtitle(text) {
  if (app.dialogueEntity && app.dialogueEntity.isConnected) {
    app.dialogueEntity.remove();
  }
  const speaker = app.receptionistHead || sceneLayouts.lobby.receptionist.position;
  showDialogueNearSpeaker(speaker, text, {
    offsetX: -1.65,
    offsetY: 0.95,
    offsetZ: 0.18,
    width: 4.0,
    height: 1.35,
    color: palette.white,
    accent: palette.yellow,
    panelColor: "#0b1320",
    wrapCount: 44,
    duration: 11000,
    className: "dialogue-bubble receptionist-dialogue"
  });
}

function animateReceptionistTalking(active) {
  if (!app.receptionistHead) {
    return;
  }
  if (active) {
    app.receptionistHead.setAttribute("animation__talk", "property: rotation; dir: alternate; dur: 420; loop: true; to: 0 0 4");
    app.receptionistArms.forEach((arm, index) => {
      arm.setAttribute("animation__talkhand", `property: rotation; dir: alternate; dur: ${380 + index * 70}; loop: true; to: 48 0 ${index === 0 ? -9 : 9}`);
    });
  } else {
    app.receptionistHead.removeAttribute("animation__talk");
    app.receptionistHead.setAttribute("rotation", "0 0 0");
    app.receptionistArms.forEach((arm, index) => {
      arm.removeAttribute("animation__talkhand");
      arm.setAttribute("rotation", `58 0 ${index === 0 ? -5 : 5}`);
    });
  }
}

function animateReceptionistTalk(active) {
  animateReceptionistTalking(active);
}

function stopReceptionistSpeech() {
  stopSpeech();
  animateReceptionistTalking(false);
}

function createNeonSign(text = "CINEVR", position = "0 3.7 -4.72", rotation = "0 0 0", width = 4.8) {
  const sign = createGroup({ position, rotation });
  createEl(
    "a-box",
    {
      width,
      height: 0.82,
      depth: 0.1,
      material: `color: #0a1020; emissive: ${palette.blue}; emissiveIntensity: 0.2; metalness: 0.28`
    },
    sign
  );
  createEl(
    "a-box",
    {
      width: width + 0.2,
      height: 0.96,
      depth: 0.035,
      position: "0 0 -0.035",
      material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.82`
    },
    sign
  );
  createText(text, {
    position: "0 0.01 0.07",
    color: palette.yellow,
    width: width * 1.2,
    "wrap-count": 18
  }, sign);
  return sign;
}

function createDecorativeColumn(position, height = 3.4, color = palette.metalDark) {
  const column = createGroup({ position });
  createEl(
    "a-cylinder",
    {
      radius: 0.16,
      height,
      position: "0 0 0",
      segments: 10,
      material: `color: ${color}; metalness: 0.55; roughness: 0.28`
    },
    column
  );
  for (const y of [height / 2 - 0.08, -height / 2 + 0.08]) {
    createEl(
      "a-cylinder",
      {
        radius: 0.2,
        height: 0.06,
        position: `0 ${y} 0`,
        segments: 10,
        material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.65`
      },
      column
    );
  }
  return column;
}

function createFuturisticPanel(text, position, rotation = "0 0 0", color = palette.cyan) {
  const panel = createGroup({ position, rotation });
  createEl(
    "a-plane",
    {
      width: 1.75,
      height: 0.82,
      material: `shader: flat; color: #08131f; opacity: 0.9; transparent: true; side: double`
    },
    panel
  );
  createEl(
    "a-box",
    {
      width: 1.48,
      height: 0.035,
      depth: 0.025,
      position: "0 -0.34 0.045",
      material: `color: ${color}; emissive: ${color}; emissiveIntensity: 0.75`
    },
    panel
  );
  createText(text, {
    position: "0 0.03 0.045",
    color: palette.white,
    width: 1.5,
    "wrap-count": 18
  }, panel);
  return panel;
}

function createGuard(position, rotation = "0 0 0", side = "left") {
  const guard = createGroup({ position, rotation });
  guard.dataset.side = side;
  createEl("a-cylinder", {
    radius: 0.22,
    height: 0.82,
    position: "0 0.82 0",
    segments: 12,
    material: "color: #182a42; roughness: 0.58"
  }, guard);
  createEl("a-box", {
    position: "0 1.1 0.22",
    scale: "0.32 0.08 0.035",
    material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.55`
  }, guard);
  guard.head = createEl("a-entity", { position: "0 1.38 0" }, guard);
  createEl("a-sphere", {
    radius: 0.21,
    position: "0 0 0",
    material: "color: #d4a07c; roughness: 0.62"
  }, guard.head);
  createEl("a-cylinder", {
    radius: 0.22,
    height: 0.12,
    position: "0 0.17 0",
    material: "color: #0f1b2b; roughness: 0.45"
  }, guard.head);
  createEl("a-box", {
    position: "0 0.18 0.12",
    scale: "0.42 0.04 0.17",
    material: "color: #0f1b2b"
  }, guard.head);
  for (const x of [-0.07, 0.07]) {
    createEl("a-sphere", {
      radius: 0.018,
      position: `${x} 0.02 0.19`,
      material: "color: #080808"
    }, guard.head);
  }
  guard.waveArm = createEl("a-cylinder", {
    radius: 0.04,
    height: 0.58,
    position: `${side === "left" ? -0.28 : 0.28} 0.95 0.16`,
    rotation: side === "left" ? "36 0 -18" : "36 0 18",
    material: "color: #182a42; roughness: 0.58"
  }, guard);
  createEl("a-cylinder", {
    radius: 0.04,
    height: 0.58,
    position: `${side === "left" ? 0.28 : -0.28} 0.92 0.1`,
    rotation: side === "left" ? "58 0 12" : "58 0 -12",
    material: "color: #182a42; roughness: 0.58"
  }, guard);
  for (const x of [-0.12, 0.12]) {
    createEl("a-cylinder", {
      radius: 0.055,
      height: 0.62,
      position: `${x} 0.28 0`,
      material: "color: #101820; roughness: 0.65"
    }, guard);
    createEl("a-box", {
      position: `${x} -0.04 0.07`,
      scale: "0.12 0.05 0.24",
      material: "color: #090d14"
    }, guard);
  }
  createText("SECURITE", {
    position: "0 1.9 0.02",
    color: palette.cyan,
    width: 1.25,
    "wrap-count": 10
  }, guard);
  app.guardEntities.push(guard);
  return guard;
}

function animateGuardGreeting(guard) {
  if (!guard) return;
  if (guard.head) {
    guard.head.setAttribute("animation__nod", "property: rotation; dir: alternate; dur: 360; loop: 4; to: 6 0 0");
  }
  if (guard.waveArm) {
    const sign = guard.dataset.side === "left" ? -1 : 1;
    guard.waveArm.setAttribute("animation__wave", `property: rotation; dir: alternate; dur: 260; loop: 6; to: 6 0 ${sign * 48}`);
  }
}

function speakGuard(guard, text) {
  if (!guard) return;
  animateGuardGreeting(guard);
  showDialogueNearSpeaker(guard.head || guard, text, {
    offsetX: guard.dataset.side === "left" ? -0.7 : 0.7,
    offsetY: 0.62,
    offsetZ: 0.1,
    width: 2.7,
    height: 0.56,
    color: palette.white,
    accent: palette.cyan,
    duration: 4400,
    replace: false,
    className: "dialogue-bubble guard-dialogue"
  });
  if ("speechSynthesis" in window && app.hasUserInteraction && !app.audioMuted) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "fr-FR";
    utterance.rate = 0.96;
    utterance.pitch = guard.dataset.side === "left" ? 0.92 : 1.08;
    utterance.volume = 0.78;
    window.speechSynthesis.speak(utterance);
  }
}

function triggerGuardGreeting(forceVoice = false) {
  if (!app.guardEntities.length) return;
  if (app.guardGreetingPlayed && !forceVoice) return;
  app.guardGreetingPlayed = true;
  if (forceVoice) {
    app.hasUserInteraction = true;
  }
  speakGuard(app.guardEntities[0], "Bonjour, bienvenue au CineVR.");
  trackTimeout(() => {
    speakGuard(app.guardEntities[1], "Bonne seance, vous pouvez entrer.");
  }, 900);
}

function checkStreetGreetingProximity() {
  if (currentScene !== "street" || app.guardGreetingPlayed || !app.cameraRig) {
    return;
  }
  const rigPosition = app.cameraRig.object3D.position;
  const entrance = parsePosition(sceneLayouts.street.entranceDoor.position);
  const dx = rigPosition.x - entrance.x;
  const dz = rigPosition.z - (entrance.z + 2.2);
  if (Math.sqrt(dx * dx + dz * dz) < 2.2) {
    triggerGuardGreeting(false);
  }
}

function createEntranceGuards() {
  createGuard(sceneLayouts.street.leftGuard.position, sceneLayouts.street.leftGuard.rotation, "left");
  createGuard(sceneLayouts.street.rightGuard.position, sceneLayouts.street.rightGuard.rotation, "right");
}

function showStreetScene() {
  currentScene = "street";
  movieStarted = false;
  clearScene();
  placeCamera(sceneLayouts.street);
  playAmbientSound("street");

  createEl("a-sky", { color: "#050812" });
  createEl("a-light", { type: "ambient", color: "#c6dcff", intensity: 0.5 });
  createEl("a-light", { type: "directional", position: "3 6 4", color: "#ffffff", intensity: 0.42 });

  buildStreetBlockout();
  decorateStreet();
  createStreetCinema();
  createEntranceGuards();
  addTeleportPoints(sceneLayouts.street.teleportPoints);
  createSoundButtons(sceneLayouts.street.soundButton.position, sceneLayouts.street.soundButton.rotation);

  createReadableTextPanel(
    "Bienvenue devant le CineVR.\nCliquez sur la grande porte pour entrer.\nDeplacement : WASD ou ZQSD. Points cyan : teleportation.",
    sceneLayouts.street.instructionPanel.position,
    sceneLayouts.street.instructionPanel.rotation,
    { width: 5.2, height: 1.0, accent: palette.yellow, wrapCount: 50 }
  );
  trackTimeout(() => triggerGuardGreeting(false), 900);
}

function buildStreetBlockout() {
  createGround({ width: 16, height: 5.2 }, palette.asphalt, "0 0 5.0");
  createGround({ width: 16, height: 5.8 }, palette.concrete, "0 0 -1.4");
  createEl("a-box", {
    position: "0 0.045 1.55",
    scale: "16 0.08 0.32",
    material: `color: #d8c86b; emissive: ${palette.yellow}; emissiveIntensity: 0.15`
  });
  for (let z = 2.8; z <= 7; z += 1.45) {
    createEl("a-box", {
      position: `0 0.035 ${z}`,
      scale: "0.14 0.025 0.75",
      material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.2`
    });
  }
}

function decorateStreet() {
  for (const x of [-7, 7]) {
    for (const z of [-4.8, -1.9, 1.2]) {
      createWall(`${x} 1.4 ${z}`, "1.15 2.8 1.0", "#151b25", "#07111f");
      createEl("a-box", {
        position: `${x} 2.15 ${z + 0.51}`,
        scale: "0.7 0.08 0.04",
        material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.45`
      });
    }
  }

  for (const x of [-5.8, 5.8]) {
    const lamp = createGroup({ position: `${x} 0 -0.55` });
    createEl("a-cylinder", {
      radius: 0.055,
      height: 2.55,
      position: "0 1.27 0",
      material: `color: ${palette.metal}; metalness: 0.65; roughness: 0.25`
    }, lamp);
    createEl("a-sphere", {
      radius: 0.18,
      position: "0 2.64 0",
      material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 1.1`
    }, lamp);
    createEl("a-light", {
      type: "point",
      position: `${x} 2.55 -0.55`,
      color: palette.yellow,
      intensity: 0.8,
      distance: 6
    });
  }

  for (const x of [-5.4, -4.6, 4.6, 5.4]) {
    createEl("a-cylinder", {
      radius: 0.08,
      height: 0.55,
      position: `${x} 0.28 0.25`,
      material: `color: ${palette.metalDark}; metalness: 0.45`
    });
  }

  for (const x of [-4.9, 4.9]) {
    const bench = createGroup({ position: `${x} 0 -2.15` });
    createEl("a-box", {
      position: "0 0.42 0",
      scale: "1.5 0.14 0.42",
      material: "color: #283545; metalness: 0.25"
    }, bench);
    createEl("a-box", {
      position: "0 0.78 0.2",
      scale: "1.5 0.55 0.12",
      material: "color: #202b39; metalness: 0.25"
    }, bench);
  }
}

function createStreetCinema() {
  createWall("0 2.35 -6.05", "10.6 4.7 0.42", "#151b25", "#07111f");
  createWall("-5.45 2.1 -4.6", "0.35 4.2 2.9", "#111722");
  createWall("5.45 2.1 -4.6", "0.35 4.2 2.9", "#111722");
  createWall("0 4.85 -5.6", "11.1 0.35 1.2", "#222b38", palette.blue);
  createWall("0 0.18 -5.42", "11.2 0.36 1.0", "#202633");

  const marquee = createGroup({ position: "0 3.15 -5.35" });
  createEl("a-box", {
    position: "0 0 0",
    scale: "7.8 0.52 1.15",
    material: `color: #232f3c; metalness: 0.35; emissive: ${palette.yellow}; emissiveIntensity: 0.16`
  }, marquee);
  for (let x = -3.4; x <= 3.4; x += 0.85) {
    createEl("a-sphere", {
      radius: 0.08,
      position: `${x} -0.16 0.58`,
      material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.85`
    }, marquee);
  }

  createNeonSign("CINEVR", "0 4.05 -5.42", "0 0 0", 5.5);
  createNeonSign("CINEMA WEBXR", "0 3.35 -4.72", "0 0 0", 3.7);

  const door = createGroup({ position: sceneLayouts.street.entranceDoor.position, rotation: "0 0 0" });
  createEl("a-box", {
    position: "0 0 0",
    scale: "2.35 2.85 0.16",
    material: `color: ${palette.metalDark}; metalness: 0.45`
  }, door);
  const doorPanel = createEl("a-box", {
    position: "0 0 0.1",
    scale: "1.78 2.42 0.12",
    material: `color: #07121f; emissive: ${palette.blue}; emissiveIntensity: 0.18; metalness: 0.2`
  }, door);
  createEl("a-box", {
    position: "0 1.33 0.18",
    scale: "2.1 0.17 0.08",
    material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.65`
  }, door);
  createEl("a-sphere", {
    position: "0.62 -0.1 0.23",
    radius: 0.08,
    material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.45`
  }, door);
  createText("ENTRER", {
    position: "0 0.62 0.22",
    color: palette.white,
    width: 2.2,
    "wrap-count": 12
  }, door);
  createEl("a-box", {
    position: "0 -1.46 1.05",
    scale: "2.7 0.03 1.2",
    material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.25; opacity: 0.65; transparent: true`
  }, door);
  const hit = createEl("a-plane", {
    width: 2.35,
    height: 2.9,
    position: "0 0 0.28",
    material: "shader: flat; color: #ffffff; opacity: 0.001; transparent: true; side: double"
  }, door);
  makeClickable(hit, () => {
    playDoorSound();
    showLobbyScene();
  }, door);
  makeClickable(doorPanel, () => {
    playDoorSound();
    showLobbyScene();
  }, door);

  createMoviePoster(movies[0], sceneLayouts.street.leftPosterPosition.position, sceneLayouts.street.leftPosterPosition.rotation, () => {
    showLobbyScene();
    trackTimeout(() => previewMovie(1), 450);
  }, { compact: true, width: 1.35, height: 1.9 });
  createMoviePoster(movies[1], sceneLayouts.street.rightPosterPosition.position, sceneLayouts.street.rightPosterPosition.rotation, () => {
    showLobbyScene();
    trackTimeout(() => previewMovie(2), 450);
  }, { compact: true, width: 1.35, height: 1.9 });
}

function showLobbyScene() {
  currentScene = "lobby";
  clearScene();
  placeCamera(sceneLayouts.lobby);
  playAmbientSound("lobby");

  createEl("a-sky", { color: "#060913" });
  createEl("a-light", { type: "ambient", color: "#d9ecff", intensity: 0.62 });
  createEl("a-light", { type: "point", position: "0 3.8 -4.5", color: palette.cyan, intensity: 0.75, distance: 9 });
  createEl("a-light", { type: "point", position: "-4 2.8 0", color: palette.violet, intensity: 0.32, distance: 7 });
  createEl("a-light", { type: "point", position: "4 2.8 0", color: palette.yellow, intensity: 0.28, distance: 7 });

  buildLobbyBlockout();
  decorateLobby();
  createReceptionDesk(sceneLayouts.lobby.receptionDesk.position);
  createReceptionist(sceneLayouts.lobby.receptionist.position);
  createPreviewScreen();
  showMoviePosters();
  addTeleportPoints(sceneLayouts.lobby.teleportPoints);
  createSoundButtons("-5.45 1.0 1.8", "0 70 0");

  speakReceptionist(receptionistSpeech);
  if (selectedMovie && hasTicket) {
    showTicket();
  } else {
    createReadableTextPanel(
      "Choisissez une affiche a gauche ou a droite.\nLa bande-annonce apparaitra sur l'ecran central.",
      "0 0.78 1.35",
      "0 0 0",
      { width: 4.1, height: 0.78, color: palette.cyan, accent: palette.violet, panelColor: "#101827", wrapCount: 42, className: "preview-action" }
    );
  }
}

function buildLobbyBlockout() {
  createGround({ width: 14, height: 14 }, "#101722", "0 0 0");
  createWall("0 2 -6.7", "14 4 0.22", "#111827", "#0b1224");
  createWall("-7 2 0", "0.22 4 14", "#101620");
  createWall("7 2 0", "0.22 4 14", "#101620");
  createWall("0 4.03 0", "14 0.16 14", "#080d16");
  createEl("a-box", {
    position: "0 0.035 -2.3",
    scale: "0.14 0.035 7.0",
    material: `color: ${palette.blue}; emissive: ${palette.blue}; emissiveIntensity: 0.55`
  });
  for (const z of [-4.8, -3.2, -1.6, 0, 1.6, 3.2]) {
    createEl("a-box", {
      position: `0 0.04 ${z}`,
      scale: "1.1 0.035 0.07",
      material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.75`
    });
  }
}

function decorateLobby() {
  for (const x of [-6.2, 6.2]) {
    for (const z of [-5.4, -1.4, 3.0]) {
      createDecorativeColumn(`${x} 2 ${z}`, 3.9);
    }
  }
  createNeonSign("CINEVR", "0 3.35 -6.52", "0 0 0", 3.9);
  createFuturisticPanel("ACCUEIL", "-6.87 2.15 -3.8", "0 90 0", palette.cyan);
  createFuturisticPanel("FILMS", "6.87 2.15 -3.8", "0 -90 0", palette.violet);
  createFuturisticPanel("BILLETTERIE", "5.55 2.05 -5.95", "0 -25 0", palette.yellow);

  createTicketMachine("-5.35 0 -5.0", "0 28 0");
  createTicketMachine("5.35 0 -5.0", "0 -28 0");
  createPopcornStand("-5.6 0 2.2", "0 55 0");
  createQueuePosts();
  createWaitingSeats();

  for (const x of [-5.7, 5.7]) {
    createEl("a-ring", {
      position: `${x} 2.15 1.2`,
      rotation: `0 ${x < 0 ? 90 : -90} 0`,
      "radius-inner": 0.22,
      "radius-outer": 0.29,
      material: `color: ${x < 0 ? palette.cyan : palette.violet}; emissive: ${x < 0 ? palette.cyan : palette.violet}; emissiveIntensity: 0.35; opacity: 0.55; transparent: true`
    });
  }
}

function createQueuePosts() {
  for (const x of [-1.8, -0.6, 0.6, 1.8]) {
    createEl("a-cylinder", {
      radius: 0.045,
      height: 0.85,
      position: `${x} 0.42 -3.65`,
      material: `color: ${palette.metal}; metalness: 0.55`
    });
  }
  for (const x of [-1.2, 1.2]) {
    createEl("a-box", {
      position: `${x} 0.78 -3.65`,
      scale: "1.1 0.04 0.05",
      material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.35`
    });
  }
}

function createWaitingSeats() {
  for (const x of [-4.2, 4.2]) {
    const bench = createGroup({ position: `${x} 0 3.2`, rotation: "0 180 0" });
    createEl("a-box", {
      position: "0 0.42 0",
      scale: "1.8 0.18 0.58",
      material: "color: #263242; roughness: 0.45"
    }, bench);
    createEl("a-box", {
      position: "0 0.82 0.28",
      scale: "1.8 0.68 0.15",
      material: "color: #1b2532; roughness: 0.45"
    }, bench);
  }
}

function createPopcornStand(position, rotation) {
  const stand = createGroup({ position, rotation });
  createEl("a-box", {
    position: "0 0.65 0",
    scale: "0.78 1.3 0.46",
    material: `color: #f2f5f7; metalness: 0.15`
  }, stand);
  createEl("a-box", {
    position: "0 1.28 0.02",
    scale: "0.9 0.28 0.55",
    material: `color: ${palette.red}; emissive: ${palette.red}; emissiveIntensity: 0.15`
  }, stand);
  createText("POPCORN", {
    position: "0 1.3 0.31",
    color: palette.yellow,
    width: 1.2,
    "wrap-count": 10
  }, stand);
  createEl("a-plane", {
    position: "0 0.78 0.24",
    width: 0.58,
    height: 0.52,
    material: `shader: flat; color: ${palette.glass}; opacity: 0.35; transparent: true`
  }, stand);
}

function createReceptionDesk(position = "0 0.58 -5.35") {
  const desk = createGroup({ position });
  createEl("a-box", {
    position: "0 0 0",
    scale: "4.3 1.05 0.88",
    material: `color: #1f2a36; metalness: 0.38; roughness: 0.28`
  }, desk);
  createEl("a-box", {
    position: "0 0.62 0",
    scale: "4.55 0.18 1.02",
    material: `color: ${palette.metal}; metalness: 0.65; roughness: 0.22`
  }, desk);
  createEl("a-box", {
    position: "0 0.1 0.47",
    scale: "3.55 0.38 0.06",
    material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.5`
  }, desk);
  createText("ACCUEIL", {
    position: "0 0.16 0.53",
    color: palette.white,
    width: 3.2,
    "wrap-count": 12
  }, desk);
  return desk;
}

function createReceptionist(position = "0 1.05 -5.85") {
  const person = createGroup({ position });
  createEl("a-light", {
    type: "point",
    position: "0 1.8 0.6",
    color: palette.yellow,
    intensity: 0.45,
    distance: 3.4
  }, person);
  createEl("a-cylinder", {
    radius: 0.33,
    height: 0.84,
    position: "0 0.08 0",
    segments: 14,
    material: "color: #1f355f; roughness: 0.55"
  }, person);
  createEl("a-box", {
    position: "0 0.25 0.18",
    scale: "0.42 0.08 0.035",
    material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.8`
  }, person);
  createEl("a-cylinder", {
    radius: 0.12,
    height: 0.15,
    position: "0 0.58 0",
    material: "color: #c58b6c"
  }, person);
  app.receptionistHead = createEl("a-entity", { position: "0 0.88 0" }, person);
  createEl("a-sphere", {
    radius: 0.28,
    position: "0 0 0",
    material: "color: #d9a27f; roughness: 0.65"
  }, app.receptionistHead);
  createEl("a-sphere", {
    radius: 0.29,
    position: "0 0.1 -0.025",
    scale: "1 0.58 0.82",
    material: "color: #20242b; roughness: 0.5"
  }, app.receptionistHead);
  for (const x of [-0.1, 0.1]) {
    createEl("a-sphere", {
      radius: 0.025,
      position: `${x} 0.02 0.245`,
      material: "color: #101010"
    }, app.receptionistHead);
  }
  app.receptionistArms = [];
  for (const side of [-1, 1]) {
    const arm = createEl("a-cylinder", {
      radius: 0.055,
      height: 0.62,
      position: `${side * 0.39} 0.1 0.12`,
      rotation: `58 0 ${side * 5}`,
      material: "color: #1f355f; roughness: 0.55"
    }, person);
    app.receptionistArms.push(arm);
    createEl("a-sphere", {
      radius: 0.075,
      position: `${side * 0.43} -0.15 0.38`,
      material: "color: #d9a27f"
    }, person);
  }
  createText("Reception", {
    position: "0 1.35 0.03",
    color: palette.cyan,
    width: 1.6,
    "wrap-count": 12
  }, person);
  return person;
}

function createTicketMachine(position = "0 0 0", rotation = "0 0 0") {
  const machine = createGroup({ position, rotation });
  createEl("a-box", {
    position: "0 0.8 0",
    scale: "0.58 1.6 0.46",
    material: `color: #172131; metalness: 0.42; roughness: 0.3`
  }, machine);
  createEl("a-plane", {
    position: "0 1.15 0.235",
    width: 0.46,
    height: 0.4,
    material: `shader: flat; color: #07131f; emissive: ${palette.cyan}; emissiveIntensity: 0.32`
  }, machine);
  createText("TICKET", {
    position: "0 1.17 0.26",
    color: palette.white,
    width: 0.9,
    "wrap-count": 10
  }, machine);
  createEl("a-box", {
    position: "0 0.64 0.255",
    scale: "0.35 0.08 0.05",
    material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.45`
  }, machine);
  return machine;
}

function createPreviewScreen() {
  const layout = sceneLayouts.lobby.previewScreenPosition;
  const screen = createGroup({ position: layout.position, rotation: layout.rotation });
  createEl("a-box", {
    position: "0 0 -0.04",
    scale: "4.45 2.55 0.09",
    material: "color: #03050a; metalness: 0.18"
  }, screen);
  app.previewSurface = createEl("a-plane", {
    position: "0 0 0.04",
    width: 4.05,
    height: 2.18,
    material: `shader: flat; color: #101827; emissive: ${palette.blue}; emissiveIntensity: 0.12; side: double`
  }, screen);
  app.previewLayer = createGroup({ position: "0 0 0.09" }, screen);
  createText("PREVISUALISATION", {
    position: "0 1.45 0.06",
    color: palette.cyan,
    width: 3.8,
    "wrap-count": 20
  }, screen);
  createText("Selectionnez un film", {
    position: "0 0 0.1",
    color: palette.white,
    width: 3.2,
    "wrap-count": 24
  }, app.previewLayer);
  return screen;
}

function showMoviePosters() {
  const layouts = sceneLayouts.lobby;
  createMoviePoster(movies[0], layouts.leftPosterPosition.position, layouts.leftPosterPosition.rotation, () => previewMovie(1), {
    width: 1.45,
    height: 2.1
  });
  createMoviePoster(movies[1], layouts.rightPosterPosition.position, layouts.rightPosterPosition.rotation, () => previewMovie(2), {
    width: 1.45,
    height: 2.1
  });
}

function createMoviePoster(movie, position, rotation = "0 0 0", callback = () => previewMovie(movie.id), options = {}) {
  const poster = createGroup({ position, rotation });
  const frameColor = movie.id === 1 ? palette.yellow : palette.magenta;
  const width = options.width || 1.35;
  const height = options.height || 1.9;
  createEl("a-box", {
    position: "0 0 -0.04",
    scale: `${width + 0.18} ${height + 0.18} 0.08`,
    material: `color: ${frameColor}; emissive: ${frameColor}; emissiveIntensity: 0.38`
  }, poster);
  const surface = createEl("a-plane", {
    position: "0 0 0.03",
    width,
    height,
    material: `shader: flat; color: ${movie.id === 1 ? "#1b3c57" : "#25123e"}; emissive: ${movie.id === 1 ? palette.cyan : palette.violet}; emissiveIntensity: 0.08; side: double`
  }, poster);
  createEl("a-box", {
    position: "0 -1.03 0.07",
    scale: `${width + 0.25} 0.42 0.055`,
    material: `color: #07111f; opacity: 0.92; transparent: true`
  }, poster);
  createText(movie.title, {
    position: "0 -0.94 0.11",
    color: palette.white,
    width: width + 0.25,
    "wrap-count": 16
  }, poster);
  createText(`Salle ${movie.room}`, {
    position: "0 -1.15 0.11",
    color: frameColor,
    width: width + 0.25,
    "wrap-count": 12
  }, poster);
  if (!options.compact) {
    createText("Voir details", {
      position: "0 -1.38 0.08",
      color: palette.cyan,
      width: width + 0.4,
      "wrap-count": 14
    }, poster);
  }
  const hit = createEl("a-plane", {
    position: "0 -0.05 0.14",
    width: width + 0.34,
    height: height + 0.52,
    material: "shader: flat; color: #ffffff; opacity: 0.001; transparent: true; side: double"
  }, poster);
  makeClickable(surface, () => {
    playClickSound();
    callback();
  }, poster);
  makeClickable(hit, () => {
    playClickSound();
    callback();
  }, poster);
  applyPosterImageIfAvailable(movie, surface);
  return poster;
}

function previewMovie(movieId) {
  const movie = movies.find((item) => item.id === movieId);
  if (!movie) {
    showMessage("Film introuvable.");
    return;
  }
  selectedMovie = movie;
  movieStarted = false;
  clearPreviewInfo();
  playTrailer(movie);

  app.previewInfoPanel = createReadableTextPanel(
    `${movie.title}\nSalle ${movie.room}\n\n${movie.description}`,
    sceneLayouts.lobby.previewInfoPosition.position,
    sceneLayouts.lobby.previewInfoPosition.rotation,
    {
      width: 5.0,
      height: 1.28,
      color: palette.white,
      panelColor: "#0b1320",
      accent: movie.id === 1 ? palette.yellow : palette.magenta,
      wrapCount: 52,
      className: "preview-action"
    }
  );
  createButton("Choisir ce film", sceneLayouts.lobby.previewButtonPosition.position, sceneLayouts.lobby.previewButtonPosition.rotation, () => selectMovie(movie.id), {
    width: 2.25,
    color: movie.id === 1 ? "#1d5f89" : "#66367f",
    emissive: movie.id === 1 ? palette.cyan : palette.magenta,
    className: "preview-action"
  });
}

function clearLayer(layer) {
  if (!layer) return;
  while (layer.firstChild) {
    layer.removeChild(layer.firstChild);
  }
}

function clearPreviewInfo() {
  if (app.previewInfoPanel) {
    app.previewInfoPanel.remove();
    app.previewInfoPanel = null;
  }
  Array.from(app.world.querySelectorAll(".preview-action")).forEach((node) => node.remove());
}

async function playTrailer(movie) {
  stopActiveVideos();
  clearLayer(app.previewLayer);
  const loaded = await playVideoOnSurface(movie.trailerPath, app.previewSurface, app.previewLayer, () => showTrailerFallback(movie), {
    muted: app.audioMuted || !app.audioReady,
    volume: 0.45
  });
  if (loaded && app.previewLayer && app.previewLayer.isConnected) {
    createText(movie.title, {
      position: "0 -1.05 0.04",
      color: palette.white,
      width: 3.6,
      "wrap-count": 24
    }, app.previewLayer);
  }
}

async function playVideoOnSurface(path, surface, layer, fallback, options = {}) {
  if (!surface || !layer || !surface.isConnected) {
    return false;
  }
  const exists = await fileExists(path);
  if (!exists) {
    fallback();
    return false;
  }

  const video = document.createElement("video");
  video.id = `video-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
  video.src = path;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = Boolean(options.muted);
  video.volume = options.volume ?? 0.65;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  app.assets.appendChild(video);
  app.activeVideos.push(video);

  return new Promise((resolve) => {
    const fail = () => {
      if (video.isConnected) {
        video.remove();
      }
      fallback();
      resolve(false);
    };
    const success = () => {
      if (!surface.isConnected) {
        fail();
        return;
      }
      surface.setAttribute("material", `shader: flat; src: #${video.id}; color: #ffffff; side: double`);
      video.play().then(() => resolve(true)).catch(fail);
    };
    video.addEventListener("error", fail, { once: true });
    video.addEventListener("canplay", success, { once: true });
    video.load();
  });
}

async function prepareMovieVideo(movie) {
  if (!movie || !movie.moviePath) {
    return null;
  }
  const exists = await fileExists(movie.moviePath);
  if (!exists) {
    return null;
  }
  stopMovieVideo();
  const video = document.createElement("video");
  video.id = `movie-video-${movie.id}-${Date.now()}`;
  video.src = movie.moviePath;
  video.crossOrigin = "anonymous";
  video.loop = true;
  video.muted = false;
  video.volume = app.audioMuted ? 0 : 0.85;
  video.playsInline = true;
  video.setAttribute("playsinline", "");
  video.setAttribute("webkit-playsinline", "");
  app.assets.appendChild(video);
  currentMovieVideo = video;
  return video;
}

async function playMovieWithSound(movie) {
  if (!movie || !app.cinemaSurface || !app.cinemaLayer || !app.cinemaSurface.isConnected) {
    return false;
  }
  unlockAudioAfterUserGesture();
  const video = await prepareMovieVideo(movie);
  if (!video) {
    showMessage("Video absente : lancement de l'animation de secours.");
    showMovieFallback(movie);
    return false;
  }

  video.muted = app.audioMuted;
  video.volume = app.audioMuted ? 0 : 0.85;

  return new Promise((resolve) => {
    const fail = () => {
      showMessage("Lecture video impossible : animation de secours activee.");
      stopMovieVideo();
      showMovieFallback(movie);
      resolve(false);
    };
    const success = () => {
      if (!app.cinemaSurface || !app.cinemaSurface.isConnected || !currentMovieVideo) {
        fail();
        return;
      }
      app.cinemaSurface.setAttribute("material", `shader: flat; src: #${video.id}; color: #ffffff; side: double`);
      clearLayer(app.cinemaLayer);
      video.play()
        .then(() => {
          setMovieVolume(app.audioMuted ? 0 : 0.85);
          resolve(true);
        })
        .catch(fail);
    };
    video.addEventListener("error", fail, { once: true });
    video.addEventListener("canplay", success, { once: true });
    video.load();
  });
}

function setMovieVolume(volume) {
  if (!currentMovieVideo) {
    return;
  }
  const nextVolume = Math.max(0, Math.min(1, volume));
  currentMovieVideo.volume = nextVolume;
  currentMovieVideo.muted = nextVolume === 0 || app.audioMuted;
}

function showTrailerFallback(movie) {
  if (!app.previewLayer || !app.previewSurface || !app.previewLayer.isConnected) {
    return;
  }
  app.previewSurface.setAttribute(
    "material",
    `shader: flat; color: ${movie.id === 1 ? "#123d5a" : "#2d1648"}; emissive: ${movie.id === 1 ? palette.cyan : palette.violet}; emissiveIntensity: 0.2`
  );
  createText("Bande-annonce de remplacement", {
    position: "0 0.66 0.04",
    color: palette.yellow,
    width: 3.4,
    "wrap-count": 28
  }, app.previewLayer);
  createText(movie.title, {
    position: "0 0.34 0.04",
    color: palette.white,
    width: 3.1,
    "wrap-count": 24
  }, app.previewLayer);
  for (let i = 0; i < 5; i += 1) {
    const block = createEl("a-box", {
      position: `${-1.25 + i * 0.62} -0.22 0.03`,
      scale: "0.36 0.34 0.04",
      material: `color: ${i % 2 === 0 ? palette.cyan : palette.yellow}; emissive: ${i % 2 === 0 ? palette.cyan : palette.yellow}; emissiveIntensity: 0.35`
    }, app.previewLayer);
    block.setAttribute("animation__rise", `property: position; dir: alternate; dur: ${900 + i * 150}; loop: true; to: ${-1.25 + i * 0.62} ${-0.05 + i * 0.035} 0.03`);
  }
}

function selectMovie(movieId) {
  const movie = movies.find((item) => item.id === movieId);
  if (!movie) {
    showMessage("Impossible de generer le ticket.");
    return;
  }
  selectedMovie = movie;
  selectedRoom = movie.room;
  hasTicket = true;
  playValidationSound();
  clearPreviewInfo();
  stopActiveVideos();
  if (app.previewLayer) {
    clearLayer(app.previewLayer);
    createText(`Ticket pret\n${movie.title}\nSalle ${movie.room}`, {
      position: "0 0.08 0.04",
      color: palette.white,
      width: 3.1,
      "wrap-count": 22
    }, app.previewLayer);
  }
  updateTicket(movie);
  showMessage(`Ticket genere : ${movie.title}, Salle ${movie.room}.`);
}

function updateTicket(movie) {
  if (app.ticketGroup) {
    app.ticketGroup.remove();
    app.ticketGroup = null;
  }
  showTicket(movie);
}

function showTicket(movie = selectedMovie) {
  if (!movie) return null;
  const layout = sceneLayouts.lobby;
  app.ticketGroup = createGroup({ position: layout.ticketPanelPosition.position, rotation: layout.ticketPanelPosition.rotation });
  createEl("a-box", {
    position: "0 0 0",
    scale: "2.35 0.82 0.06",
    material: "color: #f7f0d0; roughness: 0.65"
  }, app.ticketGroup);
  createText("TICKET CINEVR", {
    position: "0 0.24 0.06",
    color: "#111827",
    width: 2.1,
    "wrap-count": 18
  }, app.ticketGroup);
  createText(`${movie.title}\nSalle ${movie.room}`, {
    position: "0 -0.08 0.06",
    color: "#111827",
    width: 2.15,
    "wrap-count": 22
  }, app.ticketGroup);
  for (let i = 0; i < 7; i += 1) {
    createEl("a-box", {
      position: `${-0.75 + i * 0.24} -0.34 0.07`,
      scale: `${0.04 + (i % 3) * 0.025} 0.16 0.03`,
      material: "color: #111827"
    }, app.ticketGroup);
  }
  createButton("Aller vers les salles", layout.continueButtonPosition.position, layout.continueButtonPosition.rotation, () => {
    playDoorSound();
    showHallwayScene();
  }, {
    width: 2.35,
    color: "#1f5f86",
    emissive: palette.cyan
  });
  return app.ticketGroup;
}

function showHallwayScene() {
  currentScene = "hallway";
  clearScene();
  placeCamera(sceneLayouts.hallway);
  playAmbientSound("hallway");

  createEl("a-sky", { color: "#05070c" });
  createEl("a-light", { type: "ambient", color: "#bedbff", intensity: 0.5 });
  createEl("a-light", { type: "point", position: "0 2.8 2.8", color: palette.cyan, intensity: 0.6, distance: 7 });
  createEl("a-light", { type: "point", position: "0 2.8 -2.3", color: palette.yellow, intensity: 0.35, distance: 5 });

  buildHallway();
  addTeleportPoints(sceneLayouts.hallway.teleportPoints);
  const chosen = selectedMovie ? selectedMovie.title : "Aucun film choisi";
  createReadableTextPanel(
    hasTicket
      ? `Votre ticket : ${chosen}\nSalle ${selectedRoom}. Suivez les fleches au sol.`
      : "Aucun ticket. Retournez a l'accueil pour choisir un film.",
    sceneLayouts.hallway.ticketReminder.position,
    sceneLayouts.hallway.ticketReminder.rotation,
    { width: 4.6, height: 0.82, color: palette.white, accent: palette.yellow, panelColor: "#101827", wrapCount: 46 }
  );
  createDoor("Salle 1", "Big Buck Bunny", sceneLayouts.hallway.room1Door.position, sceneLayouts.hallway.room1Door.rotation, 1);
  createDoor("Salle 2", "Sintel", sceneLayouts.hallway.room2Door.position, sceneLayouts.hallway.room2Door.rotation, 2);
  createHallwayArrows();
  createSoundButtons("4.85 1.05 3.4", "0 -90 0");
  createButton("Retour accueil", "-4.9 1.05 3.4", "0 90 0", () => showLobbyScene(), {
    width: 1.45,
    height: 0.34,
    color: "#34404f",
    emissive: palette.blue
  });
}

function buildHallway() {
  createGround({ width: 9.8, height: 11.5 }, "#17111a", "0 0 0.3");
  createWall("-5 1.75 0.3", "0.2 3.5 11.5", "#101620");
  createWall("5 1.75 0.3", "0.2 3.5 11.5", "#101620");
  createWall("0 3.52 0.3", "10 0.14 11.5", "#080d14");
  createWall("0 1.75 -5.45", "10 3.5 0.18", "#111827");
  createWall("0 1.75 5.95", "10 3.5 0.16", "#0d121c");
  createReadableTextPanel("VERS LES SALLES", "0 2.55 -4.85", "0 0 0", {
    width: 3.3,
    height: 0.55,
    accent: palette.cyan,
    color: palette.white
  });
  for (const z of [4.0, 2.4, 0.8, -0.8, -2.4, -4.0]) {
    createEl("a-box", {
      position: "0 3.43 " + z,
      scale: "2.8 0.05 0.14",
      material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.55`
    });
  }
  for (const x of [-4.86, 4.86]) {
    for (const z of [3.3, 0.4, -3.2]) {
      createEl("a-box", {
        position: `${x} 0.75 ${z}`,
        scale: "0.05 0.12 0.8",
        material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.35`
      });
    }
  }
}

function createDoor(label, filmTitle, position, rotation = "0 0 0", roomNumber) {
  const door = createGroup({ position, rotation });
  const isTarget = hasTicket && selectedRoom === roomNumber;
  const accent = isTarget ? palette.yellow : palette.cyan;
  createEl("a-box", {
    position: "0 0 0",
    scale: "1.8 2.65 0.14",
    material: `color: ${palette.metalDark}; metalness: 0.45; roughness: 0.32`
  }, door);
  createEl("a-box", {
    position: "0 0 0.08",
    scale: "1.42 2.24 0.1",
    material: `color: #0a1320; emissive: ${accent}; emissiveIntensity: ${isTarget ? 0.26 : 0.12}`
  }, door);
  createEl("a-box", {
    position: "0 1.42 0.13",
    scale: "1.65 0.28 0.08",
    material: `color: ${accent}; emissive: ${accent}; emissiveIntensity: 0.6`
  }, door);
  createText(`${label}\n${filmTitle}`, {
    position: "0 0.55 0.18",
    color: palette.white,
    width: 1.9,
    "wrap-count": 18
  }, door);
  createEl("a-sphere", {
    position: "0.5 -0.2 0.2",
    radius: 0.075,
    material: `color: ${accent}; emissive: ${accent}; emissiveIntensity: 0.35`
  }, door);
  const posterMovie = movies.find((movie) => movie.room === roomNumber);
  createDoorMiniPoster(posterMovie, door, roomNumber === 1 ? -1.35 : 1.35);
  const hit = createEl("a-plane", {
    width: 1.85,
    height: 2.8,
    position: "0 0 0.26",
    material: "shader: flat; color: #ffffff; opacity: 0.001; transparent: true; side: double"
  }, door);
  makeClickable(hit, () => checkRoom(roomNumber), door);
  return door;
}

function createDoorMiniPoster(movie, parent, localX) {
  const mini = createGroup({ position: `${localX} 0 0.12` }, parent);
  createEl("a-box", {
    position: "0 0 -0.03",
    scale: "0.72 1.0 0.05",
    material: `color: ${movie.id === 1 ? palette.yellow : palette.magenta}; emissive: ${movie.id === 1 ? palette.yellow : palette.magenta}; emissiveIntensity: 0.28`
  }, mini);
  const surface = createEl("a-plane", {
    position: "0 0 0.02",
    width: 0.58,
    height: 0.86,
    material: `shader: flat; color: ${movie.id === 1 ? "#1b3c57" : "#25123e"}; side: double`
  }, mini);
  createText(movie.title, {
    position: "0 -0.58 0.05",
    color: palette.white,
    width: 0.9,
    "wrap-count": 12
  }, mini);
  applyPosterImageIfAvailable(movie, surface);
  return mini;
}

function createHallwayArrows() {
  const targetLeft = selectedRoom !== 2;
  const color = targetLeft ? palette.yellow : palette.magenta;
  for (const z of [3.2, 2.0, 0.8]) {
    createFloorArrow("0 0.035 " + z, "0 0 0", color);
  }
  if (targetLeft) {
    createFloorArrow("-0.9 0.035 -0.35", "0 90 0", color);
    createFloorArrow("-2.1 0.035 -1.15", "0 90 0", color);
  } else {
    createFloorArrow("0.9 0.035 -0.35", "0 -90 0", color);
    createFloorArrow("2.1 0.035 -1.15", "0 -90 0", color);
  }
}

function createFloorArrow(position, rotation = "0 0 0", color = palette.yellow) {
  const arrow = createGroup({ position, rotation });
  createEl("a-plane", {
    width: 0.28,
    height: 0.82,
    rotation: "-90 0 0",
    position: "0 0 0.18",
    material: `shader: flat; color: ${color}; emissive: ${color}; emissiveIntensity: 0.6; side: double`
  }, arrow);
  createEl("a-triangle", {
    "vertex-a": "-0.32 0 0",
    "vertex-b": "0.32 0 0",
    "vertex-c": "0 -0.48 0",
    rotation: "-90 0 0",
    position: "0 0 -0.38",
    material: `shader: flat; color: ${color}; emissive: ${color}; emissiveIntensity: 0.75; side: double`
  }, arrow);
  return arrow;
}

function createArrow(position, rotation = "0 0 0") {
  return createFloorArrow(position, rotation, palette.yellow);
}

function checkRoom(roomNumber) {
  if (!hasTicket || !selectedMovie) {
    showMessage("Choisissez d'abord un film a l'accueil.");
    return;
  }
  if (roomNumber !== selectedRoom) {
    playClickSound();
    showMessage(`Mauvaise salle. Votre ticket indique la Salle ${selectedRoom}.`);
    return;
  }
  playDoorSound();
  showCinemaRoomScene(selectedMovie);
}

function showCinemaRoomScene(movie = selectedMovie) {
  currentScene = "cinemaRoom";
  movieStarted = false;
  clearScene();
  placeCamera(sceneLayouts.cinemaRoom);
  playCinemaAmbient();

  createEl("a-sky", { color: "#020204" });
  createEl("a-light", { type: "ambient", color: "#788394", intensity: 0.26 });
  const frontLight = createEl("a-light", { type: "point", position: "0 2.7 -5.2", color: palette.white, intensity: 0.48, distance: 5 });
  const sideLightL = createEl("a-light", { type: "point", position: "-3.7 1.7 1.5", color: palette.yellow, intensity: 0.28, distance: 4 });
  const sideLightR = createEl("a-light", { type: "point", position: "3.7 1.7 1.5", color: palette.yellow, intensity: 0.28, distance: 4 });
  app.cinemaLightEntities = [frontLight, sideLightL, sideLightR];

  buildCinemaRoom(movie);
  createProjector();
  createSeatRows();
  createAudience();
  addTeleportPoints(["cinemaEntrance", "cinemaSeat"]);
  createCinemaControls(movie);
  createSoundButtons("-4.55 1.05 4.65", "0 36 0");
}

function buildCinemaRoom(movie) {
  createGround({ width: 10, height: 14 }, palette.carpet, "0 0 0");
  createWall("-5 1.9 -0.2", "0.22 3.8 14", "#13070d");
  createWall("5 1.9 -0.2", "0.22 3.8 14", "#13070d");
  createWall("0 1.9 -7.4", "10 3.8 0.2", "#060609");
  createWall("0 3.82 -0.2", "10 0.14 14", "#050507");
  createEl("a-box", {
    position: "0 0.035 1.25",
    scale: "0.72 0.035 7.6",
    material: "color: #2d1018"
  });

  for (let row = 0; row < sceneLayouts.cinemaRoom.rows; row += 1) {
    const y = row * 0.25;
    const z = -0.05 + row * 1.12;
    createEl("a-box", {
      position: `0 ${Math.max(0.01, y - 0.03)} ${z + 0.1}`,
      scale: "9.4 0.06 0.95",
      material: "color: #210a12; roughness: 0.75"
    });
    if (row > 0) {
      createEl("a-box", {
        position: `0 ${y / 2 - 0.02} ${z - 0.52}`,
        scale: "9.4 0.08 0.08",
        material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.22`
      });
    }
  }

  const screen = createGroup({ position: sceneLayouts.cinemaRoom.screen.position, rotation: sceneLayouts.cinemaRoom.screen.rotation });
  createEl("a-box", {
    position: "0 0 -0.06",
    scale: "6.65 3.3 0.12",
    material: "color: #010101; metalness: 0.2"
  }, screen);
  createEl("a-box", {
    position: "0 -1.82 0",
    scale: "7.2 0.22 0.12",
    material: `color: ${palette.redDark}; roughness: 0.55`
  }, screen);
  app.cinemaSurface = createEl("a-plane", {
    position: "0 0 0.035",
    width: 6.05,
    height: 2.85,
    material: "shader: flat; color: #e9edf5; emissive: #ffffff; emissiveIntensity: 0.14; side: double"
  }, screen);
  app.cinemaLayer = createGroup({ position: "0 0 0.08" }, screen);
  createText(`Film : ${movie.title}\nInstallez-vous puis lancez la seance.`, {
    position: "0 0 0.05",
    color: "#111827",
    width: 5.5,
    "wrap-count": 36
  }, app.cinemaLayer);

  for (const x of [-4.75, 4.75]) {
    for (const z of [-5.0, -2.6, -0.2, 2.2]) {
      createEl("a-box", {
        position: `${x} 1.75 ${z}`,
        scale: "0.08 0.52 0.44",
        material: `color: ${palette.yellow}; emissive: ${palette.yellow}; emissiveIntensity: 0.25`
      });
      createEl("a-box", {
        position: `${x} 2.4 ${z + 0.4}`,
        scale: "0.09 0.7 0.42",
        material: "color: #111820"
      });
    }
  }
  createReadableTextPanel("SORTIE", "-4.86 2.65 4.8", "0 90 0", {
    width: 1.25,
    height: 0.42,
    color: palette.green,
    accent: palette.green,
    panelColor: "#07110b"
  });
  createReadableTextPanel("SORTIE", "4.86 2.65 4.8", "0 -90 0", {
    width: 1.25,
    height: 0.42,
    color: palette.green,
    accent: palette.green,
    panelColor: "#07110b"
  });
}

function createSeatRows() {
  const xs = [-3.15, -2.25, -1.35, 1.35, 2.25, 3.15];
  for (let row = 0; row < sceneLayouts.cinemaRoom.rows; row += 1) {
    const y = row * 0.25;
    const z = -0.05 + row * 1.12;
    xs.forEach((x) => createCinemaSeat(`${x} ${y} ${z}`, "0 0 0", { row }));
  }
}

function createCinemaSeat(position, rotation = "0 0 0", options = {}) {
  const base = parsePosition(position);
  const seat = createGroup({ position: `${base.x} ${base.y} ${base.z}`, rotation });
  createEl("a-box", {
    position: "0 0.36 0",
    scale: "0.62 0.18 0.62",
    material: `color: ${palette.red}; roughness: 0.72`
  }, seat);
  createEl("a-box", {
    position: "0 0.88 0.31",
    scale: "0.64 0.9 0.16",
    material: `color: ${palette.redDark}; roughness: 0.72`
  }, seat);
  createEl("a-sphere", {
    position: "0 1.32 0.31",
    radius: 0.28,
    scale: "1.1 0.38 0.34",
    material: `color: ${palette.redDark}; roughness: 0.7`
  }, seat);
  for (const x of [-0.42, 0.42]) {
    createEl("a-box", {
      position: `${x} 0.58 0`,
      scale: "0.12 0.42 0.68",
      material: "color: #210a10; roughness: 0.65"
    }, seat);
  }
  createEl("a-cylinder", {
    radius: 0.05,
    height: 0.36,
    position: "0 0.18 0",
    material: `color: ${palette.metal}; metalness: 0.5`
  }, seat);
  return seat;
}

function createAudience() {
  const positions = [
    "-2.25 0.0 -0.05",
    "2.25 0.0 -0.05",
    "-3.15 0.25 1.07",
    "-1.35 0.25 1.07",
    "1.35 0.25 1.07",
    "3.15 0.25 1.07",
    "-2.25 0.5 2.19",
    "2.25 0.5 2.19",
    "-1.35 0.75 3.31",
    "1.35 0.75 3.31"
  ];
  positions.forEach((position, index) => createAudienceMember(position, "0 0 0", { colorIndex: index }));
}

function createAudienceMember(position, rotation = "0 0 0", options = {}) {
  const colors = ["#3c6e9f", "#6254a4", "#7f4d5c", "#486b52", "#6b5b48"];
  const person = createGroup({ position, rotation });
  createEl("a-cylinder", {
    radius: 0.16,
    height: 0.45,
    position: "0 0.72 -0.04",
    material: `color: ${colors[options.colorIndex % colors.length]}; roughness: 0.65`
  }, person);
  createEl("a-sphere", {
    radius: 0.16,
    position: "0 1.04 -0.12",
    material: "color: #c58b6c; roughness: 0.6"
  }, person);
  for (const x of [-0.2, 0.2]) {
    createEl("a-cylinder", {
      radius: 0.035,
      height: 0.32,
      position: `${x} 0.75 -0.28`,
      rotation: "62 0 0",
      material: "color: #c58b6c"
    }, person);
  }
  return person;
}

function createCinemaControls(movie) {
  app.cinemaControls = createGroup({ position: "0 0 0" });
  createReadableTextPanel("Choisissez une place, puis lancez la seance.", "0 1.05 -1.9", "0 0 0", {
    width: 4.2,
    height: 0.62,
    color: palette.white,
    accent: palette.yellow,
    panelColor: "#0b1320",
    className: "cinema-control"
  });
  app.sitButton = createButton("S'asseoir", "-0.85 0.48 -1.9", "0 0 0", () => seatUser(), {
    width: 1.45,
    color: "#263241",
    emissive: palette.cyan,
    className: "cinema-control"
  });
  app.launchButton = createButton("Lancer la seance", "0.95 0.48 -1.9", "0 0 0", () => startMovieSession(movie), {
    width: 2.0,
    color: "#7b1727",
    emissive: palette.red,
    className: "cinema-control"
  });
  app.launchButton.setAttribute("visible", "false");
  app.restartControl = createButton("Recommencer", "3.85 0.62 4.25", "0 -28 0", () => resetExperience(), {
    width: 1.55,
    color: "#263241",
    emissive: palette.cyan,
    className: "restart-control"
  });
}

function seatUser() {
  if (app.seatInProgress || app.seated) {
    return;
  }
  app.seatInProgress = true;
  app.seated = true;
  playValidationSound();
  showSeatTransitionMessage();
  if (app.sitButton) {
    app.sitButton.setAttribute("visible", "false");
  }
  const startPosition = app.cameraRig.getAttribute("position");
  const target = sceneLayouts.cinemaRoom.seatTarget;
  animateCameraToSeat(startPosition, target.position, target.rotation, 1250);
  trackTimeout(() => {
    app.seatInProgress = false;
    if (app.launchButton && !movieStarted) {
      app.launchButton.setAttribute("visible", "true");
    }
    showMessage("Vous etes installe. La seance va commencer.");
  }, 1300);
}

function animateCameraToSeat(startPosition, targetPosition, targetRotation, duration = 1200) {
  app.cameraRig.setAttribute("animation__seat", {
    property: "position",
    dur: duration,
    easing: "easeInOutSine",
    from: `${startPosition.x} ${startPosition.y} ${startPosition.z}`,
    to: targetPosition
  });
  app.cameraRig.setAttribute("animation__seatrot", {
    property: "rotation",
    dur: duration,
    easing: "easeInOutSine",
    to: targetRotation
  });
}

function showSeatTransitionMessage() {
  showMessage("Installation dans le siege...");
}

function createProjector() {
  const projector = createGroup({ position: "0 3.15 5.35", rotation: "-8 0 0" });
  createEl("a-box", {
    position: "0 0 0",
    scale: "0.82 0.36 0.7",
    material: `color: ${palette.metalDark}; metalness: 0.45; roughness: 0.35`
  }, projector);
  createEl("a-cylinder", {
    radius: 0.16,
    height: 0.25,
    rotation: "90 0 0",
    position: "0 -0.02 -0.48",
    material: `color: ${palette.cyan}; emissive: ${palette.cyan}; emissiveIntensity: 0.25`
  }, projector);
  createEl("a-box", {
    position: "0 0.22 0.05",
    scale: "1.1 0.06 0.48",
    material: `color: ${palette.metal}; metalness: 0.6`
  }, projector);
  return projector;
}

function startProjectorBeam() {
  stopProjectorBeam();
  app.projectorBeam = createEl("a-cone", {
    position: "0 2.55 -1.1",
    rotation: "90 0 0",
    height: 7.7,
    "radius-top": 0.08,
    "radius-bottom": 2.35,
    "open-ended": true,
    material: `color: #d9f2ff; opacity: 0.13; transparent: true; side: double; depthWrite: false`
  });
}

function stopProjectorBeam() {
  if (app.projectorBeam) {
    app.projectorBeam.remove();
    app.projectorBeam = null;
  }
}

function dimCinemaLights() {
  app.cinemaLightEntities.forEach((light, index) => {
    light.setAttribute("animation__dim", {
      property: "light.intensity",
      dur: 1200,
      easing: "easeInOutSine",
      to: index === 0 ? 0.2 : 0.08
    });
  });
}

function hideCinemaControls() {
  Array.from(app.world.querySelectorAll(".cinema-control")).forEach((node) => {
    node.setAttribute("visible", "false");
  });
}

function showCinemaControls() {
  Array.from(app.world.querySelectorAll(".cinema-control")).forEach((node) => {
    node.setAttribute("visible", "true");
  });
}

function stopMovieSession() {
  movieStarted = false;
  stopMovieVideo();
  stopProjectorBeam();
  showCinemaControls();
  if (app.launchButton && !app.seated) {
    app.launchButton.setAttribute("visible", "false");
  }
  if (currentScene === "cinemaRoom") {
    playCinemaAmbient();
  }
}

function startScreenAnimation(movie) {
  clearLayer(app.cinemaLayer);
  app.cinemaSurface.setAttribute("material", "shader: flat; color: #0a0f1c; emissive: #101d35; emissiveIntensity: 0.28; side: double");
  createText(`${movie.title}\nSeance en cours`, {
    position: "0 0.35 0.05",
    color: palette.white,
    width: 5.2,
    "wrap-count": 30
  }, app.cinemaLayer);
  for (let i = 0; i < 14; i += 1) {
    const x = -2.7 + Math.random() * 5.4;
    const y = -1.0 + Math.random() * 2.0;
    const star = createEl("a-sphere", {
      radius: 0.025 + Math.random() * 0.025,
      position: `${x.toFixed(2)} ${y.toFixed(2)} 0.05`,
      material: `color: ${i % 2 ? palette.cyan : palette.yellow}; emissive: ${i % 2 ? palette.cyan : palette.yellow}; emissiveIntensity: 0.8`
    }, app.cinemaLayer);
    star.setAttribute("animation__pulse", `property: scale; dir: alternate; dur: ${700 + i * 80}; loop: true; to: 1.8 1.8 1.8`);
  }
}

async function startMovieSession(movie = selectedMovie) {
  if (!movie || movieStarted) {
    return;
  }
  unlockAudioAfterUserGesture();
  if (!app.seated) {
    seatUser();
    showMessage("Installez-vous, puis relancez la seance.");
    return;
  }
  movieStarted = true;
  playMovieStartSound();
  hideCinemaControls();
  stopAllSounds();
  dimCinemaLights();
  startProjectorBeam();
  playProjectorSound();
  startScreenAnimation(movie);
  await startMovieAnimation(movie);
}

async function startMovieAnimation(movie = selectedMovie) {
  if (!movie || !app.cinemaLayer) {
    return;
  }
  stopMovieVideo();
  stopActiveVideos();
  clearLayer(app.cinemaLayer);
  await playMovieWithSound(movie);
}

function showMovieFallback(movie) {
  if (!app.cinemaLayer || !app.cinemaSurface || !app.cinemaLayer.isConnected) {
    return;
  }
  app.cinemaSurface.setAttribute(
    "material",
    "shader: flat; color: #0a0f1c; emissive: #172a46; emissiveIntensity: 0.35; side: double"
  );
  createText(`${movie.title}\nSeance en cours`, {
    position: "0 0.68 0.04",
    color: palette.white,
    width: 5.0,
    "wrap-count": 30
  }, app.cinemaLayer);
  createText("Animation de remplacement : ajoutez ou remplacez le MP4 si besoin.", {
    position: "0 -0.88 0.04",
    color: "#d8ecff",
    width: 4.8,
    "wrap-count": 42
  }, app.cinemaLayer);
  for (let i = 0; i < 9; i += 1) {
    const color = [palette.red, palette.yellow, palette.cyan, palette.violet][i % 4];
    const item = createEl("a-box", {
      position: `${-2.4 + i * 0.6} 0.02 0.04`,
      scale: "0.3 0.44 0.04",
      material: `color: ${color}; emissive: ${color}; emissiveIntensity: 0.28`
    }, app.cinemaLayer);
    item.setAttribute("animation__move", `property: position; dir: alternate; dur: ${900 + i * 95}; loop: true; to: ${-2.4 + i * 0.6} ${0.22 + (i % 3) * 0.12} 0.04`);
  }
}

function resetExperience() {
  selectedMovie = null;
  selectedRoom = null;
  hasTicket = false;
  movieStarted = false;
  app.guardGreetingPlayed = false;
  showStreetScene();
}
