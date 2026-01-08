const tg = window.Telegram.WebApp;
tg.ready();

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentMonthInfo() {
    const now = new Date();
    return {
        year: now.getFullYear(),
        month: now.getMonth() // 0-11
    };
}

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

// ---- Пользователь ----
const user = tg.initDataUnsafe?.user;
if (user) {
    document.getElementById('username').innerText =
        `Привет, ${user.first_name}!`;
}

// ---- Данные ----
let habits = JSON.parse(localStorage.getItem('habits')) || [];

// ---- Элементы ----
const habitsContainer = document.getElementById('habits');
const addHabitBtn = document.getElementById('addHabitBtn');

// ---- Функции ----
function renderHabits() {
    habitsContainer.innerHTML = '';

    habits.forEach(habit => {
        const habitDiv = document.createElement('div');

        habitDiv.innerHTML = `
            <span>${habit.name}</span>
            <button onclick="selectHabit(${habit.id})">
                Открыть календарь
            </button>
        `;

        habitsContainer.appendChild(habitDiv);
    });
}

    const today = getToday();

function selectHabit(id) {
    selectedHabitId = id;
    renderCalendar();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// ---- Добавление привычки ----
addHabitBtn.addEventListener('click', () => {
    const name = prompt('Введите название привычки');

    if (!name) return;

  habits.push({
    id: Date.now(),
    name: name,
    history: {}
});

    saveHabits();
    renderHabits();
});
const calendarEl = document.getElementById('calendar');
let selectedHabitId = null;

function renderCalendar() {
    calendarEl.innerHTML = '';

    if (!selectedHabitId) {
        calendarEl.innerHTML = '<p>Выбери привычку</p>';
        return;
    }

    const habit = habits.find(h => h.id === selectedHabitId);
    if (!habit) return;

    const { year, month } = getCurrentMonthInfo();
    const daysInMonth = getDaysInMonth(year, month);

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const dayEl = document.createElement('div');
        dayEl.className = 'day';

        if (habit.history[date]) {
            dayEl.classList.add('done');
        }

        dayEl.innerText = day;

        dayEl.addEventListener('click', () => {
            habit.history[date] = !habit.history[date];
            saveHabits();
            renderCalendar();
            renderHabits();
        });

        calendarEl.appendChild(dayEl);
    }
}



// ---- Первый рендер ----
renderHabits();

