// Função para validar o formulário antes de enviar os dados
function validateForm() 
{
    $(document).ready(() => {
        // Função para exibir o alerta
        const exibirAlerta = (mensagem, tipo) => {
            const alerta = $('#alerta');
            alerta
                .removeClass('d-none alert-success alert-danger alert-warning') // Remove classes antigas
                .addClass(`alert-${tipo}`) // Adiciona a classe do tipo (success, danger ou warning)
                .find('strong').text(mensagem); // Define a mensagem no elemento <strong>
        };
    
        // Função para limpar o formulário
        const limparFormulario = () => {
            $('#formUsuario')[0].reset(); // Reseta todos os campos do formulário
        };
    
        // Atualize o evento de envio do formulário
        $('#formUsuario').on('submit', function (e) {
            e.preventDefault(); // Evita o envio padrão do formulário
    
            // Pega todos os dados manualmente
            const usuario = {
                nome: $('#fullname').val(),
                email: $('#email').val(),
                telefone: $('#dlno').val(),
                senha: $('#password').val(),
            };
    
            // Enviando os dados para a API de back-end
            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
    
            let dados = JSON.stringify(usuario);
    
            let requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: dados,
                redirect: 'follow'
            };
    
            fetch("http://localhost:3030", requestOptions)
                .then(response => {
                    if (response.ok) {
                        exibirAlerta('Usuário cadastrado com sucesso!', 'success');
                        limparFormulario();
                    } else {
                        throw new Error('Erro ao cadastrar o usuário.');
                    }
                    return response.json();
                })
                .then(result => console.log(result))
                .catch(error => {
                    console.error('error', error);
                    exibirAlerta('Erro ao cadastrar o usuário.', 'danger');
                });
        });
    });
}
