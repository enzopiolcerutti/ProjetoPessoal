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

  static async atualizar(id, { data, usuario_id, xp, frase_id }) {
    const result = await db.query(
      'UPDATE dias SET data = $1, usuario_id = $2, xp = $3, frase_id = $4 WHERE id = $5 RETURNING *',
      [data, usuario_id, xp, frase_id, id]
    );
    return result.rows[0];
  }

  static async deletar(id) {
    await db.query('DELETE FROM dias WHERE id = $1', [id]);
    return { message: 'Dia deletado com sucesso' };
  }
}

module.exports = Dia;
