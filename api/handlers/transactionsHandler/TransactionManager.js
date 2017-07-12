var InMemoryStats = require('../../../model/InMemoryStats');

class TransactionManager {

  constructor(secInThePast) {


    this.historyDataSize = 0;
    this.tsCurrentOperation = 0;
    this.secInThePast = secInThePast;
    this.tsLastSchedule = 0;
    this.hystoryData = {};
    this.helthLevel = 0;
    this.helthLevelThreshold = 59970.0;


  }

  runUpdateScheduler() {
    setInterval(this.updateTransactionData.bind(this), 1000);
  }

  checkIfValid(timestamp) {
    let isValid = (this.tsCurrentOperation - timestamp) / 1000 > this.secInThePast ? false : true;
    return isValid;
  }

  calculateStatsForThisSecond(statsForThisSecond, transaction) {
    //based on the new coming transaction here there is a re-calulation of all stats data for this particolar second


    statsForThisSecond.ts = new Date(this.tsCurrentOperation).setMilliseconds(0);
    if (statsForThisSecond.count > 0) {
      statsForThisSecond.sum += transaction.amount;
      statsForThisSecond.avg = (statsForThisSecond.avg + transaction.amount) / 2;
      statsForThisSecond.max = (transaction.amount > statsForThisSecond.max ? transaction.amount : statsForThisSecond.max);
      statsForThisSecond.min = (transaction.amount < statsForThisSecond.min ? transaction.amount : statsForThisSecond.min);
      statsForThisSecond.count++;
    } else {
      statsForThisSecond.sum = transaction.amount;
      statsForThisSecond.avg = transaction.amount;
      statsForThisSecond.max = transaction.amount;
      statsForThisSecond.min = transaction.amount;
      statsForThisSecond.count = 1;
    }

    return statsForThisSecond;
  }

  calculateStats(stats, statsForThisSecond) {
    //based on the new coming transaction here there is a re-calulation of all stats data for this particolar second

    if (stats.count > 0) {
      stats.sum += statsForThisSecond.sum;
      stats.count++;
      stats.avg = stats.sum / stats.count;
      stats.max = (statsForThisSecond.max > stats.max ? statsForThisSecond.max : stats.max);
      stats.min = (statsForThisSecond.min < stats.min ? statsForThisSecond.min : stats.min);

    } else {
      stats.sum = statsForThisSecond.sum;
      stats.count = statsForThisSecond.count;
      stats.avg = statsForThisSecond.avg;
      stats.max = statsForThisSecond.max;
      stats.min = statsForThisSecond.min;

    }


    return stats;
  }


  insertTransaction(transaction) {

    //find which is the second
    let wichSecond = new Date(transaction.timestamp).setMilliseconds(0);

    //get data for this second in the history if exists, otherwhise get the empty data
    let statsForThisSecond = this.hystoryData[wichSecond] ? this.hystoryData[wichSecond] : Object.assign({}, InMemoryStats.emptyData);


    //set of new calculated data in the history
    this.hystoryData[wichSecond] = this.calculateStatsForThisSecond(statsForThisSecond, transaction);

  }

  removeOldSecond(tsLastSchedule) {
    var t = tsLastSchedule;
    t.setSeconds(t.getSeconds() - this.secInThePast - 1);
    delete this.hystoryData[t.getTime()];
  }

  updateTransactionData() {
    //InMemoryStats.data

    let hrstart = process.hrtime();
    let dStart = new Date();


    this.tsLastSchedule = new Date();
    this.tsLastSchedule.setMilliseconds(0);

    this.removeOldSecond(this.tsLastSchedule);

    this.historyDataSize = Object.keys(this.hystoryData).length;

    InMemoryStats.data = Object.assign({}, InMemoryStats.emptyData);
    InMemoryStats.data.ts = this.tsLastSchedule;
    InMemoryStats.data.historyDataSize = this.historyDataSize;

    for (var second in this.hystoryData) {
      InMemoryStats.data = this.calculateStats(InMemoryStats.data, this.hystoryData[second]);
    }



    let hrend = process.hrtime(hrstart);
    let dStop = new Date();
    let diff = dStop.getTime() - dStart.getTime();

    this.helthLevel = hrend;
    InMemoryStats.data.hLevel1 = this.helthLevel;
    InMemoryStats.data.hLevel2 = diff;


    /*
        console.log("history:");
        console.log(this.hystoryData);
        console.log("stats:");
        console.log(InMemoryStats.data);
        console.log("history size:" + this.historyDataSize);
     
    
    
        console.log("ms:" + this.helthLevel);
      */

  }


  injestValue(payload) {

    this.tsCurrentOperation = new Date().getTime();
    let transaction;
    if (typeof payload == "string") {
      transaction = JSON.parse(payload);
    } else {
      transaction = payload;
    }
    let isValid = this.checkIfValid(transaction.timestamp);
    if (!isValid) {
      return false;
    } else {

      this.insertTransaction(transaction);

      return true;
    }
  }


}


var transactionMan = new TransactionManager(60);
transactionMan.runUpdateScheduler();
module.exports.man = transactionMan;

