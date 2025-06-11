const Frase = require('../models/fraseModel');

exports.listarFrases = async (req, res) => {
  try {
    const frases = await Frase.listarTodas();
    res.status(200).json(frases);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.buscarFrasePorXP = async (req, res) => {
  const { xp } = req.params;
  try {
    const frase = await Frase.buscarPorXP(parseFloat(xp));
    res.status(200).json(frase || { texto: "Sem frase para essa faixa de XP." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
