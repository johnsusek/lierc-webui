<template>
    <div class="ui basic segment container" :class="{ 'loading': isLoading }">

        <h2 class="ui header">Create connection</h2>

        <form class="ui form" method="POST" v-on:submit.prevent="create">
          <div class="required field">
            <label>Host</label>
            <input type="text" name="host" v-model="config.host" placeholder="chat.freenode.net">
          </div>
          <div class="required field">
            <label>Nickname</label>
            <input type="text" name="nick" v-model="config.nick">
          </div>
          <div class="required field">
            <label>Port</label>
            <input type="text" name="port" v-model="config.port" placeholder="6667">
          </div>
          <div class="inline field">
              <div class="ui checkbox">
                <input type="checkbox" name="ssl" v-model="config.ssl" class="hidden">
                <label>SSL</label>
              </div>
          </div>
          <div class="field">
            <label>Username</label>
            <input type="text" name="user" v-model="config.user">
          </div>
          <div class="field">
            <label>Password</label>
            <input type="password" name="pass" v-model="config.pass">
          </div>
          <button class="ui primary button" type="submit">Create</button>
          <div class="ui error message"></div>
        </form>
    </div>
</template>

<script>
    import { createConnection, addConnectionToList } from '../vuex/actions'

    export default {
        vuex: {
            actions: {
                createConnection,
                addConnectionToList
            }
        },
        data: function() {
            return {
                isLoading: false,
                config: {
                    host: '',
                    nick: '',
                    port: null,
                    ssl: false,
                    user: '',
                    pass: ''
                }
            }
        },
        ready() {
            $(this.$el).find('.ui.checkbox').checkbox()
            this.form = $(this.$el).find('.ui.form')
            this.form.form({
                inline: true,
                fields: {
                    host: {
                        identifier: 'host',
                        rules: [
                            {
                                type: 'empty'
                            }
                        ]
                    },
                    nick: {
                        identifier: 'nick',
                        rules: [
                            {
                                type: 'empty'
                            }
                        ]
                    },
                    port: {
                        identifier: 'port',
                        rules: [
                            {
                                type: 'integer'
                            },
                            {
                                type: 'empty'
                            }
                        ]
                    }
                }
            })
        },
        methods: {
            create() {
                if (!this.form.form('is valid')) {
                    return
                }
                this.isLoading = true
                let connection = {
                    'Host': this.config.host,
                    'Port': parseInt(this.config.port),
                    'Ssl': this.config.ssl,
                    'Nick': this.config.nick,
                    'User': this.config.user,
                    'Pass': this.config.pass,
                    'Channels': []
                }

                this.createConnection(connection).then((response) => {
                    if (response.json().success === 'ok') {
                        this.addConnectionToList(connection, response.json().id)
                        this.$router.go('/connections')
                    }
                    else {
                        this.form.form('add errors', [response.text()])
                    }
                }, (response) => {
                    this.form.form('add errors', [response.json().error])
                }).then(() => {
                    this.isLoading = false
                })
            }
        }
    }
</script>
