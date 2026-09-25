const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');
const gameBoard = document.querySelector('.game-board');
const startScreen = document.querySelector('.start-screen');
const gameOverScreen = document.querySelector('.game-over-screen');
const startButton = document.querySelector('.start-button');
const restartButton = document.querySelector('.restart-button');
const scoreElement = document.querySelector('.score');
const finalScoreElement = document.querySelector('.final-score');


// =========================
// ÁUDIO MP3
// =========================
const menuMusic = new Audio('menu.mp3');
const gameMusic = new Audio('game.mp3');
const jumpSound = new Audio('jump.mp3');
const deathSound = new Audio('death.mp3');

menuMusic.loop = true;
gameMusic.loop = true;

menuMusic.volume = 0.10;
gameMusic.volume = 0.05;
jumpSound.volume = 0.02;
deathSound.volume = 0.10;

const startMenuMusic = () => {
    gameMusic.pause();
    gameMusic.currentTime = 0;

    menuMusic.play().catch(() => {});
};

const startGameMusic = () => {
    menuMusic.pause();
    menuMusic.currentTime = 0;

    gameMusic.currentTime = 0;
    gameMusic.play().catch(() => {});
};

const stopGameMusic = () => {
    gameMusic.pause();
    gameMusic.currentTime = 0;
};

let gameStarted = false;
let gameOver = false;
let score = 0;
let loop = null;
let scoreTimer = null;
scoreElement.classList.add('hidden');


const jump = () => {

    if (!gameStarted || gameOver) {
        return;
    }
    
    if (mario.classList.contains('jump')) {
        return;
    }

    jumpSound.currentTime = 0;
    jumpSound.play().catch(() => {});

    mario.classList.add('jump');

    setTimeout(() => {

         mario.classList.remove('jump');

    }, 500);
};


const updateScore = () => {

    if (!gameStarted || gameOver) {
        return;
    }

    const pipePosition = pipe.offsetLeft;

    if (pipePosition < 80 && pipePosition > 0 && pipe.dataset.scored !== 'true') 
        {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        pipe.dataset.scored = 'true';
    }

    if (pipePosition > 500) {

     pipe.dataset.scored = 'false';
    }
};


const endGame = () => {

    if (gameOver) {
        return;
    }


    gameOver = true;
    gameStarted = false;

    stopGameMusic();
    deathSound.currentTime = 0;
    deathSound.play().catch(() => {});


  
    clearInterval(loop);
    clearInterval(scoreTimer);

    gameBoard.classList.remove('game-running');
    gameBoard.classList.add('game-paused');
   
    const pipePosition = pipe.offsetLeft;

    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;

    const cloudsPosition =window.getComputedStyle(clouds).right;

    clouds.style.animation = 'none';
    clouds.style.right = cloudsPosition;

    const marioPosition =Number(window.getComputedStyle(mario).bottom.replace('px', ''));

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;
    mario.src = 'game-over.png';
    mario.style.width = '65px';
    mario.style.marginLeft = '60px';

 scoreElement.classList.add('hidden');

    finalScoreElement.textContent = score;
    gameOverScreen.classList.remove('hidden');
};

const resetGame = () => {
    clearInterval(loop);
    clearInterval(scoreTimer);

    gameOver = false;
    gameStarted = true;
    score = 0;
scoreElement.classList.remove('hidden');
    scoreElement.textContent = 'Score: 0';
    finalScoreElement.textContent = '0';
    startScreen.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    gameBoard.classList.remove('game-paused');
    gameBoard.classList.add('game-running');
    mario.src = 'mario.gif';
    mario.style.width = '';
    mario.style.marginLeft = '';
    mario.style.animation = '';
    mario.style.bottom = '';
    pipe.style.animation = '';
    pipe.style.left = '';
    pipe.style.right = '-100px';
    pipe.dataset.scored = 'false';
    clouds.style.animation = '';
    clouds.style.right = '-40%';

    startLoop();
};



const startLoop = () => {

    loop = setInterval(() => {

        if (!gameStarted || gameOver) {return;}
        const pipePosition =pipe.offsetLeft;


        const marioPosition =Number(window.getComputedStyle(mario).bottom.replace('px', '') );

        if (pipePosition <= 120 &&pipePosition > 0 && marioPosition < 80) 
            {
            endGame();
        }

    }, 10);

         scoreTimer = setInterval(updateScore,10);
};

startButton.addEventListener('click', () => {
    resetGame();
    startGameMusic();
});
restartButton.addEventListener('click', () => {
    resetGame();
    startGameMusic();
});
document.addEventListener('keydown', (event) => {
 if (event.code === 'Space' ||event.code === 'ArrowUp') {event.preventDefault();jump();}

    }
);


// O navegador bloqueia autoplay. O primeiro clique libera a música do menu.
// Não interfere no botão START.
document.addEventListener('click', () => {
    if (!gameStarted && !gameOver) {
        startMenuMusic();
    }
}, { once: true });
