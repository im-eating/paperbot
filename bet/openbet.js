const Discord = require('discord.js')
const bet = require('betting')
const eco = require('discord-economy');
module.exports = {
  name: 'openbet',
  description: 'Opens a bet',
  expectedArgs: '[betID]',
  category: 'Betting',
  permissionError: '',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' openbet');
    if (!parseInt(paramsCom[0])) return message.reply('BetID needs to be a number!')

    var betted = await bet.fetchBet(paramsCom[0])
    if (!betted.bID) return message.reply('Error: Bet ID does not exist')
    if (betted.close === 0) return message.reply('Error: Bet is already open')


    await message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Bet Reopen Pending',
    description: 'Waiting for another user to confirm (10 minutes)',
    fields: [
      {
        name: 'Details:',
        value: `id: **${betted.bID}**\nCurrent pool: ${betted.balance}`,
      },
    ],
    }})
    await message.channel.messages.fetch({ limit: 1 }).then(async messages => {
      var messageN = await messages.first();
      const filter = (reaction, user) => reaction.emoji.name === '👍' && user.id !== message.author.id;

      messageN.react('👍')
      messageN.awaitReactions(filter, { max: 2, time: 600000, errors: ['time'] })
        .then(collected => {
          var output = bet.openBet(paramsCom[0])
          message.channel.send({embed: {
            color: 0x7a19a8,
            title: 'Bet Reopened',
            fields: [
              {
                name: 'Details:',
                value: `id: **${betted.bID}**\nCurrent pool: ${betted.balance}`,
              },
            ],
          }})
        })
        .catch(collected => {
          message.channel.send('Not reacted in time')
        });

    })
  },
  permissions: [],
  requiredRoles: [],

}
