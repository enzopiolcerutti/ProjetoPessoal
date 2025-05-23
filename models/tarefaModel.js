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
}

module.exports = Tarefa;
