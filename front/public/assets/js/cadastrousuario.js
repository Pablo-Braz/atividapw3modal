// Função para exibir alertas Bootstrap
function exibirAlerta(mensagem, tipo = 'success') {
    // Remove alertas antigos
    $('.alert').remove();
    // Cria o alerta
    const alerta = `
        <div class="alert alert-${tipo} alert-dismissible fade show mt-3" role="alert">
            ${mensagem}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Fechar"></button>
        </div>
    `;
    // Adiciona o alerta antes do formulário
    $('#formUsuario').before(alerta);
}

$(document).ready(() => {
    // Função para limpar o formulário
    const limparFormulario = () => {
        $('#formUsuario')[0].reset();
    };

    // Evento de envio do formulário
    $('#formUsuario').on('submit', function (e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        // Coleta os dados do formulário
        const usuario = {
            fullname: $('#fullname').val(), // Nome completo
            email: $('#email').val(),       // E-mail
            telefone: $('#phone').val(),    // Telefone
            senha: $('#password').val(),     // Senha (sem encriptação)
            admin: false // Define o usuário como não administrador por padrão
        };

        // Configuração da requisição
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: JSON.stringify(usuario), // Converte o objeto para JSON
            redirect: 'follow'
        };

        // Envia os dados para a API
        fetch("http://localhost:3000/usuario", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao cadastrar o usuário.');
                }
                return response.json(); // <- Pega o usuário criado
            })
            .then(result => {
                exibirAlerta('Usuário cadastrado com sucesso! Redirecionando...', 'success');
                limparFormulario();
                // Salva os dados do usuário no localStorage
                localStorage.setItem('userData', 2); // tipo comum
                localStorage.setItem('idUsuario', result.id);
                localStorage.setItem('fullname', result.fullname);
                localStorage.setItem('emailUsuario', result.email);
                setTimeout(() => {
                    window.location.href = '/'; // Redireciona para o menu logado
                }, 2000);
            })
            .catch(error => {
                console.error('Erro:', error);
                exibirAlerta('Erro ao cadastrar o usuário.', 'danger');
            });
    });
});

