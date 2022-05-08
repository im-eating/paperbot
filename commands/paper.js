const Discord = require('discord.js')

var paperFacts = ['Around 100 B.C., the Chinese invented paper from hemp. They later began to use tree bark, bamboo, and other plant fibers to create paper',
                  'The English word “paper” is derived from the Egyptian word “papyrus”',
                  'Americans use more than 90 million short tons of paper and paperboard every year',
                  'Johannes Gutenberg printed the first Bible on parchment–that is, sheep skin. In fact, he used the skins of 300 sheep to end up with the final product',
                  '1 pine tree can produce about 80,500 sheets of paper',
                  'Our “paper money” isn’t really paper at all. Instead, U.S. paper currency is composed of 75% cotton and 25% linen',
                  'American businesses use enough paper every day to circle the globe 20 times',
                  'The machine that extracts and prepares tree fibers for papermaking is called Hollander',
                  'Recycling one ton of paper saves 17 trees!',
                  'Largest producers of paper by quantity in the world are US and Canada. After them come Finland, Japan and Sweden',
                  'Toilet paper started being produced in late 9th century China',
                  '42% of industrial wood industry is dedicated to paper production',
                  'Paper industry is the 4th largest contributor of the greenhouse gas emissions in the US',
                  'During its lifetime, one American citizen uses 465 trees for its paper needs',
                  'Paper is a thin, flexible material that is cut into sheets and made by pressing wood fibers together',
                  'You can die from a paper cut',
                  'Papyrus was made from the Cyperus papyrus plant',
                  'A watermark is a visible pattern or image in paper and appears when light is directly passed through it',
                  'Paper can be divided into seven different categories: printing paper, wrapping paper, writing paper, blotting paper, drawing paper, handmade paper and specialty paper',
                  'Joseph Gayetty is credited with inventing the first commercially successful modern day toilet paper',
                  'The world record for the largest single sheet of paper was set on August 7th, 2015. It was created by 250 students from Colegio Salesiano Don Bosco de Ypacarai and measured approximately 49 feet by 32 feet',
                  'To produce a ton of paper we need about 115,000 liters of water',
                  'Paper can be recycled up to 11 times in different types of cardboard',
                  'A typical school wastes 360,000 sheets of paper per year',
                  'According to Xerox, an average office worker uses around 10,000 sheets of photocopy paper every year',
                  'Al is not paper'
                 ]

module.exports = {
  name: 'paper',
  description: 'Replies with a paper fact',
  expectedArgs: '',
  category: 'Facts',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' paper');
    var paperNum = await Math.floor((Math.random() * paperFacts.length));
    message.reply(paperFacts[paperNum]);
  },
  permissions: [],
  requiredRoles: [],
}
