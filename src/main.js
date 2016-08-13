import Vue from 'vue'
import VueStash from 'vue-stash'
import App from './App'
import store from './store'

Vue.use(VueStash)

/* eslint-disable no-new */
new Vue({
    el: 'body',
    components: { App },
    data: { store }
})
