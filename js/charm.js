const stage = document.getElementById("stage");
const charm = document.getElementById("charm");
const charmString = document.getElementById("charmString");

const STRING_LENGTH = 140;
const GRAVITY = 0.55;
const DAMPING = 0.985;
const REEL_IN = 0.03;
const MAX_SPEED = 25;
// ~40 degrees, in radians
const MAX_TILT = 0.7;

const charmState = {
    x: 0,
    y: STRING_LENGTH,
    vx: 0,
    vy: 0,
    rope: STRING_LENGTH
};

const dragState = {
    active: false,
    offsetX: 0,
    offsetY: 0
};

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function drawCharm() {
    const anchorX = stage.clientWidth / 2;
    const angle = clamp(Math.atan2(charmState.x - anchorX, charmState.y), -MAX_TILT, MAX_TILT);

    charm.style.left = (charmState.x - charm.offsetWidth / 2) + "px";
    charm.style.top = charmState.y + "px";
    charm.style.transform = "rotate(" + (-angle) + "rad)";

    charmString.setAttribute("x1", anchorX);
    charmString.setAttribute("x2", charmState.x);
    charmString.setAttribute("y2", charmState.y + 12);
}

// a string can pull but never push
function applyString() {
    const anchorX = stage.clientWidth / 2;
    const dx = charmState.x - anchorX;
    const dy = charmState.y;
    const distance = Math.hypot(dx, dy) || 1;

    if (distance <= charmState.rope) {
        return;
    }

    const nx = dx / distance;
    const ny = dy / distance;

    charmState.x = anchorX + nx * charmState.rope;
    charmState.y = ny * charmState.rope;

    const outward = charmState.vx * nx + charmState.vy * ny;

    if (outward > 0) {
        charmState.vx -= outward * nx;
        charmState.vy -= outward * ny;
    }
}

function stepCharm() {
    if (!dragState.active) {
        charmState.rope += (STRING_LENGTH - charmState.rope) * REEL_IN;

        charmState.vy += GRAVITY;
        charmState.vx = clamp(charmState.vx * DAMPING, -MAX_SPEED, MAX_SPEED);
        charmState.vy = clamp(charmState.vy * DAMPING, -MAX_SPEED, MAX_SPEED);

        charmState.x += charmState.vx;
        charmState.y += charmState.vy;

        applyString();
    }

    drawCharm();
    requestAnimationFrame(stepCharm);
}

function stagePoint(event) {
    const box = stage.getBoundingClientRect();

    return {
        x: event.clientX - box.left,
        y: event.clientY - box.top
    };
}

charm.addEventListener("pointerdown", function (event) {
    const point = stagePoint(event);

    dragState.active = true;
    dragState.offsetX = point.x - charmState.x;
    dragState.offsetY = point.y - charmState.y;

    charm.setPointerCapture(event.pointerId);
    charm.classList.add("dragging");
});

charm.addEventListener("pointermove", function (event) {
    if (!dragState.active) {
        return;
    }

    const point = stagePoint(event);
    const newX = point.x - dragState.offsetX;
    const newY = point.y - dragState.offsetY;

    // last move = throw speed
    charmState.vx = newX - charmState.x;
    charmState.vy = newY - charmState.y;
    charmState.x = newX;
    charmState.y = newY;

    charmState.rope = Math.max(STRING_LENGTH, Math.hypot(charmState.x - stage.clientWidth / 2, charmState.y));
});

function endDrag() {
    dragState.active = false;
    charm.classList.remove("dragging");
}

charm.addEventListener("pointerup", endDrag);
charm.addEventListener("pointercancel", endDrag);

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    charmState.x = stage.clientWidth / 2;
    drawCharm();
}
else {
    // swing from start
    charmState.x = stage.clientWidth / 2 + 80;
    charmState.rope = Math.hypot(80, STRING_LENGTH);
    requestAnimationFrame(stepCharm);
}