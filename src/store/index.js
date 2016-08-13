const store = {
    config: {
        username: 'johnsolo',
        rootURL: 'http://lierc-webui.local:5004/',
        sessionID: '2zfbuYhqSURN2De31RJJ2c'
    },
    ircEvents: [],
    interface: {
        activeChannelOrDirectMessage: '#example' // or a username
    },
    connections: [
        {
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

store.startEventStream = function() {
    const eventSource = new EventSource(`${this.config.rootURL}${this.config.sessionID}/events/${this.config.username}`)
    eventSource.onmessage = function(event) {
        store.ircEvents.push(JSON.parse(event.data))
    }
    eventSource.onerror = function(event) {
        console.error(event)
    }
}

