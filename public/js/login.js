function startApp() {
    console.log('login.js carregado!');
    loginConfig();
    registerConfig();
}

function loginConfig() {  
    const loginForm = document.getElementById('loginForm');    
    if (!loginForm) {
        console.error('Formulário de login não encontrado!');
        return;
    }    
    loginForm.addEventListener('submit', loginExec);
}

async function loginExec(event) {
    event.preventDefault(); // Impede comportamento padrão (recarregar página)
    console.log('Iniciando login...');    
    try {
        //Pega valores dos inputs
        const email = document.getElementById('loginEmail').value.trim();
        const pwd = document.getElementById('loginPwd').value;    

        //Validações básicas
        if (!email || !pwd) {
            alert('Preencha email e senha!');
            return;
        }
        
        //Envia para backend
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: pwd
            })
        });
        
        //Converte resposta para JSON
        const data = await response.json();
        console.log('Resposta da API:', data);
        
        if (data.success) {
            // Guarda informações do usuário
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('userEmail', data.email);            
            // Redireciona para dashboard
            window.location.href = '/dashboard';
            
        } else {
            // Login FALHOU
            console.error('Login falhou:', data.message);
            alert('Erro: ' + data.message);
        }
        
    } catch (error) {
        // Erro de conexão ou outro problema
        console.error('Erro no login:', error);
        alert('Erro de conexão com o servidor');
    }
}

function registerConfig() {  
    // 1. Encontra o botão de registro
    const registerForm = document.getElementById('registerForm');
    
    // Se não encontrou, para aqui
    if (!registerForm) {
        console.error('Formulário de registro não encontrado!');
        return;
    }
    
    // 2. Adiciona "escutador" para quando botão for clicado
    registerForm.addEventListener('submit', registerExec);
}

async function registerExec(event) {
    event.preventDefault();
    console.log('Iniciando registro...');
    
    try {
        // 3. Pega valores dos inputs
        const username = document.getElementById('registerUsername').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const pwd = document.getElementById('registerPwd').value;
        
        // 4. VALIDAÇÕES (frontend)
        if (!username || !email || !pwd) {
            alert('Preencha todos os campos!');
            return;
        }
        if (pwd.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return;
        }
        
        // 5. Mostra que está processando
        console.log('Criando conta...');
        
        // 6. Envia para backend
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                email: email,
                password: pwd
            })
        });
        
        // 7. Converte resposta para JSON
        const data = await response.json();
        console.log('Resposta da API:', data);
        
        // 8. Verifica se deu certo
        if (data.success) {
            // Registro BEM-SUCEDIDO
            console.log('Conta criada com sucesso!');
            
            // Limpa formulário
            document.getElementById('registerForm').reset();
            
            // Mostra mensagem de sucesso
            alert('🎉 Conta criada! Agora faça login.');
            
            // (Opcional) Foca no campo de email do login
            document.getElementById('loginEmail').value = email;
            document.getElementById('loginEmail').focus();
            
        } else {
            // Registro FALHOU
            console.error('Registro falhou:', data.message);
            alert('Erro: ' + data.message);
        }
        
    } catch (error) {
        // Erro de conexão
        console.error('Erro no registro:', error);
        alert('Erro de conexão com o servidor');
    }
}

// ==================== INICIA TUDO ====================
// Espera o HTML carregar completamente
document.addEventListener('DOMContentLoaded', startApp);
