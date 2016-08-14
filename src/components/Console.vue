<template>
    <div class="ui small feed">
        <div v-for="message in console.messages" class="event">
            <div class="content">
                <div class="summary">
                    {{ message.command }}
                    <div class="date">{{ message.timestamp }}</div>
                </div>
                {{ message.message }}
            </div>
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

<style scoped>
</style>
