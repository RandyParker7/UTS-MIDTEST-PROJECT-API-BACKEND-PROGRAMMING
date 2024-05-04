const transactionsRepository = require('./transactions-repository');
const { quantity } = require('../../../models/transaction-schema');

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createTransaction(product, description, price, status) {
  try {
    await transactionsRepository.createTransaction(product, description, price, status);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Get list of users
 * @returns {Array}
 */
async function getTransactions() {
  const transactions = await transactionsRepository.getTransactions();

  const results = [];
  for (let i = 0; i < transactions.length; i += 1) {
    const transaction = transactions[i];
    results.push({
      id: transaction.id,
      product: transaction.product,
      status: transaction.status,
      description: transaction.description,
      price: transaction.price,
    });
  }

  return results;
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getTransaction(id) {
  const transaction = await transactionsRepository.getTransaction(id);

  // User not found
  if (!transaction) {
    return null;
  }

  return {
    id: transaction.id,
    product: transaction.product,
    description: transaction.description,
    price: transaction.price, 
  };
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateTransaction(id, status, price, quantity) {
  const transaction = await transactionsRepository.getTransaction(id);

  // User not found
  if (!transaction) {
    return null;
  }

  try {
    await transactionsRepository.updateTransaction(id, status, price, quantity);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteTransaction(id) {
  const transaction = await transactionsRepository.getTransaction(id);

  // User not found
  if (!transaction) {
    return null;
  }

  try {
    await transactionsRepository.deleteTransaction(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  createTransaction,
  getTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
}