const challenge = require('../functions/challenge')
const dailyStats = require('../functions/stats')
const challengeList = require('../getJSON/challenges.json')
const leveling = require('../functions/leveling');
const eco = require('../functions/economy');
const leveling2 = require('../functions/leveling2');
const inv = require('../functions/inventory')
const prof = require('../functions/profile')
const boost = require('../getJSON/boosts.json')
const fs = require('fs')

module.exports = {

  statCheck: async function (playerID, message) {
    //check for every stat and compare to challenges
    var pChallenges1 = await challenge.fetchAllChallenges(playerID)
    var pChallenges = await challenge.fetchChallenges(playerID)
    if (pChallenges1[0].id) {
      if (!pChallenges[0].id) return;

      for (var i=0; i<pChallenges.length; i++) {

        if (pChallenges[i].category === 'messagecount') {

          var cid = pChallenges[i].cid
          var count = await dailyStats.fetchStat(playerID, 'messagecount')
          if (challengeList[cid-1].value <= count.dvalue) {
            await challenge.updateChallenge(playerID, cid, 'inactive')
            message.reply('Challenge complete: ' + challengeList[cid-1].title)
            var difficulty = challengeList[cid-1].difficulty
            if (pChallenges[1]) {
              return this.chalReward(playerID, difficulty, message)
            } else {
              this.chalReward(playerID, 'bonus', message)
              return this.chalReward(playerID, difficulty, message)
            }
          }
        }

        if (pChallenges[i].category === 'tradecrate') {
          var cid = pChallenges[i].cid
          var count = await dailyStats.fetchStat(playerID, 'tradecrate')
          if (challengeList[cid-1].value <= count.dvalue) {
            await challenge.updateChallenge(playerID, cid, 'inactive')
            message.reply('Challenge complete: ' + challengeList[cid-1].title)
            var difficulty = challengeList[cid-1].difficulty
            if (pChallenges[1]) {
              return this.chalReward(playerID, difficulty, message)
            } else {
              this.chalReward(playerID, 'bonus', message)
              return this.chalReward(playerID, difficulty, message)
            }
          }
        }

        if (pChallenges[i].category === 'blankcount') {
          var cid = pChallenges[i].cid
          var count = await dailyStats.fetchStat(playerID, 'blankcount')
          if (challengeList[cid-1].value <= count.dvalue) {
            await challenge.updateChallenge(playerID, cid, 'inactive')
            message.reply('Challenge complete: ' + challengeList[cid-1].title)
            var difficulty = challengeList[cid-1].difficulty
            if (pChallenges[1]) {
              return this.chalReward(playerID, difficulty, message)
            } else {
              this.chalReward(playerID, 'bonus', message)
              return this.chalReward(playerID, difficulty, message)
            }
          }
        }

        if (pChallenges[i].category === 'opencrate') {
          var cid = pChallenges[i].cid
          var count = await dailyStats.fetchStat(playerID, 'opencrate')
          if (challengeList[cid-1].value <= count.dvalue) {
            await challenge.updateChallenge(playerID, cid, 'inactive')
            message.reply('Challenge complete: ' + challengeList[cid-1].title)
            var difficulty = challengeList[cid-1].difficulty
            if (pChallenges[1]) {
              return this.chalReward(playerID, difficulty, message)
            } else {
              this.chalReward(playerID, 'bonus', message)
              return this.chalReward(playerID, difficulty, message)
            }
          }
        }

        if (pChallenges[i].category === 'findcrate') {
          var cid = pChallenges[i].cid
          var count = await dailyStats.fetchStat(playerID, 'findcrate')
          if (challengeList[cid-1].value <= count.dvalue) {
            await challenge.updateChallenge(playerID, cid, 'inactive')
            message.reply('Challenge complete: ' + challengeList[cid-1].title)
            var difficulty = challengeList[cid-1].difficulty
            if (pChallenges[1]) {
              return this.chalReward(playerID, difficulty, message)
            } else {
              this.chalReward(playerID, 'bonus', message)
              return this.chalReward(playerID, difficulty, message)
            }
          }
        }

      }
    } else {
      var auto = await inv.fetchItem(playerID, 'auto challenge activation')
      if (auto.userid) {
        if (auto.equip != 1) return;
        await challenge.resetAllChallenges(message.author.id)
        var reset = await dailyStats.resetAllDailyStat(message.author.id)
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
        var user = message.author;
        var pChallenges = await challenge.fetchAllChallenges(message.author.id)
        if (message.content.startsWith('p.')) return;
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
                value = findcrate.value
              } else if (pChallenges[i].category === 'opencrate') {
                value = opencrate.value
              } else if (pChallenges[i].category === 'tradecrate') {
                value = tradecrate.value
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
      return;
    }
  },

  msgCheck: async function (playerID, message, profile) {
    //check for boosts
    var xpboost1_5 = false
    var xpboost2 = true
    if (boost[0].status === '1') {
      xpboost1_5 = true
    }
    if (boost[1].status === '1') {
      xpboost2 = true
    }

    if (xpboost1_5 && xpboost2) {
      leveling.addXp(playerID, 3)
    } else if (xpboost2) {
      leveling.addXp(playerID, 2)
    } else if (xpboost1_5) {
      if (profile.xp%3 === 0) { //1.5xp
        leveling.addXp(playerID, 1)
      } else {
        leveling.addXp(playerID, 2)
      }
    } else {
      leveling.addXp(playerID, 1)
    }

    //If user xp higher than 100 add level
    if (profile.lvl >= 120) {
      var maxXp = 550
    } else {
      var maxXp = Math.floor((40*(Math.log(profile.lvl + 1))) + (3*profile.lvl)) + 1; //y=40ln(x+1)+3x+1
    }
    if (profile.xp + 1 > maxXp) {

      await leveling.addLevel(playerID, 1)
      await leveling.setXp(playerID, 0)

    }


  },

  msgCheck2: async function (playerID, message, profile) {
    //check for boosts
    var xpboost1_5 = false
    var xpboost2 = true
    var crateboost1_5 = false
    var crateboost2 = true
    if (boost[0].status === '1') {
      xpboost1_5 = true
    }
    if (boost[1].status === '1') {
      xpboost2 = true
    }
    if (boost[2].status === '1') {
      crateboost1_5 = true
    }
    if (boost[3].status === '1') {
      crateboost2 = true
    }

    if (xpboost1_5 && xpboost2) {
      leveling2.addXp(playerID, 3)
    } else if (xpboost2) {
      leveling2.addXp(playerID, 2)
    } else if (xpboost1_5) {
      if (profile.xp%3 === 0) { //1.5xp
        leveling2.addXp(playerID, 1)
      } else {
        leveling2.addXp(playerID, 2)
      }
    } else {
      leveling2.addXp(playerID, 1)
    }

    dailyStats.updateStat(playerID, 'messagecount', 1)
    //If user xp higher than 100 add level
    if (profile.lvl >= 120) {
      var maxXp = 550
    } else {
      var maxXp = Math.floor((40*(Math.log(profile.lvl + 1))) + (3*profile.lvl)) + 1; //y=40ln(x+1)+3x+1
    }
    if (profile.lvl >= 145) {
      var money = 30
    } else {
      var money = 1 + Math.floor(profile.lvl/5)
    }

    if (profile.xp + 1 > maxXp) {

      await leveling2.addLevel(playerID, 1)
      await leveling2.setXp(playerID, 0)
      var itemType = 'crate'
      var itemName = 'rank crate'
      var itemInv = await inv.addItem(playerID, itemType, itemName)
      var profileBal = await eco.addToBalance(playerID, money)
      await dailyStats.updateStat(playerID, 'blankcount', money)
      message.reply(`You just ranked up!! You are now rank ${profile.lvl + 1} and you have earned ${money} blanks and a rank crate!`)

    }

    var iType = 'crate'
    var chance = Math.random()
    console.log("crate chance: " + chance)
    //1.5x CRATE EVENT
    /*var vrchance = 0.00006
    var rchance = 0.00045
    var uchance = 0.00375
    var cchance = 0.03*/

    //2.0x CRATE EVENT
    /*var vrchance = 0.00008
    var rchance = 0.0006
    var uchance = 0.005
    var cchance = 0.04*/

    //Original
    var vrchance = 0.00006
    var rchance = 0.00045
    var uchance = 0.003
    var cchance = 0.022
    if (crateboost1_5 && crateboost2) {
      vrchance = vrchance*3
      rchance = rchance*3
      uchance = uchance*3
      cchance = cchance*3
    } else if (crateboost2) {
      vrchance = vrchance*2
      rchance = rchance*2
      uchance = uchance*2
      cchance = cchance*2
    } else if (crateboost1_5) {
      vrchance = vrchance*1.5
      rchance = rchance*1.5
      uchance = uchance*1.5
      cchance = cchance*1.5
    }
    if (chance < vrchance) {
      var itemInv = await inv.addItem(playerID, iType, 'very rare crate')
      message.reply(`You just found a very rare crate!`)
      await dailyStats.updateStat(playerID, 'findcrate', 1)
      console.log(message.author.tag + ' very rare crate')
    } else if (chance < rchance) {
      var itemInv = await inv.addItem(playerID, iType, 'rare crate')
      message.reply(`You just found a rare crate!`)
      await dailyStats.updateStat(playerID, 'findcrate', 1)
      console.log(message.author.tag + ' rare crate')
    } else if (chance < uchance) {
      var itemInv = await inv.addItem(playerID, iType, 'uncommon crate')
      message.reply(`You just found a uncommon crate!`)
      await dailyStats.updateStat(playerID, 'findcrate', 1)
      console.log(message.author.tag + ' uncommon crate')
    } else if (chance < cchance) {
      var itemInv = await inv.addItem(playerID, iType, 'common crate')
      message.reply(`You just found a common crate!`)
      await dailyStats.updateStat(playerID, 'findcrate', 1)
      console.log(message.author.tag + ' common crate')
    }
  },

  chalCheck: async function (playerID) {
    //check for challenge expiration
    var eChallenges = await challenge.fetchAllChallenges(playerID)
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear().toString().substr(2);
    var preDate = yyyy + '-' + mm + '-' + dd
    var date = preDate.replace(/0/g, '')
    if (eChallenges[0].id) {
      var dataDate = eChallenges[0].date.substr(2, 8).replace(/0/g, '')
      if (dataDate != date) {
        await challenge.resetAllChallenges(playerID)
      }
    }
  },

  boostCheck: async function (playerID) {
    //check for challenge expiration
    var today = new Date();
    var hourNow = today.getHours();
    var minuteNow = today.getMinutes();
    var timeNow = (hourNow*60) + minuteNow

    var boostLength = 60

    for (var i=0;i<boost.length;i++) {
      if (boost[i].time === '0') {continue;}
      var timeSplit = boost[i].time.split(':')
      var time = (parseInt(timeSplit[0])*60) + parseInt(timeSplit[1])
      if (Math.abs(timeNow-time) >= boostLength) {
        boost[i].status = "0"
        boost[i].time = "0"
        fs.writeFile("./paperbot/getJSON/boosts.json", JSON.stringify(boost), err => {
          if (err) throw err;
          console.log('done')
        })
      }
    }
  },

  chalReward: async function (playerID, difficulty, message) {
    var profile = await leveling.fetch(playerID)
    var profile2 = await leveling2.fetch(playerID)
    //profile1
    if (profile.lvl >= 120) {
      var maxXp = 550
    } else {
      var maxXp = Math.floor((40*(Math.log(profile.lvl + 1))) + (3*profile.lvl)) + 1; //y=40ln(x+1)+3x+1
    }
    await dailyStats.updateStat(playerID, 'challengesDone', 1, true)
    var curXp = profile.xp
    switch (difficulty) {
      case 'very easy':
        var xpReward = 5
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling.addLevel(playerID, 1)
          await leveling.setXp(playerID, totalXp-maxXp)
        } else {
          await leveling.addXp(playerID, xpReward)
        }
      break;
      case 'easy':
        var xpReward = 15
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling.addLevel(playerID, 1)
          await leveling.setXp(playerID, totalXp-maxXp)
        } else {
          await leveling.addXp(playerID, xpReward)
        }
      break;
      case 'medium':
        var xpReward = 30
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling.addLevel(playerID, 1)
          await leveling.setXp(playerID, totalXp-maxXp)
        } else {
          await leveling.addXp(playerID, xpReward)
        }
      break;
      case 'hard':
        var xpReward = 45
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling.addLevel(playerID, 1)
          await leveling.setXp(playerID, totalXp-maxXp)
        } else {
          await leveling.addXp(playerID, xpReward)
        }
      break;
      case 'very hard':
        var xpReward = 60
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling.addLevel(playerID, 1)
          await leveling.setXp(playerID, totalXp-maxXp)
        } else {
          await leveling.addXp(playerID, xpReward)
        }
      break;
      case 'bonus':
        //
      break;
    }

    //profile2
    if (profile2.lvl >= 120) {
      var maxXp = 550
    } else {
      var maxXp = Math.floor((40*(Math.log(profile2.lvl + 1))) + (3*profile2.lvl)) + 1; //y=40ln(x+1)+3x+1
    }

    if (profile2.lvl >= 145) {
      var money = 30
    } else {
      var money = 1 + Math.floor(profile2.lvl/5)
    }

    var curXp = profile2.xp
    switch (difficulty) {
      case 'very easy':
        var xpReward = 5
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling2.addLevel(playerID, 1)
          await leveling2.setXp(playerID, totalXp-maxXp)
          var itemType = 'crate'
          var itemName = 'rank crate'
          var itemInv = await inv.addItem(message.author.id, itemType, itemName)
          var profileBal = await eco.addToBalance(message.author.id, money)
          await dailyStats.updateStat(message.author.id, 'blankcount', money)
          message.reply(`You just ranked up!! You are now rank ${profile2.lvl + 1} and you have earned ${money} blanks and a rank crate!`)
        } else {
          await leveling2.addXp(playerID, xpReward)
        }
        message.reply(`You have earned ${xpReward} xp!`);
      break;
      case 'easy':
        var xpReward = 15
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling2.addLevel(playerID, 1)
          await leveling2.setXp(playerID, totalXp-maxXp)
          var itemType = 'crate'
          var itemName = 'rank crate'
          var itemInv = await inv.addItem(message.author.id, itemType, itemName)
          var profileBal = await eco.addToBalance(message.author.id, money)
          await dailyStats.updateStat(message.author.id, 'blankcount', money)
          message.reply(`You just ranked up!! You are now rank ${profile2.lvl + 1} and you have earned ${money} blanks and a rank crate!`)
        } else {
          await leveling2.addXp(playerID, xpReward)
        }
        message.reply(`You have earned ${xpReward} xp!`);
      break;
      case 'medium':
        var xpReward = 30
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling2.addLevel(playerID, 1)
          await leveling2.setXp(playerID, totalXp-maxXp)
          var itemType = 'crate'
          var itemName = 'rank crate'
          var itemInv = await inv.addItem(message.author.id, itemType, itemName)
          var profileBal = await eco.addToBalance(message.author.id, money)
          await dailyStats.updateStat(message.author.id, 'blankcount', money)
          message.reply(`You just ranked up!! You are now rank ${profile2.lvl + 1} and you have earned ${money} blanks and a rank crate!`)
        } else {
          await leveling2.addXp(playerID, xpReward)
        }
        message.reply(`You have earned ${xpReward} xp!`);
      break;
      case 'hard':
        var xpReward = 45
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling2.addLevel(playerID, 1)
          await leveling2.setXp(playerID, totalXp-maxXp)
          var itemType = 'crate'
          var itemName = 'rank crate'
          var itemInv = await inv.addItem(message.author.id, itemType, itemName)
          var profileBal = await eco.addToBalance(message.author.id, money)
          await dailyStats.updateStat(message.author.id, 'blankcount', money)
          message.reply(`You just ranked up!! You are now rank ${profile2.lvl + 1} and you have earned ${money} blanks and a rank crate!`)
        } else {
          await leveling2.addXp(playerID, xpReward)
        }
        message.reply(`You have earned ${xpReward} xp!`);
      break;
      case 'very hard':
        var xpReward = 60
        var totalXp = curXp+xpReward
        if (totalXp > maxXp) {
          await leveling2.addLevel(playerID, 1)
          await leveling2.setXp(playerID, totalXp-maxXp)
          var itemType = 'crate'
          var itemName = 'rank crate'
          var itemInv = await inv.addItem(message.author.id, itemType, itemName)
          var profileBal = await eco.addToBalance(message.author.id, money)
          await dailyStats.updateStat(message.author.id, 'blankcount', money)
          message.reply(`You just ranked up!! You are now rank ${profile2.lvl + 1} and you have earned ${money} blanks and a rank crate!`)
        } else {
          await leveling2.addXp(playerID, xpReward)
        }
        message.reply(`You have earned ${xpReward} xp!`);
      break;
      case 'bonus':
        var itemType = 'crate'
        var itemName = 'challenge crate 1'
        var quantity = 1
        var itemInv = await inv.addItem(playerID, itemType, itemName, quantity)
        message.reply(`All challenges complete! You have won challenge crate`);
      break;
    }
  }


}
