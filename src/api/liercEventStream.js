/** liercEventStream connects to lierc, and starts listening for server-sent events
 *  coming in. When an event arrives it updates our Vue store
 *  depending on the IRC command in the event (JOIN, PART, or a numeric code [see replyNames]).
 */

import store from '../vuex/store'

const liercEventStream = {}

export default liercEventStream

liercEventStream.open = function() {
    console.info('Opening liercEventStream')

    this.source = new EventSource('/api/events')

    this.source.addEventListener('irc', (event) => {
        switch (event.type) {
        case 'irc':
            const eventData = JSON.parse(event.data)
            liercEventStream.parseEvent(eventData)
            break
        case 'ping':
            break
        default:
            console.warn('found an eventstream type we didn\'t handle:', event.type, event)
        }
    })

    this.source.addEventListener('error', (event) => {
        // TODO: Reconnect logic
        console.error(event)
    })
}

liercEventStream.close = function() {
    console.info('Closing liercEventStream')
    if (this.source) {
        this.source.close()
    }
}

liercEventStream.parseHistoricalEvents = function(events, channel) {
    for (let event of events) {
        this.parseHistoricalEvent(event, channel)
    }
}

liercEventStream.parseHistoricalEvent = function(e, channelName) {
    if (replyNames[e.Message.Command]) {
        e.Message.Command = replyNames[e.Message.Command]
    }

    switch (e.Message.Command) {

    case 'JOIN':
        store.dispatch('CHANNEL_USER_JOIN_HISTORICAL', e.MessageId, e.ConnectionId, e.Message.Params[0], e.Message.Prefix.Name, e.Message.Time)
        break

    case 'PART':
        store.dispatch('CHANNEL_USER_PART_HISTORICAL', e.MessageId, e.ConnectionId, e.Message.Params[0], e.Message.Prefix.Name, e.Message.Time)
        break

    case 'PRIVMSG':
        store.dispatch('CHANNEL_NEW_MESSAGE_HISTORICAL', e.MessageId, e.ConnectionId, e.Message.Params[0], e.Message.Params[1], 'user', e.Message.Prefix.Name, e.Message.Time)
        break

    case 'TOPIC':
        store.dispatch('CHANNEL_NEW_MESSAGE_HISTORICAL', e.MessageId, e.ConnectionId, e.Message.Params[0], `Topic changed to "${e.Message.Params[1]}" by ${e.Message.Prefix.Name}`, 'system', '', e.Message.Time)
        break

    case 'NICK':
        store.dispatch('USER_RENAME_HISTORICAL', channelName, e.MessageId, e.ConnectionId, e.Message.Prefix.Name, e.Message.Params[0], e.Message.Time)
        break

    case 'QUIT':
        console.log(e)
        store.dispatch('USER_QUIT_HISTORICAL', channelName, e.MessageId, e.ConnectionId, e.Message.Prefix.Name, e.Message.Time)
        break

    case 'RPL_TOPIC':
    case 'RPL_NAMREPLY':
    case 'RPL_ENDOFNAMES':
    case 'RPL_YOURHOST':
    case 'RPL_CREATED':
    case 'RPL_MYINFO':
    case 'RPL_ISUPPORT':
    case 'RPL_MOTD':
    case 'RPL_MOTDSTART':
    case 'RPL_ENDOFMOTD':
    case 'ERR_NOMOTD':
    case 'RPL_NOTOPIC':
    case 'RPL_TOPICWHOTIME':
    case 'PING':
        console.log(e)
        break

    default:
        console.warn('Found a historical irc command we didn\'t handle:', e.Message.Command, e)
    }
}

liercEventStream.parseEvent = function(e) {
    if (replyNames[e.Message.Command]) {
        e.Message.Command = replyNames[e.Message.Command]
    }

    if (e.Message.Command !== 'PING') {
        // console.info(e.Message.Command, e)
    }

    const consoleMessage = { connectionId: e.ConnectionId, command: e.Message.Command, timestamp: e.Message.Time }

    switch (e.Message.Command) {

    case 'JOIN':
    case 'PART':
    case 'PRIVMSG':
    case 'TOPIC':
        var channel = e.Message.Params[0]
        break

    }

    switch (e.Message.Command) {

    // Note https://github.com/martynsmith/node-irc/blob/master/lib/irc.js#L123
    case 'RPL_WELCOME':
        store.dispatch('CONNECTION_CONNECTED', e.ConnectionId, e.Message.Params[0])
        consoleMessage.message = e.Message.Params[1]
        break

    case 'JOIN':
        store.dispatch('CHANNEL_USER_JOIN', e.MessageId, e.ConnectionId, channel, e.Message.Prefix.Name, e.Message.Time)
        consoleMessage.message = `${channel} by ${e.Message.Prefix.Name}`
        break

    case 'PART':
        consoleMessage.message = `${channel} by ${e.Message.Prefix.Name}`
        store.dispatch('CHANNEL_USER_PART', e.MessageId, e.ConnectionId, channel, e.Message.Prefix.Name, e.Message.Time)
        break

    case 'PRIVMSG':
        consoleMessage.message = `"${e.Message.Params[1]}" to channel ${channel} by ${e.Message.Prefix.Name}`
        store.dispatch('CHANNEL_NEW_MESSAGE', e.MessageId, e.ConnectionId, channel, e.Message.Params[1], 'user', e.Message.Prefix.Name, e.Message.Time)
        break

    case 'TOPIC':
        consoleMessage.message = `${channel} to "${e.Message.Params[1]}" by ${e.Message.Prefix.Name}`
        store.dispatch('CHANNEL_NEW_MESSAGE', e.MessageId, e.ConnectionId, channel, `Topic changed to "${e.Message.Params[1]}" by ${e.Message.Prefix.Name}`, 'system', '', e.Message.Time)
        store.dispatch('CHANNEL_TOPIC_CHANGE', e.ConnectionId, channel, e.Message.Params[1])
        break

    case 'NICK':
        consoleMessage.message = `${e.Message.Params[0]} from ${e.Message.Prefix.Name}`
        store.dispatch('USER_RENAME', e.MessageId, e.ConnectionId, e.Message.Prefix.Name, e.Message.Params[0], e.Message.Time)
        break

    case 'QUIT':
        consoleMessage.message = `"${e.Message.Params[0]}" by ${e.Message.Prefix.Name}`
        store.dispatch('USER_QUIT', e.MessageId, e.ConnectionId, e.Message.Prefix.Name, e.Message.Time)
        break

    case 'RPL_TOPIC':
        consoleMessage.message = `The user (you) ${e.Message.Params[0]} in channel ${e.Message.Params[1]} got topic reply, which is: "${e.Message.Params[2]}"`
        store.dispatch('CHANNEL_TOPIC_CHANGE', e.ConnectionId, e.Message.Params[1], e.Message.Params[2])
        break

    case 'RPL_NAMREPLY':
        consoleMessage.message = `The user (you) ${e.Message.Params[0]} (${e.Message.Params[1]})? is in channel ${e.Message.Params[2]} with users "${e.Message.Params[3]}"`
        const users = e.Message.Params[3].split(' ').sort()
        store.dispatch('CHANNEL_USERS_UPDATED', e.ConnectionId, e.Message.Params[2], users)
        break

    case 'RPL_ENDOFNAMES':
        break

    case 'RPL_YOURHOST':
    case 'RPL_CREATED':
    case 'RPL_MYINFO':
    case 'RPL_ISUPPORT':
    case 'RPL_MOTD':
    case 'RPL_MOTDSTART':
    case 'RPL_ENDOFMOTD':
    case 'ERR_NOMOTD':
        console.log(e)
        consoleMessage.message = e.Message.Params[1]
        break

    case 'RPL_NOTOPIC':
    case 'RPL_TOPICWHOTIME':
    case 'PING':
        break

    default:
        consoleMessage.message = `Unknown IRC command ${e.Message.Command}`
        console.warn('Found an irc command we didn\'t handle:', e.Message.Command, e)
    }

    store.dispatch('CONSOLE_NEW_MESSAGE', consoleMessage.connectionId, consoleMessage.command, consoleMessage.message, consoleMessage.timestamp)
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
