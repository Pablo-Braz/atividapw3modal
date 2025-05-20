$(document).ready(() => {
    $('#formLogin').on('submit', async function (e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        // Captura os dados do formulário
        const email = $('#email').val();
        const senha = $('#password').val();

        console.log('E-mail digitado:', email);
        console.log('Senha digitada:', senha);

        try {
            // Faz uma requisição GET para buscar todos os usuários cadastrados
            const resposta = await fetch("http://localhost:3000/usuario");
            console.log('Resposta da requisição:', resposta);

            if (!resposta.ok) {
                throw new Error('Erro ao buscar usuários.');
            }

            const usuarios = await resposta.json(); // Converte a resposta para JSON
            console.log('Usuários cadastrados:', usuarios);

            // Verifica se o usuário existe e a senha está correta (sem encriptação)
            const usuarioEncontrado = usuarios.find(
                usuario => usuario.email === email && usuario.senha === senha
            );

            console.log('Usuário encontrado:', usuarioEncontrado);

            // No login, salve também o id do usuário:
            if (usuarioEncontrado) {
                const tipoUsuario = usuarioEncontrado.admin ? 1 : 2;
                localStorage.setItem('userData', tipoUsuario);
                localStorage.setItem('fullname', usuarioEncontrado.fullname);
                localStorage.setItem('emailUsuario', usuarioEncontrado.email);
                localStorage.setItem('idUsuario', usuarioEncontrado.id); // <-- Salve o id aqui!
                alert('Login realizado com sucesso!');
                window.location.href = '/home';
            } else {
                alert('E-mail ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao realizar login. Tente novamente mais tarde.');
        }
    });

    // Exibe o nome do usuário logado
    const nomeUsuario = localStorage.getItem('fullname') || 'usuariologado';
    const spanNome = document.getElementById('usuarioLogadoNome');
    if (spanNome) {
      spanNome.textContent = nomeUsuario;
    }

    // Abrir modal ao clicar no nome
    document.getElementById('editarPerfilBtn').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('novoNomeUsuario').value = nomeUsuario;
        // Se já houver imagem salva, mostra ela
        const imgSalva = localStorage.getItem('imagemPerfil');
        document.getElementById('previewImagemPerfil').src = imgSalva || 'https://img.icons8.com/bubbles/100/000000/user.png';
        var modal = new bootstrap.Modal(document.getElementById('modalEditarPerfil'));
        modal.show();
    });

    // Pré-visualização da imagem
    document.getElementById('imagemPerfil').addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
          document.getElementById('previewImagemPerfil').src = evt.target.result;
        };
        reader.readAsDataURL(file);
      }
    });

    // Salvar alterações do perfil
    document.getElementById('formEditarPerfil').addEventListener('submit', async function(e) {
      e.preventDefault();
      const novoNome = document.getElementById('novoNomeUsuario').value;
      const file = document.getElementById('imagemPerfil').files[0];
      let imagemUrl = localStorage.getItem('imagemPerfil');

      // Se o usuário selecionou uma nova imagem, faz upload
      if (file) {
        const formData = new FormData();
        formData.append('file', file);

        // Altere a URL para o endpoint de upload de usuários
        const response = await fetch('http://localhost:3037/upload/usuario', {
          method: 'POST',
          body: formData
        });

        if (!response.ok) {
          alert('Erro ao fazer upload da imagem!');
          return;
        }

        const result = await response.json();
        imagemUrl = result.url; // URL da imagem salva no servidor
      }

      // Atualiza o usuário no json-server
      const id = localStorage.getItem('idUsuario');
      if (!id) {
        alert('Usuário não identificado!');
        return;
      }

      fetch(`http://localhost:3000/usuario/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullname: novoNome,
          imagemPerfil: imagemUrl
        })
      })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar perfil');
        return response.json();
      })
      .then(data => {
        localStorage.setItem('fullname', novoNome);
        localStorage.setItem('imagemPerfil', imagemUrl);
        document.getElementById('usuarioLogadoNome').textContent = novoNome;
        atualizarIconePerfilMenu();
        bootstrap.Modal.getInstance(document.getElementById('modalEditarPerfil')).hide();
        alert('Perfil atualizado com sucesso!');
      })
      .catch(error => {
        alert('Erro ao atualizar perfil!');
        console.error(error);
      });
    });

    // Função de sair
    const btnSair = document.getElementById('botãodesair');
    if (btnSair) {
      btnSair.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        localStorage.removeItem('userName');
        localStorage.removeItem('fullname');
        localStorage.removeItem('imagemPerfil');
        window.location.href = '/';
      });
    }

    // Atualiza o ícone do perfil no menu com a imagem salva
    function atualizarIconePerfilMenu() {
      const imgPerfil = localStorage.getItem('imagemPerfil');
      const icone = document.getElementById('iconePerfilMenu');
      if (icone) {
        icone.src = imgPerfil || 'https://img.icons8.com/bubbles/100/000000/user.png';
      }
    }

    // Chame ao carregar a página
    atualizarIconePerfilMenu();
});