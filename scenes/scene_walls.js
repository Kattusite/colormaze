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
  ]
};
