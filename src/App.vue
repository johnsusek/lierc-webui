<template>
    <main>
        <div class="layout-left">
            <user-menu :connection="connection"></user-menu>
            <br>
            <channel-list :channels="channels"></channel-list>
        </div>

        <div class="layout-right flex-grow flex-column flex-display">
            <div class="layout-top">
                <channel-topic></channel-topic>
            </div>

            <div class="flex-grow flex-display">
                <div class="layout-middle flex-grow">
                    <div v-show="!isAnyChannelBeingViewed">
                        <console :console="console"></console>
                    </div>
                    <message-list></message-list>
                </div>
                <div><!-- layout-inspector --></div>
            </div>

            <div class="layout-bottom">
                <user-input></user-input>
            </div>
        </div>

    </main>
</template>

<script>
    import UserMenu from './components/UserMenu'
    import ChannelList from './components/ChannelList'
    import ChannelTopic from './components/ChannelTopic'
    import UserInput from './components/UserInput'
    import MessageList from './components/MessageList'
    import Console from './components/Console'
    import liercEventStream from './store/liercEventStream'
    import store from './store'
    import _ from 'lodash'

    export default {
        data: function() {
            return {
                channels: store.channels,
                connection: store.connection,
                console: store.console
            }
        },
        computed: {
            isAnyChannelBeingViewed() {
                return !!_.find(this.channels, 'isBeingViewed')
            }
        },
        components: {
            UserMenu, ChannelList, ChannelTopic, UserInput, MessageList, Console
        },
        ready() {
            liercEventStream.open()
        },
        beforeDestroy() {
            liercEventStream.close()
        },
        events: {
            'CHANGE-CHANNEL'(channel) {
                store.changeChannelBeingViewed(channel)
                this.$broadcast('CHANNEL-CHANGED', channel)
            }
        }
    }
</script>

<style>
    html, body {
        height: 100%;
        overflow: hidden;
    }
    .muted {
        color: rgba(192,192,192,0.8) !important;
        border-color: rgba(192,192,192,0.2) !important;
    }
</style>

<style scoped>
    main {
        height: 100%;
        display: flex;
    }
    .flex-column {
        flex-direction: column;
    }
    .flex-grow {
        flex-grow: 1;
    }
    .flex-display {
        display: flex;
    }

    .layout-left {
        padding: 0;
        height: 100%;
        padding: 1rem;
        overflow-x: hidden;
        overflow-y: auto;
        min-width: 210px;
    }
    .layout-right {
    }
    .layout-top {
    }
    .layout-middle {
        /*min-width: 320px;*/
        padding: 0 1em 0 0;
        overflow: auto;
        color: #000;
    }
    .layout-bottom {
        padding: 0 1em 0 0;
    }
</style>