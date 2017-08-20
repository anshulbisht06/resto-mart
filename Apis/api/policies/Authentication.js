'use strict'

const Policy = require('trails/policy')
const Boom = require('boom')
const jwt = require('jsonwebtoken')
/**
 * @module AuthenticationPolicy
 * @description authorization validation
 */
module.exports = class AuthenticationPolicy extends Policy {


  authorize(request, reply){

    try{
      const accessToken = (request.headers.authorization || request.headers.Authorization).replace(/"/g, '')
      if(accessToken !== undefined){

        const decoded = jwt.verify(accessToken, this.app.config.session.jwt.secret)

        if(['rmart', 'freshfoods'].indexOf(decoded.app) !== -1 &&
            (decoded.email === 'admin@freshmart.biz') && (decoded.role === 'admin')){
              return reply.continue()
            }else{
              return reply(Boom.badData('Invalid authorization token'));
            }

      }else{
        return reply(Boom.forbidden('Authorization token required'));
      }

    }catch(error){
      // console.log(error, 'ffffffffff');
      // return reply({ success: false, type: 'error', message: "Session Error", data: { message: "." } }).code(503)
      return reply(Boom.unauthorized('Invalid session'))

    }




  }
}
