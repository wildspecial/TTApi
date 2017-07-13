/**
 * API Routing
 *
 * A comprihensive central point where all the APIs are mapped.
 * 
 */

const TransactionsAPI = require('./handlers/transactionsHandler/TransactionsAPI');
const StatisticsAPI = require('./handlers/statisticsHandler/StatisticsAPI');


exports.register = (plugin, options, next) => {


  plugin.route([

    { method: 'POST', path: '/transactions', config: TransactionsAPI.transactions},
    { method: 'GET', path: '/statistics', config: StatisticsAPI.statistics, },
    { method: 'GET', path: '/statistics-verbose', config: StatisticsAPI.statisticsVerbose },

  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};