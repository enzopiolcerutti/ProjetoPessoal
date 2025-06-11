const Categoria = require('../models/categoriaModel');

exports.criarCategoria = async (req, res) => {
  const { nome } = req.body;
  try {
    const novaCategoria = await Categoria.criar({ nome });
    res.status(201).json(novaCategoria);
  } catch (err) {
    console.error('Erro ao criar categoria:', err);
    res.status(500).json({ error: err.message });
  }
};

exports.listarCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.listarTodas();
    res.status(200).json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.editarCategoria = async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  try {
    const categoriaAtualizada = await Categoria.atualizar(id, { nome });
    res.status(200).json(categoriaAtualizada);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.excluirCategoria = async (req, res) => {
  const { id } = req.params;
  try {
    await Categoria.deletar(id);
    res.status(200).json({ message: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
