const Discord = require ('discord.js')
const fs = require('fs')
const boost = require('../getJSON/boosts.json')
module.exports = {
  name: 'responsive',
  description: 'responsive test command',
  expectedArgs: '',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' responsive');

    message.reply("hi")
    setTimeout(() => {
      message.channel.messages.cache.find(msg => msg.author.id == 801554509548879923 && msg.mentions.users.first() == message.author).delete()

    }, "2000")

  },
  permissions: [],
  requiredRoles: [],
}
