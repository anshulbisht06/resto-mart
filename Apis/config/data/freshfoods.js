let shortHands = {
  FoodItem:{
    r:{
      status: {
        0: "Available",
        1: "Unavailable",
        // 2: "Conditional"
      },
      cuisine: {
        0: "Indian",
        1: "Chinese",
        2: "Mughlai"
      }
    },
    r1:{}
  },
  FoodCost: {
    r:{
      quantity:{
        0: 'Quarter',
        1: 'Half',
        2: 'Full'
      }
    },
    r1: {}
  }
};

const common = require('./common')
// console.log(JSON.stringify(shortHands, null, 4))

module.exports = common.appendToShortHand(shortHands)
