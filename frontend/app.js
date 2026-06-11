// Configuração da API
const API_BASE_URL = '/api';

// Estado da aplicação
let currentFilter = 'all';
let tasks = [];

// Elementos do DOM
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const errorMessage = document.getElementById('errorMessage');
const filterAllBtn = document.getElementById('filterAll');
const filterPendingBtn = document.getElementById('filterPending');
const filterCompletedBtn = document.getElementById('filterCompleted');
const totalCountEl = document.getElementById('totalCount');
const pendingCountEl = document.getElementById('pendingCount');
const completedCountEl = document.getElementById('completedCount');

// Event Listeners
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

filterAllBtn.addEventListener('click', () => setFilter('all'));
filterPendingBtn.addEventListener('click', () => setFilter('pending'));
filterCompletedBtn.addEventListener('click', () => setFilter('completed'));

// Funções principais
async function loadTasks() {
    try {
        const response = await fetch(`${API_BASE_URL}/tasks`);
        if (!response.ok) throw new Error('Erro ao carregar tarefas');
        tasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao carregar tarefas');
    }
}

async function addTask() {
    const title = taskInput.value.trim();

    if (!title) {
        showError('Digite uma tarefa antes de adicionar');
        return;
    }

    if (title.length > 200) {
        showError('Tarefa muito longa (máximo 200 caracteres)');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title })
        });

        if (!response.ok) throw new Error('Erro ao adicionar tarefa');
        
        await loadTasks();
        taskInput.value = '';
        clearError();
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao adicionar tarefa');
    }
}

async function toggleTask(id) {
    try {
        const task = tasks.find(t => t.id === id);
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
        });

        if (!response.ok) throw new Error('Erro ao atualizar tarefa');
        await loadTasks();
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao atualizar tarefa');
    }
}

async function deleteTask(id) {
    if (!confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar tarefa');
        await loadTasks();
    } catch (error) {
        console.error('Erro:', error);
        showError('Erro ao deletar tarefa');
    }
}

function renderTasks() {
    const filteredTasks = filterTasks();

    if (filteredTasks.length === 0) {
        taskList.innerHTML = `
            <li class="empty-state">
                <p>Nenhuma tarefa ${currentFilter === 'completed' ? 'concluída' : currentFilter === 'pending' ? 'pendente' : ''}</p>
                <p class="text-small">${currentFilter === 'all' ? 'Comece adicionando uma tarefa acima' : 'Adicione uma nova tarefa'}</p>
            </li>
        `;
        return;
    }

    taskList.innerHTML = filteredTasks
        .map(task => `
            <li class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask(${task.id})"
                >
                <span class="task-text">${escapeHtml(task.title)}</span>
                <div class="task-actions">
                    <button class="btn-delete" onclick="deleteTask(${task.id})">Deletar</button>
                </div>
            </li>
        `)
        .join('');

    updateStats();
}

function filterTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

function setFilter(filter) {
    currentFilter = filter;
    updateFilterButtons();
    renderTasks();
}

function updateFilterButtons() {
    filterAllBtn.classList.remove('active');
    filterPendingBtn.classList.remove('active');
    filterCompletedBtn.classList.remove('active');

    switch (currentFilter) {
        case 'all':
            filterAllBtn.classList.add('active');
            break;
        case 'pending':
            filterPendingBtn.classList.add('active');
            break;
        case 'completed':
            filterCompletedBtn.classList.add('active');
            break;
    }
}

function updateStats() {
    const completed = tasks.filter(t => t.completed).length;
    const pending = tasks.filter(t => !t.completed).length;
    const total = tasks.length;

    totalCountEl.textContent = total;
    pendingCountEl.textContent = pending;
    completedCountEl.textContent = completed;

    // Atualizar contadores nos botões de filtro
    filterAllBtn.textContent = `Todas (${total})`;
    filterPendingBtn.textContent = `Pendentes (${pending})`;
    filterCompletedBtn.textContent = `Concluídas (${completed})`;
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
    setTimeout(clearError, 5000);
}

function clearError() {
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Inicializar aplicação
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
});