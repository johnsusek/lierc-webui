<template>
    <div v-for="ircEvent in ircEvents" class="ui segment">
        <div class="ui top right attached label">Time<div class="detail">{{ ircEvent.Time }}</div></div>
        <div class="ui top left attached label">Command<div class="detail">{{ ircEvent.Command }}</div></div>
        <br>

        <div class="ui list">
          <div class="item">
            <div class="header">Params</div>
            <ol start="0">
                <li v-for="param in ircEvent.Params" track-by="$index">{{ param }}</li>
            </ol>
          </div>
          <div class="item">
            <div class="header">Prefix</div>
            <ol start="0">
                <li v-for="prefix in ircEvent.Prefix" track-by="$index">{{ prefix }}</li>
            </ol>
          </div>
          <div v-if="ircEvent.Id" class="item">
            <div class="header">ID</div>
            {{ ircEvent.Id }}
          </div>
        </div>

    </div>
</template>

<script>
    export default {
        store: ['ircEvents'],
        ready() {
            this.$watch('ircEvents', () => { this.$el.parentNode.scrollTop = this.$el.parentNode.scrollHeight })
        }
    }
</script>

