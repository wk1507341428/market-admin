<template>
    <div class="app-container">
        <!-- 头部过滤 -->
        <div class="filter-container">
            <el-button @click="HandleAddTabs" type="success">添加规格</el-button>
        </div>
        <!-- 表格主体 -->
        <div class="table-wrapper">
            <!-- tab栏目 -->
            <el-tabs closable 
                @tab-remove="removeTab" 
                v-model="tabsActivity" @tab-click="handleClick" type="border-card">
                <el-tab-pane
                    v-for="(item,i) in tabs"
                    :key="i"
                    :label="item.spcName"
                    :name="item.id">
                    <!-- 筛选框 -->
                    <div class="filter-container">
                        <!-- 添加属性 -->
                        <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                        >
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+新增属性</el-button>
                    </div>
                    <div class="tag-wrap">
                        <el-tag
                            v-for="tag in tags"
                            :key="tag.id"
                            @close="handleClose(tag)"
                            closable>
                            {{tag.propertyName}}
                        </el-tag>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            tabs: [],
            tabsActivity: '', // 这个tabsActivity是选中的
            dialogFormVisible: false,
            tags: [
                { name: '标签一', type: '' },
                { name: '标签二', type: 'success' },
                { name: '标签三', type: 'info' },
                { name: '标签四', type: 'warning' },
                { name: '标签五', type: 'danger' }
            ],
            inputVisible: false,
            inputValue: ''
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init()
        })
    },
    methods: {
        init() {
            this.GetShopSpecifications()
        },
        // 切换tab栏
        handleClick(tab, event) {
            const specId = this.tabsActivity
            this.GetShopSpecListBySpecId(specId)
        },
        // 获取规格
        async GetShopSpecifications() {
            const response = await this.$api.GetShopSpecifications()
            response.data.map(item => {
                item.id = item.id.toString()
            })
            this.tabs = response.data
            this.tabsActivity = response.data[0].id
            // 获取第一个规格下的熟悉
            this.GetShopSpecListBySpecId(this.tabsActivity)
        },
        // 获取某一个分类下的所有规格
        async GetShopSpecListBySpecId(specId) {
            const response = await this.$api.GetShopSpecListBySpecId(specId)
            this.tags = response.data
        },
        showInput() {
            this.inputVisible = true
            this.$nextTick(() => {
                // this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        async handleInputConfirm() {
            const { inputValue, tabsActivity: specId } = this.$data
            // 这里要发送请求
            const options = {
                active: '1',
                propertyName: inputValue,
                specId
            }
            if (!inputValue.trim()) {
                this.inputVisible = false
                this.inputValue = ''
                return
            }
            await this.$api.AddShopSpecProperty(options)
            this.inputVisible = false
            this.inputValue = ''
            // 获取当前规格下的属性
            this.GetShopSpecListBySpecId(specId)
        },
        async removeTab(){
            const { tabsActivity: specId } = this.$data
            const confirm = await this.$confirm(`此操作将永久删除该文件, 是否继续?-${specId}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(() => {})
            if (!confirm) return
            alert("敬请期待")
        },
        // 增加规格
        async HandleAddTabs(){
            const result = await this.$prompt('增加规格', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).catch(() => {})
            if (!result) return
            const { value } = result
            const data = {
                active: '1',
                merchantId: 'c123123123',
                spcName: value
            }
            await this.$api.AddShopSpecifications(data)
            this.GetShopSpecifications()
        },
        handleClose(tag){
            const result = await this.$prompt('是否删除该规格', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).catch(() => {})
            if (!result) return

            alert("敬请期待")
        }
    }
}
</script>

<style lang="scss" scoped>
.tag-wrap{
    padding: 20px 20px 20px 0;
    & /deep/ .el-tag{
        margin-right: 20px;
    }
}
</style>
