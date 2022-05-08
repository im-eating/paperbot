const fs = require('fs')
const async = require('async')
const dailyStats = require('../functions/stats')

const board = require('../getJSON/minigameBoard.json')

module.exports = {
  name: 'memory',
  description: 'Memory minigame!',
  expectedArgs: '[play/leaderboard]',
  category: 'Minigames',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' memory')

    if (paramsCom[0] == 'play') {

      const filter = m => m.author.id === message.author.id
      var respond = message.channel.createMessageCollector(filter, { time: 30000 });

      message.channel.send(`Repeat the first letter of the color the bot shows you! type first letter of the color you see! (R, O, Y, G, B, P, W)`)


      var game = await gameLoop(message)

    } else if (paramsCom[0] == 'leaderboard') {
      var list = [];
      for (var i=0;i<board.length;i++) {
        if (board[i].game == 'memory') {
          list.push(`${board[i].name} - ${board[i].score}`)
        }
      }
      var listBoard = list.join('\n')
      message.channel.send({embed: {
      color: 0x7a19a8,
      title: `Memory leaderboard`,
      description: listBoard,
      }})
    } else {
      message.reply('Use p.memory [play/leaderboard]')
    }
  },
  permissions: [],
  requiredRoles: [],
  }

async function loopFunction(message, output) {
  var x = 0
  while (x < output.length){
    await message.channel.send(output[x])
      .then(msg => {
      msg.delete({ timeout: 800 })
    })
    if (x >= output.length) break;
    x++
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  return Promise.resolve({
    loop: true
  })
}

async function mainFunction(message, roundsLasted) {
  var choices = ["R", "O", "Y", "G", "B", "P", "W"]
  var output = []
  var backput = []
  for (var i=0; i<roundsLasted+3; i++) {
    var randomChoice = choices[Math.floor(Math.random()*choices.length)]
    backput.push(randomChoice)
    switch(randomChoice) {
      case "R":
        output.push(":red_square:")
        break;
      case "O":
        output.push(":orange_square:")
        break;
      case "Y":
        output.push(":yellow_square:")
        break;
      case "G":
        output.push(":green_square:")
        break;
      case "B":
        output.push(":blue_square:")
        break;
      case "P":
        output.push(":purple_square:")
        break;
      case "W":
        output.push(":white_large_square:")
        break;
    }
  }
  console.log(backput)

  var result = await loopFunction(message, output)
  message.channel.send(`You have ${2*output.length} seconds`)
  const filter = m => m.author.id === message.author.id
  const respond2 = message.channel.createMessageCollector(filter, { time: 2000*(output.length) });
  var inputs = []

  //ERROR not running collector
  message.channel.send("GO")
  respond2.on('collect', async m => {
    inputs.push(m.content.toUpperCase())

    if (inputs[inputs.length-1] != backput[inputs.length-1]) {
      message.channel.send("Game over")
      var score = roundsLasted
      var hasStat = false;
      var highscore = 0;
      for (var i=0;i<board.length;i++) {
        if (board[i].name == message.author.tag && board[i].game == 'memory') {
          hasStat = true;

          highscore = board[i].score
          board[i].total += score
          board[i].plays += 1
          if (score > board[i].score) {
            board[i].score = score;
            highscore = score
          }
          fs.writeFile("./paperbot/getJSON/minigameBoard.json", JSON.stringify(board), err => {
            if (err) throw err;
            console.log('done')
          })
          break;
        }
      }
      if (!hasStat) {
        board.push({"name": message.author.tag, "game": "memory", "score": score, "total": score, "plays": 1})
        highscore = score;
        fs.writeFile("./paperbot/getJSON/minigameBoard.json", JSON.stringify(board), err => {
          if (err) throw err;
          console.log('done')
        })
      }
      message.channel.send({embed: {
      color: 0x7a19a8,
      title: `You lasted ${score} rounds!`,
      description: `Your highscore is ${highscore}`
      }})
      respond2.stop()
      return roundsLasted
    }
    if (inputs.length == output.length) {
      message.channel.send("Next round")
      respond2.stop()
      await mainFunction(message, roundsLasted + 1)
    }
  })

  respond2.on('end', async (e, b) => {
    if (b === "time") {
      var score = roundsLasted
      var hasStat = false;
      var highscore = 0;
      for (var i=0;i<board.length;i++) {
        if (board[i].name == message.author.tag && board[i].game == 'memory') {
          hasStat = true;

          highscore = board[i].score
          board[i].total += score
          board[i].plays += 1
          if (score > board[i].score) {
            board[i].score = score;
            highscore = score
          }
          fs.writeFile("./paperbot/getJSON/minigameBoard.json", JSON.stringify(board), err => {
            if (err) throw err;
            console.log('done')
          })
        }
      }
      if (!hasStat) {
        board.push({"name": message.author.tag, "game": "memory", "score": score, "total": score, "plays": 1})
        highscore = score;
        fs.writeFile("./paperbot/getJSON/minigameBoard.json", JSON.stringify(board), err => {
          if (err) throw err;
          console.log('done')
        })
      }

      message.channel.send({embed: {
      color: 0x7a19a8,
      title: `You lasted ${score} rounds!`,
      description: `Your highscore is ${highscore}`
      }})
    }
  })

}

async function gameLoop(message) {
  var canBreak = true
  var roundsLasted = await mainFunction(message, 0)
  while (roundsLasted == undefined) {
    await new Promise(resolve => setTimeout(resolve, 100))
  }



}
