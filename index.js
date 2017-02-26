var IRC = require('irc-framework')
var irc_colors = require('irc-colors')
var twitter = require('./twitter.js')

var config = require('./config.json')

var irc_client

irc_client = new IRC.Client();
irc_client.connect({
    host: 'irc.deepshell.net',
    port: 6667,
    nick: 'pepe',
    username: 'thefrog',
    gecos: 'Literally Hitler'
});

irc_client.on('message', function(event) {
  if (event.message.match(/^!join /)) {
    var to_join = event.message.split(' ')[1]
    event.reply('Joining ' + to_join + '..')
    irc_client.join(to_join)
  }

  if (event.message.match(/^!part /)) {
    var to_part = event.message.split(' ')[1];
    event.reply('Leaving ' + to_part + '..')
    irc_client.part(to_part, 'Happy New Year to all, including to my many enemies and those who have fought me and lost so badly they just don\'t know what to do. Love!')
  }

  twitter.handle_message(event.message, resp => {
    event.reply(resp)
  })
})

irc_client.on('join', function(event) {
  if (event.nick === irc_client.user.nick) {
    // https://twitter.com/realdonaldtrump/status/258584864163500033
    irc_client.say(event.channel, irc_colors.green('(l)-(l)' ) + irc_colors.red('    "My twitter has become so powerful that I can'))
    irc_client.say(event.channel, irc_colors.green('/_____\\') + irc_colors.red('      actually make my enemies tell the truth."'))
    irc_client.say(event.channel, irc_colors.green('\\_____/') + irc_color.grey('                        -- Donald J. Trump'))
  }
})
