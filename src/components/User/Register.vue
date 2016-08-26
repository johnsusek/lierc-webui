
<template>
    <main class="ui middle aligned two column grid">
        <div class="fifteen wide mobile eight wide tablet seven wide computer centered column">

            <div v-if="hasJustRegistered" class="ui middle aligned grid">
                <div class="twelve wide column">
                    <h2 class="ui header">
                        Registration successful
                        <div class="sub header">You may now login with the email address and password you chose.</div>
                    </h2>
                </div>
                <div class="four wide right aligned right column">
                    <button v-link="{ path: '/login' }" class="ui primary button">Login</button>
                </div>
            </div>
            <div v-else class="ui basic segment" :class="{ 'loading': formIsProcessing }">
                <h2 class="ui header">
                  <div class="content">
                    Register
                    <div class="sub header">If you already have an account <a v-link="{ path: '/login' }" class="item">login here</a></div>
                  </div>
                </h2>
                <form class="ui form" method="POST" v-on:submit.prevent="register">
                    <div class="field">
                        <label>Email</label>
                        <input v-on:keydown.enter.stop.prevent="register" type="text" name="email" placeholder="example@example.org">
                    </div>
                    <div class="field">
                        <label>Password</label>
                        <input v-on:keydown.enter.stop.prevent="register" type="password" name="pass">
                    </div>
                    <button class="ui primary button" type="submit">Register</button>
                    <div class="ui error message"></div>
                </form>
            </div>

        </div>
    </main>
</template>

<script>
    import Vue from 'vue'
    import { registerUser } from '../../vuex/actions'

    export default {
        data() {
            return {
                hasJustRegistered: false,
                formIsProcessing: false,
                form: {}
            }
        },
        vuex: {
            actions: {
                registerUser
            }
        },
        methods: {
            register() {
                if (this.form.form('is valid')) {
                    var formData = new FormData(this.form[0])
                    this.formIsProcessing = true
                    this.registerUser(formData).then((response) => {
                        if (response.json().status === 'ok') {
                            this.hasJustRegistered = true
                        }
                        else {
                            console.error('Got a status of 200 in response, but status not ok in json', response)
                            this.form.form('add errors', [response.text()])
                        }
                    }, (response) => {
                        this.form.form('add errors', [response.json().error])
                    }).then(() => {
                        this.formIsProcessing = false
                    })
                }
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
            this.form.find('input:first').focus()
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
                this.hasJustRegistered = false
            }
        }
    }
</script>
