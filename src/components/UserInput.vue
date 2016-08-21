<template>
    <form class="ui form">
        <div class="field">
            <input type="text" v-model="message" v-on:keyup.enter.stop="send" title="Shortcut: &lt;Enter&gt;">
        </div>
    </form>
</template>

<script>
    import { getActiveChannelConnectionId } from '../vuex/getters'
    import { sendCommand } from '../vuex/actions'

    export default {
        vuex: {
            actions: {
                sendCommand
            },
            getters: {
                getActiveChannelConnectionId
            }
        },
        data() {
            return {
                message: ''
            }
        },
        methods: {
            send() {
                console.log(this.message, this.getActiveChannelConnectionId)
                this.sendCommand(this.getActiveChannelConnectionId, this.message)
                this.message = ''
            }
        }
    }
</script>

<style scoped>
    .ui.form input {
        margin: 1rem 0;
    }
</style>