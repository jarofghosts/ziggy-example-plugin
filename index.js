module.exports = function (ziggy) {
  ziggy.on('authed', function (user) {
    ziggy.say(user.nick, 'You\'re authorized! Go hog wild!');
  })

  ziggy.on('pm', function (user, text) {
    var bits = text.split(' ')
      , command = bits[0]

    if(command[0] !== '!') return

    if(!user.info.authenticated) {
      return ziggy.say(user.nick, 'You\'re not authorized. Bummer :(')
    }

    switch(command) {
      case '!join':
        bits[1] && ziggy.join(bits[1])
        break

      case '!part':
        bits[1] && ziggy.part(bits[1])
        break

      case '!say':
        bits[1] && bits[2] && ziggy.say(
            bits[1]
          , bits.slice(2).join(' ')
        )
        break

      case '!me':
        bits[1] && bits[2] && ziggy.action(
            bits[1]
          , bits.slice(2).join(' ')
        )
        break

      case '!deop':
        if(user.info.userLevel < 3) return ziggy.say(user.nick, 'Cut it out.')
        if(bits.length < 3) {
          return ziggy.say(user.nick, 'usage: !deop <channel> <nick>')
        }
        if(ziggy.level(bits[1]) !== '@') {
          return ziggy.say(user.nick, 'how am i supposed to do that?')
        }

        ziggy.deop(bits[1], bits[2])
        break

      case '!op':
        if(user.info.userLevel < 3) return ziggy.say(user.nick, 'Cut it out.')
        if(bits.length < 3) {
          return ziggy.say(user.nick, 'usage: !op <channel> <nick>')
        }
        if(ziggy.level(bits[1]) !== '@') {
          return ziggy.say(user.nick, 'how am i supposed to do that?')
        }

        ziggy.op(bits[1], bits[2])
        break

      case '!topic':
        var channel = bits[1],
            topic = text.substring(bits[1].length + 8)

        ziggy.topic(channel, topic)
        break

      case '!nick':
        if(user.info.userLevel < 3) {
          return ziggy.say(user.nick, 'Jump back, punk!')
        }

        ziggy.nick(bits[1])
        break

      case '!adduser':
        if(user.info.userLevel < 3) {
          return ziggy.say(
              user.nick, 'Ah ah ah, you didn\'t say the magic word.'
          )
        }
        if(!bits[1]) return ziggy.say(user.nick, 'Need a name, chief.')

        var userName = bits[1]
          , userObject = {}

        userObject[userName] = {}
        userObject[userName].userLevel = +bits[2] || 1
        ziggy.register(userObject)

        break

      case '!quit':
        if(user.info.userLevel < 3) {
          return ziggy.say(user.nick, 'need more cred.')
        }

        var message = text.length > 6 ? text.substring(6) : 'G\'bye.'
        ziggy.disconnect(message)
        break
    }
  })
}
