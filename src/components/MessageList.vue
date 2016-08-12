<template>
<!-- <div class="ui segments"> -->
    <div v-for="message in messages" class="ui basic vertical segment">
        <span class="ui image basic label">
          <img :src="message.avatar">
          {{ message.user }}
        </span>

        <div class="ui basic muted label">
          {{ message.timestamp }}
        </div>

        <div class="ui">{{ message.message }}</div>
    </div>
<!-- </div> -->
</template>

<script>
    export default {
        data() {
            return {
                messages: [
                    { user: 'alice', message: 'slow-carb tousled polaroid blog?', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/stevie.jpg' },
                    { user: 'bob', message: 'eu cliche shabby chic sint exercitation before they sold out.', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/joe.jpg' },
                    { user: 'charlie', message: 'Intelligentsia cornhole pour-over, anim sunt crucifix mlkshk incididunt', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/elliot.jpg' },
                    { user: 'alice', message: 'Gochujang biodiesel trust fund, gastropub flexitarian farm-to-table hella chambray chartreuse mlkshk meh 8-bit. Echo park keffiyeh fixie selfies flannel.', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/stevie.jpg' },
                    { user: 'bob', message: 'Tofu tattooed health goth austin sartorial tousled.', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/joe.jpg' },
                    { user: 'davos', message: 'onions!', timestamp: '12:22AM' },
                    { user: 'charlie', message: 'Intelligentsia cornhole pour-over, anim sunt crucifix mlkshk incididunt', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/elliot.jpg' },
                    { user: 'alice', message: 'slow-carb tousled polaroid blog?', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/stevie.jpg' },
                    { user: 'bob', message: 'eu cliche shabby chic sint exercitation before they sold out.', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/joe.jpg' },
                    { user: 'charlie', message: 'Intelligentsia cornhole pour-over, anim sunt crucifix mlkshk incididunt', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/elliot.jpg' },
                    { user: 'alice', message: 'slow-carb tousled polaroid blog?', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/stevie.jpg' },
                    { user: 'alice', message: 'slow-carb tousled polaroid blog?', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/stevie.jpg' },
                    { user: 'bob', message: 'eu cliche shabby chic sint exercitation before they sold out.', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/joe.jpg' },
                    { user: 'charlie', message: 'Intelligentsia cornhole pour-over, anim sunt crucifix mlkshk incididunt', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/elliot.jpg' },
                    { user: 'alice', message: 'slow-carb tousled polaroid blog?', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/stevie.jpg' },
                    { user: 'bob', message: 'eu cliche shabby chic sint exercitation before they sold out.', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/joe.jpg' },
                    { user: 'charlie', message: 'Intelligentsia cornhole pour-over, anim sunt crucifix mlkshk incididunt', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/elliot.jpg' },
                    { user: 'bob', message: 'eu cliche shabby chic sint exercitation before they sold out.', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/joe.jpg' },
                    { user: 'charlie', message: 'Intelligentsia cornhole pour-over, anim sunt crucifix mlkshk incididunt', timestamp: '12:22AM', avatar: 'http://semantic-ui.com/images/avatar/small/elliot.jpg' }
                ]
            }
        }
    }
</script>

<style scoped>
</style>