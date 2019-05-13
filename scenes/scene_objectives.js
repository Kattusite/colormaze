// This file is just a looong list of the objectives' definitions and
// their positions in the scene.

var SCENE_OBJECTIVES = {
  // Testing ones (copy paste em)
  "pulse": {
    position: new THREE.Vector3(200,-600, PLAYER_Z),
    params: {
      name: "heartbeat",
      color: 0xa08080,
      animate: function() {
        let factor = 1 + 0.2 * Math.sin(time / 500);
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
    }
  },
  "gray": {
    position: new THREE.Vector3(-500,-600, PLAYER_Z),
    params: {
      name: "grayscale",
      color: 0x808080,
    }
  },
  "green": {
    position: new THREE.Vector3(1300,1000, PLAYER_Z),
    params: {
      name: "green",
      color: 0x7aea52,
    }
  },
  "bit2": {
    position: new THREE.Vector3(-300,-600, PLAYER_Z),
    params: {
      name: "2-bit",
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
    position: new THREE.Vector3(1700, 1000, PLAYER_Z),
    params: {
      color: 0x52b5ea,
    }
  },
  "bit4": {
    position: new THREE.Vector3(-100,-600, PLAYER_Z),
    params: {
      name: "4-bit",
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
    position: new THREE.Vector3(900, 1000, PLAYER_Z),
    params: {
      color: 0xea5254,
    }
  },
  "bit8": {
    position: new THREE.Vector3(100,-600, PLAYER_Z),
    params: {
      name: "8-bit",
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
    position: new THREE.Vector3(1100,750, PLAYER_Z),
    params: {
      name: "cool particles",
      color: 0x808080,
      init: function(self) {
        // let particles = new THREE.GPUParticleSystem({maxParticles: 20000});
        // self.mesh.add(particles);
      },
      onUnlock: function() {
        options.lifetime = 4;
      }
    }
  },

  // Actual game ones, in new positions
  "pulse": {
    position: new THREE.Vector3(0, 550, PLAYER_Z),
    params: {
      name: "heartbeat",
      color: 0xa08080,
      animate: function() {
        let factor = 1 + 0.2 * Math.abs(Math.sin(time / 500));
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
    }
  },
  "sound": { //does nothing yet
    position: new THREE.Vector3(750, 550, PLAYER_Z),
    params: {
      name: "sound",
      color: 0x808080,
      animate: function() {
        let factor = 1 + 0.2 * Math.sin(time / 500);
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
      onUnlock: function() {
        sound.play();
      }
    }
  },
  "3d": { //does nothing yet
    position: new THREE.Vector3(1000, -300, PLAYER_Z),
    params: {
      name: "dimensional",
      color: 0x808080,
      animate: function() {
        let factor = 1 + 0.2 * Math.sin(time / 500);
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
      onUnlock: shiftCamera,
    }
  },
  "red": {
    position: new THREE.Vector3(900, 1000, PLAYER_Z),
    params: {
      color: 0xea5254,
    }
  },
  "green": {
    position: new THREE.Vector3(1300,1000, PLAYER_Z),
    params: {
      color: 0x7aea52,
    }
  },
  "blue": {
    position: new THREE.Vector3(1700, 1000, PLAYER_Z),
    params: {
      color: 0x52b5ea,
    }
  },
  "gray": { //opens door
    position: new THREE.Vector3(2100, 1200, PLAYER_Z),
    params: {
      color: 0x808080,
    }
  },
  "coolParticles": {
    position: new THREE.Vector3(1100,750, PLAYER_Z),
    params: {
      color: 0x808080,
      init: function(self) {
        // let particles = new THREE.GPUParticleSystem({maxParticles: 20000});
        // self.mesh.add(particles);
      },
      onUnlock: function() {
        options.lifetime = 4;
      }
    }
  },
  "bit2": {
    position: new THREE.Vector3(1500,750, PLAYER_Z),
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
  "bit4": {
    position: new THREE.Vector3(1300,1200, PLAYER_Z),
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
  "bit8": {
    position: new THREE.Vector3(900,1200, PLAYER_Z),
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
  "temp": { //does nothing yet
    position: new THREE.Vector3(1800, 1200, PLAYER_Z),
    params: {
      color: 0x808080,
      animate: function() {
        let factor = 1 + 0.2 * Math.sin(time / 500);
        this.mesh.scale.set(1,1,1).multiplyScalar(factor);
      },
    }
  },
};
