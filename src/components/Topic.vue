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
