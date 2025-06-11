const Dia = require('../models/diaModel');

exports.criarDia = async (req, res) => {
  const { data, usuario_id, xp, frase_id } = req.body;
  try {
    const novoDia = await Dia.criar({ data, usuario_id, xp, frase_id });
    res.status(201).json(novoDia);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.listarDias = async (req, res) => {
  try {
    const dias = await Dia.listarTodos();
    res.status(200).json(dias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editarDia = async (req, res) => {
  const { id } = req.params;
  const { data, usuario_id, xp, frase_id } = req.body;
  try {
    const diaAtualizado = await Dia.atualizar(id, { data, usuario_id, xp, frase_id });
    res.status(200).json(diaAtualizado);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.excluirDia = async (req, res) => {
  const { id } = req.params;
  try {
    await Dia.deletar(id);
    res.status(200).json({ message: 'Registro de dia removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
