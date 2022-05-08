
const fs = require('fs')

const tRank = require('../getJSON/tourneyRankings.json')

module.exports = {
  name: 'tourney',
  description: '[BETA] Create tourney brackets and ',
  expectedArgs: '[create], [type (if using create)]',
  category: '',
  permissionError: '',
  minArgs: 1,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' tourney')

    if (paramsCom[0] == 'create') {
      if (paramsCom[1] == 'ranking') {
        message.reply('Enter the name of this ranking and the number of teams/items to be ranked, separated by a comma')
        const filter = m => m.author.id === message.author.id
        const respond = message.channel.createMessageCollector(filter, { time: 30000 });
        var p = '';
        var name = '';
        var numItems = 0;
        var tIndex = 0;
        respond.on('collect', async m => {
          p = m.content.split(', ');
          console.log(p);
          if (!p[1]) {
            message.reply('Error: You must put two fields: [name], [number of teams/items]')
            respond.stop();
            return;
          }
          if (!parseInt(p[1])) {
            message.reply('Error: Number of teams/items must be an integer')
            respond.stop();
            return;
          }
          name = p[0];
          numItems = parseInt(p[1]);
          tIndex = tRank.push({"name": name, "author": message.author.tag, "numItems": numItems, "teamList": []})
          respond.stop()
          var count = 0;
          message.reply(`NOTE: Your next ${numItems} will be collected for this ranking.`)
          message.channel.send(`Enter your team/item that is at rank ${count+1}`)
          const respond2 = message.channel.createMessageCollector(filter, {max: numItems, time: 120000});
          respond2.on('collect', async m2 => {
            tRank[tIndex-1].teamList.push(`${count+1}. ${m2.content}`)
            m2.delete()
            count++;
            if (count < numItems) {
              message.channel.send(`Enter your team/item that is at rank ${count+1}`)
            }
          })

          respond2.on('end', async collcted => {
            fs.writeFile("./paperbot/getJSON/tourneyRankings.json", JSON.stringify(tRank), err => {
              if (err) throw err;
              console.log('done')
            })
            message.reply('Created Ranking!')
            return;

          })

        })

      }
    } else if (paramsCom[0] == 'view') {
      if (message.member.permissions.has("ADMINISTRATOR")) {

      } else {
        message.reply('You do not have the required permissions!')
      }
    } else {
      message.reply('Use p.tourney create')
    }
  },
  permissions: [],
  requiredRoles: [],
}
