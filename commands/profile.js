const Discord = require('discord.js')
const eco = require('../functions/economy')
const leveling = require('../functions/leveling2')
const inv = require('../functions/inventory')
const prof = require('../functions/profile')
const Canvas = require('canvas')
const colorID = require('../getJSON/colorId.json');
module.exports = {
  name: ['profile', 'p', 'prof'],
  description: 'Replies with you or a user\'s profile, showing ranks, balance, and badges',
  expectedArgs: '[user(optional)]',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' profile')

    var user = message.mentions.users.first() || message.author
    var balOutput = await eco.fetchBalance(user.id)
    var rankOutput = await leveling.fetch(user.id)
    var xp = rankOutput.xp
    if (rankOutput.lvl >= 120) {
      var maxXp = 550
    } else {
      var maxXp = Math.floor((40*(Math.log(rankOutput.lvl + 1))) + (3*rankOutput.lvl)) + 1; //y=40ln(x+1)+3x+1
    }
    var showXp = xp + '/' + maxXp
    var pProfile = await inv.fetchInv(user.id)
    var pInv = pProfile.inv
    var invList = [];
    var profile = await prof.fetchProfile(user.id)
    var border;
    var borderColor;

    for (var i=0; i<pInv.length; i++) {
      if (!pInv[i]) break;
      if (pInv[i].equip === 1) {
        if (pInv[i].type == 'badge') {
          if (!invList[(profile.badges-1)*2]) {
            invList.push(pInv[i].name)
            invList.push('\n')
          }
        }
        if (pInv[i].type == 'pfpborder') {
          border = pInv[i].name.slice(0, -7)
          borderColor = colorID.find( ({ name }) => name === border ).id;
        }
        if (pInv[i].name == 'progress bar') {
          var progressBar = [];
          var count = Math.floor((xp/maxXp)*10)
          var antiCount = 10-count
          for (var k=0; k<count;k++) {
            progressBar.push(':green_square:')
          }
          for (var l=0; l<antiCount;l++) {
            progressBar.push(':red_square:')
          }
          showXp = progressBar.join(' ')
        }
      }
    }
    if (!invList[0]) invList.push('None')
    const canvas = Canvas.createCanvas(128, 128)
    const ctx = canvas.getContext('2d')

    ctx.beginPath();
    ctx.arc((canvas.width/2), (canvas.height/2), 60, 0, Math.PI * 2, true);
    ctx.lineWidth = 8;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.closePath();
    ctx.clip();

    const ipfp = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
    ctx.drawImage(ipfp, 4, 4, canvas.width-8, canvas.height-8);
    var attachment = new Discord.MessageAttachment(user.displayAvatarURL(), 'dimage.png');
    var badges = invList.join(" ") //this will later be invlist[0] OR multiple badges if they bought the customization
    var pfp = '';
    if (profile.pfp) {
      pfp = 'attachment://dimage.png';
    }

    if (profile.border) {
      attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');
      if (pfp === 'attachment://dimage.png') pfp = 'attachment://image.png';
    }
    var tag = user.tag.slice(0, -5)
    if (!profile.embed) {

      return message.reply(
        `
        **${user.tag}\'s profile**
        Badges: ${badges}
        Rank: ${rankOutput.lvl}
        Balance: ${balOutput.balance}`
      )
    }
    if (!profile.pfp) {
      message.channel.send({embed: {
        color: 0x7a19a8,
        title: `${tag}\'s profile`,
        author: {
          name: profile.authorName,
        },
        fields: [
          {
            name: 'Badges',
            value: badges,
          },
          {
            name: 'Rank',
            value: `${rankOutput.lvl}`,
            inline: true
          },
          {
            name: 'Balance',
            value: `${balOutput.balance}`,
            inline: true
          },
          {
            name: 'Xp',
            value: `${showXp}`
          },
        ],
        footer: {
          text: user.tag,
      	},
      }});
    } else {
      message.channel.send({ files: [attachment], embed: {
        color: 0x7a19a8,
        title: `${tag}\'s profile`,
        author: {
          name: profile.authorName,
          url: '',
        },
        thumbnail: {
          url: pfp,
        },
        fields: [
          {
            name: 'Badges',
            value: badges,
          },
          {
            name: 'Rank',
            value: `${rankOutput.lvl}`,
            inline: true
          },
          {
            name: 'Balance',
            value: `${balOutput.balance}`,
            inline: true
          },
          {
            name: 'Xp',
            value: `${showXp}`
          },
        ],
        footer: {
          text: user.tag
      	},
      }});
    }
  },
  permissions: [],
  requiredRoles: [],
}
