
const Transactions = require('./handlers/transactions');
const Statistics = require('./handlers/statistics');




exports.register = (plugin, options, next) => {

  plugin.route([

    { method: 'POST', path: '/transactions', config: Transactions.transactions},
    { method: 'GET', path: '/statistics', config: Statistics.statistics},

  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};