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

// Decrements the timer by 1 for each second
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