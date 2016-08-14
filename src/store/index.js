import ircEventStream from './ircEventStream'

const store = {
    apiConfig: {
        username: 'johnsolo',
        rootURL: 'http://lierc-webui.local:5004/',
        sessionID: '2zfbuYhqSURN2De31RJJ2c'
    },
    interface: {
        activeChannelOrDirectMessage: '#example' // or a username
    },
    ircEvents: [],
    connections: [
        {
            id: 'apiGeneratedString',
            isConnected: true,
            server: 'irc.freenode.com',
            port: '6667',
            ssl: false,
            nickname: 'Jane Doe',
            username: 'janedoe',
            password: 'secret',
            autoJoinChannels: ['#example', '#example2']
        }
    ],
    console: {
        messages: [
            { message: 'content', timestamp: Date() },
            { message: 'content', timestamp: Date() }
        ]
    },
    channels: [
        {
            name: '#example',
            topic: 'Example topic.',
            users: ['alice', 'bob', 'charlie'],
            isJoined: true,
            unreadCount: 0,
            messages: [
                { user: 'alice', message: 'content', timestamp: Date() }
            ]
        }
    ],
    directMessages: [
        {
            unreadCount: 0,
            user: 'charlie',
            messages: [
                { user: 'charlie', message: 'message from charlie', timestamp: Date() },
                { user: 'johnsusek', message: 'reply!', timestamp: Date() }
            ]
        }
    ]
}

export default store

store.startIRCEventStream = function() {
    ircEventStream.start()
}

store.closeIRCEventStream = function() {
    ircEventStream.close()
}
