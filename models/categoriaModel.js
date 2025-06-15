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

  static async atualizar(id, { nome }) {
    const result = await db.query(
      'UPDATE categorias SET nome = $1 WHERE id = $2 RETURNING *',
      [nome, id]
    );
    return result.rows[0];
  }

  static async deletar(id) {
    // Deleta tarefas relacionadas antes de deletar a categoria
    await db.query('DELETE FROM tarefas WHERE categoria_id = $1', [id]);
    await db.query('DELETE FROM categorias WHERE id = $1', [id]);
    return { message: 'Categoria deletada com sucesso' };
  }
}

module.exports = Categoria;
