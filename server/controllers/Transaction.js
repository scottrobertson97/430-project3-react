const models = require('../models');

const Transaction = models.Transaction;

const addTransactionPage = (req, res) => {
  Transaction.TransactionModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred.' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), transaction: docs });
  });
};

const addTransaction = (req, res) => {
  if (!req.body.name || !req.body.amount || !req.body.type || !req.body.category) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const transactionData = {
    name: req.body.name,
    amount: req.body.amount,
    type: req.body.type,
    category: req.body.category,
    owner: req.session.account._id,
  };

  const newTransaction = new Transaction.TransactionModel(transactionData);

  const transactionPromise = newTransaction.save();

  transactionPromise.then(() => res.json({ redirect: '/addTransaction' }));

  transactionPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Transaction already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred.' });
  });

  return transactionPromise;
};

const getTransactions = (request, response) => {
  const req = request;
  const res = response;

  return Transaction.TransactionModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ transactions: docs });
  });
};

// get expenses

module.exports.addTransactionPage = addTransactionPage;
module.exports.addTransaction = addTransaction;
module.exports.getTransactions = getTransactions;
