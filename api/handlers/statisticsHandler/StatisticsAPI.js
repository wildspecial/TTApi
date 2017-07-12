var SM = require('./StatsManager');


module.exports.statistics = {
  handler: function (request, reply) {
    return reply(SM.man.statistics).code(200);
  }
};

module.exports.statisticsVerbose = {
  handler: function (request, reply) {
    return reply(SM.man.statisticsVerbose).code(200);
  }
};