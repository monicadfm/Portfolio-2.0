const questDialog = document.getElementById("questDialog");
const questRarity = document.getElementById("questRarity");
const questName = document.getElementById("questName");
const questStatus = document.getElementById("questStatus");
const questDescription = document.getElementById("questDescription");
const questTags = document.getElementById("questTags");
const questLinks = document.getElementById("questLinks");

function makeLink(text, url, className) {
    const link = makeElement("a", className, text);

    link.href = url;
    link.target = "_blank";
    link.rel = "noopener";

    return link;
}

function openQuest(project) {
    questDialog.dataset.rarity = project.rarity;

    questRarity.replaceChildren(
        makeElement("span", "", project.rarity),
        makeElement("span", "", "★".repeat(RARITY_STARS[project.rarity]))
    );

    questName.textContent = project.name;
    questStatus.textContent = "statys: " + project.status;
    questDescription.textContent = project.description;

    questDialog.showModal();
}

// one listener per card, future proof
cardGrid.addEventListener("click", function (event) {
    const card = event.target.closest(".card[data-index]");

    if (!card) {
        return;
    }

    openQuest(PROJECTS[card.dataset.index]);
});

// click outside the dimmed area
questDialog.addEventListener("click", function (event) {
    if (event.target === questDialog) {
        questDialog.closest();
    }
});
