// This file is just a looong list of the objectives' definitions and
// their positions in the scene.

var SCENE_OBJECTIVES = {
  "gray": {
    position: new THREE.Vector3(-500,-600, FLOOR_Z),
    params: {
      color: 0x808080,
    }
  },
  "green": {
    position: new THREE.Vector3(-400,-600, FLOOR_Z),
    params: {
      color: 0x7aea52,
    }
  },
  "bit2": {
    position: new THREE.Vector3(-300,-600, FLOOR_Z),
    params: {
      color: 0x808080,
      tubeSegments: 10,
      radialSegments: 3,
    }
  },
  "blue": {
    position: new THREE.Vector3(-200,-600, FLOOR_Z),
    params: {
      color: 0x52b5ea,
    }
  },
  "bit4": {
    position: new THREE.Vector3(-100,-600, FLOOR_Z),
    params: {
      color: 0x808080,
      tubeSegments: 20,
      radialSegments: 6,
    }
  },
  "red": {
    position: new THREE.Vector3(0,-600, FLOOR_Z),
    params: {
      color: 0xea5254,
    }
  },
  "bit8": {
    position: new THREE.Vector3(100,-600, FLOOR_Z),
    params: {
      color: 0x808080,
      tubeSegments: 30,
      radialSegments: 9,
    }
  },
  "pulse": {
    position: new THREE.Vector3(200,-600, FLOOR_Z),
    params: {
      color: 0x808080,
      animate: function() {
        let factor = 1 + 0.2 * Math.sin(time / 500);
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
    }
  },
};
