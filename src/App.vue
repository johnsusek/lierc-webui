<template>
    <main>
        <div class="layout-left">
            <user-menu></user-menu>
            <channel-list></channel-list>
        </div>

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
    import UserMenu from './components/UserMenu'
    import ChannelList from './components/ChannelList'

    export default {
        components: {
            UserMenu, ChannelList
        }
    }
</script>

<style>
    html, body {
        height: 100%;
    }
    .muted {
        color: rgba(192,192,192,0.5);
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

    .layout-left {
        /*background: #6435C9;*/
        padding: 1rem;
        height: 100%;
        overflow: scroll;
    }
</style>