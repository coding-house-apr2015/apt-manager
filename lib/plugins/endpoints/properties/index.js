'use strict';

var Property = require('../../../models/property');

exports.register = function(server, options, next){
  server.route({
    method: 'GET',
    path: '/properties',
    config: {
      description: 'Get properties',
      handler: function(request, reply){
        Property.find({managerId: request.auth.credentials._id}, function(err, properties){
          return reply({properties: properties}).code(err ? 400 : 200);
        });
      }
    }
  });

  return next();
};

exports.register.attributes = {
  name: 'properties.index'
};
