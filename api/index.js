const TransactionsAPI = require('./handlers/transactionsHandler/TransactionsAPI');
const StatisticsAPI = require('./handlers/statisticsHandler/StatisticsAPI');


exports.register = (plugin, options, next) => {


  plugin.route([

    { method: 'POST', path: '/transactions', config: TransactionsAPI.transactions},
    { method: 'GET', path: '/statistics', config: StatisticsAPI.statistics, },
    { method: 'GET', path: '/statistics-verbose', config: StatisticsAPI.statisticsVerbose },
    /*
    {
      method: 'GET',
      path: '/statistics',
      handler: StatisticsAPI.statistics,
      config: {
        validate: {
          params: {
            name: Joi.string().min(3).max(10)
          }
        },
        tags: ['api'] 
      }
    }
    */

  ]);

  next();
};

exports.register.attributes = {
  name: 'api'
};