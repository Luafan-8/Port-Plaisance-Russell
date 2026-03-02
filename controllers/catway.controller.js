const Catway = require('../models/Catway');

exports.getAllCatways = async (req,res) => {
  const catways = await Catway.find();
  res.render('catways', { catways });
};

exports.getCatwayById = async (req,res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  res.json(catway);
};

exports.createCatway = async (req,res) => {
  const { catwayNumber, catwayType, catwayState } = req.body;
  const catway = new Catway({ catwayNumber, catwayType, catwayState });
  await catway.save();
  res.redirect('/catways');
};

exports.updateCatway = async (req,res) => {
  const catway = await Catway.findOne({ catwayNumber: req.params.id });
  if(!catway) return res.status(404).send('Non trouvé');
  catway.catwayState = req.body.catwayState || catway.catwayState;
  await catway.save();
  res.redirect('/catways');
};

exports.deleteCatway = async (req,res) => {
  await Catway.findOneAndDelete({ catwayNumber: req.params.id });
  res.redirect('/catways');
};