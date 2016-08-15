<template>
    <div>
        Channels <span class="muted">({{ channels.length }})</span> <i class="muted add circle link icon"></i>

        <div class="ui small vertical menu">
            <a v-for="channel in channels" class="item">
                <span class="content">{{ channel.name }}</span>
                <span class="ui label">{{ channel.unreadCount }}</span>
                <div v-if="channel.isJoined">isJoined</div>
                <div v-if="channel.users">U: {{ channel.users.length }}</div>
                <div v-if="channel.messages">M: {{ channel.messages.length }}</div>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        store: ['channels']
    }
</script>
