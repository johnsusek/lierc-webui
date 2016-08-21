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
    .muted {
        color: rgba(192,192,192,0.8) !important;
        border-color: rgba(192,192,192,0.2) !important;
    }
    .ui.form input[type=text]:focus,
    .ui.form input[type=password]:focus {
        border-color: rgba(192,192,192,0.8);
        border-style: dashed;
    }
    .ui.checkbox input:focus~.box:before,
    .ui.checkbox input:focus~label:before {
        border-color: rgba(192,192,192,0.8);
        border-style: dotted;
    }
</style>
