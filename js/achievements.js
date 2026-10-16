const ACHIEVEMENTS = [
    { id: "side", icon: "†", name: "two-faced", desc: "Switched sides." },
    { id: "charm", icon: "✦", name: "hands off my charm", desc: "Played with the ID charm." },
    { id: "window", icon: "×", name: "nice try", desc: "Tried to close my windows." },
    { id: "cute", icon: "♡", name: "certified cute", desc: "Break the cuteness bar." },
    { id: "brief", icon: "✎", name: "quest reader", desc: "Opened a quest briefing." },
    { id: "pull", icon: "☆", name: "first pull", desc: "Pulled on the banner." },
    { id: "mythic", icon: "♛", name: "jackpot", desc: "Pulled Mythic." },
    { id: "locked", icon: "?", name: "the missing piece", desc: "Tried the locked save point." },
    { id: "copy", icon: "✉", name: "saved!", desc: "Copied my email." },
    { id: "start", icon: "▶", name: "player 2", desc: "Found the hidden game.", hidden: true },
    { id: "terminal", icon: "›", name: "special command", desc: "Found a secret in the terminal.", hidden: true },
    { id: "all", icon: "♥", name: "100% complete", desc: "Collected every achievement." }
];

// I mistype achievements as achievments all the time
const ACHVS = "achievements";

const achvsBtn = document.getElementById("achievementsBtn");
const achvsCount = document.getElementById("achievementsCount");
const toasts = document.getElementById("toasts");
const achvDialog = document.getElementById("achvDialog");
const achvList = document.getElementById("achvList");
const achvProgress = document.getElementById("achvProgress");
const achvFill = document.getElementById("achvFill");

const unlocked = new Set(loadUnlocked());

// making sure it works even if localStorage is blocked
function loadUnlocked() {
    try {
        return JSON.parse(localStorage.getItem(ACHVS)) || [];
    }
    catch (error) {
        return [];
    }
}

function saveUnlocked() {
    try {
        localStorage.setItem(ACHVS, JSON.stringify(Array.from(unlocked)));
    }
    catch (error) {
        // won't remember
    }
}

achvsBtn.addEventListener("click", function () {
    renderList();
    achvDialog.showModal();
});

achvDialog.addEventListener("click", function (event) {
    if (event.target === achvDialog) {
        achvDialog.close();
    }
});

function renderCount() {
    achvsCount.textContent = unlocked.size + "/" + ACHIEVEMENTS.length;
}

function renderList() {
    achvList.replaceChildren();

    ACHIEVEMENTS.forEach(function (achv) {
        const got = unlocked.has(achv.id);
        const secret = achv.hidden && !got;
        const item = makeElement("li", got ? "achv" : "achv locked");
        const text = makeElement("span", "achv-text");

        text.append(
            makeElement("b", "", secret ? "???" : achv.name),
            makeElement("span", "", secret ? "secret achievement ♡" : achv.desc)
        );
        item.append(makeElement("span", "toast-icon", secret ? "?" : achv.icon), text);
        achvList.append(item);
    });

    achvProgress.textContent = unlocked.size + " / " + ACHIEVEMENTS.length;
    achvFill.style.width = unlocked.size / ACHIEVEMENTS.length * 100 + "%";
}

function showToast(icon, title, name) {
    const toast = makeElement("div", "window toast");
    const bar = makeElement("div", "window-bar");
    const body = makeElement("div", "toast-body");
    const text = makeElement("span", "toast-text");

    bar.append(
        makeElement("span", "window-title", "♡ achievement.exe"),
        makeElement("span", "window-btn", "×")
    );
    text.append(makeElement("b", "", title), makeElement("span", "", name));
    body.append(makeElement("span", "toast-icon", icon), text);
    toast.append(bar, body);
    toasts.append(toast);

    setTimeout(function () {
        toast.classList.add("out");
        
        setTimeout(function () {
            toast.remove();
        }, 300);
    }, 3200);
}

function unlock(id) {
    const achv = ACHIEVEMENTS.find(function (item) {
        return item.id === id;
    });

    if (!achv || unlocked.has(id)) {
        return;
    }

    unlocked.add(id);
    saveUnlocked();
    renderCount();
    showToast(achv.icon, "achievement unlocked", achv.name);

    achvsBtn.classList.remove("bump");
    void achvsBtn.offsetWidth;
    achvsBtn.classList.add("bump");
}

renderCount();