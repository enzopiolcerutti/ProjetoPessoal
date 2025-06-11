// Comentado para não sobrescrever o HTML/EJS do servidor
// document.addEventListener('DOMContentLoaded', function() {
//     const tasksList = document.getElementById('tasks-list');
//     const emptyState = document.getElementById('empty-state');
//     const searchInput = document.getElementById('search-tasks');
//     const filterInput = document.getElementById('filter-input');
//     const statusFilter = document.getElementById('status-filter');
//     const categoryFilter = document.getElementById('category-filter');
//     const newTaskBtn = document.getElementById('new-task-btn');
//     const modalOverlay = document.getElementById('modal-overlay');
//     const cancelBtn = document.getElementById('cancel-btn');
//     const taskForm = document.getElementById('nova-tarefa-form');

//     // Função para buscar e renderizar tarefas
//     async function loadTarefas() {
//         const usuario_id = localStorage.getItem('usuario_id');
//         const res = await fetch(`/api/tarefas?usuario_id=${usuario_id}`);
//         const tarefas = await res.json();
//         renderTarefas(tarefas);
//         updateDashboardNumbers();
//     }

//     // Renderiza tarefas na tela
//     function renderTarefas(tarefas) {
//         tasksList.innerHTML = '';
//         if (!tarefas.length) {
//             emptyState.style.display = 'block';
//             return;
//         }
//         emptyState.style.display = 'none';
//         tarefas.forEach(tarefa => {
//             const div = document.createElement('div');
//             div.className = 'tarefa-item';
//             div.innerHTML = `
//                 <span class="tarefa-titulo ${tarefa.concluida ? 'concluida' : ''}">${tarefa.titulo}</span>
//                 <span class="tarefa-categoria">${tarefa.categoria_id || ''}</span>
//                 <span class="tarefa-data">${tarefa.data ? new Date(tarefa.data).toLocaleDateString('pt-BR') : ''}</span>
//                 <button class="btn-concluir" ${tarefa.concluida ? 'disabled' : ''}>Concluir</button>
//                 <button class="btn-excluir">Excluir</button>
//             `;
//             // Concluir tarefa
//             div.querySelector('.btn-concluir').onclick = async () => {
//                 await fetch(`/api/tarefas/${tarefa.id}`, {
//                     method: 'PUT',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ ...tarefa, concluida: true })
//                 });
//                 showMotivationalPopup();
//                 loadTarefas();
//             };
//             // Excluir tarefa
//             div.querySelector('.btn-excluir').onclick = async () => {
//                 await fetch(`/api/tarefas/${tarefa.id}`, { method: 'DELETE' });
//                 loadTarefas();
//             };
//             tasksList.appendChild(div);
//         });
//     }

//     // Pop-up de frase motivacional
//     async function showMotivationalPopup() {
//         // Buscar frases do backend (pode ser por XP, aqui pego aleatória)
//         const res = await fetch('/api/frases');
//         const frases = await res.json();
//         const frase = frases[Math.floor(Math.random() * frases.length)];
//         let popup = document.createElement('div');
//         popup.className = 'popup-msg popup-info';
//         popup.textContent = frase.texto;
//         document.body.appendChild(popup);
//         setTimeout(() => { popup.classList.add('show'); }, 10);
//         setTimeout(() => {
//             popup.classList.remove('show');
//             setTimeout(() => popup.remove(), 300);
//         }, 2500);
//     }

//     // Atualiza números do dashboard (via fetch e evento customizado)
//     async function updateDashboardNumbers() {
//         const usuario_id = localStorage.getItem('usuario_id');
//         const res = await fetch(`/api/tarefas?usuario_id=${usuario_id}`);
//         const tarefas = await res.json();
//         const pendentes = tarefas.filter(t => !t.concluida).length;
//         const concluidas = tarefas.filter(t => t.concluida).length;
//         // Dispara evento customizado para dashboard
//         window.dispatchEvent(new CustomEvent('tarefasAtualizadas', { detail: { pendentes, concluidas } }));
//     }

//     // Inicialização
//     loadTarefas();
//     // Se quiser atualizar ao voltar da tela de nova tarefa:
//     window.addEventListener('focus', loadTarefas);
// });
document.addEventListener('DOMContentLoaded', function() {
    const tasksList = document.getElementById('tasks-list');
    const emptyState = document.getElementById('empty-state');
    const searchInput = document.getElementById('search-tasks');
    const filterInput = document.getElementById('filter-input');
    const statusFilter = document.getElementById('status-filter');
    const categoryFilter = document.getElementById('category-filter');
    const newTaskBtn = document.getElementById('new-task-btn');
    const modalOverlay = document.getElementById('modal-overlay');
    const cancelBtn = document.getElementById('cancel-btn');
    const taskForm = document.getElementById('nova-tarefa-form');

    // Função para buscar e renderizar tarefas
    async function loadTarefas() {
        const usuario_id = localStorage.getItem('usuario_id');
        const res = await fetch(`/api/tarefas?usuario_id=${usuario_id}`);
        const tarefas = await res.json();
        renderTarefas(tarefas);
        updateDashboardNumbers();
    }

    // Renderiza tarefas na tela
    function renderTarefas(tarefas) {
        if (!tarefas.length) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        tarefas.forEach(tarefa => {
            const div = document.createElement('div');
            div.className = 'tarefa-item';
            div.setAttribute('data-id', tarefa.id); // Adicionado para exclusão
            div.innerHTML = `
                <span class="tarefa-titulo ${tarefa.concluida ? 'concluida' : ''}">${tarefa.titulo}</span>
                <span class="tarefa-categoria">${tarefa.categoria_id || ''}</span>
                <span class="tarefa-data">${tarefa.data ? new Date(tarefa.data).toLocaleDateString('pt-BR') : ''}</span>
                <button class="btn-concluir" ${tarefa.concluida ? 'disabled' : ''}>Concluir</button>
                <button class="btn-excluir">Excluir</button>
                <i class="task-delete">🗑️</i> <!-- Ícone de lixeira para exclusão -->
            `;
            // Concluir tarefa
            div.querySelector('.btn-concluir').onclick = async () => {
                await fetch(`/api/tarefas/${tarefa.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...tarefa, concluida: true })
                });
                showMotivationalPopup();
                loadTarefas();
            };
            // Excluir tarefa
            div.querySelector('.btn-excluir').onclick = async () => {
                await fetch(`/api/tarefas/${tarefa.id}`, { method: 'DELETE' });
                loadTarefas();
            };
            // Excluir tarefa ao clicar no ícone de lixeira
            div.querySelector('.task-delete').onclick = async () => {
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    await fetch(`/api/tarefas/${tarefa.id}`, { method: 'DELETE' });
                    div.remove();
                    updateDashboardNumbers();
                }
            };
            tasksList.appendChild(div);
        });
    }

    // Pop-up de frase motivacional
    async function showMotivationalPopup() {
        // Buscar frases do backend (pode ser por XP, aqui pego aleatória)
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

    // Atualiza números do dashboard (via fetch e evento customizado)
    async function updateDashboardNumbers() {
        const usuario_id = localStorage.getItem('usuario_id');
        const res = await fetch(`/api/tarefas?usuario_id=${usuario_id}`);
        const tarefas = await res.json();
        const pendentes = tarefas.filter(t => !t.concluida).length;
        const concluidas = tarefas.filter(t => t.concluida).length;
        // Dispara evento customizado para dashboard
        window.dispatchEvent(new CustomEvent('tarefasAtualizadas', { detail: { pendentes, concluidas } }));
    }

    // Excluir tarefa ao clicar no ícone de lixeira
    document.querySelectorAll('.task-delete').forEach(function(btn) {
        btn.addEventListener('click', async function(e) {
            const taskItem = btn.closest('.task-item');
            if (!taskItem) return;
            const tarefaId = taskItem.getAttribute('data-id');
            if (tarefaId) {
                await fetch(`/api/tarefas/${tarefaId}`, { method: 'DELETE' });
                taskItem.remove();
            }
        });
    });

    // Dropdown de perfil reutilizável
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

    // Inicialização
    loadTarefas();
    // Se quiser atualizar ao voltar da tela de nova tarefa:
    window.addEventListener('focus', loadTarefas);
});