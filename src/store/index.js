import _ from 'lodash'

const store = {
    apiConfig: {
        ircEventsURL: 'http://lierc-webui.local:8080/api/events'
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
        username: 'johnsolo',
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
        //         { type: 'user',   user: 'alice', message: 'content', timestamp: Date() },
        //         { type: 'system',                message: 'content', timestamp: Date() }
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

store.createOrUpdateChannel = function(name, { isJoined, topic, users }) {
    const channel = _.find(this.channels, ['name', name])

    if (channel) {
        if (isJoined) {
            channel.isJoined = true
        }
        if (topic) {
            channel.topic = topic
        }
        if (users) {
            channel.users = _.uniq(channel.users.concat(users)).sort()
        }
    }
    else {
        this.channels.push({
            name,
            topic: topic || '',
            users: users || [],
            isJoined: !!isJoined,
            unreadCount: 0,
            messages: []
        })
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

store.addUserToChannel = function(channelName, user) {
    const channel = _.find(this.channels, ['name', channelName])

    if (!channel.users) {
        channel.users = []
    }
    else if (channel.users.indexOf(user) >= 0) {
        console.warn('Tried to add a user to a channel they already were in')
    }
    else {
        channel.users.push(user)
        channel.users.sort()
    }
}

store.removeUserFromChannel = function(channelName, user) {
    const channel = _.find(this.channels, ['name', channelName])

    if (!channel.users) {
        console.warn('Tried to remove user from an undefined user list')
    }
    else if (channel.users.indexOf(user) < 0) {
        console.warn('Tried to remove user from a channel they weren\'t in')
    }
    else {
        channel.users = _.without(channel.users, user)
    }
}

store.renameUser = function(oldName, newName) {
    _.each(this.channels, function(channel) {
        if (channel.users.indexOf(oldName) >= 0) {
            channel.users[channel.users.indexOf(oldName)] = newName
            channel.users.sort()
        }
    })
}

store.quitUser = function(user, timestamp) {
    _.each(this.channels, function(channel) {
        if (channel.users.indexOf(user) >= 0) {
            store.addMessageToChannel(channel.name, `${user} quit.`, { type: 'system', timestamp })
            channel.users = _.without(channel.users, user)
        }
    })
}

store.setTopicForChannel = function(channelName, topic) {
    const channel = _.find(this.channels, ['name', channelName])
    channel.topic = topic
}
