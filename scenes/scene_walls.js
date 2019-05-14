// This file is just a looong list of the walls' definitions and
// their positions in the scene.

// Walls are grouped by the region they are part of for convenience
// Start is represented as an [x,y] array instead of a Vector3.
// z will be assumed to be FLOOR_Z.
// This is just to make it easier to type in the walls

// Acceptable params here are a restricted subset of wall params, plus some extra
// The term "cell" is used to determine the graph paper style grid square
// containing a given point. The dimensions of the cell are thickness x thickness
/*
  //
  start: start "cell", given as [x,y]
  end:   end "cell", given as [x,y]
  // The space between start and end cells is filled, the start/end cells themselves are vacant
  // if start is not defined, the end of the previous wall is used
  color: 0xffffff
  // TODO make it so if color is not defined it is a function of prev color
  // e.g. prevColor.hue + 0.05
  cell: provided for "peg" walls that occupy only a single cell, whose coords
        are given as an array [x,y]
  cycle: provided for last wall in a chain to indicate a peg should be inserted
         between last wall and first wall.
  skip: provided to indicate a chain should be continued, but this
                particular wall segment should be skipped.
      (typically because we will manually replace it with a different, special wall)
  nofloor: provided to indicate this should not be considered for floor building

  flat: if true a flat wall that you can pass over
  invisible: if true, ive wall a shadow material
*/

var SCENE_WALLS = {
  "intro" : [
    {
      start: [  +100,  -100],
      end:   [  -100,  -100],
      color: 0x4faf92,
    },
    {
      end:   [  -100,  +650],
      color: 0x4f68af,
    },

    {
      end:   [  +800,  +650],
      color: 0x4f68af,
    },

    {
      end:   [  +800, +1100],
      color: 0x4f8caf,
    },
    {
      end:   [ +1000, +1100],
      color: 0x252191,
    },
    {
      end:   [  1000, +1300],
      color: 0x252191,
    },
    {
      end:   [  1200,  1300],
      color: 0x252191,
    },
    // Now I'm using the condensed notation (missing starts are assumed to be previous end)
    {
      end:   [  1200,  1100],
      color: 0x7733af,
      flat: true,
      unlockedBy: "perspective",
      speed: 0.1,
    },
    {
      end:   [  1400,  1100],
      color: 0x252191,
    },
    {
      end:   [  1400,  1300],
    },
    {
      end:   [  1600,  1300],
    },
    {
      end:   [  1600,  1100],
    },
    {
      end:   [  2000,  1100],
    },
    {
      end:   [  2000,  1300],
    },
    {
      end:   [  2200,  1300],
    },
    {
      end:   [  2200,  900],
    },
    {
      end:   [  1800,  900],
    },
    {
      end:   [  1800,  700],
    },
    {
      end:   [  1600,  700],
    },
    {
      end:   [  1600,  900],
    },
    {
      end:   [  1400,  900],
    },
    {
      end:   [  1400,  700],
    },
    {
      end:   [  1200,  700],
    },
    {
      end:   [  1200,  900],
    },
    {
      end:   [  1000,  900],
    },
    {
      end:   [  1000, -200],
    },
    {
      end:   [  1300, -200],
    },
    {
      // the door
      end:   [  1300, -400],
      color: 0xffffff,
      speed: 0.1,
      unlockedBy: "gray"
    },
    {
      end:   [  800, -400],
      color: 0x252191,
    },
    {
      end:   [  800, 450],
      color: 0x252191,
    },
    {
      end:   [  +100,  +450],
      color: 0x924faf,
    },

    {
      // cycle true indicates this wall is adjacent to the start wall
      // and we should add a peg between them.
      // cycle should be only set on the last wall in a chain
      end:   [  +100,  -100],
      color: 0x974faf,
      cycle: true
    },
  ],
  "stage2" : [
    {
      start: [ 1300, -200],
      end:   [ 1800, -200],
      color: 0xc14997,
    },
    {
      end: [1800, 100],
      color: 0x2d7f78,
    },
    {
      end: [1300, 100]
    },
    {
      end: [1300, 300]
    },
    {
      end: [2300, 300]
    },
    {
      end: [2300, 400],
      color: 0xf67f2d,
    },
    {
      end: [1300, 400],
    },
    {
      end: [1300, 600],
    },
    {
      end: [2750, 600],
    },
    {
      end: [2750, 400],
    },
    {
      end: [2500, 400],
    },
    {
      end: [2500, 300],
    },
    {
      end: [2700, 300],
    },
    {
      end: [2700, 100],
    },
    {
      end: [2500, 100],
    },
    {
      end: [2000, 100],
    },
    {
      end: [2000, -200],
    },
    {
      end: [2200, -200],
      color: 0xd66a46,
    },
    {
      end: [2200, 0],
    },
    {
      end: [2700, 0],
    },
    {
      end: [2700, -550],
    },
    {
      end: [2200, -550],
    },
    {
      end: [2200, -400],
    },
    {
      end: [2000, -400],
    },
    {
      end: [2000, -750],
      color: 0x1ab4cc
    },
    {
      // red door
      end: [1800, -750],
      unlockedBy: "red",
      speed: 0.1,
      color: 0xcc3333,
    },
    {
      end: [1050, -750],
      color: 0x53c1bf,
    },
    {
      end: [1050, -550],
    },
    {
      end: [1800, -550],
    },
    {
      end: [1800, -400],
    },
    {
      end: [1300, -400],
      color: 0x611acc,
      cycle: true
    },
    // end of standard walls
    {
      start: [1800, -200],
      end:   [2000, -200],
      color: 0x33cc33,
      unlockedBy: "green",
      speed: 0.1,
      nofloor: true,
    },
    {
      start: [2000, -200],
      end:   [2000, -400],
      color: 0xcccccc,
      unlockedBy: "bit4",
      speed: 0.1,
      nofloor: true,
    },
    {
      start: [2000, -400],
      end:   [1800, -400],
      color: 0x444464,
      unlockedBy: "bit2",
      speed: 0.1,
      nofloor: true,
    },
    {
      // invis wall to block projectiles
      start: [2300, 300],
      end:   [2300, 100],
      visible: false,
      speed: 0.5,
      nofloor: true,
    },
    {
      // invis wall to block projectiles
      start: [1600, 600],
      end:   [1600, 400],
      visible: false,
      speed: 0.5,
      nofloor: true,
    },
    {
      // blue door
      start: [2500, 300],
      end:   [2500, 100],
      unlockedBy: "blue",
      color: 0x3333cc,
      speed: 0.1,
      nofloor: true,
    },
    // The invisible maze for red obj.
    {
      start: [2550, -250],
      end:   [2550, -150],
      visible: false,
      nofloor: true,
    },
    {
      end:   [2350, -150],
      visible: false,
      nofloor: true,
    },
    {
      end:   [2350, -400],
      visible: false,
      nofloor: true,
    },
    {
      end:   [2550, -400],
      visible: false,
      nofloor: true,
    },
  ],
  // special walls, doors, invis walls from stage2
  /* "stage2 extra": [
    {
      start: [1800, -200],
      end:   [2000, -200],
      color: 0x33cc33,
      unlockedBy: "green",
      speed: 0.1,
    }
  ] */
  /* "stage3" : [

  ] */
};
