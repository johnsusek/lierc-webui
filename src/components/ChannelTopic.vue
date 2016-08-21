<template>
    <div>
        <h3 v-if="activeChannel" class="ui header">
            {{ activeChannel.name }}
            <div class="sub header muted">
                {{ activeChannel.users.length }} users
                <span v-show="activeChannel.topic">&mdash; {{ activeChannel.topic }}</span>
            </div>
        </h3>
    </div>
</template>

<script>
    import { postMessage } from '../vuex/actions'
    import { getActiveChannel, getActiveChannelConnectionId } from '../vuex/getters'

    export default {
        vuex: {
            actions: {
                postMessage
            },
            getters: {
                activeChannel: getActiveChannel,
                connectionId: getActiveChannelConnectionId
            }
        },
        watch: {
            activeChannel(channel) {
                if (!channel.topic) {
                    this.postMessage(this.connectionId, `TOPIC ${channel.name}`)
                }
                if (!channel.users.length) {
                    this.postMessage(this.connectionId, `NAMES ${channel.name}`)
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