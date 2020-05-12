<template>
    <div class="app-container">
        <!-- 头部过滤 -->
        <div class="filter-container">
            <el-button @click="handleAddShopGoods" type="success">添加商品</el-button>
        </div>
        <div style="marginTop:20px" class="filter-container">
            <el-form :inline="true" :model="formInline" class="demo-form-inline">
                <!-- <el-form-item label="审批人">
                    <el-input v-model="formInline.user" placeholder="审批人"></el-input>
                </el-form-item> -->
                <el-form-item label="分类列表">
                    <el-select v-model="formInline.categoryCode" placeholder="分类列表">
                        <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.categoryCode"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="GetGoodsByCategory">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!-- 表格主体 -->
        <div class="table-wrapper">
            <el-table height="80vh" :data="tableData" style="width: 100%">
                <el-table-column prop="productName" label="商品名称" />
                <el-table-column prop="price" label="商品现价" />
                <el-table-column prop="stock" label="商品库存" />
                <el-table-column prop="pic" label="缩略图">
                    <template slot-scope="scope">
                        <img width="120" height="120" :src="scope.row.pic" alt="">
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template>
                        <el-tag type="success">启用</el-tag>
                        <el-tag type="warning">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="操作">
                    <template slot-scope="scope">
                        <el-button class="red" @click="DeleteDoods(scope.row)" type="text">删除</el-button>
                        <el-button @click="EditDoods(scope.row)" type="text">编辑</el-button>
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
            formLabelWidth: '120px',
            tableData: [],
            formInline: {
                categoryCode: '' // 选中的分类
            },
            categoryList: [] // 分类列表
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        init() {
            this.GetCategoryList()
            this.GetGoodsByCategory()
        },
        async GetCategoryList() {
            const response = await this.$api.GetCategoryList()
            const { data } = response
            this.categoryList = data
        },
        onSubmit() {
            console.log('submit!')
        },
        // 获取商品列表
        async GetGoodsByCategory() {
            const { categoryCode = '' } = this.formInline
            const response = await this.$api.GetGoodsByCategory({
                categoryCode,
                merchantId: this.$store.getters.customerId,
                needTotalCount: true,
                offset: 0,
                pageNum: 1,
                pageSize: 10
            })

            this.tableData = response.data
        },
        handleAddShopGoods() {
            this.$router.push({ path: '/market/setShopGoods' })
        },
        async DeleteDoods(goods) {
            console.log(goods)
            await this.$api.DeleteGoods({
                id: goods.id
            })
            this.GetGoodsByCategory()
        },
        EditDoods({ productCode }) {
            this.$router.push({ path: '/market/setShopGoods', query: { productCode }})
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
