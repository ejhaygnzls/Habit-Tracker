  const STORAGE_KEY = 'habitTrackerData';

// --- Utilities ---
function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function todayKey(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0,10);
}

function formatDateISO(date) {
  return new Date(date).toISOString().slice(0,10);
}

// --- Data ---
function loadData() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return { habits: [] };
  try { return JSON.parse(raw); } catch(e){ return { habits: [] }; }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let state = loadData();

// --- Habits operations ---
function addHabit(name, category) {
  const habit = {
    id: uid(),
    name: name.trim(),
    category: category.trim() || 'General',
    createdAt: new Date().toISOString(),
    completions: {}
  };
  state.habits.push(habit);
  saveData(state);
  render();
}

function deleteHabit(id) {
  const idx = state.habits.findIndex(h => h.id === id);
  if (idx === -1) return;
  if (!confirm('Delete this habit? This cannot be undone.')) return;
  state.habits.splice(idx,1);
  saveData(state);
  render();
}

function toggleHabitCompletion(id) {
  const date = todayKey();
  const habit = state.habits.find(h => h.id === id);
  if (!habit) return;
  if (habit.completions && habit.completions[date]) {
    delete habit.completions[date];
  } else {
    habit.completions = habit.completions || {};
    habit.completions[date] = true;
  }
  saveData(state);
  render();
}

// --- Statistics ---
function calculateCompletionPercentage() {
  const habits = state.habits;
  if (!habits.length) return 0;
  const date = todayKey();
  const completed = habits.filter(h => h.completions && h.completions[date]).length;
  return Math.round((completed / habits.length) * 100);
}

function isSuccessfulDay(dateKey) {
  const habits = state.habits;
  if (!habits.length) return false;
  return habits.every(h => h.completions && h.completions[dateKey]);
}

// Current streak: count consecutive successful days ending today if today successful, otherwise ending yesterday
function calculateCurrentStreak() {
  if (!state.habits.length) return 0;
  let count = 0;
  let offset = 0;
  // if today not successful, start from yesterday
  if (!isSuccessfulDay(todayKey())) offset = -1;
  for (let i = offset; ; i--) {
    const key = todayKey(i);
    if (isSuccessfulDay(key)) { count++; } else { break; }
  }
  return count;
}

// --- UI Rendering ---
function renderHabits() {
  const list = document.getElementById('habits-list');
  list.innerHTML = '';
  state.habits.forEach(h => {
    const li = document.createElement('li');
    li.className = 'habit-item';

    const main = document.createElement('div');
    main.className = 'habit-main';
    const name = document.createElement('div');
    name.innerHTML = `<div class="habit-name">${escapeHtml(h.name)}</div><div class="habit-category">${escapeHtml(h.category)}</div>`;
    main.appendChild(name);

    const actions = document.createElement('div');
    actions.className = 'habit-actions';

    const checkbox = document.createElement('button');
    checkbox.className = 'checkbox';
    if (h.completions && h.completions[todayKey()]) checkbox.classList.add('completed');
    checkbox.innerHTML = h.completions && h.completions[todayKey()] ? '✓' : '';
    checkbox.addEventListener('click', () => toggleHabitCompletion(h.id));

    const del = document.createElement('button');
    del.className = 'delete-btn';
    del.textContent = 'Delete';
    del.addEventListener('click', () => deleteHabit(h.id));

    actions.appendChild(checkbox);
    actions.appendChild(del);

    li.appendChild(main);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function updateDashboard() {
  const percent = calculateCompletionPercentage();
  document.getElementById('progress-percent').textContent = `${percent}%`;
  document.getElementById('progress-fill').style.width = percent + '%';
  document.getElementById('current-streak').textContent = calculateCurrentStreak();
}

function render() {
  renderHabits();
  updateDashboard();
}

// --- Modal and form handlers ---
function openModal() { document.getElementById('habit-modal').classList.remove('hidden'); document.getElementById('habit-name').focus(); }
function closeModal() { document.getElementById('habit-modal').classList.add('hidden'); document.getElementById('habit-form').reset(); }

function setupUI() {
  document.getElementById('add-habit-btn').addEventListener('click', openModal);
  document.getElementById('cancel-btn').addEventListener('click', closeModal);
  document.getElementById('habit-modal').addEventListener('click', (e) => { if (e.target.id === 'habit-modal') closeModal(); });

  document.getElementById('habit-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('habit-name').value.trim();
    const category = document.getElementById('habit-category').value.trim();
    if (!name) { alert('Please enter a habit name.'); return; }
    addHabit(name, category);
    closeModal();
  });

  // show current date and greeting
  const now = new Date();
  document.getElementById('current-date').textContent = now.toLocaleDateString(undefined, { weekday:'short', year:'numeric', month:'short', day:'numeric' });
  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  document.getElementById('greeting').textContent = `${greeting} 👋`;
}

// --- Helpers ---
function escapeHtml(str){ return String(str).replace(/[&"'<>]/g, (s) => ({'&':'&amp;','"':'&quot;','\'':'&#39;','<':'&lt;','>':'&gt;'}[s])); }

// --- Init ---
document.addEventListener('DOMContentLoaded', () => {
  setupUI();
  render();
});
