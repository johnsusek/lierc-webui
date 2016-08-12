<template>
    <div>
        Direct Messages <span class="muted">({{ directMessages.length }})</span> <i class=" muted add circle link icon"></i>

        <div class="ui small vertical menu">
            <a v-for="directMessage in directMessages" class="item">
                <div class="ui label">1</div>
                {{ directMessage }}
            </a>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                directMessages: ['alice', 'bob', 'charlie', 'davos']
            }
        }
    }
</script>

<style scoped>
    .muted.add.circle.icon {
        float: right;
        margin-top: 1px;
    }
    .ui.secondary.inverted.menu a.item {
        line-height: 0.5rem;
        color: rgba(255,255,255,0.4) !important;
    }
    .ui.secondary.inverted.menu a.active.item {
        color: #fff !important;
    }
    .ui.secondary.inverted.menu a.item.highlighted {
        color: rgba(255,255,255,1) !important;
    }
</style>