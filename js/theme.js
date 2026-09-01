/* =========================================
   THEME UTILITY - Theme Management
========================================= */

const THEME_STORAGE_KEY = "habitTrackerTheme";
const DEFAULT_THEME = "dark";

/**
 * Initialize theme on page load
 * Sets the theme based on saved preference or system preference
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    const theme = savedTheme || DEFAULT_THEME;
    setTheme(theme);
}

/**
 * Set the theme to light or dark
 * @param {string} theme - "light" or "dark"
 */
function setTheme(theme) {
    if (theme === "light") {
        document.documentElement.setAttribute("data-theme", "light");
    } else {
        document.documentElement.removeAttribute("data-theme");
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    updateThemeToggleButton();
}

/**
 * Toggle between light and dark themes
 */
function toggleTheme() {
    const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
    const newTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(newTheme);
}

/**
 * Get current theme
 */
function getCurrentTheme() {
    return localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME;
}

/**
 * Update the theme toggle button appearance
 */
function updateThemeToggleButton() {
    const toggleButtons = document.querySelectorAll(".theme-toggle");
    const theme = getCurrentTheme();
    
    toggleButtons.forEach(button => {
        if (theme === "light") {
            button.classList.add("light-mode");
        } else {
            button.classList.remove("light-mode");
        }
    });
}

/**
 * Setup theme toggle button event listeners
 */
function setupThemeToggle() {
    const toggleButtons = document.querySelectorAll(".theme-toggle");
    
    toggleButtons.forEach(button => {
        button.addEventListener("click", () => {
            toggleTheme();
        });
    });
}

// Initialize theme when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
        initializeTheme();
        setupThemeToggle();
    });
} else {
    initializeTheme();
    setupThemeToggle();
}
