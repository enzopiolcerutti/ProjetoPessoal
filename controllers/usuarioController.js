
const pool = require('../config/db');

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
