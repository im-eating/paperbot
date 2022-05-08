const fs = require('fs')
const ds = require('../getJSON/dailystats.json')
const ts = require('../getJSON/stats.json')

module.exports = {

  updateStat: async function (playerID, stat, value, notDaily) {
    if (!playerID) throw new Error('updateStat function is missing parameters!')
    if (!stat) throw new Error('updateStat function is missing parameters!')
    if (!value) {
      var value = 1;
    }
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<ts.length; i++) {
        if (ts[i].id == playerID && ts[i].stat == stat) {
          hasId = true
          index = i
          break;
        }
      }
      var dailyValue = 0;

      if (!notDaily) {
        var dhasId = false
        var dindex = 0
        for (var i=0; i<ds.length; i++) {
          if (ds[i].id == playerID && ds[i].stat == stat) {
            dhasId = true
            dindex = i
            break;
          }
        }
        dailyValue = 0;
        if (dhasId) {
          dailyValue = ds[dindex].value + value;
          ds[dindex].value += value;
        } else {
          dailyValue = value;
          ds.push({"id": playerID, "stat": stat, "value": value})
        }
        fs.writeFile("./paperbot/getJSON/dailystats.json", JSON.stringify(ds), err => {
          if (err) throw err;
          console.log('dailystat update')
        })
      }

      var totalValue = 0;
      if (hasId) {
        totalValue = ts[index].value + value;
        ts[index].value += value;
      } else {
        totalValue = value;
        ts.push({"id": playerID, "stat": stat, "value": value})
      }




      fs.writeFile("./paperbot/getJSON/stats.json", JSON.stringify(ts), err => {
        if (err) throw err;
        console.log('stat update')
      })

      return resolve({
        id: playerID,
        stat: stat,
        tvalue: totalValue,
        dvalue: dailyValue
      })

    });
  },

  resetDailyStat: async function (playerID, stat) {
    if (!playerID) throw new Error('resetStat function is missing parameters!')
    if (!stat) throw new Error('resetStat function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var dhasId = false
      var dindex = 0
      for (var i=0; i<ds.length; i++) {
        if (ds[i].id == playerID && ds[i].stat == stat) {
          dhasId = true
          dindex = i
          break;
        }
      }
      if (dhasId) {
        ds[index].value = 0;
        fs.writeFile("./paperbot/getJSON/dailystats.json", JSON.stringify(ds), err => {
          if (err) throw err;
          console.log('dailystat reset')
        })
        return resolve({
          id: playerID,
          stat: stat,
          value: 0
        })
      } else {
        return resolve('No record of this stat in database')
      }
    });
  },

  resetAllDailyStat: async function (playerID) {
    if (!playerID) throw new Error('resetAllStat function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var dhasId = false
      var dindex = 0
      for (var i=0; i<ds.length; i++) {
        if (ds[i].id == playerID) {
          dhasId = true
          ds[i].value = 0
        }
      }
      if (dhasId) {
        fs.writeFile("./paperbot/getJSON/dailystats.json", JSON.stringify(ds), err => {
          if (err) throw err;
          console.log('dailystat total reset')
        })
        return resolve({
          id: playerID
        })
      } else {
        return resolve('No record of this player in database')
      }
    });
  },

  fetchStat: async function (playerID, stat) {
    if (!playerID) throw new Error('fetchStat function is missing parameters!')
    if (!stat) throw new Error('fetchStat function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<ts.length; i++) {
        if (ts[i].id == playerID && ts[i].stat == stat) {
          hasId = true
          index = i
          break;
        }
      }

      var dhasId = false
      var dindex = 0
      for (var i=0; i<ds.length; i++) {
        if (ds[i].id == playerID && ds[i].stat == stat) {
          dhasId = true
          dindex = i
          break;
        }
      }
      var totalValue = 0;
      var dailyValue = 0;
      if (hasId) {
        totalValue = ts[index].value;
      } else {
        ts.push({"id": playerID, "stat": stat, "value": 0})
        fs.writeFile("./paperbot/getJSON/stats.json", JSON.stringify(ts), err => {
          if (err) throw err;
          console.log('stat update')
        })
      }

      if (dhasId) {
        dailyValue = ds[dindex].value;
      } else {
        ds.push({"id": playerID, "stat": stat, "value": 0})
        fs.writeFile("./paperbot/getJSON/dailystats.json", JSON.stringify(ds), err => {
          if (err) throw err;
          console.log('dailystat update')
        })
      }

      return resolve({
        id: playerID,
        tvalue: totalValue,
        dvalue: dailyValue
      })

    });
  }
}
