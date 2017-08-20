'use strict'

const Model = require('trails/model')

/**
 * @module FoodCost
 * @description cost of food
 */
module.exports = class FoodCost extends Model {

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
    const config = app.config.data.freshfoods.FoodCost

    return {
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2,
        set: function(v) {
          if (v !== undefined && typeof v === 'string' && config.r1.quantity[v] !== undefined) {
            this.setDataValue('quantity', config.r1.quantity[v]);
          }
        },
        get: function() {
          // console.log(config.r.quantity[this.getDataValue('quantity')], config.r.quantity)
          return config.r.quantity[this.getDataValue('quantity')]
        }
      },
      cost: {
        type: Sequelize.FLOAT,
        allowNull: false
      }
    }
  }
}
