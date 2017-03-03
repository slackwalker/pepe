var irc_colors = require('irc-colors')

var badge = {
  pepe: [
    irc_colors.green('(l)-(l)' ),
    irc_colors.green('/_____\\'),
    irc_colors.green('\\_____/')
  ],
  flag: [
    irc_colors.bgwhite      ('           '),
    irc_colors.yellow.bgblue(' T R U M P '),
    irc_colors.bgred        ('           ')
  ]
}

var joins = [
  {
    badge: badge.flag,
    // https://twitter.com/realDonaldTrump/status/831837514226921472
    text:
      'This Russian connection non-sense is merely an attempt to cover-up ' +
      'the many mistakes made in Hillary Clinton\'s losing campaign.'
  },
  {
    // https://twitter.com/realDonaldTrump/status/266035509162303492
    text:
      'This election is a total sham and a travesty. We are not a democracy!'
  },
  {
    // https://twitter.com/realDonaldTrump/status/357836961605627907
    text:
      'Isn\'t it crazy that people of little or no talent or success can ' +
      'be so critical of those whose accomplishments are great with no ' +
      'retribution'
  },
  {
    // https://twitter.com/realDonaldTrump/status/270558656502837248
    text:
      'It makes me feel so good to hit "sleazebags" back -- much better ' +
      'than seeing a psychiatrist (which I never have!)'
  },
  {
    // https://twitter.com/realdonaldtrump/status/258584864163500033
    text:
      'My twitter has become so powerful that I can ' +
      'actually make my enemies tell the truth.'
  },
  {
    // https://twitter.com/realDonaldTrump/status/265827946240032769
    text:
      'Why is Obama playing basketball today? That is why our country is in ' +
      'trouble!'
  },
  {
    // https://twitter.com/realDonaldTrump/status/257552283850653696
    text: 'I have never seen a thin person drinking Diet Coke.'
  },
  {
    // https://twitter.com/realDonaldTrump/status/332308211321425920
    text:
      'Sorry losers and haters, but my I.Q. is one of the highest -and you ' +
      'all know it! Please don\'t feel so stupid or insecure,it\'s not your ' +
      'fault',
  },
  {
    // https://twitter.com/realDonaldTrump/status/330359969813770242
    text:
      'Amazing how the haters & losers keep tweeting the name “F**kface Von ' +
      'Clownstick” like they are so original & like no one else is doing it...'
  },
  {
    // https://twitter.com/realdonaldtrump/status/516382177798680576
    text:
      'Every time I speak of the haters and losers I do so with great love ' +
      'and affection. They cannot help the fact that they were born fucked up!'
  },
  {
    // https://twitter.com/realdonaldtrump/status/302549902255325184
    text:
      'If I’m the third most envied man in America, the small group of ' +
      'haters and losers must be nauseas.'
  }
]

var parts = [
  // https://twitter.com/realDonaldTrump/status/815185071317676033
  'Happy New Year to all, including to my many enemies and those who ' +
  'have fought me and lost so badly they just don\'t know what to do. Love!',
  // https://twitter.com/realdonaldtrump/status/602571404861636608
  'I would like to wish everyone, including all haters and losers (of which, ' +
  'sadly, there are many) a truly happy and enjoyable Memorial Day!',
  // https://twitter.com/realdonaldtrump/status/584647721883148288
  'I wish everyone, including the haters and losers, a very happy Easter!',
  // https://twitter.com/realdonaldtrump/status/550399835682390016
  'To EVERYONE, including all haters and losers, HAPPY NEW YEAR. Work hard, ' +
  'be smart and always remember,  WINNING TAKES CARE OF EVERYTHING!',
  // https://twitter.com/realDonaldTrump/status/484923950917353473
  'Happy 4th of July to everyone,  including the haters and losers!',
  // https://twitter.com/realdonaldtrump/status/478018343967162369
  'I would like to wish all fathers, even the haters and losers, a very ' +
  'happy Fathers Day.',
  // https://twitter.com/realdonaldtrump/status/405778664039534592
  'Happy Thanksgiving to all--even the haters and losers!',
  // https://twitter.com/realdonaldtrump/status/399883997997969408
  'Happy Veterans Day to ALL, in particular to the haters and losers who ' +
  'have no idea how lucky they are!!!',
  // https://twitter.com/realdonaldtrump/status/346050284222558209
  'Happy Father\'s Day to all, even the haters and losers!'
]

function get_message(messages, index) {
  index = parseInt(index)
  if (Number.isInteger(index)) {
    index = index < messages.length ? index : messages.length - 1
  } else {
    index = Math.floor(Math.random() * messages.length)
  }
  return messages[index]
}

exports.join_message = function(index) {
  // joins are structured objects that need to be composed
  var message = get_message(joins, index)
  var message_badge = message.badge || badge.pepe
  var number_of_lines = message_badge.length
  var message_words = message.text.split(' ')
  var words_per_line = Math.ceil(message_words.length / number_of_lines)

  var messages = []
  for (var i = 0; i < number_of_lines; i++) {
    messages.push(
      message_badge[i] + '  ' + irc_colors.red(
        message_words.slice(i * words_per_line, (i + 1) * words_per_line)
        .join(' ')
      )
    )
  }
  return messages
}

exports.part_message = function(index) {
  // parts are simple strings and can be directly returned
  return get_message(parts, index)
}
