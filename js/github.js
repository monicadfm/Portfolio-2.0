async function loadRepoCount() {
    try {
        const response = await fetch("https://api.github.com/users/monicadfm");

        // rate limited
        if (!response.ok) {
            return;
        }

        const data = await response.json();

        document.querySelectorAll(".repo-count").forEach(function (element) {
            element.dataset.target = data.public_repos;
            element.textContent = data.public_repos;
        });
    } 
    catch (error) {
        console.warn("Could not load github data:", error);
    }
}

loadRepoCount();