var renderer, camera2d, camera3d, scene, geometry, material, mesh;



// Keys Pressed and tracked
var keysPressed = {};

const speed = 10;

const ACTIONS = [
  // Move up
  {
    boundKeys:    ["ArrowUp", "w"],
    vector:       new THREE.Vector3(0, speed, 0)
  },
  // Move Down
  {
    boundKeys: ["ArrowDown", "s"],
    vector:    new THREE.Vector3(0, -speed, 0)
  },
  // Move left
  {
    boundKeys: ["ArrowLeft", "a"],
    vector:    new THREE.Vector3(-speed, 0, 0)
  },
  // Move right
  {
    boundKeys: ["ArrowRight", "d"],
    vector:    new THREE.Vector3(speed, 0, 0)
  }
];

const KEY_BINDINGS = {};

// Initialize the document, handlers, and renderer
function init() {
  initRenderer();
  $("body").keydown(handleKeydown);
  $("body").keyup(handleKeyup);
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
  renderer.setSize(window.innerWidth, window.innerHeight);

  camera2d = new THREE.OrthographicCamera(35, window.innerWidth/window.innerHeight, 0.1, 3000);
  camera3d = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 0.1, 3000);
  //camera2d.position.set(0,10,0);
  //camera3d.position.set(0,10,0);

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
    let action = KEY_BINDINGS[key];
    // For now assume that all actions move the cube
    mesh.position.add(action.vector);
  }

  mesh.rotation.x += 0.02;
  renderer.render(scene, camera3d);
  requestAnimationFrame(render);
}

function handleKeydown(event) {
  let key = event.key;
  if (keysPressed[key]) return;
  keysPressed[key] = true;
}

function handleKeyup(event) {
  let key = event.key;
  if (!keysPressed[key]) return;
  delete keysPressed[key];
}

function handleResize() {
  cameras = [camera2d, camera3d];
  for (let camera of cameras) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  }

  renderer.setSize(window.innerWidth, window.innerHeight);
}
