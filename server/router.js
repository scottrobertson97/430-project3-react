
const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  // default
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  // token
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  // login/signup/logout
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresSecure, mid.requiresLogin, controllers.Account.logout);
  // main page
  app.get(
    '/app',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Transaction.addTransactionPage
  );
  app.post(
    '/app',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Transaction.addTransaction
  );
  // add transactions
  app.get(
    '/addTransaction',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Transaction.addTransactionPage
  );
  app.post(
    '/addTransaction',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Transaction.addTransaction
  );
  app.get(
    '/getTransactions',
    mid.requiresSecure,
    mid.requiresLogin,
    controllers.Transaction.getTransactions
  );
  //
  //
  // app.get('/getDomos', mid.requiresSecure, mid.requiresLogin, controllers.Domo.getDomos);
  // app.get('/getDrinks', mid.requiresSecure, mid.requiresLogin, controllers.Drink.getDrinks);
  // app.get('/maker', mid.requiresSecure, mid.requiresLogin, controllers.Drink.makerPage);
  // app.post('/maker', mid.requiresSecure, mid.requiresLogin, controllers.Drink.make);
  // app.get('/allDrinks', mid.requiresSecure, mid.requiresLogin, controllers.Drink.allDrinksPage);
};

module.exports = router;
