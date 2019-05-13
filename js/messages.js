// File for dealing with onscreen messages

function showMessage(str, duration) {
  if (!duration) duration = 3000;
  let targetOpacity = 0.75;

  let fadeTime = 750;
  let $msg = $(".msg.center");
  $msg.css("z-index", 99);

  let keepDisplaying = function() {
    $msg.animate(
      {
        "opacity": targetOpacity
      },
      duration,
      stopDisplaying
    )
  }

  let stopDisplaying = function() {
    $msg.animate(
      {
        "opacity": 0.0
      },
      fadeTime,
      undefined
    )
  }

  $msg.animate(
    {
      "opacity": targetOpacity
    },
    fadeTime,
    keepDisplaying
  )

  $msg.text(str);
}

function startGame() {

  let callback = function() {
    // Move the curtain behind canvas
    $(".curtain").css("z-index", -99);

    // Let the player move again
    player.canMove = true;
  }

  // Fade the curtain to no opacity, and move it to a lower z-index;
  $(".curtain").animate(
    {
      "opacity": 0.0
    },
    2500,
    callback
  );

}
