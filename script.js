// ========== TELEGRAM WEB APP ==========
let tg = window.Telegram?.WebApp;
let userId = null;
let userName = "";
let selectedLevel = null;

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
        const styles = { light: "light", medium: "medium", heavy: "heavy", success: "success", error: "error" };
        const method = style === "success" || style === "error" ? "notificationOccurred" : "impactOccurred";
        if (method === "notificationOccurred") tg.HapticFeedback.notificationOccurred(style);
        else tg.HapticFeedback.impactOccurred(styles[style] || "light");
    }
}

// ========== НАВИГАЦИЯ ==========
document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.addEventListener("click", () => {
        const page = tab.getAttribute("data-page");
        hapticFeedback("light");
        document.querySelectorAll(".nav-tab").forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
        document.getElementById(`page-${page}`).classList.add("active");
        if (page === "top") loadTopList();
        if (page === "profile") loadProfile();
        if (page === "lessons") loadLessons();
        if (page === "home") loadCurrentHW();
    });
});

// ========== ЗАГРУЗКА ТЕКУЩЕГО ДЗ ==========
async function loadCurrentHW() {
    const hwContent = document.getElementById("hw-content");
    hwContent.innerHTML = "🐍 Загрузка...";
    
    try {
        const response = await fetch("https://cetzy.github.io/ProgrammingCub/api/hw.json");
        const data = await response.json();
        hwContent.innerHTML = `
<span class="prompt">$</span> /hw --current

📚 *Домашнее задание #${data.id}*
📌 ${data.title}

————————————

🎯 Уровень 1: ${data.easy}

⚔️ Уровень 2: ${data.medium}

💀 Уровень 3: ${data.hard}

————————————

📅 Дедлайн: ${data.deadline}
🏆 Награда: +15 / +30 / +60 опыта
        `;
    } catch(e) {
        hwContent.innerHTML = `
<span class="prompt">$</span> /hw --current

❌ Не удалось загрузить ДЗ.

📝 Напиши /hw в боте @ProgClubBot_bot
        `;
    }
}

// ========== ВЫБОР УРОВНЯ ==========
document.querySelectorAll(".level-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("selected"));
        btn.classList.add("selected");
        selectedLevel = btn.getAttribute("data-level");
        hapticFeedback("medium");
    });
});

// ========== ОТПРАВКА КОДА ==========
document.getElementById("submit-code-btn")?.addEventListener("click", async () => {
    const code = document.getElementById("code-input").value;
    if (!selectedLevel) {
        alert("❌ Выбери уровень сложности!");
        hapticFeedback("error");
        return;
    }
    if (!code.trim()) {
        alert("❌ Введи код решения!");
        hapticFeedback("error");
        return;
    }
    
    const submitBtn = document.getElementById("submit-code-btn");
    const originalText = submitBtn.innerText;
    submitBtn.innerText = "⏳ Отправка...";
    submitBtn.disabled = true;
    
    const levelNames = { 1: "🟢 Уровень 1", 2: "🟡 Уровень 2", 3: "🔴 Уровень 3" };
    
    if (tg) {
        tg.sendData(JSON.stringify({
            action: "submit_hw",
            level: selectedLevel,
            level_name: levelNames[selectedLevel],
            code: code,
            user_id: userId,
            user_name: userName
        }));
        alert(`✅ Код отправлен на проверку администратору!\n\nУровень: ${levelNames[selectedLevel]}\nОбычно проверка занимает до 24 часов.`);
        hapticFeedback("success");
        document.getElementById("code-input").value = "";
        selectedLevel = null;
        document.querySelectorAll(".level-btn").forEach(b => b.classList.remove("selected"));
    } else {
        alert(`❌ Отправь этот код боту @ProgClubBot_bot\n\nКоманда: /hw submit ${selectedLevel}\n\nКод:\n${code.substring(0, 200)}...`);
        hapticFeedback("light");
    }
    
    submitBtn.innerText = originalText;
    submitBtn.disabled = false;
});

// ========== ЗАГРУЗКА ТАБЛИЦЫ ЛИДЕРОВ ==========
async function loadTopList() {
    const topContainer = document.getElementById("top-list");
    topContainer.innerHTML = '<div class="loading">🏆 Загрузка таблицы лидеров...</div>';
    
    try {
        const response = await fetch("https://cetzy.github.io/ProgrammingCub/api/top.json");
        const users = await response.json();
        
        if (!users || users.length === 0) {
            topContainer.innerHTML = '<div class="loading">📭 Пока никого нет. Стань первым!</div>';
            return;
        }
        
        topContainer.innerHTML = "";
        users.forEach((user, index) => {
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}.`;
            const item = document.createElement("div");
            item.className = "top-item";
            item.innerHTML = `
                <div class="top-medal">${medal}</div>
                <div class="top-name">${user.name}</div>
                <div class="top-exp">${user.exp} опыта</div>
                <div class="top-rank">${user.rank || "Участник"}</div>
            `;
            topContainer.appendChild(item);
        });
    } catch(e) {
        topContainer.innerHTML = '<div class="loading">❌ Временно недоступно. Напиши /hw top в боте @ProgClubBot_bot</div>';
    }
}

// ========== ЗАГРУЗКА ПРОФИЛЯ ==========
async function loadProfile() {
    if (!userId) {
        document.getElementById("user-points").innerText = "?";
        document.getElementById("user-hw-done").innerText = "?";
        document.getElementById("user-level").innerText = "?";
        document.getElementById("user-rank").innerText = "Авторизуйся в Telegram";
        return;
    }
    
    try {
        const response = await fetch(`https://cetzy.github.io/ProgrammingCub/api/user.json?id=${userId}`);
        const data = await response.json();
        
        document.getElementById("user-points").innerText = data.points || 0;
        document.getElementById("user-hw-done").innerText = data.hw_done || 0;
        document.getElementById("user-level").innerText = data.level || 1;
        
        const rankNames = {
            1: "🥚 Новичок", 2: "📖 Ученик", 3: "💻 Кодер",
            4: "🐍 Питонист", 5: "⚔️ Разработчик", 6: "🚀 Продвинутый",
            7: "🔥 Профи", 8: "👑 Мастер", 9: "💎 Эксперт", 10: "🏆 Легенда"
        };
        document.getElementById("user-rank").innerText = rankNames[data.level] || "🥚 Новичок";
        
        const expPercent = (data.exp / data.next_exp) * 100;
        document.getElementById("exp-fill").style.width = expPercent + "%";
        document.getElementById("exp-text").innerText = `${data.exp} / ${data.next_exp} опыта`;
    } catch(e) {
        document.getElementById("user-points").innerText = "0";
        document.getElementById("user-hw-done").innerText = "0";
        document.getElementById("user-level").innerText = "1";
        document.getElementById("exp-fill").style.width = "0%";
        document.getElementById("exp-text").innerText = "0 / 50 опыта";
    }
}

// ========== ЗАГРУЗКА СПИСКА УРОКОВ ==========
function loadLessons() {
    const lessonsGrid = document.getElementById("lessons-list");
    const lessons = [
        { num: 1, title: "Переменные", desc: "Что это вообще такое и для чего нужны. Типы данных", duration: "15 мин", level: "⭐", lang: "python" },
        { num: 2, title: "Вывод и ввод", desc: "print() и input(). Учимся общаться с программой", duration: "12 мин", level: "⭐", lang: "python" },
        { num: 3, title: "Условия", desc: "if, elif, else. Программа выбирает, что делать", duration: "18 мин", level: "⭐⭐", lang: "python" },
        { num: 4, title: "Арифметика и логика", desc: "Операторы, сравнения, приоритеты", duration: "20 мин", level: "⭐⭐", lang: "python" },
        { num: 5, title: "Циклы", desc: "while и for. Заставляем код повторяться", duration: "25 мин", level: "⭐⭐⭐", lang: "python" }
    ];
    
    lessonsGrid.innerHTML = "";
    lessons.forEach(lesson => {
        const card = document.createElement("div");
        card.className = "lesson-card";
        card.onclick = () => {
            hapticFeedback("medium");
            if (tg) {
                tg.sendData(JSON.stringify({ action: "open_lesson", lesson: lesson.num }));
            }
            window.open("https://t.me/CeTzYPythonLessons", "_blank");
        };
        card.innerHTML = `
            <div class="lesson-number">0${lesson.num}</div>
            <div class="lesson-info">
                <h3>${lesson.title}</h3>
                <p>${lesson.desc}</p>
                <div class="lesson-meta">
                    <span>📖 ${lesson.duration}</span>
                    <span>${lesson.level}</span>
                </div>
            </div>
        `;
        lessonsGrid.appendChild(card);
    });
}

// ========== TELEGRAM CALLBACK ==========
if (tg) {
    tg.onEvent("dataReceived", (data) => {
        console.log("Данные из бота:", data);
        try {
            const parsed = JSON.parse(data);
            if (parsed.type === "profile_update") {
                loadProfile();
            }
        } catch(e) {}
    });
}

// ========== ЗАГРУЗКА ПРИ СТАРТЕ ==========
loadCurrentHW();
loadLessons();

console.log("%c🚀 Programming Cub Mini App v2.0 запущен!", "color: #00ff88; font-size: 16px; font-family: monospace;");
console.log("%c🔥 Профиль, топ, уроки и сдача ДЗ — всё в одном приложении", "color: #00b8ff");