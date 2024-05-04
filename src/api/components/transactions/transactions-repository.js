const { Transaction } = require('../../../models');

/**
 * Create new Transaction
 * @param {string} product - Name
 * @param {string} description - Em
 * @param {string} password - Hashed password
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
 * Get a list of users
 * @returns {Promise}
 */
async function getTransactions() {
  return Transaction.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getTransaction(id) {
  return Transaction.findById(id);
}

/**
 * Update existing user
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
 * Delete a user
 * @param {string} id - User ID
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
