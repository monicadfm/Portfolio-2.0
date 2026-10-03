const command = document.getElementById("command");
const COMMAND_TEXT = "~/portfolio init --player monica --side ";

let typed = 0;

function renderCommand() {
    const arrow = document.createElement("b");
    const caret = document.createElement("span");

    arrow.textContent = "→ ";
    caret.className = "caret";

    command.textContent = "";
    command.append(arrow, COMMAND_TEXT.slice(0, typed));

    if (typed === COMMAND_TEXT.length) {
        const side = document.createElement("b");
        side.textContent = document.body.classList.contains("front") ? "front" : "back";
        command.append(side);
    }

    command.append(caret);
}

if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    typed = COMMAND_TEXT.length;
    renderCommand();
}
else {
    const typing = setInterval(function () {
        typed++;
        renderCommand();

        if (typed === COMMAND_TEXT.length) {
            clearInterval(typing);
        }
    }, 40);
}