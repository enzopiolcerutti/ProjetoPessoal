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
}

module.exports = Frase;
