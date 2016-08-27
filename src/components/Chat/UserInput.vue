<template>
    <form class="ui form">
        <div class="field">
            <input type="text" v-model="message" v-on:keyup.enter.stop.prevent="send" title="Shortcut: &lt;Enter&gt;">
        </div>
    </form>
</template>

<script>
    import { getActiveChannelConnectionId, getActiveChannel } from '../../vuex/getters'
    import { sendCommand } from '../../vuex/actions'
    import _ from 'lodash'

    export default {
        vuex: {
            actions: {
                sendCommand
            },
            getters: {
                getActiveChannelConnectionId,
                getActiveChannel
            }
        },
        data() {
            return {
                message: ''
            }
        },
        methods: {
            send() {
                if (this.message === '') {
                    return
                }
                let command = ''
                if (_.startsWith(this.message, '/')) {
                    command = this.message.substring(1)
                }
                else {
                    command = `PRIVMSG ${this.getActiveChannel.name} :${this.message}`
                }
                this.message = ''
                this.sendCommand(this.getActiveChannelConnectionId, command)
            }
        }
    }
</script>

<style scoped>
    .ui.form input {
        margin: 1rem 0;
    }
</style>