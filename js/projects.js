const cardGrid = document.getElementById("cardGrid");
const loadingCard = document.getElementById("loadingCard");
const filterButtons = document.querySelectorAll(".filter");

const RARITY_STARS = {
    common: 1,
    rare: 2,
    epic: 3,
    legendary: 4,
    mythic: 5
};

const PROJECTS = [
    {
        name: "WishBound",
        rarity: "mythic",
        language: "C#",
        status: "In progress",
        description: "A web and mobile platform for collecting virtual characters. Pull from limited-time banners, build a collection and grow friendship levels.",
        tags: ["ASP.NET Core", "SQL Server", ".NET MAUI", "JavaScript"],
        features: [
            "Limited-time banners with a pity system",
            "Inventory, coins and tickets",
            "Friendship levels and rewards with characters",
            "A companion character who greets you on Home",
            "Admin tools with an audit log of every action",
            "Mobile app with daily rewards and push notifications"
        ],
        repo: "https://github.com/monicadfm/WishBound"
    },
    {
        name: "Sidescroller",
        rarity: "legendary",
        language: "JavaScript",
        status: "Complete",
        description: "A roguelike sidescroller built with JavaScript, HTML and CSS. Desktop only.",
        tags: ["JavaScript", "HTML", "CSS"],
        features: [
            "Playable in the browser, no install",
            "Roguelike runs, so no two are the same",
            "Start menu",
            "Plain JavaScript, no frameworks"
        ],
        repo: "https://github.com/monicadfm/Sidescroller-Game-Code",
        demo: "https://monicadfm.github.io/Sidescroller-Game-Code/Menu/index.html"
    },
    {
        name: "Discord Bot",
        rarity: "epic",
        language: "Python",
        status: "Complete",
        description: "A bot for Discord servers, written in Python.",
        tags: ["Python", "Discord API"],
        features: [
            "Responds to commands in Discord servers",
            "Built on the Discord API"
        ],
        repo: "https://github.com/monicadfm/Python-Discord-Bot"
    },
    {
        name: "Snake",
        rarity: "rare",
        language: "Python",
        status: "Complete",
        description: "The classic snake game, built in Python.",
        tags: ["Python"],
        features: [
            "Classic grid movement",
            "The snake grows every time it eats"
        ],
        repo: "https://github.com/monicadfm/Python-Snake-Game"
    },
    {
        name: "Rock Paper Scissors",
        rarity: "common",
        language: "Python",
        status: "Complete",
        description: "Play against the computer from the terminal.",
        tags: ["Python"],
        features: [
            "Play against the computer",
            "The computer picks at random",
            "Runs in the terminal"
        ],
        repo: "https://github.com/monicadfm/RPS_python"
    },
    {
        name: "Dice Roll",
        rarity: "common",
        language: "Python",
        status: "Complete",
        description: "A small dice-rolling simulator.",
        tags: ["Python"],
        features: [
            "Simulates dice rolls",
            "A random result every roll"
        ],
        repo: "https://github.com/monicadfm/Python-Dice-Roll"
    }
];

function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    element.className = className;

    if (text) {
        element.textContent = text;
    }

    return element;
}

function createCard(project, index) {
    const card = makeElement("button", "card");
    const rarity = makeElement("span", "card-rarity");
    const tags = makeElement("span", "card-tags");

    card.type = "button";
    card.dataset.index = index;
    card.dataset.rarity = project.rarity;
    card.dataset.language = project.language;

    rarity.append (
        makeElement("span", "", project.rarity),
        makeElement("span", "", "★".repeat(RARITY_STARS[project.rarity]))
    );

    for (const tag of project.tags) {
        tags.append(makeElement("span", "", tag));
    }

    if (project.status === "In progress") {
        card.append(makeElement("span", "card-wip", "In progress"));
    }

    card.append(
        rarity,
        makeElement("span", "card-name", project.name),
        makeElement("span", "card-description", project.description),
        tags,
        makeElement("span", "card-more", "▸ quest briefing")
    );

    return card;
}

function renderCards() {
    PROJECTS.forEach(function (project, index) {
        cardGrid.insertBefore(createCard(project, index), loadingCard);
    });
}

function filterCards(language) {
    cardGrid.querySelectorAll(".card[data-language]").forEach(function (card) {
        card.hidden = language !== "all" && card.dataset.language !== language;
    });

    loadingCard.hidden = language !== "all";
}

filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        filterButtons.forEach(function (other) {
            other.setAttribute("aria-pressed", other === button);
        });

        filterCards(button.dataset.filter);
    });
});

renderCards();