<template>
    <h3 class="ui header text">{{ connection.username }}</h3>
</template>

<script>
    import { getConnection } from '../vuex/getters'

    export default {
        vuex: {
            getters: {
                connection: getConnection
            }
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin-bottom: 0;
    }
</style>