var colors = require('colors')
var irc_colors = require('irc-colors')
var moment = require('moment')
var request = require('request-promise')
var Twitter = require('twitter')

var config = require('./config.json')

var exports = module.exports = {}

var twitter_client

var twitter_re = /http(s)?:\/\/twitter\.com\/(?:#!\/)?(\w+)\/status(es)?\/(\d+)/
var twitter_df = 'ddd MMM DD HH:mm:ss ZZ YYYY'

async function connect() {
  var bearer_token_credentials = Buffer.from(
    encodeURIComponent(config.twitter.consumer_key) + ':' +
    encodeURIComponent(config.twitter.consumer_secret)
  ).toString('base64')

  var get_bearer_token_options = {
    uri: 'https://api.twitter.com/oauth2/token',
    method: 'POST',
    body: 'grant_type=client_credentials',
    headers: {
      'Authorization': 'Basic ' + bearer_token_credentials,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    json: true
  }
  var bearer_token = await request(get_bearer_token_options)

  return new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    bearer_token: bearer_token.access_token
  })
}

async function get_tweet(id) {
  if (!twitter_client || typeof twitter_client.get !== 'function') {
    twitter_client = await connect()
  }

  return new Promise(resolve => {
    twitter_client.get(
      'statuses/show', {
        id: id,
        tweet_mode: 'extended'
      },
      (err, tweet, res) => resolve(tweet)
    )
  })
}

function format_console(tweet) {
  var ago = moment(tweet.created_at, twitter_df).fromNow()
  var name = ('@' + tweet.user.screen_name).blue
  if (tweet.user.name) {
    name = tweet.user.name + ' (' + name + ')'
  }
  name += tweet.user.verified ? ' (✓)'.cyan : ''

  return name.bold + ': ' + tweet.full_text + (' -- ' + ago).grey
}

function format_irc(tweet) {
  var ago = moment(tweet.created_at, twitter_df).fromNow()
  var name = irc_colors.blue('@' + tweet.user.screen_name)
  if (tweet.user.name) {
    name = tweet.user.name + ' (' + name + ')'
  }
  name += tweet.user.verified ? irc_colors.cyan(' (✓)') : ''

  var quoted = ''
  if (tweet.quoted_status) {
    quoted = ' [ ' + format_irc(tweet.quoted_status) + ' ]'
  }

  return irc_colors.bold(name) + ': ' + tweet.full_text + irc_colors.grey(' -- ' + ago) + quoted
}

exports.handle_message = function (text, cb) {
  var tweet_match = text.match(twitter_re)
  if (tweet_match && tweet_match[4]) {
    get_tweet(tweet_match[4]).then(tweet => {
      typeof cb === 'function' && cb(format_irc(tweet))
      //console.log(format_console(tweet))
    })
  }
}
