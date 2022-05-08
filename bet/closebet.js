const Discord = require('discord.js')
const bet = require('betting')
const eco = require('discord-economy');
module.exports = {
  name: 'closebet',
  description: 'Closes a bet',
  expectedArgs: '[betID]',
  category: 'Betting',
  permissionError: '',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' closebet');
    if (!parseInt(paramsCom[0])) return message.reply('BetID needs to be a number!')

    var betted = await bet.fetchBet(paramsCom[0])
    if (!betted.bID) return message.reply('Error: Bet ID does not exist')
    if (betted.close === 1) return message.reply('Error: Bet is already closed')

    var output = await bet.closeBet(paramsCom[0])

    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Bet Closed!',
    fields: [
      {
        name: 'Details:',
        value: `id: **${output.bID}**\nCurrent pool: ${output.balance}`,
      },
    ],
    }})
  },
  permissions: [],
  requiredRoles: [],

}
