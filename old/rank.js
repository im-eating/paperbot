const Discord = require('discord.js')
const leveling = require('discord-leveling');
module.exports = {
  name: 'rank',
  description: 'Replies with you or a mentioned user\'s rank',
  expectedArgs: '[user[optional]]',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' rank')
    if (!message.mentions.users.first()) {
      var user = message.author
    } else {
      var user = message.mentions.users.first()
    }


    var output = await leveling.Fetch(user.id)
    if (message.mentions.users.first()) return message.reply(`${message.mentions.users.first().tag} is rank ${output.level}!`);
    message.reply(`You are rank ${output.level}!`);
  },
  permissions: [],
  requiredRoles: [],

}
