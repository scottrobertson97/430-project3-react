const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let TransactionModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const TransactionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
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

TransactionSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  amount: doc.amount,
  type: doc.type,
  category: doc.category,
});
// 
// DrinkSchema.statics.findByOwner = (ownerId, callback) => {
//   const search = {
//     owner: convertId(ownerId),
//   };
// 
//   return DrinkModel.find(search).select('name baseIngredient ingredients').exec(callback);
// };
// 
// DrinkSchema.statics.findAll = (callback) => {
//   const list = DrinkModel.find().select('name baseIngredient ingredients').exec(callback);
//   return list;
// };
// 
// DrinkSchema.statics.findByBaseIngredient = (baseIngredient, callback) => {
//   const search = {
//     baseIngredient,
//   };
// 
//   return DrinkModel.find(search).select('name baseIngredient ingredients').exec(callback);
// };

TransactionModel = mongoose.model('Transaction', TransactionSchema);

module.exports.TransactionModel = TransactionModel;
module.exports.TransactionSchema = TransactionSchema;
