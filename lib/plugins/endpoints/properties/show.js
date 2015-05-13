'use strict';

var Joi = require('joi');
var Property = require('../../../models/property');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/properties/{propertyId}',
    config: {
      description: 'Get a property',
      validate: {
        params: {
          propertyId: Joi.string().regex(/^[a-f0-9]{24}$/).required()
        }
      },
      handler: function(request, reply){
        Property.findOne({_id: request.params.propertyId, managerId: request.auth.credentials._id}, function(err, property){
          return reply(property).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'properties.show'
};
