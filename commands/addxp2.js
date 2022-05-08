const Discord = require('discord.js')
const leveling = require('../functions/leveling2');
const eco = require('../functions/economy');
const inv = require('../functions/inventory')
module.exports = {
  name: 'addxp2',
  description: 'Adds xp to a mentioned user (seasonal)',
  expectedArgs: '[user], [amount]',
  category: '',
  permissionError: 'no',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' addxp')
    if (!message.mentions.users.first()) return message.reply('User not mentioned')
    if (!parseInt(paramsCom[1])) return message.reply('Amount needs to be a number!')
    var profile = await leveling.fetch(message.mentions.users.first().id)
    //If user xp higher than 100 add level
    if (profile.level >= 120) {
      var maxXp = 550
    } else {
      var maxXp = Math.floor((40*(Math.log(profile.level + 1))) + (3*profile.level)) + 1; //y=40ln(x+1)+3x+1
    }
    if (profile.level >= 145) {
      var money = 30
    } else {
      var money = 1 + Math.floor(profile.level/5)
    }
    var xp = parseInt(paramsCom[1])
    while (xp > 0) {
      profile = await leveling.fetch(message.mentions.users.first().id)
      var curXp = profile.xp
      console.log("current xp: " + curXp)
      xp = xp + curXp
      console.log("total xp: " + xp)
      if (profile.level >= 120) {
        var maxXp = 550
      } else {
        var maxXp = Math.floor((40*(Math.log(profile.level + 1))) + (3*profile.level)) + 1; //y=40ln(x+1)+3x+1
      }
      console.log("max xp: " + maxXp)
      if (xp > maxXp) {
        await leveling.addLevel(message.mentions.users.first().id, 1)
        await leveling.setXp(message.mentions.users.first().id, 0)
        var itemType = 'crate'
        var itemName = 'level crate'
        var itemInv = await inv.addItem(message.mentions.users.first().id, itemType, itemName)
        var profileBal = await eco.addToBalance(message.mentions.users.first().id, money)
        message.reply(`${message.mentions.users.first().tag} just ranked up and is now rank ${profile.level + 1} and has earned ${money} blanks and a level crate!`)
        xp = xp - maxXp
      } else {
        await leveling.addXp(message.mentions.users.first().id, xp)
        xp = 0;
        break;
      }
    }
    message.reply(`Successfully added ${paramsCom[1]} xp to ${message.mentions.users.first().tag}`)
    return;
  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],
}
