<template>
    <div class="ui">
        <div v-for="message in console.messages" class="ui vertical basic segment">
            <div class="ui small basic label">{{ message.timestamp }}</div>
            <div class="ui small basic label">{{ message.command }}</div>
            <br>{{ message.message }}
        </div>
    </div>
</template>

<script>
    export default {
        store: ['console'],
        ready() {
            this.$watch('console.messages', () => { this.$el.parentNode.scrollTop = this.$el.parentNode.scrollHeight })
        }
    }
</script>

