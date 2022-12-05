const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// Creates a list of all special effects to be used in game
const sfx = {
  run: new Howl({
    src: "./sound/sfx/run.mp3",
    volume: 5
  }),
  jump: new Howl({
    src: "./sound/sfx/Jump.mp3",
  }),
  attack: new Howl ({
    src: "./sound/sfx/Attack.wav",
  }),
  death: new Howl ({
    src: "./sound/sfx/Death.mp3",
    volume: 5,
  })
}

// Creates a list of all music to be used in game
const music = {
  startScreenSound: new Howl ({
    src: "./sound/music/Start Screen.mp3",
  }),
  fightingScreenSound: new Howl({
     src: "./sound/music/Fight Screen.mp3",
     volume: 0.6
  })
}

// BACKGROUND
// _______________

const background = new Sprite({
  position: {
      x: 0,
      y: 0
  },
  imageSrc: './img/pixelBackground.jpg',
  scale: 3.25
});

// PLAYER 1
// _______________

const player = new Fighter({
    // Starting position
    position: {
        x: 300,
        y: 0
    },
    // Starting movement speed
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/player1/Idle.png',
    framesMax: 6,
    scale: 2.0,
    // Ignore padding of sprite images
    offset: {
        x: 215,
        y: -30
    },
    // All character animations
    sprites: {
      idle: {
          imageSrc: './img/player1/Idle.png',
          framesMax: 6,
      },
      run: {
          imageSrc: './img/player1/Run.png',
          framesMax: 6,
      },
      jump: {
          imageSrc: './img/player1/Jump.png',
          framesMax: 3,
      },
      fall: {
          imageSrc: './img/player1/Fall.png',
          framesMax: 2,
      },
      attack1: {
          imageSrc: './img/player1/Attack.png',
          framesMax: 6,
      },
      takeHit: {
          imageSrc: './img/player1/Take Hit.png',
          framesMax: 5,
      },
      death: {
          imageSrc: './img/player1/Death.png',
          framesMax: 7,
      },
   },
    // Attack detection box
    attackBox: {
      offset: {
        x: -100,
        y: 50
      },
      width: 100,
      height: 50
    }
});

// PLAYER 2
// _______________

const enemy = new Fighter({
  // Starting position
  position: {
    x: 850,
    y: 100
  },
  // Starting movement speed
  velocity: {
    x: 0,
    y: 0
  },
  imageSrc: './img/player2/Idle.png',
  framesMax: 8,
  scale: 2.5,
  // Ignore padding of sprite images
  offset: {
    x: 215,
    y: 110
  },
  // All character animations
  sprites: {
    idle: {
      imageSrc: './img/player2/Idle.png',
      framesMax: 8
    },
    run: {
      imageSrc: './img/player2/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/player2/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/player2/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/player2/Attack.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/player2/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/player2/Death.png',
      framesMax: 6
    }
  },
  // Attack detection box
  attackBox: {
    offset: {
      x: 50,
      y: 50
    },
    width: 100,
    height: 50
  }
})

// Stores last pressed key
const keys = {
  a: {
      pressed: false
  },
  d: {
      pressed: false
  },
  ArrowRight: {
      pressed: false
  },
  ArrowLeft: {
      pressed: false
  }
}

// decreaseTimer();

// ANIMATE GAME
// _______________

// Restart Game Button
var restartRect = {
  x: canvas.width / 2.5,
  y: canvas.height / 2,
  w: 200,
  h: 50
}

var hasDied = false;

// Loops canvas frames for animation
function animate() {
  window.requestAnimationFrame(animate);

  // Creates canvas
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)

  // Adds background to canvas
  background.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  
  // Animate player and enemy
  player.update()
  enemy.update()

  // Updates movement direction of player
  player.velocity.x = 0
  enemy.velocity.x = 0

  // Player 1 movement
  // Move left
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  // Move right
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  // Player 1 jumping
  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  // Enemy/Player 2 movement
  // Move left
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  // Move right
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  // Enemy/Player 2 jumping
  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  // Player 1 Collision Detection -> Enemy Takes Hit
  if (
    // Checks for collision
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy
    }) &&
    player.isAttacking &&
    player.framesCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false
    // Decrease enemy health
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  // If Player 1 misses
  if (player.isAttacking && player.framesCurrent === 4) {
    player.isAttacking = false
  }

  // Player 2 Collision Detection -> Player 1 Takes Hit
  if (
    // Checks for collision
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player
    }) &&
    enemy.isAttacking &&
    enemy.framesCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false
    // Decrease player health
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  // If PLayer 2 misses
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false
  }

  // End game if a player's health equals 0
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
    if (!hasDied) {
      sfx.death.play();
      reloadTimer();
      hasDied = true;
    }
  }
}

// EVENT LISTENERS
// _______________

// Event listener for when keys are hit
window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    // Player 1 Controls
    switch (event.key) {
      case 'd':
        if (!sfx.run.playing()) {
          sfx.run.play();
        }
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        if (!sfx.run.playing()) {
          sfx.run.play();
        }
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        sfx.jump.play();
        player.velocity.y = -15;
        break;
      case 's':
        sfx.attack.play();
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    // Player 2 Controls
    switch(event.key) {
      case 'ArrowRight':
        if (!sfx.run.playing()) {
          sfx.run.play();
        }
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        if (!sfx.run.playing()) {
          sfx.run.play();
        }
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        sfx.jump.play();
        enemy.velocity.y = -15;
        break;
      case 'ArrowDown':
        sfx.attack.play();
        enemy.attack();
        break;
    }
  }
})

// Event listener for when keys are released
window.addEventListener('keyup', (event) => {
  // Player 1 Controls
  switch (event.key) {
    case 'd':
      keys.d.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
  }

  // Player 2 Controls
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false;
      break;
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false;
      break;
  }
})

// START SCREEN
// _______________

// Clear canvas
function erase() {
  c.fillStyle = '#f25a97';
  c.fillRect(0, 0, 1024, 576);
}

// Easy, Medium, and Hard Buttons
var easyRect = {
  x: canvas.width / 3.5,
  y: canvas.height / 2,
  w: 100,
  h: 50
}

var mediumRect = {
  x: canvas.width / 2.22,
  y: canvas.height / 2,
  w: 100,
  h: 50
}

var hardRect = {
  x: canvas.width / 1.62,
  y: canvas.height / 2,
  w: 100,
  h: 50
}

// START MENU
// _______________

// Display start menu
function menu() {
  erase();

  music.startScreenSound.play();

  // Title
  c.fillStyle = '#fff';
  c.font = '36px monospace';
  c.textAlign = 'center';
  c.fillText('Candy Combaters', canvas.width / 2, canvas.height / 4);

  // Click Start sub-heading
  c.font = '24px monospace';
  c.fillText('Click to Start', canvas.width / 2, canvas.height / 2.25);
  c.font = '18px monospace';

  // Button border styling
  c.strokeStyle = '#fff'
  c.lineWidth = 4;

  // Difficulty buttons
  // Easy
  c.fillStyle = '#589ccd';
  c.fillRect(easyRect.x, easyRect.y, easyRect.w, easyRect.h);
  c.strokeRect(easyRect.x, easyRect.y, easyRect.w, easyRect.h);
  c.fillStyle = '#fff';
  c.fillText('Easy', canvas.width / 3, canvas.height / 1.8);

  // Medium
  c.fillStyle = '#589ccd';
  c.fillRect(mediumRect.x, mediumRect.y, mediumRect.w, mediumRect.h);
  c.strokeRect(mediumRect.x, mediumRect.y, mediumRect.w, mediumRect.h);
  c.fillStyle = "#fff";
  c.fillText('Medium', canvas.width / 2, canvas.height / 1.8);

  // Hard
  c.fillStyle = '#589ccd';
  c.fillRect(hardRect.x, hardRect.y, hardRect.w, hardRect.h);
  c.strokeRect(hardRect.x, hardRect.y, hardRect.w, hardRect.h);
  c.fillStyle = "#fff";
  c.fillText('Hard', canvas.width / 1.5, canvas.height / 1.8);

  // Instructions
  c.fillStyle = '#fff';
  c.fillText('Instructions', canvas.width / 2, (canvas.height / 4) * 2.7);
  c.fillText('Player 1: Use A W D letter keys to move and S to attack', canvas.width / 2, (canvas.height / 4) * 3);
  c.fillText('Player 2: Use arrow keys to move and arrow down to attack', canvas.width / 2, (canvas.height / 4) * 3.2);

  // Start game when difficulty is clicked
  canvas.addEventListener('click', checkStart, true);
}

// Check if difficulty mode has been clicked
function checkStart(e) {
  // Get current mouse position
  var p = getMousePos(e);

  // Easy button clicked
  if (
    p.x >= easyRect.x && p.x <= easyRect.x + easyRect.w &&
    p.y >= easyRect.y && p.y <= easyRect.y + easyRect.h
  ) {
    animate();
    music.startScreenSound.stop();
    music.fightingScreenSound.play();
  // Medium button clicked
  } else if (
    p.x >= mediumRect.x && p.x <= mediumRect.x + mediumRect.w &&
    p.y >= mediumRect.y && p.y <= mediumRect.y + mediumRect.h
  ) {
    animate();
    // Add timer
    setTime(30);
    decreaseTimer();
    music.startScreenSound.stop();
    music.fightingScreenSound.play();
  // Hard button clicked
  } else if (
    p.x >= hardRect.x && p.x <= hardRect.x + hardRect.w &&
    p.y >= hardRect.y && p.y <= hardRect.y + hardRect.h
  ) {
    animate();
    // Reduce timer to 20 seconds
    setTime(20);
    decreaseTimer();
    music.startScreenSound.stop();
    music.fightingScreenSound.play();
  }
  // If buttons are not clicked, return to menu
  else {
    menu();
  }
}

// Return mouse position
function getMousePos(e) {
  var r = canvas.getBoundingClientRect();
  return {
      x: e.clientX - r.left,
      y: e.clientY - r.top
  };
}

// Initially call menu
menu();



