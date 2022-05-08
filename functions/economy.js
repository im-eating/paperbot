const eco = require('../getJSON/economy.json')
const fs = require('fs')

module.exports = {

  setBalance: async function (UserID, toSet) {
    if (!UserID) throw new Error('SetBalance function is missing parameters!')
    if (!toSet && toSet != 0) throw new Error('SetBalance function is missing parameters!')
    if (!parseInt(toSet)) throw new Error('SetBalance function parameter toSet needs to be a number!')
    toSet = parseInt(toSet)

    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<eco.length; i++) {
        if (eco[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //update balance
        var initialBalance = eco[index].balance
        eco[index].balance = toSet
        fs.writeFile("./paperbot/getJSON/economy.json", JSON.stringify(eco), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldbalance: initialBalance,
          newbalance: toSet,
        })
      } else {
        //create new
        eco.push({"id": UserID, "balance": toSet})
        fs.writeFile("./paperbot/getJSON/economy.json", JSON.stringify(eco), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldbalance: 0,
          newbalance: toSet,
        })
      }

    });
  },

  addToBalance: async function (UserID, toAdd) {
    if (!UserID) throw new Error('AddToBalance function is missing parameters!')
    if (!toAdd && toAdd != 0) throw new Error('AddToBalance function is missing parameters!')
    if (!parseInt(toAdd)) throw new Error('AddToBalance function parameter toAdd needs to be a number!')
    toAdd = parseInt(toAdd)

    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<eco.length; i++) {
        if (eco[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //update balance
        var initialBalance = eco[index].balance
        eco[index].balance += toAdd
        fs.writeFile("./paperbot/getJSON/economy.json", JSON.stringify(eco), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldbalance: initialBalance,
          newbalance: initialBalance + toAdd,
        })
      } else {
        //create new
        eco.push({"id": UserID, "balance": 100+toAdd})
        fs.writeFile("./paperbot/getJSON/economy.json", JSON.stringify(eco), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldbalance: 0,
          newbalance: 100+toAdd,
        })
      }

    });
  },

  subtractFromBalance: async function (UserID, toAdd) {
    if (!UserID) throw new Error('SubtractFromBalance function is missing parameters!')
    if (!toAdd && toAdd != 0) throw new Error('SubtractFromBalance function is missing parameters!')
    if (!parseInt(toAdd)) throw new Error('SubtractFromBalance function parameter toAdd needs to be a number!')
    toAdd = parseInt(toAdd)

    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<eco.length; i++) {
        if (eco[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //update balance
        var initialBalance = eco[index].balance
        eco[index].balance -= toAdd
        fs.writeFile("./paperbot/getJSON/economy.json", JSON.stringify(eco), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldbalance: initialBalance,
          newbalance: initialBalance - toAdd,
        })
      } else {
        //create new
        eco.push({"id": UserID, "balance": 100-toAdd})
        fs.writeFile("./paperbot/getJSON/economy.json", JSON.stringify(eco), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldbalance: 0,
          newbalance: 100-toAdd,
        })
      }

    });
  },


  fetchBalance: async function (UserID) {
    if (!UserID) throw new Error('FetchBalance function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<eco.length; i++) {
        if (eco[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }

      if (hasId) {
        var balance = eco[index].balance
        return resolve({
          userid: UserID,
          balance: balance
        })
      } else {
        //create new
        eco.push({"id": UserID, "balance": 100})
        fs.writeFile("./paperbot/getJSON/economy.json", JSON.stringify(eco), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          balance: 100
        })
      }
    });
  },

  leaderboard: async function (search, UserID) {
    if (!UserID) throw new Error('No User ID')

    return new Promise(async (resolve, error) => {

      eco.sort((a, b) => (a.balance < b.balance) ? 1 : -1)

      if (search) {
        var user = null
        var index = 0
        for (var i=0; i<eco.length; i++) {
          if (eco[i].id == UserID) {
            user = eco[i]
            index = i
            break;
          }
        }
        return resolve({
          place: index+1,
          users: user
        })
      } else {
        return resolve({
          users: eco
        })
      }



    });
  }
}
