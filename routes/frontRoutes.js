const express = require('express');
const router = express.Router();

// Rota da página de login
router.get('/', (req, res) => {
  res.render('pages/login');
});

// Rota da dashboard principal
router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard');
});

// Rota de visualização de tarefas
router.get('/tarefas', (req, res) => {
  res.render('pages/tarefa');
});

// Rota para adicionar nova tarefa
router.get('/nova-tarefa', (req, res) => {
  res.render('pages/novaTarefa');
});

module.exports = router;