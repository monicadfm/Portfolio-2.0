// copied from past portfolio and adjusted
const HARD_PITY = 5;

// same rates as WishBound
const RATES = [
    { rarity: "common", weight: 55 },
    { rarity: "rare", weight: 30 },
    { rarity: "epic", weight: 12 },
    { rarity: "legendary", weight: 2.5 },
    { rarity: "mythic", weight: 0.5 }
];

const bannerState = { pity: 0, total: 0, guaranteed: false };

function pickRandom(list) {
    const index = Math.floor(Math.random() * list.length);

    return list[index];
}

function isHighRarity(rarity) {
    return rarity === "legendary" || rarity === "mythic";
}

function pickRarity() {
    let roll = Math.random() * 100;

    for (const rate of RATES) {
        if (roll < rate.weight) {
            return rate.rarity;
        }

        roll -= rate.weight;
    }

    return "common";
}

function rollRarity(state) {
    state.pity++;
    state.total++;

    let rarity;

    if (state.pity >= HARD_PITY) {
        // 50/50 rule : win Mythic
        rarity = state.guaranteed || Math.random() < 0.5 ? "mythic" : "legendary";
        state.guaranteed = rarity === "legendary";
    } 
    else {
        rarity = pickRarity();
    }

    if (isHighRarity(rarity)) {
        state.pity = 0;
    }

    return rarity;
}

function pullProject(state) {
    const rarity = rollRarity(state);
    const pool = PROJECTS.filter(function (project) {
        return project.rarity === rarity;
    });

    return pickRandom(pool);
}

// run testRates(10000) in the console
function testRates(pulls) {
    const state = { pity: 0, total: 0, guaranteed: false };
    const counts = {};
    let wait = 0;
    let longestWait = 0;

    for (let i = 0; i < pulls; i++) {
        const rarity = rollRarity(state);

        counts[rarity] = (counts[rarity] || 0) + 1;
        wait++;

        if (isHighRarity(rarity)) {
            longestWait = Math.max(longestWait, wait);
            wait = 0;
        }
    }

    const percentages = {};

    for (const rate of RATES) {
        const count = counts[rate.rarity] || 0;
        percentages[rate.rarity] = (count / pulls * 100).toFixed(2) + "%";
    }

    console.table(percentages);
    console.log("Longest wait for legendary+:", longestWait, "pulls");
}

const pityHearts = document.getElementById("pityHearts");
const pityText = document.getElementById("pityText");
const pullBtn = document.getElementById("pullBtn");
const revealDialog = document.getElementById("revealDialog");
const revealHeadline = document.getElementById("revealHeadline");
const revealSub = document.getElementById("revealSub");
const revealCard = document.getElementById("revealCard");
const pullAgainBtn = document.getElementById("pullAgainBtn");
const revealBriefBtn = document.getElementById("revealBriefBtn");
const starStage = document.getElementById("starStage");
const revealFx = document.getElementById("revealFx");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");

const FALL_TIME = 1260;
const SPARKS = { common: 10, rare: 12, epic: 14, legendary: 20, mythic: 28 };
const GLYPHS = ["✦", "♡", "✧", "♥"];

let fallTimer = null;

const CELEBRATIONS = {
    legendary: "lucky pull! pity reset ♡",
    mythic: "jackpot!! you found my main quest ♡"
};

let lastPull = null;

function pityStatus() {
    const left = HARD_PITY - bannerState.pity;
    const odds = left === 1 ? "legendary+ guaranteed next pull" : "legendary+ within " + left + " pulls";

    return "pity " + bannerState.pity + "/" + HARD_PITY + " · " + odds;
}

function showReveal(project) {
    const high = isHighRarity(project.rarity);

    lastPull = project;
    revealDialog.dataset.rarity = project.rarity;
    revealHeadline.textContent = high ? "✦ " + project.rarity + " ✦" : project.rarity;
    revealSub.textContent = CELEBRATIONS[project.rarity] || pityStatus();
    revealSub.classList.toggle("celebrate", high);
    revealCard.replaceChildren(createCard(project, PROJECTS.indexOf(project)));

    // pull again while it's open would throw
    if (!revealDialog.open) {
        revealDialog.showModal();
    }

    if (!reduceMotion.matches) {
        dropStar();
    }
}

function buildStar () {
    starStage.replaceChildren();

    for (let i = 6; i >= 1; i--) {
        const dust = makeElement("div", "dust");

        dust.style.setProperty("--i", i);
        dust.append(makeElement("span", "", i % 2 ? "✦" : "·"));
        starStage.append(dust);
    }

    const comet = makeElement("div", "comet");

    comet.append(
        makeElement("span", "comet-tail wide"),
        makeElement("span", "comet-tail"),
        makeElement("span", "comet-head", "✦")
    );

    starStage.append(comet);
}

function burst(rarity) {
    const count = SPARKS[rarity];

    revealFx.replaceChildren(makeElement("span", "ring"));

    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.4;
        const distance = 110 + Math.random() * 110;
        const spark = makeElement("span", "spark", GLYPHS[i % GLYPHS.length]);

        spark.style.setProperty("--x", Math.cos(angle) * distance + "px");
        spark.style.setProperty("--y", Math.sin(angle) * distance + "px");
        spark.style.setProperty("--r", Math.random() * 360 - 180 + "deg");
        spark.style.setProperty("--s", 14 + Math.random() * 14 + "px");
        revealFx.append(spark);
    }
}

function dropStar() {
    const centerY = revealCard.offsetTop + revealCard.offsetHeight / 2;

    starStage.style.top = centerY + "px";
    revealFx.style.top = centerY + "px";
    starStage.style.setProperty("--fall", FALL_TIME + "ms");

    revealDialog.classList.remove("landed", "flash");
    revealDialog.classList.add("falling");
    buildStar();

    fallTimer = setTimeout(landStar, FALL_TIME);
}

function landStar() {
    clearTimeout(fallTimer);
    fallTimer = null;

    starStage.replaceChildren();
    revealDialog.classList.remove("falling");
    revealDialog.classList.add("landed");
    revealDialog.classList.toggle("flash", isHighRarity(lastPull.rarity));

    burst(lastPull.rarity);
    pullAgainBtn.focus();
}

function pull() {
    const project = pullProject(bannerState);

    renderPity();
    showReveal(project);
}

function openPulledBriefing() {
    revealDialog.close();
    openQuest(lastPull);
}

function highlightCard(project) {
    const card = cardGrid.querySelector('.card[data-index="' + PROJECTS.indexOf(project) + '"]');

    if (!card) {
        return;
    }

    card.scrollIntoView({ block: "nearest" });
    card.classList.remove("hit");
    // forces reflow for animation replay
    void card.offsetWidth;
    card.classList.add("hit");
}

pullBtn.addEventListener("click", pull);
pullAgainBtn.addEventListener("click", pull);
revealBriefBtn.addEventListener("click", openPulledBriefing);
revealCard.addEventListener("click", openPulledBriefing);

revealDialog.addEventListener("click", function (event) {
    if (fallTimer) {
        landStar();
        return;
    }

    if (event.target === revealDialog) {
        revealDialog.close();
    }
});

revealDialog.addEventListener("close", function () {
    clearTimeout(fallTimer);
    fallTimer = null;
    starStage.replaceChildren();
    revealDialog.classList.remove("falling");
    highlightCard(lastPull);
});

function renderPity() {
    pityHearts.replaceChildren();

    for (let i = 0; i < HARD_PITY; i++) {
        const full = i < bannerState.pity;

        pityHearts.append(makeElement("span", full ? "full" : "", full ? "♥" : "♡"));
    }

    pityText.textContent = "pity " + bannerState.pity + "/" + HARD_PITY; 
}

renderPity();