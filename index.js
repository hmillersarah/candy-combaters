const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 1024;
canvas.height = 576;
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// Creates a list of all music to be used in game
const music = {
  fightingScreenSound: new Howl({
     src: [
        "./sound/fightingScreenSound.mp3"
     ],
     loop: true
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
        x: 100,
        y: 0
    },
    // Starting movement speed
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    // Ignore padding of sprite images
    offset: {
        x: 215,
        y: 157
    },
    // All character animations
    sprites: {
      idle: {
        imageSrc: './img/samuraiMack/Idle.png',
        framesMax: 8,
        },
      run: {
        imageSrc: './img/samuraiMack/Run.png',
        framesMax: 8,
      },
      jump: {
        imageSrc: './img/samuraiMack/Jump.png',
        framesMax: 2,
      },
      fall: {
        imageSrc: './img/samuraiMack/Fall.png',
        framesMax: 2,
      },
      attack1: {
        imageSrc: './img/samuraiMack/Attack1.png',
        framesMax: 6,
      },
      takeHit: {
        imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
        framesMax: 4,
      },
      death: {
        imageSrc: './img/samuraiMack/Death.png',
        framesMax: 6,
      },
    },
    // Attack detection box
    attackBox: {
      offset: {
        x: 100,
        y: 50
      },
      width: 160,
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
  imageSrc: './img/kenji/Idle.png',
  framesMax: 4,
  scale: 2.5,
  // Ignore padding of sprite images
  offset: {
    x: 215,
    y: 167
  },
  // All character animations
  sprites: {
    idle: {
      imageSrc: './img/kenji/Idle.png',
      framesMax: 4
    },
    run: {
      imageSrc: './img/kenji/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/kenji/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/kenji/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/kenji/Take hit.png',
      framesMax: 3
    },
    death: {
      imageSrc: './img/kenji/Death.png',
      framesMax: 7
    }
  },
  // Attack detection box
  attackBox: {
    offset: {
      x: -180,
      y: 50
    },
    width: 170,
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
    
    c.strokeStyle = '#fff'
    c.lineWidth = 4;
    
    // Play Again Button
    c.fillStyle = '#f15b98';
    c.fillRect(restartRect.x, restartRect.y, restartRect.w, restartRect.h);
    c.strokeRect(restartRect.x, restartRect.y, restartRect.w, restartRect.h);
    c.fillStyle = "#fff";
    c.fillText('PLAY AGAIN', canvas.width / 2.02, canvas.height / 1.8);

  }
}



// RESTART GAME
// _______________

// Check if play again button has been clicked
function restartGame(e) {
  // Get current mouse position
  var p = getMousePos(e);

  if (
    p.x >= restartRect.x && p.x <= restartRect.x + restartRect.w &&
    p.y >= restartRect.y && p.y <= restartRect.y + restartRect.h
  ) {
    erase();
    menu();
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
        keys.d.pressed = true;
        player.lastKey = 'd';
        break;
      case 'a':
        keys.a.pressed = true;
        player.lastKey = 'a';
        break;
      case 'w':
        player.velocity.y = -15;
        break;
      case 's':
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    // Player 2 Controls
    switch(event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true;
        enemy.lastKey = 'ArrowRight';
        break;
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true;
        enemy.lastKey = 'ArrowLeft';
        break;
      case 'ArrowUp':
        enemy.velocity.y = -15;
        break;
      case 'ArrowDown':
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
  canvas.addEventListener('click', checkStart, false);
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



