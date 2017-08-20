/**
 * Routes Configuration
 * (trails.config.routes)
 *
 * Configure how routes map to views and controllers.
 *
 * @see http://trailsjs.io/doc/config/routes.js
 */
 const joiConfig = require('./validations/routes')
 const footPrints = require('./footprints')

'use strict'

module.exports = [
   {
     method: ['POST'],
     path: `${footPrints.prefix}/admin/login/`,
     handler: 'AdminController.login',
     config: {
       auth: false,
       validate: {
         payload: joiConfig.login,
         failAction: function (request, reply, source, error) {
            error.output.payload.message = 'Illegal credentials';
            error.output.payload.validation = "Failed";
            return reply(error)
        }
       }
     }
   },
   {
     method: ['GET'],
     path: `${footPrints.prefix}/fooditem/config/`,
     handler: 'FreshFoodController.getFoodItemConfigs',
     config: {
       auth: false,
       validate: {
         query: joiConfig.freshfoods.fooditem.config
       }
     }
   },
   {
     method: ['GET'],
     path: `${footPrints.prefix}/freshfoods/food/stats/`,
     handler: 'FreshFoodController.getFoodStats',
     config: {
       auth: false,
       validate: {
       }
     }
   },
   {
     method: ['GET'],
     path: `${footPrints.prefix}/rmart/food/stats/`,
     handler: 'RMartController.getFoodStats',
     config: {
       auth: false,
       validate: {
       }
     }
   },
  {
    method: [ 'GET' ],
    path: `${footPrints.prefix}/default/info`,
    handler: 'DefaultController.info',
    config: {
      auth: false
    }
  },
  {
    method: ['POST'],
    path: `${footPrints.prefix}/foodcategory/create/`,
    handler: 'FreshFoodController.createFoodCategory',
    config: {
      auth: false,
      validate: {
        payload: joiConfig.freshfoods.foodcategory.create,
        failAction: function (request, reply, source, error) {
          console.log(error)
           error.output.payload.message = 'Category name is required';
           error.output.payload.validation = "Failed";
           return reply(error)
       }
      }
    }
  },
  {
    method: ['POST'],
    path: `${footPrints.prefix}/fooditem/create/`,
    handler: 'FreshFoodController.createFoodItem',
    config: {
      auth: false,
      validate: {
      }
    }
  },
  {
    method: ['PUT'],
    path: `${footPrints.prefix}/fooditem/update/`,
    handler: 'FreshFoodController.updateFoodItem',
    config: {
      auth: false,
      validate: {
      }
    }
  },
]
