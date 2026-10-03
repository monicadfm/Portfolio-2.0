const stage = document.getElementById("stage");
const charm = document.getElementById("charm");
const charmString = document.getElementById("charmString");

const STRING_LENGTH = 85;
const GRAVITY = 0.55;
const STIFFNESS = 0.06;
const DAMPING = 0.975;

const charmState = {
    x: 0,
    y: STRING_LENGTH,
    vx: 0,
    vy: 0
};

function drawCharm() {
    const anchorX = stage.clientWidth / 2;
    const angle = Math.atan2(charmState.x - anchorX, charmState.y);

    charm.style.left = (charmState.x - charm.offsetWidth / 2) + "px";
    charm.style.top = charmState.y + "px";
    charm.style.transform = "rotate(" + (-angle) + "rad)";

    charmString.setAttribute("x1", anchorX);
    charmString.setAttribute("x2", charmState.x);
    charmString.setAttribute("y2", charmState.y + 12);

}

function stepCharm() {
    const anchorX = stage.clientWidth / 2;
    const dx = charmState.x - anchorX;
    const dy = charmState.y;
    const distance = Math.hypot(dx, dy) || 1;
    const stretch = distance - STRING_LENGTH;

    charmState.vy += GRAVITY;
    charmState.vx -= dx / distance * stretch * STIFFNESS;
    charmState.vy -= dy / distance * stretch * STIFFNESS;

    charmState.vx *= DAMPING;
    charmState.vy *= DAMPING;

    charmState.x += charmState.vx;
    charmState.y += charmState.vy;

    drawCharm();
    requestAnimationFrame(stepCharm);
}

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    charmState.x = stage.clientWidth / 2;
    drawCharm();
}
else {
    // swing from start
    charmState.x = stage.clientWidth / 2 + 80;
    requestAnimationFrame(stepCharm);
}