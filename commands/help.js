const loadCommands = require('./load-commands')
const prefix = 'p.'
const Discord = require('discord.js');
module.exports = {
  name: ['help', 'h'],
  description: "Describes all of this bot's commands",
  expectedArgs: '',
  category: '',
  callback: (message, arguments, text) => {
    console.log(message.author.tag + ' help')
    const categories = ['', 'Economy', 'Inventory', 'Facts', 'Minigames']
    var reply = [{
                  type: `About`,
                  value: `Paper bot is multi-purpose bot made for the paper server

                          **Functions:**
                          __Economy__ - Handles an economy based on the currency, blanks.
                          __Ranks__ - Earn xp to rank up by being active in the server. Blanks are awarded for ranking up.
                          __Shop__ - Buy color roles and other items using blanks.
                          __Inventory__ - Every player has their own inventory to manage and equip items/roles.
                          __Betting__ - Make bets on anything with other players. Uses blanks.
                          __Facts and generators__ - Variety of commands that return random facts
                          __Minigames__ - Play fun minigames for rewards! (BETA)`
                }];
    const commands = loadCommands()
    for (var i=0;i<categories.length;i++) {
      var desc = [];
      for (const command of commands) {
        const { category } = command
        if (category !== categories[i]) continue
        // Check for permissions
        let permissions = command.permissions
        if (!permissions[0]) {
          // Format the text
          const mainCommand =
            typeof command.name === 'string'
              ? command.name
              : command.name[0]
          const args = command.expectedArgs ? ` ${command.expectedArgs}` : ''
          const { description } = command

          desc.push(`**${prefix}${mainCommand}${args}**: ${description}\n`)
        }
      }
      reply.push({type: categories[i] || 'Commands', value: desc.join(" ")})
    }
    let page = 0;

    const messageEmbed = new Discord.MessageEmbed()
    	.setColor('0x7a19a8')
    	.setTitle('Help menu')
      .addField(reply[0].type, reply[0].value);


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
          var field = {name: reply[page].type, value: reply[page].value}
          messageEmbed.spliceFields(0, 1, field)
          msg.edit(messageEmbed)
        })

        forwards.on('collect', r => {
          r.users.remove(message.author.id)
          if (page === (categories.length)) return;
          page++;
          var field = {name: reply[page].type, value: reply[page].value}
          messageEmbed.spliceFields(0, 1, field)
          msg.edit(messageEmbed)
        })
      })
    });

  },
  permissions: [],
  requiredRoles: [],
}
