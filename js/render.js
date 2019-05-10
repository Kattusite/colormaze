
/******************************************************************************/
/**                      CONSTANTS                                           **/
/**                                                                          **/
/******************************************************************************/



// Current system time in milliseconds
// var time; // Moved to core.js

// Near and far viewing plane constants
const NEAR = 0.1;
const FAR = 3000;

/******************************************************************************/
/**                      INITIALIZERS                                        **/
/**                                                                          **/
/******************************************************************************/

// Initialize the document, handlers, and renderer
function init() {
  time = Date.now();

  initRenderer();
  $("body").keydown(handleKeydown);
  $("body").keyup(handleKeyup);
  $("body").keypress(handleKeypress);
  $(window).resize(handleResize);

  initKeybindings();
}

// Associate keys with actions triggered by those keys
function initKeybindings() {
  for (let action of ACTIONS) {
    for (let key of action.boundKeys) {
      KEY_BINDINGS[key] = action;
    }
  }
}

// Initialize everything needed to start displaying the WebGL scene in-browser
function initRenderer() {
  // Initialize the WebGL renderer
  renderer = new THREE.WebGLRenderer({canvas: $('#gameCanvas')[0], antialias: true});
  renderer.setClearColor(0x555555);
  renderer.setPixelRatio(window.devicePixelRatio);

  let width = window.innerWidth;
  let height = window.innerHeight;

  renderer.setSize(width, height);

  // Initialize the cameras
  camera2d = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, NEAR, FAR);
  camera3d = new THREE.PerspectiveCamera(35, width/height, NEAR, FAR);

  if (flat) camera = camera2d;
  else      camera = camera3d;

  scene = new THREE.Scene();

  // Add lights (playing with these leads to super cool effects)
  scene.add(ambientWhite);
  activeLights[ambientWhite.uuid] = ambientWhite;

  // ==================== SET UP THE SCENE ===========================

  // Add the player, enemies, particles, walls, objectives...
  initEntities();
  initParticles();
  initWalls();
  initObjectives();


  // The testing "floor" square in the center -- does nothing so far
  let geometry1 = new THREE.PlaneGeometry(300, 300, 1, 1);
  let material1 = new THREE.MeshLambertMaterial({color: 0x447777});
  let mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.position.set(0,0,-1100);
  scene.add(mesh1);

  particleSystem = new THREE.GPUParticleSystem({
    maxParticles: 250000
  });
  scene.add(particleSystem);
  options = {
    position: new THREE.Vector3(),
    positionRandomness: 0.4,
    velocity: new THREE.Vector3(),
    velocityRandomness: .5,
    color: 0x22ff88,
    colorRandomness: .2,
    turbulence: .5,
    lifetime: 4,
    size: 30,
    sizeRandomness: 10
  };
  spawnerOptions = {
      spawnRate: 2500,
      horizontalSpeed: 1.5,
      verticalSpeed: 1.33,
      timeScale: 8
  };
  // ==================================================================

  // Disable colors that aren't yet unlocked
  updateColors();

  requestAnimationFrame(render);
}

// Add the player and enemies to the scene
function initEntities() {
  // Add a playable cube to the scene
  player = new Player();
  scene.add(player.mesh);
  // entities.push(player); // NOTE: The player should not be included in the entities array

  // Add a single enemy to the scene
  let shooter = new Shooter(500, 500, FLOOR_Z);
  scene.add(shooter.mesh);
  entities.push(shooter);
}

function initParticles() {
  // TODO: Copy the particles code here
}

function initWalls() {
  // create 4 basic walls (heights and relative positions can be changed later)
  let wall;
  wall = new Wall({
    length: 30,
    thickness: 400,
    height: 80,
    position: new THREE.Vector3(-800, 0, FLOOR_Z),
    color: 0x4182ea
  });
  walls.push(wall);
  scene.add(wall.mesh);

  wall = new Wall({
    length: 20,
    thickness: 700,
    height: 80,
    position: new THREE.Vector3(800, 0, FLOOR_Z),
    color: 0x41ea74
  });
  walls.push(wall);
  scene.add(wall.mesh);

  wall = new Wall({
    length: 500,
    thickness: 50,
    height: 80,
    position: new THREE.Vector3(0, -500, FLOOR_Z),
    color: 0xea9641,
  });
  walls.push(wall);
  scene.add(wall.mesh);

  wall = new Wall({
    length: 300,
    thickness: 40,
    height: 80,
    position: new THREE.Vector3(100, 400, FLOOR_Z),
    color: 0xea41bd
  });
  walls.push(wall);
  scene.add(wall.mesh);


  // Wall testing: remove me later
  let wall42 = new Wall({
    start: new THREE.Vector3(150,500,FLOOR_Z),
    end:   new THREE.Vector3(150,0,FLOOR_Z),
    // height: 200,0
    // thickness: 20,
    color: 0x884444
  });
  scene.add(wall42.mesh);
  walls.push(wall42);
}

// Initialize the objective entities
function initObjectives() {
  // Defined in scene/scene_objectives.js

  // Add objective pickups to the scene
  for (let unlock in SCENE_OBJECTIVES) {
    let obj = SCENE_OBJECTIVES[unlock];
    let objectiveEntity = new Objective(obj.position, unlock, obj.params);
    entities.push(objectiveEntity);
    scene.add(objectiveEntity.mesh);
  }
}

/******************************************************************************/
/**                      RENDER  LOOP                                        **/
/**                                                                          **/
/******************************************************************************/
// Render a scene (many times per second)
function render() {
  time = Date.now();

  // Animate the player
  player.animate();

  // Loop over all entities, animating them, and culling out any that died
  let newEntities = [];
  for (let entity of entities) {
    entity.animate();

    // Remove dead entities, preserve living entities
    if (entity.isDead())    scene.remove(entity.mesh);
    else                    newEntities.push(entity);
  }
  entities = newEntities;

  // Update all colors
  // Not needed as long as colors are toggled and no new objs added
  updateColors();

  var delta = clock.getDelta() * spawnerOptions.timeScale;
  tick += delta;
  if (tick < 0) tick = 0;
  if (delta > 0) {
    options.position = player.position;
    for (let x = 0; x < spawnerOptions.spawnRate * delta; x++) {
      particleSystem.spawnParticle(options);
    }
  }
  particleSystem.update(tick);


  // Render the scene repeatedly
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}


/******************************************************************************/
/**                      HELPERS                                             **/
/**                                                                          **/
/******************************************************************************/

// For debugging, enable all possible objective features
function unlockAllObjectives() {
  for (let obj in objectives) {
    objectives[obj] = true;
  }

  updateColors();
}

// Toggle (lock/unlock) the color of the given name
// Accepted values are "grey", "red", "green", "blue", "bit2", "bit4", "bit8"
function toggleColor(color) {
  if (!["grey", "red", "green", "blue", "bit2", "bit4", "bit8"].includes(color)) {
    console.error("Illegal color passed to toggleColor!");
    return;
  }
  objectives[color] = !objectives[color];
  updateColors();
}


// Downscale the quality of colors in the scene to those supported by currently
// unlocked objectives
function updateColors() {
  let RED = 0xFF0000;
  let GRN = 0x00FF00;
  let BLU = 0x0000FF;
  let NO_RED = 0x00FFFF;
  let NO_GRN = 0xFF00FF;
  let NO_BLU = 0xFFFF00;

  let MASK_1 = 0x808080;
  let MASK_2 = 0xC0C0C0;
  let MASK_4 = 0xF0F0F0;
  // let MASK_8 = 0xFFFFFF;

  for (let object of scene.children) {
    // If this object has no material color (or has an override) ignore it
    if (!object.material) continue;
    if (object.material.showTrueColor) continue;

    // The first time this object is processed, save its original color
    if (!object.material.trueColor) object.material.trueColor = object.material.color.clone();

    let hex = object.material.trueColor.getHex();
    let origHex = hex;
    let r, g, b;

    // New idea:
    let hsl = {}
    object.material.trueColor.getHSL(hsl);

    // If color is basically grayscale, just let it through. Otherwise filter channels
    if (hsl.s > 0.1) {
      // Filter out colors that are not unlocked
      if (!objectives.red)    hex = hex & NO_RED;
      if (!objectives.green)  hex = hex & NO_GRN;
      if (!objectives.blue)   hex = hex & NO_BLU;
    }

    // If filtered to black, but not orig. black, and we are rendering in grayscale:
    if (hex == 0 && origHex != 0 && objectives.gray) {
      let L = Math.round(hsl.l * 255);
        r = L;
        g = L;
        b = L;
    }
    else {
      r = (hex & RED) >>> 16;
      g = (hex & GRN) >>> 8;
      b = (hex & BLU);
    }

    // Dither down to enabled fidelity
    r /= 256;
    g /= 256;
    b /= 256;

    let colorDepth;
    if      (!objectives.bit2) colorDepth = 2;
    else if (!objectives.bit4) colorDepth = 4;
    else if (!objectives.bit8) colorDepth = 16;
    else                       colorDepth = 256;

    // Given a continuous value in [0,1) return a dithered value in [0,1]
    let dither = function(comp) {
      return Math.floor(comp * colorDepth) / (colorDepth - 1);
    }

    let dithR = dither(r);
    let dithG = dither(g);
    let dithB = dither(b);

    object.material.color.copy(new THREE.Color(dithR, dithG, dithB));
  }
}

function normalizeLights() {
  let keys = Object.keys(activeLights);
  for (let key of keys) {
    activeLights[key].intensity = 1 / keys.length;
  }
}

// Return a bounding box representing objects in the orthographic viewing frustum
function getScreenBoundingBox() {
  let w = window.innerWidth;
  let h = window.innerHeight;

  let min = new THREE.Vector3(-w/4, -h/4, -FAR);
  let max = new THREE.Vector3(w/4, h/4, -NEAR);
  min.add(camera.position);
  max.add(camera.position);

  let box = new THREE.Box3(min, max);
  return box;
}


/******************************************************************************/
/**                      EVENT HANDLERS                                      **/
/**                                                                          **/
/******************************************************************************/

// Handle when keys are held down
function handleKeydown(event) {
  let key = event.key;

  // Only consider keys that have movement actions bound to them.
  let action = KEY_BINDINGS[key];
  if (!action || action.type != MOVE) return;
  if (keysPressed[key]) return;

  keysPressed[key] = true;
}

// Handle when keys are released
function handleKeyup(event) {
  let key = event.key;

  // Only consider keys that have movement actions bound to them.
  let action = KEY_BINDINGS[key];
  if (!action || !CONTINUING_ACTIONS.includes(action.type)) return;
  if (!keysPressed[key]) return;

  delete keysPressed[key];
}

// Handle when keys are pushed and released
function handleKeypress(event) {
  let key = event.key;

  // Only consider keys that have movement actions bound to them.
  let action = KEY_BINDINGS[key];
  if (!action || !INSTANT_ACTIONS.includes(action.type)) return;

  // Change the camera perspective
  if (action.type == SHIFT) {
    flat = !flat;
    if (flat) camera = camera2d;
    else      camera = camera3d;
  }
  else if (action.type == ADD_LIGHT) {
    let uuid = action.light.uuid;

    // Do nothing if light already in scene
    if (activeLights[uuid]) return;

    scene.add(action.light);
    activeLights[uuid] = action.light;

    // Normalize lights to have intensity 1
    normalizeLights();
  }
  else if (action.type == REM_LIGHT) {
    let uuid = action.light.uuid;

    // Do nothing if light not already in scene
    if (!activeLights[uuid]) return;

    scene.remove(action.light);
    delete activeLights[uuid];

    // Normalize lights to have intensity 1
    normalizeLights();
  }
  else if (action.type == UNLOCK_ALL) {
    unlockAllObjectives();
  }
}

// Update the camera and renderer parameters when the window changes size
function handleResize() {
  let w = window.innerWidth;
  let h = window.innerHeight;

  camera2d.left   = -w / 2;
  camera2d.right  =  w / 2;
  camera2d.top    =  h / 2;
  camera2d.bottom = -h / 2;
  camera2d.updateProjectionMatrix();

  camera3d.aspect = window.innerWidth / window.innerHeight;
  camera3d.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}
