const Discord = require('discord.js')
const bet = require('betting')
 
module.exports = {
  name: 'bets',
  description: 'Returns a list of bets',
  expectedArgs: '',
  category: 'Betting',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' bets');
    var output = await bet.fetchBetList();
    var betsList = [];
    if (output[0]) {
      for (var i=0; i<output.length; i++) {
        var betList = [];
        if (output[i].dataValues.closed === 1) {
          betList.push('[CLOSED]')
        }
        betList.push('id:')
        betList.push(output[i].dataValues.id)
        betList.push('| 1:')
        betList.push(output[i].dataValues.desc1)
        betList.push('| 2:')
        betList.push(output[i].dataValues.desc2)
        betList.push('| Pool:')
        betList.push(output[i].dataValues.balance)
        betList.push('| Minimum Bet:')
        betList.push(output[i].dataValues.startBal)
        betsList.push(betList.join(" "))
      }
      var betsGroupedList = []
      for (var i=0;i<(Math.floor(betsList.length/5)+1);i++) {
        betsGroupedList.push("")
      }
      if (betList.length % 5) {
        betsGroupedList.push("")
      }
      for (var i=0;i<betsList.length;i++) {
        betsGroupedList[Math.floor(i/5)] += betsList[i];
        betsGroupedList[Math.floor(i/5)] += "\n\n";
      }

      //var bets = betsList.join("\n\n");

      let page = 0;
      const messageEmbed = new Discord.MessageEmbed()
      	.setColor('0x7a19a8')
      	.setTitle('Bet List')
        .setDescription(betsGroupedList[0]);


      message.channel.send(messageEmbed).then(msg =>{
        msg.react('⬅️').then(r => {
          msg.react('➡️')
          const backFilter = (reaction, user) => reaction.emoji.name === '⬅️' && user.id === message.author.id;
          const forFilter = (reaction, user) => reaction.emoji.name === '➡️' && user.id === message.author.id;

          const backwards = msg.createReactionCollector(backFilter, { time: 60000 })
          const forwards = msg.createReactionCollector(forFilter, { time: 60000 })

          backwards.on('collect', r => {
            r.users.remove(message.author.id)
            if (page === 0) return;
            page--;
            messageEmbed.setDescription(betsGroupedList[page])
            msg.edit(messageEmbed)
          })

          forwards.on('collect', r => {
            r.users.remove(message.author.id)
            if (page === (betsGroupedList.length - 1)) return;
            page++;
            messageEmbed.setDescription(betsGroupedList[page])
            msg.edit(messageEmbed)
          })
        })
      });
    } else {
      const messageEmbed = new Discord.MessageEmbed()
      	.setColor('0x7a19a8')
      	.setTitle('Bet List')
        .setDescription('No current bets');
      message.channel.send(messageEmbed)
    }
  },
  permissions: [],
  requiredRoles: [],
}
