const Discord = require('discord.js')
const inv = require('../functions/inventory');
const list = require('../getJSON/crates.json');
const dailyStats = require('../functions/stats')

module.exports = {
  name: 'tradeup',
  description: 'trades up 5 crates for a crate of a higher rarity',
  expectedArgs: '',
  category: 'Inventory',
  permissionError: 'no',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' tradeup')
    var pProfile = await inv.fetchInv(message.author.id)
    var pInv = pProfile.inv

    if (paramsCom[0]) {
      var item = await inv.fetchItem(message.author.id, paramsCom[0])
      if (!item.userid) {
        message.reply('You do not own an item with this name')
        return;
      }
      if (item.type != 'crate') {
        message.reply('This item is not a crate')
        return;
      }
      for (var k=0;k<list.length;k++) {
        if (list[k].tradable && list[k].name === paramsCom[0]) {
          if (item.quantity >= 5) {
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            var itemName = list[k].tradefor
            var itemInv = await inv.addItem(message.author.id, 'crate', itemName, 1)
            message.reply('Trade up successful!')
            dailyStats.updateStat(message.author.id, 'tradecrate', 1)
            return;
          } else {
            message.reply('You do not have 5 of this crate')
            return;
          }
        }
      }
      message.reply('This is not a tradable crate')
      return;

    }
    var invList = [];
    for (var i=0; i<pInv.length; i++) {
      if (pInv[i].type === 'crate') {
        for (var j=0;j<list.length;j++) {
          if (list[j].name === pInv[i].name && list[j].tradable) {
            invList.push(pInv[i].name)
            invList.push(`(Tier ${list[j].tier})`)
            invList.push('| Quantity: ')
            invList.push(pInv[i].quantity)
            invList.push('\n\n')
          }
        }
      }
    }
    if (!invList[0]) return message.reply('You do not own any tradable crates')
    var inventory = invList.join(" ");
    message.channel.send({embed: {
    color: 0x7a19a8,
    title: `Respond with a crate you want to trade up`,
    description: inventory,
    }})

    const filter = m => m.author.id === message.author.id

    const respond = message.channel.createMessageCollector(filter, { time: 30000 });

    respond.on('collect', async m => {
      var item = await inv.fetchItem(message.author.id, m.content)
      if (!item.userid) {
        message.reply('You do not own an item with this name')
        respond.stop()
        return;
      }
      if (item.type != 'crate') {
        message.reply('This item is not a crate')
        respond.stop()
        return;
      }
      for (var k=0;k<list.length;k++) {
        if (list[k].tradable && list[k].name === m.content) {
          if (item.quantity >= 5) {
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            await inv.removeItem(message.author.id, item.name)
            var itemName = list[k].tradefor
            var itemInv = await inv.addItem(message.author.id, 'crate', itemName, 1)
            message.reply('Trade up successful!')
            dailyStats.updateStat(message.author.id, 'tradecrate', 1)
            respond.stop()
            return;
          } else {
            message.reply('You do not have 5 of this crate')
            respond.stop()
            return;
          }
        }
      }
      message.reply('This is not a tradable crate')
      respond.stop()
      return;
    })
  },
  permissions: [],
  requiredRoles: [],
}
