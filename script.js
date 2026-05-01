// Mobile menu toggle
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');

if (mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '97px';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'var(--bg-dark)';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid var(--border)';
            navLinks.style.zIndex = '100';
        }
    });
}

// Кликабельные quick-карточки
const quickCards = document.querySelectorAll('.quick-card');
quickCards.forEach(card => {
    card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        if (url) window.open(url, '_blank');
    });
});

// Навигация
const navChat = document.getElementById('nav-chat');
const navLessons = document.getElementById('nav-lessons');
const navHome = document.getElementById('nav-home');

if (navChat) {
    navChat.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://t.me/programming_club_CeTzY', '_blank');
    });
}
if (navLessons) {
    navLessons.addEventListener('click', (e) => {
        e.preventDefault();
        window.open('https://t.me/CeTzYPythonLessons', '_blank');
    });
}
if (navHome) {
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// КАРТОЧКИ УРОКОВ
const lessonCards = document.querySelectorAll('.lesson-card');
console.log('Найдено карточек уроков:', lessonCards.length);

function openLesson(lessonNum) {
    console.log('Открываем урок:', lessonNum);
    
    const modal = document.getElementById('lesson-modal');
    const modalBody = document.getElementById('modal-body');
    
    // Контент уроков с ИСПРАВЛЕННЫМИ ссылками
    const lessonsContent = {
        1: `
            <div class="lesson-content">
                <h1>📦 Урок 1: Переменные</h1>
                <p><strong>Переменная</strong> — это как коробка с наклейкой, в которой лежат данные. Наклейка — имя переменной.</p>
                
                <div class="code-example">
                    <code>name = "CeTzY"<br>age = 16</code>
                </div>
                <p><code>name</code> и <code>age</code> — названия переменных, <code>"CeTzY"</code> и <code>16</code> — значения.</p>
                
                <h2>📌 Типы данных:</h2>
                <ul>
                    <li><strong>str (строка)</strong> — текст в кавычках: <code>"Привет"</code></li>
                    <li><strong>int (целое число)</strong> — без кавычек: <code>10, 42</code></li>
                    <li><strong>float (дробное)</strong> — с точкой: <code>3.14, 0.5</code></li>
                    <li><strong>bool (логический)</strong> — <code>True / False</code> (с большой буквы!)</li>
                </ul>
                
                <div class="code-example">
                    <code>city = "Moscow"      # str<br>age = 18            # int<br>pi = 3.14           # float<br>is_valid = True     # bool</code>
                </div>
                
                <p>❗ <strong>Важно:</strong> Числовые типы (int, float) нельзя заключать в кавычки, иначе Python будет думать, что это текст.</p>
                
                <div class="task">
                    <h4>✅ ЗАДАНИЕ:</h4>
                    <ol>
                        <li>Создай переменную с текстом</li>
                        <li>Создай переменную с целым числом</li>
                        <li>Выведи обе на экран через print()</li>
                        <li>Создай две числовые переменные и выполни с ними действия (+, -, *, /)</li>
                    </ol>
                </div>
                
                <hr>
                <p>💡 Если непонятно — пиши <strong><a href="https://t.me/CeTzY" target="_blank" style="color: var(--primary);">@CeTzY</a></strong> в Telegram, объясню в личке!</p>
            </div>
        `,
        2: `
            <div class="lesson-content">
                <h1>🖥️ Урок 2: Вывод и ввод</h1>
                <p><strong>Вывод</strong> — программа говорит тебе. <strong>Ввод</strong> — ты говоришь программе.</p>
                
                <h2>📤 print() — вывод на экран</h2>
                <div class="code-example">
                    <code>print("Привет")<br>print(42)</code>
                </div>
                
                <h2>📥 input() — ввод с клавиатуры</h2>
                <div class="code-example">
                    <code>name = input("Как тебя зовут? ")<br>print("Привет,", name)</code>
                </div>
                
                <p>❗ <strong>Важно:</strong> input() всегда возвращает текст (str). Если нужны числа — превращаем:</p>
                <div class="code-example">
                    <code>age = int(input("Сколько лет? "))</code>
                </div>
                
                <div class="task">
                    <h4>✅ ЗАДАНИЕ:</h4>
                    <ol>
                        <li>Спроси имя пользователя</li>
                        <li>Спроси год рождения</li>
                        <li>Вычисли возраст (2026 - год_рождения)</li>
                        <li>Выведи "Привет, X! Тебе Y лет"</li>
                    </ol>
                </div>
                <hr>
                <p>💡 Если непонятно — пиши <strong><a href="https://t.me/CeTzY" target="_blank" style="color: var(--primary);">@CeTzY</a></strong> в Telegram, объясню в личке!</p>
            </div>
        `,
        3: `
            <div class="lesson-content">
                <h1>🔀 Урок 3: Условия (if, elif, else)</h1>
                <p>Условия помогают программе выбирать, что делать в зависимости от ситуации.</p>
                
                <div class="code-example">
                    <code>age = 18<br><br>if age >= 18:<br>    print("Ты взрослый")<br>else:<br>    print("Ты ещё ребёнок")</code>
                </div>
                
                <h2>📌 Операторы сравнения:</h2>
                <ul>
                    <li><code>==</code> — равно</li>
                    <li><code>!=</code> — не равно</li>
                    <li><code>></code>, <code><</code>, <code>>=</code>, <code><=</code></li>
                </ul>
                
                <h2>📌 Логические операторы:</h2>
                <ul>
                    <li><code>and</code> — и (оба условия истинны)</li>
                    <li><code>or</code> — или (хотя бы одно истинно)</li>
                    <li><code>not</code> — не (меняет наоборот)</li>
                </ul>
                
                <div class="task">
                    <h4>✅ ЗАДАНИЕ:</h4>
                    <ol>
                        <li>Спроси возраст пользователя</li>
                        <li>Если меньше 18 → "Доступ запрещён"</li>
                        <li>Если 18–65 → "Доступ разрешён"</li>
                        <li>Если больше 65 → "Тебе нужно отдохнуть"</li>
                    </ol>
                </div>
                <hr>
                <p>💡 Если непонятно — пиши <strong><a href="https://t.me/CeTzY" target="_blank" style="color: var(--primary);">@CeTzY</a></strong> в Telegram, объясню в личке!</p>
            </div>
        `,
        4: `
            <div class="lesson-content">
                <h1>🧮 Урок 4: Арифметические и логические операторы</h1>
                
                <h2>➕ Арифметические операторы:</h2>
                <ul>
                    <li><code>+</code> — сложение</li>
                    <li><code>-</code> — вычитание</li>
                    <li><code>*</code> — умножение</li>
                    <li><code>/</code> — деление (всегда float)</li>
                    <li><code>//</code> — целочисленное деление</li>
                    <li><code>%</code> — остаток от деления</li>
                    <li><code>**</code> — возведение в степень</li>
                </ul>
                
                <div class="code-example">
                    <code>a = 10<br>b = 3<br>print(a + b)   # 13<br>print(a % b)    # 1 (остаток)</code>
                </div>
                
                <h2>🎯 Приоритет операторов:</h2>
                <p>Сначала <code>**</code>, потом <code>* / // %</code>, потом <code>+ -</code>, потом сравнения, потом <code>and/or</code>.</p>
                
                <div class="task">
                    <h4>✅ ЗАДАНИЕ:</h4>
                    <ol>
                        <li>Спроси у пользователя два числа</li>
                        <li>Выведи сумму, разность, произведение, частное и остаток</li>
                        <li>Спроси возраст и выведи "Доступ разрешён" если 18-65</li>
                    </ol>
                </div>
                <hr>
                <p>💡 Если непонятно — пиши <strong><a href="https://t.me/CeTzY" target="_blank" style="color: var(--primary);">@CeTzY</a></strong> в Telegram, объясню в личке!</p>
            </div>
        `,
        5: `
            <div class="lesson-content">
                <h1>🔄 Урок 5: Циклы (while и for)</h1>
                <p>Циклы — заставляют программу делать одно и то же много раз.</p>
                
                <h2>while — "пока условие верно"</h2>
                <div class="code-example">
                    <code>count = 1<br>while count <= 5:<br>    print(count)<br>    count += 1</code>
                </div>
                
                <h2>for — "для каждого элемента"</h2>
                <div class="code-example">
                    <code>for i in range(1, 6):<br>    print(i)</code>
                </div>
                
                <h2>break и continue:</h2>
                <ul>
                    <li><code>break</code> — выйти из цикла</li>
                    <li><code>continue</code> — пропустить шаг</li>
                </ul>
                
                <div class="task">
                    <h4>✅ ЗАДАНИЕ:</h4>
                    <ol>
                        <li>Выведи все чётные числа от 2 до 20</li>
                        <li>Сделай игру "Угадай число" (загадай 7, давай подсказки "больше/меньше")</li>
                    </ol>
                </div>
                <hr>
                <p>💡 Если непонятно — пиши <strong><a href="https://t.me/CeTzY" target="_blank" style="color: var(--primary);">@CeTzY</a></strong> в Telegram, объясню в личке!</p>
            </div>
        `
    };
    
    if (modalBody && lessonsContent[lessonNum]) {
        modalBody.innerHTML = lessonsContent[lessonNum];
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    } else {
        alert('Урок временно недоступен. Загляни в Telegram-канал!');
        window.open('https://t.me/CeTzYPythonLessons', '_blank');
    }
}

// Навешиваем обработчики на карточки уроков
lessonCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const lessonNum = card.getAttribute('data-lesson');
        if (lessonNum) {
            openLesson(parseInt(lessonNum));
        }
    });
});

// Ссылки в футере на уроки
const footerLessonLinks = document.querySelectorAll('.footer-section a[data-lesson]');
footerLessonLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const lessonNum = link.getAttribute('data-lesson');
        if (lessonNum) openLesson(parseInt(lessonNum));
    });
});

// Закрытие модалки
const modal = document.getElementById('lesson-modal');
const closeBtn = document.querySelector('.close');

if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
};

// Анимация появления
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.lesson-card, .quick-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Консоль
console.log('%c🚀 Programming Cub | Уроки Python от CeTzY', 'color: #00ff88; font-size: 16px; font-family: monospace;');
console.log('%c💬 Чат: https://t.me/programming_club_CeTzY', 'color: #00b8ff');
console.log('%c🐍 Уроки: https://t.me/CeTzYPythonLessons', 'color: #00ff88');
console.log('%c🤖 Бот: https://t.me/ProgClubBot_bot', 'color: #ffbb33');
console.log('%c📚 Кликни на любой урок — он откроется!', 'color: #00ff88');
console.log('%c💬 Контакт автора: https://t.me/CeTzY', 'color: #00ff88');