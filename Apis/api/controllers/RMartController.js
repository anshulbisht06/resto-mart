'use strict'

const Controller = require('trails/controller')

/**
 * @module RMartController
 * @description TODO document Controller.
 */
module.exports = class RMartController extends Controller {

  getFoodStats(request, reply){

    this.app.orm.Item.count().then((itemsCount) => {
      this.app.orm.ItemCategory.count().then((itemCategoriesCount) => {
        // console.log(itemsCount, 'itemsCount')
        reply({
          success: true,
          type: 'success',
          data: {
            items: {
              total: itemsCount
            },
            itemCategories: {
              total: itemCategoriesCount
            }
          }
        })
      })
    })

  }

}
