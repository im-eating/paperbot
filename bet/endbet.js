const Discord = require('discord.js')
const bet = require('betting')
const eco = require('discord-economy');
module.exports = {
  name: 'endbet',
  description: 'Ends a bet',
  expectedArgs: '[betID], [winningSide]',
  category: 'Betting',
  permissionError: 'no',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' endbet');
    if (!paramsCom[1] === '1' || !paramsCom[1] === '2') return message.reply('Error: Winning bet side must be 1 or 2')
    if (!parseInt(paramsCom[0])) return message.reply('Error: BetID has to be a number')
    var parseBetSide = parseInt(paramsCom[1])
    var output = await bet.fetchBetPlayers(paramsCom[0])
    var betPool = await bet.fetchBet(paramsCom[0])
    if (!betPool.bID) return message.reply('BetID does not exist')

    var betBal = betPool.balance
    var winners = []

    for (var i=0;i<output.length;i++) {//iterates through all players who have bet on the betID
      if (output[i].dataValues.bSide === parseBetSide) { //if they won
        winners.push(output[i])
      }
    }

    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Bet Ended!',
    fields: [
      {
        name: 'Details:',
        value: `id: **${betPool.bID}**\n1: ${betPool.desc1}\n2: ${betPool.desc2}`,
      },
    ],
    }})
    var winBal = 0;
    for (var i=0;i<winners.length;i++) {//iterates through all players who have won the bet
      var curBal = winners[i].dataValues.balance
      winBal = winBal + curBal
    }
    for (var i=0;i<winners.length;i++) {//iterates through all players who have won the bet
      var winnings = betBal*(winners[i].dataValues.balance / winBal) //pool divided by number of winners
      var profile = await eco.AddToBalance(winners[i].dataValues.pID, winnings)
      message.channel.send(`<@${winners[i].dataValues.pID}>, you have won ${Math.floor(winnings)} blanks!`)
    }

    bet.createArchBet(betPool.bID, betPool.desc1, betPool.desc2, betPool.balance, paramsCom[1])

    for (var i=0;i<output.length;i++) {//iterates through all players who have bet on the betID
      bet.removePlayerBet(output[i].dataValues.pID, paramsCom[0]) //destroys the player bets
    }

    bet.removeBet(paramsCom[0])

    return;
  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],
}
