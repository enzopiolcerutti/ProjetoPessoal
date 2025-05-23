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
app.use('/api', apiRoutes);
app.use('/teste', frontendRoutes);

db.connect()
  .then(() => {
    console.log('Conectado ao banco de dados PostgreSQL');

    app.use(express.json());
    app.get('/', (req, res) => {
      res.send('Servidor do DayTrack está funcionando!');
    });
    
    app.use('/teste', (req, res) => {
      res.status(200).send('Rota de frontend configurada');   
    });
    
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
