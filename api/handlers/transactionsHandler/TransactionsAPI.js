
var TS = require('./TransactionManager');


module.exports.transactions = {

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
  }
};
