const db = require('../config/db');

class Frase {
  static async listarTodas() {
    const result = await db.query('SELECT * FROM frases');
    return result.rows;
  }

  static async buscarPorXP(xp) {
    const result = await db.query(
      'SELECT texto FROM frases WHERE $1 BETWEEN faixa_xp_min AND faixa_xp_max LIMIT 1',
      [xp]
    );
    return result.rows[0];
  }

  static async atualizar(id, { texto, faixa_xp_min, faixa_xp_max }) {
    const result = await db.query(
      'UPDATE frases SET texto = $1, faixa_xp_min = $2, faixa_xp_max = $3 WHERE id = $4 RETURNING *',
      [texto, faixa_xp_min, faixa_xp_max, id]
    );
    return result.rows[0];
  }

  static async deletar(id) {
    await db.query('DELETE FROM frases WHERE id = $1', [id]);
    return { message: 'Frase deletada com sucesso' };
  }
}

module.exports = Frase;
