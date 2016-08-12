<template>
    <div>
        <div class="ui dropdown">
            <h3 class="ui header text">{{ fullName }}</h3><i class="angle down icon"></i>
            <div class="menu">
                <div class="item">Stuffz</div>
                <div class="item">Things</div>
                <div class="item">Other Things</div>
            </div>
        </div>

        <br>

        <a class="ui empty circular mini label" v-bind:class="{ 'red': isAway, 'green': !isAway }"></a>
        {{ username }}
    </div>
</template>

<script>
    export default {
        data() {
            return {
                username: 'johnsolo',
                fullName: 'John Susek',
                isAway: false
            }
        },
        compiled() {
            $(this.$el).find('.ui.dropdown').dropdown()
        },
        beforeDestroy() {
            $(this.$el).find('.ui.dropdown').dropdown('destroy')
        }
    }
</script>

<style scoped>
    h3.ui.header {
        margin-bottom: 0.125em;
    }
    .ui.empty.label {
        margin-right: 0.25em;
    }
    .angle.down.icon {
        margin-left: 2px;
        font-size: 1.125rem;
    }
</style>
