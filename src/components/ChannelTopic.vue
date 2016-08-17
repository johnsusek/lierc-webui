<template>
    <h3 v-show="channel" class="ui header">
        {{ channel.name }}
        <div class="sub header muted">
            <div class="ui dropdown">
                {{ channel.users.length }} users
                <div class="ui menu">
                    <div v-for="user in channel.users" class="item">{{ user }}</div>
                </div>
            </div>
            <span v-show="channel.topic">&mdash; {{ channel.topic }}</span>
        </div>
    </h3>
</template>

<script>
    import { getSelectedChannel } from '../vuex/getters'

    export default {
        vuex: {
            getters: {
                channel: getSelectedChannel
            }
        },
        ready() {
            $(this.$el).find('.ui.dropdown').dropdown()
        },
        beforeDestroy() {
            $(this.$el).find('.ui.dropdown').dropdown('destroy')
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin: 0.5em 0 0.2em;
    }
</style>