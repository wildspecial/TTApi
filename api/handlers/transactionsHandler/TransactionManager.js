/**
 * Transaction Manager
 *
 * This module is responsible for receiving transaction and calculate avg , sum, count, min, max.
 * The strategy here is to agregate every transaction coming with a valid timestamp (not older than 60 sec)
 * for each second.
 * There will be a list of objects hystoryData that will have all the aggregated data for every single second.
 * Every time a transaction comes, the avg, sim, count, min, max are already calculated for that particular second.
 * Then every second a schedule will fire and:
 * Will cycle only (worst case 60 elements) from now to the 60 second behind, will calculate the aggregated data for 60 seconds only (not 
 * for every transaction that has come, but for the specific second aggregations) and finally will remove seconds 
 * older than 60s from the current timestamp.
 * 
 */

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

  //the scheduler that is launch every second
  runUpdateScheduler() {
    setInterval(this.updateTransactionData.bind(this), 1000);
  }

  //if the transaction is older than 60 sec is not valid
  checkIfValid(timestamp) {
    let isValid = (this.tsCurrentOperation - timestamp) / 1000 > this.secInThePast ? false : true;
    return isValid;
  }


  /**
   * 
   * calculateStatsForThisSecond
   * 
   * based on the new coming transaction here there is a re-calulation of all stats data for this particolar second
   *
   */

  calculateStatsForThisSecond(statsForThisSecond, transaction) {
   


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

    if (stats.count > 0) {
      stats.sum += statsForThisSecond.sum;
      stats.count += statsForThisSecond.count;
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

  //TODO - Bug fix. Sometimes the removeOldSecond doesn't remove a bunch of old second.
  //Happed during high traffic test. Neet investegation. It's just a workaround.
  flushData(timestamp) {
    let isValid = (timestamp-this.tsCurrentOperation) / 1000 > this.secInThePast ? false : true;
    if (this.historyDataSize > 0 && !isValid) {
      InMemoryStats.data = Object.assign({}, InMemoryStats.emptyData);
      InMemoryStats.data.ts = this.tsLastSchedule;
    }
  }


  /**
   * updateTransactionData
   *  
   * One of the core method. It removes from the history the old second not valid anymore,
   * Cycles all the aggregated data for each second (not for each transaction) and finally calculates the
   * final data
   *
   */
  updateTransactionData() {
    //InMemoryStats.data

    let hrstart = process.hrtime();
    let dStart = new Date();

    this.flushData(dStart.getTime());

    this.tsLastSchedule = new Date();
    this.tsLastSchedule.setMilliseconds(0);

    this.removeOldSecond(this.tsLastSchedule);

    this.historyDataSize = Object.keys(this.hystoryData).length;

    InMemoryStats.data = Object.assign({}, InMemoryStats.emptyData);
    InMemoryStats.data.ts = this.tsLastSchedule;
    InMemoryStats.data.hystoryData = this.hystoryData;
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

//the transaction manager will work with an history 60 sec in the past.
var transactionMan = new TransactionManager(60);
transactionMan.runUpdateScheduler();
module.exports.man = transactionMan;

