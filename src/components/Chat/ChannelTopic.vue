<template>
    <div>
        <h3 v-show="activeChannel.name" class="ui header">
            {{ activeChannel.name }}
            <div class="sub header muted">
                {{ activeChannel.users ? activeChannel.users.length : 0 }} users
                <span v-show="activeChannel.topic">&mdash; {{ activeChannel.topic }}</span>
            </div>
        </h3>
    </div>
</template>

<script>
    import { sendCommand } from '../../vuex/actions'
    import { getActiveChannel, getActiveChannelConnectionId } from '../../vuex/getters'

    export default {
        vuex: {
            actions: {
                sendCommand
            },
            getters: {
                activeChannel: getActiveChannel,
                connectionId: getActiveChannelConnectionId
            }
        },
        watch: {
            activeChannel(channel) {
                if (!channel.receivedInitialTopic) {
                    this.sendCommand(this.connectionId, `TOPIC ${channel.name}`).then(() => {
                        channel.receivedInitialTopic = true
                    })
                }
                if (!channel.receivedInitialUserList) {
                    this.sendCommand(this.connectionId, `NAMES ${channel.name}`).then(() => {
                        channel.receivedInitialUserList = true
                    })
                }
            }
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin: 0.5em 0 0.2em;
    }
</style>