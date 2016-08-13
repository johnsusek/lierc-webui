<template>
    <h3 class="ui header">
        {{ channel }}
        <div class="sub header muted">{{ users }} users &mdash; {{ topic }}</div>
    </h3>
</template>

<script>
    export default {
        data() {
            return {
                channel: '#perl',
                users: 2,
                topic: 'Here\'s a topic: Let\'s chat!'
            }
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin: 0.5em 0 0.2em;
    }
</style>