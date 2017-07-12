var InMemoryStats = require('../../model/InMemoryStats');

class StatsManager {

  constructor() {

  }

  static get statistics() {
    let stats = {
      sum: InMemoryStats.data.sum,
      avg: InMemoryStats.data.avg,
      max: InMemoryStats.data.max,
      min: InMemoryStats.data.min,
      count: InMemoryStats.data.count
    };
    return stats;
  }

  set stats(stats) {

  }
}


module.exports.statistics = {
  handler: function (request, reply) {
    return reply(StatsManager.statistics).code(200);
  }
};
