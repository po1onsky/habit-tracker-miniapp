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

function updateMonthLabel() {
    const label = document.getElementById('currentMonthLabel');
    const date = new Date(currentYear, currentMonth);

    label.innerText = date.toLocaleString('ru-RU', {
        month: 'long',
        year: 'numeric'
    });
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

document.getElementById('prevMonth').addEventListener('click', () => {
    currentMonth--;

    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }

    renderCalendar();
    renderHabits();
});

document.getElementById('nextMonth').addEventListener('click', () => {
    currentMonth++;

    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }

    renderCalendar();
    renderHabits();
});


// ---- Функции ----
function renderHabits() {
    habitsContainer.innerHTML = '';

    habits.forEach(habit => {
    const habitDiv = document.createElement('div');
    const streak = calculateStreak(habit);
    const completion = calculateMonthCompletion(
    habit,
    currentYear,
    currentMonth
);

    habitDiv.innerHTML = `
    <span>
        ${habit.name}
        <small>🔥 ${streak}</small>
        <small>📊 ${completion}%</small>
    </span>
    <div>
        <button onclick="selectHabit(${habit.id})">📅</button>
        <button onclick="deleteHabit(${habit.id})">🗑️</button>
    </div>
`;
    habitsContainer.appendChild(habitDiv);
});
    renderSummary()
}

    const today = getToday();

function selectHabit(id) {
    selectedHabitId = id;
    renderCalendar();
}
let currentYear = new Date().getFullYear();
let currentMonth = new Date().getMonth(); // 0–11

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

    const year = currentYear;
    const month = currentMonth;
    const today = getToday();
    const daysInMonth = getDaysInMonth(year, month);

updateMonthLabel();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        const dayEl = document.createElement('div');
        dayEl.className = 'day';

        if (habit.history[date]) {
            dayEl.classList.add('done');
        }
        if (
    date === today &&
    year === new Date().getFullYear() &&
    month === new Date().getMonth()
) {
    dayEl.classList.add('today');
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

function renderSummary() {
    const el = document.getElementById('totalProgress');
    if (!el) return;

    el.innerText = `${calculateTotalProgress()}%`;
}

function deleteHabit(id) {
    const confirmDelete = confirm('Удалить привычку?');

    if (!confirmDelete) return;

    habits = habits.filter(habit => habit.id !== id);

    if (selectedHabitId === id) {
        selectedHabitId = null;
        calendarEl.innerHTML = '<p>Привычка удалена</p>';
    }

    saveHabits();
    renderHabits();
}

function calculateStreak(habit) {
    let streak = 0;
    let currentDate = new Date(getToday());

    while (true) {
        const dateKey = currentDate.toISOString().split('T')[0];

        if (habit.history[dateKey] === true) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else {
            break;
        }
    }

    return streak;
}
function calculateMonthCompletion(habit, year, month) {
     if (!habit.history) return 0;

    const daysInMonth = getDaysInMonth(year, month);
    let completedDays = 0;

    for (let day = 1; day <= daysInMonth; day++) {
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

        if (habit.history[dateKey] === true) {
            completedDays++;
        }
    }

    return Math.round((completedDays / daysInMonth) * 100);
}
function calculateTotalProgress() {
    if (habits.length === 0) return 0;

    let total = 0;

    habits.forEach(habit => {
        total += calculateMonthCompletion(
            habit,
            currentYear,
            currentMonth
        );
    });

    return Math.round(total / habits.length);
}

function renderSummary() {
    const totalProgressEl = document.getElementById('totalProgress');
    totalProgressEl.innerText = `${calculateTotalProgress()}%`;
}


// ---- Первый рендер ----
renderHabits();
