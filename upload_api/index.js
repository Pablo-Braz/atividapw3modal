// Importa os módulos necessários
import express from 'express';     // Framework web para criar o servidor
import multer from 'multer';       // Middleware para lidar com uploads de arquivos
import path from 'path';           // Módulo para trabalhar com caminhos de arquivos
import cors from 'cors';           // Middleware para permitir requisições externas (CORS)
import fs from 'fs';               // Módulo para manipulação de arquivos e diretórios

const app = express();             // Cria a aplicação Express

app.use(cors());                   // Libera o acesso à API de qualquer origem (CORS)

app.use('/uploads', express.static('uploads')); // Torna a pasta 'uploads/' acessível via URL

// Configuração de armazenamento do multer
const storage = multer.diskStorage({
  // Define o diretório onde os arquivos serão salvos
  destination: 'uploads/',

  // Define o nome do arquivo salvo
  filename: (req, file, cb) => {
    // Cria um nome único com base no timestamp e na extensão original
    const uniqueName = Date.now() + path.extname(file.originalname);

    cb(null, uniqueName); // Salva o nome gerado
  }
});

const port = 3037; // Porta em que o servidor será executado

// Cria uma instância do multer com a configuração de armazenamento
const upload = multer({ storage });

// Rota para upload de arquivos
app.post('/upload', upload.single('file'), (req, res) => {
  // Gera a URL pública do arquivo que acabou de ser enviado
  const fileUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
  
  // Retorna a URL em formato JSON
  res.json({ url: fileUrl });
});

// Configuração para upload de imagens de usuário
const storageUsuarios = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define o diretório onde as imagens de usuário serão salvas
    cb(null, pastaUsuarios);
  },

  filename: (req, file, cb) => {
    // Cria um nome único para a imagem do usuário
    const uniqueName = 'usuario_' + Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// Pasta para armazenamento das imagens dos usuários
const pastaUsuarios = 'assets/upload/usuario';

// Cria a pasta para armazenamento das imagens dos usuários, se não existir
fs.mkdirSync(pastaUsuarios, { recursive: true });

// Torna a pasta acessível via URL
app.use('/upload/usuario', express.static(pastaUsuarios));

// Cria uma instância do multer para upload de imagens de usuário
const uploadUsuarios = multer({ storage: storageUsuarios });

// Rota para upload de imagem de usuário
app.post('/upload/usuario', uploadUsuarios.single('file'), (req, res) => {
  const fileUrl = `http://localhost:${port}/upload/usuario/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// Inicia o servidor na porta definida
app.listen(port, () => {
  console.log('Servidor de upload rodando em http://localhost:' + port);
  console.log('Para testar, use o Postman ou Insomnia para enviar um arquivo para http://localhost:' + port + '/upload');
});
