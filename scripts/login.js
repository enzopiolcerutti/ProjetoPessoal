// Aguarda o carregamento completo da página
document.addEventListener('DOMContentLoaded', function() {
    // Seleciona os elementos do formulário
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const loginButton = document.querySelector('.login-button');
    const loginCard = document.querySelector('.login-card');

    // Adiciona event listeners para validação em tempo real
    nomeInput.addEventListener('input', validateNome);
    emailInput.addEventListener('input', validateEmail);
    senhaInput.addEventListener('input', validateSenha);
    loginButton.addEventListener('click', handleLogin);

    // Adiciona efeitos visuais nos inputs
    [nomeInput, emailInput, senhaInput].forEach(input => {
        input.addEventListener('focus', function() {
            this.style.boxShadow = '0 0 0 2px rgba(64, 65, 58, 0.3)';
            this.style.transform = 'scale(1.02)';
            this.style.transition = 'all 0.2s ease';
        });

        input.addEventListener('blur', function() {
            this.style.boxShadow = 'none';
            this.style.transform = 'scale(1)';
        });
    });

    // Função para validar nome
    function validateNome() {
        const nome = nomeInput.value.trim();
        const isValid = nome.length >= 2;
        
        updateFieldValidation(nomeInput, isValid);
        return isValid;
    }

    // Função para validar email
    function validateEmail() {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(email);
        
        updateFieldValidation(emailInput, isValid);
        return isValid;
    }

    // Função para validar senha
    function validateSenha() {
        const senha = senhaInput.value;
        const isValid = senha.length >= 6;
        
        updateFieldValidation(senhaInput, isValid);
        return isValid;
    }

    // Função para atualizar visual de validação
    function updateFieldValidation(input, isValid) {
        if (input.value.length > 0) {
            if (isValid) {
                input.style.borderLeft = '4px solid #28a745';
                input.style.backgroundColor = '#f8fff9';
            } else {
                input.style.borderLeft = '4px solid #dc3545';
                input.style.backgroundColor = '#fff8f8';
            }
        } else {
            input.style.borderLeft = 'none';
            input.style.backgroundColor = 'white';
        }
    }

    // Função para mostrar mensagens
    function showMessage(message, type = 'info') {
        // Remove mensagem anterior se existir
        const existingMessage = document.querySelector('.message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Cria nova mensagem
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        // Estilos da mensagem
        messageDiv.style.cssText = `
            position: absolute;
            top: -50px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px 20px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            z-index: 1000;
            animation: slideDown 0.3s ease;
            ${type === 'error' ? 'background: #dc3545; color: white;' : ''}
            ${type === 'success' ? 'background: #28a745; color: white;' : ''}
            ${type === 'info' ? 'background: #17a2b8; color: white;' : ''}
        `;

        loginCard.appendChild(messageDiv);

        // Remove a mensagem após 3 segundos
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 3000);
    }

    // Função principal de login
    async function handleLogin(event) {
        event.preventDefault();

        // Valida todos os campos
        const isNomeValid = validateNome();
        const isEmailValid = validateEmail();
        const isSenhaValid = validateSenha();

        // Verifica se todos os campos estão preenchidos
        if (!nomeInput.value.trim() || !emailInput.value.trim() || !senhaInput.value) {
            showMessage('Por favor, preencha todos os campos!', 'error');
            return;
        }

        // Verifica se todos os campos são válidos
        if (!isNomeValid || !isEmailValid || !isSenhaValid) {
            showMessage('Por favor, corrija os campos destacados!', 'error');
            return;
        }

        loginButton.disabled = true;
        loginButton.textContent = 'Entrando...';
        loginButton.style.background = '#666';
        try {
            const res = await fetch('/api/usuarios/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: emailInput.value.trim(),
                    senha: senhaInput.value
                })
            });
            const data = await res.json();
            if (res.ok && data.success) {
                // Salva o id do usuário logado no localStorage para uso futuro
                localStorage.setItem('usuario_id', data.usuario.id);
                showMessage('Login realizado com sucesso!', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 1000);
            } else {
                showMessage(data.error || 'Login inválido!', 'error');
            }
        } catch (err) {
            showMessage('Erro de conexão com o servidor.', 'error');
        } finally {
            loginButton.disabled = false;
            loginButton.textContent = 'Entrar';
            loginButton.style.background = 'black';
        }
    }

    // Adiciona animação de entrada na página
    loginCard.style.opacity = '0';
    loginCard.style.transform = 'translateY(50px)';
    
    setTimeout(() => {
        loginCard.style.transition = 'all 0.5s ease';
        loginCard.style.opacity = '1';
        loginCard.style.transform = 'translateY(0)';
    }, 100);

    // Adiciona suporte para Enter
    [nomeInput, emailInput, senhaInput].forEach(input => {
        input.addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                handleLogin(event);
            }
        });
    });

    // Função para limpar formulário (pode ser útil)
    function clearForm() {
        nomeInput.value = '';
        emailInput.value = '';
        senhaInput.value = '';
        
        [nomeInput, emailInput, senhaInput].forEach(input => {
            updateFieldValidation(input, true);
        });
    }

    // Adiciona CSS para animações
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateX(-50%) translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(-50%) translateY(0);
            }
        }
        
        .input-field {
            transition: all 0.2s ease;
        }
        
        .login-button:disabled {
            cursor: not-allowed;
            opacity: 0.7;
        }
    `;
    document.head.appendChild(style);
});