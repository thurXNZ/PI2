document.addEventListener('DOMContentLoaded', function() {
    const senhaInput = document.getElementById('senhaLogin');
    const toggleSenhaBtn = document.getElementById('toggleSenha');
    const form = document.getElementById('login');
    const mensagemErro2 = document.getElementById('MensagemErro');
    const botaoLogin = document.getElementById('log');
    const iconeUsuario = document.getElementById('usuarioIcone');

    toggleSenhaBtn.addEventListener('click', function() {
      if (senhaInput.type === 'password') {
          senhaInput.type = 'text';
          toggleSenhaBtn.innerHTML = '<i class="fas fa-eye"></i>';
      } else {
          senhaInput.type = 'password';
          toggleSenhaBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
      }
  });
  
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        const email = document.getElementById('emailLogin').value;
        const senha = document.getElementById('senhaLogin').value;
    
        const apiUrl = 'http://127.0.0.1:3003/api/users/login';
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });
    
        const data = await response.json();

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
        
        if (response.ok) {
            localStorage.setItem('accessToken', JSON.stringify(data.accessToken));
            localStorage.setItem('nomeUsuario', JSON.stringify(data.nome));
            localStorage.setItem('IDUsuario', JSON.stringify(data.id));
            
            setTimeout(function () {}, 2000);
        
                if (data.is_admin === 'Sim') {
                    window.location.href = 'http://127.0.0.1:3000/adm/admin.html';

                } else {
                    window.location.href = 'http://127.0.0.1:3000/home.html';
                }
           
        } else {
            mensagemErro2.textContent = 'Usuários e/ou senha estão incorretos!';
            mensagemErro2.style.display = 'block';
    
            setTimeout(function () {
                mensagemErro2.style.display = 'none';
            }, 2500);
        }
    });
    
});
