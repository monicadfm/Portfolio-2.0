const sideSwitch = document.getElementById("sideSwitch");
const sideNote = document.getElementById("sideNote");
const ghostWord = document.getElementById("ghostWord");

function setSide(side) {
    const isFront = side === "front";

    document.body.classList.toggle("front", isFront);
    sideSwitch.setAttribute("aria-checked", isFront ? "false" : "true");
    sideNote.textContent = "you're on the " + side + " side";
    ghostWord.textContent = isFront ? "frontend" : "backend";
    renderCommand();

    try {
        localStorage.setItem("side", side);
    }
    catch (error) {
        // private mode can block storage
    }
}

function getSavedSide() {

    try {
        return localStorage.getItem("side") || "back";
    }
    catch (error) {
        return "back";
    }
}

sideSwitch.addEventListener("click", function () {
    const isFront = document.body.classList.contains("front");
    setSide(isFront ? "back" : "front");
});

setSide(getSavedSide());