/**
 * u1 - Martin Hric
 * 
 * This file is mod file for game.js, which overrides some of the functions.
 * 
 * CC license:  
 * Music -> https://free-loops.com/8597-bass-heavy-breaker-4.html
 * Car -> https://www.clipartmax.com/middle/m2K9A0b1b1m2A0N4_square-clip-art-blue-square-clip-art
 * Wheel -> https://commons.wikimedia.org/wiki/File:Solid_black.svg
 * Road -> https://commons.wikimedia.org/wiki/File:Grey_Square.svg
 * White square -> https://commons.wikimedia.org/wiki/File:Solid_white.svg
 * Red square -> https://commons.wikimedia.org/wiki/File:Solid_red.svg
 * Background -> https://commons.wikimedia.org/wiki/File:Solid_green.svg
 * 
    *To use debug mode, write into URL ?debug=true (file:///C:/Users/Admin/Desktop/VAVJS/zadanie1/index.html?debug=true)
**/

// Tile size is set to 12, even though is recommended 48x48p, but it is too big
const TILE_SIZE = 12;
const cv_gameWidth = window.gameWidth * TILE_SIZE;
const cv_gameHeight = window.gameHeight * TILE_SIZE;

let debug = false;
const url_param = window.location.search.substring(1);
if (url_param === 'debug=true') {
    debug = true;
}

const canvas = document.createElement('canvas');
canvas.id = 'game-canvas';
const context = canvas.getContext('2d');
const gameContainer = document.getElementById('game-container');

const car_square = new Image();
car_square.src = 'https://www.clipartmax.com/png/small/3-30047_square-clip-art-blue-square-clip-art.png';
const white_square = new Image();
white_square.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Solid_white.svg/512px-Solid_white.svg.png';
const red_square = new Image();
red_square.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Solid_red.svg/512px-Solid_red.svg.png';
const road = new Image();
road.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Grey_Square.svg/512px-Grey_Square.svg.png';
const background = new Image();
background.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Solid_green.svg/512px-Solid_green.svg.png';
background.onload = () => {
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
}
const wheel = new Image();
wheel.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Solid_black.svg/512px-Solid_black.svg.png';
const music = new Audio('http://free-loops.com/force-audio.php?id=8597');

// Music is sometimes bugged, it starts after short delay, especially when you open the game for the first time
let musicIsOn = false;

grid();
function grid(){
    gameContainer.querySelector('table').remove();

    canvas.width = cv_gameWidth;
    canvas.height = cv_gameHeight;
    document.getElementById('game-container').appendChild(canvas);

    const resetButton = document.createElement('button');
    resetButton.innerHTML = 'reset';
    resetButton.style = 'width: 80px; height: 50px;';
    resetButton.style.fontSize = '20px';
    resetButton.style.fontWeight = 'bold';
    document.getElementById('game-container').parentNode.appendChild(resetButton);

    resetButton.addEventListener('click', () => {
        reset();
        if(debug) console.log('game reset');
    });

    const musicButton = document.createElement('button');
    musicButton.innerHTML = 'play music';
    musicButton.style = 'width: 100px; height: 50px; margin-left: 20px;';
    musicButton.style.fontSize = '15px';
    musicButton.style.fontWeight = 'bold';
    document.getElementById('game-container').parentNode.appendChild(musicButton);

    musicButton.addEventListener('click', () => {
        if (musicIsOn) {
            if(debug) console.log('music stopped');
            music.pause();
            musicButton.innerHTML = 'play music';
        } else {
            if(debug) console.log('music playin');
            music.play();
            music.loop = true;
            music.volume = 0.3;
            musicButton.innerHTML = 'stop music';
        }
        musicIsOn = !musicIsOn;
    });

    const scoreLabel = document.createElement('label');
    scoreLabel.id = 'score-label';
    scoreLabel.innerHTML = 'Score: ' + window.score;
    scoreLabel.style = 'width: 80px; height: 50px; margin-left: 100px;';
    scoreLabel.style.fontSize = '30px';
    scoreLabel.style.fontWeight = 'bold';
    document.getElementById('game-container').parentNode.appendChild(scoreLabel);

    const speedLabel = document.createElement('label');
    speedLabel.id = 'speed-label';
    speedLabel.innerHTML = 'Speed: ' + window.speed;
    speedLabel.style = 'width: 80px; height: 50px; margin-left: 300px;';
    speedLabel.style.fontSize = '30px';
    speedLabel.style.fontWeight = 'bold';
    document.getElementById('game-container').parentNode.appendChild(speedLabel);
}

const reset = () => {
    window.line = [];
    generateLine();

    window.prevTx = -1;
    window.prevTy = -1;
    window.playerTx = 1;
    window.playerTy = Math.floor(gameHeight/2);

    window.score = 0;
    window.speed = 75;
    window.iter = 0;

    window.undrawLine();
    clearInterval(window.ival);
    window.ival = setInterval(window.gameLoop, window.speed);
}

window.drawWithStyle = (points,style) => {
    let img;
    if (style === 'car') {
        img = car_square;
    } else if (style === 'white') {
        img = white_square;
    } else if (style === 'red') {
        img = red_square;
    } else if (style === 'road') {
        img = road;
    } else if (style === 'wheel') {
        img = wheel;
    } else console.error('wrong style');

    for (let i = 0; i < points.length; i++) {
        context.beginPath();
        context.drawImage(img, points[i][0] * TILE_SIZE, points[i][1] * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        context.stroke();
    }
}

window.undrawLine = () => {
    context.beginPath();
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    context.stroke();

    document.getElementById('score-label').innerHTML = 'Score: ' + window.score;
    document.getElementById('speed-label').innerHTML = 'Speed: ' + window.speed;
}

window.addEventListener('keydown', (e) => {
    e.preventDefault();
    if (e.key === 'w'){
        movePlayer(-1);
        if(debug) console.log('w pressed');
    }
    else if (e.key === 's') {
        movePlayer(1);
        if(debug) console.log('s pressed');
    }
});