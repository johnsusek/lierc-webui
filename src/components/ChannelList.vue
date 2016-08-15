<template>
    <div>
        Channels <span class="muted">({{ channels.length }})</span> <i class="muted add circle link icon"></i>

        <div class="ui small vertical menu">

            <a v-for="channel in channels" class="item">
                <span class="content"><span v-if="channel.isJoined" class="ui tiny label empty circular blue"></span> {{ channel.name }}</span>
                <span v-if="channel.users">({{ channel.users.length }})</span>
                <span class="ui label">{{ channel.messages.length }}</span>
                <br><br>
                <div v-if="channel.messages[channel.messages.length-1]">{{ channel.messages[channel.messages.length-1].message }}</div>

                <div class="ui list">
                    <div class="item" v-for="user in channel.users">{{ user }}</div>
                </div>

            </a>

        </div>
    </div>
</template>

<script>
    export default {
        store: ['channels']
    }
</script>
