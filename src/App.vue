<template>
    <main>
        <div>left stuff</div>
        <div class="flex-grow flex-column flex-display">
            <div>top stuff</div>
            <div class="flex-grow flex-display">
                <div class="flex-grow">layout-content</div>
                <div>layout-sidebar</div>
            </div>
            <div>bottom stuff</div>
        </div>
    </main>
</template>

<script>
    import Hello from './components/Hello'

    export default {
        components: {
            Hello
        }
    }
</script>

<style>
    html, body {
        height: 100%;
    }
</style>

<style scoped>
    main {
        height: 100%;
        display: flex;
    }
    .flex-column {
        flex-direction: column;
    }
    .flex-grow {
        flex-grow: 1;
    }
    .flex-display {
        display: flex;
    }
</style>