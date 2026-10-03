const questDialog = document.getElementById("questDialog");
const questRarity = document.getElementById("questRarity");
const questName = document.getElementById("questName");
const questStatus = document.getElementById("questStatus");
const questDescription = document.getElementById("questDescription");
const questTags = document.getElementById("questTags");
const questLinks = document.getElementById("questLinks");
const questFile = document.getElementById("questFile");
const questFeatures = document.getElementById("questFeatures");

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

    const fileNumber = String(PROJECTS.indexOf(project) + 1).padStart(2, "0");
    const fileTotal = String(PROJECTS.length).padStart(2, "0");

    questFile.textContent = "— file " + fileNumber + "/" + fileTotal;

    questStatus.textContent = "status: " + project.status;
    questDescription.textContent = project.description;

    questFeatures.replaceChildren();

    for (const feature of project.features) {
        questFeatures.append(makeElement("li", "", feature));
    }

    questTags.replaceChildren();

    for (const tag of project.tags) {
        questTags.append(makeElement("span", "", tag));
    }

    questLinks.replaceChildren();

    if (project.repo) {
        questLinks.append(makeLink("▸ GitHub ↗", project.repo, "btn primary"));
    }

    if (project.demo) {
        questLinks.append(makeLink("▸ play game ↗", project.demo, "btn"));
    }

    if (!project.repo && !project.demo) {
        questLinks.append(makeElement("span", "quest-status", "source code coming soon"));
    }

    questDialog.showModal();
}

// one listener for every card, future proof
cardGrid.addEventListener("click", function (event) {
    const card = event.target.closest(".card[data-index]");

    if (!card) {
        return;
    }

    openQuest(PROJECTS[card.dataset.index]);
});

// click on the dimmed area closes it
questDialog.addEventListener("click", function (event) {
    if (event.target === questDialog) {
        questDialog.close();
    }
});
