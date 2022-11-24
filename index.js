const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

// Canvas dimensions
context.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './img/background.png'
})

// Player 1
const player = new Fighter({
    position: {
        x: 0,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'red',
    offset: {
        x: 0,
        y: 0
    }
});

// Player 2
const enemy = new Fighter({
    position: {
        x: 500,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    offset: {
        x: -50,
        y: 0
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

// Determines if a player's attack box has collided with the other player
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + enemy.height
    )
}

function determineWinner({player, enemy, timerId}) {
    clearTimeout(timerId)
    if (player.health === enemy.health) {
        document.getElementById("gameOver").innerHTML = "Tie";
    } else if (player.health > enemy.health) {
        document.getElementById("gameOver").innerHTML = "Player 1 Wins";
    } else if (player.health < enemy.health) {
        document.getElementById("gameOver").innerHTML = "Player 2 Wins";
    }
    document.getElementById("gameOver").style.display = "flex";
}

let timer = 10;
let timerId;
function decreaseTimer() {
    timerId = setTimeout(decreaseTimer, 1000);
    if (timer > 0) {
        timer--;
        document.getElementById("timer").innerHTML = timer;
    }
    if (timer === 0) {
        determineWinner({player, enemy, timerId});
    }
}

decreaseTimer();

// Loops canvas frames for animation
function animate() {
    window.requestAnimationFrame(animate);
    context.fillStyle = 'black'
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    background.update();
    player.update();
    enemy.update();

    // Updates movement direction of player
    player.velocity.x = 0;
    enemy.velocity.x = 0;

    // Player 1 movement
    if (keys.a.pressed && player.lastKey == 'a') {
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey == 'd') {
        player.velocity.x = 5;
    }

    // Player 2 movement
    if (keys.ArrowLeft.pressed && enemy.lastKey == 'ArrowLeft') {
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey == 'ArrowRight') {
        enemy.velocity.x = 5;
    }

    // Detect if Player 1 has been hit
    if (rectangularCollision({rectangle1: player, rectangle2: enemy}) && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.getElementById("enemyHealthBar").style.width = enemy.health + "%";
    }

    // Detect if Player 2 has been hit
    if (rectangularCollision({rectangle1: enemy, rectangle2: player}) && enemy.isAttacking) {
        enemy.isAttacking = false;
        player.health -= 20;
        document.getElementById("playerHealthBar").style.width = player.health + "%";
    } 

    // Ends game if either player has no health
    if (player.health <= 0 || enemy.health <= 0) {
        determineWinner({player, enemy, timerId})
    }
}

animate();

// Event listener for when keys are hit
window.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Player 1 Controls
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
            player.attack()
            break

        // Player 2 Controls
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
            enemy.attack()
            break;
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