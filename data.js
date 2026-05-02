// ========== ДАННЫЕ ПРИЛОЖЕНИЯ ==========

// Текущее ДЗ (развёрнутое)
const HOMEWORK = {
    id: 2,
    title: "ЗАДАНИЯ НА НЕДЕЛЮ — PYTHON С НУЛЯ",
    deadline: "Воскресенье, 23:00",
    levels: [
        {
            level: 1,
            name: "🟢 Уровень 1 — новичок",
            title: "Сумма чётных чисел",
            description: "Напиши программу, которая считает сумму всех чётных чисел от 1 до N.",
            example: "Ввод: 10\nВывод: 30",
            hint: "Используй цикл for и проверку на чётность (число % 2 == 0)",
            topics: ["for", "if", "оператор %"]
        },
        {
            level: 2,
            name: "🟡 Уровень 2 — средний",
            title: "Обратный отсчёт",
            description: "Программа выводит обратный отсчёт от N до 1, в конце 'ПУСК!'",
            example: "Ввод: 5\n5 4 3 2 1 ПУСК!",
            hint: "Используй while или range с -1",
            topics: ["while", "range", "time.sleep"]
        },
        {
            level: 3,
            name: "🔴 Уровень 3 — профи",
            title: "Калькулятор с историей",
            description: "Программа поддерживает +, -, *, /, history, exit",
            example: "> +\n10\n5\nРезультат: 15",
            hint: "Используй while True и список для истории",
            topics: ["while True", "списки", "словари"]
        }
    ]
};

// Список уроков
const LESSONS = [
    { num: 1, title: "Переменные", desc: "Типы данных: str, int, float, bool", duration: "15 мин" },
    { num: 2, title: "Вывод и ввод", desc: "print() и input()", duration: "12 мин" },
    { num: 3, title: "Условия", desc: "if, elif, else", duration: "18 мин" },
    { num: 4, title: "Операторы", desc: "Арифметика и логика", duration: "20 мин" },
    { num: 5, title: "Циклы", desc: "while и for", duration: "25 мин" }
];

// Таблица лидеров (временная заглушка)
const TOP_USERS = [
    { name: "CeTzY", exp: 150, rank: "🐍 Питонист" },
    { name: "Скоро здесь будешь ты", exp: 0, rank: "🥚 Новичок" }
];

// Профиль (временная заглушка)
const USER_PROFILE = {
    name: "Загрузка...",
    exp: 0,
    points: 0,
    hwDone: 0,
    level: 1,
    rank: "🥚 Новичок",
    nextExp: 50
};