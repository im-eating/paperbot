const Discord = require('discord.js')
const eco = require('../functions/economy');
const inv = require('../functions/inventory');
const leveling = require('../functions/leveling');
const prof = require('../functions/profile')
const list = require("../getJSON/shop.json")
module.exports = {
  name: 'buy',
  description: 'Buys an item from the shop',
  expectedArgs: '[itemName/itemNumber]',
  category: 'Economy',
  permissionError: '',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' buy')
    var item;
    if (paramsCom[0]) var inputItem = paramsCom[0].toLowerCase()
    if (parseInt(inputItem)) {
      item = list[parseInt(inputItem)-1]
    } else {
      for (var i=0; i<list.length;i++) {
        if (inputItem === list[i].name) {
          item = list[i];
          break;
        }
      }
      if (!item) {
        return message.reply('Not a valid item. Check p.shop to view purchasable items')
      }
    }
    var price = item.price;
    var itemName = item.name;
    if (item.subtype) {
      var itemType = item.subtype
    } else {
      var itemType = item.type;
    }
    var itemRank = item.reqRank

    //CHECKS
    var output = await eco.fetchBalance(message.author.id)
    if (!(output.balance >= price)) return message.reply('You do not own enough blanks')
    var lvlProfile = await leveling.fetch(message.author.id)
    if (itemRank > lvlProfile.level) return message.reply('Your rank is too low')

    //EXECUTE
    if (item.isItem) {
      var hasItem = await inv.fetchItem(message.author.id, itemName)
      if (hasItem.userid) return message.reply('You already own this item')
      var profile = await eco.subtractFromBalance(message.author.id, price)
      var itemInv = await inv.addItem(message.author.id, itemType, itemName)
      message.reply(`Successfully purchased ${itemInv.name}! You now own ${profile.newbalance} blanks.`);
    } else {
      switch (item.id) {
        case 'badges':
          var profile = await prof.fetchProfile(message.author.id)
          if (profile.badgeLimit >= 6) return message.reply('You are only allowed a limit of 6 badges');
          var limit = profile.badgeLimit + 1
          var balProfile = await eco.subtractFromBalance(message.author.id, price)
          var profUpdate = await prof.updateField(message.author.id, item.id, limit)
          message.reply(`Successfully purchased ${item.name}! You now own ${balProfile.newbalance} blanks.`);
        break;
        case 'subheader':
          var balProfile = await eco.subtractFromBalance(message.author.id, price)
          message.reply(`Successfully purchased ${item.name}! You now own ${balProfile.newbalance} blanks\nPlease enter your new author name within the next five minutes`);
          const filter = m => m.author.id === message.author.id

          const respond = message.channel.createMessageCollector(filter, { time: 300000 });

          respond.on('collect', async m => {
            var profUpdate = await prof.updateField(message.author.id, item.id, m.content)
            message.reply(`Successfully set ${message.author.tag}\'s subheader to ${m.content}`)
            respond.stop()
          })
        break;
      }
    }
  },
  permissions: [],
  requiredRoles: [],
}
