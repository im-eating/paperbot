const Sequelize = require('sequelize');
const queuing = require("./queue.js");
const dbQueue = new queuing();

const sequelize = new Sequelize('database', 'DStat123', '132435465768798000000', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const DDB = sequelize.define('DailyStats', {
  pID: Sequelize.STRING,
  stat: Sequelize.STRING,
  value: Sequelize.INTEGER
});


DDB.sync()

console.log('\x1b[32m%s\x1b[0m', `DailyStats DB loaded`);

module.exports = {

  updateStat: function(playerID, stat, value) {
    return dbQueue.addToQueue({
      "value": this._updateStat.bind(this),
      "args": [playerID, stat, value]
    });
  },

  _updateStat: async function(playerID, stat, value) {
    if (!playerID) throw new Error('updateStat function is missing parameters!')
    if (!stat) throw new Error('updateStat function is missing parameters!')
    if (!value) {
      var value = 1;
    }
    return new Promise(async (resolve, error) => {
      const Info = await DDB.findOne({
        where: {
          pID: playerID,
          stat: stat
        }
      });
      if (Info) {
        const Info3 = await DDB.update({
          value: Info.value + value
        }, {
          where: {
            pID: playerID,
            stat: stat
          }
        });
        return resolve({
          pID: playerID,
          stat: stat,
          value: Info.value + value
        })
      }
      const Info2 = await DDB.create({
        pID: playerID,
        stat: stat,
        value: value
      });
      return resolve({
        pID: playerID,
        stat: stat,
        value: value
      })
    });
  },

  resetStat: function(playerID, stat) {
    return dbQueue.addToQueue({
      "value": this._resetStat.bind(this),
      "args": [playerID, stat]
    });
  },

  _resetStat: async function(playerID, stat) {
    if (!playerID) throw new Error('resetStat function is missing parameters!')
    if (!stat) throw new Error('resetStat function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await DDB.findOne({
        where: {
          pID: playerID,
          stat: stat
        }
      });
      if (Info) {
        const Info3 = await DDB.update({
          value: 0
        }, {
          where: {
            pID: playerID,
            stat: stat
          }
        });
        return resolve({
          pID: playerID,
          stat: stat,
          value: 0
        })
      } else {
        return resolve('No record of this stat in database')
      }
    });
  },

  resetAllStat: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._resetAllStat.bind(this),
      "args": [playerID]
    });
  },

  _resetAllStat: async function(playerID) {
    if (!playerID) throw new Error('resetAllStat function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await DDB.findOne({
        where: {
          pID: playerID,
        }
      });
      if (Info) {
        const Info3 = await DDB.update({
          value: 0
        }, {
          where: {
            pID: playerID,
          }
        });
        return resolve({
          pID: playerID,
          value: 0
        })
      } else {
        return resolve('No record of this stat in database')
      }
    });
  },

  fetchStat: function(playerID, stat) {
    return dbQueue.addToQueue({
      "value": this._fetchStat.bind(this),
      "args": [playerID, stat]
    });
  },

  _fetchStat: async function(playerID, stat) {
    if (!playerID) throw new Error('fetchStat function is missing parameters!')
    if (!stat) throw new Error('fetchStat function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await DDB.findOne({
        where: {
          pID: playerID,
          stat: stat
        }
      });
      if (Info) {

        return resolve({
          pID: Info.pID,
          stat: Info.stat,
          value: Info.value
        })
      } else {
        const Info2 = await DDB.create({
          pID: playerID,
          stat: stat,
          value: 0
        });
        return resolve({
          pID: playerID,
          stat: stat,
          value: 0
        })
      }

    });
  },

}
