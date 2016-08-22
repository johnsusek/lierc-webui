<template>
    <div class="service-menu">
        <div class="ui right pointing icon dropdown basic button">
            <i class="setting icon"></i>
            <div class="menu">
                <div class="header">
                    {{ serviceUser }}
                </div>
                <div class="divider"></div>
                <a v-link="{ path: '/chat' }" class="item">Chat</a>
                <a v-link="{ path: '/connections' }" class="item">Connections</a>
                <a v-link="{ path: '/logout' }" class="item">Logout</a>
            </div>
        </div>
    </div>
</template>

<script>
    import { getServiceUser } from '../../vuex/getters'

    export default {
        vuex: {
            getters: {
                serviceUser: getServiceUser
            }
        },
        ready() {
            $(this.$el).find('.ui.dropdown').dropdown({ action: 'hide' })
        }
    }
</script>

<style scoped>
    .service-menu {
        margin: 1em;
    }
</style>