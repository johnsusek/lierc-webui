<template>
    <div></div>
</template>

<script>
    import { userIsAuthenticated } from '../vuex/getters'
    import { checkUserAuthStatusAndSetId } from '../vuex/actions'

    export default {
        vuex: {
            getters: {
                userIsAuthenticated
            },
            actions: {
                checkUserAuthStatusAndSetId
            }
        },
        ready() {
            this.checkUserAuthStatusAndSetId().then(function() {
                if (this.userIsAuthenticated) {
                    this.$router.go('/chat')
                }
                else {
                    this.$router.go('/login')
                }
            })
        }
    }
</script>
