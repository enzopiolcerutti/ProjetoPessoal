require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/db');
const path = require('path');
const apiRoutes = require('./routes/routes');
const frontendRoutes = require('./routes/frontRoutes');

// Configuração do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Configuração de middlewares
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views/css')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/views/css', express.static(path.join(__dirname, 'views/css')));

// Configuração das rotas
app.use('/api', apiRoutes);

db.connect()
  .then(() => {    console.log('Conectado ao banco de dados PostgreSQL');

    // Configurando a rota raiz para o login
    app.get('/', (req, res) => {
      res.render('pages/login');
    });

    // Rotas da aplicação
    app.use('/', frontendRoutes);
    
    // Middleware 404
    app.use((req, res, next) => {
      res.status(404).send('Página não encontrada');
    });

    // Middleware de erro interno
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Erro no servidor');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });
