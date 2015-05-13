'use strict';

var Property = require('../../../../models/property');
var Joi = require('joi');

exports.register = function(server, options, next){
  server.route({
    method: 'POST',
    path: '/properties/{propertyId}/apartments',
    config: {
      validate: {
        params: {
          propertyId: Joi.string().regex(/^[a-f0-9]{24}$/).required()
        },
        payload: {
          name: Joi.string().required(),
          rooms: Joi.number().min(1).max(3).required(),
          sqft: Joi.number().min(250).max(5000).required(),
          bathrooms: Joi.number().min(1).max(3).required(),
          rent: Joi.number().min(500).max(7500).required()
        }
      },
      description: 'Create an apartment',
      handler: function(request, reply){
        Property.findOneAndUpdate({_id: request.params.propertyId, managerId: request.auth.credentials._id}, {$push: {apartments: request.payload}}, {select: '_id, name'}, function(err, property){
          return reply(property).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'apartments.create'
};
