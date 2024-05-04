const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const transactionsControllers = require('./transactions-controller');
const transactionsValidator = require('./transactions-validator');

const route = express.Router();

module.exports = (app) => {
  app.use('/transactions', route);

  route.get('/', authenticationMiddleware, transactionsControllers.getTransactions);

  route.post(
    '/',
    authenticationMiddleware,
    celebrate(transactionsValidator.createTransaction),
    transactionsControllers.createTransaction
  );

  route.get('/', authenticationMiddleware, transactionsControllers.getTransaction);

  //Delete Transaction
  route.delete('/:id', authenticationMiddleware, transactionsControllers.deleteTransaction)
  // Update transaction
  route.put(
    '/:id',
    authenticationMiddleware,
    celebrate(transactionsValidator.updateTransaction),
    transactionsControllers.updateTransaction
  );
};
