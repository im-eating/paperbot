const Discord = require('discord.js')
const inv = require('../functions/inventory');
const prof = require('../functions/profile')
module.exports = {
  name: 'unequip',
  description: 'Equips an item',
  expectedArgs: '[itemName]',
  category: 'Inventory',
  permissionError: 'no',
  minArgs: 1,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' unequip')
    var item = await inv.fetchItem(message.author.id, paramsCom[0])
    if (!item.userid) return message.reply('You do not own an item with this name')
    if (item.equip === 0) return message.reply('This item is already unequipped')
    var profile = await prof.fetchProfile(message.author.id)
    switch (item.type) {
      case 'color':
      case 'role':
        const role = message.guild.roles.cache.find(role => role.name === paramsCom[0]);
        message.member.roles.remove(role);
        message.channel.send({embed: {
          color: 0x7a19a8,
          title: 'Item Unequipped',
          fields: [
            {
              name: `${item.name}`,
              value: `type: ${item.type}`,
            },
          ],
        }})
        var eItem = await inv.unequipItem(message.author.id, paramsCom[0])
      break;
      case 'badge':
        message.channel.send({embed: {
          color: 0x7a19a8,
          title: 'Item Unequipped',
          fields: [
            {
              name: `${item.name}`,
              value: `type: ${item.type}`,
            },
          ],
        }})
        var eItem = await inv.unequipItem(message.author.id, paramsCom[0])
      break;
      case 'profile':
        message.channel.send({embed: {
          color: 0x7a19a8,
          title: 'Item Unequipped',
          fields: [
            {
              name: `${item.name}`,
              value: `type: ${item.type}`,
            },
          ],
        }})
        var eItem = await inv.unequipItem(message.author.id, paramsCom[0])
        var profUpdate = await prof.updateField(message.author.id, item.name, false)

      break;
      case 'pfpborder':
        message.channel.send({embed: {
          color: 0x7a19a8,
          title: 'Item Unequipped',
          fields: [
            {
              name: `${item.name}`,
              value: `type: ${item.type}`,
            },
          ],
        }})
        var eItem = await inv.unequipItem(message.author.id, paramsCom[0])
        var profUpdate = await prof.updateField(message.author.id, 'hasBorder', false)
      break;
      default:
        message.channel.send('Error: wrong item type')
      break;
    }
  },
  permissions: [],
  requiredRoles: [],
}
