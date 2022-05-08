const Discord = require('discord.js')
const eco = require("../functions/economy")
//Provides the description for p.addblanks
module.exports = {
  name: 'addblanks',
  description: 'Adds blanks to a mentioned user\'s balance',
  expectedArgs: '[user], [amount]',
  category: 'Economy',
  permissionError: 'no',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' addblanks')
    if (!message.mentions.users.first()) return message.reply('User not mentioned')
    if (!parseInt(paramsCom[1])) return message.reply('Amount needs to be a number!')
    var profile = await eco.addToBalance(message.mentions.users.first().id, paramsCom[1])
    message.reply(`${message.mentions.users.first().tag} now owns ${profile.newbalance} blanks.`);
    return;
  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],
}
