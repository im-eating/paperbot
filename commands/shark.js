const Discord = require('discord.js')

var sharkQuotes = ['Whale sharks can grow to be 60-plus feet long — that\'s a solid 20 feet longer than a school bus.',
                   'In actuality, there are nine different hammerhead species. Some can be quite large, up to 18 feet, while the smallest species can be just 3 feet long.',
                   'Sharks tend to be solitary creatures, but scalloped hammerheads like to be around friends and family! ',
                   'The younger hammerheads likely stay together for protection, but it\'s unclear why full-grown sharks would stick together.',
                   'Great whites are named for their white underbellies.',
                   'Great white sharks have 300 razor sharp teeth in their jaws.',
                   'Great whites don\'t tend to like the taste of humans. Instead, when they attack, it\'s theorized that they\'re just getting a test bite',
                   'Another species, the mako shark, is known to leap 20 feet out of the water.',
                   'Mako sharks are also known for their incredible speed. They\'ve been known to reach speeds of 31 miles per hour.',
                   'Shark embryos attack each other.',
                   'For sharks, survival of the fittest begins before birth. According to Live Science, shark litter-mates all compete until the largest embryo eats all but one of their siblings.',
                   'A great white shark\'s bite packs a punch of almost 4,000 pounds per square inch ...That\'s four times as strong as the bite of a tiger or lion.',
                   'According to PETA, you have a one in 3.7 million chance of being killed by a shark.',
                   'The smallest shark is the Dwarf Shark, which is approximately the length of the average man\’s hand.',
                   'A large meal may last the shark up to three months without it having to eat again.',
                   'More people are killed every year by bee stings, lightening or soda machines falling on them than by sharks.',
                   'Sharks attack more men than women.',
                   'The Bull Shark can live in fresh water or sea water.',
                   'Sharks can hear a fish swimming over one mile away, and can smell one drop of blood in a million drops of water.',
                   'The upper and lower jaws of the shark are able to move, unlike humans and most other animals.',
                   'A shark may lose and grow up to 30,000 teeth in its lifetime.',
                   'Two-thirds of the brain of a shark is dedicated to its sense of smell.',
                   'Oil in the liver is what keeps the shark from sinking as its density is lower than that of the surrounding water.',
                   'The Oceanic White-tipped Shark is the most dangerous living shark in terms of human attacks as it does not fear divers or swimmers.',
                   'The Portuguese Shark can dive more than 1.5 miles, or 2.7 kilometres, below the surface of the ocean.',
                   'Females are usually larger than males and have thicker skin to withstand the bites of males wanting to mate with them.',
                   'Sharks can detect the electrical impulse emitted by a standard AA battery one mile away.',
                   'There are approximately 75 species of shark on the endangered list.',
                   'Goblin sharks can be a bright pink colour.',
                   'For most sharks, their body temperature is cold, like the temperature of the water they swim in.  But unlike most sharks, great white sharks are partially warm-blooded, allowing them to move faster when hunting prey.',
                   'All sharks have a \'sixth sense\' that helps them hone in on prey during the final phase of attack: the ‘amupllae of lorenzini’ are found on sharks\' snouts and can sense the electric fields emitted by animals in the surrounding water.',
                   'Many sharks lay eggs, but some give birth to live young, just like we do. Shark pregnancies can last from a few months to well over a couple of years. That’s longer than whales or elephants!',
                   'Greenland sharks, which live in cold polar waters, hold the record as the oldest known vertebrate animals on the planet. Since they are estimated to live as long as 500 years, there could be some alive today that were born in the Middle Ages.',
                   'Carpet sharks live on the ocean floor and have elaborate patterns to blend in with perfect camouflage. The Tasseled Wobbegong shark takes this to the extreme, with a fringe of feathery ‘tassels’ around its body.',
                   'Epaulette sharks have developed a cunning ability to hold their breath and walk over rocks and land using their fins and tail. This lets them check out the seafood buffet in neighboring rockpools at low tide.',
                   'Hammerhead sharks elongated heads not only give them supersense when it comes to electromagnetic detection, but they also have almost 360-degree surround vision.',
                   'Al is not a shark.'
                  ]

module.exports = {
  name: 'shark',
  description: 'Replies with a shark fact',
  expectedArgs: '',
  category: 'Facts',
  permissionError: '',
  minArgs: 0,
  maxArgs: 1,
  callback: async (message, paramsCom) => {
    console.log(message.author.tag + ' shark');
    var sharkNum = await Math.floor((Math.random() * sharkQuotes.length));
    message.reply(sharkQuotes[sharkNum]);
  },
  permissions: [],
  requiredRoles: [],
}
