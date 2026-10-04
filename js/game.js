const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");
const bootText = document.getElementById("bootText");
const gameScore = document.getElementById("gameScore");
const gameMsg = document.getElementById("gameMsg");
const gameMsgText = document.getElementById("gameMsgText");
const startBtn = document.getElementById("startBtn");
const selectBtn = document.getElementById("selectBtn");
const aBtn = document.getElementById("aBtn");
const bBtn = document.getElementById("bBtn");

const GROUND = 60;
const PLAYER_POS = 18;
const GAME_GRAVITY = 0.32;
const JUMP = -4.1;
const SPEED = 1.3;

// # = colour, o = dark pixel, . = empty
const PLAYER_SPRITE = [
    ".##...##.",
    "####.####",
    "#########",
    "##o###o##",
    "#########",
    ".#######.",
    "..#####..",
    "...###..."
];

const LEGS = ["..#...#..", "...#.#..."];

const ENEMY = [
    "#.....#",
    ".#...#.",
    ".#####.",
    "##o#o##",
    "#######",
    ".#.#.#."
];

const game = {
    running: false,
    y: 0,
    vy: 0,
    enemies: [],
    speed: SPEED,
    score: 0,
    best: 0,
    spawnIn: 0,
    frame: 0,
    last: 0
};

function color(name) {
    return getComputedStyle(gameCanvas).getPropertyValue(name).trim();
}

function drawSprite(sprite, x, y, main, dark) {
    sprite.forEach(function (line, row) {
        for (let col = 0; col < line.length; col++) {
            if (line[col] === ".") {
                continue;
            }

            ctx.fillStyle = line[col] === "o" ? dark : main;
            ctx.fillRect(Math.round(x) + col, Math.round(y) + row, 1, 1);
        }
    });
}

function draw() {
    const pink = color("--pink");
    const light = color("--pink-light");
    const dark = "#07040a";

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

    // dashed ground that scrolls with speed
    ctx.fillStyle = pink;

    for (let x = -(game.frame * game.speed) % 6; x < gameCanvas.width; x += 6) {
        ctx.fillRect(Math.round(x), GROUND + 1, 3, 1);
    }

    const top = GROUND - PLAYER_SPRITE.length - 1 + game.y;
    const legs = game.y < 0 ? LEGS[1] : LEGS[Math.floor(game.frame / 6) % 2];

    drawSprite(PLAYER_SPRITE, PLAYER_POS, top, pink, dark);
    drawSprite([legs], PLAYER_POS, top + PLAYER_SPRITE.length, pink, dark);

    game.enemies.forEach(function (enemy) {
        drawSprite(ENEMY, enemy.x, GROUND - ENEMY.length + 1, light, dark);
    });
}

function hit(enemy) {
    const overlapX = enemy.x < PLAYER_POS + 8 && enemy.x + 6 > PLAYER_POS + 1;
    const lowEnough = game.y > -ENEMY.length + 2;

    return overlapX && lowEnough;
}

function tick(now) {
    if (!game.running) {
        return;
    }

    // 60fps cap
    const time = Math.min(Math.max(now - game.last, 0) / 16.67, 3);

    game.last = now;
    game.frame += time;

    game.vy += GAME_GRAVITY * time;
    game.y = Math.min(game.y + game.vy * time, 0);

    if (game.y === 0) {
        game.vy = 0;
    }

    game.speed += 0.0009 * time;
    game.spawnIn -= time;

    if (game.spawnIn <= 0) {
        game.enemies.push({ x: gameCanvas.width + 4 });
        game.spawnIn = 50 + Math.random() * 60;
    }

    game.enemies.forEach(function (enemy) {
        enemy.x -= game.speed * time;
    });

    game.enemies = game.enemies.filter(function (enemy) {
        return enemy.x > -10;
    });

    game.score += game.speed * 0.06 * time;
    gameScore.textContent = Math.floor(game.score);

    draw();

    if (game.enemies.some(hit)) {
        gameOver();
        return;
    }

    requestAnimationFrame(tick);
}

function startGame() {
    if (game.running) {
        return;
    }

    game.running = true;
    game.y = 0;
    game.vy = 0;
    game.enemies = [];
    game.speed = SPEED;
    game.score = 0;
    game.spawnIn = 60;
    game.frame = 0;
    game.last = performance.now();

    bootText.hidden = true;
    gameMsg.hidden = true;
    gameScore.hidden = false;

    requestAnimationFrame(tick);
}

function gameOver() {
    game.running = false;
    game.best = Math.max(game.best, Math.floor(game.score));

    gameMsgText.textContent = "score " + Math.floor(game.score) + " · best " + game.best + " · press start";
    gameMsg.hidden = false;
}

function jump() {
    if (game.running && game.y === 0) {
        game.vy = JUMP;
    }
}

function backToBoot() {
    game.running = false;
    game.enemies = [];
    game.y = 0;

    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameScore.hidden = true;
    gameMsg.hidden = true;
    bootText.hidden = false;
}

startBtn.addEventListener("click", startGame);
selectBtn.addEventListener("click", backToBoot);
aBtn.addEventListener("click", jump);
bBtn.addEventListener("click", jump);