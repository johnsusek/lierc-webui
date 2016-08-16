<template>
    <div>
        <div v-for="message in activeChannel.messages" class="ui basic vertical segment">
                <span v-if="message.user" class="ui basic label" :style='hslFromName(message.user)'>{{ message.user }}</span>
                <span class="ui basic muted label">{{ message.timestamp }}</span>
                <br>
                {{ message.message }}
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['activeChannel'],
        methods: {
            hslFromName(user) {
                return { 'border-color': intToHSL(getHashCode(user)) }
            }
        }
    }

    // Based on:
    // http://stackoverflow.com/a/21682946
    // Convert string to an HSL value
    const getHashCode = function(value) {
        var hash = 0
        if (value.length === 0) return hash
        for (var i = 0; i < value.length; i++) {
            hash = value.charCodeAt(i) + ((hash << 5) - hash)
            hash = hash & hash // Convert to 32bit integer
        }
        return hash
    }

    const intToHSL = function(value) {
        var shortened = value % 360
        return 'hsl(' + shortened + ', 100%, 70%)'
    }
</script>

<style scoped>
    .ui.basic.vertical.segment {
        padding-bottom: 0.25em;
    }
</style>