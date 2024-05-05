const joi = require('joi');
const { updateTransaction } = require('./transactions-repository');
module.exports = {
  createTransaction: {
    body: {
      product: joi.string().min(2).max(100).required().label('Product'),
      description: joi.string().required().label('Description'),
      status: joi.string().required().label('Status'),
      price: joi.number().precision(2).min(0).max(99999999.99).required().label('Price'),
    },
  },

  updateTransaction: {
    body: {
      status: joi.string().required().label('Status'),
      price: joi.number().precision(2).min(0).max(99999999.99).required().label('Price'),
    },
  },
};