const Discord = require('discord.js')
const challenge = require('../functions/challenge')
const dailyStats = require('../functions/stats')
const challengeList = require('../getJSON/challenges.json')
const stats = require('../commands/stat-check.js')
const eco = require('../functions/economy');
const inv = require('../functions/inventory')

module.exports = {
  name: ['challenges', 'c'],
  description: 'Replies with your daily and weekly challenges',
  expectedArgs: '[start/reroll]',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' challenges')
    if (message.channel.id === '806390129022730240') return message.reply('This command does not work in this channel')
    var pChallenges = await challenge.fetchAllChallenges(message.author.id)
    //only daily challenges for now
    if (!paramsCom[0]) {
      if(pChallenges[0].id) {
        return fetchChallenges(message, message.author, pChallenges)
      } else {
        return message.reply('You have no active challenges. do [p.challenges start] to start')

      }
    } else if (paramsCom[0] === 'start') {
      if (pChallenges[0].id) {
        return message.reply('You already have challenges')
      }
      var reset = dailyStats.resetAllDailyStat(message.author.id)
      var auto = await inv.fetchItem(message.author.id, 'auto challenge activation')
      if (auto.userid) {
        if (auto.equip != 0) {
          message.reply('challenges activated!')
        }
      }
      var num1 = Math.floor(Math.random()*challengeList.length) + 1
      var num2 = Math.floor(Math.random()*challengeList.length) + 1
      var num3 = Math.floor(Math.random()*challengeList.length) + 1
      while (
        (
          (
            challengeList[num1-1].category === challengeList[num2-1].category
          ) || (
            challengeList[num1-1].category === challengeList[num3-1].category
          ) || (
            challengeList[num2-1].category === challengeList[num3-1].category
          )
        ) || (
          !(
            (challengeList[num1-1].difficulty === 'hard') || (challengeList[num1-1].difficulty === 'very hard')
          ) && !(
            (challengeList[num2-1].difficulty === 'hard') || (challengeList[num2-1].difficulty === 'very hard')
          ) && !(
            (challengeList[num3-1].difficulty === 'hard') || (challengeList[num3-1].difficulty === 'very hard')
          )
        )
      ) {
        var num1 = Math.floor(Math.random()*challengeList.length) + 1
        var num2 = Math.floor(Math.random()*challengeList.length) + 1
        var num3 = Math.floor(Math.random()*challengeList.length) + 1
      }
      var dChallenge1 = await challenge.addChallenge(message.author.id, num1, challengeList[num1-1].category)
      var dChallenge2 = await challenge.addChallenge(message.author.id, num2, challengeList[num2-1].category)
      var dChallenge3 = await challenge.addChallenge(message.author.id, num3, challengeList[num3-1].category)
      message.reply('challenges activated!')
      var pChallenges = await challenge.fetchAllChallenges(message.author.id)
      return fetchChallenges(message, message.author, pChallenges)
    } else if (paramsCom[0] === 'reroll') {

      message.reply('Rerolling costs 20 blanks. This will also reset progress on any active challenges. Confirm by typing yes')
      const filter = m => m.author.id === message.author.id

      const respond = message.channel.createMessageCollector(filter, { time: 30000 });

      respond.on('collect', async m => {
        var confirmation = m.content.toLowerCase()
        if (confirmation === 'yes') {
          await challenge.resetAllChallenges(message.author.id)
          await eco.subtractFromBalance(message.author.id, 20)
          var reset = dailyStats.resetAllActiveStat(message.author.id)
          var auto = await inv.fetchItem(message.author.id, 'auto challenge activation')
          if (auto.userid) {
            if (auto.equip != 0) {
              message.reply('challenges rerolled!')
            }
          }
          var num1 = Math.floor(Math.random()*challengeList.length) + 1
          var num2 = Math.floor(Math.random()*challengeList.length) + 1
          var num3 = Math.floor(Math.random()*challengeList.length) + 1
          while (
            (
              (
                challengeList[num1-1].category === challengeList[num2-1].category
              ) || (
                challengeList[num1-1].category === challengeList[num3-1].category
              ) || (
                challengeList[num2-1].category === challengeList[num3-1].category
              )
            ) || (
              !(
                (challengeList[num1-1].difficulty === 'hard') || (challengeList[num1-1].difficulty === 'very hard')
              ) && !(
                (challengeList[num2-1].difficulty === 'hard') || (challengeList[num2-1].difficulty === 'very hard')
              ) && !(
                (challengeList[num3-1].difficulty === 'hard') || (challengeList[num3-1].difficulty === 'very hard')
              )
            )
          ) {
            var num1 = Math.floor(Math.random()*challengeList.length) + 1
            var num2 = Math.floor(Math.random()*challengeList.length) + 1
            var num3 = Math.floor(Math.random()*challengeList.length) + 1
          }
          var dChallenge1 = await challenge.addChallenge(message.author.id, num1, challengeList[num1-1].category)
          var dChallenge2 = await challenge.addChallenge(message.author.id, num2, challengeList[num2-1].category)
          var dChallenge3 = await challenge.addChallenge(message.author.id, num3, challengeList[num3-1].category)
          message.reply('challenges rerolled!')
          respond.stop()
          var pChallenges = await challenge.fetchAllChallenges(message.author.id)
          return fetchChallenges(message, message.author, pChallenges)
        } else {
          respond.stop()
          return;
        }
      })
    }
  },
  permissions: [],
  requiredRoles: [],
}

async function fetchChallenges(message, user, pChallenges) {
  //check every stat for progress bar
  var messagecount = await dailyStats.fetchStat(user.id, 'messagecount')
  var blankcount = await dailyStats.fetchStat(user.id, 'blankcount')
  var findcrate = await dailyStats.fetchStat(user.id, 'findcrate')
  var opencrate = await dailyStats.fetchStat(user.id, 'opencrate')
  var tradecrate = await dailyStats.fetchStat(user.id, 'tradecrate')

  var pProfile = await inv.fetchInv(user.id)
  var pInv = pProfile.inv
  var pBar = false;
  for (var h=0; h<pInv.length; h++) {
    if (!pInv[h]) break;
    if (pInv[h].equip === 1) {
      if (pInv[h].name == 'progress bar') {
        pBar = true
      }
    }
  }
  //
  var chalList = [];
  for (var i=0; i<pChallenges.length; i++) {
    for (var j=0; j<challengeList.length;j++) {
      if (pChallenges[i].cid === challengeList[j].id) {
        if (pChallenges[i].status === 'inactive') {
          chalList.push('**[COMPLETED] **')
        }
        chalList.push('**' + challengeList[j].title)
        chalList.push('(' + challengeList[j].difficulty + ')**')
        chalList.push('\n')
        chalList.push(challengeList[j].description)
        chalList.push('\n')
        var value;
        if (pChallenges[i].status === 'inactive') {
          value = challengeList[j].value
        } else if (pChallenges[i].category === 'messagecount') {
          value = messagecount.dvalue
        } else if (pChallenges[i].category === 'blankcount') {
          value = blankcount.dvalue
        } else if (pChallenges[i].category === 'findcrate') {
          value = findcrate.dvalue
        } else if (pChallenges[i].category === 'opencrate') {
          value = opencrate.dvalue
        } else if (pChallenges[i].category === 'tradecrate') {
          value = tradecrate.dvalue
        }
        var count = Math.floor((value/challengeList[j].value)*10)
        var antiCount = 10-count
        if (pBar) {
          for (var k=0; k<count;k++) {
            chalList.push(':green_square:')
          }
          for (var l=0; l<antiCount;l++) {
            chalList.push(':red_square:')
          }
        } else {
          chalList.push(value + '/' + challengeList[j].value)
        }

        chalList.push('\n')
        chalList.push('\n')
      }
    }

  }
  var challenges = chalList.join(" ");
  message.channel.send({embed: {
  color: 0x7a19a8,
  title: `${user.tag}\'s Challenges`,
  description: challenges,
  }})
  return;


}
