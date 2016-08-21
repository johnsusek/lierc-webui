<template>
    <div>
        <div class="ui fluid borderless vertical menu">
            <a v-for="channel in getChannels"
               class="item"
               @click="selectChannel(channel)"
               :class="{ 'active': channel == getActiveChannel }">
                {{ channel.name }}
                <div v-show="channel.unreadCount" class="ui mini basic grey label">{{ channel.unreadCount }}</div>
            </a>
        </div>
    </div>
</template>

<script>
    import { selectChannel } from '../vuex/actions'
    import { getChannels, getActiveChannel } from '../vuex/getters'

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
        border-radius: 0;
        border: 0;
        box-shadow: none;

    }
    .ui.vertical.menu .item > .label {
        right: 0;
        top: 0.95rem;
        position: absolute;
    }

    .ui.menu .item {
        padding-right: 24px;
        padding-left: 24px;
    }
</style>