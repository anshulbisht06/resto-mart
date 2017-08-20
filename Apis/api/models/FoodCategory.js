'use strict'

const Model = require('trails/model')

/**
 * @module FoodCategory
 * @description TODO document Model
 */
module.exports = class FoodCategory extends Model {

  static config(app, Sequelize) {
    return {
      migrate: 'alter', //override default models configurations if needed
      store: 'postgres', //override default models configurations if needed
      options: {
        classMethods: {
          associate: (models) => {

            models.FoodCategory.hasMany(models.FoodItem, {
             as: 'foodItemsForFoodCategory',
             onDelete: 'CASCADE',
             foreignKey: {
               allowNull: false,
               name: 'foodCategoryId'
             }
           })

           models.FoodCategory.hasOne(models.FoodDiscount, {
            as: 'foodDiscountForFoodCategory',
            onDelete: 'CASCADE',
            foreignKey: {
              allowNull: true,
              name: 'foodCategoryId'
            }
          })

          }
        }
      }
    }
  }

  static schema(app, Sequelize) {
    // const config = app.config.data.freshfoods.FoodCategory

    return {
      category: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
        validate:{
          notEmpty: {
            msg: "Food Category can't be empty"
          }
        }
        // set: function(v) {
        //   if (v !== undefined && typeof v === 'string' && v.length !== 0) {
        //     this.setDataValue('category', v);
        //   }
        // },
        // get: function() {
        //   return config.r.category[this.getDataValue('category')]
        // }
      },
      // createdAt: {
      //   type: Sequelize.VIRTUAL,
      //   allowNull: true,
      //   defaultValue: new Date(),
      //   get: function(){
      //     return app.config.data.date(this.getDataValue('createdAt'))
      //   },
      //   set: function(v) {
      //     this.setDataValue('createdAt', new Date());
      //   }
      // },
      // updatedAt: {
      //   type: Sequelize.VIRTUAL,
      //   allowNull: true,
      //   defaultValue: new Date(),
      //   get: function(){
      //     return app.config.data.date(this.getDataValue('updatedAt'))
      //   },
      //   set: function(v) {
      //     this.setDataValue('updatedAt', new Date());
      //   }
      // }
    }
  }
}
