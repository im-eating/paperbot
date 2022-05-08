const Discord = require('discord.js')
const leveling = require('../functions/leveling');
const leveling2 = require('../functions/leveling2');

module.exports = {
  name: 'rankings',
  description: 'Shows the top 5 highest level users',
  expectedArgs: '',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom, client) => {
    console.log(message.author.tag + ' rankings');
    if (paramsCom[0]) {
      if (paramsCom[0] == 'season') {
        var output = await leveling2.leaderboard(true, message.author.id)
        var authorProfile = await leveling2.fetch(message.author.id)
        var authorLvl = authorProfile.lvl
        var leaderboard = await leveling2.leaderboard(false, message.author.id)
        if (leaderboard.users[0]) {
          var first = await client.users.fetch(leaderboard.users[0].id)
          var firstplace = first.tag
          var firstlvl = leaderboard.users[0].level
        } else {
          var firstplace = 'Nobody Yet'
          var firstlvl = 'None'
        }
        if (leaderboard.users[1]) {
          var second = await client.users.fetch(leaderboard.users[1].id)
          var secondplace = second.tag
          var secondlvl = leaderboard.users[1].level
        } else {
          var secondplace = 'Nobody Yet'
          var secondlvl = 'None'
        }
        if (leaderboard.users[2]) {
          var third = await client.users.fetch(leaderboard.users[2].id)
          var thirdplace = third.tag
          var thirdlvl = leaderboard.users[2].level
        } else {
          var thirdplace = 'Nobody Yet'
          var thirdlvl = 'None'
        }
        if (leaderboard.users[3]) {
          var fourth = await client.users.fetch(leaderboard.users[3].id)
          var fourthplace = fourth.tag
          var fourthlvl = leaderboard.users[3].level
        } else {
          var fourthplace = 'Nobody Yet'
          var fourthlvl = 'None'
        }
        if (leaderboard.users[4]) {
          var fifth = await client.users.fetch(leaderboard.users[4].id)
          var fifthplace = fifth.tag
          var fifthlvl = leaderboard.users[4].level
        } else {
          var fifthplace = 'Nobody Yet'
          var fifthlvl = 'None'
        }

          message.channel.send({embed: {
          color: 0x7a19a8,
          title: 'Blanks Leaderboard',
          description: `1. ${firstplace} - Level ${firstlvl}
                        2. ${secondplace} - Level ${secondlvl}
                        3. ${thirdplace} - Level ${thirdlvl}
                        4. ${fourthplace} - Level ${fourthlvl}
                        5. ${fifthplace} - Level ${fifthlvl}

                        ${output.place}. ${message.author.tag} - Level ${authorLvl}`,
          }})
          return;
      }

    }
    var output = await leveling.leaderboard(true, message.author.id)
    var authorProfile = await leveling.fetch(message.author.id)
    var authorLvl = authorProfile.lvl
    var leaderboard = await leveling.leaderboard(false, message.author.id)
    if (leaderboard.users[0]) {
      var first = await client.users.fetch(leaderboard.users[0].id)
      var firstplace = first.tag
      var firstlvl = leaderboard.users[0].level
    } else {
      var firstplace = 'Nobody Yet'
      var firstlvl = 'None'
    }
    if (leaderboard.users[1]) {
      var second = await client.users.fetch(leaderboard.users[1].id)
      var secondplace = second.tag
      var secondlvl = leaderboard.users[1].level
    } else {
      var secondplace = 'Nobody Yet'
      var secondlvl = 'None'
    }
    if (leaderboard.users[2]) {
      var third = await client.users.fetch(leaderboard.users[2].id)
      var thirdplace = third.tag
      var thirdlvl = leaderboard.users[2].level
    } else {
      var thirdplace = 'Nobody Yet'
      var thirdlvl = 'None'
    }
    if (leaderboard.users[3]) {
      var fourth = await client.users.fetch(leaderboard.users[3].id)
      var fourthplace = fourth.tag
      var fourthlvl = leaderboard.users[3].level
    } else {
      var fourthplace = 'Nobody Yet'
      var fourthlvl = 'None'
    }
    if (leaderboard.users[4]) {
      var fifth = await client.users.fetch(leaderboard.users[4].id)
      var fifthplace = fifth.tag
      var fifthlvl = leaderboard.users[4].level
    } else {
      var fifthplace = 'Nobody Yet'
      var fifthlvl = 'None'
    }

    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Blanks Leaderboard',
    description: `1. ${firstplace} - Level ${firstlvl}
                  2. ${secondplace} - Level ${secondlvl}
                  3. ${thirdplace} - Level ${thirdlvl}
                  4. ${fourthplace} - Level ${fourthlvl}
                  5. ${fifthplace} - Level ${fifthlvl}

                  ${output.place}. ${message.author.tag} - Level ${authorLvl}`,
    }})
  },
  permissions: [],
  requiredRoles: [],
}
