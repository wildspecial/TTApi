const Joi = require('joi');
var TS = require('./TransactionManager');


module.exports.transactions = {

  description: 'Post a new Transactions',
  notes: 'Every Time a new transaction happened, this endpoint will be called.',
  tags: ['api'],

  //    this.res = { result: 'this is the transactions mod' };
  handler: function (request, reply) {


    if (TS.man.helthLevel > TS.man.helthLevelThreshold) {
      return reply({ result: 'Too Many Requests for this Instance' }).code(429);
    }


    var injested = TS.man.injestValue(request.payload);
    if (injested) {
      return reply().code(201); //inserted ok
    } else {
      return reply().code(204); //inserted ok. The transaction is older than 60 sec
    }
  },
  validate: {
    payload: Joi.object({
      amount: Joi.number().default(12.3),
      timestamp: Joi.number().default(1478192204000)
    }).label('transactions')
  }
};
