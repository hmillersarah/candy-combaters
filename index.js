const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// Canvas dimensions
context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

// Background
const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
});

// Shop (for animation testing, remove for final game)
const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './img/shop.png',
    scale: 2.75,
    framesMax: 6
});

// Player 1
const player = new Fighter({
    position: {
        x: 300,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './img/finalIdle.png',
    framesMax: 8,
    // scale: 0.15,
    scale: 2.5,
    offset: {
        x: 215,
        y: 0
        // x: 215,
        // y: 60
    },
     sprites: {
        idle: {
            // imageSrc: './img/player1/FinalIdleProtag.png',
            imageSrc: './img/finalIdle.png',
            framesMax: 6,
        },
        run: {
            imageSrc: './img/FinalProRun.png',
            framesMax: 6,
        },
        jump: {
            imageSrc: './img/player1/finalProJump.png',
            framesMax: 3,
        },
        fall: {
            imageSrc: './img/player1/finalProFall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/finalProAttack.png',
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
});

// Player 2
const enemy = new Fighter({
    position: {
        x: 800,
        y: 0
    },
    velocity: {
        x: 0,
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
            framesMax: 4,
        },
        run: {
            imageSrc: './img/kenji/Run.png',
            framesMax: 8,
        },
        jump: {
            imageSrc: './img/kenji/Jump.png',
            framesMax: 2,
        },
        fall: {
            imageSrc: './img/kenji/Fall.png',
            framesMax: 2,
        },
        attack1: {
            imageSrc: './img/kenji/Attack1.png',
            framesMax: 4,
        },
        takeHit: {
            imageSrc: './img/kenji/Take hit.png',
            framesMax: 3,
        },
        death: {
            imageSrc: './img/kenji/Death.png',
            framesMax: 7,
        },
     }
});

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

// Loops canvas frames for animation
function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    background.update();
    shop.update();
    player.update();
    enemy.update();

    // Updates movement direction of player
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player 1 movement
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    // Player 1 Jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall');
    }

    // Player 1 Collision Detection & Take Hit
    // player.takeHit()

    // Player 2 movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    // Player 2 Jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall');
    }

    // Player 2 Collision Detection & Take Hit
    // enemy.takeHit()
}

animate();

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
            case ' ':
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