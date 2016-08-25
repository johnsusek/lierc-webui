import Vue from 'vue'
import Vuex from 'vuex'
import _ from 'lodash'
import liercEventStream from '../api/liercEventStream'

Vue.use(Vuex)

const state = {
    activeChannel: {},
    lierc: {
        user: '',
        email: '',
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
    CHANNEL_USER_JOIN(state, connectionId, channelName, nick, timestamp) {
        const connection = state.connections[connectionId]

        if (!connection) {
            console.error('Tried join on channel on a connection that doesn\'t exist')
            return
        }

        const channel = _.find(connection.channels, ['name', channelName])

        if (nick === connection.nick) {
            if (channel) {
                console.error('Tried adding a channel that was already created', channelName)
                return
            }

            let insertedChannel = {
                name: channelName,
                topic: '',
                users: [],
                receivedInitialUserList: false,
                receivedInitialTopic: false,
                unreadCount: 0,
                messages: []

            }

            connection.channels.push(insertedChannel)

            state.activeChannel = insertedChannel
        }
        else {
            if (!channel) {
                console.error('Tried to update user list for join on a channel that doesn\'t exist', channelName)
                return
            }
            addMessageToChannel(state, connectionId, channelName, `${nick} joined.`, 'system', '', timestamp)
            channel.users.push(nick)
            channel.users.sort()
        }
    },
    CHANNEL_USER_PART(state, connectionId, channelName, nick, timestamp) {
        const connection = state.connections[connectionId]

        if (!connection) {
            console.error('Tried leave channel on a connection that doesn\'t exist')
            return
        }

        const channel = _.find(state.connections[connectionId].channels, ['name', channelName])

        if (!channel) {
            console.error('Tried to update user list for part on a channel that doesn\'t exist', channel)
            return
        }

        if (nick === connection.nick) {
            connection.channels = _.without(connection.channels, channel)
            if (channel === state.activeChannel) {
                const allChannels = _.sortBy(_.flatMap(state.connections, function(c) {
                    return c.channels
                }), ['name'])

                state.activeChannel = allChannels[0]
            }
        }
        else {
            addMessageToChannel(state, connectionId, channelName, `${nick} left.`, 'system', '', timestamp)
            channel.users = _.without(channel.users, nick)
        }
    },
    CHANNEL_USERS_UPDATED(state, connectionId, channelName, users) {
        const channel = _.find(state.connections[connectionId].channels, ['name', channelName])

        if (!channel) {
            console.error('Tried to update users on a channel that doesn\'t exist', channelName)
            return
        }

        channel.receivedInitialUserList = true
        channel.users = _(channel.users.concat(users)).uniq().value()
    },
    CHANNEL_NEW_MESSAGE(state, connectionId, channelName, message, type, user, timestamp) {
        const channel = _.find(state.connections[connectionId].channels, ['name', channelName])
        if (!channel) {
            console.error('Tried to add message on a channel that doesn\'t exist', channelName)
            return
        }
        if (channel !== state.activeChannel) {
            channel.unreadCount++
        }
        addMessageToChannel(state, connectionId, channelName, message, type, user, timestamp)
    },
    CHANNEL_TOPIC_CHANGE(state, connectionId, channelName, topic) {
        const channel = _.find(state.connections[connectionId].channels, ['name', channelName])

        if (!channel) {
            console.error('Tried to set topic on a channel that doesn\'t exist', channelName)
            return
        }

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
    LIERC_IS_AUTHENTICATED(state, user, email) {
        liercEventStream.open()
        state.lierc.user = user
        state.lierc.email = email
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
        let liercConnectionToRemove = _.find(state.lierc.connections, ['id', id])
        state.lierc.connections = _.without(state.lierc.connections, liercConnectionToRemove)
        Vue.delete(state.connections, id)
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

function addMessageToChannel(state, connectionId, channelName, message, type, user, timestamp) {
    const channel = _.find(state.connections[connectionId].channels, ['name', channelName])

    if (channel) {
        if (!channel.messages) {
            channel.messages = []
        }
        channel.messages.push({ type, user, message, timestamp })
    }
    else {
        console.error('Tried to send message to channel that doesn\'t exist', channelName, message)
    }
}

export default new Vuex.Store({
    state,
    mutations
})
