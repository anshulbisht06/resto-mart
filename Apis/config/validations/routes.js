const Joi = require('joi')

module.exports = {
  auth0: {
    access_token: Joi.string().required()
  },
  login: {
    email: Joi.string().email().valid('admin@freshmart.biz').required(),
    password: Joi.string().valid('freshmartnitin00&').required(),
    recaptcha: Joi.string().required(),
    app: Joi.string().valid(['rmart', 'freshfoods']).required()
  },
  freshfoods:{
    foodcategory:{
      create:{
        category: Joi.string().required(),
        error: Joi.string().allow('').optional()
      }
    },
    fooditem:{
      config:{
        include: Joi.string().valid(['foodcategory']).required()
      }
    }
  }
}
