<template>
    <ul style="display:block" class="el-upload-list el-upload-list--picture-card">
        <div>
            <li tabindex="0" v-for="(item,i) in filelist" :key="i" class="el-upload-list__item is-success">
                <img :src="item.url" alt="" draggable="false" class="el-upload-list__item-thumbnail">
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-delete">
                        <i @click="handleDelCallBack(i)" class="el-icon-delete"></i>
                    </span>
                </span>
            </li>
        </div>
    </ul>
</template>

<script>
export default {
    props: {
        filelist: {
            default: () => [],
            type: Array
        }
    },
    methods:{
        handleDelCallBack(i){
            this.$emit('delCallBack',i)
        }
    }
}
</script>

<style lang="scss" scoped>

</style>
