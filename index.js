const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024;
canvas.height = 576;

// // Canvas dimensions
c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// Background
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/pixelBackground.jpg',
    scale: 3.25
});

// Player 1
const player = new Fighter({
    position: {
        x: 100,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/samuraiMack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
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
     attackBox: {
        offset: {
          x: 100,
          y: 50
        },
        width: 160,
        height: 50
    }
});

// Player 2
const enemy = new Fighter({
    position: {
      x: 850,
      y: 100
    },
    velocity: {
      x: 0,
      y: 0
    },
    color: 'blue',
    offset: {
      x: -50,
      y: 0
    },
    imageSrc: './img/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
      x: 215,
      y: 167
    },
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
    attackBox: {
      offset: {
        x: -180,
        y: 50
      },
      width: 170,
      height: 50
    }
})

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

decreaseTimer();

// Loops canvas frames for animation
function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)

    background.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    
    player.update()
    enemy.update()
  
    // Updates movement direction of player
    player.velocity.x = 0
    enemy.velocity.x = 0
  
    // Player 1 movement
  
    if (keys.a.pressed && player.lastKey === 'a') {
      player.velocity.x = -5
      player.switchSprite('run')
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
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
      enemy.velocity.x = -5
      enemy.switchSprite('run')
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
  
    // Player 1 Collision Detection & Enemy Takes Hit
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: enemy
      }) &&
      player.isAttacking &&
      player.framesCurrent === 4
    ) {
      enemy.takeHit()
      player.isAttacking = false
  
      gsap.to('#enemyHealth', {
        width: enemy.health + '%'
      })
    }
  
    // If Player 1 misses
    if (player.isAttacking && player.framesCurrent === 4) {
      player.isAttacking = false
    }
  
    // Player 2 Collision Detection & Player 1 Takes Hit
    if (
      rectangularCollision({
        rectangle1: enemy,
        rectangle2: player
      }) &&
      enemy.isAttacking &&
      enemy.framesCurrent === 2
    ) {
      player.takeHit()
      enemy.isAttacking = false
  
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
    }
  }
  
  animate()

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


