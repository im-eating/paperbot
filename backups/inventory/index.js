const Sequelize = require('sequelize');
const queuing = require("./queue.js");
const dbQueue = new queuing();

const sequelize = new Sequelize('database', 'Inv123', '1324354657687980000', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: 'database.sqlite',
});

const IDB = sequelize.define('Inventory', {
  pID: Sequelize.STRING,
  type: Sequelize.STRING,
  name: Sequelize.STRING,
  equip: Sequelize.INTEGER,
  quantity: Sequelize.INTEGER
});


IDB.sync()

console.log('\x1b[32m%s\x1b[0m', `Inv DB loaded`);

module.exports = {

  addItem: function(playerID, itemType, itemName, quantity) {
    return dbQueue.addToQueue({
      "value": this._addItem.bind(this),
      "args": [playerID, itemType, itemName, quantity]
    });
  },

  _addItem: async function(playerID, itemType, itemName, quantity) {
    if (!playerID) throw new Error('addItem function is missing parameters!')
    if (!itemType) throw new Error('addItem function is missing parameters!')
    if (!itemName) throw new Error('addItem function is missing parameters!')
    if (!quantity) {
      var quantity = 1
    } else {
      quantity = parseInt(quantity)
    }
    return new Promise(async (resolve, error) => {
      const Info = await IDB.findOne({
        where: {
          pID: playerID,
          name: itemName
        }
      });
      if (Info) {
        const Info3 = await IDB.update({
          quantity: Info.quantity + quantity
        }, {
          where: {
            pID: playerID,
            name: itemName
          }
        });
        return resolve({
          pID: playerID,
          type: itemType,
          name: itemName,
          equip: 0,
          quantity: 1
        })
      }
      const Info2 = await IDB.create({
        pID: playerID,
        type: itemType,
        name: itemName,
        equip: 0,
        quantity: quantity
      });
      return resolve({
        pID: playerID,
        type: itemType,
        name: itemName,
        equip: 0,
        quantity: quantity
      })
    });
  },

  fetchItem: function(playerID, itemName) {
    return dbQueue.addToQueue({
      "value": this._fetchItem.bind(this),
      "args": [playerID, itemName]
    });
  },

  _fetchItem: async function(playerID, itemName) {
    if (!playerID) throw new Error('fetchItem function is missing parameters!')
    if (!itemName) throw new Error('fetchItem function is missing parameters!')
    return new Promise(async (resolve, error) => {
      const Info = await IDB.findOne({
        where: {
          pID: playerID,
          name: itemName
        }
      });
      if (Info) {

        return resolve({
          pID: Info.pID,
          type: Info.type,
          name: Info.name,
          equip: Info.equip,
          quantity: Info.quantity
        })
      } else {
        return resolve('No record of this item in database!')
      }

    });
  },

  fetchInv: function(playerID) {
    return dbQueue.addToQueue({
      "value": this._fetchInv.bind(this),
      "args": [playerID]
    });
  },

  _fetchInv: async function(playerID) {
    if (!playerID) throw new Error('fetchInv function is missing parameters!')

    return new Promise(async (resolve, error) => {

      const Info = await IDB.findAll({
        where: {
          pID: playerID
        }
      });
      if (Info) {
        return resolve(Info)
      } else {
        return resolve('Player has no items')
      }

    });
  },

  equipItem: function(playerID, itemName) {
    return dbQueue.addToQueue({
      "value": this._equipItem.bind(this),
      "args": [playerID, itemName]
    });
  },

  _equipItem: async function(playerID, itemName) {
    if (!playerID) throw new Error('equipItem function is missing parameters!')
    if (!itemName) throw new Error('equipItem function is missing parameters!')

    const Info = await IDB.findOne({
      where: {
        pID: playerID,
        name: itemName
      }
    });
    return new Promise(async (resolve, error) => {
      if (Info) {

        if (Info.equip === 1) {
          return resolve('Item is already equipped')
        }
        const Info2 = await IDB.update({
          equip: 1
        }, {
          where: {
            pID: playerID,
            name: itemName
          }
        });
        return resolve({
          name: itemName,
          type: Info.type,
          equip: Info.equip,
        })
      } else {
        return resolve('No record of this item in database!')
      }
    });
  },

  unequipItem: function(playerID, itemName) {
    return dbQueue.addToQueue({
      "value": this._unequipItem.bind(this),
      "args": [playerID, itemName]
    });
  },

  _unequipItem: async function(playerID, itemName) {
    if (!playerID) throw new Error('unequipItem function is missing parameters!')
    if (!itemName) throw new Error('unequipItem function is missing parameters!')

    const Info = await IDB.findOne({
      where: {
        pID: playerID,
        name: itemName
      }
    });
    return new Promise(async (resolve, error) => {
      if (Info) {
        if (Info.equip === 0) {
          return resolve('Item is already unequipped')
        }
        const Info2 = await IDB.update({
          equip: 0
        }, {
          where: {
            pID: playerID,
            name: itemName
          }
        });
        return resolve({
          name: itemName,
          type: Info.type,
          equip: Info.equip,
        })
      } else {
        return resolve('No record of this item in database!')
      }
    });
  },

  removeItem: function(playerID, itemName) {
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
  },

}
