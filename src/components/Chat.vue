<template>
    <main class="flex-display" tabindex="0" v-on:keyup.enter="focusInput" v-on:keyup.esc="blurInput">
        <div class="layout-left">
            <channels-list></channels-list>
            <!-- <connections-list></connections-list> -->
            <!-- <channel-list></channel-list> -->
        </div>

        <div class="layout-right flex-grow flex-column flex-display">
            <div class="layout-top flex-display">
                <channel-topic class="flex-grow"></channel-topic>
                <service-menu></service-menu>
            </div>

            <div class="flex-grow flex-display">
                <div class="layout-middle flex-grow">
                    <!-- <console v-show="!userHasSelectedChannel"></console> -->
                    <channel-messages v-for="channel in getChannels" :channel="channel"></channel-messages>
                </div>
                <div class="layout-inspector"></div>
            </div>

            <div class="layout-bottom">
                <user-input v-ref:user-input></user-input>
            </div>
        </div>

    </main>
</template>

<script>
    import ServiceMenu from './ServiceMenu'
    import ChannelsList from './ChannelsList'
    import ChannelTopic from './ChannelTopic'
    import UserInput from './UserInput'
    import ChannelMessages from './ChannelMessages'
    import Console from './Console'
    import { getChannels } from '../vuex/getters'

    export default {
        vuex: {
            getters: {
                getChannels
            }
        },
        components: {
            ServiceMenu, ChannelsList, ChannelTopic, UserInput, ChannelMessages, Console
        },
        methods: {
            // TODO: Make this more vue-y, with a mixin or custom directive
            focusInput() {
                this.$refs.userInput.$el.querySelector('input').focus()
            },
            blurInput() {
                this.$refs.userInput.$el.querySelector('input').blur()
                this.$el.focus()
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

    .layout-top {
        padding-left: 1rem;
        flex-shrink: 0;
    }

    .layout-left {
        overflow-x: hidden;
        overflow-y: auto;
        max-width: 320px;
        flex-shrink: 0;
    }
    .layout-inspector {
        background: orange;
    }
    .layout-middle {
        padding: 0 1em;
        overflow: auto;
        color: #000;
    }
    .layout-bottom {
        padding: 0 1em;
    }
</style>