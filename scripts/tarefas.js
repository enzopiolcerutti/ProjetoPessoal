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
        tasksList.innerHTML = '';
        if (!tarefas.length) {
            emptyState.style.display = 'block';
            return;
        }
        emptyState.style.display = 'none';
        tarefas.forEach(tarefa => {
            const div = document.createElement('div');
            div.className = 'tarefa-item';
            div.innerHTML = `
                <span class="tarefa-titulo ${tarefa.concluida ? 'concluida' : ''}">${tarefa.titulo}</span>
                <span class="tarefa-categoria">${tarefa.categoria_id || ''}</span>
                <span class="tarefa-data">${tarefa.data ? new Date(tarefa.data).toLocaleDateString('pt-BR') : ''}</span>
                <button class="btn-concluir" ${tarefa.concluida ? 'disabled' : ''}>Concluir</button>
                <button class="btn-excluir">Excluir</button>
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

    // Inicialização
    loadTarefas();
    // Se quiser atualizar ao voltar da tela de nova tarefa:
    window.addEventListener('focus', loadTarefas);
});