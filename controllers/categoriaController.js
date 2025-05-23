
const pool = require('../config/db');

exports.criarCategoria = async (req, res) => {
  const { nome } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarCategorias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categorias');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    const result = await pool.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.excluirCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM categorias WHERE id = $1', [id]);
    res.status(200).json({ message: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
