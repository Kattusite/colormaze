
// Constants and helper functions and stuff that need to be visible
// from all of the other files

// (This file shouldn't have any dependencies)


/******************************************************************************/
/**                               RENDERER                                   **/
/**                                                                          **/
/******************************************************************************/
// The current time in ms
var time;

// Are we using the 2d or 3d camera?
var flat = false;

// Camera objects
var camera; // The camera currently being used (either camera2d, camera3d)
var camera2d; // The 2d orthographic camera
var camera3d; // The 3d perspective camera

// Ambient Lights
var ambientWhite  = new THREE.AmbientLight(0xffffff, 0.5);
var ambientRed    = new THREE.AmbientLight(0xff0000, 0.5);
var ambientGreen  = new THREE.AmbientLight(0x00ff00, 0.5);
var ambientBlue   = new THREE.AmbientLight(0x0000ff, 0.5);

// Point Lights
var pointWhite = new THREE.PointLight(0xffffff, 0.5);


/******************************************************************************/
/**                               GAMEPLAY                                   **/
/**                                                                          **/
/******************************************************************************/
// Objectives and their current state of unlockedness
var objectives = {
  objPulse:   false,
  objPart:    false,
  gray:       false,
  red:        false,
  green:      false,
  blue:       false,
  bit2:       false,
  bit4:       false,
  bit8:       false,
};



// The player object
var player;

/******************************************************************************/
/**                      ACTIONS  & KEYBINDINGS                              **/
/**                                                                          **/
/******************************************************************************/
// Keys Pressed at any given moment
var keysPressed = {};

// Possible action types
// MOVE: Move the player cube by its speed as long as key is held
const MOVE    = "move";

// SHIFT: Change from 2d to 3d camera and vice versa.
const SHIFT   = "change perspective";

// ADD/REM_LIGHT: Add or remove a light from the scene
const ADD_LIGHT = "add light";
const REM_LIGHT = "remove light";

const UNLOCK_ALL = "unlock all"

// Actions that happen in every frame the key is held
const CONTINUING_ACTIONS = [MOVE];

// Actions that happen once every time the key is pushed and released
const INSTANT_ACTIONS = [SHIFT, ADD_LIGHT, REM_LIGHT, UNLOCK_ALL];

// Definitions of all the actions
const ACTIONS = [
  // Move up
  {
    boundKeys:    ["ArrowUp", "w"],
    type:         MOVE,
    vector:       new THREE.Vector3(0, 1, 0)
  },
  // Move Down
  {
    boundKeys:    ["ArrowDown", "s"],
    type:         MOVE,
    vector:       new THREE.Vector3(0, -1, 0)
  },
  // Move left
  {
    boundKeys:    ["ArrowLeft", "a"],
    type:         MOVE,
    vector:       new THREE.Vector3(-1, 0, 0)
  },
  // Move right
  {
    boundKeys:    ["ArrowRight", "d"],
    type:         MOVE,
    vector:       new THREE.Vector3(1, 0, 0)
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
  },
  {
    boundKeys:    ["`"],
    type:         UNLOCK_ALL
  }
];

const KEY_BINDINGS = {};
