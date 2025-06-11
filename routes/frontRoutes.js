const express = require('express');
const router = express.Router();
const Categoria = require('../models/categoriaModel');
const Tarefa = require('../models/tarefaModel');

// Rota da página de login
router.get('/login', (req, res) => {
  res.render('pages/login');
});

// Rota da dashboard principal
router.get('/dashboard', (req, res) => {
  res.render('pages/dashboard');
});

// Rota de visualização de tarefas
router.get('/tarefas', async (req, res) => {
  const tarefas = await Tarefa.listarTodas();
  const categorias = await Categoria.listarTodas();
  res.render('pages/tarefas', { tarefas, categorias });
});

// Rota para adicionar nova tarefa
router.get('/nova-tarefa', async (req, res) => {
  const categorias = await Categoria.listarTodas();
  res.render('pages/novaTarefa', { categorias });
});

module.exports = router;
