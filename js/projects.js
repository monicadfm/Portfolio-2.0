const cardGrid = document.getElementById("cardGrid");
const loadingCard = document.getElementById("loadingCard");

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
        tags: ["ASP.NET Core", "SQL Server", ".NET MAUI", "JavaScript"]
    },
    {
        name: "Sidescroller",
        rarity: "legendary",
        language: "JavaScript",
        status: "Complete",
        description: "A roguelike sidescroller built with JavaScript, HTML and CSS. Desktop only.",
        tags: ["JavaScript", "HTML", "CSS"]
    },
    {
        name: "Discord Bot",
        rarity: "epic",
        language: "Python",
        status: "Complete",
        description: "A bot for Discord servers, written in Python.",
        tags: ["Python", "Discord API"]
    },
    {
        name: "Snake",
        rarity: "rare",
        language: "Python",
        status: "Complete",
        description: "The classic snake game, built in Python.",
        tags: ["Python"]
    },
    {
        name: "Rock Paper Scissors",
        rarity: "common",
        language: "Python",
        status: "Complete",
        description: "Play against the computer from the terminal.",
        tags: ["Python"]
    },
    {
        name: "Dice Roll",
        rarity: "common",
        language: "Python",
        status: "Complete",
        description: "A small dice-rolling simulator.",
        tags: ["Python"]
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

renderCards();