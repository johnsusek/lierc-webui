<template>
    <h3 v-show="channel.name" class="ui header">
        {{ channel.name }}
        <div class="sub header muted">
            <div class="ui dropdown">
                {{ channel.users.length }} users
                <div class="ui menu">
                    <div v-for="user in channel.users" class="item">{{ user }}</div>
                </div>
            </div>
            &mdash; {{ channel.topic }}
        </div>
    </h3>
</template>

<script>
    export default {
        data() {
            return {
                channel: {}
            }
        },
        ready() {
            $(this.$el).find('.ui.dropdown').dropdown()
        },
        beforeDestroy() {
            $(this.$el).find('.ui.dropdown').dropdown('destroy')
        },
        events: {
            'CHANNEL-CHANGED'(channel) {
                this.channel = channel
            }
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin: 0.5em 0 0.2em;
    }
</style>