import store from '../store'

const ircEventStream = {}

export default ircEventStream

ircEventStream.open = function() {
    const source = new EventSource(`${store.apiConfig.rootURL}${store.apiConfig.sessionID}/events/${store.apiConfig.username}`)

    source.addEventListener('irc', (event) => {
        switch (event.type) {
        case 'irc':
            const eventData = JSON.parse(event.data)
            store.ircEvents.push(eventData) // for any components that just want a raw data feed of the irc events
            ircEventStream.parseEvent(eventData)
            break
        case 'ping':
            break
        default:
            console.warn('found an eventstream type we didn\'t handle:', event.type, event)
        }
    })

    source.addEventListener('error', (event) => {
        // TODO: Reconnect logic
        console.error(event)
    })
}

ircEventStream.close = function() {
    this.eventSource.close()
}

ircEventStream.parseEvent = function(e) {
    if (replyNames[e.Command]) {
        e.Command = replyNames[e.Command]
    }

    if (e.Command !== 'PING') {
        console.log('Command to parse: ', e.Command, e)
    }

    const msg = { command: e.Command, timestamp: Date(e.Time) }

    switch (e.Command) {
    case 'JOIN':
        msg.message = `JOIN channel ${e.Params[0]} by ${e.Prefix.Name}`
        break
    case 'PART':
        msg.message = `PART channel ${e.Params[0]} by ${e.Prefix.Name}`
        break
    case 'QUIT':
        // Params[0] is the quit message
        msg.message = `QUIT irc ${e.Params[0]} by ${e.Prefix.Name}`
        break
    case 'PRIVMSG':
        msg.message = `PRIVMSG "${e.Params[1]}" to channel ${e.Params[0]} by ${e.Prefix.Name}`
        break
    case 'TOPIC':
        msg.message = `TOPIC in channel ${e.Params[0]} to "${e.Params[1]}" by ${e.Prefix.Name}`
        break
    case 'RPL_TOPIC':
        msg.message = `REPLY: TOPIC. The user ${e.Params[0]} in channel ${e.Params[1]} had set topic "${e.Params[2]}"`
        break
    case 'NICK':
        msg.message = `NICK to ${e.Params[0]} from ${e.Prefix.Name}`
        break
    case 'RPL_NAMREPLY':
        msg.message = `REPLY: NAMES. The user ${e.Params[0]} (${e.Params[1]})? is in channel ${e.Params[2]} with users "${e.Params[3]}"`
        break
    case 'RPL_ENDOFNAMES':
        msg.message = 'REPLY: NAMES. The previous NAMES reply was the last.'
        break
    case 'RPL_WELCOME': // Note https://github.com/martynsmith/node-irc/blob/master/lib/irc.js#L123
    case 'RPL_YOURHOST':
    case 'RPL_CREATED':
    case 'RPL_MYINFO':
    case 'RPL_ISUPPORT':
    case 'RPL_MOTD':
    case 'RPL_MOTDSTART':
    case 'RPL_ENDOFMOTD':
    case 'ERR_NOMOTD':
        msg.message = e.Params[1]
        break
    case 'PING':
        break
    default:
        msg.message = 'Unknown IRC command'
        console.warn('found an irc command we didn\'t handle:', e.Command, e)
    }

    store.console.messages.push(msg)
}

// https://tools.ietf.org/html/rfc1459#section-4
// https://www.alien.net.au/irc/irc2numerics.html
const replyNames = {
    '001': 'RPL_WELCOME',
    '002': 'RPL_YOURHOST',
    '003': 'RPL_CREATED',
    '004': 'RPL_MYINFO',
    '005': 'RPL_ISUPPORT',
    '200': 'RPL_TRACELINK',
    '201': 'RPL_TRACECONNECTING',
    '202': 'RPL_TRACEHANDSHAKE',
    '203': 'RPL_TRACEUNKNOWN',
    '204': 'RPL_TRACEOPERATOR',
    '205': 'RPL_TRACEUSER',
    '206': 'RPL_TRACESERVER',
    '208': 'RPL_TRACENEWTYPE',
    '211': 'RPL_STATSLINKINFO',
    '212': 'RPL_STATSCOMMANDS',
    '213': 'RPL_STATSCLINE',
    '214': 'RPL_STATSNLINE',
    '215': 'RPL_STATSILINE',
    '216': 'RPL_STATSKLINE',
    '218': 'RPL_STATSYLINE',
    '219': 'RPL_ENDOFSTATS',
    '221': 'RPL_UMODEIS',
    '241': 'RPL_STATSLLINE',
    '242': 'RPL_STATSUPTIME',
    '243': 'RPL_STATSOLINE',
    '244': 'RPL_STATSHLINE',
    '250': 'RPL_STATSCONN',
    '251': 'RPL_LUSERCLIENT',
    '252': 'RPL_LUSEROP',
    '253': 'RPL_LUSERUNKNOWN',
    '254': 'RPL_LUSERCHANNELS',
    '255': 'RPL_LUSERME',
    '256': 'RPL_ADMINME',
    '257': 'RPL_ADMINLOC1',
    '258': 'RPL_ADMINLOC2',
    '259': 'RPL_ADMINEMAIL',
    '261': 'RPL_TRACELOG',
    '265': 'RPL_LOCALUSERS',
    '266': 'RPL_GLOBALUSERS',
    '300': 'RPL_NONE',
    '301': 'RPL_AWAY',
    '302': 'RPL_USERHOST',
    '303': 'RPL_ISON',
    '305': 'RPL_UNAWAY',
    '306': 'RPL_NOWAWAY',
    '311': 'RPL_WHOISUSER',
    '312': 'RPL_WHOISSERVER',
    '313': 'RPL_WHOISOPERATOR',
    '314': 'RPL_WHOWASUSER',
    '315': 'RPL_ENDOFWHO',
    '317': 'RPL_WHOISIDLE',
    '318': 'RPL_ENDOFWHOIS',
    '319': 'RPL_WHOISCHANNELS',
    '321': 'RPL_LISTSTART',
    '322': 'RPL_LIST',
    '323': 'RPL_LISTEND',
    '324': 'RPL_CHANNELMODEIS',
    '329': 'RPL_CREATIONTIME',
    '331': 'RPL_NOTOPIC',
    '332': 'RPL_TOPIC',
    '333': 'RPL_TOPICWHOTIME',
    '341': 'RPL_INVITING',
    '342': 'RPL_SUMMONING',
    '351': 'RPL_VERSION',
    '352': 'RPL_WHOREPLY',
    '353': 'RPL_NAMREPLY',
    '364': 'RPL_LINKS',
    '365': 'RPL_ENDOFLINKS',
    '366': 'RPL_ENDOFNAMES',
    '367': 'RPL_BANLIST',
    '368': 'RPL_ENDOFBANLIST',
    '369': 'RPL_ENDOFWHOWAS',
    '371': 'RPL_INFO',
    '372': 'RPL_MOTD',
    '374': 'RPL_ENDOFINFO',
    '375': 'RPL_MOTDSTART',
    '376': 'RPL_ENDOFMOTD',
    '381': 'RPL_YOUREOPER',
    '382': 'RPL_REHASHING',
    '391': 'RPL_TIME',
    '392': 'RPL_USERSSTART',
    '393': 'RPL_USERS',
    '394': 'RPL_ENDOFUSERS',
    '395': 'RPL_NOUSERS',
    '401': 'ERR_NOSUCHNICK',
    '402': 'ERR_NOSUCHSERVER',
    '403': 'ERR_NOSUCHCHANNEL',
    '404': 'ERR_CANNOTSENDTOCHAN',
    '405': 'ERR_TOOMANYCHANNELS',
    '406': 'ERR_WASNOSUCHNICK',
    '407': 'ERR_TOOMANYTARGETS',
    '409': 'ERR_NOORIGIN',
    '411': 'ERR_NORECIPIENT',
    '412': 'ERR_NOTEXTTOSEND',
    '413': 'ERR_NOTOPLEVEL',
    '414': 'ERR_WILDTOPLEVEL',
    '421': 'ERR_UNKNOWNCOMMAND',
    '422': 'ERR_NOMOTD',
    '423': 'ERR_NOADMININFO',
    '424': 'ERR_FILEERROR',
    '431': 'ERR_NONICKNAMEGIVEN',
    '432': 'ERR_ERRONEUSNICKNAME',
    '433': 'ERR_NICKNAMEINUSE',
    '436': 'ERR_NICKCOLLISION',
    '441': 'ERR_USERNOTINCHANNEL',
    '442': 'ERR_NOTONCHANNEL',
    '443': 'ERR_USERONCHANNEL',
    '444': 'ERR_NOLOGIN',
    '445': 'ERR_SUMMONDISABLED',
    '446': 'ERR_USERSDISABLED',
    '451': 'ERR_NOTREGISTERED',
    '461': 'ERR_NEEDMOREPARAMS',
    '462': 'ERR_ALREADYREGISTRED',
    '463': 'ERR_NOPERMFORHOST',
    '464': 'ERR_PASSWDMISMATCH',
    '465': 'ERR_YOUREBANNEDCREEP',
    '467': 'ERR_KEYSET',
    '471': 'ERR_CHANNELISFULL',
    '472': 'ERR_UNKNOWNMODE',
    '473': 'ERR_INVITEONLYCHAN',
    '474': 'ERR_BANNEDFROMCHAN',
    '475': 'ERR_BADCHANNELKEY',
    '481': 'ERR_NOPRIVILEGES',
    '482': 'ERR_CHANOPRIVSNEEDED',
    '483': 'ERR_CANTKILLSERVER',
    '491': 'ERR_NOOPERHOST',
    '501': 'ERR_UMODEUNKNOWNFLAG',
    '502': 'ERR_USERSDONTMATCH'
}