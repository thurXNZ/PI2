document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registro');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const senha = document.getElementById('senha').value;
        const senha2 = document.getElementById('senha2').value;
        const nome = document.getElementById('nome').value;
        const sobrenome = document.getElementById('sobrenome').value;
        const cpf = document.getElementById('cpf').value;
        const dataNascimento = document.getElementById('dataNascimento').value;
        const genero = document.getElementById('genero').value;

        function showCustomAlert(message, type) {
            var alertBox = document.getElementById('customAlert');
            alertBox.textContent = message;
            
            if (type === 'success') {
                alertBox.classList.remove('error');
                alertBox.classList.add('success');
            } else {
                alertBox.classList.remove('success');
                alertBox.classList.add('error');
            }
        
            alertBox.style.display = 'block';
            setTimeout(function () {
                alertBox.style.display = 'none';
            }, 2500);
        }

        if (senha !== senha2) {
            showCustomAlert('As senhas não são iguais. Por favor, verifique novamente.', 'error');
            return; 
        }

        if (senha && senha2 < 8){
            showCustomAlert('Senha muito curta. É obrigatório que tenha pelo menos 8 caracteres', 'error');
            return;
        }

        const apiUrl = 'http://127.0.0.1:3003/api/users';
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                senha: senha,
                nome: nome,
                sobrenome: sobrenome,
                cpf: cpf,
                dataNascimento: dataNascimento,
                genero: genero,
                is_admin: 'Nao'
            })
        });

        const data = await response.json();

        if (response.ok) {
            showCustomAlert('Usuário criado com sucesso. Por favor, faça o seu login!', 'success');
        
            setTimeout(function () {
                window.location.href = 'http://127.0.0.1:3000/login.html';
            }, 2000);
        
        } else {
            showCustomAlert('Ocorreu um erro ao fazer o cadastro!', 'error');
            return
        }
        
        console.log(data);
    });

})

