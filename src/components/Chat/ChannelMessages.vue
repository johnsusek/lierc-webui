<template>
    <div v-show="channel == getActiveChannel" @scroll="scrollMessages">
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
    import { populateInitialChannelEvents, populateScrollback } from '../../vuex/actions'
    import _ from 'lodash'

    export default {
        data() {
            return {
                autoScroll: true, // if this is true, automatically scroll to the bottom when new messages come in
                hasBeenSeen: false, // if this channel has been seen in the UI yet
                lastScrollTop: 0,
                loadingScrollback: false
            }
        },
        props: ['channel'],
        vuex: {
            actions: {
                populateInitialChannelEvents,
                populateScrollback
            },
            getters: {
                getActiveChannel,
                getConnections
            }
        },
        methods: {
            scrollMessages() {
                if (this.lastScrollTop > this.$el.scrollTop) {
                    // Upward scroll, this definitely didnt come from autoscroll. dont jump away user will be annoyed
                    this.autoScroll = false

                    if (!this.loadingScrollback && this.$el.scrollTop < 300) {
                        this.loadingScrollback = true
                        const oldHeight = this.$el.scrollHeight
                        const oldScrollTop = this.$el.scrollTop
                        this.populateScrollback(this.connectionId(), this.channel.name, this.channel.messages[0].id).then(() => {
                            this.loadingScrollback = false
                            const newHeight = this.$el.scrollHeight
                            this.$el.scrollTop = (newHeight - oldHeight) + oldScrollTop
                        })
                    }
                }
                else if (!this.autoScroll) {
                    // A downward scroll with autoscroll off, did they hit bottom?
                    if ((this.$el.scrollTop + this.$el.offsetHeight) === this.$el.scrollHeight) {
                        // The user has hit bottom with autoScroll off, turn it back on
                        this.autoScroll = true
                    }
                }
                this.lastScrollTop = this.$el.scrollTop
            },
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
            this.$watch('getActiveChannel', () => {
                if (this.$el.scrollHeight === 0) {
                    return
                }

                if (!this.hasBeenSeen) {
                    // This is the first time the channel became active this session, scroll to bottom
                    this.$el.scrollTop = this.$el.scrollHeight
                    this.hasBeenSeen = true
                }
                else {
                    // Subsequent activation. Checking autoScroll, and if true, we jump to bottom
                    if (this.autoScroll) {
                        this.$el.scrollTop = this.$el.scrollHeight
                    }
                }
            })
            this.$watch('channel.messages', () => {
                if (this.$el.scrollHeight === 0) {
                    return
                }

                if (this.autoScroll) {
                    this.$el.scrollTop = this.$el.scrollHeight

                    if (!this.hasBeenSeen) {
                        // Setting hasBeenSeen true because this channel must be visible and getting messages, so it is seen by definition
                        // (This is the case for the default visible channel)
                        this.hasBeenSeen = true
                    }
                }
            })
            this.populateInitialChannelEvents(this.connectionId(), this.channel.name)
        }
    }
</script>
