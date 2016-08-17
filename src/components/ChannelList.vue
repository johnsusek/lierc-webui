<template>
    <div>
        Channels
        <span class="muted">({{ channels.length }})</span>
        <i class="muted add circle link icon"></i>

        <div class="ui small vertical menu">
            <a v-on:click="changeChannel(channel)"
               v-for="channel in channels"
               class="item"
               :class="{ 'muted': !channel.isJoined, 'active': channel.isBeingViewed }">
                <span class="content">{{ channel.name }}</span>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['channels'],
        methods: {
            changeChannel(channel) {
                this.$dispatch('CHANGE-CHANNEL', channel)
            }
        }
    }
</script>
