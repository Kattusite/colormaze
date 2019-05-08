
/******************************************************************************/
/**                      CONSTANTS                                           **/
/**                                                                          **/
/******************************************************************************/

// Renderer + Scene objects
var renderer, scene, origin;

// time + objectives
var time;
var objectives = {
  objPulse:  false,
  objPart:   false,
  red: false,
  green: false,
  blue: false,
  bit2: false,
  bit4: false,
  bit8: false,
};

// Lighting objects
var ambientWhite  = new THREE.AmbientLight(0xffffff, 0.5);
var ambientRed    = new THREE.AmbientLight(0xff0000, 0.5);
var ambientGreen  = new THREE.AmbientLight(0x00ff00, 0.5);
var ambientBlue   = new THREE.AmbientLight(0x0000ff, 0.5);

var pointWhite = new THREE.PointLight(0xffffff, 0.5);

// Camera objects
var camera; // The camera currently being used (either camera2d, camera3d)
var camera2d; // The 2d orthographic camera
var camera3d; // The 3d perspective camera

// Geometry and mesh objects
var geometry, material, mesh;

// Near and far viewing plane constants
const NEAR = 0.1;
const FAR = 3000;

// Are we using the 2d or 3d camera?
var flat = false;

// Keys Pressed at any given moment
var keysPressed = {};

// Movement speed
const speed = 10;


/******************************************************************************/
/**                      ACTIONS  & KEYBINDINGS                              **/
/**                                                                          **/
/******************************************************************************/
// Possible action types
// MOVE: Move the player cube by its speed as long as key is held
const MOVE    = "move";

// SHIFT: Change from 2d to 3d camera and vice versa.
const SHIFT   = "change perspective";

// ADD/REM_LIGHT: Add or remove a light from the scene
const ADD_LIGHT = "add light";
const REM_LIGHT = "remove light";

// Actions that happen in every frame the key is held
const CONTINUING_ACTIONS = [MOVE];

// Actions that happen once every time the key is pushed and released
const INSTANT_ACTIONS = [SHIFT, ADD_LIGHT, REM_LIGHT];

// Definitions of all the actions
const ACTIONS = [
  // Move up
  {
    boundKeys:    ["ArrowUp", "w"],
    type:         MOVE,
    vector:       new THREE.Vector3(0, speed, 0)
  },
  // Move Down
  {
    boundKeys:    ["ArrowDown", "s"],
    type:         MOVE,
    vector:       new THREE.Vector3(0, -speed, 0)
  },
  // Move left
  {
    boundKeys:    ["ArrowLeft", "a"],
    type:         MOVE,
    vector:       new THREE.Vector3(-speed, 0, 0)
  },
  // Move right
  {
    boundKeys:    ["ArrowRight", "d"],
    type:         MOVE,
    vector:       new THREE.Vector3(speed, 0, 0)
  },
  {
    boundKeys:    ["o"],
    type:         SHIFT
  },
  {
    boundKeys:    ["-"],
    type:         REM_LIGHT,
    light:        pointWhite
  },
  {
    boundKeys:    ["="],
    type:         ADD_LIGHT,
    light:        pointWhite
  }
];

const KEY_BINDINGS = {};

/******************************************************************************/
/**                      INITIALIZERS                                        **/
/**                                                                          **/
/******************************************************************************/

// Initialize the document, handlers, and renderer
function init() {
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
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);

  let width = window.innerWidth;
  let height = window.innerHeight;

  renderer.setSize(width, height);

  // Initialize the cameras
  camera2d = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, NEAR, FAR);
  camera3d = new THREE.PerspectiveCamera(35, width/height, NEAR, FAR);
  //camera2d.position.set(0,10,0);
  //camera3d.position.set(0,10,0);
  camera = camera3d;

  scene = new THREE.Scene();
  origin = new THREE.Vector3(0, 0, 0);

  // Add lights (playing with these leads to super cool effects)
  scene.add(ambientWhite);

  // Add a cube to the scene
  geometry = new THREE.CubeGeometry(50,50,50);
  material = new THREE.MeshLambertMaterial({color: 0xFFFFFF});
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0,0,-1000);


  let geometry1 = new THREE.PlaneGeometry(300, 300, 1, 1);
  let material1 = new THREE.MeshLambertMaterial({color: 0xFF7777});
  let mesh1 = new THREE.Mesh(geometry1, material);
  mesh1.position.set(0,0,-1100);

  scene.add(mesh);
  scene.add(mesh1);

  requestAnimationFrame(render);
}

// Render a scene (many times per second)
function render() {

  let boundingBox = getScreenBoundingBox();
  time = Date.now();

  // Trigger all actions for keys that are pressed down
  for (let key in keysPressed) {
    if (!KEY_BINDINGS[key]) continue;
    let action = KEY_BINDINGS[key];

    // Decide what to do based on the action type
    if (action.type === MOVE) {
      // Move the cube
      mesh.position.add(action.vector);

      // We probably want to move both cameras too, leaving the rest of scene behind
      if (!boundingBox.containsPoint(mesh.position)) {
        objectives["objPulse"] = true;
        camera2d.position.add(action.vector);
        camera3d.position.add(action.vector);
      }

      // Make sure the cube doesn't leave the viewable area (a little buggy still)
      //mesh.position.clamp(boundingBox.min, boundingBox.max);
    }


  }

  // Rotate the cube a little bit (it looks like it's bouncing, sort of...)
  // mesh.rotation.x += 0.02;
  if (objectives["objPulse"]) {
    let scale = Math.max(1, 1.075 * Math.sin(time / 175));
    mesh.scale.set(scale, scale, scale);
  }

  // Update all colors (inefficient to keep this in loop -- should put it only once when unlocks occur)
  updateColors();

  // Render the scene repeatedly
  renderer.render(scene, camera);
  requestAnimationFrame(render);
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
    // If this object has no (material) color ignore it
    if (!object.material) continue;

    // The first time this object is processed, save its original color
    if (!object.material.trueColor) object.material.trueColor = object.material.color;

    let hex = object.material.trueColor.getHex();

    // Special case: if none of R,G,B unlocked, set to white
    if (!objectives.red && !objectives.green && !objectives.blue) {
      object.material.color = new THREE.Color(0xFFFFFF);
      continue;
    }

    // Filter out colors that are not unlocked
    if (!objectives.red)    hex = hex & NO_RED;
    if (!objectives.green)  hex = hex & NO_GRN;
    if (!objectives.blue)   hex = hex & NO_BLU;

    // Filter out fidelities that are not unlocked
    if (!objectives.bit2)   hex = hex & MASK_1;
    if (!objectives.bit4)   hex = hex & MASK_2;
    if (!objectives.bit8)   hex = hex & MASK_4;

    object.material.color = new THREE.Color(hex);
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
    scene.add(action.light);
  }
  else if (action.type == REM_LIGHT) {
    scene.remove(action.light);
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
