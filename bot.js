const Discord = require('discord.js');
const client = new Discord.Client();

const leveling = require("./functions/leveling")
const leveling2 = require("./functions/leveling2")

const list = require('./getJSON/crates.json')
const prizeList = require('./getJSON/prizes.json')

const fs = require('fs');
const path = require('path');

const loadCommands = require('./commands/load-commands')

const stats = require('./commands/stat-check.js')

const token = require('../token.json')

client.commands = new Discord.Collection();
//prefix
let prefix = 'p.';

client.setMaxListeners(50);

client.on('ready', async () => {
  console.log('The client is ready!')

  loadCommands(client)
})

//hi
client.on('error', console.error);

client.on('message', async message => {
  if (message.author.bot) return;
  if (message.channel.type === 'dm') return;
  var botchannel = message.guild.channels.cache.get('801558022823477339')
  botchannel.setRateLimitPerUser(0.5);
  var profile = await leveling.fetch(message.author.id)
  var profile2 = await leveling2.fetch(message.author.id)
  if (message.content.startsWith('p.')) return;
  //if (message.author.id == '381910494493278208') return message.reply('Imposter! you get no xp')
  if (message.channel.id === '704489252125409314' || message.channel.id === '789215234376073236' || message.channel.id === '801939862303014912' || message.channel.id == '801558022823477339') {//chat school and trivia
    stats.chalCheck(message.author.id)
    stats.msgCheck(message.author.id, message, profile)
    stats.msgCheck2(message.author.id, message, profile2)

  }


  stats.statCheck(message.author.id, message)
  stats.boostCheck(message.author.id, message)
  if(!message.content.startsWith(prefix)) return;
  let command = message.content.split(' ')[0].slice(prefix.length);
  let params = message.content.split(' ').slice(1); //array containing each param
  let args = message.content.split(' '); //same as params but also contains command at first index  args[2] == params[1]
  let params1 = message.content.split(' ').slice(1).join(" "); //same as params but as a string with a space in between
  let paramsCom = message.content.split(' ').slice(1).join(" ").split(', '); //array containing each param when set by comma



  /*copypaste code
  embed:
        message.channel.send({embed: {
        color: 0x7a19a8,
        title: '',
        description: '',
        }})

  exampleEmbed = {
    color: ,
    title: '',
    url: '',
    author: {
      name: '',
      icon_url: '',
      url: '',
    },
    description: '',
    thumbnail: {
      url: '',
    },
    fields: [
      {
        name: '',
        value: '',
      },
      {
        name: '',
        value: '',
        inline: false,
      },
      {
        name: '',
        value: '',
        inline: true,
      },
    ],
    image: {
      url: '',
    },
    timestamp: new Date(),
    footer: {
      text: '',
      icon_url: '',
    },
  };



*/

});

client.on('ready', () => {
  client.user.setPresence({
        activity: {
            name: 'p.help'
        },
        status: 'online'
    })
});

client.login(token);
