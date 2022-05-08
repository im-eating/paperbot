const Discord = require('discord.js')

var kanyeQuotes = ['I know I got angels watching me from the other side',
                   'Everything I\'m not makes me everything I am',
                   'To use is necessary. And if you can\'t be used, then you\'re useless.',
                   'Talk and talk and talk and talk. Baby, let\'s just knock it off.They don\'t know what we been through. They don\'t know \'bout me and you',
                   'Nothing in life is promised except death',
                   'Here\'s something that\'s contrary to popular belief: I actually don\'t like thinking. I think people think I like to think a lot. And I don\'t. I do not like to think at all',
                   'I don\'t know what\'s better gettin\' laid or gettin\' paid',
                   'I have decided in 2020 to run for president',
                   'I am not a fan of books',
                   'I love sleep; it\'s my favorite',
                   'I care. I care about everything. Sometimes not giving a fuck is caring the most',
                   'I\'mma let you finish, but Beyoncé had one of the best videos of all time!',
                   'Al is not me'
                  ]

module.exports = {
  name: 'kanye',
  description: 'Replies with a kanye quote',
  expectedArgs: '',
  category: '',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' kanye');
    var kanyeNum = await Math.floor((Math.random() * kanyeQuotes.length));
    message.reply('"' + kanyeQuotes[kanyeNum] + '"' + ' - Kanye West');
  },
  permissions: [],
  requiredRoles: [],
}
