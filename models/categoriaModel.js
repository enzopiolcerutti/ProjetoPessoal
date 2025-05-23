
const db = require('../config/db');

class Categoria {
  static async listarTodas() {
    const result = await db.query('SELECT * FROM categorias');
    return result.rows;
  }

  static async criar({ nome }) {
    const result = await db.query(
      'INSERT INTO categorias (nome) VALUES ($1) RETURNING *',
      [nome]
    );
    return result.rows[0];
  }
}

module.exports = Categoria;
