/**
 * Session Configuration
 * (app.config.session)
 *
 * @see http://trailsjs.io/doc/config/session.js
 */

'use strict'

module.exports = {

  /**
   * Define the session implementation, e.g. 'jwt' or 'cookie'
   */
  strategy: 'jwt',

  /**
   * Define jwt-specific options
   */
  jwt: {
    secret: "ve/W!r)bPi|hH@Iz#W]cJ8L;1BU>$!s3-Wl66t`bqSnYS|$*6:n6D'9LQ8X*z-X:TxtW}7KGPE#3YR_m(.EiW(6~\"z7$3H\",+ckJBAm^#C,%cM<7%9|}+W5+",
    connection: 'localStorage',
    model: 'WebToken'
  },

  /**
   * Define cookie-specific options
   */
  cookie: {
    maxAge: 24*60*60
  }

}
