const { Transaction } = require('../../../models');

/**
 * Create new Transaction
 * @param {string} product - Name
 * @param {string} description - Descripotion product
 * @param {string} price - product price
 * @param {string} status - product status
 * @returns {Promise}
 */
async function createTransaction(product, description, price, status) {
  return Transaction.create({
    product,
    description,
    status,
    price,
  });
}

/**
 * Get a list of transactions
 * @returns {Promise}
 */
async function getTransactions() {
  return Transaction.find({});
}

/**
 * Get transaction detail
 * @param {string} id - Transaction ID
 * @returns {Promise}
 */
async function getTransaction(id) {
  return Transaction.findById(id);
}

/**
 * Update existing Transactions
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateTransaction(id, price, status) {
  return Transaction.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        price,
        status,
      },
    }
  );
}

/**
 * Delete a transaction
 * @param {string} id - Transaction ID
 * @returns {Promise}
 */
async function deleteTransaction(id) {
  return Transaction.deleteOne({ _id: id });
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
};
