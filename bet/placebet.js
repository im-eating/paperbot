const Discord = require('discord.js')
const bet = require('betting')
const eco = require('discord-economy');
module.exports = {
  name: 'placebet',
  description: 'Places a bet',
  expectedArgs: '[betID], [betSide], [betAmount]',
  category: 'Betting',
  permissionError: '',
  minArgs: 3,
  maxArgs: 3,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' placebet');
    if (!paramsCom[1] === '1' || !paramsCom[1] === '2') return message.reply('Error: Bet side must be 1 or 2')
    if (!parseInt(paramsCom[0])) return message.reply('BetID needs to be a number!')
    if (!parseInt(paramsCom[2])) return message.reply('Bet amount needs to be a number!')
    var betted = await bet.fetchBet(paramsCom[0])
    if (!betted.bID) return message.reply('This BetID does not exist')

    if (betted.close === 1) return message.reply('Error: Bet is closed')

    if (parseInt(paramsCom[2]) < betted.sBal) {
      return message.reply('Error: Bet must be at or greater than minumum bet')
    }
    var pbetted = await bet.fetchPlayerBet(message.author.id, paramsCom[0])

    if (pbetted.bID) return message.reply("Error: User has already bet")

    var output = await bet.addPlayerBet(paramsCom[0], message.author.id, paramsCom[1], paramsCom[2])
    if (!output.bID) {
      message.reply("Error: No betID exists or user has already bet")
    }

    var profile = await eco.SubtractFromBalance(message.author.id, paramsCom[2])
    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Bet Placed!',
    fields: [
      {
        name: 'Details:',
        value: `id: **${output.bID}**\nAmount: ${output.bAmount}\nCurrent pool: ${output.newbalance}`,
      },
    ],
    }})
  },
  permissions: [],
  requiredRoles: [],
}
