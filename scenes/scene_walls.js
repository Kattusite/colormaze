// This file is just a looong list of the walls' definitions and
// their positions in the scene.

// Walls are grouped by the region they are part of for convenience
// Start is represented as an [x,y] array instead of a Vector3.
// z will be assumed to be FLOOR_Z.
// This is just to make it easier to type in the walls

var SCENE_WALLS = {
  "intro" : [
    {
      start: [  -100,  -100],
      end:   [  +100,  -100],
      color: 0x4faf92,
    },
    {
      start: [  -100,  -100],
      end:   [  -100,  +650],
      color: 0x4f68af,
    },
    {
      start: [  +100,  -100],
      end:   [  +100,  +450],
      color: 0x974faf,
    },
    {
      start: [  -100,  +650],
      end:   [  +800,  +650],
      color: 0x4f68af,
    },
    {
      start: [  +100,  +450],
      end:   [  +800,  +450],
      color: 0x924faf,
    },
    {
      start: [  +800,  +650],
      end:   [  +800, +1100],
      color: 0x4f8caf,
    },
    {
      start: [  +800, +1100],
      end:   [ +1000, +1100],
      color: 0x252191,
    },
    {
      start: [  1000,  1100],
      end:   [  1000, +1300],
      color: 0x252191,
    },
    {
      start: [  1000,  1300],
      end:   [  1200,  1300],
      color: 0x252191,
    },
    // Now I'm using the condensed notation (missing starts are assumed to be previous end)
    {
      start: [  1200,  1300],
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




  ]
};
