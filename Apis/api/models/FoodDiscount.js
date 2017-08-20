'use strict'

const Model = require('trails/model')
const moment = require('moment')


/**
 * @module FoodDiscount
 * @description TODO document Model
 */
module.exports = class FoodDiscount extends Model {

  static config(app, Sequelize) {
    return {
      migrate: 'alter', //override default models configurations if needed
      store: 'postgres', //override default models configurations if needed
      options: {
        classMethods: {
          associate: (models) => {
          }
        }
      }
    }
  }

  static schema(app, Sequelize) {
    // const config = app.config.data.freshfoods.FoodItem

    return {
      rate: {
        type: Sequelize.FLOAT,
        allowNull: false,
        unique: true
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: moment().format('YYYY-MM-DD')
      },
    }
  }
}
