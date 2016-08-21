<template>
    <div class="ui basic compact segment container" :class="{ 'loading': isLoading }">
        <h2 class="ui header">Connections</h2>
        <table class="ui very basic table">
            <thead>
                <tr>
                    <th>Host</th>
                    <th>Nick</th>
                    <th>Port</th>
                    <th>SSL</th>
                    <th></th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="connection in connections">
                    <td>
                        <h4 class="ui header">{{ connection.config.host }}</h4>
                    </td>
                    <td>{{ connection.config.nick }}</td>
                    <td>{{ connection.config.port }}</td>
                    <td>
                        <i v-if="connection.config.ssl" class="lock icon"></i>
                    </td>
                    <td class="collapsing right aligned">
                        <button v-if="confirming === connection.id" class="ui compact mini basic red button" @click="deleteConnection(connection.id)">Confirm delete</button>
                        <button v-if="confirming === connection.id" class="ui compact mini basic grey button" @click="confirming = ''">Cancel</button>
                        <button v-if="confirming !== connection.id" class="ui compact mini basic grey button" @click="confirming = connection.id">Delete</button>
                    </td>
                </tr>
            </tbody>

            <tfoot class="full-width">
                <tr>
                    <th colspan="6">
                        <a class="ui small basic primary icon button" v-link="{ path: '/connections/create' }">
                            <i class="add icon"></i> Add Connection
                        </a>
                        <a class="ui small primary button" v-link="{ path: '/chat' }">
                            Back to chat
                        </a>
                    </th>
                </tr>
            </tfoot>

        </table>
    </div>
</template>

<script>
    import { getServiceConnections } from '../vuex/getters'
    import { refreshConnections, deleteConnection } from '../vuex/actions'

    export default {
        vuex: {
            getters: {
                connections: getServiceConnections
            },
            actions: {
                refreshConnections,
                deleteConnection
            }
        },
        data() {
            return {
                isLoading: false,
                confirming: ''
            }
        },
        methods: {
            refresh() {
                this.isLoading = true
                this.refreshConnections().then(() => {
                    this.isLoading = false
                })
            }
        },
        ready() {
            this.refresh()
        }
    }
</script>
