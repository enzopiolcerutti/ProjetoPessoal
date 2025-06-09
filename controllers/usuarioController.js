
const pool = require('../config/db');

// Função de login
exports.login = async (req, res) => {
  const { email, senha } = req.body;
  console.log('Dados recebidos:', { email, senha }); // Para debug

  try {
    // Primeiro vamos verificar se o usuário existe
    const checkUser = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    console.log('Usuário encontrado:', checkUser.rows[0]); // Para debug

    if (checkUser.rows.length === 0) {
      console.log('Email não encontrado');
      return res.status(401).json({ error: 'Email não encontrado' });
    }

    // Agora vamos verificar a senha
    if (checkUser.rows[0].senha !== senha) {
      console.log('Senha incorreta');
      return res.status(401).json({ error: 'Senha incorreta' });
    }

    const usuario = checkUser.rows[0];

    // Se chegou aqui, tudo está correto
    console.log('Login bem sucedido para:', usuario.email);
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
    console.error('Erro ao fazer login:', err);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

exports.criarUsuario = async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarUsuarios = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM usuarios');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editarUsuario = async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
      [nome, email, senha, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.excluirUsuario = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.status(200).json({ message: 'Usuário removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
