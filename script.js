// ========== TELEGRAM WEB APP ==========
let tg = window.Telegram?.WebApp;
let userId = null;
let userName = null;

if (tg) {
    tg.ready();
    tg.expand();
    const user = tg.initDataUnsafe?.user;
    if (user) {
        userId = user.id;
        userName = user.first_name;
    }
}

// ========== НАВИГАЦИЯ ==========
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const page = btn.dataset.page;
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`page-${page}`)?.classList.add('active');
        if (page === 'profile') renderProfile();
        if (page === 'top') renderTop();
        if (page === 'lessons') renderLessons();
        if (page === 'home') renderHomework();
    });
});

// ========== ОТРИСОВКА ДЗ ==========
function renderHomework() {
    const app = document.getElementById('app');
    let html = `<div class="hw-header"><h2>📚 Домашнее задание #${HOMEWORK.id}</h2><div class="hw-deadline">📅 Дедлайн: ${HOMEWORK.deadline}</div></div>`;
    for (let lvl of HOMEWORK.levels) {
        html += `
            <div class="hw-card" data-level="${lvl.level}">
                <div class="hw-level ${lvl.level === 1 ? 'easy' : lvl.level === 2 ? 'medium' : 'hard'}">${lvl.name}</div>
                <div class="hw-title">${lvl.title}</div>
                <div class="hw-description">${lvl.description}</div>
                <div class="hw-section"><div class="hw-section-title">📌 Пример</div><div class="hw-example">${lvl.example}</div></div>
                <div class="hw-section"><div class="hw-section-title">💡 Подсказка</div><div class="hw-hint">${lvl.hint}</div></div>
                <div class="hw-section"><div class="hw-section-title">📚 Что тренируем</div><div class="hw-topics">${lvl.topics.map(t => `<span>🔹 ${t}</span>`).join('')}</div></div>
                <button class="hw-submit-btn" onclick="openSubmitModal(${lvl.level})">📤 Сдать этот уровень</button>
            </div>
        `;
    }
    app.innerHTML = html;
}

// ========== МОДАЛКА ОТПРАВКИ ==========
function openSubmitModal(level) {
    const levelNames = { 1: "🟢 Уровень 1", 2: "🟡 Уровень 2", 3: "🔴 Уровень 3" };
    const modalHtml = `
        <div id="codeModal" class="modal-overlay">
            <div class="modal-window">
                <div class="modal-header"><span>📤 Сдать ${levelNames[level]}</span><button class="modal-close" onclick="closeModal()">✕</button></div>
                <div class="modal-body"><textarea id="modalCode" rows="8" placeholder="Вставь сюда свой код..."></textarea></div>
                <div class="modal-footer"><button class="modal-cancel" onclick="closeModal()">Отмена</button><button class="modal-submit" onclick="submitCode(${level})">Отправить</button></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeModal() { document.getElementById('codeModal')?.remove(); }

function submitCode(level) {
    const code = document.getElementById('modalCode')?.value;
    if (!code?.trim()) { alert("❌ Введи код!"); return; }
    const levelNames = { 1: "🟢 Уровень 1", 2: "🟡 Уровень 2", 3: "🔴 Уровень 3" };
    if (tg) {
        tg.sendData(JSON.stringify({ action: "submit_hw", level, level_name: levelNames[level], code, user_id: userId, user_name: userName }));
        alert(`✅ Код отправлен на проверку!\nУровень: ${levelNames[level]}`);
        closeModal();
    } else {
        alert(`❌ Отправь код боту @ProgClubBot_bot\n/hw submit ${level}\n\n${code}`);
    }
}

// ========== УРОКИ ==========
function renderLessons() {
    let html = '<div class="section-header"><h2>📚 Уроки Python</h2></div>';
    for (let l of LESSONS) {
        html += `
            <div class="lesson-card" onclick="window.open('https://t.me/CeTzYPythonLessons', '_blank')">
                <div class="lesson-number">0${l.num}</div>
                <div class="lesson-info"><h3>${l.title}</h3><p>${l.desc}</p><div class="lesson-meta">📖 ${l.duration}</div></div>
            </div>
        `;
    }
    document.getElementById('app').innerHTML = html;
}

// ========== ТОП ==========
function renderTop() {
    let html = '<div class="section-header"><h2>🏆 Таблица лидеров</h2></div>';
    for (let i = 0; i < TOP_USERS.length; i++) {
        const u = TOP_USERS[i];
        const medal = i === 0 ? "🥇" : i === 1 ? "🥈" : `${i+1}.`;
        html += `<div class="top-item"><div class="top-medal">${medal}</div><div class="top-name">${u.name}</div><div class="top-exp">${u.exp} опыта</div><div class="top-rank">${u.rank}</div></div>`;
    }
    document.getElementById('app').innerHTML = html;
}

// ========== ПРОФИЛЬ ==========
function renderProfile() {
    if (!userName) {
        const user = tg?.initDataUnsafe?.user;
        userName = user?.first_name || "Участник";
    }
    const exp = 150, nextExp = 300, percent = (exp / nextExp) * 100;
    const html = `
        <div class="profile-card">
            <div class="avatar">👤</div>
            <h2>${userName || "Загрузка..."}</h2>
            <div class="rank-badge">🐍 Питонист</div>
            <div class="exp-bar"><div class="exp-fill" style="width: ${percent}%"></div></div>
            <div class="exp-text">${exp} / ${nextExp} опыта</div>
            <div class="stats-grid">
                <div class="stat">🏆 Очки<br><span>25</span></div>
                <div class="stat">📚 Сдано ДЗ<br><span>3</span></div>
                <div class="stat">⭐ Уровень<br><span>3</span></div>
            </div>
        </div>
    `;
    document.getElementById('app').innerHTML = html;
}

// ========== СТАРТ ==========
renderHomework();