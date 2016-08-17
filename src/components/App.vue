<template>
    <main>
        <div class="layout-left">
            <user-menu></user-menu>
            <br>
            <channel-list></channel-list>
        </div>

        <div class="layout-right flex-grow flex-column flex-display">
            <div class="layout-top">
                <channel-topic></channel-topic>
            </div>

            <div class="flex-grow flex-display">
                <div class="layout-middle flex-grow">
                    <console v-show="!userHasSelectedChannel"></console>
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
    import UserMenu from './UserMenu'
    import ChannelList from './ChannelList'
    import ChannelTopic from './ChannelTopic'
    import UserInput from './UserInput'
    import MessageList from './MessageList'
    import Console from './Console'
    import liercEventStream from '../api/liercEventStream'
    import { userHasSelectedChannel } from '../vuex/getters'

    export default {
        vuex: {
            getters: {
                userHasSelectedChannel
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