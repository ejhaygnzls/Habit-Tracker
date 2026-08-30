/* =========================================
   ADD HABIT PAGE
========================================= */


const habitForm = document.getElementById("habitForm");

const habitNameInput = document.getElementById("habitName");

const categorySelect = document.getElementById("category");

const frequencyInput = document.getElementById("frequency");

const targetAmountInput =
    document.getElementById("targetAmount");

const targetUnitSelect =
    document.getElementById("targetUnit");

const descriptionInput =
    document.getElementById("description");

const reminderTimeInput =
    document.getElementById("reminderTime");


/* =========================================
   PREVIEW ELEMENTS
========================================= */

const previewName =
    document.getElementById("previewName");

const previewMeta =
    document.getElementById("previewMeta");

const previewIcon =
    document.getElementById("previewIcon");

const categoryDot =
    document.getElementById("categoryDot");


/* =========================================
   OTHER ELEMENTS
========================================= */

const frequencyButtons =
    document.querySelectorAll(".frequency-button");

const colorButtons =
    document.querySelectorAll(".color-option");

const characterCount =
    document.getElementById("characterCount");

const habitNameError =
    document.getElementById("habitNameError");

const targetError =
    document.getElementById("targetError");

const backButton =
    document.getElementById("backButton");

const cancelButton =
    document.getElementById("cancelButton");

const logoButton =
    document.getElementById("logoButton");

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById("toastMessage");


/* =========================================
   CURRENT COLOR
========================================= */

let selectedColor = "#3B82F6";


/* =========================================
   CATEGORY COLORS
========================================= */

const categoryColors = {

    Fitness: "#00C896",

    Skills: "#3B82F6",

    Learning: "#8B5CF6",

    Personal: "#F59E0B",

    Work: "#14B8A6"

};


/* =========================================
   HABIT ICONS
========================================= */

const categoryIcons = {

    Fitness: "accessibility",

    Skills: "code-2",

    Learning: "book-open",

    Personal: "star",

    Work: "briefcase-business"

};



/* =========================================
   LOAD HABITS
========================================= */

function getHabits() {

    try {

        const savedHabits =
            localStorage.getItem("habitTrackerHabits");

        if (!savedHabits) {

            return [];

        }

        return JSON.parse(savedHabits);

    } catch (error) {

        console.error(
            "Unable to load habits:",
            error
        );

        return [];

    }

}



/* =========================================
   SAVE HABITS
========================================= */

function saveHabits(habits) {

    localStorage.setItem(
        "habitTrackerHabits",
        JSON.stringify(habits)
    );

}



/* =========================================
   NAME PREVIEW
========================================= */

habitNameInput.addEventListener(
    "input",
    () => {

        const name =
            habitNameInput.value.trim();

        previewName.textContent =
            name || "Coding Practice";

        clearError(habitNameInput, habitNameError);

    }
);



/* =========================================
   CATEGORY
========================================= */

categorySelect.addEventListener(
    "change",
    updateCategoryPreview
);


function updateCategoryPreview() {

    const category =
        categorySelect.value;

    const color =
        categoryColors[category]
        || selectedColor;

    categoryDot.style.background =
        color;

    previewMeta.textContent =
        `${category} • ${frequencyInput.value}`;


    const icon =
        categoryIcons[category]
        || "circle";


    previewIcon.innerHTML =
        `<i data-lucide="${icon}"></i>`;


    previewIcon.style.background =
        `${hexToRgba(color, 0.12)}`;

    previewIcon.style.color =
        color;


    lucide.createIcons();

}



/* =========================================
   FREQUENCY
========================================= */

frequencyButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            frequencyButtons.forEach(
                item =>
                    item.classList.remove("active")
            );


            button.classList.add("active");


            const frequency =
                button.dataset.frequency;


            frequencyInput.value =
                frequency;


            previewMeta.textContent =
                `${categorySelect.value} • ${frequency}`;

        }
    );

});



/* =========================================
   TARGET VALIDATION
========================================= */

targetAmountInput.addEventListener(
    "input",
    () => {

        clearError(
            targetAmountInput,
            targetError
        );

    }
);



/* =========================================
   DESCRIPTION COUNTER
========================================= */

descriptionInput.addEventListener(
    "input",
    () => {

        characterCount.textContent =
            descriptionInput.value.length;

    }
);



/* =========================================
   COLOR SELECTION
========================================= */

colorButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            colorButtons.forEach(
                item =>
                    item.classList.remove("active")
            );


            button.classList.add("active");


            selectedColor =
                button.dataset.color;


            previewIcon.style.background =
                hexToRgba(selectedColor, 0.12);


            previewIcon.style.color =
                selectedColor;


            categoryDot.style.background =
                selectedColor;

        }
    );

});



/* =========================================
   FORM SUBMISSION
========================================= */

habitForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        createHabit();

    }
);



/* =========================================
   VALIDATION
========================================= */

function validateForm() {

    let valid = true;


    const name =
        habitNameInput.value.trim();


    const amount =
        Number(targetAmountInput.value);


    /* NAME */

    if (!name) {

        showError(
            habitNameInput,
            habitNameError,
            "Please enter a habit name."
        );

        valid = false;

    } else if (name.length < 2) {

        showError(
            habitNameInput,
            habitNameError,
            "Habit name must be at least 2 characters."
        );

        valid = false;

    }


    /* TARGET */

    if (!amount || amount < 1) {

        showError(
            targetAmountInput,
            targetError,
            "Target must be at least 1."
        );

        valid = false;

    }


    return valid;

}



/* =========================================
   CREATE HABIT
========================================= */

function createHabit() {

    const habits =
        getHabits();


    const name =
        habitNameInput.value.trim();


    /* DUPLICATE CHECK */

    const duplicate =
        habits.some(
            habit =>
                habit.name.toLowerCase()
                === name.toLowerCase()
        );


    if (duplicate) {

        showError(
            habitNameInput,
            habitNameError,
            "A habit with this name already exists."
        );

        return;

    }


    const now =
        new Date();


    const newHabit = {

        id:
            crypto.randomUUID
            ? crypto.randomUUID()
            : Date.now().toString(),

        name,

        description:
            descriptionInput.value.trim(),

        category:
            categorySelect.value,

        frequency:
            frequencyInput.value,

        targetAmount:
            Number(targetAmountInput.value),

        targetUnit:
            targetUnitSelect.value,

        reminderTime:
            reminderTimeInput.value,

        color:
            selectedColor,

        icon:
            categoryIcons[categorySelect.value]
            || "circle",

        active:
            true,

        streak:
            0,

        longestStreak:
            0,

        completions:
            {},

        createdAt:
            now.toISOString(),

        updatedAt:
            now.toISOString()

    };


    habits.push(newHabit);


    saveHabits(habits);


    showToast(
        "Habit created successfully!"
    );


    setTimeout(
        () => {

            goToDashboard();

        },
        700
    );

}



/* =========================================
   BACK / CANCEL
========================================= */

backButton.addEventListener(
    "click",
    goBack
);


cancelButton.addEventListener(
    "click",
    goBack
);


logoButton.addEventListener(
    "click",
    goToDashboard
);


function goBack() {

    if (
        document.referrer
        &&
        document.referrer.includes(
            window.location.host
        )
    ) {

        window.history.back();

    } else {

        goToDashboard();

    }

}


function goToDashboard() {

    window.location.href =
        "../../index.html";

}



/* =========================================
   ERROR HELPERS
========================================= */

function showError(
    input,
    errorElement,
    message
) {

    input.classList.add("error");

    errorElement.textContent =
        message;

}


function clearError(
    input,
    errorElement
) {

    input.classList.remove("error");

    errorElement.textContent =
        "";

}



/* =========================================
   TOAST
========================================= */

function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    setTimeout(
        () => {

            toast.classList.remove("show");

        },
        2500
    );

}



/* =========================================
   HEX → RGBA
========================================= */

function hexToRgba(hex, alpha) {

    const cleanHex =
        hex.replace("#", "");


    const bigint =
        parseInt(cleanHex, 16);


    const r =
        (bigint >> 16) & 255;


    const g =
        (bigint >> 8) & 255;


    const b =
        bigint & 255;


    return `rgba(${r}, ${g}, ${b}, ${alpha})`;

}



/* =========================================
   INITIALIZE
========================================= */

updateCategoryPreview();

lucide.createIcons();
