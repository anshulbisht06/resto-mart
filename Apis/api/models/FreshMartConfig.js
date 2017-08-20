'use strict'

const Model = require('trails/model')
const moment = require('moment')

/**
* @module FreshMartConfig
* @description TODO document Model
*/
module.exports = class FreshMartConfig extends Model {

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

    return {
      for: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      isClosed: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      closedDate: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        set: function(v) {
          if (v !== undefined && v !== null) {
            // console.log(v, app.config.data.date(v, 'YYYY-MM-DD'), '-----')
            this.setDataValue('closedDate', app.config.data.date(moment(v, 'DD/MM/YYYY'), 'YYYY-MM-DD'))
          }
        },
        get: function() {
          return app.config.data.date(this.getDataValue('closedDate'), 'DD/MM/YYYY')
        }
      },
      closedTimeFrom: {
        type: Sequelize.TIME,
        allowNull: true,
        set: function(v) {
          if (v !== undefined && v !== null) {
            this.setDataValue('closedTimeFrom', app.config.data.date(v, 'HH:MM:SS.SSSZ'))
          }else{
            this.setDataValue('closedTimeFrom', null)
          }
        },
        get: function() {
          const v = this.getDataValue('closedTimeFrom')
          if(v !== undefined && v !== null)
          return moment(this.getDataValue('closedTimeFrom'), 'HH:MM:SS.SSSZ')
          else
          return ''
        },
        validate: {
          timeCheck: function(v) {
            if(v !== undefined && v !== null && this.closedTimeTo !== undefined && this.closedTimeTo !== null){
              // console.log(moment(this.closedTimeFrom).valueOf() < moment(this.closedTimeTo).valueOf())
              // console.log(moment(this.closedTimeFrom).valueOf(), moment(this.closedTimeTo).valueOf())
              if(moment(this.closedTimeFrom).valueOf() >= moment(this.closedTimeTo).valueOf()){
                throw new Error('Closed start time must be earlier then closed end time!');
              }
            }
          }
        }
      },
      closedTimeTo: {
        type: Sequelize.TIME,
        allowNull: true,
        set: function(v) {
          if (v !== undefined && v !== null) {
            this.setDataValue('closedTimeTo', app.config.data.date(v, 'HH:MM:SS.SSSZ'))
          }else{
            this.setDataValue('closedTimeTo', null)
          }
        },
        get: function() {
          const v = this.getDataValue('closedTimeTo')
          if(v !== undefined && v !== null)
          return moment(this.getDataValue('closedTimeTo'), 'HH:MM:SS.SSSZ')
          else
          return ''
        }
      },
      discountForAll: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      discountForCategory: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      discountForItem: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    }
  }
}
