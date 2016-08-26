<template>
    <div>
        <router-view keep-alive></router-view>
    </div>
</template>

<script>
    import store from '../vuex/store'
    import { userIsAuthenticated } from '../vuex/getters'
    import { checkUserAuthStatusAndSetId, resetState } from '../vuex/actions'

    export default {
        store,
        vuex: {
            actions: {
                checkUserAuthStatusAndSetId,
                resetState
            },
            getters: {
                userIsAuthenticated
            }
        },
        ready() {
            this.checkUserAuthStatusAndSetId().then(function() {
                if (!this.userIsAuthenticated) {
                    this.resetState()
                    this.$router.go('/login')
                }
            })
        }
    }
</script>

<style>
    html, body, main, #app {
        height: 100%;
        overflow: hidden;
    }
</style>
