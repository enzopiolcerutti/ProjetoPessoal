const db = require('../config/db');

class Tarefa {
  static async listarTodas() {
    const result = await db.query('SELECT * FROM tarefas');
    return result.rows;
  }

  static async criar({ titulo, concluida, data, usuario_id, categoria_id }) {
    const result = await db.query(
      'INSERT INTO tarefas (titulo, concluida, data, usuario_id, categoria_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [titulo, concluida, data, usuario_id, categoria_id]
    );
    return result.rows[0];
  }

  static async atualizar(id, { titulo, concluida, data, usuario_id, categoria_id }) {
    const result = await db.query(
      'UPDATE tarefas SET titulo = $1, concluida = $2, data = $3, usuario_id = $4, categoria_id = $5 WHERE id = $6 RETURNING *',
      [titulo, concluida, data, usuario_id, categoria_id, id]
    );
    return result.rows[0];
  }

  static async deletar(id) {
    await db.query('DELETE FROM tarefas WHERE id = $1', [id]);
    return { message: 'Tarefa deletada com sucesso' };
  }
}

module.exports = Tarefa;
