const Discord = require('discord.js')
const eco = require('../functions/economy');

module.exports = {
  name: 'leaderboard',
  description: 'Shows the top 5 most rich users',
  expectedArgs: '',
  category: 'Economy',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom, client) => {
    console.log(message.author.tag + ' leaderboard');
    var output = await eco.leaderboard(true, message.author.id)
    var authorBal = await eco.fetchBalance(message.author.id)
    var leaderboard = await eco.leaderboard(false, message.author.id)
    if (leaderboard.users[0]) {
      var first = await client.users.fetch(leaderboard.users[0].id)
      var firstplace = first.tag
      var firstbalance = leaderboard.users[0].balance
    } else {
      var firstplace = 'Nobody Yet'
      var firstbalance = 'None'
    }
    if (leaderboard.users[1]) {
      var second = await client.users.fetch(leaderboard.users[1].id)
      var secondplace = second.tag
      var secondbalance = leaderboard.users[1].balance
    } else {
      var secondplace = 'Nobody Yet'
      var secondbalance = 'None'
    }
    if (leaderboard.users[2]) {
      var third = await client.users.fetch(leaderboard.users[2].id)
      var thirdplace = third.tag
      var thirdbalance = leaderboard.users[2].balance
    } else {
      var thirdplace = 'Nobody Yet'
      var thirdbalance = 'None'
    }
    if (leaderboard.users[3]) {
      var fourth = await client.users.fetch(leaderboard.users[3].id)
      var fourthplace = fourth.tag
      var fourthbalance = leaderboard.users[3].balance
    } else {
      var fourthplace = 'Nobody Yet'
      var fourthbalance = 'None'
    }
    if (leaderboard.users[4]) {
      var fifth = await client.users.fetch(leaderboard.users[4].id)
      var fifthplace = fifth.tag
      var fifthbalance = leaderboard.users[4].balance
    } else {
      var fifthplace = 'Nobody Yet'
      var fifthbalance = 'None'
    }

      message.channel.send({embed: {
      color: 0x7a19a8,
      title: 'Blanks Leaderboard',
      description: `1. ${firstplace} - ${firstbalance} Blanks
                    2. ${secondplace} - ${secondbalance} Blanks
                    3. ${thirdplace} - ${thirdbalance} Blanks
                    4. ${fourthplace} - ${fourthbalance} Blanks
                    5. ${fifthplace} - ${fifthbalance} Blanks

                    ${output.place}. ${message.author.tag} - ${authorBal.balance} Blanks`,
      }})
  },
  permissions: [],
  requiredRoles: [],
}
