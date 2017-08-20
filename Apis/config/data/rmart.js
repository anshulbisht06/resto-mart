let shortHands = {
  Item:{
    r:{
      content: {
        0: "Kg",
        1: "g",
        2: "mg",
        3: 'L',
        4: 'ml',
        5: 'counts'
      },
      state: {
        0: "Solid",
        1: "Powder",
        2: "Liquid",
        3: 'Gas',
        4: 'Paste',
        5: 'Solution'
      }
    },
    r1:{}
  },
  ItemCategory: {
    r:{
      type:{
        0: 'Food',
        1: 'Cosmetic',
        2: 'Beverage'
      }
    },
    r1: {}
  }
};

const common = require('./common')
// console.log(JSON.stringify(shortHands, null, 4))

module.exports = common.appendToShortHand(shortHands)
