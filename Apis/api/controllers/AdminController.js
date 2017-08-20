'use strict'

const Controller = require('trails/controller')
const jwt = require('jsonwebtoken')
const config = require('../../config/config.json')


/**
 * @module AdminController
 * @description TODO document Controller.
 */
module.exports = class AdminController extends Controller {

  login (request, reply) {

    try{

      const token = jwt.sign({
        app: request.payload.app,
        email: request.payload.email,
        role: 'admin'
      }, this.app.config.session.jwt.secret, { expiresIn: this.app.config.session.cookie.maxAge });

      reply({
        success: true,
        type: 'success',
        data: {
          message: 'Logged in successfully',
          token: token,
          settings: {
            domain: config[this.app.env.NODE_ENV].uiServerUrl,
            expires: this.app.config.session.cookie.maxAge,
            secure: true
          }
        }
      })

    }catch(error){
      reply({
        success: false,
        type: 'error',
        data: {
          message: 'Cannot login',
          error: error.message
        }
      })
    }

  }

}
