// ===== SCROLL REVEAL =====
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
    reveals.forEach(el => {
        const windowHeight = window.innerHeight;
        const elementTop = el.getBoundingClientRect().top;
        if (elementTop < windowHeight - 100) {
            el.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// ===== STARFIELD BACKGROUND =====
const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    canvas.style.width = window.innerWidth + "px";
    canvas.style.height = window.innerHeight + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let stars = [];
function initStars() {
    stars = [];
    for (let i = 0; i < 220; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.2
        });
    }
}
initStars();

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.fill();
    });
    requestAnimationFrame(animateStars);
}
animateStars();

// ===== ITCH.IO PROJECTS AUTOMATIC IMAGE FETCH =====
const itchProjects = [
    { url: "https://kaljal.itch.io/hollow-grin", title: "Hollow Grin" },
    { url: "https://kaljal.itch.io/mech-a-stand", title: "Mech A Stand" },
    { url: "https://kaljal.itch.io/monster-food", title: "Monster Food" },
    { url: "https://kaljal.itch.io/bright-minds", title: "Bright Minds" }
];

const ghProjects = [
    { url: "https://github.com/kaanakell/TaskFlow", title: "TaskFlow" },
    { url: "https://github.com/kaanakell/GGJ_2026", title: "GGJ_2026" },
    { url: "https://github.com/kaanakell/PicToGraph", title: "PicToGraph" }
];

const itchGrid = document.getElementById("itch-grid");
const ghGrid = document.getElementById("gh-grid");

function addCard(container, project, imgSrc) {
    const card = document.createElement("div");
    card.className = "project-card";
    card.innerHTML = `
      <a href="${project.url}" target="_blank">
        <img src="${imgSrc}" alt="${project.title}">
        <h3>${project.title}</h3>
      </a>
    `;
    container.appendChild(card);
}

// Fetch itch.io image with CORS proxy
function fetchItchImage(project) {
    const encodedURL = encodeURIComponent(project.url);
    const proxyURL = `https://api.allorigins.win/get?url=${encodedURL}`;
    fetch(proxyURL)
        .then(res => res.json())
        .then(data => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(data.contents, "text/html");
            let img = doc.querySelector('meta[property="og:image"]')?.content;
            if (!img) img = "https://via.placeholder.com/400x225.png?text=No+Image";
            addCard(itchGrid, project, img);
        })
        .catch(() => {
            addCard(itchGrid, project, "https://via.placeholder.com/400x225.png?text=No+Image");
        });
}

itchProjects.forEach(fetchItchImage);

// Add GitHub projects with placeholder
ghProjects.forEach(project => {
    addCard(ghGrid, project, "https://via.placeholder.com/400x225.png?text=GitHub+Project");
});
