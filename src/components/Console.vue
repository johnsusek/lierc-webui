<template>
    <div class="ui">
        <div v-for="message in console.messages" class="ui vertical segment">
            {{ message.timestamp }} - {{ message.message }}
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

