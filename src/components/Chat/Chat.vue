<template>
    <main class="flex-display" tabindex="0" v-on:keyup.enter="focusInput" v-on:keyup.esc="blurInput">
        <div class="layout-left">
            <channels-list></channels-list>
        </div>

        <div class="layout-right flex-grow flex-column flex-display">
            <div class="layout-top flex-display">
                <channel-topic class="flex-grow"></channel-topic>
                <main-menu></main-menu>
            </div>

            <div class="flex-grow flex-display">
                <channel-messages v-for="channel in getChannels" :channel="channel" class="layout-middle flex-grow"></channel-messages>
                <div class="layout-inspector"></div>
            </div>

            <div class="layout-bottom">
                <user-input v-ref:user-input></user-input>
            </div>
        </div>

    </main>
</template>

<script>
    import MainMenu from './MainMenu'
    import ChannelsList from './ChannelsList'
    import ChannelTopic from './ChannelTopic'
    import UserInput from './UserInput'
    import ChannelMessages from './ChannelMessages'
    import { getChannels } from '../../vuex/getters'

    export default {
        vuex: {
            getters: {
                getChannels
            }
        },
        components: {
            MainMenu, ChannelsList, ChannelTopic, UserInput, ChannelMessages
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

<style scoped>
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
        padding: 1rem 0 0 1rem;
    }
    .layout-inspector {
    }
    .layout-middle {
        padding: 0 1em;
        overflow: auto;
        color: #000;
    }
    .layout-bottom {
        padding: 0 1em;
        flex-shrink: 0;
    }
</style>