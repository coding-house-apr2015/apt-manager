/* eslint no-reserved-keys: 0 */

'use strict';

var Mongoose = require('mongoose');
var Property;

var propertySchema = Mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  createdAt: {type: Date, required: true, default: Date.now},
  managerId: {type: Mongoose.Schema.ObjectId, ref: 'User', required: true},
  apartments: [{
    name: {type: String, required: true},
    rooms: {type: Number, required: true},
    sqft: {type: Number, required: true},
    bathrooms: {type: Number, required: true},
    rent: {type: Number, required: true},
    isAvailable: {type: Boolean, required: true, default: true},
    renters: [{type: Mongoose.Schema.ObjectId, ref: 'User', required: true}],
    createdAt: {type: Date, required: true, default: Date.now}
  }]
});

Property = Mongoose.model('Property', propertySchema);
module.exports = Property;
