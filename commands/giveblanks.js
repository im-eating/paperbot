const Discord = require('discord.js')
const eco = require('../functions/economy');

module.exports = {
  name: 'giveblanks',
  description: 'Sends blanks from you to a mentioned user',
  expectedArgs: '[user], [amount]',
  category: 'Economy',
  permissionError: '',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' give');
    if (!message.mentions.users.first()) return message.reply('Error: No user mentioned')
    if (!parseInt(paramsCom[1])) return message.reply('Amount is not a number')
    if (parseInt(paramsCom[1]) < '1') return message.reply('Amount specified is too low')
    if (message.mentions.users.first().id === message.author.id) return message.reply('You cannot give blanks to yourself')
    var output = await eco.fetchBalance(message.author.id)
    if (output.balance < paramsCom[1]) return message.reply('You do not have enough blanks!')

    var receive = await eco.addToBalance(message.mentions.users.first().id, paramsCom[1])
    var give = await eco.subtractFromBalance(message.author.id, paramsCom[1])
    message.reply(`Sent successfully!\n${message.author.tag} now owns ${give.newbalance} blanks\n${message.mentions.users.first().tag} now owns ${receive.newbalance} blanks`);
    return;
  },
  permissions: [],
  requiredRoles: [],
}
