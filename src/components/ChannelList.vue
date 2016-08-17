<template>
    <div>
        Channels
        <span class="muted">({{ channels.length }})</span>
        <i class="muted add circle link icon"></i>

        <div class="ui small vertical menu">
            <a @click="selectChannel(channel)"
               v-for="channel in channels"
               class="item"
               :class="{ 'muted': !channel.isJoined, 'active': channel.isBeingViewed }">
                <span class="content">{{ channel.name }}</span>
            </a>
        </div>
    </div>
</template>

<script>
    import { selectChannel } from '../vuex/actions'
    import { getChannels } from '../vuex/getters'

    export default {
        vuex: {
            actions: {
                selectChannel
            },
            getters: {
                channels: getChannels
            }
        }
    }
</script>
