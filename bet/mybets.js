const Discord = require('discord.js')
const bet = require('betting')
module.exports = {
  name: 'mybets',
  description: 'Shows your bets',
  expectedArgs: '',
  category: 'Betting',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' mybets');
    var user = message.author
    var output = await bet.fetchPlayerBets(user.id);
    var betList = [];
    for (var i=0; i<output.length; i++) {
      betList.push('betID:')
      betList.push(output[i].dataValues.bID)
      betList.push('| Amount:')
      betList.push(output[i].dataValues.balance)
      betList.push('| Side:')
      betList.push(output[i].dataValues.bSide)
      betList.push('\n\n')
    }

    var bets = betList.join(" ");
    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Your bets',
    description: bets,
    }})
  },
  permissions: [],
  requiredRoles: [],
}
