const db = require('../config/db');

class Dia {
  static async listarTodos() {
    const result = await db.query('SELECT * FROM dias');
    return result.rows;
  }

  static async criar({ data, usuario_id, xp, frase_id }) {
    const result = await db.query(
      'INSERT INTO dias (data, usuario_id, xp, frase_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [data, usuario_id, xp, frase_id]
    );
    return result.rows[0];
  }
}

module.exports = Dia;
