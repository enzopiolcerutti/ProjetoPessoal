const pool = require('../config/db');

// Criar nova tarefa
exports.criarTarefa = async (req, res) => {
  const { titulo, concluida, data, usuario_id, categoria_id } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO tarefas (titulo, concluida, data, usuario_id, categoria_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [titulo, concluida, data, usuario_id, categoria_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar tarefas
exports.listarTarefas = async (req, res) => {
  try {
    const { usuario_id } = req.query;
    let result;
    if (usuario_id) {
      result = await pool.query('SELECT * FROM tarefas WHERE usuario_id = $1', [usuario_id]);
    } else {
      result = await pool.query('SELECT * FROM tarefas');
    }
    res.status(200).json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar tarefa
exports.editarTarefa = async (req, res) => {
  const { id } = req.params;
  const { titulo, concluida, data, usuario_id, categoria_id } = req.body;
  try {
    const result = await pool.query(
      `UPDATE tarefas SET titulo = $1, concluida = $2, data = $3, usuario_id = $4, categoria_id = $5
       WHERE id = $6 RETURNING *`,
      [titulo, concluida, data, usuario_id, categoria_id, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.status(200).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir tarefa
exports.excluirTarefa = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM tarefas WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
