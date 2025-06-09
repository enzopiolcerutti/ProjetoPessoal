document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('nova-tarefa-form');
    const tituloInput = document.getElementById('titulo');
    const categoriaSelect = document.getElementById('categoria');
    const dataInput = document.getElementById('data');

    // Preview simples (pode ser expandido depois)
    tituloInput.addEventListener('input', () => {
        tituloInput.style.borderColor = tituloInput.value.length > 2 ? '#28a745' : '#dc3545';
    });
    categoriaSelect.addEventListener('change', () => {
        categoriaSelect.style.borderColor = categoriaSelect.value ? '#28a745' : '#dc3545';
    });
    dataInput.addEventListener('change', () => {
        dataInput.style.borderColor = dataInput.value ? '#28a745' : '#dc3545';
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const titulo = tituloInput.value.trim();
        const categoria = categoriaSelect.value;
        const data = dataInput.value;
        if (titulo.length < 3) {
            showPopup('O título deve ter pelo menos 3 caracteres.', 'error');
            return;
        }
        if (!categoria) {
            showPopup('Selecione uma categoria.', 'error');
            return;
        }
        if (!data) {
            showPopup('Selecione uma data.', 'error');
            return;
        }
        // Envio via fetch
        try {
            // Pega o id do usuário logado do localStorage
            const usuario_id = localStorage.getItem('usuario_id');
            if (!usuario_id) {
                showPopup('Usuário não autenticado. Faça login novamente.', 'error');
                return;
            }
            // Por padrão, tarefa nova não está concluída
            const concluida = false;
            // Garante que categoria_id seja um número válido existente no banco
            // O select de categoria deve ter como value o id da categoria (ex: <option value="1">Hoje</option>)
            let categoria_id = Number(categoria);
            if (isNaN(categoria_id) || categoria_id <= 0) {
                showPopup('Categoria inválida. Por favor, selecione uma categoria válida.', 'error');
                return;
            }

            const res = await fetch('/api/tarefas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ titulo, categoria_id, data, usuario_id, concluida })
            });
            if (res.ok) {
                showPopup('Tarefa criada com sucesso!', 'success');
                // Dispara evento para atualizar dashboard e tarefas
                window.dispatchEvent(new CustomEvent('tarefasAtualizadas'));
                setTimeout(() => { window.location.href = '/tarefas'; }, 1200);
            } else {
                let errorMsg = 'Erro ao criar tarefa.';
                try {
                    const data = await res.json();
                    errorMsg = data.error || JSON.stringify(data) || errorMsg;
                } catch (jsonErr) {
                    errorMsg += ' (Resposta inválida do servidor)';
                }
                console.error('Erro ao criar tarefa:', errorMsg);
                showPopup(errorMsg, 'error');
            }
        } catch (err) {
            showPopup('Erro de conexão com o servidor.', 'error');
        }
    });

    // Função de popup visual
    function showPopup(msg, type = 'info') {
        let popup = document.createElement('div');
        popup.className = `popup-msg popup-${type}`;
        popup.textContent = msg;
        document.body.appendChild(popup);
        setTimeout(() => { popup.classList.add('show'); }, 10);
        setTimeout(() => {
            popup.classList.remove('show');
            setTimeout(() => popup.remove(), 300);
        }, 2000);
    }
});

