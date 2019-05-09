
/******************************************************************************/
/**                      CONSTANTS                                           **/
/**                                                                          **/
/******************************************************************************/

// Renderer + Scene objects
var renderer, scene, origin;

// Current system time in milliseconds
// var time; // Moved to core.js


// Particles and projectiles currently living in the scene.
// Projectiles can hit the player, particles can't.
var entities = [];
// var particles = [];
// var projectiles = [];

var activeLights = {};

// Walls/collision objects
var walls = [];

// Geometry and mesh objects
var geometry, material, mesh;

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
  //camera2d.position.set(0,10,0);
  //camera3d.position.set(0,10,0);
  if (flat) camera = camera2d;
  else      camera = camera3d;

  scene = new THREE.Scene();
  origin = new THREE.Vector3(0, 0, 0);

  // Add lights (playing with these leads to super cool effects)
  scene.add(ambientWhite);
  activeLights[ambientWhite.uuid] = ambientWhite;

  // ==================== SET UP THE SCENE ===========================
  // (move this to its own function or file eventually)
  // Add a cube to the scene
  player = new Player();
  scene.add(player.mesh);
  // entities.push(player);

  geometry = new THREE.CubeGeometry(50,50,50);
  material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0,0,-1000);


  let geometry1 = new THREE.PlaneGeometry(300, 300, 1, 1);
  let material1 = new THREE.MeshLambertMaterial({color: 0x447777});
  let mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.position.set(0,0,-1100);

  let shooter = new Shooter(500, 500, -1000);
  scene.add(shooter.mesh);
  entities.push(shooter);

  // create 4 basic walls (heights and relative positions can be changed later)
  let geometry2 = new THREE.BoxGeometry(30, 400, 80, 1);
  let wallMesh1 = new THREE.Mesh(geometry2, material);
  wallMesh1.position.set(-800, 0, -1000);
  walls.push(wallMesh1);

  let geometry3 = new THREE.BoxGeometry(20, 700, 80, 1);
  let wallMesh2 = new THREE.Mesh(geometry3, material);
  wallMesh2.position.set(800, 0, -1000);
  walls.push(wallMesh2);

  let geometry4 = new THREE.BoxGeometry(500, 50, 80, 1);
  let wallMesh3 = new THREE.Mesh(geometry4, material);
  wallMesh3.position.set(0, -500, -1000);
  walls.push(wallMesh3);

  let geometry5 = new THREE.BoxGeometry(300, 40, 80, 1);
  let wallMesh4 = new THREE.Mesh(geometry5, material);
  wallMesh4.position.set(100, 400, -1000);
  walls.push(wallMesh4);


  // scene.add(mesh);
  scene.add(mesh1);

  scene.add(wallMesh1);
  scene.add(wallMesh2);
  scene.add(wallMesh3);
  scene.add(wallMesh4);

  // Disable colors that aren't yet unlocked
  updateColors();


  // ==================================================================

  requestAnimationFrame(render);
}

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

  // Render the scene repeatedly
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

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
    if (!object.material.trueColor) object.material.trueColor = object.material.color;

    let hex = object.material.trueColor.getHex();
    let r = (hex & RED) >>> 16;
    let g = (hex & GRN) >>> 8;
    let b = (hex & BLU);

    // Special case: if none of R,G,B unlocked, set to white
    /*
    if (!objectives.red && !objectives.green && !objectives.blue) {
      object.material.color = new THREE.Color(0xFFFFFF);
      continue;
    }
    */

    // Filter out colors that are not unlocked
    if (!objectives.red)    hex = hex & NO_RED;
    if (!objectives.green)  hex = hex & NO_GRN;
    if (!objectives.blue)   hex = hex & NO_BLU;

    // Filter out fidelities that are not unlocked
    if (!objectives.bit2)   hex = hex & MASK_1;
    if (!objectives.bit4)   hex = hex & MASK_2;
    if (!objectives.bit8)   hex = hex & MASK_4;

    // If the color was filtered down to black, set it to a shade of grey based on brightness
    if (hex == 0) {
      let l = ((r+g+b) / 255.0) / 3.0;

      if (!objectives.grey) l = Math.round(l);

      object.material.color = new THREE.Color(l,l,l);
      continue;
    }

    object.material.color = new THREE.Color(hex);
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
