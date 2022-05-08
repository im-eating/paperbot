const fs = require('fs')
const lvl = require('../getJSON/leveling2.json')

module.exports = {
  setXp: async function (UserID, toSet) {
    if (!UserID || toSet == undefined) throw new Error('SetXpSetXp function is missing parameters!')
    if (!parseInt(toSet) && toSet != 0) throw new Error('SetXp function parameter toSet needs to be a number!')
    toSet = parseInt(toSet)
    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<lvl.length; i++) {
        if (lvl[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //update xp
        var initialXp = lvl[index].xp
        lvl[index].xp = toSet
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldxp: initialXp,
          newxp: toSet,
          level: lvl[index].level
        })
      } else {
        //create new
        lvl.push({"id": UserID, "level": 0, "xp": toSet})
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldxp: 0,
          newxp: toSet,
          level: 0
        })
      }

    });
  },

  setLevel: async function (UserID, toSet) {
    if (!UserID || toSet == undefined) throw new Error('SetLevel function is missing parameters!')
    if (!parseInt(toSet) && toSet != 0) throw new Error('SetLevel function parameter toSet needs to be a number!')
    toSet = parseInt(toSet)
    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<lvl.length; i++) {
        if (lvl[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //update xp
        var initialLvl = lvl[index].level
        lvl[index].level = toSet
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldlvl: initialLvl,
          newlvl: toSet,
          xp: lvl[index].xp
        })
      } else {
        //create new
        lvl.push({"id": UserID, "level": toSet, "xp": 0})
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldlvl: 0,
          newlvl: toSet,
          xp: 0
        })
      }

    });
  },

  addXp: async function(UserID, toAdd) {
    if (!UserID || !toAdd) throw new Error('AddXp function is missing parameters!')
    if (!parseInt(toAdd)) throw new Error('AddXp function parameter toAdd needs to be a number!')
    toAdd = parseInt(toAdd)
    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<lvl.length; i++) {
        if (lvl[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //update xp
        var initialXp = lvl[index].xp
        lvl[index].xp += toAdd
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldxp: initialXp,
          newxp: initialXp + toAdd,
          level: lvl[index].level
        })
      } else {
        //create new
        lvl.push({"id": UserID, "level": 0, "xp": toAdd})
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldxp: 0,
          newxp: toAdd,
          level: 0
        })
      }

    });
  },

  addLevel: async function(UserID, toAdd) {
    if (!UserID || !toAdd) throw new Error('AddLevel function is missing parameters!')
    if (!parseInt(toAdd)) throw new Error('AddLevel function parameter toAdd needs to be a number!')
    toAdd = parseInt(toAdd)
    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<lvl.length; i++) {
        if (lvl[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //update xp
        var initialLvl = lvl[index].level
        lvl[index].level += toAdd
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldlvl: initialLvl,
          newlvl: initialLvl + toAdd,
          xp: lvl[index].xp
        })
      } else {
        //create new
        lvl.push({"id": UserID, "level": toAdd, "xp": 0})
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          oldlvl: 0,
          newlvl: toAdd,
          xp: 0
        })
      }

    });
  },

  fetch: async function(UserID) {
    if (!UserID) throw new Error('Fetch function is missing parameters!')
    return new Promise(async (resolve, error) => {
      //find user account and update, if user account not found, then create a new one
      var hasId = false
      var index = 0
      for (var i=0; i<lvl.length; i++) {
        if (lvl[i].id == UserID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        return resolve({
          userid: UserID,
          lvl: lvl[index].level,
          xp: lvl[index].xp
        })
      } else {
        //create new
        lvl.push({"id": UserID, "level": 0, "xp": 0})
        fs.writeFile("./paperbot/getJSON/leveling2.json", JSON.stringify(lvl), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: UserID,
          lvl: 0,
          xp: 0
        })
      }

    });
  },

  leaderboard: async function(search, UserID) {
    if (!UserID) throw new Error('No User ID')

    return new Promise(async (resolve, error) => {

      lvl.sort((a, b) => (a.level < b.level) ? 1 : (a.level == b.level) ? ((a.xp < b.xp) ? 1 : -1) : -1)

      if (search) {
        var user = null
        var index = 0
        for (var i=0; i<lvl.length; i++) {
          if (lvl[i].id == UserID) {
            user = lvl[i]
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
          users: lvl
        })
      }



    });
  }
}
