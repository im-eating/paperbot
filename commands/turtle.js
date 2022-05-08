const Discord = require('discord.js')

var turtleQuotes = ['Many turtles are able to retract their heads and feet into their shells',
                   'Turtles are placed in the two suborders based on the method of retraction',
                   'Pleurodires pull their heads in sideways',
                   'Cryptodires draw their heads straight back into the shell',
                   'Terrapins live on land and in water, usually in swamps, ponds, lakes and rivers',
                   'Tortoises are land animals',
                   'Tortoise feet are round and stumpy, adapted for walking on land',
                   'Tortoises dig burrows with their strong forelimbs, and slip underground when the sun gets too hot',
                   'Turtles spend most of their lives in water',
                   'Turtles are adapted for aquatic life, with webbed feet or flippers and a streamlined body',
                   'Sea turtles rarely leave the ocean, except to lay eggs in the sand',
                   'Freshwater turtles live in ponds and lakes, and they climb out of the water onto logs or rocks to bask in the warm sun',
                   'One of the smallest turtles is the speckled Cape tortoise',
                   'The Cape tortoise shell is 3.1 inches (7.9 cm) long. It weighs about 5 ounces (142 grams)',
                   'Baby sea turtles migrate to nearshore coastal areas where they continue to grow and mature',
                   'Through satellite tracking, researchers have discovered that loggerheads in the Pacific have a highly migratory life stage',
                   'Hatchlings enter the ocean from nesting beaches in Japan and Australia',
                   'Some turtles undertake a trans-Pacific developmental migration across the Pacific Ocean to feeding grounds off the coast of Baja California, Mexico, Peru and Chile That\'s nearly 8,000 miles!',
                   'Unlike other turtles, sea turtles cannot retract their flippers and head into their shells',
                   'The turtles\'s streamlined shells and large paddle-shaped flippers make them very agile and graceful swimmers',
                   'In the water, turtle used their rear flippers as rudders for steering.',
                   'As reptiles, sea turtles breathe air, but they have the ability, under natural conditions, to remain submerged for hours at a time',
                   'Sea turtles can sleep underwater',
                   'Most sea turtles spend their entire life at sea, only returning to nesting beaches to lay eggs',
                   'In the Pacific Islands, green turtles often come ashore to bask on the beach',
                   'Turtles evolved millions of years ago, and as such are among the oldest groups of reptiles',
                   'As pets, certain species of turtles can live to be 10-150+!',
                   'The largest turtles weigh more than a thousand pounds',
                   'The largest sea turtle species—the leatherback turtle—can weigh between 600 and 2,000 pounds and grow up to 8 feet in length.',
                   'Al is not a turtle'
                  ]

module.exports = {
  name: 'turtle',
  description: 'Replies with a turtle fact',
  expectedArgs: '',
  category: 'Facts',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' turtle');
    var turtleNum = await Math.floor((Math.random() * turtleQuotes.length));
    message.reply(turtleQuotes[turtleNum]);
  },
  permissions: [],
  requiredRoles: [],
}
