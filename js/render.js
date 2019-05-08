var renderer, camera, camera2d, camera3d, scene, geometry, material, mesh;

// Are we using the 2d or 3d camera?
var flat = false;


// Keys Pressed at any given moment
var keysPressed = {};

// Movement speed
const speed = 10;

// Possible actions
const MOVE    = "move";
const SHIFT   = "change perspective";

// Actions that happen in every frame the key is held
const CONTINUING_ACTIONS = [MOVE];

// Actions that happen once every time the key is pushed and released
const INSTANT_ACTIONS = [SHIFT];

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
    boundKeys: ["ArrowDown", "s"],
    type:      MOVE,
    vector:    new THREE.Vector3(0, -speed, 0)
  },
  // Move left
  {
    boundKeys: ["ArrowLeft", "a"],
    type:    MOVE,
    vector:    new THREE.Vector3(-speed, 0, 0)
  },
  // Move right
  {
    boundKeys: ["ArrowRight", "d"],
    type:    MOVE,
    vector:    new THREE.Vector3(speed, 0, 0)
  },
  {
    boundKeys: ["o"],
    type:    SHIFT
  }
];

const KEY_BINDINGS = {};

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

// Initialize the renderer
function initRenderer() {
  renderer = new THREE.WebGLRenderer({canvas: $('#gameCanvas')[0], antialias: true});
  renderer.setClearColor(0x000000);
  renderer.setPixelRatio(window.devicePixelRatio);

  let width = window.innerWidth;
  let height = window.innerHeight;
  let near = 0.1;
  let far = 3000;

  renderer.setSize(width, height);

  camera2d = new THREE.OrthographicCamera(width/-2, width/2, height/2, height/-2, near, far);
  camera3d = new THREE.PerspectiveCamera(35, width/height, near, far);
  //camera2d.position.set(0,10,0);
  //camera3d.position.set(0,10,0);
  camera = camera3d;

  scene = new THREE.Scene();

  // Add a cube to the scene
  geometry = new THREE.CubeGeometry(100,100,100);
  material = new THREE.MeshBasicMaterial();
  mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0,0,-1000);

  scene.add(mesh);

  requestAnimationFrame(render);
}

// Render a scene (many times per second)
function render() {
  // Trigger all actions for keys that are pressed down

  for (let key in keysPressed) {
    if (!KEY_BINDINGS[key]) continue;
    let action = KEY_BINDINGS[key];

    // Decide what to do based on the action type
    if (action.type === MOVE) {

    } else if (action.type === SHIFT) {

    }

    mesh.position.add(action.vector);
  }

  mesh.rotation.x += 0.02;
  renderer.render(scene, camera);
  requestAnimationFrame(render);
}

function handleKeydown(event) {
  let key = event.key;

  // Only consider keys that have movement actions bound to them.
  let action = KEY_BINDINGS[key];
  if (!action || action.type != MOVE) return;
  if (keysPressed[key]) return;

  keysPressed[key] = true;
}

function handleKeyup(event) {
  let key = event.key;

  // Only consider keys that have movement actions bound to them.
  let action = KEY_BINDINGS[key];
  if (!action || !CONTINUING_ACTIONS.includes(action.type)) return;
  if (!keysPressed[key]) return;

  delete keysPressed[key];
}

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
}

function handleResize() {
  cameras = [camera2d, camera3d];
  for (let camera of cameras) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
}
