const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DrinkModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const IngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  oz: {
    type: Number,
    min: 0,
    required: true,
  },
});

const DrinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  baseIngredient: {
    type: String,
    required: true,
    trim: true,
  },
  ingredients: [IngredientSchema],
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdData: {
    type: Date,
    default: Date.now,
  },
});

DrinkSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  baseIngredient: doc.baseIngredient,
  ingredients: doc.ingredients,
});

DrinkSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return DrinkModel.find(search).select('name baseIngredient ingredients').exec(callback);
};

DrinkSchema.statics.findAll = (callback) => {
  const list = DrinkModel.find().select('name baseIngredient ingredients').exec(callback);
  return list;
};

DrinkSchema.statics.findByBaseIngredient = (baseIngredient, callback) => {
  const search = {
    baseIngredient,
  };

  return DrinkModel.find(search).select('name baseIngredient ingredients').exec(callback);
};

DrinkModel = mongoose.model('Drink', DrinkSchema);

module.exports.DrinkModel = DrinkModel;
module.exports.DrinkSchema = DrinkSchema;
