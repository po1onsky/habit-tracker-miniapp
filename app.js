const tg = window.Telegram.WebApp;
tg.ready();

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

    habits.forEach((habit, index) => {
        const habitDiv = document.createElement('div');

        habitDiv.innerHTML = `
            <span>
                ${habit.done ? '🟢' : '⚪'} ${habit.name}
            </span>
            <button onclick="toggleHabit(${index})">
                Отметить
            </button>
        `;

        habitsContainer.appendChild(habitDiv);
    });
}

function toggleHabit(index) {
    habits[index].done = !habits[index].done;
    saveHabits();
    renderHabits();
}

function saveHabits() {
    localStorage.setItem('habits', JSON.stringify(habits));
}

// ---- Добавление привычки ----
addHabitBtn.addEventListener('click', () => {
    const name = prompt('Введите название привычки');

    if (!name) return;

    habits.push({
        name: name,
        done: false
    });

    saveHabits();
    renderHabits();
});

// ---- Первый рендер ----
renderHabits();

