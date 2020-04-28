<template>
    <div class="dashboard-container">
        <aside>欢迎使用商城管理系统</aside>
        <panel-group />
    </div>
</template>

<script>
import PanelGroup from '@/components/PanelGroup/PanelGroup'
export default {
    data() {
        return {

        }
    },
    components: {
        PanelGroup
    }
}
</script>

<style lang="scss" scoped>
.dashboard {
    &-container {
        margin: 30px;
    }
}
aside{
    background-color: #dff0d8;
    border-color: #d6e9c6;
    color: #3c763d;
}
</style>
