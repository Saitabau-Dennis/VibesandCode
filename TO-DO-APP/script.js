// DOM Elements
const taskInput = document.getElementById('taskInput');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');
const taskCount = document.getElementById('taskCount');
const emptyState = document.getElementById('emptyState');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');

// Application State
let tasks = [];
let currentFilter = 'all';
let taskIdCounter = 1;

// Task Object Constructor
class Task {
    constructor(text, startDate = null, endDate = null) {
        this.id = taskIdCounter++;
        this.text = text.trim();
        this.completed = false;
        this.createdAt = new Date();
        this.startDate = startDate ? new Date(startDate) : null;
        this.endDate = endDate ? new Date(endDate) : null;
        this.completedAt = null;
    }
    
    complete() {
        this.completed = true;
        this.completedAt = new Date();
    }
    
    getTimingStatus() {
        if (!this.completed || !this.endDate) return null;
        
        const timeDiff = this.completedAt - this.endDate;
        const hoursDiff = Math.round(timeDiff / (1000 * 60 * 60));
        
        if (hoursDiff < -1) {
            return {
                type: 'early',
                message: `Finished ${Math.abs(hoursDiff)} hours early`
            };
        } else if (hoursDiff > 1) {
            return {
                type: 'late',
                message: `Finished ${hoursDiff} hours late`
            };
        } else {
            return {
                type: 'on-time',
                message: 'Completed on time'
            };
        }
    }
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadTasksFromStorage();
    renderTasks();
    updateTaskCount();
    updateEmptyState();
    
    // Set default start date to now
    const now = new Date();
    const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    startDateInput.value = localISOTime;
    
    // Add event listeners
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', handleInputKeypress);
    clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    // Filter button event listeners
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
    
    // Date validation
    startDateInput.addEventListener('change', validateDates);
    endDateInput.addEventListener('change', validateDates);
    
    // Focus on input when page loads
    taskInput.focus();
});

// Validate dates
function validateDates() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        endDateInput.setCustomValidity('End date must be after start date');
        showNotification('End date must be after start date', 'error');
    } else {
        endDateInput.setCustomValidity('');
    }
}

// Add Task Function
function addTask() {
    const taskText = taskInput.value.trim();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (taskText === '') {
        showNotification('Please enter a task!', 'error');
        taskInput.focus();
        return;
    }
    
    if (taskText.length > 100) {
        showNotification('Task is too long! (Max 100 characters)', 'error');
        taskInput.focus();
        return;
    }
    
    // Validate dates
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
        showNotification('Start date cannot be after end date!', 'error');
        startDateInput.focus();
        return;
    }
    
    // Check for duplicate tasks
    if (tasks.some(task => task.text.toLowerCase() === taskText.toLowerCase())) {
        showNotification('This task already exists!', 'error');
        taskInput.focus();
        return;
    }
    
    const newTask = new Task(taskText, startDate, endDate);
    tasks.unshift(newTask); // Add to beginning of array
    
    // Clear inputs and refocus
    taskInput.value = '';
    startDateInput.value = '';
    endDateInput.value = '';
    taskInput.focus();
    
    // Update UI
    renderTasks();
    updateTaskCount();
    updateEmptyState();
    saveTasksToStorage();
    
    // Show success feedback
    showNotification('Task added successfully!', 'success');
}

// Handle Enter Key Press
function handleInputKeypress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

// Render Tasks
function renderTasks() {
    const filteredTasks = getFilteredTasks();
    taskList.innerHTML = '';
    
    filteredTasks.forEach(task => {
        const taskElement = createTaskElement(task);
        taskList.appendChild(taskElement);
    });
}

// Create Task Element
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.taskId = task.id;
    
    // Get timing status safely
    const timingStatus = typeof task.getTimingStatus === 'function' ? task.getTimingStatus() : null;
    
    // Format dates
    const formatDate = (date) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    const startDateStr = formatDate(task.startDate);
    const endDateStr = formatDate(task.endDate);
    
    let datesHtml = '';
    if (startDateStr || endDateStr) {
        datesHtml = '<div class="task-dates">';
        if (startDateStr) {
            datesHtml += `<div class="task-date">
                <span class="date-icon">🚀</span>
                <span>Start: ${startDateStr}</span>
            </div>`;
        }
        if (endDateStr) {
            datesHtml += `<div class="task-date">
                <span class="date-icon">🎯</span>
                <span>Due: ${endDateStr}</span>
            </div>`;
        }
        datesHtml += '</div>';
    }
    
    let statusHtml = '';
    if (timingStatus) {
        statusHtml = `<div class="task-status status-${timingStatus.type}">
            ${timingStatus.message}
        </div>`;
    }
    
    li.innerHTML = `
        <div class="task-content">
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${task.id})"></div>
            <div class="task-info">
                <div class="task-text">${escapeHtml(task.text)}</div>
                ${datesHtml}
                ${statusHtml}
            </div>
        </div>
        <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})">Edit</button>
            <button class="delete-btn" onclick="deleteTask(${task.id})">Delete</button>
        </div>
    `;
    
    return li;
}

// Toggle Task Completion
function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        if (!task.completed) {
            // Ensure the task has the complete method if it's a plain object
            if (typeof task.complete === 'function') {
                task.complete();
            } else {
                task.completed = true;
                task.completedAt = new Date();
            }
        } else {
            task.completed = false;
            task.completedAt = null;
        }
        
        renderTasks();
        updateTaskCount();
        saveTasksToStorage();
        
        // Add visual feedback
        const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
        if (taskElement) {
            taskElement.style.transform = 'scale(1.02)';
            setTimeout(() => {
                taskElement.style.transform = '';
            }, 150);
        }
        
        // Show completion notification
        if (task.completed) {
            const timingStatus = typeof task.getTimingStatus === 'function' ? task.getTimingStatus() : null;
            if (timingStatus) {
                showNotification(`Task completed! ${timingStatus.message}`, 'success');
            } else {
                showNotification('Task completed!', 'success');
            }
        }
    }
}

// Edit Task
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
    const taskTextElement = taskElement.querySelector('.task-text');
    const taskActionsElement = taskElement.querySelector('.task-actions');
    
    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = task.text;
    editInput.maxLength = 100;
    
    // Create save and cancel buttons
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Save';
    saveBtn.onclick = () => saveTaskEdit(taskId, editInput.value);
    
    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.onclick = () => cancelTaskEdit(taskId);
    
    // Replace task text with input
    taskTextElement.style.display = 'none';
    taskTextElement.parentNode.insertBefore(editInput, taskTextElement.nextSibling);
    
    // Replace actions with save/cancel buttons
    taskActionsElement.innerHTML = '';
    taskActionsElement.appendChild(saveBtn);
    taskActionsElement.appendChild(cancelBtn);
    
    // Focus and select input text
    editInput.focus();
    editInput.select();
    
    // Handle Enter key to save
    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveTaskEdit(taskId, editInput.value);
        } else if (e.key === 'Escape') {
            cancelTaskEdit(taskId);
        }
    });
    
    // Mark as editing
    taskElement.classList.add('editing');
}

// Save Task Edit
function saveTaskEdit(taskId, newText) {
    const trimmedText = newText.trim();
    
    if (trimmedText === '') {
        showNotification('Task cannot be empty!', 'error');
        return;
    }
    
    if (trimmedText.length > 100) {
        showNotification('Task is too long! (Max 100 characters)', 'error');
        return;
    }
    
    // Check for duplicate tasks (excluding current task)
    if (tasks.some(task => task.id !== taskId && task.text.toLowerCase() === trimmedText.toLowerCase())) {
        showNotification('This task already exists!', 'error');
        return;
    }
    
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.text = trimmedText;
        renderTasks();
        saveTasksToStorage();
        showNotification('Task updated successfully!', 'success');
    }
}

// Cancel Task Edit
function cancelTaskEdit(taskId) {
    renderTasks(); // Re-render to restore original state
}

// Delete Task
function deleteTask(taskId) {
    showConfirmDialog('Are you sure you want to delete this task?', () => {
        tasks = tasks.filter(t => t.id !== taskId);
        renderTasks();
        updateTaskCount();
        updateEmptyState();
        saveTasksToStorage();
        
        showNotification('Task deleted successfully!', 'success');
    });
}

// Set Filter
function setFilter(filter) {
    currentFilter = filter;
    
    // Update active filter button
    filterBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });
    
    renderTasks();
    updateEmptyState();
}

// Get Filtered Tasks
function getFilteredTasks() {
    switch (currentFilter) {
        case 'pending':
            return tasks.filter(task => !task.completed);
        case 'completed':
            return tasks.filter(task => task.completed);
        default:
            return tasks;
    }
}

// Update Task Count
function updateTaskCount() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    
    let countText = '';
    switch (currentFilter) {
        case 'pending':
            countText = `${pendingTasks} ${pendingTasks === 1 ? 'task' : 'tasks'} pending`;
            break;
        case 'completed':
            countText = `${completedTasks} ${completedTasks === 1 ? 'task' : 'tasks'} completed`;
            break;
        default:
            countText = `${totalTasks} ${totalTasks === 1 ? 'task' : 'tasks'} total`;
    }
    
    taskCount.textContent = countText;
    
    // Update clear completed button state
    clearCompletedBtn.disabled = completedTasks === 0;
}

// Update Empty State
function updateEmptyState() {
    const filteredTasks = getFilteredTasks();
    
    if (filteredTasks.length === 0) {
        emptyState.classList.remove('hidden');
        
        // Update empty state message based on filter
        const emptyIcon = emptyState.querySelector('.empty-icon');
        const emptyTitle = emptyState.querySelector('h3');
        const emptyText = emptyState.querySelector('p');
        
        switch (currentFilter) {
            case 'pending':
                emptyIcon.textContent = '🎉';
                emptyTitle.textContent = 'All tasks completed!';
                emptyText.textContent = 'Great job! You\'ve finished all your tasks.';
                break;
            case 'completed':
                emptyIcon.textContent = '⏳';
                emptyTitle.textContent = 'No completed tasks';
                emptyText.textContent = 'Complete some tasks to see them here.';
                break;
            default:
                emptyIcon.textContent = '📝';
                emptyTitle.textContent = 'No tasks yet';
                emptyText.textContent = 'Add a task above to get started!';
        }
    } else {
        emptyState.classList.add('hidden');
    }
}

// Clear Completed Tasks
function clearCompletedTasks() {
    const completedTasks = tasks.filter(task => task.completed);
    
    if (completedTasks.length === 0) return;
    
    showConfirmDialog(`Are you sure you want to delete ${completedTasks.length} completed ${completedTasks.length === 1 ? 'task' : 'tasks'}?`, () => {
        tasks = tasks.filter(task => !task.completed);
        renderTasks();
        updateTaskCount();
        updateEmptyState();
        saveTasksToStorage();
        
        showNotification('Completed tasks cleared!', 'success');
    });
}

// Local Storage Functions
function saveTasksToStorage() {
    try {
        localStorage.setItem('todoApp_tasks', JSON.stringify(tasks));
        localStorage.setItem('todoApp_taskIdCounter', taskIdCounter.toString());
    } catch (error) {
        console.error('Error saving tasks to localStorage:', error);
    }
}

function loadTasksFromStorage() {
    try {
        const savedTasks = localStorage.getItem('todoApp_tasks');
        const savedCounter = localStorage.getItem('todoApp_taskIdCounter');
        
        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);
            // Convert plain objects back to Task instances
            tasks = parsedTasks.map(taskData => {
                const task = Object.create(Task.prototype);
                task.id = taskData.id;
                task.text = taskData.text;
                task.completed = taskData.completed || false;
                task.createdAt = taskData.createdAt ? new Date(taskData.createdAt) : new Date();
                task.startDate = taskData.startDate ? new Date(taskData.startDate) : null;
                task.endDate = taskData.endDate ? new Date(taskData.endDate) : null;
                task.completedAt = taskData.completedAt ? new Date(taskData.completedAt) : null;
                return task;
            });
        }
        
        if (savedCounter) {
            taskIdCounter = parseInt(savedCounter, 10);
        }
    } catch (error) {
        console.error('Error loading tasks from localStorage:', error);
        tasks = [];
        taskIdCounter = 1;
    }
}

// Utility Functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove any existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 4000);
}

// Confirmation Dialog
function showConfirmDialog(message, onConfirm) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: fadeIn 0.3s ease;
    `;
    
    // Create dialog
    const dialog = document.createElement('div');
    dialog.style.cssText = `
        background: #1a1a1a;
        border: 2px solid #333333;
        border-radius: 16px;
        padding: 24px;
        max-width: 400px;
        width: 90%;
        text-align: center;
        animation: scaleIn 0.3s ease;
    `;
    
    dialog.innerHTML = `
        <p style="color: #ffffff; font-size: 1.1rem; margin-bottom: 24px; font-family: 'Poppins', sans-serif;">
            ${message}
        </p>
        <div style="display: flex; gap: 12px; justify-content: center;">
            <button id="confirmBtn" style="
                padding: 12px 24px;
                background: #ef4444;
                border: none;
                border-radius: 8px;
                color: #ffffff;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Yes, Delete</button>
            <button id="cancelBtn" style="
                padding: 12px 24px;
                background: #333333;
                border: 1px solid #555555;
                border-radius: 8px;
                color: #ffffff;
                font-family: 'Poppins', sans-serif;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Cancel</button>
        </div>
    `;
    
    overlay.appendChild(dialog);
    document.body.appendChild(overlay);
    
    // Add styles for animations
    if (!document.querySelector('#confirmDialogStyles')) {
        const style = document.createElement('style');
        style.id = 'confirmDialogStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.8); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Event listeners
    const confirmBtn = dialog.querySelector('#confirmBtn');
    const cancelBtn = dialog.querySelector('#cancelBtn');
    
    const closeDialog = () => {
        overlay.style.animation = 'fadeIn 0.3s ease reverse';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.remove();
            }
        }, 300);
    };
    
    confirmBtn.addEventListener('click', () => {
        closeDialog();
        onConfirm();
    });
    
    cancelBtn.addEventListener('click', closeDialog);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeDialog();
        }
    });
    
    // Focus cancel button
    cancelBtn.focus();
}

// Keyboard Shortcuts
document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Enter to add task
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        addTask();
    }
    
    // Escape to clear input
    if (event.key === 'Escape' && document.activeElement === taskInput) {
        taskInput.value = '';
        taskInput.blur();
    }
    
    // Focus input with Ctrl/Cmd + K
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        taskInput.focus();
        taskInput.select();
    }
});

// Theme and Accessibility Improvements
document.addEventListener('DOMContentLoaded', () => {
    // Add ARIA labels and roles for better accessibility
    taskInput.setAttribute('aria-label', 'Enter new task');
    startDateInput.setAttribute('aria-label', 'Start date for task');
    endDateInput.setAttribute('aria-label', 'Due date for task');
    addTaskBtn.setAttribute('aria-label', 'Add new task');
    taskList.setAttribute('role', 'list');
    
    // Prefers reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--animation-duration', '0s');
    }
    
    // Update favicon based on task count
    updateFavicon();
});

function updateFavicon() {
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const favicon = document.querySelector('link[rel="icon"]') || document.createElement('link');
    
    if (!document.querySelector('link[rel="icon"]')) {
        favicon.rel = 'icon';
        document.head.appendChild(favicon);
    }
    
    // Create a simple favicon with task count
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 32, 32);
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(2, 2, 28, 28);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(pendingTasks > 99 ? '99+' : pendingTasks.toString(), 16, 22);
    
    favicon.href = canvas.toDataURL();
}
