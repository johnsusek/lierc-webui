<template>
    <h3 v-if="activeChannel" class="ui header">
        {{ activeChannel.name }}
        <div class="sub header muted">{{ activeChannel.users.length }} users &mdash; {{ activeChannel.topic }}</div>
    </h3>
</template>

<script>
    import _ from 'lodash'

    export default {
        store: ['channels'],
        computed: {
            activeChannel() {
                return _.find(this.channels, 'isBeingViewed')
            }
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin: 0.5em 0 0.2em;
    }
</style>