<template>
    <div class="app-container">
        <!-- 头部过滤 -->
        <div class="filter-container">
            <el-button type="success" @click="dialogFormVisible=true">添加分类</el-button>
        </div>
        <!-- 表格主体 -->
        <div class="table-wrapper">
            <el-table height="80vh" :data="tableData" style="width: 100%">
                <el-table-column prop="categoryName" label="类目名称" />
                <el-table-column prop="categoryPic" label="图标">
                    <template slot-scope="scope">
                        <img :src="scope.row.categoryPic" style="width:70px">
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag type="success">启用</el-tag>
                        <el-tag type="warning">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text">编辑</el-button>
                        <el-button class="red" type="text">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Category',
    data() {
        return {
            dialogFormVisible: false,
            formLabelWidth: '120px',
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            tableData: []
        }
    },
    mounted() {
        this.init()
        var a = 1
    },
    methods: {
        init() {
            this.GetGategoryList()
        },
        async GetGategoryList() {
            const response = await this.$api.GetGategoryList()
            const { data } = response
            this.tableData = data
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container{
    .table-wrapper{
        margin-top: 20px;
    }
}
</style>
