<template>
    <div>
        Channels <span class="muted">({{ channels.length }})</span> <i class="muted add circle link icon"></i>

        <div class="ui small vertical menu">

            <a v-on:click="channel.isBeingViewed = true" v-for="channel in channels" class="item" :class="{ 'muted': !channel.isJoined, 'active': channel.isBeingViewed }">
                <span class="content">{{ channel.name }}</span>
                <span>({{ channel.users.length }})</span>
                <br><br>
                <div v-if="channel.messages[channel.messages.length-1]">{{ channel.messages[channel.messages.length-1].message }}</div>

                <!-- <span class="ui label">{{ channel.messages.length }}</span> -->
<!--                 <div class="ui list">
                    <div class="item" v-for="user in channel.users">{{ user }}</div>
                </div> -->

            </a>

        </div>
    </div>
</template>

<script>
    export default {
        store: ['channels']
    }
</script>
