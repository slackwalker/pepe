var irc_colors = require('irc-colors')

var join_messages = [
  [
    // https://twitter.com/realdonaldtrump/status/258584864163500033
    irc_colors.green('(l)-(l)' ) + irc_colors.red( '  My twitter has become so powerful that I can'),
    irc_colors.green('/_____\\') + irc_colors.red( '    actually make my enemies tell the truth.'),
    irc_colors.green('\\_____/')
  ],
  [
    // https://twitter.com/realDonaldTrump/status/831837514226921472
    irc_colors.bgwhite('         ') + irc_colors.red('  This Russian connection non-sense is merely an'),
    irc_colors.bgblue ('         ') + irc_colors.red('   attempt to cover-up the many mistakes made in'),
    irc_colors.bgred  ('         ') + irc_colors.red('       Hillary Clinton\'s losing campaign.')
  ]
]

var part_messages = [
  'Happy New Year to all, including to my many enemies and those who ' +
  'have fought me and lost so badly they just don\'t know what to do. Love!'
]

function get_message(messages, index) {
  index = parseInt(index) || false
  if (index) {
    index = index < messages.length ? index : messages.length - 1
  } else {
    index = Math.floor(Math.random() * messages.length)
  }
  return messages[index]
}

exports.join_message = function(index) {
  return get_message(join_messages, index)
}

exports.part_message = function(index) {
  return get_message(part_messages, index)
}
