const Sequelize = require('sequelize');
const { Op } = require('sequelize');
const queuing = require("./queue.js");
const dbQueue = new queuing();

const sequelize = new Sequelize('database', 'Chal123', '13243546576879800000', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const CDB = sequelize.define('Challenges', {
  pID: Sequelize.STRING,
  cID: Sequelize.INTEGER,
  status: Sequelize.STRING,
  category: Sequelize.STRING,
  date: Sequelize.DATE
});


CDB.sync()

console.log('\x1b[32m%s\x1b[0m', `Challenge DB loaded`);

module.exports = {

  addChallenge: function(playerID, challengeID, category) {
    return dbQueue.addToQueue({
      "value": this._addChallenge.bind(this),
      "args": [playerID, challengeID, category]
    });
  },

  _addChallenge: async function(playerID, challengeID, category) {
    if (!playerID) throw new Error('addChallenge function is missing parameters!')
    if (!challengeID) throw new Error('addChallenge function is missing parameters!')
    if (!category) throw new Error('addChallenge function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await CDB.findOne({
        where: {
          pID: playerID,
          cID: challengeID,
          status: 'active'
        }
      });
      if (Info) {
        return resolve('active challenge already exists')
      }
      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //As January is 0.
      var yyyy = today.getFullYear();
      var date = yyyy + '-' + mm + '-' + dd
      const Info2 = await CDB.create({
        pID: playerID,
        cID: challengeID,
        status: 'active',
        category: category,
        date: date
      });
      return resolve({
        pID: playerID,
        cID: challengeID,
        category: category,
        status: 'active',
        date: date
      })
    });
  },

  fetchChallenge: function(playerID, challengeID) {
    return dbQueue.addToQueue({
      "value": this._fetchChallenge.bind(this),
      "args": [playerID, challengeID]
    });
  },

  _fetchChallenge: async function(playerID, challengeID) {
    if (!playerID) throw new Error('fetchChallenge function is missing parameters!')
    if (!challengeID) throw new Error('fetchChallenge function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await CDB.findOne({
        where: {
          pID: playerID,
          cID: challengeID
        }
      });
      if (Info) {

        return resolve({
          pID: Info.pID,
          cID: Info.cID,
          status: Info.status,
          category: Info.category,
          date: Info.date
        })
      } else {
        return resolve('No record of this challenge in database!')
      }

    });
  },

  fetchChallenges: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._fetchChallenges.bind(this),
      "args": [playerID]
    });
  },

  _fetchChallenges: async function(playerID) {
    if (!playerID) throw new Error('fetchChallenges function is missing parameters!')

    return new Promise(async (resolve, error) => {

      const Info = await CDB.findAll({
        where: {
          pID: playerID,
          status: 'active'
        }
      });
      if (Info) {
        return resolve(Info)
      } else {
        return resolve('Player has no active challenges')
      }

    });
  },

  fetchAllChallenges: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._fetchAllChallenges.bind(this),
      "args": [playerID]
    });
  },

  _fetchAllChallenges: async function(playerID) {
    if (!playerID) throw new Error('fetchAllChallenges function is missing parameters!')

    return new Promise(async (resolve, error) => {

      const Info = await CDB.findAll({
        where: {
          pID: playerID,
          status: {
            [Op.or]: ['active', 'inactive']
          }
        }
      });
      if (Info) {
        return resolve(Info)
      } else {
        return resolve('Player has no active challenges')
      }

    });
  },

  updateChallenge: function(playerID, challengeID, status) {
    return dbQueue.addToQueue({
      "value": this._updateChallenge.bind(this),
      "args": [playerID, challengeID, status]
    });
  },

  _updateChallenge: async function(playerID, challengeID, status) {
    if (!playerID) throw new Error('updateChallenge function is missing parameters!')
    if (!challengeID) throw new Error('updateChallenge function is missing parameters!')
    if (!status) throw new Error('updateChallenge function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await CDB.findOne({
        where: {
          pID: playerID,
          cID: challengeID
        }
      });
      if (Info) {
        const Info3 = await CDB.update({
          status: status
        }, {
          where: {
            pID: playerID,
            cID: challengeID
          }
        });
        return resolve({
          pID: playerID,
          cID: challengeID,
          status: status,
        })
      } else {
        return resolve('No record of the challenge in database')
      }
    });
  },

  resetAllChallenges: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._resetAllChallenges.bind(this),
      "args": [playerID]
    });
  },

  _resetAllChallenges: async function(playerID) {
    if (!playerID) throw new Error('resetAllChallenges function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await CDB.destroy({
        where: {
          pID: playerID
        }
      });
      if (Info) {
        return resolve('Challenge removed')
      } else {
        return resolve('No record of the challenge in database')
      }
    });
  },

  resetAllActiveChallenges: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._resetAllActiveChallenges.bind(this),
      "args": [playerID]
    });
  },

  _resetAllActiveChallenges: async function(playerID) {
    if (!playerID) throw new Error('resetAllActiveChallenges function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await CDB.destroy({
        where: {
          pID: playerID,
          status: 'active'
        }
      });
      if (Info) {
        return resolve('Challenge removed')
      } else {
        return resolve('No record of the challenge in database')
      }
    });
  },

  resetAllInactiveChallenges: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._resetAllInactiveChallenges.bind(this),
      "args": [playerID]
    });
  },

  _resetAllInactiveChallenges: async function(playerID) {
    if (!playerID) throw new Error('resetAllInactiveChallenges function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await CDB.destroy({
        where: {
          pID: playerID,
          status: 'inactive'
        }
      });
      if (Info) {
        return resolve('Challenge removed')
      } else {
        return resolve('No record of the challenge in database')
      }
    });
  },

  /*

  removeChallenge: function(playerID, itemName) {
    return dbQueue.addToQueue({
      "value": this._removeItem.bind(this),
      "args": [playerID, itemName]
    });
  },

  _removeItem: async function(playerID, itemName) {
    if (!playerID) throw new Error('removeItem function is missing parameters!')
    if (!itemName) throw new Error('removeItem function is missing parameters!')
    return new Promise(async (resolve, error) => {

      const Info = await IDB.findOne({
        where: {
          pID: playerID,
          name: itemName
        }
      });
      if (Info) {
        if (Info.quantity > 1) {
          const Info2 = await IDB.update({
            quantity: Info.quantity - 1
          }, {
            where: {
              pID: playerID,
              name: itemName
            }
          });
          return resolve('Item removed')
        }
        await Info.destroy();
        return resolve('Item removed')
      } else {
        return resolve('No record of this item in database!!')
      }

    });
  },*/

}
