<template>
    <div v-show="channel == getActiveChannel">
        <div class="ui small feed">
            <div v-for="message in channel.messages" track-by="timestamp" class="event">
                <div v-if="message.type == 'user'" class="content">
                    <div class="summary">
                        {{ message.user }}
                        <div class="date">{{ message.timestamp }}</div>
                    </div>
                    {{ message.message }}
                </div>
                <div v-else class="content muted">
                    {{ message.message }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { getActiveChannel } from '../vuex/getters'

    export default {
        props: ['channel'],
        vuex: {
            getters: {
                getActiveChannel
            }
        },
        ready() {
            this.$watch('channel.messages', () => {
                this.$el.parentNode.scrollTop = this.$el.parentNode.scrollHeight
            })
        }
    }
</script>

<style scoped>
</style>