// This file is just a looong list of the objectives' definitions and
// their positions in the scene.

var SCENE_OBJECTIVES = {
  // Testing ones (copy paste em)
  "pulse": {
    position: new THREE.Vector3(200,-600, PLAYER_Z),
    params: {
      color: 0x808080,
      animate: function() {
        let factor = 1 + 0.2 * Math.sin(time / 500);
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
    }
  },
  "gray": {
    position: new THREE.Vector3(-500,-600, PLAYER_Z),
    params: {
      color: 0x808080,
    }
  },
  "green": {
    position: new THREE.Vector3(-400,-600, PLAYER_Z),
    params: {
      color: 0x7aea52,
    }
  },
  "bit2": {
    position: new THREE.Vector3(-300,-600, PLAYER_Z),
    params: {
      color: 0x808080,
      tubeSegments: 10,
      radialSegments: 3,
      animate: function() {
        let L = (Math.sin(time / 3000) / 2) + 0.5;
        let newColor = ditherRGB(L,L,L,4, true);
        this.material.color.copy(newColor);
      }
    }
  },
  "blue": {
    position: new THREE.Vector3(-200,-600, PLAYER_Z),
    params: {
      color: 0x52b5ea,
    }
  },
  "bit4": {
    position: new THREE.Vector3(-100,-600, PLAYER_Z),
    params: {
      color: 0x808080,
      tubeSegments: 20,
      radialSegments: 6,
      animate: function() {
        let L = (Math.sin(time / 3000) / 2) + 0.5;
        let newColor = ditherRGB(L,L,L,16, true);
        this.material.color.copy(newColor);
      }
    }
  },
  "red": {
    position: new THREE.Vector3(0,-600, PLAYER_Z),
    params: {
      color: 0xea5254,
    }
  },
  "bit8": {
    position: new THREE.Vector3(100,-600, PLAYER_Z),
    params: {
      color: 0x808080,
      tubeSegments: 30,
      radialSegments: 9,
      animate: function() {
        let L = (Math.sin(time / 3000) / 2) + 0.5;
        let newColor = ditherRGB(L,L,L,256, true);
        this.material.color.copy(newColor);
      }
    }
  },
  "coolParticles": {
    position: new THREE.Vector3(200,-600, PLAYER_Z),
    params: {
      color: 0x808080,
      animate: function() {
        let L = (Math.sin(time / 3000) / 2) + 0.5;
        let newColor = ditherRGB(L,L,L,256, true);
        this.material.color.copy(newColor);
      },
      onUnlock: function() {
        options.lifetime = 4;
      }
    }
  },

  // Actual game ones
  "pulse": {
    position: new THREE.Vector3(600, 550, PLAYER_Z),
    params: {
      color: 0x808080,
      animate: function() {
        let factor = 1 + 0.2 * Math.sin(time / 500);
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
    }
  },
  "gray": {
    position: new THREE.Vector3(2100, 1200, PLAYER_Z),
    params: {
      color: 0x808080,
    }
  },
};
