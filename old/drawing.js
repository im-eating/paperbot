const Discord = require('discord.js')
const Canvas = require('canvas')
module.exports = {
  name: 'drawing',
  description: 'Draw test',
  expectedArgs: '',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' drawing')

    var user = message.mentions.users.first() || message.author
    const canvas = Canvas.createCanvas(128, 128)
    const ctx = canvas.getContext('2d')
    const pfp = await Canvas.loadImage(user.displayAvatarURL({ format: 'jpg' }));
    const img = await Canvas.loadImage('./paperbot/images/bluesquaretest.png');
    /* RECTANGLE
    ctx.drawImage(pfp, 5, 5, canvas.width-10, canvas.height-10);
    ctx.lineWidth = 5;
    ctx.strokeStyle = '#FFD700';
    ctx.strokeRect(2.5, 2.5, canvas.width-5, canvas.height-5)
    */
/* CIRCLE
    ctx.beginPath();
    ctx.arc((canvas.width/2), (canvas.height/2), 60, 0, Math.PI * 2, true);
    ctx.lineWidth = 8;
    ctx.strokeStyle = borderColor;
    ctx.stroke();
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(pfp, 4, 4, canvas.width-8, canvas.height-8);
*/
  /*  ctx.drawImage(pfp, 4, 4, canvas.width-8, canvas.height-8);
    ctx.beginPath();
    ctx.moveTo(2,2)
    ctx.lineTo(2,43)
    ctx.lineTo(6,43)
    ctx.lineTo(6,85)
    ctx.lineTo(2,85)
    ctx.lineTo(2,126)
    ctx.lineTo(43,126)
    ctx.lineTo(43,122)
    ctx.lineTo(85,122)
    ctx.lineTo(85,126)
    ctx.lineTo(126,126)
    ctx.lineTo(126,85)
    ctx.lineTo(122,85)
    ctx.lineTo(122,43)
    ctx.lineTo(126,43)
    ctx.lineTo(126,2)
    ctx.lineTo(85,2)
    ctx.lineTo(85,6)
    ctx.lineTo(43,6)
    ctx.lineTo(43,2)
    ctx.lineTo(0,2)
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#0341fc';
    ctx.stroke();
    ctx.closePath();
*/
    ctx.drawImage(img, 2, 2, canvas.width-4, canvas.height-4)
    ctx.drawImage(pfp, 5, 5, canvas.width-10, canvas.height-10)


    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'image.png');
    message.channel.send(attachment)
  },
  permissions: [],
  requiredRoles: [],
}
