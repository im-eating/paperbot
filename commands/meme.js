const Discord = require('discord.js')
const randomPuppy = require('random-puppy');

module.exports = {
  name: 'meme',
  description: 'Replies with a random meme from reddit',
  expectedArgs: '',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' meme');
    const subReddits = ['dankmeme', 'meme', 'me_irl', 'memes', 'dankmemes', 'funny', 'comedyheaven', 'facepalm', 'starterpacks', 'therewasanattempt', 'unexpected'];
    const random = subReddits[Math.floor(Math.random() * subReddits.length)];

    var img = await randomPuppy(random);

    message.reply(`from r/${random} ` + img)
  },
  permissions: [],
  requiredRoles: [],
}
