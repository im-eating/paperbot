const Discord = require('discord.js')

module.exports = {
  name: 'addsuggestion',
  description: 'Adds a suggestion',
  expectedArgs: '[suggestion], [type]',
  category: '',
  permissionError: 'no',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom, client) => {
    console.log(message.author.tag + ' addsuggestion')
    var schannel = client.channels.cache.get('842449229040320523')
    await schannel.send(paramsCom[0])
    await schannel.messages.fetch({ limit: 1 }).then(async messages => {
      var messageN = await messages.first();
      const emoji = client.emojis.cache.get('816776283974270996')
      if (paramsCom[1] === 'yesno') {
        messageN.react('👍')
        messageN.react('👎')
      }
      if (paramsCom[1] === '3option') {
        messageN.react('1️⃣')
        messageN.react('2️⃣')
        messageN.react('3️⃣')
      }
      if (paramsCom[1] === '4option') {
        messageN.react('1️⃣')
        messageN.react('2️⃣')
        messageN.react('3️⃣')
        messageN.react('4️⃣')
      }
      messageN.react(emoji)
    })
    message.reply('Successfully created suggestion')

  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],
}
