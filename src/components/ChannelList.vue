<template>
    <div class="ui violet inverted segment">
        Channels <span class="muted">(2)</span> <i class=" muted add circle link icon"></i>

        <div class="ui small secondary inverted vertical menu">
            <a class="active item">#perl</a>
            <a class="item">#javascript</a>
            <a class="item">#golang</a>
            <a class="item highlighted">#python</a>
            <a class="item">#php</a>
            <a class="item">#csharp</a>
            <a class="item">#swift</a>
            <a class="item">#objectivec</a>
        </div>
</div>
</template>

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