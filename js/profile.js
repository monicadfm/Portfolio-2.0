const stats = document.getElementById("stats");
const bars = document.getElementById("bars");

const COUNT_DURATION = 800;

function countUp(element) {
    const start = performance.now();

    element.dataset.target = element.textContent;

    function tick(now) {
        const progress = Math.min((now - start) / COUNT_DURATION, 1);
        const target = Number(element.dataset.target);

        element.textContent = Math.round(target * progress);

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

const observer = new IntersectionObserver (function (entries) {
    for (const entry of entries) {
        if (!entry.isIntersecting) {
            continue;
        }

        if (entry.target === stats) {
            for (const count of stats.querySelectorAll(".count")) {
                countUp(count);
            }
        }

        if (entry.target === bars) {
            bars.classList.remove("waiting");
        }

        observer.unobserve(entry.target);
    }
}, { threshold: 0.4 });

if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    bars.classList.add("waiting");
    observer.observe(stats);
    observer.observe(bars);
}

const profileGrid = document.getElementById("profileGrid");

const BUBBLE_TIME = 2200;

function showBubble(win, text) {
    const old = win.querySelector(".bubble");

    if (old) {
        old.remove();
    }

    const bubble = makeElement("div", "bubble", text);

    win.append(bubble);

    setTimeout(function () {
        bubble.classList.add("out");
        setTimeout(function () {
            bubble.remove();
        }, 250);
    }, BUBBLE_TIME);
}

profileGrid.addEventListener("click", function (event) {
    const closeBtn = event.target.closest("[data-close]");

    if (!closeBtn) {
        return;
    }

    const win = closeBtn.closest(".window");

    win.classList.remove("refused");
    // spam clicks replay the shake
    void win.offsetWidth;
    win.classList.add("refused");

    showBubble(win, "rude.");
    unlock("window");
});