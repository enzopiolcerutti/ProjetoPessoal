const Tarefa = require('../models/tarefaModel');

// Criar nova tarefa
exports.criarTarefa = async (req, res) => {
  const { titulo, concluida, data, usuario_id, categoria_id } = req.body;
  try {
    const novaTarefa = await Tarefa.criar({ titulo, concluida, data, usuario_id, categoria_id });
    res.status(201).json(novaTarefa);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar tarefas
exports.listarTarefas = async (req, res) => {
  try {
    const tarefas = await Tarefa.listarTodas();
    res.status(200).json(tarefas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar tarefa
exports.editarTarefa = async (req, res) => {
  const { id } = req.params;
  const { titulo, concluida, data, usuario_id, categoria_id } = req.body;
  try {
    const tarefaAtualizada = await Tarefa.atualizar(id, { titulo, concluida, data, usuario_id, categoria_id });
    if (!tarefaAtualizada) return res.status(404).json({ message: 'Tarefa não encontrada' });
    res.status(200).json(tarefaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Excluir tarefa
exports.excluirTarefa = async (req, res) => {
  const { id } = req.params;
  try {
    await Tarefa.deletar(id);
    res.status(200).json({ message: 'Tarefa excluída com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
