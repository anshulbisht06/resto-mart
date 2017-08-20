'use strict'

const Model = require('trails/model')

/**
 * @module ItemCost
 * @description TODO document Model
 */
module.exports = class ItemCost extends Model {

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
    // const config = app.config.data.rmart.ItemCost

    return {
      quantity: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    }
  }
}
