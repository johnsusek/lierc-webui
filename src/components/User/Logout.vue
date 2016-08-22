<template>
    <div></div>
</template>

<script>
    import { logoutUser, resetState } from '../../vuex/actions'

    export default {
        vuex: {
            actions: {
                logoutUser,
                resetState
            }
        },
        route: {
            activate: function() {
                this.logoutUser().then(() => {
                    this.resetState()
                    this.$router.go('/login')
                })
            }
        }
    }
</script>
