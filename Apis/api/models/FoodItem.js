'use strict'

const Model = require('trails/model')

/**
 * @module FoodItem
 * @description TODO document Model
 */
module.exports = class FoodItem extends Model {

  static config(app, Sequelize) {
    return {
      migrate: 'alter', //override default models configurations if needed
      store: 'postgres', //override default models configurations if needed
      options: {
        classMethods: {
          associate: (models) => {

           models.FoodItem.hasMany(models.FoodCost, {
            as: 'foodCostForFoodItem',
            onDelete: 'CASCADE',
            foreignKey: {
              allowNull: false,
              name: 'foodItemId'
            }
          })

          models.FoodItem.hasOne(models.FoodDiscount, {
           as: 'foodDiscountForFoodItem',
           onDelete: 'CASCADE',
           foreignKey: {
             allowNull: true,
             name: 'foodItemId'
           }
         })

          }
        }
      }
    }
  }

  static schema(app, Sequelize) {
    const config = app.config.data.freshfoods.FoodItem

    return {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      isVeg: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      cuisine: {
        type: Sequelize.INTEGER,
        allowNull: false,
        set: function(v) {
          if (v !== undefined && typeof v === 'string' && config.r1.cuisine[v] !== undefined) {
            console.log('config.r1.cuisine[v]', config.r1.cuisine[v])
            this.setDataValue('cuisine', config.r1.cuisine[v])
          }
        },
        get: function() {
          return config.r.cuisine[this.getDataValue('cuisine')]
        }
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        set: function(v) {
          if (v !== undefined && typeof v === 'string' && config.r1.status[v] !== undefined) {
            this.setDataValue('status', config.r1.status[v])
          }
        },
        get: function() {
          return config.r.status[this.getDataValue('status')]
        }
      }
    }
  }
}
