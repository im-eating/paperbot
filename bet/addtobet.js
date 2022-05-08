const Discord = require('discord.js')
const bet = require('betting')
const eco = require('discord-economy');
module.exports = {
  name: 'addtobet',
  description: 'Adds to a bet',
  expectedArgs: '[betID], [betAmount]',
  category: 'Betting',
  permissionError: '',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' addtobet')
    if (!parseInt(paramsCom[0])) return message.reply('Error: BetID has to be a number')
    if (!parseInt(paramsCom[1])) return message.reply('Error: Blank amount has to be a number')
    var playerBal = await eco.FetchBalance(message.author.id)
    if (playerBal.balance < parseInt(paramsCom[1])) {
      message.reply('Error: You do not have enough blanks')
    }
    var betted = await bet.fetchBet(paramsCom[0])
    if (!betted) return message.reply('This BetID does not exist')

    if (betted.close === 1) return message.reply('Error: Bet is closed')
    var pbetted = await bet.fetchPlayerBet(message.author.id, paramsCom[0])
    if (!pbetted) return message.reply('This bet does not exist')

    if (!pbetted.bID) return message.reply("Error: No betID exists or user has already bet")
    var output = await bet.addToPlayerBet(paramsCom[0], message.author.id, paramsCom[1])


    var profile = await eco.SubtractFromBalance(message.author.id, paramsCom[1])
    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Bet Placed!',
    fields: [
      {
        name: 'Details:',
        value: `id: **${output.bID}**\nAmount: ${output.bAmount}\nTotal Amount Bet: ${output.newbAmount}\nCurrent pool: ${output.newbalance}`,
      },
    ],
    }})
  },
  permissions: [],
  requiredRoles: [],
}
