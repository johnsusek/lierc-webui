import _ from 'lodash'

const store = {
    apiConfig: {
        username: 'johnsolo',
        rootURL: 'http://lierc-webui.local:8080/api/',
        sessionID: '6rP54rZ8J8ot2tZqo521EZ'
    },
    interface: {
        activeChannelOrDirectMessage: '#example' // or a username
    },
    connection: {
        id: '',
        isConnected: true,
        server: '',
        port: '',
        ssl: false,
        nickname: '',
        username: '',
        password: '',
        autoJoinChannels: []
    },
    console: {
        messages: [
            // { message: '', command: '', timestamp: Date() }
        ]
    },
    channels: [
        // {
        //     name: '#example',
        //     topic: 'Example topic.',
        //     users: ['alice', 'bob', 'charlie'],
        //     isJoined: true,
        //     unreadCount: 0,
        //     messages: [
        //         { type: user, user: 'alice', message: 'content', timestamp: Date() },
        //         { type: system, message: 'content', timestamp: Date() }
        //     ]
        // }
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

store.createOrUpdateChannel = function(name, {isJoined, topic, users}) {
    const channel = _.find(this.channels, ['name', name])

    if (channel) {
        if (isJoined) {
            channel.isJoined = true
        }
        if (topic) {
            channel.topic = topic
        }
        if (users) {
            channel.users = users
        }
    }
    else {
        this.channels.push({ name, topic, users, isJoined })
    }
}

store.addMessageToChannel = function(channelName, message, { type, user, timestamp }) {
    const channel = _.find(this.channels, ['name', channelName])

    if (channel) {
        if (!channel.messages) {
            channel.messages = []
        }
        channel.messages.push({ type, user, message, timestamp })
    }
    else {
        console.error('Tried to send message to channel that doesn\'t exist')
    }
}

