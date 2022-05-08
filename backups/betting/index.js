const Sequelize = require('sequelize');
const queuing = require("./queue.js");
const dbQueue = new queuing();

const sequelize = new Sequelize('database', 'Bet123', '132435465768798000', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const BDB = sequelize.define('Bets', {
  desc1: Sequelize.STRING,
  desc2: Sequelize.STRING,
  balance: Sequelize.INTEGER,
  startBal: Sequelize.INTEGER,
  closed: Sequelize.INTEGER,
});

const ADB = sequelize.define('ArchBets', {
  bID: Sequelize.INTEGER,
  desc1: Sequelize.STRING,
  desc2: Sequelize.STRING,
  balance: Sequelize.INTEGER,
  bSide: Sequelize.INTEGER,
});

const PDB = sequelize.define('PlayerBets', {
  pID: Sequelize.STRING,
  bID: Sequelize.INTEGER,
  bSide: Sequelize.INTEGER,
  balance: Sequelize.INTEGER,
});

BDB.sync()
PDB.sync()
ADB.sync()

console.log('\x1b[32m%s\x1b[0m', `Bet DB loaded`);

module.exports = {

  createBet: function(description1, description2, startBalance) {
    return dbQueue.addToQueue({
      "value": this._createBet.bind(this),
      "args": [description1, description2, startBalance]
    });
  },

  _createBet: async function(description1, description2, startBalance) {
    if (!description1) throw new Error('createBet function is missing parameters!')
    if (!description2) throw new Error('createBet function is missing parameters!')
    if (!startBalance) throw new Error('createBet function is missing parameters!')

    return new Promise(async (resolve, error) => {
      const Info = await BDB.create({
        desc1: description1,
        desc2: description2,
        balance: 0,
        startBal: startBalance
      });
      return resolve({
        bID: Info.id,
        desc1: description1,
        desc2: description2,
        sBal: startBalance
      })
    });
  },

  createArchBet: function(betID, description1, description2, bBalance, side) {
    return dbQueue.addToQueue({
      "value": this._createArchBet.bind(this),
      "args": [betID, description1, description2, bBalance, side]
    });
  },

  _createArchBet: async function(betID, description1, description2, bBalance, side) {
    if (!description1) throw new Error('createArchBet function is missing parameters!')
    if (!description2) throw new Error('createArchBet function is missing parameters!')
    if (!bBalance) throw new Error('createArchBet function is missing parameters!')
    if (!side) throw new Error('createArchBet function is missing parameters!')
    if (!betID) throw new Error('createArchBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('createArchBet function parameter betID needs to be a number!')
    if (!parseInt(bBalance)) throw new Error('createArchBet function parameter bBalance needs to be a number!')
    if (!parseInt(side)) throw new Error('createArchBet function parameter side needs to be a number!')
    betID = parseInt(betID)
    bBalance = parseInt(bBalance)
    side = parseInt(side)
    return new Promise(async (resolve, error) => {
      const Info = await ADB.create({
        bID: betID,
        desc1: description1,
        desc2: description2,
        balance: bBalance,
        bSide: side
      });
      return resolve({
        bID: betID,
        desc1: description1,
        desc2: description2,
        balance: bBalance,
        bSide: side
      })
    });
  },

  addPlayerBet: function(betID, playerID, betSide, betAmount) {
    return dbQueue.addToQueue({
      "value": this._addPlayerBet.bind(this),
      "args": [betID, playerID, betSide, betAmount]
    });
  },

  _addPlayerBet: async function(betID, playerID, betSide, betAmount) {
    if (!betID) throw new Error('addPlayerBet function is missing parameters!')
    if (!playerID) throw new Error('addPlayerBet function is missing parameters!')
    if (!betSide) throw new Error('addPlayerBet function is missing parameters!')
    if (!betAmount) throw new Error('addPlayerBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('addPlayerBet function parameter betID needs to be a number!')
    if (!parseInt(betAmount)) throw new Error('addPlayerBet function parameter betAmount needs to be a number!')
    if (!parseInt(betSide)) throw new Error('addPlayerBet function parameter betSide needs to be a number!')
    betID = parseInt(betID)
    betAmount = parseInt(betAmount)
    betSide = parseInt(betSide)

    const Info = await BDB.findOne({
      where: {
        id: betID
      }
    });

    if (Info) {
      if (Info.closed === 1) {
        return resolve('Bet is closed')
      }
      const Info2 = await BDB.update({
        balance: Info.balance + betAmount
      }, {
        where: {
          id: betID
        }
      });
    } else {
      return resolve('No record of this bet ID in database!')
    }

    return new Promise(async (resolve, error) => {
      const Info3 = await PDB.findOne({
        where: {
          bID: betID,
          pID: playerID
        }
      });
      if(!Info3) {
        const Info4 = await PDB.create({
          bID: betID,
          pID: playerID,
          bSide: betSide,
          balance: betAmount
        });
        return resolve({
          bID: betID,
          pID: playerID,
          bSide: betSide,
          oldbalance: Info.balance,
          newbalance: Info.balance + betAmount,
          bAmount: betAmount,
        })
      }
      return resolve('User has already bet')
    });
  },

  addToPlayerBet: function(betID, playerID, betAmount) {
    return dbQueue.addToQueue({
      "value": this._addToPlayerBet.bind(this),
      "args": [betID, playerID, betAmount]
    });
  },

  _addToPlayerBet: async function(betID, playerID, betAmount) {
    if (!betID) throw new Error('addPlayerBet function is missing parameters!')
    if (!playerID) throw new Error('addPlayerBet function is missing parameters!')
    if (!betAmount) throw new Error('addPlayerBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('addPlayerBet function parameter betID needs to be a number!')
    if (!parseInt(betAmount)) throw new Error('addPlayerBet function parameter betAmount needs to be a number!')
    betID = parseInt(betID)
    betAmount = parseInt(betAmount)

    const Info = await BDB.findOne({
      where: {
        id: betID
      }
    });
    if (Info) {
      if (Info.closed === 1) {
        return resolve('Bet is closed')
      }
      const Info2 = await BDB.update({
        balance: Info.balance + betAmount
      }, {
        where: {
          id: betID
        }
      });
    } else {
      return resolve('No record of this bet ID in database!')
    }

    return new Promise(async (resolve, error) => {
      const Info3 = await PDB.findOne({
        where: {
          bID: betID,
          pID: playerID
        }
      });
      if(Info3) {
        const Info4 = await PDB.update({
          balance: Info3.balance + betAmount
        }, {
          where: {
            bID: betID,
            pID: playerID
          }
        });
        var oldBal = Info3.balance
        var newBal = oldBal + betAmount
        return resolve({
          bID: betID,
          pID: playerID,
          bSide: Info3.bSide,
          oldbalance: Info.balance,
          newbalance: Info.balance + betAmount,
          oldbAmount: oldBal,
          bAmount: betAmount,
          newbAmount: newBal,
        })
      }
      return resolve('Player Bet does not exist')
    });
  },

  closeBet: function(betID) {
    return dbQueue.addToQueue({
      "value": this._closeBet.bind(this),
      "args": [betID]
    });
  },

  _closeBet: async function(betID) {
    if (!betID) throw new Error('closeBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('closeBet function parameter betID needs to be a number!')
    betID = parseInt(betID)

    const Info = await BDB.findOne({
      where: {
        id: betID
      }
    });
    return new Promise(async (resolve, error) => {
      if (Info) {
        if (Info.closed === 1) {
          return resolve('Bet is already closed')
        }

        const Info2 = await BDB.update({
          closed: 1
        }, {
          where: {
            id: betID
          }
        });
        return resolve({
          bID: betID,
          bSide: Info.bSide,
          balance: Info.balance,
        })

      } else {
        return resolve('No record of this bet ID in database!')
      }
    })
  },

  openBet: function(betID) {
    return dbQueue.addToQueue({
      "value": this._openBet.bind(this),
      "args": [betID]
    });
  },

  _openBet: async function(betID) {
    if (!betID) throw new Error('openBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('openBet function parameter betID needs to be a number!')
    betID = parseInt(betID)

    const Info = await BDB.findOne({
      where: {
        id: betID
      }
    });
    return new Promise(async (resolve, error) => {
      if (Info) {
        if (Info.closed === 0) {
          return resolve('Bet is already open')
        }
        const Info2 = await BDB.update({
          closed: 0
        }, {
          where: {
            id: betID
          }
        });
        return resolve({
          bID: betID,
          bSide: Info2.bSide,
          balance: Info2.balance,
        })
      } else {
        return resolve('No record of this bet ID in database!')
      }
    });
  },

  fetchBet: function(betID) {
    return dbQueue.addToQueue({
      "value": this._fetchBet.bind(this),
      "args": [betID]
    });
  },

  _fetchBet: async function(betID) {
    if (!betID) throw new Error('fetchBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('fetchBet function parameter betID needs to be a number!')
    betID = parseInt(betID)
    return new Promise(async (resolve, error) => {

      const Info = await BDB.findOne({
        where: {
          id: betID
        }
      });
      if (Info) {
        return resolve({
          bID: Info.id,
          desc1: Info.desc1,
          desc2: Info.desc2,
          balance: Info.balance,
          sBal: Info.startBal,
          close: Info.closed
        })
      } else {
        return resolve('No record of this bet ID in database!')
      }

    });
  },

  fetchBetPlayers: function(betID) {
    return dbQueue.addToQueue({
      "value": this._fetchBetPlayers.bind(this),
      "args": [betID]
    });
  },

  _fetchBetPlayers: async function(betID) {
    if (!betID) throw new Error('fetchBetPlayers function is missing parameters!')
    if (!parseInt(betID)) throw new Error('fetchbBetPlayers function parameter betID needs to be a number!')
    betID = parseInt(betID)
    return new Promise(async (resolve, error) => {

      const Info = await PDB.findAll({
        where: {
          bID: betID
        }
      });
      if (Info) {
        return resolve(Info)
      } else {
        return resolve('No record of this players betting on this bet ID in database!')
      }

    });
  },

  fetchPlayerBets: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._fetchPlayerBets.bind(this),
      "args": [playerID]
    });
  },

  _fetchPlayerBets: async function(playerID) {
    if (!playerID) throw new Error('fetchPlayerBets function is missing parameters!')
    return new Promise(async (resolve, error) => {

      const Info = await PDB.findAll({
        where: {
          pID: playerID
        }
      });
      if (Info) {
        return resolve(Info)
      } else {
        return resolve('This player has not placed any bets')
      }

    });
  },

  fetchPlayerBet: function(playerID, betID) {
    return dbQueue.addToQueue({
      "value": this._fetchPlayerBet.bind(this),
      "args": [playerID, betID]
    });
  },

  _fetchPlayerBet: async function(playerID, betID) {
    if (!playerID) throw new Error('fetchPlayerBet function is missing parameters!')
    if (!betID) throw new Error('fetchPlayerBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('fetchPlayerBet function parameter betID needs to be a number!')
    betID = parseInt(betID)
    return new Promise(async (resolve, error) => {

      const Info = await PDB.findOne({
        where: {
          pID: playerID,
          bID: betID
        }
      });
      if (Info) {
        return resolve({
          bID: Info.bID,
          bSide: Info.bSide,
        })
      } else {
        return resolve('No bets on betID')
      }

    });
  },

  removeBet: function(betID) {
    return dbQueue.addToQueue({
      "value": this._removeBet.bind(this),
      "args": [betID]
    });
  },

  _removeBet: async function(betID) {
    if (!betID) throw new Error('removeBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('removeBet function parameter betID needs to be a number!')
    betID = parseInt(betID)
    return new Promise(async (resolve, error) => {

      const Info = await BDB.findOne({
        where: {
          id: betID
        }
      });
      if (Info) {
        await Info.destroy();
        return resolve('Bet removed')
      } else {
        return resolve('No record of this bet id in database!')
      }

    });
  },

  removePlayerBet: function(playerID, betID) {
    return dbQueue.addToQueue({
      "value": this._removePlayerBet.bind(this),
      "args": [playerID, betID]
    });
  },

  _removePlayerBet: async function(playerID, betID) {
    if (!playerID) throw new Error('removeBet function is missing parameters!')
    if (!betID) throw new Error('removeBet function is missing parameters!')
    if (!parseInt(betID)) throw new Error('removeBet function parameter betID needs to be a number!')
    betID = parseInt(betID)
    return new Promise(async (resolve, error) => {

      const Info = await PDB.findOne({
        where: {
          bID: betID,
          pID: playerID
        }
      });
      if (Info) {
        await Info.destroy();
        return resolve('Bet removed')
      } else {
        return resolve('No record of this bet in database!')
      }

    });
  },

  fetchBetList: function() {
    return dbQueue.addToQueue({
      "value": this._fetchBetList.bind(this),
      "args": []
    });
  },

  _fetchBetList: async function() {
    return new Promise(async (resolve, error) => {

      const Info = await BDB.findAll();
      if (Info) {
        return resolve(Info)
      } else {
        return resolve('No bets in database!')
      }

    });
  },

  fetchArchBetList: function() {
    return dbQueue.addToQueue({
      "value": this._fetchArchBetList.bind(this),
      "args": []
    });
  },

  _fetchArchBetList: async function() {
    return new Promise(async (resolve, error) => {

      const Info = await ADB.findAll({
        order: sequelize.literal('id DESC')
      });
      if (Info) {
        return resolve(Info)
      } else {
        return resolve('No bets in database!')
      }

    });
  },

}
