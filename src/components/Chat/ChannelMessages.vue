<template>
    <div v-show="channel == getActiveChannel">
        <div class="ui small feed">
            <div v-for="message in channel.messages" track-by="timestamp" class="event">
                <div v-if="message.type == 'user'" class="content">
                    <div class="summary">
                        {{ message.user }}
                        <div class="date">{{ message.timestamp | moment }}</div>
                    </div>
                    {{ message.message }}
                </div>
                <div v-else class="content">
                    {{ message.message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getActiveChannel, getConnections } from '../../vuex/getters'
    import { populateInitialChannelEvents } from '../../vuex/actions'
    import _ from 'lodash'

    export default {
        props: ['channel'],
        vuex: {
            actions: {
                populateInitialChannelEvents
            },
            getters: {
                getActiveChannel,
                getConnections
            }
        },
        methods: {
            connectionId() {
                let connectionId = ''
                _.forEach(this.getConnections, (connection, id) => {
                    if (_.includes(connection.channels, this.channel)) {
                        connectionId = id
                        return true
                    }
                })
                return connectionId
            }
        },
        ready() {
            this.$watch('channel.messages', () => {
                this.$el.parentNode.scrollTop = this.$el.parentNode.scrollHeight
            })
            this.populateInitialChannelEvents(this.connectionId(), this.channel.name)
        }
    }
</script>
