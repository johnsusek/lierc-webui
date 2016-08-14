<template>
    <div>
        Channels <span class="muted">({{ channels.length }})</span> <i class="muted add circle link icon"></i>

        <div class="ui small vertical menu">
            <a v-for="channel in channels" class="item">
                {{ channel.name }}
                <div v-if="channel.users" class="ui label">{{ channel.users.length }}</div>
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        store: ['channels']
    }
</script>
