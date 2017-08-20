'use strict'

const Controller = require('trails/controller')
const lodash = require('lodash')

/**
* @module FreshFoodController
* @description fresh foods app class.
*/
module.exports = class FreshFoodController extends Controller {

  getFoodItemConfigs(request, reply){


    try{
      let data = {
        message: 'Food configurations fetched.',
        statuses: Object.keys(this.app.config.data.freshfoods.FoodItem.r1.status),
        cuisines: Object.keys(this.app.config.data.freshfoods.FoodItem.r1.cuisine),
        quantities: Object.keys(this.app.config.data.freshfoods.FoodCost.r1.quantity),
        foodCategories: []
      }

      if(request.query.include !== undefined){
        this.app.orm.FoodCategory.findAll().then((foodCategories) => {
          for(let i = 0; i < foodCategories.length; i++){
            data.foodCategories.push({
              id: foodCategories[i].id.toString(),
              category: foodCategories[i].category
            });
          }

          reply({
            success: true,
            type: 'success',
            data: data
          })

        }).catch((error) => {
          reply({
            success: false,
            type: 'error',
            data: {
              message: 'Error in fetching food configurations.',
            }
          })
        })
      }else{
        reply({
          success: true,
          type: 'success',
          data: data
        })
      }

    }catch(e){
      reply({
        success: false,
        type: 'error',
        data: {
          message: 'Error in fetching food configurations.',
        }
      })
    }
  }


  getFoodStats(request, reply){

    this.app.orm.FoodItem.findAll().then((foodItems) => {
      if(foodItems !== null){
        let data = {
          foodItems:{
            Available: 0,
            Unavailable: 0,
            Conditional: 0,
            total: 0
          },
          foodCategories:{
            total: 0
          }
        }

        for(let i = 0, j = foodItems.length; i < j; i++){
          data.foodItems[foodItems[i].status] += 1
          data.foodItems.total += 1
        }

        this.app.orm.FoodCategory.count().then((foodCategoriesCount) => {
          if(foodCategoriesCount !== null){
            data.foodCategories.total = foodCategoriesCount
            reply({
              success: true,
              type: 'success',
              data: data
            })
          }
        })
      }
    })
  }


  createFoodCategory(request, reply){

    this.app.orm.FoodCategory.create(request.payload).then((foodCategory) => {
      reply({
        success: true,
        type: 'success',
        data: {
          message: `Food category "${foodCategory.dataValues.category}" has been created.`
        }
      })
    }).catch((error) => {
      let m = 'Server error'
      // console.log(JSON.stringify(error, null, 4))
      if(error.name === 'SequelizeUniqueConstraintError'){
        m = 'This category is already present. Please add a new one.'
      }
      reply({
        success: false,
        type: 'error',
        data: {
          message: m
        }
      })
    })
  }


  createFoodItem(request, reply){

    let d = request.payload
    d.foodCategoryId =  parseInt(d.foodCategoryId)
    d.foodCostForFoodItem = [];

    const keys = Object.keys(d.quantity);
    for(let i = 0; i < keys.length; i++){
      if(d.quantity[keys[i]] !== null && d.quantity[keys[i]] !== undefined && parseInt(d.quantity[keys[i]]) !== 0){
        d.foodCostForFoodItem.push({
          quantity: keys[i],
          cost: d.quantity[keys[i]]
        })
      }
    }

    this.app.services.FootprintService.create('FoodItem', d).then((foodItem) => {
      reply({
        success: true,
        type: 'success',
        data: {
          message: `Food item "${foodItem.dataValues.name}" has been added.`
        }
      })
    }).catch((error) => {
      let m = 'Server error'
      // console.log(JSON.stringify(error, null, 4))
      if(error.name == 'SequelizeUniqueConstraintError'){
        m = 'This food item is already added. Please add a new one.'
      }
      reply({
        success: false,
        type: 'error',
        data: {
          message: m
        }
      })
    })
  }



  updateFoodItem(request, reply){

    const payload = request.payload
    payload.foodCategoryId = parseInt(payload.foodCategoryId)

    this.app.orm.FoodItem.findById(payload.id,{
      include: [{
        model: this.app.orm.FoodCost.sequelize.models.FoodCost,
        as: 'foodCostForFoodItem',
        separate: true
      }]
    }).then((foodItem) => {

      if(foodItem !== null){

        if(foodItem.name.trim() !== payload.name.trim()){
          foodItem.name = payload.name;
        }

        if(foodItem.isVeg !== payload.isVeg){
          foodItem.isVeg = payload.isVeg;
        }

        if(foodItem.cuisine !== payload.cuisine){
          foodItem.cuisine = payload.cuisine;
        }

        if(foodItem.status !== payload.status){
          foodItem.status = payload.status;
        }

        if(foodItem.foodCategoryId !== payload.foodCategoryId){
          foodItem.foodCategoryId = payload.foodCategoryId;
        }

        foodItem.save().then((updatedFoodItem) => {
          console.log('updatedFoodItem')
        })

        let d = {
          create: [],
          update: [],
          delete: []
        }, found;

        for(let i = 0; i < payload.foodCostForFoodItem.length; i++){
          found = lodash.find(foodItem.dataValues.foodCostForFoodItem, { quantity: payload.foodCostForFoodItem[i].quantity })
          if(found === undefined){
            d.create.push({
              foodItemId: payload.id,
              quantity: payload.foodCostForFoodItem[i].quantity,
              cost: payload.foodCostForFoodItem[i].cost
            })
          }else{
            // console.log('found', found)
            // found = lodash.find(foodItem.dataValues.foodCostForFoodItem, { cost: payload.foodCostForFoodItem[i].cost, quantity: payload.foodCostForFoodItem[i].quantity })
            if(parseInt(found.dataValues.cost) !== payload.foodCostForFoodItem[i].cost){
              // console.log('update', payload.foodCostForFoodItem[i])
              this.app.orm.FoodCost.update({
                cost: payload.foodCostForFoodItem[i].cost
              },{
                where: {
                  id: found.dataValues.id
                }
              })
            }
          }
        }

        for(let i = 0; i < foodItem.dataValues.foodCostForFoodItem.length; i++){
          found = lodash.find(payload.foodCostForFoodItem, { quantity: foodItem.dataValues.foodCostForFoodItem[i].quantity })
          if(found === undefined){
            // console.log('delete', foodItem.dataValues.foodCostForFoodItem[i].quantity)
            d.delete.push(foodItem.dataValues.foodCostForFoodItem[i].id)
          }
        }

        if(d.create.length !== 0){
          this.app.orm.FoodCost.bulkCreate(d.create)
        }

        if(d.delete.length !== 0){
          this.app.orm.FoodCost.destroy({
            where: {
              id: {
                $in: d.delete
              }
            }
          })
        }

        reply({
          success: true,
          type: 'success',
          data: {
            message: `Changes saved for food ${payload.name}.`
          }
        })

      }else{
        reply({
          success: false,
          type: 'error',
          data: {
            message: `Unable to find the food ${payload.name}.`
          }
        })
      }

    }).catch((error) => {
      console.log(error)
      reply({
        success: false,
        type: 'error',
        data: {
          message: 'Server error'
        }
      })
    })

  }

}
