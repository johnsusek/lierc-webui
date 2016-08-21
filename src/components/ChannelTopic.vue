<template>
    <div>
        <h3 v-if="activeChannel" class="ui header">
            {{ activeChannel.name }}
            <div class="sub header muted">
                {{ activeChannel.users.length }} users
                <span v-show="activeChannel.topic">&mdash; {{ activeChannel.topic }}</span>
            </div>
        </h3>
    </div>
</template>

<script>
    import { getActiveChannel } from '../vuex/getters'

    export default {
        vuex: {
            getters: {
                activeChannel: getActiveChannel
            }
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin: 0.5em 0 0.2em;
    }
</style>