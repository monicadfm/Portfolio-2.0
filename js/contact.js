const copyButton = document.getElementById("copyEmail");
const email = document.getElementById("email");
const emailSlot = copyButton.closest(".slot");

let copyTimer = null;

copyButton.addEventListener("click", async function () {
    try {
        await navigator.clipboard.writeText(email.textContent);
        copyButton.textContent = "saved ♡";

        emailSlot.classList.remove("saved");
        void emailSlot.offsetWidth;
        emailSlot.classList.add("saved");
    }
    catch (error) {
        // ctrl + c enabled incase clipboard is blocked
        const range = document.createRange();

        range.selectNodeContents(email);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        copyButton.textContent = "ctrl+c";
    }

    clearTimeout(copyTimer);
    copyTimer = setTimeout(function () {
        copyButton.textContent = "copy";
    }, 2000);
});