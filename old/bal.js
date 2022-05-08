const Discord = require('discord.js')
const eco = require('discord-economy');

module.exports = {
  name: ['balance', 'bal'],
  description: 'Replies with you or a mentioned user\'s balance',
  expectedArgs: '[user(optional)]',
  category: 'Economy',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' bal');
    if(!paramsCom[0]) {
      var output = await eco.FetchBalance(message.author.id)
      message.reply(`You own ${output.balance} blanks.`);
      return;
    } else if (!message.mentions.users.first()) {
      var output = await eco.FetchBalance(message.author.id)
      message.reply(`You own ${output.balance} blanks.`);
      return;
    }
    var output = await eco.FetchBalance(message.mentions.users.first().id)
    message.reply(`${message.mentions.users.first().tag} owns ${output.balance} blanks.`);

    return;
  },
  permissions: [],
  requiredRoles: [],
}
