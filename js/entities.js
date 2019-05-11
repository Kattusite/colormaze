
/******************************************************************************/
/**                      Entities                                            **/
/**                                                                          **/
/******************************************************************************/
// Entities are expected to implement .animate() and .isAlive()

// Returns the THREE.Box3() representing the bounding box around an entity
function getHitbox() {
  let hitbox = new THREE.Box3().setFromObject(this.mesh);
  return hitbox;
}

// Returns true if an entity is currently intersecting any wall
// WARNING: Slow! Has to check every wall -- we should optimize if not fast enough
// If a wall is intersected, sets this.wallSpeed to the wall's speed
// Else, sets it to 1
// Sorry in advance. This function is a mess
function intersectsWall() {
  let hitbox = this.getHitbox();

  // Check whether this intersects an entire wall group (or possibly a single wall)
  // Return an array such that:
  // ret[0] = true if intersected a wall, false otherwise
  // ret[1] = wall speed of the intersected wall (or 1 if no intersection)
  let NO_INTERSECTION = [false, 1];
  let intersectsWallGroup = function(group) {
    // Check if intersects a single wall
    if (group.type === "Wall") {
      // Here group is a misnomer, group is actually a single wall
      if (group.intersectsHitbox(hitbox)) {
        // If this wall is unlockable (i.e. a door), check if it's unlocked
        if (group.unlockedBy) {
          // If unlocked, allow through at wall's speed
          if (objectives[group.unlockedBy]) return [true, group.speed];
          // Otherwise, door is locked, do not allow through at all
          else                              return [true, 0];
        }
        // For walls that aren't unlockable just return their standard speed
        else return [true, group.speed];
      }
      return NO_INTERSECTION;
    }
    // Check if intersects group of walls
    else if (group.type === "Group") {
      // If this is outside the entire zone's bounding box, it must be outside
      // wall bounding boxes too
      let boundingBox = group.boundingBox;
      if (!boundingBox.intersectsBox(hitbox)) return NO_INTERSECTION;

      // If inside the bounding box, check all the children in zone
      let minSpeed = 9e99; // min speed of all intersected walls
      for (let childMesh of group.children) {
        let wall = childMesh.parentDef;
        let ret = intersectsWallGroup(wall);
        // if intersectsWallGroup(wall) return true;
        // If we intersected a wall:
        if (ret[0]) {
          // Check if this wall's passage speed is slower than current. If so, store it
          if (ret[1] < minSpeed) minSpeed = ret[1];

          // If we get to 0 speed, we can't pass -- return
          if (minSpeed == 0) return [true, minSpeed];
          // return ret;
        }
      }
      // If minSpeed unchanged, no intersections took place!
      if (minSpeed == 9e99) return NO_INTERSECTION;
      else return [true, minSpeed];
      // return [false, 1];
    }
    else if (group.type === "Floor") {
      return NO_INTERSECTION;
    }
    else {
      console.error("No type defined in wall group")
    }
  }

  // Iterate over all groups of walls.
  for (let wallGroup of walls) {

    let ret = intersectsWallGroup(wallGroup);
    if (ret[0]) {
      this.wallSpeed = ret[1];
      return true;
    }

    /*
    if (intersectsWallGroup(wallGroup)) {
      this.wallSpeed = wallGroup.speed;
      return true;
    }
    */
  }

  // No intersection found with any wall in any zone
  this.wallSpeed = 1;
  return false;
}

/******************************************************************************/
/**                      Player                                              **/
/**                                                                          **/
/******************************************************************************/


function Player() {
  this.origColor = 0xFFFFFF;
  this.geometry = new THREE.CubeGeometry(PLAYER_SIZE,PLAYER_SIZE, PLAYER_SIZE);
  this.material = new THREE.MeshLambertMaterial({color: this.origColor});
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.add(new THREE.Vector3(0,0,PLAYER_Z));

  this.position = this.mesh.position;
  this.canMove = true;

  // How quickly does the player move?
  this.speed = 10;  // 5 for gameplay, 10 for testing

  // pulse rate, starts at 1
  this.pulseRate = 1;

  // How much health does the player have?
  this.maxHealth = 100;
  this.health = this.maxHealth;
}

Player.prototype.animate = function() {
  let boundingBox = getScreenBoundingBox();

  // Trigger all actions for keys that are pressed down
  for (let key in keysPressed) {
    if (!KEY_BINDINGS[key]) continue;
    let action = KEY_BINDINGS[key];

    // If a move action is active, move the player in the relevant direction.
    if (action.type === MOVE && player.canMove) {
      let motion = action.vector.clone().multiplyScalar(this.speed);
      let prevPosition = this.mesh.position.clone();
      this.mesh.position.add(motion);

      // If player would have hit a wall, revert the motion and continue
      if (this.intersectsWall()) {
        // NOTE: Instead of subtracting whole motion we can subtract
        // some fraction of it to give the effect of slowing down or
        // speeding up the cube
        motion.multiplyScalar(1 - this.wallSpeed);
        this.mesh.position.sub(motion);
        // continue;
      }

      // If player strays out of central bounding box, chase them with camera
      if (!boundingBox.containsPoint(this.mesh.position)) {
        // However much the player moved, the camera should move also
        let actualMovement = this.mesh.position.clone().sub(prevPosition);
        camera2d.position.add(actualMovement);
        camera3d.position.add(actualMovement);
        controls.update();
      }
    }
  }

  // Add the pulsate/heartbeat effect to the player's mesh.
  if (objectives["pulse"]) {
    let scale = Math.max(1, 1.075 * Math.sin(time / 175 * this.pulseRate));
    this.mesh.scale.set(scale, scale, scale);
  }

  this.position = this.mesh.position;
}

Player.prototype.getHitbox = getHitbox;
Player.prototype.intersectsWall = intersectsWall;

// Hit the player for dmg points of damage
Player.prototype.hitFor = function(dmg) {
  this.health -= dmg;
  if (this.health <= 0) {
    this.health = 0;
  }

  // TODO: Darken color as health lowers
  let healthPercent = this.health / this.maxHealth;
  let newColor = new THREE.Color(this.origColor).offsetHSL(0,0,-(1-healthPercent));
  this.material.color.copy(newColor);
  this.material.trueColor.copy(newColor);

  // TODO: Quicken pulsing as health lowers
  this.pulseRate = 1 + 3 * (1 - healthPercent);
  if (this.health <= 0) {
    this.pulseRate = 0;
  }
}

// Heal the player for hp points of health
Player.prototype.healFor = function(hp) {
  this.hitFor(-hp);
}

Player.prototype.isDead = function() {
  return (this.health <= 0);
}


/******************************************************************************/
/**                      SHOOTER                                             **/
/**                                                                          **/
/******************************************************************************/


function Shooter(x, y, z) {
  this.geometry = new THREE.TetrahedronGeometry(25);
  this.material = new THREE.MeshLambertMaterial({color: 0xbb4444});
  this.mesh     = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.add(new THREE.Vector3(x,y,z));

  this.position = this.mesh.position;

  this.firingDelay = 1000; // minimum time between shots
  this.randDelay = 200;   // max random extra time between shots
  this.prevShot = undefined;   // time in ms of last shot
  this.nextShot = time + this.firingDelay + this.randDelay;  // time in ms of next shot

  this.target = undefined;
}

// Function to animate this shooter every frame
Shooter.prototype.animate = function() {
  this.mesh.rotation.x += 0.01;

  // If we have passed our time to shoot, fire a shot and update times
  // TODO: Only fire if the target is nearby
  if (time > this.nextShot) {
    this.fireAt(player.position);
    this.prevShot = time;
    this.nextShot = time + this.firingDelay;
    this.nextShot += Math.floor(Math.random() * this.randDelay);
  }

  // TODO: Change colors based on time to fire

  this.position = this.mesh.position;
}

Shooter.prototype.getHitbox = getHitbox;
Shooter.prototype.intersectsWall = intersectsWall;


// Fire a projectile at a target location
Shooter.prototype.fireAt = function(target) {
  let dir = target.clone().sub(this.mesh.position);
  let proj = new Projectile(this.mesh.position.clone(), dir);
  scene.add(proj.mesh);
  entities.push(proj);
}

Shooter.prototype.isDead = function() {
  return false;
}

/******************************************************************************/
/**                      PROJECTILE                                          **/
/**                                                                          **/
/******************************************************************************/
function Projectile(position, velocity) {
  // Define the shape of the projectile
  let a = 0.4; // inner size of star
  let b = 1.0;  // outer size of star
  let scale = 10;
  this.shape = new THREE.Shape();
  this.shape.moveTo(a,0);
  this.shape.lineTo(b,b);
  this.shape.lineTo(0,a);
  this.shape.lineTo(-b,b);
  this.shape.lineTo(-a,0);
  this.shape.lineTo(-b,-b);
  this.shape.lineTo(0,-a);
  this.shape.lineTo(b,-b);
  this.shape.lineTo(a,0);

  // Define the mesh of the projectile
  this.geometry = new THREE.ShapeGeometry(this.shape);
  this.material = new THREE.MeshLambertMaterial({color: 0x662222});
  this.mesh     = new THREE.Mesh(this.geometry, this.material)
  this.mesh.position.copy(position);          // current position
  this.mesh.scale.multiplyScalar(scale);

  // Define velocity
  this.velocity = velocity.clone().normalize();   // normalized direction of travel
  this.speed = 12;                                 // speed to scale velocity by
  this.velocity.multiplyScalar(this.speed);       // actual velocity vector

  this.damage = 20; // how much damage is inflicted on hit

  // Define travel time and despawn time
  this.spawnTime = time;
  this.timeToLive = 4500;
  this.despawnTime = this.spawnTime + this.timeToLive;

  // Has the projectile struck an object or expired?
  this.dead = false;
}

// Function to animate the projectile every frame.
Projectile.prototype.animate = function() {
  this.mesh.position.add(this.velocity);
  this.mesh.rotation.z += 0.1;

  if (this.getHitbox().intersectsBox(player.getHitbox())) {
    // console.log("hit player");
    player.hitFor(this.damage);
    this.dead = true;
  }

  // If projectile hits a wall, kill it
  if (this.intersectsWall()) {
    this.dead = true;
  }
}

Projectile.prototype.isDead = function() {
  if (time > this.despawnTime) this.dead = true;
  return this.dead;
}

Projectile.prototype.getHitbox = getHitbox;
Projectile.prototype.intersectsWall = intersectsWall;

/******************************************************************************/
/**                      OBJECTIVE                                           **/
/**                                                                          **/
/******************************************************************************/

// Allowed params:
/*
params = {
  color: 0x808080,
  radius: 15,
  tube: 5,
  tubeSegments: 100,
  radialSegments: 16,
  init:  function() {},    // extra stuff to do in initialize step
  animate: function () {}, // extra stuff to do in animate step.
}
*/

const OBJECTIVE_DEFAULTS = {
  color: 0xFFFFFF,
  radius: 15,
  tube: 5,
  tubeSegments: 100,
  radialSegments: 16,
  init: undefined,
  animate: undefined,
  onUnlock: undefined,
}


function Objective(position, unlock, params) {
  Core.setDefaultProperties(params, OBJECTIVE_DEFAULTS);

  // Define the mesh of the projectile
  this.geometry = new THREE.TorusKnotGeometry(params.radius, params.tube, params.tubeSegments, params.radialSegments);
  this.material = new THREE.MeshPhongMaterial({color: params.color});
  this.material.showTrueColor = true;

  this.mesh = new THREE.Mesh(this.geometry, this.material)
  this.mesh.position.copy(position); // current position

  // Has the objective been collected
  this.unlock = unlock;
  this.dead = false;

  // If there are any other things specified to to in params, do them
  if (params.init) params.init(this);
  if (params.animate) this.extraAnimation = params.animate;
  if (params.onUnlock) this.onUnlock = params.onUnlock;
}

// Function to animate the projectile every frame.
Objective.prototype.animate = function() {
  this.mesh.rotation.z += 0.1;

  // When collected by a player
  if (this.getHitbox().intersectsBox(player.getHitbox())) {
    objectives[this.unlock] = true;

    // Update anything that might need to get updated when objectives change
    updateColors();
    if (this.onUnlock) {
      this.onUnlock();
    }

    this.dead = true;
  }

  // If there is anything else specified to do in params, do it now
  if (this.extraAnimation) this.extraAnimation();
}

Objective.prototype.isDead = function() {
  return this.dead;
}

Objective.prototype.getHitbox = getHitbox;
Objective.prototype.intersectsWall = intersectsWall;
