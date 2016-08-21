import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import liercEventStream from '../api/liercEventStream'

Vue.use(Vuex)

const state = {
    activeChannel: {},
    lierc: {
        user: '',
        isAuthenticated: false,
        connections: [
            // {
            //     id: '',
            //     config: {
            //         host: '',
            //         nick: '',
            //         pass: '',
            //         port: 0,
            //         ssl: false,
            //         user: '',
            //         channels: ['']
            //     }
            // }
        ]
    },
    connections: {
            // id: {
            //     nick: '',
            //     console: {
            //         messages: [ { message: '', command: '', timestamp: '' } ]
            //     },
            //     channels: [
            //         {
            //             name: '',
            //             topic: '',
            //             isJoined: true,
            //             unreadCount: 0,
            //             receivedInitialUserList: false,
            //             receivedInitialTopic: false,
            //             users: [''],
            //             messages: [
            //                 {
            //                     type: 'user',
            //                     user: 'alice',
            //                     message: 'content',
            //                     timestamp: ''
            //                 },
            //                 {
            //                     type: 'system',
            //                     message: 'content',
            //                     timestamp: ''
            //                 }
            //             ]
            //         }
            //     ]
            // }
    }
}

const mutations = {
    //
    // Console events
    //
    CONSOLE_NEW_MESSAGE(state, connectionId, command, message, timestamp) {
        if (!state.connections[connectionId]) {
            console.log('Tried to log a console message for a connection that doesn\'t exist', connectionId, command, message)
            return
        }
        state.connections[connectionId].console.messages.push({ command, message, timestamp })
    },
    //
    // Channel events
    //
    CHANNEL_USER_JOIN(state, connectionId, channel, nick, timestamp) {
        if (nick === state.connections[connectionId].nick) {
            state.connections[connectionId].channels.push({
                name: channel,
                topic: '',
                users: [],
                isJoined: true,
                receivedInitialUserList: false,
                receivedInitialTopic: false,
                unreadCount: 0,
                messages: []
            })
        }
        else {
            addMessageToChannel(state, connectionId, channel, `${nick} joined.`, 'system', '', timestamp)
            const chan = _.find(state.connections[connectionId].channels, ['name', channel])
            chan.users.push(nick)
            chan.users.sort()
        }
    },
    CHANNEL_USER_PART(state, connectionId, channelName, nick, timestamp) {
        const channel = _.find(state.connections[connectionId].channels, ['name', channelName])
        if (nick === state.connections[connectionId].nick) {
            channel.isJoined = false
            channel.receivedInitialUserList = false
        }
        else {
            addMessageToChannel(state, connectionId, channelName, `${nick} left.`, 'system', '', timestamp)
        }
        channel.users = _.without(channel.users, nick)
    },
    CHANNEL_USERS_UPDATED(state, connectionId, channelName, users) {
        const channel = _.find(state.connections[connectionId].channels, ['name', channelName])
        channel.receivedInitialUserList = true
        channel.users = _(channel.users.concat(users)).uniq().value()
    },
    CHANNEL_NEW_MESSAGE(state, connectionId, name, message, type, user, timestamp) {
        const channel = _.find(state.connections[connectionId].channels, ['name', name])
        if (channel !== state.activeChannel) {
            channel.unreadCount++
        }
        addMessageToChannel(state, connectionId, name, message, type, user, timestamp)
    },
    CHANNEL_TOPIC_CHANGE(state, connectionId, channelName, topic) {
        const channel = _.find(state.connections[connectionId].channels, ['name', channelName])
        channel.receivedInitialTopic = true
        channel.topic = topic
    },
    //
    // User events
    //
    USER_RENAME(state, connectionId, oldName, newName, timestamp) {
        _.each(state.connections[connectionId].channels, function(channel) {
            if (channel.users.indexOf(oldName) >= 0) {
                addMessageToChannel(state, connectionId, channel.name, `${oldName} changed name to ${newName}.`, 'system', '', timestamp)
                channel.users[channel.users.indexOf(oldName)] = newName
                channel.users.sort()
            }
        })
    },
    USER_QUIT(state, connectionId, user, timestamp) {
        _.each(state.connections[connectionId].channels, function(channel) {
            if (channel.users.indexOf(user) >= 0) {
                addMessageToChannel(state, connectionId, channel.name, `${user} quit.`, 'system', '', timestamp)
                channel.users = _.without(channel.users, user)
            }
        })
    },
    //
    // Connection events
    //
    CONNECTION_CONNECTED(state, connectionId, nick) {
        // Find a connection with this id, if there's none then
        // add it to the object
        const connection = state.connections[connectionId]
        if (!connection) {
            Vue.set(state.connections, connectionId, {
                nick: nick,
                console: {
                    messages: []
                },
                channels: []
            })
        }
    },
    //
    // UI events
    //
    UI_CHANNEL_SELECT(state, channel) {
        Vue.set(state, 'activeChannel', channel)
        channel.unreadCount = 0
    },
    //
    // liercd events
    //
    LIERC_IS_AUTHENTICATED(state, user) {
        liercEventStream.open()
        state.lierc.user = user
        state.lierc.isAuthenticated = true
    },
    LIERC_CONNECTION_ADDED(state, connection, id) {
        state.lierc.connections.push({
            id: id,
            config: {
                host: connection.Host,
                nick: connection.Nick,
                pass: '',
                port: connection.Port,
                ssl: connection.Ssl,
                user: connection.User,
                channels: []
            }
        })
    },
    LIERC_CONNECTION_REMOVED(state, id) {
        let connectionToRemove = _.find(state.lierc.connections, ['id', id])
        state.lierc.connections = _.without(state.lierc.connections, connectionToRemove)
    },
    LIERC_CONNECTIONS_RECEIVED(state, connections) {
        state.lierc.connections = []
        for (let connection of connections) {
            state.lierc.connections.push({
                id: connection.id,
                config: {
                    host: connection.Config.Host,
                    nick: connection.Config.Nick,
                    pass: connection.Config.Pass,
                    port: connection.Config.Port,
                    ssl: connection.Config.Ssl,
                    user: connection.Config.User,
                    channels: connection.Config.Channels
                }
            })
        }
    },
    //
    // AJAX events
    //
    AJAX_TRANSPORT_ERROR(state, error, response) {
        console.error('Received error response during transport:', error, response)
    },
    AJAX_SERVICE_ERROR(state, error, response) {
        console.error('Received 200 but got unexpected data:', error, response)
    },
    //
    // App events
    //
    STATE_RESET(state) {
        liercEventStream.close()

        Vue.set(state, 'lierc', {
            user: '',
            isAuthenticated: false,
            connections: []
        })

        Vue.set(state, 'connections', {})
    }
}

function addMessageToChannel(state, connectionId, name, message, type, user, timestamp) {
    const channel = _.find(state.connections[connectionId].channels, ['name', name])

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
