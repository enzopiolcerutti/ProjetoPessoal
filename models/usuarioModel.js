const db = require('../config/db');

class Usuario {
  static async listarTodos() {
    const result = await db.query('SELECT * FROM usuarios');
    return result.rows;
  }

  static async criar({ nome, email, senha }) {
    const result = await db.query(
      'INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *',
      [nome, email, senha]
    );
    return result.rows[0];
  }
}

module.exports = Usuario;
