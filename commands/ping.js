const Discord = require('discord.js')

module.exports = {
  name: 'ping',
  description: 'Replies with ping',
  expectedArgs: '',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' pong')
    message.reply('pong!!')

    if (parseInt(paramsCom[0])) {
      message.reply(Math.floor(Math.random()*parseInt(paramsCom[0]))+1)

    }
  },
  permissions: [],
  requiredRoles: [],
}
