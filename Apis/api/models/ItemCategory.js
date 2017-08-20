'use strict'

const Model = require('trails/model')

/**
 * @module ItemCategory
 * @description TODO document Model
 */
module.exports = class ItemCategory extends Model {

  static config(app, Sequelize) {
    return {
      migrate: 'alter', //override default models configurations if needed
      store: 'postgres', //override default models configurations if needed
      options: {
        classMethods: {
          associate: (models) => {

            models.ItemCategory.hasMany(models.Item, {
             as: 'itemsForItemCategory',
             onDelete: 'CASCADE',
             foreignKey: {
               allowNull: false,
               name: 'itemCategoryId'
             }
           })

           models.ItemCategory.hasOne(models.ItemDiscount, {
            as: 'itemDiscountForItemCategory',
            onDelete: 'CASCADE',
            foreignKey: {
              allowNull: true,
              name: 'itemCategoryId'
            }
          })

          }
        }
      }
    }
  }

  static schema(app, Sequelize) {
    const config = app.config.data.rmart.ItemCategory

    return {
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
          notEmpty: {
            msg: "Item Category can't be empty"
          }
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      type: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: false,
        set: function(v) {
          if (v !== undefined && typeof v === 'string' && config.r1.type[v] !== undefined) {
            this.setDataValue('type', config.r1.type[v]);
          }
        },
        get: function() {
          return config.r.type[this.getDataValue('type')]
        }
      }
    }
  }
}
