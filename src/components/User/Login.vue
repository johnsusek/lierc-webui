<template>
    <main class="ui middle aligned two column grid">
        <div class="fifteen wide mobile eight wide tablet seven wide computer centered column">
            <div class="ui basic segment" :class="{ 'loading': formIsProcessing }">
                <h2 class="ui header">
                    Login
                    <div class="sub header">If don't have an account <a v-link="{ path: '/register' }" class="item">register here</a></div>
                </h2>
                <form class="ui form" method="POST" v-on:submit.prevent="login">
                    <div class="field">
                        <label>Email</label>
                        <input v-on:keydown.enter.stop.prevent="login" type="text" name="email" placeholder="example@example.org">
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input v-on:keydown.enter.stop.prevent="login" type="password" name="pass">
                    </div>
                    <button class="ui blue button" type="submit">Login</button>
                    <div class="ui error message"></div>
                </form>
            </div>
        </div>
    </main>
</template>

<script>
    import Vue from 'vue'
    import { checkUserAuthStatusAndSetId, refreshConnections, loginUser } from '../../vuex/actions'

    export default {
        data() {
            return {
                formIsProcessing: false,
                form: {}
            }
        },
        vuex: {
            actions: {
                checkUserAuthStatusAndSetId,
                refreshConnections,
                loginUser
            }
        },
        methods: {
            login() {
                if (!this.form.form('is valid')) {
                    return
                }
                // See https://developer.mozilla.org/en-US/docs/Web/API/FormData/
                var formData = new FormData(this.form[0])
                this.formIsProcessing = true

                this.loginUser(formData).then((response) => {
                    if (response.json().status === 'ok') {
                        this.checkUserAuthStatusAndSetId().then(() => {
                            this.$router.go('/chat')
                        })
                    }
                    else {
                        this.form.form('add errors', [response.text()])
                    }
                }, (response) => {
                    this.form.form('add errors', [response.json().error])
                })
            }
        },
        ready() {
            this.form = $(this.$el).find('.ui.form')
            this.form.form({
                inline: true,
                fields: {
                    email: ['email', 'empty'],
                    pass: ['minLength[8]', 'empty']
                }
            })
        },
        beforeDestroy() {
            this.form.form('destroy')
        },
        route: {
            activate: function() {
                Vue.nextTick(() => {
                    this.form.find('input:first').focus()
                })
            },
            deactivate: function() {
                this.form.find('.ui.error.message').empty()
                this.form.form('set value', 'pass', '')
                this.formIsProcessing = false
            }
        }
    }
</script>
