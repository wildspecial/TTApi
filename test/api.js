'use strict';

const Hapi = require('hapi');
const apiPlugin = require('../api');

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const expect = Code.expect;

var rand = Math.random() * (46.23 - 1.45) + 1.45;
var rand2 = Math.random() * (46.23 - 1.45) + 1.45;
var now = new Date().getTime();
var oldDate = new Date(now - 100000).getTime();

describe('API', () => {
  let server;

  before((done) => {

    const plugins = [apiPlugin];
    server = new Hapi.Server();
    server.connection({ port: 8000 });
    server.register(plugins, (err) => {

      if (err) {
        return done(err);
      }

      server.initialize(done);
    });



  });


  it('Root should return http status 404, cause it is not mapped', done => {
    server.inject('/', response => {
      expect(response.statusCode).to.equal(404);
      done();
    });
  });



  it('Transaction with an old time should return http status 204', done => {
    var options = {
      method: 'POST',
      url: '/transactions',
      payload: {
        "amount": rand,
        "timestamp": oldDate
      }
    };
    server.inject(options, response => {
      expect(response.statusCode).to.equal(204);
      done();
    });
  });





  it('First post in statistic with a valid payload. It should return http status 402', done => {
    var options = {
      method: 'POST',
      url: '/transactions',
      payload: {
        "amount": rand,
        "timestamp": now
      }
    };
    server.inject(options, response => {
      expect(response.statusCode).to.equal(201);
      done();
    });
  });


  it('Second post in statistic with a valid payload. It should return http status 402', done => {
    var options = {
      method: 'POST',
      url: '/transactions',
      payload: {
        "amount": rand2,
        "timestamp": now
      }
    };
    server.inject(options, response => {
      expect(response.statusCode).to.equal(201);
      done();
    });

  });


  it('Third post in statistic with an invalid payload. It should return http status 400', done => {
    var options = {
      method: 'POST',
      url: '/transactions',
      payload: {
        "amount": "text",
        "timestamp": now
      }
    };
    server.inject(options, response => {
      expect(response.statusCode).to.equal(400);
      done();
    });

  });

  it('Wait to let the schedule start after 1s', (done) => {
    setTimeout(() => {
      done();
    }, 1500);
  });

  it('Based on the previus transaction injections, the statistic API should show the corret values (sum,avg,max,min,count) with a 200 status code', done => {

    var options = {
      method: 'GET',
      headers: { "Content-Type": "application/json; charset=utf-8" },
      url: '/statistics',
    };

    // Wait 1 second


    server.inject(options, response => {
      let transaction = JSON.parse(response.payload);

      expect(response.statusCode).to.equal(200);

      expect(transaction.sum ).to.equal(rand + rand2);    
      expect(transaction.avg).to.equal((rand+rand2)/2);
      expect(transaction.max).to.equal(rand>rand2?rand:rand2);
      expect(transaction.min).to.equal(rand<rand2?rand:rand2);
      expect(transaction.count).to.equal(2);
      

      done();

    });



  });

});
