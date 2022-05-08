const Discord = require('discord.js')
const eco = require('../functions/economy');

module.exports = {
  name: 'setblanks',
  description: 'Sets a mentioned user\'s balance',
  expectedArgs: '[user], [amount]',
  category: 'Economy',
  permissionError: 'no',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' setblanks');
    if (!message.mentions.users.first()) return message.reply('Error: No user mentioned')
    if (!parseInt(paramsCom[1])) return message.reply('Amount needs to be a number!')
    if (paramsCom[1] < '1') return message.reply('Amount specified is too low')
    var profile = await eco.setBalance(message.mentions.users.first().id, paramsCom[1])
    message.reply(`${message.mentions.users.first().tag} now owns ${profile.newbalance} blanks.`);
    return;
  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],
}
