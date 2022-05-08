    const Discord = require('discord.js')
const inv = require('../functions/inventory');
const list = require('../getJSON/crates.json')
const vlist = require('../getJSON/validItems.json')
module.exports = {
  name: ['inventory', 'inv'],
  description: 'Shows player inventory',
  expectedArgs: '[user(optional)]',
  category: 'Inventory',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' inventory')
    if (!message.mentions.users.first()) {
      var user = message.author
    } else {
      var user = message.mentions.users.first()
    }

    var pProfile = await inv.fetchInv(user.id)
    var pInv = pProfile.inv
    var categories = []
    for (var i=0;i<(Math.floor(pInv.length/10.1)+1);i++) {
      categories.push("")
    }
    var reply = [] //equipped
    var reply1 = [] //name
    var reply2 = [] //type
    var reply3 = [] //quantity
    for (var i=0;i<categories.length;i++) {
      var desc = [];
      var desc1 = [];
      var desc2 = [];
      var desc3 = [];
      for (var j=0;j<10;j++) {
        var num = j + i*10
        if (!pInv[num]) break;
        if (pInv[num].type == "crate") {
          desc1.push(`:orange_square: ${pInv[num].name}\n`)
        } else {
          if (pInv[num].equip === 1) {
            desc1.push(`:green_square: ${pInv[num].name}\n`)
          } else {
            desc1.push(`:red_square: ${pInv[num].name}\n`)
          }
        }
        desc2.push(`${pInv[num].type}\n`)
        desc3.push(`${pInv[num].quantity}\n`)
      }
      reply1.push({type: `(Equip) Items`, value: desc1.join(" ")})
      reply2.push({type: `Type`, value: desc2.join(" ")})
      reply3.push({type: `Quantity`, value: desc3.join(" ")})
    }
    let page = 0;
    const messageEmbed = new Discord.MessageEmbed()
      .setTitle('Inventory')
      .setDescription(`${user.tag}'s Inventory`)
      .addField(reply1[0].type, reply1[0].value, true)
      .addField(reply2[0].type, reply2[0].value, true)
      .addField(reply3[0].type, reply3[0].value, true)

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
          var field1 = {name: reply1[page].type, value: reply1[page].value, inline: true}
          var field2 = {name: reply2[page].type, value: reply2[page].value, inline: true}
          var field3 = {name: reply3[page].type, value: reply3[page].value, inline: true}
          messageEmbed.spliceFields(0, 1, field1)
          messageEmbed.spliceFields(1, 1, field2)
          messageEmbed.spliceFields(2, 1, field3)
          msg.edit(messageEmbed)
        })

        forwards.on('collect', r => {
          r.users.remove(message.author.id)
          if (page === (categories.length - 1)) return;
          page++;
          var field1 = {name: reply1[page].type, value: reply1[page].value, inline: true}
          var field2 = {name: reply2[page].type, value: reply2[page].value, inline: true}
          var field3 = {name: reply3[page].type, value: reply3[page].value, inline: true}
          messageEmbed.spliceFields(0, 1, field1)
          messageEmbed.spliceFields(1, 1, field2)
          messageEmbed.spliceFields(2, 1, field3)
          msg.edit(messageEmbed)
        })
      })
    });





    /*
    if (!message.mentions.users.first()) {
      var user = message.author
    } else {
      var user = message.mentions.users.first()
    }

    var pInv = await inv.fetchInv(user.id)
    var invList = [];
    for (var i=0; i<pInv.length; i++) {
      if (pInv[i].equip === 1) {
        invList.push('[EQUIPPED]')
      }
      invList.push('Item:')
      invList.push(pInv[i].name)
      if (pInv[i].type === 'crate') {
        for (var j=0;j<list.length;j++) {
          if (list[j].name === pInv[i].name) {
            invList.push(`(Tier ${list[j].tier})`)
          }
        }
      }
      invList.push('| Type: ')
      invList.push(pInv[i].type)
      invList.push('| Quantity: ')
      invList.push(pInv[i].quantity)
      invList.push('\n\n')
    }
    var inventory = invList.join(" ");
    message.channel.send({embed: {
    color: 0x7a19a8,
    title: `${user.tag}\'s Inventory`,
    description: inventory,
    }})
    return;
    */
  },
  permissions: [],
  requiredRoles: [],
}
