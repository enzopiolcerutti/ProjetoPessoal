document.addEventListener('DOMContentLoaded', function() {
    // Dropdown de perfil reutilizável (único e funcional)
    const profileIcon = document.querySelector('.profile-icon');
    let profileDropdown = document.getElementById('profileDropdown');
    if (!profileDropdown) {
        profileDropdown = document.createElement('div');
        profileDropdown.className = 'profile-dropdown';
        profileDropdown.id = 'profileDropdown';
        profileDropdown.innerHTML = '<button class="profile-option" id="logoutBtn"><i class="fas fa-sign-out-alt"></i> Sair</button>';
        document.body.appendChild(profileDropdown);
    }
    const logoutBtn = document.getElementById('logoutBtn');
    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
            // Posicionar dropdown abaixo do ícone
            const rect = profileIcon.getBoundingClientRect();
            profileDropdown.style.top = (window.scrollY + rect.bottom + 10) + 'px';
            profileDropdown.style.right = (window.innerWidth - rect.right) + 'px';
        });
        document.addEventListener('click', function(e) {
            if (!profileDropdown.contains(e.target) && e.target !== profileIcon) {
                profileDropdown.classList.remove('show');
            }
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('usuario_id');
            window.location.href = '/login';
        });
    }

    // Elementos do DOM
    const tabs = document.querySelectorAll('.tab');
    const newTaskBtn = document.querySelector('.new-task-btn');
    const searchInput = document.querySelector('.search-input');
    const calendarPrev = document.querySelector('.calendar-prev');
    const calendarNext = document.querySelector('.calendar-next');
    const calendarMonth = document.querySelector('.calendar-month');
    const navItems = document.querySelectorAll('.nav-item');

    // Dados do calendário
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    let currentMonth = 8; // Setembro (0-indexado)
    let currentYear = 2021;

    // Tarefas dinâmicas
    let tasks = [];

    // Inicialização
    init();

    function init() {
        setupEventListeners();
        fetchAndRenderTasks();
        updateCalendar();
    }

    function setupEventListeners() {
        // Tabs de tarefas
        tabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const tabName = this.dataset.tab;
                switchTab(tabName);
            });
        });

        // Botão nova tarefa
        newTaskBtn.addEventListener('click', function() {
            showNewTaskModal();
        });

        // Pesquisa
        searchInput.addEventListener('input', function() {
            filterTasks(this.value);
        });

        // Navegação do calendário
        if (calendarPrev) calendarPrev.addEventListener('click', function() { navigateCalendar(-1); });
        if (calendarNext) calendarNext.addEventListener('click', function() { navigateCalendar(1); });

        // Navegação da sidebar
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                navItems.forEach(nav => nav.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Atualização em tempo real via evento customizado
        window.addEventListener('tarefasAtualizadas', fetchAndRenderTasks);
    }

    async function fetchAndRenderTasks() {
        try {
            const usuario_id = localStorage.getItem('usuario_id');
            const res = await fetch(`/api/tarefas?usuario_id=${usuario_id}`);
            let tasksData = await res.json();
            tasks = tasksData;
            updateStats();
            const activeTab = document.querySelector('.tab.active');
            loadTasks(activeTab ? activeTab.dataset.tab : 'hoje');
        } catch (err) {
            showNotification('Erro ao carregar tarefas.', 'error');
        }
    }

    function switchTab(tabName) {
        // Atualiza visual das tabs
        tabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Carrega tarefas da categoria
        loadTasks(tabName);
    }

    function loadTasks(category) {
        const taskList = document.querySelector('.task-list');
        if (!taskList) return;
        let filteredTasks = tasks;
        if (category === 'proximas') filteredTasks = tasks.filter(task => !task.concluida);
        else if (category === 'concluidas') filteredTasks = tasks.filter(task => task.concluida);
        else if (category === 'hoje') {
            const today = new Date().toISOString().slice(0, 10);
            filteredTasks = tasks.filter(task => task.data && task.data.slice(0, 10) === today);
        }
        taskList.innerHTML = '';
        filteredTasks.forEach(task => {
            const taskElement = createTaskElement(task);
            taskList.appendChild(taskElement);
        });
        // Atualiza título da seção
        const sectionTitle = document.querySelector('.tasks-content h2');
        const titles = {
            'hoje': 'Tarefas de Hoje',
            'proximas': 'Próximas Tarefas',
            'concluidas': 'Tarefas Concluídas'
        };
        if (sectionTitle) sectionTitle.textContent = titles[category] || 'Tarefas';
    }

    function createTaskElement(task) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <input type="checkbox" id="task${task.id}" class="task-checkbox" ${task.concluida ? 'checked' : ''}>
            <label for="task${task.id}" class="task-content">
                <span class="task-title">${task.titulo}</span>
                <span class="task-description">${task.data ? new Date(task.data).toLocaleDateString('pt-BR') : ''}</span>
            </label>
            <i class="fas fa-trash task-delete"></i>
        `;
        // Marcar como concluída
        const checkbox = taskItem.querySelector('.task-checkbox');
        checkbox.addEventListener('change', async function() {
            await fetch(`/api/tarefas/${task.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...task, concluida: this.checked })
            });
            showMotivationalPopup();
            fetchAndRenderTasks();
            window.dispatchEvent(new CustomEvent('tarefasAtualizadas'));
        });
        // Excluir tarefa
        const deleteBtn = taskItem.querySelector('.task-delete');
        deleteBtn.addEventListener('click', async function() {
            if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                await fetch(`/api/tarefas/${task.id}`, { method: 'DELETE' });
                fetchAndRenderTasks();
                window.dispatchEvent(new CustomEvent('tarefasAtualizadas'));
            }
        });
        return taskItem;
    }

    // Pop-up de frase motivacional ao concluir tarefa
    async function showMotivationalPopup() {
        const res = await fetch('/api/frases');
        const frases = await res.json();
        const frase = frases[Math.floor(Math.random() * frases.length)];
        let popup = document.createElement('div');
        popup.className = 'popup-msg popup-info';
        popup.textContent = frase.texto;
        document.body.appendChild(popup);
        setTimeout(() => { popup.classList.add('show'); }, 10);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 2500);
    }

    function updateStats() {
        const total = tasks.length;
        const pending = tasks.filter(t => !t.concluida).length;
        const completed = tasks.filter(t => t.concluida).length;
        const todayStr = new Date().toISOString().slice(0, 10);
        const today = tasks.filter(t => t.data && t.data.slice(0, 10) === todayStr).length;
        document.querySelector('.stats-grid .stat-card:nth-child(1) .stat-number').textContent = total;
        document.querySelector('.stats-grid .stat-card:nth-child(2) .stat-number').textContent = pending;
        document.querySelector('.stats-grid .stat-card:nth-child(3) .stat-number').textContent = completed;
        document.querySelector('.stats-grid .stat-card:nth-child(4) .stat-number').textContent = today;
    }

    function filterTasks(searchTerm) {
        const taskItems = document.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            const title = item.querySelector('.task-title').textContent.toLowerCase();
            const description = item.querySelector('.task-description').textContent.toLowerCase();
            const matches = title.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase());
            item.style.display = matches ? 'flex' : 'none';
        });
    }

    function navigateCalendar(direction) {
        currentMonth += direction;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        } else if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        updateCalendar();
    }

    function updateCalendar() {
        if (calendarMonth) calendarMonth.textContent = `${months[currentMonth]} ${currentYear}`;
        // Lógica de atualização de dias do calendário pode ser implementada aqui
    }

    function showNewTaskModal() {
        window.location.href = '/nova-tarefa';
    }

    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 1000;
            animation: slideIn 0.3s ease;
            ${type === 'success' ? 'background: #28a745;' : ''}
            ${type === 'error' ? 'background: #dc3545;' : ''}
            ${type === 'info' ? 'background: #17a2b8;' : ''}
        `;
        document.body.appendChild(notification);
        setTimeout(() => { notification.remove(); }, 3000);
    }
    
    // Adiciona CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { opacity: 0; transform: translateX(100%); }
            to { opacity: 1; transform: translateX(0); }
        }
        
        .task-item {
            transition: all 0.2s ease;
        }
        
        .task-checkbox:checked + .task-content .task-title {
            text-decoration: line-through;
            opacity: 0.6;
        }
    `;
    document.head.appendChild(style);
});