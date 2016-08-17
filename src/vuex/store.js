import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'

Vue.use(Vuex)

const state = {
    apiConfig: {
        ircEventsURL: 'http://lierc-webui.local:8080/api/events'
    },
    connection: {
        username: 'johnsolo'
    },
    console: {
        messages: [
            // {
            //     message: '',
            //     command: '',
            //     timestamp:
            // }
        ]
    },
    channels: [
        // {
        //     name: '',
        //     topic: '',
        //     isJoined: true,
        //     isBeingViewed: true,
        //     unreadCount: 0,
        //     users: ['', ...],
        //     messages: [
        //         {
        //             type: 'user',
        //             user: 'alice',
        //             message: 'content',
        //             timestamp:
        //         },
        //         {
        //             type: 'system',
        //             message: 'content',
        //             timestamp:
        //         }
        //     ]
        // }
    ]
}

const mutations = {
    CONSOLE_ADD_MESSAGE(state, command, message, timestamp) {
        state.console.messages.push({ command, message, timestamp })
    },
    CHANNEL_CREATE(state, channelName) {
        const channel = _.find(state.channels, ['name', channelName])

        if (channel) {
            console.error('Tried to create a channel that already exists', name)
            return
        }

        state.channels.push({
            name: channelName,
            topic: '',
            users: [],
            isJoined: true,
            isBeingViewed: false,
            unreadCount: 0,
            messages: []
        })
    },
    CHANNEL_LEAVE(state, channelName) {
        const channel = _.find(state.channels, ['name', channelName])

        if (!channel) {
            console.error('Tried to leave a channel that doesn\'t exist', channelName)
            return
        }

        channel.isJoined = false
    },
    CHANNEL_SET_TOPIC(state, channelName, topic) {
        const channel = _.find(state.channels, ['name', channelName])

        if (!channel) {
            console.error('Tried to set topic for a channel that doesn\'t exist', channelName)
            return
        }

        channel.topic = topic
    },
    CHANNEL_SET_USERS(state, channelName, users) {
        const channel = _.find(state.channels, ['name', channelName])

        if (!channel) {
            console.error('Tried to set topic for a channel that doesn\'t exist', channelName)
            return
        }

        channel.users = users
    },
    CHANNEL_ADD_MESSAGE(state, name, message, type, user, timestamp) {
        addMessageToChannel(state, name, message, type, user, timestamp)
    },
    CHANNEL_ADD_USER(state, channelName, user) {
        const channel = _.find(state.channels, ['name', channelName])

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
    },
    CHANNEL_REMOVE_USER(state, channelName, user) {
        const channel = _.find(state.channels, ['name', channelName])

        if (!channel.users) {
            console.warn('Tried to remove user from an undefined user list')
            return
        }

        if (channel.users.indexOf(user) < 0) {
            console.warn('Tried to remove user from a channel they weren\'t in')
            return
        }

        channel.users = _.without(channel.users, user)
    },
    USER_RENAME(state, oldName, newName, timestamp) {
        _.each(state.channels, function(channel) {
            if (channel.users.indexOf(oldName) >= 0) {
                addMessageToChannel(state, channel.name, `${oldName} changed name to ${newName}.`, 'system', '', timestamp)
                channel.users[channel.users.indexOf(oldName)] = newName
                channel.users.sort()
            }
        })
    },
    USER_QUIT(state, user, timestamp) {
        _.each(state.channels, function(channel) {
            if (channel.users.indexOf(user) >= 0) {
                addMessageToChannel(state, channel.name, `${user} quit.`, 'system', '', timestamp)
                channel.users = _.without(channel.users, user)
            }
        })
    },
    CHANNEL_SELECT(state, channel) {
        for (let otherChannel of state.channels) {
            if (otherChannel !== channel) {
                otherChannel.isBeingViewed = false
            }
        }
        channel.isBeingViewed = true
    }
}

function addMessageToChannel(state, name, message, type, user, timestamp) {
    const channel = _.find(state.channels, ['name', name])

    if (channel) {
        if (!channel.messages) {
            channel.messages = []
        }
        channel.messages.push({ type, user, message, timestamp })
    }
    else {
        console.error('Tried to send message to channel that doesn\'t exist', name, message)
    }
}

export default new Vuex.Store({
    state,
    mutations
})
