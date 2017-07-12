var SM = require('./StatsManager');


module.exports.statistics = {

  description: 'Get Statistics',
  notes: 'It returns the statistic based of the transactions of the last 60 seconds',
  tags: ['api'],

  handler: function (request, reply) {
    return reply(SM.man.statistics).code(200);
  }
};

//this is just a hidden API for debug purpose and it's not self documented
module.exports.statisticsVerbose = {
  handler: function (request, reply) {
    return reply(SM.man.statisticsVerbose).code(200);
  }
};