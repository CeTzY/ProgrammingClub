// ========== TELEGRAM WEB APP ==========
let tg = window.Telegram?.WebApp;
let userId = null;
let userName = "";
let selectedLevel = null;
let currentHomework = null;

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

// ========== HAPTIC FEEDBACK ==========
function hapticFeedback(style = "light") {
    if (tg?.HapticFeedback) {
        if (style === "success" || style === "error") {
            tg.HapticFeedback.notificationOccurred(style);
        } else {
            tg.HapticFeedback.impactOccurred(style);
        }
    }
}

// ========== ЗАГРУЗКА РАЗВЁРНУТОГО ДЗ ==========
async function loadFullHomework() {
    const container = document.getElementById("hw-full-content");
    
    currentHomework = fullHomework;
    
    let html = `
        <div class="hw-header">
            <h2>📚 Домашнее задание #${currentHomework.id}</h2>
            <div class="hw-deadline">📅 Дедлайн: ${currentHomework.deadline}</div>
        </div>
    `;
    
    for (let level of currentHomework.levels) {
        html += `
            <div class="hw-card" data-level="${level.level}">
                <div class="hw-level ${level.level === 1 ? 'easy' : (level.level === 2 ? 'medium' : 'hard')}">
                    ${level.name}
                </div>
                <div class="hw-title">${level.title}</div>
                <div class="hw-description">${level.description}</div>
                
                <div class="hw-section">
                    <div class="hw-section-title">📌 Пример</div>
                    <div class="hw-example">${level.example.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div class="hw-section">
                    <div class="hw-section-title">💡 Подсказка</div>
                    <div class="hw-hint">${level.hint}</div>
                </div>
                
                <div class="hw-section">
                    <div class="hw-section-title">📚 Что тренируем</div>
                    <div class="hw-topics">${level.topics.map(t => `🔹 ${t}`).join(' ')}</div>
                </div>
                
                <button class="hw-submit-btn" data-level="${level.level}">
                    📤 Сдать этот уровень
                </button>
            </div>
        `;
    }
    
    container.innerHTML = html;
    
    // Навешиваем обработчики на кнопки сдачи
    document.querySelectorAll('.hw-submit-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const level = btn.getAttribute('data-level');
            showCodeSubmitModal(parseInt(level));
        });
    });
}

// ========== МОДАЛКА ДЛЯ ОТПРАВКИ КОДА ==========
function showCodeSubmitModal(level) {
    const levelNames = { 1: "🟢 Уровень 1", 2: "🟡 Уровень 2", 3: "🔴 Уровень 3" };
    
    const modalHtml = `
        <div id="code-modal" class="modal-overlay">
            <div class="modal-window">
                <div class="modal-header">
                    <span>📤 Сдать ${levelNames[level]}</span>
                    <button class="modal-close" onclick="closeModal()">✕</button>
                </div>
                <div class="modal-body">
                    <textarea id="modal-code-input" placeholder="Вставь сюда свой код..." rows="8"></textarea>
                </div>
                <div class="modal-footer">
                    <button class="modal-cancel" onclick="closeModal()">Отмена</button>
                    <button class="modal-submit" onclick="submitCodeFromModal(${level})">Отправить</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
    hapticFeedback("medium");
}

window.closeModal = function() {
    const modal = document.getElementById("code-modal");
    if (modal) modal.remove();
}

window.submitCodeFromModal = function(level) {
    const code = document.getElementById("modal-code-input")?.value;
    if (!code.trim()) {
        alert("❌ Введи код решения!");
        return;
    }
    
    const levelNames = { 1: "🟢 Уровень 1", 2: "🟡 Уровень 2", 3: "🔴 Уровень 3" };
    
    if (tg) {
        tg.sendData(JSON.stringify({
            action: "submit_hw",
            level: level,
            level_name: levelNames[level],
            code: code,
            user_id: userId,
            user_name: userName
        }));
        
        alert(`✅ Код отправлен на проверку!\n\nУровень: ${levelNames[level]}`);
        hapticFeedback("success");
        closeModal();
    } else {
        alert(`❌ Отправь код боту @ProgClubBot_bot\n\n/hw submit ${level}\n\n${code}`);
    }
}

// ========== НАВИГАЦИЯ ==========
document.querySelectorAll(".bottom-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const page = btn.getAttribute("data-page");
        hapticFeedback("light");
        document.querySelectorAll(".bottom-nav-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(`page-${page}`).classList.add("active");
        
        if (page === "top") loadTopList();
        if (page === "profile") loadProfile();
        if (page === "lessons") loadLessons();
        if (page === "home") loadFullHomework();
    });
});

// ========== ТАБЛИЦА ЛИДЕРОВ ==========
async function loadTopList() {
    const topContainer = document.getElementById("top-list");
    const users = [
        { name: "CeTzY", exp: 150, rank: "🐍 Питонист" },
        { name: "Скоро тут будешь ты", exp: 0, rank: "🥚 Новичок" }
    ];
    
    topContainer.innerHTML = "";
    users.forEach((user, index) => {
        const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : `${index + 1}.`;
        const item = document.createElement("div");
        item.className = "top-item";
        item.innerHTML = `
            <div class="top-medal">${medal}</div>
            <div class="top-name">${user.name}</div>
            <div class="top-exp">${user.exp} опыта</div>
            <div class="top-rank">${user.rank}</div>
        `;
        topContainer.appendChild(item);
    });
}

// ========== ПРОФИЛЬ ==========
async function loadProfile() {
    if (!userId) {
        document.getElementById("user-points").innerText = "?";
        document.getElementById("user-hw-done").innerText = "?";
        document.getElementById("user-level").innerText = "?";
        document.getElementById("user-rank").innerText = "Авторизуйся в Telegram";
        return;
    }
    
    document.getElementById("user-points").innerText = "25";
    document.getElementById("user-hw-done").innerText = "3";
    document.getElementById("user-level").innerText = "3";
    document.getElementById("user-rank").innerText = "🐍 Питонист";
    document.getElementById("exp-fill").style.width = "50%";
    document.getElementById("exp-text").innerText = "150 / 300 опыта";
}

// ========== УРОКИ ==========
function loadLessons() {
    const lessonsGrid = document.getElementById("lessons-list");
    const lessons = [
        { num: 1, title: "Переменные", desc: "Типы данных: str, int, float, bool", duration: "15 мин", level: "⭐" },
        { num: 2, title: "Вывод и ввод", desc: "print() и input()", duration: "12 мин", level: "⭐" },
        { num: 3, title: "Условия", desc: "if, elif, else", duration: "18 мин", level: "⭐⭐" },
        { num: 4, title: "Операторы", desc: "Арифметика и логика", duration: "20 мин", level: "⭐⭐" },
        { num: 5, title: "Циклы", desc: "while и for", duration: "25 мин", level: "⭐⭐⭐" }
    ];
    
    lessonsGrid.innerHTML = "";
    lessons.forEach(lesson => {
        const card = document.createElement("div");
        card.className = "lesson-card";
        card.onclick = () => {
            hapticFeedback("medium");
            window.open("https://t.me/CeTzYPythonLessons", "_blank");
        };
        card.innerHTML = `
            <div class="lesson-number">0${lesson.num}</div>
            <div class="lesson-info">
                <h3>${lesson.title}</h3>
                <p>${lesson.desc}</p>
                <div class="lesson-meta"><span>📖 ${lesson.duration}</span><span>${lesson.level}</span></div>
            </div>
        `;
        lessonsGrid.appendChild(card);
    });
}

// ========== ЗАГРУЗКА ==========
loadFullHomework();
loadLessons();

console.log("%c🚀 Programming Cub Mini App — развёрнутое ДЗ и отправка!", "color: #00ff88; font-size: 16px;");