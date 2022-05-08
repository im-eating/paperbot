const Discord = require('discord.js')
const inv = require('../functions/inventory')
const validItems = require('../getJSON/validItems.json')
module.exports = {
  name: 'additem',
  description: 'Adds an item to a specified user\'s inventory',
  expectedArgs: '[player], [itemName], [quantity]',
  category: 'Inventory',
  permissionError: 'no',
  minArgs: 2,
  maxArgs: 3,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' addItem')
    var itemName = paramsCom[1]
    if (!message.mentions.users.first()) return message.reply('User not mentioned')
    var isItem = false
    for (var i=0;i<validItems.length;i++) {
      if (validItems[i].name === itemName) {
        isItem = true
        var itemType = validItems[i].type
        break;
      }
    }
    if (!isItem) return message.reply('Item is not valid')
    var hasItem = await inv.fetchItem(message.mentions.users.first().id, itemName)
    if (hasItem.userid) message.reply('This player already owns this item. Adding another one to their inventory')
    if (!paramsCom[2]) {
      var quantity = 1
    } else {
      var quantity = paramsCom[2]
    }
    var itemInv = await inv.addItem(message.mentions.users.first().id, itemType, itemName, quantity)
    message.reply(`Successfully added ${itemInv.name} to ${message.mentions.users.first().tag}`);
  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],
}
