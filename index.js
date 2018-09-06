var IRC = require('irc-framework')
var irc_colors = require('irc-colors')
var moment = require('moment')
var nconf = require('nconf')

var messages = require('./messages.js')
var twitter = require('./twitter.js')

nconf.argv().env().file({ file: './config.json' })

nconf.defaults({
  irc: {
    host: 'irc.deepshell.net',
    port: 6667,
    nick: 'pepe',
    username: 'thefrog',
    gecos: 'Literally Hitler'
  }
})

var irc_client = new IRC.Client()
irc_client.connect(nconf.get('irc'));

irc_client.on('message', function(event) {
  if (event.message.match(/^!join /)) {
    var to_join = event.message.split(' ')[1]
    event.reply('Joining ' + to_join + '..')
    irc_client.join(to_join)
  }

  if (event.message.match(/^!part /)) {
    var to_part = event.message.split(' ')[1];
    event.reply('Leaving ' + to_part + '..')

    var message = messages.part_message()
    irc_client.part(to_part, message)
  }

  twitter.handle_message(event.message, resp => {
    event.reply(format_header(resp))
    event.reply(format_tweet(resp))
    if (resp.quoted_status) {
      event.reply('| ' + format_header(resp.quoted_status))
      event.reply('| ' + format_tweet(resp.quoted_status))
    }
  })
})

irc_client.on('join', function(event) {
  if (event.nick === irc_client.user.nick) {
    var message = messages.join_message()
    if (message.constructor === Array) {
      for (var i = 0, len = message.length; i < len; i++) {
        irc_client.say(event.channel, message[i])
      }
    } else if (typeof message === 'string') {
      irc_client.say(event.channel, message)
    }
  }
})

function format_header(tweet) {
  var date_format = 'ddd MMM DD HH:mm:ss ZZ YYYY'

  var age = ' -- ' + moment(tweet.created_at, date_format).fromNow()
  var ident = irc_colors.blue('@' + tweet.user.screen_name)
  if (tweet.user.name) {
    ident = tweet.user.name + ' (' + ident + ')'
  }
  ident += tweet.user.verified ? irc_colors.cyan(' (✓)') : ''

  return irc_colors.bold(ident) + irc_colors.olive(age) + ':'
}

function format_tweet(tweet) {
  return (tweet.full_text)
    .replace(/\n/g, ' ' + irc_colors.green('↵') + ' ')
    .replace(/&amp;/g, '&')
    .replace(/&gt;/g, '>')
    .replace(/&lt;/g, '<')
}
