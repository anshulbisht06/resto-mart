exports.freshfoods = require('./freshfoods')
exports.rmart = require('./rmart')

const moment = require('moment')

exports.date = function(date, format){
  try{
    return moment(date).format(format || 'DD-MM-YYYY hh:mm:ss a')
  }catch(e){
    return 'NA'
  }
}
