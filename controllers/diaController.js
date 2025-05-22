
const pool = require('../config/db');

exports.criarDia = async (req, res) => {
  const { data, usuario_id, xp, frase_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO dias (data, usuario_id, xp, frase_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [data, usuario_id, xp, frase_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarDias = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dias');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editarDia = async (req, res) => {
  const { id } = req.params;
  const { data, usuario_id, xp, frase_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE dias SET data = $1, usuario_id = $2, xp = $3, frase_id = $4 WHERE id = $5 RETURNING *',
      [data, usuario_id, xp, frase_id, id]
    );
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.excluirDia = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM dias WHERE id = $1', [id]);
    res.status(200).json({ message: 'Registro de dia removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
