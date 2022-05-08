const Discord = require('discord.js')
const boost = require('../getJSON/boosts.json')

module.exports = {
  name: 'booststatus',
  description: 'Replies active boosts',
  expectedArgs: '',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' booststatus')
    var boostList = []
    for (var i=0;i<boost.length;i++) {
      if (boost[i].status === '1' && boost[i].user === 'server') {
        console.log('yes')
        boostList.push(boost[i].name)
        boostList.push('\n')
      }
    }

    if (!boostList[0]) {
      boostList.push('No current active boosts')
    }
    var boosts = boostList.join("\n");
    console.log(boostList)
    message.channel.send({embed: {
    color: 0x7a19a8,
    title: `Active boosts`,
    description: boosts,
    }})
  },
  permissions: [],
  requiredRoles: [],
}
