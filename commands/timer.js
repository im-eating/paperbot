const fs = require('fs')
const Stopwatch = require('statman-stopwatch');
const dailyStats = require('../functions/stats')

const board = require('../getJSON/minigameBoard.json')

module.exports = {
  name: 'timer',
  description: 'Timer minigame!',
  expectedArgs: '[play/leaderboard]',
  category: 'Minigames',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' timer')

    if (paramsCom[0] == 'play') {
      var stopwatch = new Stopwatch();
      message.channel.send({embed: {
      color: 0x7a19a8,
      title: `Type start to start game!`,
      description: `Try to get as close as you can to the specified amount of seconds!`,
      }})

      const filter = m => m.author.id === message.author.id
      const respond = message.channel.createMessageCollector(filter, { time: 30000 });

      respond.on('collect', async m => {
        if (m.content == 'start') {
          respond.stop();
          var num = Math.floor(Math.random() * 4) + 7;
          message.reply(`Respond to this message in ${num} seconds!`)
          stopwatch.start();
          const respond2 = message.channel.createMessageCollector(filter, { time: 30000 });
          respond2.on('collect', async m => {
            var time = stopwatch.stop();
            var timeInSecs = time/1000;
            var score = Math.round((Math.abs(time-(num*1000)))*1000)/1000
            var hasStat = false;
            for (var i=0;i<board.length;i++) {
              if (board[i].name == message.author.tag && board[i].game == 'timer') {
                hasStat = true;
                board[i].total += score
                board[i].plays += 1
                if (score < board[i].score) {
                  board[i].score = score;

                }
                fs.writeFile("./paperbot/getJSON/minigameBoard.json", JSON.stringify(board), err => {
                  if (err) throw err;
                  console.log('done')
                })
                break;
              }
            }
            if (!hasStat) {
              board.push({"name": message.author.tag, "game": "timer", "score": score, "total": score, "plays": 1})
              fs.writeFile("./paperbot/getJSON/minigameBoard.json", JSON.stringify(board), err => {
                if (err) throw err;
                console.log('done')
              })
            }
            await dailyStats.updateStat(message.author.id, 'timerPlayed', 1)
            message.channel.send({embed: {
            color: 0x7a19a8,
            title: `You were off by ${score} milliseconds`,
            description: `Your time was ${timeInSecs}`,
            }})
            stopwatch.reset();
            respond2.stop();
            return;
          })

        } else {
          respond.stop();
          return;
        }

      })
    } else if (paramsCom[0] == 'leaderboard') {
      var list = [];
      for (var i=0;i<board.length;i++) {
        if (board[i].game == 'timer') {
          list.push(`${board[i].name} - ${board[i].score}`)
        }
      }
      var listBoard = list.join('\n')
      message.channel.send({embed: {
      color: 0x7a19a8,
      title: `Timer leaderboard`,
      description: listBoard,
      }})
    } else {
      message.reply('Use p.timer [play/leaderboard]')
    }
  },
  permissions: [],
  requiredRoles: [],
}
