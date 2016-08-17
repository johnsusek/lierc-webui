<template>
    <h3 class="ui header text">{{ connection.username }}</h3>
</template>

<script>
    export default {
        props: ['connection']
    }
</script>

<style scoped>
    h3.ui.header {
        margin-bottom: 0;
    }
</style>