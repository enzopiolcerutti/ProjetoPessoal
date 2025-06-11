const Usuario = require('../models/usuarioModel');

// Função de login
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  try {
    const usuarios = await Usuario.listarTodos();
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) {
      return res.status(401).json({ error: 'Email não encontrado' });
    }
    if (usuario.senha !== senha) {
      return res.status(401).json({ error: 'Senha incorreta' });
    }
    return res.status(200).json({
      success: true,
      message: 'Login realizado com sucesso',
      redirect: '/dashboard',
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const novoUsuario = await Usuario.criar({ nome, email, senha });
    res.status(201).json(novoUsuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.listarTodos();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  try {
    const usuarioAtualizado = await Usuario.atualizar(id, { nome, email, senha });
    if (!usuarioAtualizado) return res.status(404).json({ message: 'Usuário não encontrado' });
    res.status(200).json(usuarioAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletarUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await Usuario.deletar(id);
    res.status(200).json({ message: 'Usuário deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.excluirUsuario = exports.deletarUsuario;
