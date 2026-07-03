// T-REX RUNNER - VERSÃO CORRIGIDA

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const finalScoreDisplay = document.getElementById('finalScore');
const gameOverModal = document.getElementById('gameOverModal');
const restartBtn = document.getElementById('restartBtn');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 110;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

let gameRunning = true;
let score = 0;
let gameSpeed = 5;
let frameCount = 0;
let difficultyMultiplier = 1;

const COLORS = {
    primary: '#535353',
    light: '#f5f5f5',
    dark: '#333333'
};

const images = {
    dinoRun1: new Image(),
    dinoRun2: new Image(),
    dinoIdle: new Image(),
    cactusSmall: new Image(),
    cactusLarge: new Image(),
    ground: new Image(),
    cloud: new Image()
};

images.dinoRun1.src = 'assets/dino_run1.png';
images.dinoRun2.src = 'assets/dino_run2.png';
images.dinoIdle.src = 'assets/dino_idle.png';
images.cactusSmall.src = 'assets/cactus_small.png';
images.cactusLarge.src = 'assets/cactus_large.png';
images.ground.src = 'assets/ground.png';
images.cloud.src = 'assets/cloud.png';

// CLASSE DO DINOSSAURO
class Dino {
    constructor() {
        this.x = 50;
        this.y = canvas.height - 75;
        this.width = 50;
        this.height = 50;
        this.velocityY = 0;
        this.isJumping = false;
        this.jumpPower = 10;
        this.gravity = 0.6;
        this.groundLevel = canvas.height - 75;
        this.animFrame = 0;
        this.animCounter = 0;
    }

    jump() {
        if (!this.isJumping) {
            this.velocityY = -this.jumpPower;
            this.isJumping = true;
        }
    }

    update() {
        // Aplicar gravidade durante o pulo
        if (this.isJumping) {
            this.velocityY += this.gravity;
            this.y += this.velocityY;

            if (this.y >= this.groundLevel) {
                this.y = this.groundLevel;
                this.velocityY = 0;
                this.isJumping = false;
            }
        } else {
            // Garantir que fica no chão quando não está pulando
            this.y = this.groundLevel;
            
            // Animar corrida (3 frames)
            this.animCounter++;
            if (this.animCounter > 8) {
                this.animFrame = (this.animFrame + 1) % 3;
                this.animCounter = 0;
            }
        }
    }

    draw() {
        let img;
        
        if (this.isJumping) {
            img = images.dinoIdle;
        } else {
            // Usar os 3 frames de corrida
            if (this.animFrame === 0) {
                img = images.dinoRun1;
            } else if (this.animFrame === 1) {
                img = images.dinoRun2;
            } else {
                img = images.dinoIdle;
            }
        }
        
        if (img.complete) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }

    getHitbox() {
        return {
            x: this.x + 8,
            y: this.y + 8,
            w: this.width - 16,
            h: this.height - 16
        };
    }
}

// CLASSE DO CACTO
class Cactus {
    constructor(type = 'small') {
        this.type = type;
        this.x = canvas.width;
        this.y = canvas.height - 75;
        this.width = type === 'small' ? 30 : 50;
        this.height = type === 'small' ? 60 : 70;
    }

    update() {
        this.x -= gameSpeed;
    }

    draw() {
        const img = this.type === 'small' ? images.cactusSmall : images.cactusLarge;
        if (img.complete) {
            ctx.drawImage(img, this.x, this.y, this.width, this.height);
        }
    }

    getHitbox() {
        return {
            x: this.x + 8,
            y: this.y + 8,
            w: this.width - 16,
            h: this.height - 16
        };
    }

    isOffscreen() {
        return this.x + this.width < 0;
    }
}

// CLASSE DO CHÃO
class Ground {
    constructor() {
        this.segments = [];
        this.segmentWidth = canvas.width;
        this.y = canvas.height - 30;
        this.height = 30;
        
        this.segments.push({ x: 0 });
        this.segments.push({ x: this.segmentWidth });
    }

    update() {
        for (let seg of this.segments) {
            seg.x -= gameSpeed;
        }

        if (this.segments[0].x + this.segmentWidth < 0) {
            this.segments.shift();
        }

        if (this.segments[this.segments.length - 1].x < canvas.width) {
            this.segments.push({
                x: this.segments[this.segments.length - 1].x + this.segmentWidth
            });
        }
    }

    draw() {
        for (let seg of this.segments) {
            if (images.ground.complete) {
                ctx.drawImage(images.ground, seg.x, this.y, this.segmentWidth, this.height);
            }
        }
    }
}

// CLASSE DAS NUVENS
class Cloud {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 40;
    }

    update() {
        this.x -= gameSpeed * 0.3;
    }

    draw() {
        if (images.cloud.complete) {
            ctx.drawImage(images.cloud, this.x, this.y, this.width, this.height);
        }
    }

    isOffscreen() {
        return this.x + this.width < 0;
    }
}

// INICIALIZAÇÃO
let dino = new Dino();
let cacti = [];
let clouds = [];
let ground = new Ground();

function generateInitialClouds() {
    for (let i = 0; i < 3; i++) {
        const x = i * (canvas.width / 2);
        const y = Math.random() * 60 + 30;
        clouds.push(new Cloud(x, y));
    }
}

generateInitialClouds();

// GERAÇÃO DE OBSTÁCULOS
function generateCactus() {
    const type = Math.random() > 0.65 ? 'large' : 'small';
    cacti.push(new Cactus(type));
}

function generateCloud() {
    const y = Math.random() * 60 + 30;
    clouds.push(new Cloud(canvas.width, y));
}

function removeCacti() {
    cacti = cacti.filter(c => !c.isOffscreen());
}

function removeClouds() {
    clouds = clouds.filter(c => !c.isOffscreen());
}

// DETECÇÃO DE COLISÃO
function checkCollision(dino, cactus) {
    const d = dino.getHitbox();
    const c = cactus.getHitbox();

    return (
        d.x < c.x + c.w &&
        d.x + d.w > c.x &&
        d.y < c.y + c.h &&
        d.y + d.h > c.y
    );
}

function checkAllCollisions() {
    for (let cactus of cacti) {
        if (checkCollision(dino, cactus)) {
            return true;
        }
    }
    return false;
}

// DIFICULDADE PROGRESSIVA
function updateDifficulty() {
    const scoreMilestone = Math.floor(score / 500);
    difficultyMultiplier = 1 + (scoreMilestone * 0.15);
    gameSpeed = 5 + (difficultyMultiplier - 1) * 3;
}

// LÓGICA DO JOGO
function update() {
    if (!gameRunning) return;

    updateDifficulty();

    dino.update();
    ground.update();

    cacti.forEach(c => c.update());
    removeCacti();

    clouds.forEach(c => c.update());
    removeClouds();

    frameCount++;
    
    const cactusFreq = Math.max(60, 100 - Math.floor(difficultyMultiplier * 10));
    if (frameCount % cactusFreq === 0) {
        generateCactus();
    }

    if (frameCount % 150 === 0) {
        generateCloud();
    }

    score += 1;
    updateScore();

    if (checkAllCollisions()) {
        endGame();
    }
}

function draw() {
    ctx.fillStyle = COLORS.light;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    clouds.forEach(c => c.draw());
    ground.draw();
    cacti.forEach(c => c.draw());
    dino.draw();

    ctx.strokeStyle = COLORS.primary;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 30);
    ctx.lineTo(canvas.width, canvas.height - 30);
    ctx.stroke();
}

// GAME LOOP
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// CONTROLES
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        if (gameRunning) {
            dino.jump();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameRunning) {
        dino.jump();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameRunning) {
        dino.jump();
    }
});

// GAME OVER E REINÍCIO
function updateScore() {
    const displayScore = String(Math.floor(score / 10)).padStart(5, '0');
    scoreDisplay.textContent = displayScore;
}

function endGame() {
    gameRunning = false;
    const finalScore = String(Math.floor(score / 10)).padStart(5, '0');
    finalScoreDisplay.textContent = finalScore;
    gameOverModal.classList.add('show');
}

function restartGame() {
    gameRunning = true;
    score = 0;
    gameSpeed = 5;
    frameCount = 0;
    difficultyMultiplier = 1;

    dino = new Dino();
    cacti = [];
    clouds = [];
    ground = new Ground();
    generateInitialClouds();

    gameOverModal.classList.remove('show');
    updateScore();
}

restartBtn.addEventListener('click', restartGame);

// INICIAR
gameLoop();
