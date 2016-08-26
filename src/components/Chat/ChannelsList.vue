<template>
    <div>
        <div class="ui vertical menu">
            <a v-for="channel in getChannels"
               class="link item"
               @click="selectChannel(channel)"
               :class="{ 'active': channel == getActiveChannel }">
                {{ channel.name }}
                <div v-show="channel.unreadCount" class="ui mini basic label">{{ channel.unreadCount }}</div>
            </a>
        </div>
    </div>
</template>

<script>
    import { selectChannel } from '../../vuex/actions'
    import { getChannels, getActiveChannel } from '../../vuex/getters'

    export default {
        vuex: {
            actions: {
                selectChannel
            },
            getters: {
                getChannels,
                getActiveChannel
            }
        }
    }
</script>

<style scoped>
    .ui.vertical.menu {
        width: 12em;
    }
</style>