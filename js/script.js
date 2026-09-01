const STORAGE_KEY = "habitTrackerHabits";

const defaultHabits = [
    {
        id: 1,
        name: "Exercise",
        description: "Stay healthy and strong",
        category: "Fitness",
        frequency: "Daily",
        target: "30 min",
        streak: 0,
        longestStreak: 0,
        completed: false,
        active: true,
        icon: "accessibility",
        color: "fitness"
    },

    {
        id: 2,
        name: "Coding",
        description: "Improve my development skills",
        category: "Skills",
        frequency: "Daily",
        target: "2 hours",
        streak: 0,
        longestStreak: 0,
        completed: false,
        active: true,
        icon: "code-2",
        color: "skills"
    },

    {
        id: 3,
        name: "English Practice",
        description: "Improve my English",
        category: "Learning",
        frequency: "Daily",
        target: "1 hour",
        streak: 0,
        longestStreak: 0,
        completed: false,
        active: true,
        icon: "book-open",
        color: "learning"
    },

    {
        id: 4,
        name: "Reading",
        description: "Read useful books",
        category: "Personal",
        frequency: "Daily",
        target: "30 min",
        streak: 0,
        longestStreak: 0,
        completed: false,
        active: true,
        icon: "star",
        color: "personal"
    },

    {
        id: 5,
        name: "Meditation",
        description: "Clear my mind",
        category: "Personal",
        frequency: "Daily",
        target: "20 min",
        streak: 0,
        longestStreak: 0,
        completed: false,
        active: true,
        icon: "star",
        color: "personal"
    },

    {
        id: 6,
        name: "Business",
        description: "Grow my business",
        category: "Work",
        frequency: "Daily",
        target: "30 min",
        streak: 0,
        longestStreak: 0,
        completed: false,
        active: true,
        icon: "briefcase-business",
        color: "work"
    }
];

const dashboardState = {
    tab: "all",
    search: "",
    category: "All Categories"
};

const habitList = document.getElementById("habitList");
const categoryFilter = document.getElementById("categoryFilter");
const habitSearch = document.getElementById("habitSearch");
const habitCount = document.getElementById("habitCount");
const addHabitButton = document.getElementById("addHabitButton");
const calendarGrid = document.getElementById("calendarGrid");
const calendarMonthLabel = document.getElementById("calendarMonthLabel");
const prevMonthButton = document.getElementById("prevMonthButton");
const nextMonthButton = document.getElementById("nextMonthButton");
const dateButtonLabel = document.getElementById("dateButtonLabel");

const today = new Date();
const calendarState = {
    currentMonth: new Date(today.getFullYear(), today.getMonth(), 1),
    selectedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate())
};

function loadHabits() {
    try {
        const savedHabits = localStorage.getItem(STORAGE_KEY);

        if (!savedHabits) {
            return JSON.parse(JSON.stringify(defaultHabits));
        }

        const parsedHabits = JSON.parse(savedHabits);

        if (Array.isArray(parsedHabits) && parsedHabits.length) {
            return parsedHabits;
        }
    } catch (error) {
        console.error("Unable to load habits:", error);
    }

    return JSON.parse(JSON.stringify(defaultHabits));
}

function saveHabits() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

let habits = loadHabits();

function getFilteredHabits() {
    const query = dashboardState.search.trim().toLowerCase();

    return habits.filter(habit => {
        const matchesTab =
            dashboardState.tab === "all" ||
            (dashboardState.tab === "active" && habit.active !== false) ||
            (dashboardState.tab === "inactive" && habit.active === false);

        const matchesSearch =
            !query ||
            habit.name.toLowerCase().includes(query) ||
            habit.description.toLowerCase().includes(query);

        const matchesCategory =
            dashboardState.category === "All Categories" ||
            habit.category === dashboardState.category;

        return matchesTab && matchesSearch && matchesCategory;
    });
}

function updateStats() {
    const total = habits.length;
    const completed = habits.filter(habit => habit.completed).length;
    const remaining = total - completed;
    const percent = total ? Math.round((completed / total) * 100) : 0;

    const progressSummary = document.getElementById("progressSummary");
    const progressFill = document.getElementById("progressFill");

    if (progressSummary) {
        progressSummary.textContent = `${completed} of ${total} habits`;
    }

    if (progressFill) {
        progressFill.style.width = `${percent}%`;
    }

    const currentStreak = habits.reduce((max, habit) => Math.max(max, Number(habit.streak) || 0), 0);
    const longestStreak = habits.reduce((max, habit) => Math.max(max, Number(habit.longestStreak ?? habit.streak) || 0), 0);
    const completedThisWeek = habits.filter(habit => habit.completed).length;

    const currentStreakValue = document.getElementById("currentStreakValue");
    const longestStreakValue = document.getElementById("longestStreakValue");
    const completedThisWeekValue = document.getElementById("completedThisWeekValue");

    if (currentStreakValue) currentStreakValue.textContent = currentStreak;
    if (longestStreakValue) longestStreakValue.textContent = longestStreak;
    if (completedThisWeekValue) completedThisWeekValue.textContent = completedThisWeek;

    const summaryCompleted = document.getElementById("summaryCompleted");
    const summaryRemaining = document.getElementById("summaryRemaining");
    const summaryTotal = document.getElementById("summaryTotal");
    const summaryRate = document.getElementById("summaryRate");

    if (summaryCompleted) summaryCompleted.textContent = `${completed} habits`;
    if (summaryRemaining) summaryRemaining.textContent = `${remaining} habits`;
    if (summaryTotal) summaryTotal.textContent = `${total} habits`;
    if (summaryRate) summaryRate.textContent = `${percent}%`;
}

function renderHabits() {
    const filteredHabits = getFilteredHabits();

    if (habitList) {
        habitList.innerHTML = "";

        if (!filteredHabits.length) {
            habitList.innerHTML = `
                <div class="empty-state">
                    <p>No habits match your current filters.</p>
                </div>
            `;
        } else {
            filteredHabits.forEach(habit => {
                const row = document.createElement("div");
                row.className = "habit-row";

                row.innerHTML = `
                    <button
                        class="habit-checkbox ${habit.completed ? "checked" : ""}"
                        data-habit-id="${habit.id}"
                        aria-label="Complete ${habit.name}"
                        type="button"
                    >
                        ${habit.completed ? '<i data-lucide="check"></i>' : ""}
                    </button>

                    <div class="habit-icon category-${habit.color}">
                        <i data-lucide="${habit.icon}"></i>
                    </div>

                    <div class="habit-info">
                        <strong>${habit.name}</strong>
                        <span>${habit.description}</span>
                    </div>

                    <div class="habit-meta">
                        <span class="category category-${habit.color}">
                            ${habit.category}
                        </span>
                        <span class="frequency">
                            ${habit.frequency} • ${habit.target}
                        </span>
                    </div>

                    <div class="habit-streak">
                        <strong>
                            <span class="streak-icon">🔥</span>
                            ${habit.streak} days
                        </strong>
                        <span>Current streak</span>
                    </div>

                    <button class="habit-menu" aria-label="More options for ${habit.name}" type="button">
                        <i data-lucide="more-vertical"></i>
                    </button>
                `;

                habitList.appendChild(row);
            });
        }
    }

    if (habitCount) {
        habitCount.textContent = `${filteredHabits.length} ${filteredHabits.length === 1 ? "habit" : "habits"}`;
    }

    updateStats();
    lucide.createIcons();
}

function toggleHabit(id) {
    const habit = habits.find(item => item.id === id);

    if (!habit) return;

    habit.completed = !habit.completed;
    habit.streak = habit.completed ? 1 : 0;
    habit.longestStreak = habit.completed ? Math.max(habit.longestStreak || 0, 1) : 0;
    habit.active = true;

    saveHabits();
    renderHabits();
}

function setupFilters() {
    const tabs = document.querySelectorAll(".tab");

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(item => item.classList.toggle("active", item === tab));
            dashboardState.tab = tab.dataset.filter;
            renderHabits();
        });
    });

    if (habitSearch) {
        habitSearch.addEventListener("input", event => {
            dashboardState.search = event.target.value;
            renderHabits();
        });
    }

    if (categoryFilter) {
        categoryFilter.addEventListener("change", event => {
            dashboardState.category = event.target.value;
            renderHabits();
        });
    }
}

function renderCalendar() {
    if (!calendarGrid || !calendarMonthLabel || !dateButtonLabel) return;

    const monthStart = new Date(calendarState.currentMonth.getFullYear(), calendarState.currentMonth.getMonth(), 1);
    const monthEnd = new Date(calendarState.currentMonth.getFullYear(), calendarState.currentMonth.getMonth() + 1, 0);
    const startDay = (monthStart.getDay() + 6) % 7;
    const totalCells = Math.ceil((startDay + monthEnd.getDate()) / 7) * 7;

    calendarMonthLabel.textContent = monthStart.toLocaleString("en-US", {
        month: "long",
        year: "numeric"
    });

    dateButtonLabel.textContent = calendarState.selectedDate.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    const prevMonthDays = new Date(calendarState.currentMonth.getFullYear(), calendarState.currentMonth.getMonth(), 0).getDate();
    calendarGrid.innerHTML = "";

    for (let i = 0; i < totalCells; i++) {
        const dayNumber = i - startDay + 1;
        const cellDate = new Date(monthStart.getFullYear(), monthStart.getMonth(), dayNumber);
        const isCurrentMonth = cellDate.getMonth() === monthStart.getMonth();
        const isSelected = cellDate.toDateString() === calendarState.selectedDate.toDateString();

        const dayElement = document.createElement("span");
        dayElement.textContent = String(cellDate.getDate());

        if (!isCurrentMonth) {
            dayElement.classList.add("muted");
        }

        if (isSelected) {
            dayElement.classList.add("selected");
        }

        dayElement.dataset.date = cellDate.toISOString();
        dayElement.title = cellDate.toDateString();

        dayElement.addEventListener("click", () => {
            calendarState.selectedDate = new Date(cellDate.getFullYear(), cellDate.getMonth(), cellDate.getDate());
            renderCalendar();
        });

        calendarGrid.appendChild(dayElement);
    }
}

function setupNavigation() {
    document.querySelectorAll(".nav-item").forEach(button => {
        button.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach(item => item.classList.toggle("active", item === button));
        });
    });

    if (prevMonthButton) {
        prevMonthButton.addEventListener("click", () => {
            calendarState.currentMonth = new Date(
                calendarState.currentMonth.getFullYear(),
                calendarState.currentMonth.getMonth() - 1,
                1
            );
            renderCalendar();
        });
    }

    if (nextMonthButton) {
        nextMonthButton.addEventListener("click", () => {
            calendarState.currentMonth = new Date(
                calendarState.currentMonth.getFullYear(),
                calendarState.currentMonth.getMonth() + 1,
                1
            );
            renderCalendar();
        });
    }
}

if (addHabitButton) {
    addHabitButton.addEventListener("click", () => {
        window.location.href = "pages/add-habit/add-habit.html";
    });
}

document.addEventListener("click", event => {
    const checkbox = event.target.closest(".habit-checkbox");

    if (!checkbox) return;

    event.preventDefault();
    toggleHabit(Number(checkbox.dataset.habitId));
});

setupFilters();
setupNavigation();
renderCalendar();
renderHabits();
