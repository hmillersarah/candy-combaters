// Determines if a player's attack box has collided with the other player
function rectangularCollision({rectangle1, rectangle2}) {
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x 
        && rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width
        && rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y
        && rectangle1.attackBox.position.y <= rectangle2.position.y + enemy.height
    )
}

// Determines the winner after timer runs out or a player's health runs out
function determineWinner({ player, enemy, timerId }) {
    clearTimeout(timerId);
    document.querySelector('#displayText').style.display = 'flex';
    document.querySelector('#reloadText').style.display = 'flex';

    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins';
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
    }
}

// Default game time
let timer = 30;
let timerId;

// Update time based on difficulty
function setTime(time) {
    timer = time;
}

// Decrements the timer by 1 for each second
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#timer').innerHTML = timer;
    }
  
    if (timer === 0) {
        determineWinner({ player, enemy, timerId });
        reloadTimer();
    }
}
  
// Default reload time
let reloadTime = 10;
let reloadTimerId;

// Decrements the timer by 1 for each second
function reloadTimer() {
    if (reloadTime > 0) {
        reloadTimerId = setTimeout(reloadTimer, 1000);
        reloadTime--;
        document.querySelector('#reloadTimer').innerHTML = " " + reloadTime;
    }
    if (reloadTime == 0) {
      window.location.reload();
    }
}