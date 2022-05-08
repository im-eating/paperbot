const Discord = require('discord.js')
const inv = require('../functions/inventory')
const prof = require('../functions/profile');

module.exports = {
  name: 'destroyitem',
  description: 'destroys a player\'s item',
  expectedArgs: '[player], [itemName]',
  category: 'Inventory',
  permissionError: 'no',
  minArgs: 2,
  maxArgs: 2,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' destroyItem');
    if (!message.mentions.users.first()) return message.reply('Error: No player specified')
    var output = await inv.fetchItem(message.mentions.users.first().id, paramsCom[1])
    if (!output.userid) {
      return message.reply('Item does not exist')
    }
    if (output.equip === 1) {
      var eItem = await inv.unequipItem(message.mentions.users.first().id, paramsCom[1])
      if (eItem.type === 'color' || eItem.type === 'role') {
        const role = message.guild.roles.cache.find(role => role.name === paramsCom[1]);
        message.member.roles.remove(role);
      }
      if (eItem.type === 'profile') var profUpdate = await prof.updateField(message.author.id, eItem.name, false)
      if (eItem.type === 'pfpborder') var profUpdate = await prof.updateField(message.author.id, 'border', false)
    }

    message.channel.send({embed: {
    color: 0x7a19a8,
    title: 'Item Destroyed!',
    fields: [
      {
        name: 'Details:',
        value: `Player: **${message.mentions.users.first().tag}**\nItem: ${output.name}`,
      },
    ],
    }})


    inv.removeItem(message.mentions.users.first().id, paramsCom[1]);
  },
  permissions: 'ADMINISTRATOR',
  requiredRoles: [],
}
