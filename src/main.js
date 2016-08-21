import Vue from 'vue'
import VueResource from 'vue-resource'
import VueRouter from 'vue-router'
import { sync } from 'vuex-router-sync'
import store from './vuex/store'
import App from './components/App'
import Root from './components/Root'
import Chat from './components/Chat'
import Login from './components/Login'
import Logout from './components/Logout'
import Register from './components/Register'
import Connections from './components/Connections'
import ConnectionCreate from './components/ConnectionCreate'
import moment from 'moment'

Vue.use(VueResource)
Vue.use(VueRouter)

var router = new VueRouter()

sync(store, router)

router.map({
    '/': {
        component: Root
    },
    '/chat': {
        component: Chat
    },
    '/logout': {
        component: Logout
    },
    '/login': {
        component: Login
    },
    '/register': {
        component: Register
    },
    '/connections/create': {
        component: ConnectionCreate
    },
    '/connections': {
        component: Connections
    }
})

router.redirect({
    '*': '/login'
})

router.start(App, '#app')

Vue.filter('moment', function(timestamp) {
    return moment.unix(timestamp).format('dddd, MMMM Do YYYY, h:mm:ss a')
})
