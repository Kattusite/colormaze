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
      color: 0x252191,
    },
    {
      end:   [  1400,  1100],
      color: 0x252191,
    },
    {
      end:   [  1400,  1300],
      color: 0x252191,
    },
    {
      end:   [  1600,  1300],
      color: 0x252191,
    },
    {
      end:   [  1600,  1100],
      color: 0x252191,
    },
    {
      end:   [  2000,  1100],
      color: 0x252191,
    },
    {
      end:   [  2000,  1300],
      color: 0x252191,
    },
    {
      end:   [  2200,  1300],
      color: 0x252191,
    },
    {
      end:   [  2200,  900],
      color: 0x252191,
    },
    {
      end:   [  1800,  900],
      color: 0x252191,
    },
    {
      end:   [  1800,  700],
      color: 0x252191,
    },
    {
      end:   [  1600,  700],
      color: 0x252191,
    },
    {
      end:   [  1600,  900],
      color: 0x252191,
    },
    {
      end:   [  1400,  900],
      color: 0x252191,
    },
    {
      end:   [  1400,  700],
      color: 0x252191,
    },
    {
      end:   [  1200,  700],
      color: 0x252191,
    },
    {
      end:   [  1200,  900],
      color: 0x252191,
    },
    {
      end:   [  1000,  900],
      color: 0x252191,
    },
    {
      end:   [  1000, -200],
      color: 0x252191,
    },
    {
      end:   [  1300, -200],
      color: 0x252191,
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
  ]
};
