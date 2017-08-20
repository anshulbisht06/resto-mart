/**
* Server Configuration
* (app.config.web)
*
* Configure the Web Server
*
* @see {@link http://trailsjs.io/doc/config/web}
*/

const config = require('./config.json')

module.exports = {

  /**
  * The port to bind the web server to
  */
  port: process.env.PORT || 3000,

  /**
  * The host to bind the web server to
  */
  host: process.env.HOST || '0.0.0.0',

  options: {
    routes: {
      cors: config[process.env.NODE_ENV].cors
    }
  },

  onPluginsLoaded: function (err) {
    // Note that `this` is Trails `app` instance

    // this.packs.hapi.server.auth.strategy('jwt', 'jwt', true, {
    //   key: '5s3+u8HZrrHQ8fT4L2Qi5yEyhhgrSUSsrGbf9cvr7+Woo0y1RN86co+mMUE9yAVz4YdY9wCXw6meU1rJbz4t1fJao0PSQHdEG2xBQApNlADKC6eCc2513Ubi04L+D8QQY0Uw9DN918DTHCyWhh39Y8oAjlFL2/BwKWYS29svQY8hVvJyG1ucZBlRDZFoL6B3vvwOpv5U4tDlIoBjz8MU2B8OEa75rae8iKFew16LxFEpjQV4oJybQAYBi6s0Uv/OLRbwraRi0MwwnVWvSXjPoJ5mu9zJDETdxn1/vcsrMUUSdoI2Eu33Nyim1BGtBPhD09FBhTDLPrVAqO0rR0/cKg==',
    //   validateFunc: validate,
    //   verifyOptions: { algorithms: [ 'HS256' ] }
    // })


    // all cors request allowed
    this.packs.hapi.server.ext('onPreResponse', require('hapi-cors-headers'))
  }
}

// console.log(config[process.env.NODE_ENV].cors);
