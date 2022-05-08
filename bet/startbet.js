const Discord = require('discord.js')
const bet = require('betting')

module.exports = {
  name: 'startbet',
  description: 'Starts a new bet',
  expectedArgs: '[minimumBalance], [description1], [description2]',
  category: 'Betting',
  permissionError: '',
  minArgs: 3,
  maxArgs: 3,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' startbet');
    if (!parseInt(paramsCom[0])) return message.reply('Minimum balance needs to be a number!')
    var output = await bet.createBet(paramsCom[1], paramsCom[2], paramsCom[0])
    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Bet Created!',
    fields: [
      {
        name: 'Details:',
        value: `id: **${output.bID}**\n1: ${output.desc1}\n2: ${output.desc2}\nMinimum bet: ${output.sBal}`,
      },
      {
        name: 'Betting',
        value: `p.placebet ${output.bID}, 1, [amount] to bet on ${output.desc1}\np.placebet ${output.bID}, 2, [amount] to bet on ${output.desc2}`,
      },
    ],
    }})
  },
  permissions: [],
  requiredRoles: [],
}
