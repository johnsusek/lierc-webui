<template>
    <div>
        Channels <span class="muted">({{ channels.length }})</span> <i class="muted add circle link icon"></i>

        <div class="ui small vertical menu">
            <a v-on:click="channel.isBeingViewed = true" v-for="channel in channels" class="item" :class="{ 'muted': !channel.isJoined, 'active': channel.isBeingViewed }">
                <span class="content">{{ channel.name }}</span>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        store: ['channels']
    }
</script>
