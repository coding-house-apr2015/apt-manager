'use strict';

var Joi = require('joi');
var Property = require('../../../models/property');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/properties',
    config: {
      validate: {
        payload: {
          name: Joi.string().min(3).required(),
          address: Joi.string().min(3).required()
        }
      },
      description: 'Create a property',
      handler: function(request, reply){
        var property = new Property(request.payload);
        property.managerId = request.auth.credentials._id;
        property.save(function(){
          return reply(property);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'properties.create'
};
