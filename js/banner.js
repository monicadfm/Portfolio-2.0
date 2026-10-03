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

const bannerState = { pity: 0, total: 0 };

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
        // keeps legendary and mythic at 5:1
        rarity = Math.random() < 1 / 6 ? "mythic" : "legendary";
    } else {
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
    const state = { pity: 0, total: 0 };
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