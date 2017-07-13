/**
 * Stats Manager
 *
 * The StatManager is very simple. It simple reads the data written in InMemoryStats by the TransactionManager
 * and perform some normalization/decoration. It's a dummy class used just to remap the output for the clients.
 * 
 */
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