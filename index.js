module.exports = function (ziggy) {
  ziggy.on('authed', function (user) {
    ziggy.say(user.nick, 'You\'re authorized! Go hog wild!');
  });
  ziggy.on('pm', function (user, text) {
    var bits = text.split(' '),
        command = bits[0];
    if (command.substring(0, 1) != '!') return;
    if (!user.info.authenticated) return ziggy.say(user.nick, 'You are not authorized to do that. Bummer :(');
    switch (command) {
      case '!join':
        bits[1] && ziggy.join(bits[1]);
        break;
      case '!part':
        bits[1] && ziggy.part(bits[1]);
        break;
      case '!say':
        bits[1] && bits[2] && ziggy.say(bits[1], text.substring(bits[1].length + 6));
        break;
      case '!me':
        bits[1] && bits[2] && ziggy.action(bits[1], '/me ' + text.substring(bits[1].length + 5));
        break;
      case '!deop':
        if (!user.info.userLevel > 2) return ziggy.say(user.nick, 'Cut it out.');
        if (!bits[1] || !bits[2]) return ziggy.say(user.nick, 'usage: !deop <channel> <nick>');
        if (ziggy.level(bits[1]) != '@') return ziggy.say(user.nick, 'how am i supposed to do that?');
        ziggy.deop(bits[1], bits[2]);
        break;
      case '!op':
        if (!user.info.userLevel > 2) return ziggy.say(user.nick, 'Cut it out.');
        if (!bits[1] || !bits[2]) return ziggy.say(user.nick, 'usage: !op <channel> <nick>');
        if (ziggy.level(bits[1]) != '@') return ziggy.say(user.nick, 'how am i supposed to do that?');
        ziggy.op(bits[1], bits[2]);
        break;
      case '!topic':
        var channel = bits[1],
            topic = text.substring(bits[1].length + 8);
        if (ziggy.level(channel) != '@') return ziggy.say('i can\'t.');
        ziggy.topic(channel, topic);
        break;
      case '!nick':
        if (!user.info.userLevel > 2) return ziggy.say(user.nick, 'Jump back, punk!');
        ziggy.nick(bits[1]);
        break;
      case '!adduser':
        if (!user.info.userLevel > 2) return ziggy.say(user.nick, 'Ah ah ah, you didn\'t say the magic word.');
        if (!bits[1]) return ziggy.say(user.nick, 'Need a name, chief.');
        var userName = bits[1],
            userObject = {};
        userObject[userName] = {};
        userObject[userName].userLevel = bits[2] || 1;
        ziggy.register(userObject);
        break;
      case '!quit':
        if (!user.info.userLevel > 2) return ziggy.say(user.nick, 'You don\'t have sufficient cred to do that.');
        var message = text.length > 6 ? text.substring(6) : 'G\'bye.';
        ziggy.disconnect(message);
        break;
      case '!help':
        ziggy.say(user.nick, 'Supported commands are: !join <channel> !part <channel> !say <to> <msg> and !help');
        break;
      default:
        ziggy.say(user.nick, 'Unrecognized command. Try !help');
        break;
    }
  });
};
