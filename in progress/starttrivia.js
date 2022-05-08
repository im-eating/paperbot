const Discord = require('discord.js')

module.exports = {
  name: 'starttrivia',
  description: 'starts the trivia game',
  usage: 'starttrivia [time]',

  async run (client, message, params, paramsCom) {
    console.log(message.author.tag + ' starttrivia')
    const timeLimit = parseInt(params[0])*1000
    const quiz = require('../getJSON/triv.json');
    trivia(timeLimit, quiz, 0)


    function trivia(timeLimit, quiz, qNum) {


      var item = quiz[qNum];
      var filter = response => {
      	return item.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase());
      };

      message.channel.send(item.question).then(() => {
      	message.channel.awaitMessages(filter, { max: 1, time: timeLimit, errors: ['time'] })
      		.then(collected => {
      			message.channel.send(`${collected.first().author} got the correct answer!`);
            setTimeout(function(){ }, 100);
            console.log(qNum)
            console.log(quiz.length)
            if (qNum < (quiz.length-1)) {
              message.channel.send('next question');
              setTimeout(function(){trivia(timeLimit, quiz, qNum+1)}, 2000);
            } else {
              return message.channel.send('Game Over')
            }
      		})
      		.catch(collected => {
      			message.channel.send('No one got the answer');
            if (qNum < (quiz.length-1)) {

              message.channel.send('next question');
              setTimeout(function(){trivia(timeLimit, quiz, qNum+1)}, 2000);

            } else {
              return message.channel.send('Game Over')
            }
      		});
      });


    }
  }


}
