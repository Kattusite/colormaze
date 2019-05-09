
/******************************************************************************/
/**                      Entities                                            **/
/**                                                                          **/
/******************************************************************************/
// Entities are expected to implement .animate() and .isAlive()


/******************************************************************************/
/**                      Player                                              **/
/**                                                                          **/
/******************************************************************************/


function Player() {
  this.origColor = 0xFFFFFF;
  this.geometry = new THREE.CubeGeometry(50,50,50);
  this.material = new THREE.MeshLambertMaterial({color: this.origColor});
  this.mesh = new THREE.Mesh(this.geometry, this.material);
  this.mesh.position.add(new THREE.Vector3(0,0,-1000));

  this.position = this.mesh.position;

  // How quickly does the player move?
  this.speed = 10;

  //

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
    if (action.type === MOVE) {
      let motion = action.vector.clone().multiplyScalar(this.speed);
      this.mesh.position.add(motion);

      // If player strays out of central bounding box, chase them with camera
      if (!boundingBox.containsPoint(this.mesh.position)) {
        objectives["objPulse"] = true;
        camera2d.position.add(motion);
        camera3d.position.add(motion);
      }
    }
  }

  // Add the pulsate/heartbeat effect to the player's mesh.
  if (objectives["objPulse"]) {
    let scale = Math.max(1, 1.075 * Math.sin(time / 175));
    this.mesh.scale.set(scale, scale, scale);
  }

  this.position = this.mesh.position;
}

// Hit the player for dmg points of damage
Player.prototype.hitFor = function(dmg) {
  this.health -= dmg;
  if (this.health < 0) this.health = 0;

  // TODO: Quicken pulsing as health lowers

  // TODO: Darken color as health lowers
  let healthPercent = this.health / this.maxHealth;
  let newColor = new THREE.Color(this.origColor).offsetHSL(0,0,-(1-healthPercent));
  this.material.color.copy(newColor);
  this.material.trueColor.copy(newColor);
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

  this.firingDelay = 1500; // minimum time between shots
  this.randDelay = 1000;   // max random extra time between shots
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
  this.speed = 8;                                 // speed to scale velocity by
  this.velocity.multiplyScalar(this.speed);       // actual velocity vector

  this.damage = 10; // how much damage is inflicted on hit

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

  // Check for intersection with player
  let playerBox = new THREE.Box3().setFromObject(player.mesh);
  let meBox = new THREE.Box3().setFromObject(this.mesh);

  if (playerBox.intersectsBox(meBox)) {
    // console.log("hit player");
    player.hitFor(this.damage);
    this.dead = true;
  }
}

Projectile.prototype.isDead = function() {
  if (time > this.despawnTime) this.dead = true;
  return this.dead;
}
