$(document).ready(() => {
    $('#formLogin').on('submit', async function (e) {
        e.preventDefault(); // Evita o comportamento padrão do formulário

        // Captura os dados do formulário
        const email = $('#email').val();
        const senha = $('#password').val();

        console.log('E-mail digitado:', email);
        console.log('Senha digitada:', senha);

        // Encripta a senha fornecida pelo usuário com SHA-256
        const senhaEncriptada = CryptoJS.SHA256(senha).toString();
        console.log('Senha encriptada:', senhaEncriptada);

        try {
            // Faz uma requisição GET para buscar todos os usuários cadastrados
            const resposta = await fetch("http://localhost:3000/usuario");
            console.log('Resposta da requisição:', resposta);

            if (!resposta.ok) {
                throw new Error('Erro ao buscar usuários.');
            }

            const usuarios = await resposta.json(); // Converte a resposta para JSON
            console.log('Usuários cadastrados:', usuarios);

            // Verifica se o usuário existe e a senha está correta
            const usuarioEncontrado = usuarios.find(
                usuario => usuario.email === email && usuario.senha === senhaEncriptada
            );

            console.log('Usuário encontrado:', usuarioEncontrado);

            if (usuarioEncontrado) {
                alert('Login realizado com sucesso!');
                // Redireciona para outra página ou realiza outra ação
                window.location.href = '/home';
            } else {
                alert('E-mail ou senha inválidos.');
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao realizar login. Tente novamente mais tarde.');
        }
    });
});