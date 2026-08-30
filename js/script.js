const habits = [
    {
        id: 1,
        name: "Exercise",
        description: "Stay healthy and strong",
        category: "Fitness",
        frequency: "Daily",
        target: "30 min",
        streak: 5,
        completed: false,
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
        streak: 7,
        completed: true,
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
        streak: 3,
        completed: false,
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
        streak: 12,
        completed: true,
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
        completed: false,
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
        streak: 4,
        completed: true,
        icon: "briefcase-business",
        color: "work"
    }
];


const habitList = document.getElementById("habitList");


function renderHabits() {

    habitList.innerHTML = "";

    habits.forEach(habit => {

        const row = document.createElement("div");

        row.className = "habit-row";

        row.innerHTML = `

            <button
                class="habit-checkbox ${habit.completed ? "checked" : ""}"
                onclick="toggleHabit(${habit.id})"
                aria-label="Complete ${habit.name}"
            >
                ${
                    habit.completed
                        ? '<i data-lucide="check"></i>'
                        : ''
                }
            </button>


            <div
                class="habit-icon category-${habit.color}"
            >
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

                <span>
                    Current streak
                </span>

            </div>


            <button
                class="habit-menu"
                aria-label="More options for ${habit.name}"
            >
                <i data-lucide="more-vertical"></i>
            </button>

        `;

        habitList.appendChild(row);

    });


    lucide.createIcons();
}


function toggleHabit(id) {

    const habit = habits.find(h => h.id === id);

    if (!habit) return;

    habit.completed = !habit.completed;

    renderHabits();

}

const addHabitButton = document.getElementById("addHabitButton");

if (addHabitButton) {
    addHabitButton.addEventListener("click", () => {
        window.location.href = "pages/add-habit/add-habit.html";
    });
}

renderHabits();
