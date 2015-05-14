/* eslint no-unused-expressions: 0 */

'use strict';

var Chai = require('chai');
var Lab = require('lab');
var Mongoose = require('mongoose');
var Sinon = require('sinon');
var Server = require('../../../../../lib/server');
var Property = require('../../../../../lib/models/property');

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var expect = Chai.expect;
var it = lab.test;
var before = lab.before;
var after = lab.after;

var server;

describe('POST /properties/{propertyId}/apartments', function(){
  before(function(done){
    Server.init(function(err, srvr){
      if(err){ throw err; }
      server = srvr;
      done();
    });
  });

  after(function(done){
    server.stop(function(){
      Mongoose.disconnect(done);
    });
  });

  it('should create an apartment', function(done){
    server.inject({method: 'POST', url: '/properties/b00000000000000000000001/apartments', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'A1', rooms: 3, sqft: 1200, bathrooms: 2, rent: 1500}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result.name).to.equal('Oak Ridge');
      Property.findById('b00000000000000000000001', function(err, property){
        expect(err).to.be.null;
        expect(property.apartments).to.have.length(5);
        done();
      });
    });
  });

  it('should NOT create an apartment - wrong owner', function(done){
    server.inject({method: 'POST', url: '/properties/b00000000000000000000001/apartments', credentials: {_id: 'a00000000000000000000002'}, payload: {name: 'A1', rooms: 3, sqft: 1200, bathrooms: 2, rent: 1500}}, function(response){
      expect(response.statusCode).to.equal(200);
      expect(response.result).to.be.null;
      done();
    });
  });

  it('should create a db error', function(done){
    var stub = Sinon.stub(Property, 'findOneAndUpdate').yields(new Error());
    server.inject({method: 'POST', url: '/properties/b00000000000000000000001/apartments', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'A1', rooms: 3, sqft: 1200, bathrooms: 2, rent: 1500}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should NOT create an apt - sqft too large', function(done){
    var stub = Sinon.stub(Property, 'findOneAndUpdate').yields(new Error());
    server.inject({method: 'POST', url: '/properties/b00000000000000000000001/apartments', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'A1', rooms: 3, sqft: 9999, bathrooms: 2, rent: 1500}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });

  it('should NOT create an apt - not enough bathrooms', function(done){
    var stub = Sinon.stub(Property, 'findOneAndUpdate').yields(new Error());
    server.inject({method: 'POST', url: '/properties/b00000000000000000000001/apartments', credentials: {_id: 'a00000000000000000000001'}, payload: {name: 'A1', rooms: 3, sqft: 1200, bathrooms: 0, rent: 1500}}, function(response){
      expect(response.statusCode).to.equal(400);
      stub.restore();
      done();
    });
  });
});
