const stats = document.getElementById("stats");
const bars = document.getElementById("bars");

const COUNT_DURATION = 800;

function countUp(element) {
    const target = Number(element.textContent);
    const start = performance.now();

    function tick(now) {
        const progress = Math.min((now - start) / COUNT_DURATION, 1);

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