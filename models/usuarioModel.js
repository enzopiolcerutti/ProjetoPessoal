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

  static async atualizar(id, { nome, email, senha }) {
    const result = await db.query(
      'UPDATE usuarios SET nome = $1, email = $2, senha = $3 WHERE id = $4 RETURNING *',
      [nome, email, senha, id]
    );
    return result.rows[0];
  }

  static async deletar(id) {
    await db.query('DELETE FROM usuarios WHERE id = $1', [id]);
    return { message: 'Usuário deletado com sucesso' };
  }
}

module.exports = Usuario;
