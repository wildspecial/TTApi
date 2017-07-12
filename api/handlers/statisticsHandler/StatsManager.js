var InMemoryStats = require('../../../model/InMemoryStats');

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
  static get statisticsVerbose() {
    return InMemoryStats.data;
  }

  set stats(stats) {

  }
}

module.exports.man = StatsManager;