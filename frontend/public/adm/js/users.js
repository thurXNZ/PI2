document.addEventListener('DOMContentLoaded', function () {
    getUsersData();
});

function getUsersData() {
    fetch('http://127.0.0.1:3003/api/users')
        .then(response => response.json())
        .then(userData => {
            fillTableWithUserData(userData);
        })
        .catch(error => {
            console.error('Erro ao recuperar dados dos usuários:', error);
        });
}

function fillTableWithUserData(userData) {
    var tableBody = document.querySelector('#datatablesSimple tbody');

    var tableHeader = '<thead>' +
        '<tr>' +
        '<th>ID</th>' +
        '<th>Nome</th>' +
        '<th>Sobrenome</th>' +
        '<th>Email</th>' +
        '<th>Data de Nascimento</th>' +
        '<th>Gênero</th>' +
        '<th>CPF</th>' +
        '<th></th>' +
        '</tr>' +
        '</thead>';

    tableBody.insertAdjacentHTML('beforebegin', tableHeader);

    userData.forEach(function (user) {
        var row = '<tr>' +
            '<td>' + user.id + '</td>' +
            '<td>' + user.nome + '</td>' +
            '<td>' + user.sobrenome + '</td>' +
            '<td>' + user.email + '</td>' +
            '<td>' + user.dataNascimento + '</td>' +
            '<td>' + user.genero + '</td>' +
            '<td>' + user.cpf + '</td>' +
            '<td> <button class="btn btn-more" data-id="' + user.id + '"> <img src="../img/mais.png" alt="" width="24px"> </button> </td>' +
            '</tr>';
        tableBody.innerHTML += row;
    });

    tableBody.addEventListener('click', function (event) {
        if (event.target.closest('.btn-more')) {
            var button = event.target.closest('.btn-more');
            var userId = button.getAttribute('data-id');
            var user = userData.find(u => u.id == userId);

            if (user) {
                document.getElementById('modalUserId').innerText = user.id;
                document.getElementById('modalUserNome').innerText = user.nome;
                document.getElementById('modalUserSobrenome').innerText = user.sobrenome;
                document.getElementById('modalUserEmail').innerText = user.email;
                document.getElementById('modalUserDataNascimento').innerText = user.dataNascimento;
                document.getElementById('modalUserGenero').innerText = user.genero;
                document.getElementById('modalUserAdmin').innerText = user.is_admin;


                var userModal = new bootstrap.Modal(document.getElementById('userModal'));
                userModal.show();

                document.getElementById('editUserBtn').onclick = function () {
                    openEditUserModal(user);
                    userModal.hide();
                };

                document.getElementById('deleteUserBtn').onclick = function () {
                    deleteUser(user.id);
                    userModal.hide();
                };
            } else {
                console.error('Usuário não encontrado com ID:', userId);
            }
        }
    });
}

function openEditUserModal(user) {
    document.getElementById('editUserId').value = user.id;
    document.getElementById('editUserNome').value = user.nome;
    document.getElementById('editUserSobrenome').value = user.sobrenome;
    document.getElementById('editUserEmail').value = user.email;
    document.getElementById('editUserDataNascimento').value = user.dataNascimento;
    document.getElementById('editUserGenero').value = user.genero;
    document.getElementById('editUserAdmin').value = user.is_admin;


    var editUserModal = new bootstrap.Modal(document.getElementById('editUserModal'));
    editUserModal.show();
}

document.getElementById('editUserForm').addEventListener('submit', function (event) {
    event.preventDefault();

    var userId = document.getElementById('editUserId').value;
    var user = {
        id: userId,
        nome: document.getElementById('editUserNome').value,
        sobrenome: document.getElementById('editUserSobrenome').value,
        email: document.getElementById('editUserEmail').value,
        dataNascimento: document.getElementById('editUserDataNascimento').value,
        genero: document.getElementById('editUserGenero').value,
        is_admin: document.getElementById('editUserAdmin').value
    };

    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    fetch(`http://127.0.0.1:3003/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
});

function deleteUser(userId) {
    const accessToken = JSON.parse(localStorage.getItem('accessToken'));

    fetch(`http://127.0.0.1:3003/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            location.reload();
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createUserForm');
    const cpfInput = document.getElementById('createUserCpf');

    cpfInput.addEventListener('input', function () {
        let value = this.value.replace(/\D/g, '');
        if (value.length > 3) {
            value = value.substring(0, 3) + '.' + value.substring(3);
        }
        if (value.length > 7) {
            value = value.substring(0, 7) + '.' + value.substring(7);
        }
        if (value.length > 11) {
            value = value.substring(0, 11) + '-' + value.substring(11, 13);
        }
        this.value = value;
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const createUserNome = document.getElementById('createUserNome').value;
        const createUserSobrenome = document.getElementById('createUserSobrenome').value;
        const createUserEmail = document.getElementById('createUserEmail').value;
        const createUserDataNascimento = document.getElementById('createUserDataNascimento').value;
        const createUserGenero = document.getElementById('createUserGenero').value;
        const createUserSenha = document.getElementById('createUserSenha').value;
        const createUserRepitaSenha = document.getElementById('createUserRepitaSenha').value;
        const createUserCpf = cpfInput.value;
        const createUserAdmin = document.getElementById('createUserAdmin').value;

        const mensagemErro = document.getElementById('mensagemErro');
        const mensagemSucesso = document.getElementById('mensagemSucesso');

        if (createUserSenha !== createUserRepitaSenha) {
            mensagemErro.textContent = 'As senhas não estão iguais!';
            mensagemErro.style.display = 'block';

            setTimeout(function () {
                mensagemErro.style.display = 'none';
            }, 2500);

        } else {
            const apiUrl = 'http://127.0.0.1:3003/api/users';
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nome: createUserNome,
                    sobrenome: createUserSobrenome,
                    email: createUserEmail,
                    dataNascimento: createUserDataNascimento,
                    genero: createUserGenero,
                    senha: createUserSenha,
                    cpf: createUserCpf,
                    is_admin: createUserAdmin
                })
            });

            if (response.ok) {
                mensagemSucesso.textContent = 'Usuário adicionado com sucesso!';
                mensagemSucesso.style.display = 'block';

                form.reset();

                document.addEventListener('DOMContentLoaded', () => {
                    const form = document.getElementById('createUserForm');
                    const cpfInput = document.getElementById('createUserCpf');
                    const createUserModal = new bootstrap.Modal(document.getElementById('createUserModal'));

                    cpfInput.addEventListener('input', function () {
                        let value = this.value.replace(/\D/g, '');
                        if (value.length > 3) {
                            value = value.substring(0, 3) + '.' + value.substring(3);
                        }
                        if (value.length > 7) {
                            value = value.substring(0, 7) + '.' + value.substring(7);
                        }
                        if (value.length > 11) {
                            value = value.substring(0, 11) + '-' + value.substring(11, 13);
                        }
                        this.value = value;
                    });

                    form.addEventListener('submit', async (event) => {
                        event.preventDefault();

                        const createUserNome = document.getElementById('createUserNome').value;
                        const createUserSobrenome = document.getElementById('createUserSobrenome').value;
                        const createUserEmail = document.getElementById('createUserEmail').value;
                        const createUserDataNascimento = document.getElementById('createUserDataNascimento').value;
                        const createUserGenero = document.getElementById('createUserGenero').value;
                        const createUserSenha = document.getElementById('createUserSenha').value;
                        const createUserRepitaSenha = document.getElementById('createUserRepitaSenha').value;
                        const createUserCpf = cpfInput.value;
                        const createUserAdmin = document.getElementById('createUserAdmin').value;

                        const mensagemErro = document.getElementById('mensagemErro');
                        const mensagemSucesso = document.getElementById('mensagemSucesso');

                        if (createUserSenha !== createUserRepitaSenha) {
                            mensagemErro.textContent = 'As senhas não estão iguais!';
                            mensagemErro.style.display = 'block';

                            setTimeout(function () {
                                mensagemErro.style.display = 'none';
                            }, 2500);

                        } else {
                            const apiUrl = 'http://127.0.0.1:3003/api/users';
                            const response = await fetch(apiUrl, {
                                method: "POST",
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    nome: createUserNome,
                                    sobrenome: createUserSobrenome,
                                    email: createUserEmail,
                                    dataNascimento: createUserDataNascimento,
                                    genero: createUserGenero,
                                    senha: createUserSenha,
                                    cpf: createUserCpf,
                                    is_admin: createUserAdmin
                                })
                            });

                            if (response.ok) {
                                mensagemSucesso.textContent = 'Usuário adicionado com sucesso!';
                                mensagemSucesso.style.display = 'block';

                                form.reset();

                                createUserModal.hide();

                                setTimeout(function () {

                                    location.reload();

                                }, 2500);
                            } else {
                                mensagemErro.textContent = 'Ocorreu um erro ao adicionar o usuário.';
                                mensagemErro.style.display = 'block';
                            }

                            setTimeout(function () {
                                mensagemErro.style.display = 'none';
                                mensagemSucesso.style.display = 'none';
                            }, 2500);
                        }
                    });
                });


                setTimeout(function () {
                    location.reload();
                }, 2500);
                
            } else {
                mensagemErro.textContent = 'Ocorreu um erro ao adicionar o usuário.';
                mensagemErro.style.display = 'block';
            }

            setTimeout(function () {
                mensagemErro.style.display = 'none';
                mensagemSucesso.style.display = 'none';
            }, 2500);
        }
    });
});