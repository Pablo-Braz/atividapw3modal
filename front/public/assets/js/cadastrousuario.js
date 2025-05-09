$(document).ready(() => {
    // O código dentro de $(document).ready() é executado assim que o DOM estiver completamente carregado.
    // Isso garante que os elementos do HTML estejam disponíveis para manipulação.

    // Função para limpar o formulário
    const limparFormulario = () => {
        // Seleciona o formulário com o ID 'formUsuario' e reseta todos os seus campos.
        $('#formUsuario')[0].reset(); // O [0] acessa o elemento DOM puro, necessário para o método reset().
    };

    // Evento de envio do formulário
    $('#formUsuario').on('submit', function (e) {
        // Adiciona um ouvinte de evento para o envio do formulário.
        // 'submit' é o evento disparado quando o formulário é enviado.

        e.preventDefault(); // Evita o comportamento padrão do formulário, que é recarregar a página.

        // Encripta a senha com SHA-256
        const senhaEncriptada = CryptoJS.SHA256($('#password').val()).toString();
        // CryptoJS.SHA256: Aplica o algoritmo de hash SHA-256 à senha capturada do campo com ID 'password'.
        // .toString(): Converte o hash gerado para uma string legível.

        // Coleta os dados do formulário
        const usuario = {
            fullname: $('#fullname').val(), // Captura o valor do campo com ID 'fullname' (Nome completo).
            email: $('#email').val(),       // Captura o valor do campo com ID 'email' (E-mail).
            telefone: $('#dlno').val(),     // Captura o valor do campo com ID 'dlno' (Telefone).
            senha: senhaEncriptada          // Adiciona a senha encriptada ao objeto.
        };

        // Configuração da requisição
        const myHeaders = new Headers(); // Cria um novo objeto Headers para configurar os cabeçalhos da requisição.
        myHeaders.append("Content-Type", "application/json");
        // Adiciona o cabeçalho 'Content-Type' com o valor 'application/json', indicando que o corpo da requisição será em JSON.

        const requestOptions = {
            method: 'POST', // Define o método HTTP como POST, usado para enviar dados ao servidor.
            headers: myHeaders, // Inclui os cabeçalhos configurados anteriormente.
            body: JSON.stringify(usuario), // Converte o objeto 'usuario' para uma string JSON.
            redirect: 'follow' // Define o comportamento de redirecionamento como 'follow', que segue automaticamente redirecionamentos HTTP.
        };

        // Envia os dados para a API
        fetch("http://localhost:3000/usuario", requestOptions)
            // fetch: Faz uma requisição HTTP para a URL especificada.
            // Retorna uma Promise que resolve com a resposta da requisição.

            .then(response => {
                // O primeiro then é executado quando a resposta da API é recebida.
                if (response.ok) {
                    // Verifica se a resposta tem um status HTTP de sucesso (200-299).
                    exibirAlerta('Usuário cadastrado com sucesso!', 'success');
                    // Chama a função exibirAlerta para mostrar uma mensagem de sucesso.
                    limparFormulario();
                    // Chama a função limparFormulario para resetar os campos do formulário.
                } else {
                    // Se o status HTTP não for de sucesso, lança um erro.
                    throw new Error('Erro ao cadastrar o usuário.');
                }
                return response.json(); // Converte a resposta para JSON.
            })
            .then(result => console.log(result))
            // O segundo then é executado com os dados convertidos para JSON.
            // Aqui, os dados retornados pela API são exibidos no console.

            .catch(error => {
                // O catch é executado se ocorrer um erro em qualquer parte da Promise.
                console.error('Erro:', error); // Exibe o erro no console.
                exibirAlerta('Erro ao cadastrar o usuário.', 'danger');
                // Mostra uma mensagem de erro ao usuário.
            });
    });
});