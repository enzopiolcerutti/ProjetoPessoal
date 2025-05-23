
const pool = require('../config/db');

exports.listarFrases = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM frases');
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarFrasePorXP = async (req, res) => {
  const { xp } = req.params;
  try {
    const result = await pool.query(
      'SELECT texto FROM frases WHERE $1 BETWEEN faixa_xp_min AND faixa_xp_max LIMIT 1',
      [parseFloat(xp)]
    );
    res.status(200).json(result.rows[0] || { texto: "Sem frase para essa faixa de XP." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
