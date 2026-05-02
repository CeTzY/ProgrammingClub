let tg = window.Telegram?.WebApp;
let userId = null;
let userName = null;

if (tg) {
    tg.ready();
    tg.expand();
    const user = tg.initDataUnsafe?.user;
    if (user) {
        userId = user.id;
        userName = user.first_name || "Участник";
        document.getElementById("user-name").innerText = userName;
    }
}

// Навигация
document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const page = btn.dataset.page;
        document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(`page-${page}`).classList.add("active");
        if (page === "top") renderTop();
        if (page === "profile") renderProfile();
        if (page === "homework") renderHomework();
        if (page === "news") renderNews();
    });
});

// ========== НОВОСТИ ==========
function renderNews() {
    const container = document.getElementById("news-list");
    if (!container) return;
    let html = "";
    for (let n of NEWS) {
        html += `
            <div class="news-item">
                <div class="news-date">📅 ${n.date}</div>
                <div class="news-title">${n.title}</div>
                <div class="news-text">${n.text}</div>
            </div>
        `;
    }
    container.innerHTML = html;
}

// ========== ДЗ (ТОЛЬКО ДЛЯ ЧТЕНИЯ) ==========
function renderHomework() {
    const container = document.getElementById("homework-content");
    if (!container) return;
    let html = `<div class="hw-header"><h2>📚 Домашнее задание #${HOMEWORK.id}</h2><div class="hw-deadline">📅 Дедлайн: ${HOMEWORK.deadline}</div></div>`;
    for (let lvl of HOMEWORK.levels) {
        const levelClass = lvl.level === 1 ? "easy" : lvl.level === 2 ? "medium" : "hard";
        html += `
            <div class="hw-card">
                <div class="hw-level ${levelClass}">${lvl.name}</div>
                <div class="hw-title">${lvl.title}</div>
                <div class="hw-description">${lvl.description}</div>
                <div class="hw-section"><div class="hw-section-title">📌 Пример</div><div class="hw-example">${lvl.example}</div></div>
            </div>
        `;
    }
    html += `<div class="info-box">⚡ Сдать задание можно в боте: @ProgClubBot_bot</div>`;
    container.innerHTML = html;
}

// ========== ТОП ==========
function renderTop() {
    const container = document.getElementById("top-list");
    if (!container) return;
    let html = "";
    for (let i = 0; i < TOP_USERS.length; i++) {
        const u = TOP_USERS[i];
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : `${i+1}.`;
        html += `<div class="top-item"><div class="top-medal">${medal}</div><div class="top-name">${u.name}</div><div class="top-exp">${u.exp} опыта</div><div class="top-rank">${u.rank}</div></div>`;
    }
    container.innerHTML = html;
}

// ========== ПРОФИЛЬ ==========
function renderProfile() {
    if (!userName) {
        const user = tg?.initDataUnsafe?.user;
        userName = user?.first_name || "Участник";
        document.getElementById("user-name").innerText = userName;
    }
    const exp = 150, nextExp = 300, percent = (exp / nextExp) * 100;
    const expFill = document.getElementById("exp-fill");
    if (expFill) expFill.style.width = percent + "%";
    const expText = document.getElementById("exp-text");
    if (expText) expText.innerText = `${exp} / ${nextExp} опыта`;
    const pointsSpan = document.getElementById("user-points");
    if (pointsSpan) pointsSpan.innerText = "25";
    const hwDoneSpan = document.getElementById("user-hw-done");
    if (hwDoneSpan) hwDoneSpan.innerText = "3";
    const levelSpan = document.getElementById("user-level");
    if (levelSpan) levelSpan.innerText = "3";
    const rankSpan = document.getElementById("user-rank");
    if (rankSpan) rankSpan.innerText = "🐍 Питонист";
}

// ========== ЗАПУСК ==========
renderNews();