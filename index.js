var MovieNotifer = require('./lib/movie-notify');
var Telegram = require('node-telegram-bot');

var telegram = new Telegram({
  token: 'XXXXXXXXX:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
});

var peopleToNotify = [
  // Mice
  140672561,
  // Ishan
  93174221
];

var notifier = new MovieNotifer({
  interval: 2000,
  search: 'DeadPool'
});

notifier.listen();

notifier.on('found', function() {
  console.log('FOUND!!');
  peopleToNotify.forEach(function(person){
    telegram.sendMessage({
      chat_id: person,
      text: 'You can now buy DeadPool tickets at Savoy3D.'
    });
  });
});
