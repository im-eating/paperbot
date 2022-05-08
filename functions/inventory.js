const fs = require('fs')
const inv = require('../getJSON/inventory.json')

module.exports = {
  addItem: async function (playerID, itemType, itemName, quantity) {
    if (!playerID) throw new Error('addItem function is missing parameters!')
    if (!itemType) throw new Error('addItem function is missing parameters!')
    if (!itemName) throw new Error('addItem function is missing parameters!')
    if (!quantity) {
      var quantity = 1
    } else {
      quantity = parseInt(quantity)
    }
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<inv.length; i++) {
        if (inv[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //if player exists
        var hasItem = false
        var iIndex = 0
        for (var i=0; i<inv[index].inventory.length; i++) {
          if (inv[index].inventory[i].name == itemName) {
            hasItem = true
            iIndex = i
            break;
          }
        }
        if (hasItem) {
          inv[index].inventory[iIndex].quantity += quantity;
          fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
            if (err) throw err;
            console.log('done')
          })
          return resolve({
            userid: playerID,
            type: itemType,
            name: itemName,
            equip: 0,
            quantity: quantity
          })
        } else {
          inv[index].inventory.push({"type": itemType, "name": itemName, "equip": 0, "quantity": quantity})
          fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
            if (err) throw err;
            console.log('done')
          })
          return resolve({
            userid: playerID,
            type: itemType,
            name: itemName,
            equip: 0,
            quantity: quantity
          })
        }

      } else {
        //create new if player does not exist
        inv.push({"id": playerID, "inventory": [{"type": itemType, "name": itemName, "equip": 0, quantity: quantity}]})
        fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: playerID,
          type: itemType,
          name: itemName,
          equip: 0,
          quantity: quantity
        })
      }
    });
  },

  fetchItem: async function (playerID, itemName) {
    if (!playerID) throw new Error('fetchItem function is missing parameters!')
    if (!itemName) throw new Error('fetchItem function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<inv.length; i++) {
        if (inv[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //if player exists
        var hasItem = false
        var iIndex = 0
        for (var i=0; i<inv[index].inventory.length; i++) {
          if (inv[index].inventory[i].name == itemName) {
            hasItem = true
            iIndex = i
            break;
          }
        }

        if (hasItem) {
          return resolve({
            userid: playerID,
            type: inv[index].inventory[iIndex].type,
            name: itemName,
            equip: inv[index].inventory[iIndex].equip,
            quantity: inv[index].inventory[iIndex].quantity
          })
        } else {
          return resolve("Item does not exist")
        }
      } else {
        //player does not exist
        return resolve("Player does not exist")
      }
    });
  },

  fetchInv: async function (playerID) {
    if (!playerID) throw new Error('fetchInv function is missing parameters!')

    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<inv.length; i++) {
        if (inv[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        return resolve({
          userid: playerID,
          inv: inv[index].inventory
        })
      } else {
        //player does not exist
        inv.push({"id": playerID, "inventory": []})
        fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
          if (err) throw err;
          console.log('done')
        })
        return resolve({
          userid: playerID,
          inv: inv[inv.length-1].inventory
        })
      }
    });
  },

  equipItem: async function (playerID, itemName) {
    if (!playerID) throw new Error('equipItem function is missing parameters!')
    if (!itemName) throw new Error('equipItem function is missing parameters!')

    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<inv.length; i++) {
        if (inv[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //if player exists
        var hasItem = false
        var iIndex = 0
        for (var i=0; i<inv[index].inventory.length; i++) {
          if (inv[index].inventory[i].name == itemName) {
            hasItem = true
            iIndex = i
            break;
          }
        }
        if (hasItem) {
          inv[index].inventory[iIndex].equip = 1
          fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
            if (err) throw err;
            console.log('done')
          })
          return resolve({
            userid: playerID,
            type: inv[index].inventory[iIndex].type,
            name: itemName,
            equip: 1,
            quantity: inv[index].inventory[iIndex].quantity
          })
        } else {
          return resolve("Item does not exist")
        }
      } else {
        //player does not exist
        return resolve("Player does not exist")
      }
    });
  },

  unequipItem: async function (playerID, itemName) {
    if (!playerID) throw new Error('unequipItem function is missing parameters!')
    if (!itemName) throw new Error('unequipItem function is missing parameters!')

    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<inv.length; i++) {
        if (inv[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //if player exists
        var hasItem = false
        var iIndex = 0
        for (var i=0; i<inv[index].inventory.length; i++) {
          if (inv[index].inventory[i].name == itemName) {
            hasItem = true
            iIndex = i
            break;
          }
        }
        if (hasItem) {
          inv[index].inventory[iIndex].equip = 0
          fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
            if (err) throw err;
            console.log('done')
          })
          return resolve({
            userid: playerID,
            type: inv[index].inventory[iIndex].type,
            name: itemName,
            equip: 1,
            quantity: inv[index].inventory[iIndex].quantity
          })
        } else {
          return resolve("Item does not exist")
        }
      } else {
        //player does not exist
        return resolve("Player does not exist")
      }
    });
  },

  removeItem: async function (playerID, itemName) {
    if (!playerID) throw new Error('removeItem function is missing parameters!')
    if (!itemName) throw new Error('removeItem function is missing parameters!')
    return new Promise(async (resolve, error) => {
      var hasId = false
      var index = 0
      for (var i=0; i<inv.length; i++) {
        if (inv[i].id == playerID) {
          hasId = true
          index = i
          break;
        }
      }
      if (hasId) {
        //if player exists
        var hasItem = false
        var iIndex = 0
        for (var i=0; i<inv[index].inventory.length; i++) {
          if (inv[index].inventory[i].name == itemName) {
            hasItem = true
            iIndex = i
            break;
          }
        }
        if (hasItem) {
          if (inv[index].inventory[iIndex].quantity > 1) {
            inv[index].inventory[iIndex].quantity -= 1;
            fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
              if (err) throw err;
              console.log('done')
            })
            return resolve({
              userid: playerID,
              quantity: inv[index].inventory[iIndex].quantity
            })
          } else {
            inv[index].inventory.splice(iIndex, 1)
            fs.writeFile("./paperbot/getJSON/inventory.json", JSON.stringify(inv), err => {
              if (err) throw err;
              console.log('done')
            })
            return resolve({
              userid: playerID,
              quantity: 0
            })
          }

        } else {
          return resolve("Item does not exist")
        }

      } else {
        return resolve("Player does not exist")
      }
    });
  }
}
