// ========== TELEGRAM WEB APP API ==========
let tg = window.Telegram?.WebApp;
let userData = null;

if (tg) {
    // Сообщаем Telegram, что приложение готово
    tg.ready();
    tg.expand(); // Раскрываем на весь экран
    
    // Получаем данные пользователя
    userData = tg.initDataUnsafe?.user;
    
    if (userData) {
        const firstName = userData.first_name || '';
        const lastName = userData.last_name || '';
        const username = userData.username || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        // Приветствие с именем пользователя
        const greetingEl = document.getElementById('user-greeting');
        if (greetingEl) {
            if (fullName) {
                greetingEl.innerHTML = `> Привет, <span style="color: var(--primary);">${fullName}</span>! Добро пожаловать в Programming Cub 🚀`;
            } else if (username) {
                greetingEl.innerHTML = `> Привет, @${username}! Рад видеть тебя в клубе 🔥`;
            } else {
                greetingEl.innerHTML = `> Добро пожаловать в Programming Cub! Учим код без боли 🐍`;
            }
        }
        
        // Отправляем данные аналитики (опционально)
        console.log('Пользователь в Telegram:', { id: userData.id, fullName, username });
    } else {
        document.getElementById('user-greeting').innerHTML = '> Добро пожаловать в Programming Cub! 🚀';
    }
    
    // Настройка главной кнопки (если нужна)
    tg.MainButton?.hide();
} else {
    console.log('Запущено вне Telegram');
    document.getElementById('user-greeting').innerHTML = '> Добро пожаловать в Programming Cub! 🚀';
}

// ========== HAPTIC FEEDBACK ==========
function hapticFeedback(style = 'light') {
    if (tg?.HapticFeedback) {
        switch(style) {
            case 'light':
                tg.HapticFeedback.impactOccurred('light');
                break;
            case 'medium':
                tg.HapticFeedback.impactOccurred('medium');
                break;
            case 'heavy':
                tg.HapticFeedback.impactOccurred('heavy');
                break;
            case 'success':
                tg.HapticFeedback.notificationOccurred('success');
                break;
            case 'error':
                tg.HapticFeedback.notificationOccurred('error');
                break;
            default:
                tg.HapticFeedback.impactOccurred('light');
        }
    }
}

// ========== SHARE FUNCTION ==========
function shareLesson(lessonNum, lessonTitle) {
    const shareText = `📚 Programming Cub — Урок ${lessonNum}: ${lessonTitle}\n\nИзучай Python с нуля в нашем клубе! Бесплатные уроки, чат и помощь.\n\n🚀 Открыть бота: https://t.me/ProgClubBot_bot`;
    
    if (tg && tg.shareToStory) {
        // Telegram Mini App native share
        tg.shareToStory(shareText, {
            widget_link: {
                url: 'https://t.me/ProgClubBot_bot',
                name: 'Programming Cub'
            }
        });
        hapticFeedback('success');
    } else if (navigator.share) {
        // Web Share API (мобильные браузеры)
        navigator.share({
            title: `Урок ${lessonNum}: ${lessonTitle}`,
            text: shareText,
            url: 'https://t.me/ProgClubBot_bot'
        }).then(() => hapticFeedback('success'));
    } else {
        // Fallback: копируем в буфер
        navigator.clipboard.writeText(shareText);
        alert('Ссылка скопирована! Отправь её другу в Telegram 😊');
        hapticFeedback('light');
    }
}

// ========== BOTTOM MENU ==========
const bottomMenu = document.querySelector('.bottom-menu');
let menuVisible = false;

// Показываем меню при скролле вверх/вниз
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY + 10) {
        // Скролл вниз — скрываем меню
        if (menuVisible) {
            bottomMenu.classList.remove('visible');
            menuVisible = false;
        }
    } else if (currentScrollY < lastScrollY - 10) {
        // Скролл вверх — показываем меню
        if (!menuVisible) {
            bottomMenu.classList.add('visible');
            menuVisible = true;
            setTimeout(() => {
                if (!menuVisible) return;
                bottomMenu.classList.remove('visible');
                menuVisible = false;
            }, 2000);
        }
    }
    lastScrollY = currentScrollY;
});

// Нажатие на кнопки меню
document.querySelectorAll('.menu-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        hapticFeedback('light');
        
        switch(action) {
            case 'chat':
                window.open('https://t.me/programming_club_CeTzY', '_blank');
                break;
            case 'lessons':
                document.querySelector('.lessons-grid')?.scrollIntoView({ behavior: 'smooth' });
                break;
            case 'bot':
                window.open('https://t.me/ProgClubBot_bot', '_blank');
                break;
            case 'share':
                shareLesson('все', 'Все уроки Python');
                break;
        }
    });
});

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
        hapticFeedback('light');
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
        hapticFeedback('light');
        window.open('https://t.me/programming_club_CeTzY', '_blank');
    });
}
if (navLessons) {
    navLessons.addEventListener('click', (e) => {
        e.preventDefault();
        hapticFeedback('light');
        window.open('https://t.me/CeTzYPythonLessons', '_blank');
    });
}
if (navHome) {
    navHome.addEventListener('click', (e) => {
        e.preventDefault();
        hapticFeedback('light');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// КАРТОЧКИ УРОКОВ
const lessonCards = document.querySelectorAll('.lesson-card');
let currentLessonNum = null;

function openLesson(lessonNum) {
    currentLessonNum = lessonNum;
    hapticFeedback('medium');
    
    const modal = document.getElementById('lesson-modal');
    const modalBody = document.getElementById('modal-body');
    
    const lessonTitles = {
        1: 'Переменные', 2: 'Вывод и ввод', 3: 'Условия',
        4: 'Арифметика и логика', 5: 'Циклы'
    };
    const lessonTitle = lessonTitles[lessonNum];
    
    const lessonsContent = {
        1: `...` // тут твой полный контент урока 1 (как в прошлый раз)
    };
    
    if (modalBody && lessonsContent[lessonNum]) {
        modalBody.innerHTML = lessonsContent[lessonNum];
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        // Добавляем кнопку шеринга внутри урока
        const shareInModal = modalBody.querySelector('#share-lesson-in-modal');
        if (!shareInModal) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'tg-link';
            shareBtn.style.marginTop = '16px';
            shareBtn.style.cursor = 'pointer';
            shareBtn.innerHTML = '<span>📤</span> Поделиться этим уроком';
            shareBtn.onclick = () => shareLesson(lessonNum, lessonTitle);
            modalBody.appendChild(shareBtn);
        }
    } else if (modalBody) {
        modalBody.innerHTML = '<p>Урок временно недоступен. Загляни в Telegram-канал!</p>';
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Навешиваем обработчики на карточки уроков с вибрацией
lessonCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.stopPropagation();
        const lessonNum = card.getAttribute('data-lesson');
        if (lessonNum) openLesson(parseInt(lessonNum));
    });
});

// Кнопка "Поделиться уроком" в модалке
const shareLessonBtn = document.getElementById('share-lesson-btn');
if (shareLessonBtn) {
    shareLessonBtn.addEventListener('click', () => {
        if (currentLessonNum) {
            const titles = {1:'Переменные',2:'Вывод и ввод',3:'Условия',4:'Арифметика и логика',5:'Циклы'};
            shareLesson(currentLessonNum, titles[currentLessonNum]);
        } else {
            shareLesson('все', 'Все уроки Python');
        }
    });
}

// Закрытие модалки
const modal = document.getElementById('lesson-modal');
const closeBtn = document.querySelector('.close');

if (closeBtn) {
    closeBtn.onclick = function() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        hapticFeedback('light');
    };
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
        hapticFeedback('light');
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
console.log('%c🚀 Programming Cub | Полная интеграция с Telegram!', 'color: #00ff88; font-size: 16px; font-family: monospace;');
if (tg && userData) {
    console.log('%c✅ Telegram Web App API подключён', 'color: #00ff88');
    console.log('%c✅ Haptic Feedback готов', 'color: #00ff88');
    console.log('%c✅ Пользователь авторизован', 'color: #00ff88');
}