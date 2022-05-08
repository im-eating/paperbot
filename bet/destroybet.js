const Discord = require('discord.js')
const bet = require('betting')
const eco = require('discord-economy');

module.exports = {
  name: 'destroybet',
  description: 'Destroys a bet',
  expectedArgs: '[betID]',
  category: 'Betting',
  permissionError: 'no',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' destroybet');
    if (!parseInt(paramsCom[0])) return message.reply('BetID needs to be a number!')
    var output = await bet.fetchBetPlayers(paramsCom[0])
    var betPool = await bet.fetchBet(paramsCom[0])
    if (!betPool.bID) {
      return message.reply('BetID does not exist')
    }

    for (var i=0;i<output.length;i++) {//iterates through all players who have bet on the betID
      eco.AddToBalance(output[i].dataValues.pID, output[i].dataValues.balance)
      message.channel.send(`<@${output[i].dataValues.pID}>, you have gained back ${output[i].dataValues.balance} blanks from a stopped bet!`)
    }

    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Bet Stopped!',
    fields: [
      {
        name: 'Details:',
        value: `id: **${betPool.bID}**\n1: ${betPool.desc1}\n2: ${betPool.desc2}`,
      },
    ],
    }})

    for (var i=0;i<output.length;i++) {//iterates through all players who have bet on the betID
      bet.removePlayerBet(output[i].dataValues.pID, paramsCom[0]) //destroys the player bets
    }
    bet.removeBet(paramsCom[0]);
  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],

}
