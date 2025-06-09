
const express = require('express');
const router = express.Router();
const tarefaController = require('../controllers/tarefaController');
const usuarioController = require('../controllers/usuarioController');
const categoriaController = require('../controllers/categoriaController');
const diaController = require('../controllers/diaController');
const fraseController = require('../controllers/fraseController');

// Tarefas
router.post('/tarefas', tarefaController.criarTarefa);
router.get('/tarefas', tarefaController.listarTarefas);
router.put('/tarefas/:id', tarefaController.editarTarefa);
router.delete('/tarefas/:id', tarefaController.excluirTarefa);

// Usuários
router.post('/usuarios/login', usuarioController.login); // Rota de login
router.post('/usuarios', usuarioController.criarUsuario); // Rota de criação de usuário
router.get('/usuarios', usuarioController.listarUsuarios);
router.put('/usuarios/:id', usuarioController.editarUsuario);
router.delete('/usuarios/:id', usuarioController.excluirUsuario);

// Categorias
router.post('/categorias', categoriaController.criarCategoria);
router.get('/categorias', categoriaController.listarCategorias);
router.put('/categorias/:id', categoriaController.editarCategoria);
router.delete('/categorias/:id', categoriaController.excluirCategoria);

// Dias
router.post('/dias', diaController.criarDia);
router.get('/dias', diaController.listarDias);
router.put('/dias/:id', diaController.editarDia);
router.delete('/dias/:id', diaController.excluirDia);

// Frases
router.get('/frases', fraseController.listarFrases);
router.get('/frases/xp/:xp', fraseController.buscarFrasePorXP);

module.exports = router;
