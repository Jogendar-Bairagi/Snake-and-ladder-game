function getRandomNumber() {
    return Math.floor(Math.random() * 6) + 1;
}

let userturn = 0; // 0 = Daya, 1 = Jetha
let jethaposition = 0;
let dayaposition = 0;

// Snake and ladder positions
const snakepositions = { 12: 3, 54: 24, 84: 51, 99: 23 };
const ladderpositions = { 15: 34, 30: 68, 63: 97 };

document.getElementById("daya").style.display = "none";
document.getElementById("jetha").style.display = "none";

// Function to update the turn indicator
function updateTurnIndicator() {
    const turnIndicator = document.getElementById("turn-indicator");
    if (userturn === 0) {
        document.getElementById("jetha-chance").style.display = "none";
        document.getElementById("daya-chance").style.display = "block";
        
        
    } else {
        document.getElementById("daya-chance").style.display = "none";
        document.getElementById("jetha-chance").style.display = "block";
    }
}

function diceClicked() {
    
    const dicenum = getRandomNumber();
    document.querySelectorAll(".dices").forEach(dice => dice.style.display = "none");
    const diceid = "dice" + dicenum;
    document.getElementById("dice-gif").style.display = "block";

    setTimeout(() => {
        document.getElementById("dice-gif").style.display = "none";
        document.getElementById(diceid).style.display = "block";
    }, 500);

    if (userturn === 1) {
        document.getElementById("jetha").style.display = "block";
        // Jetha's turn
        updatePosition("jetha", dicenum, jethaposition, position => jethaposition = position);
    } else {
        document.getElementById("daya").style.display = "block";
        updatePosition("daya", dicenum, dayaposition, position => dayaposition = position);
    }
}

// Update position for a player with slide effect
function updatePosition(player, dicenum, currentPosition, updatePositionCallback) {
    const newPosition = currentPosition + dicenum;

    if (newPosition > 100) {
        userturn = 1 - userturn; // Switch turn
        updateTurnIndicator(); // Update turn indicator after each turn change
        return;
    }

    if (newPosition === 100) {
        declareWinner(player);
        return;
    }

    slidePlayer(player, currentPosition, newPosition, () => {
        updatePositionCallback(newPosition);

        // Check for snake or ladder
        if (snakepositions[newPosition]) {
            setTimeout(() => slidePlayer(player, newPosition, snakepositions[newPosition], () => {
                updatePositionCallback(snakepositions[newPosition]);
            }), 1000);
        } else if (ladderpositions[newPosition]) {
            setTimeout(() => slidePlayer(player, newPosition, ladderpositions[newPosition], () => {
                updatePositionCallback(ladderpositions[newPosition]);
            }), 1000);
        }

        // Extra chance if dice rolls 6
        if (dicenum !== 6) {
            userturn = 1 - userturn; // Switch turn
            updateTurnIndicator(); // Update turn indicator after each turn change
        }
    });
}

// Slide a player from one position to another
function slidePlayer(player, start, end, callback) {
    const playerElement = document.getElementById(player);
    let current = start;

    const interval = setInterval(() => {
        current += (start < end ? 1 : -1); // Move step by step
        const targetDiv = document.getElementById(`box-${current}`);
        const rect = targetDiv.getBoundingClientRect();
        playerElement.style.left = rect.left + 12 + "px";
        playerElement.style.top = rect.top + 12 + "px";

        if (current === end) {
            clearInterval(interval);
            if (callback) callback(); // Execute callback when animation ends
        }
    }, 100); // Adjust interval for smoother or faster movement
}

// Declare winner
function declareWinner(player) {
    const winnerDiv = document.getElementById("winner");
    winnerDiv.style.display = "block";
    winnerDiv.querySelector("h1").innerText = `${capitalize(player)} Wins!`;
    document.getElementById(`${player}wins`).style.display = "block";
    document.body.style.pointerEvents = "none";
}

// Check for collision between players
function colloid() {
    if (jethaposition === dayaposition && jethaposition > 0) {
        if (userturn === 1) {
            resetPosition("daya");
            dayaposition = 0;
        } else {
            resetPosition("jetha");
            jethaposition = 0;
        }
    }
}

// Reset player position to start
function resetPosition(player) {
    const playerElement = document.getElementById(player);
    const targetDiv = document.getElementById("box-1");
    const rect = targetDiv.getBoundingClientRect();
    playerElement.style.left = rect.left + 12 + "px";
    playerElement.style.top = rect.top + 12 + "px";
}

// Capitalize player name
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Interval to check collisions
let intervalId = setInterval(colloid, 2000);

document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("keydown", e => {
    if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) {
        e.preventDefault();
    }
});

// Call this initially to display the first player's turn
updateTurnIndicator();

// Function to detect mobile devices
function isMobileDevice() {
    return /Mobi|Android|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(navigator.userAgent);
}

// Disable the page on mobile devices
if (isMobileDevice()) {
    document.body.innerHTML = "<h1>Sorry, this site is not available on mobile devices.</h1>";
    document.body.style.textAlign = "center";
    document.body.style.paddingTop = "100px";
    document.body.style.fontFamily = "Arial, sans-serif";
    document.body.style.backgroundColor = "#f0f0f0";
    document.body.style.color = "#333";
}
