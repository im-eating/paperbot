const Discord = require('discord.js')
const eco = require('../functions/economy');
const inv = require('../functions/inventory');
const leveling = require('../functions/leveling');
const list = require('../getJSON/crates.json');
const prizeList = require('../getJSON/prizes.json');
const dailyStats = require('../functions/stats')
module.exports = {
  name: 'opencrate',
  description: 'Opens an owned crate',
  expectedArgs: '[itemName]',
  category: 'Inventory',
  permissionError: 'no',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' opencrate')
    var item = await inv.fetchItem(message.author.id, paramsCom[0])
    if (!item.userid) return message.reply('You do not own an item with this name')
    if (item.type != 'crate') return message.reply('This item is not a crate')

    for (var i=0;i<list.length;i++) {
      if (paramsCom[0] === list[i].name) {
        var crate = list[i];
        break;
      }
    }
    //give prizes
    dailyStats.updateStat(message.author.id, 'opencrate', 1)
    for (var j=0;j<crate.contents.length;j++) {
      var min = crate.contents[j][1]
      var max = crate.contents[j][2]
      var chances = crate.contents[j][3]
      var result = Math.random()
      var chance = result < chances
      console.log("chance: " + chances)
      console.log("result: " + result)
      if (chance) {
        var amount = Math.floor(Math.random() * ((max - min) + 1) + min);
        console.log("amount: " + amount)
        switch (crate.contents[j][0]) {
          case "blanks":
            var profile = await eco.addToBalance(message.author.id, amount)
            await dailyStats.updateStat(message.author.id, 'blankcount', amount)
            message.reply(`You have earned ${amount} blanks and now own ${profile.newbalance} blanks.`);
          break;
          case "item":
            var prizes = []
            for (var k=0;k<prizeList.length;k++) {
              if (prizeList[k].series === crate.series) {
                if (prizeList[k].tier <= crate.tier) {
                  prizes.push(prizeList[k])
                  if (prizeList[k].tier === crate.tier) {
                    prizes.push(prizeList[k])
                  }
                }
              }
            }
            var prizeInt = Math.floor(Math.random() * prizes.length)
            var prize = prizes[prizeInt]
            console.log(prize)
            var hasItem = await inv.fetchItem(message.author.id, prize.name)
            if (hasItem.userid) {
              var profile3 = await eco.addToBalance(message.author.id, 500)
              message.reply(`You already own ${prize.name} so you have recieved 500 blanks. You now own ${profile3.newbalance} blanks.`);
              await dailyStats.updateStat(message.author.id, 'blankcount', 500)
            } else {
              var itemInv = await inv.addItem(message.author.id, prize.type, prize.name)
              message.reply(`You found ${prize.name}!`);
            }
          break;
          case "bonus":
            var bonusChance = Math.random()
            var bonusblanks;
            var bonuscrate1;
            var bonuscrate2;
            var bonuscrate3;
            if (crate.tier === 1) {
              bonusblanks = 5
              bonuscrate1 = 'common crate'
              bonuscrate2 = 'common crate'
              bonuscrate3 = 'uncommon crate'
            }
            if (crate.tier === 2) {
              bonusblanks = 20
              bonuscrate1 = 'common crate'
              bonuscrate2 = 'uncommon crate'
              bonuscrate3 = 'rare crate'
            }
            if (crate.tier === 3) {
              bonusblanks = 50
              bonuscrate1 = 'uncommon crate'
              bonuscrate2 = 'rare crate'
              bonuscrate3 = 'rare crate'
            }
            var cchance1 = 0.5
            var cchance2 = 0.16
            var cchance3 = 0.04
            var iType = 'crate'
            if (bonusChance < cchance3) {
              var itemInv = await inv.addItem(message.author.id, iType, bonuscrate3)
              message.reply(`You found a bonus ${bonuscrate3}`)
              await dailyStats.updateStat(message.author.id, 'findcrate', 1)
            } else if (bonusChance < cchance2) {
              var itemInv = await inv.addItem(message.author.id, iType, bonuscrate2)
              message.reply(`You found a bonus ${bonuscrate2}`)
              await dailyStats.updateStat(message.author.id, 'findcrate', 1)
            } else if (bonusChance < cchance1) {
              var itemInv = await inv.addItem(message.author.id, iType, bonuscrate1)
              message.reply(`You found a bonus ${bonuscrate1}`)
              await dailyStats.updateStat(message.author.id, 'findcrate', 1)
            } else {
              var profile = await eco.addToBalance(message.author.id, bonusblanks)
              message.reply(`You found a bonus ${bonusblanks} blanks`)
              await dailyStats.updateStat(message.author.id, 'blankcount', bonusblanks)
            }
          break;
          default:
            return message.reply("Error: bad content name type")
          break;
        }
      }
    }

    var eItem = await inv.removeItem(message.author.id, paramsCom[0])

  },
  permissions: [],
  requiredRoles: [],
}
