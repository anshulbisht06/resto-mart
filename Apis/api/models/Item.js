'use strict'

const Model = require('trails/model')

/**
 * @module Item
 * @description TODO document Model
 */
module.exports = class Item extends Model {

  static config(app, Sequelize) {
    return {
      migrate: 'alter', //override default models configurations if needed
      store: 'postgres', //override default models configurations if needed
      options: {
        classMethods: {
          associate: (models) => {

           models.Item.hasMany(models.ItemCost, {
            as: 'itemCostForItem',
            onDelete: 'CASCADE',
            foreignKey: {
              allowNull: false,
              name: 'itemId'
            }
          })

          models.Item.hasOne(models.ItemDiscount, {
           as: 'itemDiscountForItem',
           onDelete: 'CASCADE',
           foreignKey: {
             allowNull: true,
             name: 'itemId'
           }
         })

          }
        }
      }
    }
  }

  static schema(app, Sequelize) {
    const config = app.config.data.rmart.Item

    return {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: true,
        // set: function(v) {
        //   if (v !== undefined && typeof v === 'string' && config.r1.brand[v] !== undefined) {
        //     // console.log('config.r1.brand[v]', config.r1.brand[v])
        //     this.setDataValue('brand', config.r1.brand[v])
        //   }
        // },
        // get: function() {
        //   return config.r.brand[this.getDataValue('brand')]
        // }
      },
      company: {
        type: Sequelize.STRING,
        allowNull: false,
        // set: function(v) {
        //   if (v !== undefined && typeof v === 'string' && config.r1.company[v] !== undefined) {
        //     // console.log('config.r1.company[v]', config.r1.company[v])
        //     this.setDataValue('company', config.r1.company[v])
        //   }
        // },
        // get: function() {
        //   return config.r.company[this.getDataValue('company')]
        // }
      },
      content: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        set: function(v) {
          if (v !== undefined && typeof v === 'string' && config.r1.content[v] !== undefined) {
            this.setDataValue('content', config.r1.content[v]);
          }
        },
        get: function() {
          // console.log(config.r.quantity[this.getDataValue('quantity')], config.r.quantity)
          return config.r.content[this.getDataValue('content')]
        }
      },
      state: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
        set: function(v) {
          if (v !== undefined && typeof v === 'string' && config.r1.state[v] !== undefined) {
            this.setDataValue('state', config.r1.state[v]);
          }
        },
        get: function() {
          return config.r.state[this.getDataValue('state')]
        }
      }
    }
  }

}
