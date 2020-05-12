<template>
    <div class="app-container">
        <!-- 头部过滤 -->
        <div class="filter-container">
            <el-button type="success" @click="handleAddCate">添加分类</el-button>
        </div>
        <!-- 表格主体 -->
        <div class="table-wrapper">
            <el-table height="80vh" :data="tableData" style="width: 100%" :row-class-name="tableRowClassName">
                <el-table-column prop="categoryName" label="类目名称" />
                <el-table-column prop="categoryPic" label="图标">
                    <template slot-scope="scope">
                        <img :src="scope.row.categoryPic" style="width:70px">
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag v-if="scope.row.active=='1'" type="success">启用</el-tag>
                        <el-tag v-else type="warning">下架</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
                        <el-button class="red" v-if="scope.row.active=='1'" type="text" @click="handleDelCate(scope.row)">下架</el-button>
                        <el-button class="red" v-else type="text" @click="handleDelCate(scope.row)">上架</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 弹窗提示 -->
        <el-dialog :title="form.ifEdit ? '编辑分类' : '新增分类'" :visible.sync="dialogFormVisible" v-if="dialogFormVisible">
            <el-form ref="ruleForm" :rules="rules" :model="form">
                <!-- 分类名称 -->
                <el-form-item required label="分类名称" :label-width="formLabelWidth" prop="categoryName">
                    <el-input
                        v-model="form.categoryName"
                        autocomplete="off"
                        placeholder="请输入分类名称"
                        clearable
                    />
                </el-form-item>
                <!-- 状态 -->
                <el-form-item required label="状态" :label-width="formLabelWidth">
                    <el-select v-model="form.active" placeholder="请选择状态">
                        <el-option label="上架" value="1" />
                        <el-option label="下架" value="0" />
                    </el-select>
                </el-form-item>
                <!-- 排序 -->
                <el-form-item required label="排序" :label-width="formLabelWidth">
                    <el-input v-model="form.order" autocomplete="off" placeholder="排序" clearable />
                </el-form-item>
                <el-form-item required label="上传图标" :label-width="formLabelWidth">
                    <!-- 图片上传组件 -->
                    <UploadImage :defaultList="form.fileList" ref="UploadImage" color="#1890ff" class="editor-upload-btn" @delCallBack="imageSuccess" @successCBK="imageSuccess" />
                    <!-- tips -->
                    <i style="color: #909399;">建议上传尺寸: 70*70</i>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="resetForm">取 消</el-button>
                <el-button type="primary" @click="SubmitCategoryList">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import UploadImage from '@/components/UploadImage/UploadImage'
export default {
    name: 'Category',
    data() {
        return {
            dialogFormVisible: false,
            formLabelWidth: '120px',
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            tableData: [],
            // 表达校验规则
            rules: {
                categoryName: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' }
                ],
                order: [
                    { required: true, message: '请输入序号', trigger: 'blur' }
                ]
            },
            // 表单数据
            form: {
                categoryName: '',
                active: '1',
                order: '',
                fileList: [],
                ifEdit: false // 是否是编辑状态
            }
        }
    },
    watch: {
        dialogFormVisible() {
            console.log(this.$refs['ruleForm'], '<<<<')
            this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
        }
    },
    mounted() {
        this.init()
    },
    components: {
        UploadImage
    },
    methods: {
        tableRowClassName({ rowIndex }) {
            if (rowIndex === 1) {
                return 'warning-row'
            } else if (rowIndex === 3) {
                return 'success-row'
            }
            return ''
        },
        imageSuccess(arr) {
            this.form.fileList = arr
            console.log(arr, '<arr')
        },
        // handleRemove(file, fileList) {
        //     this.form.fileList = []
        // },
        // async httpRequest(info) {
        //     const formData = new FormData()
        //     formData.append('file', info.file)
        //     const response = await this.$api.UploadFile(formData)
        //     this.form.fileList.push({ url: response.data })
        // },
        init() {
            this.GetCategoryList()
        },
        async GetCategoryList() {
            const response = await this.$api.GetCategoryList()
            const { data } = response
            this.tableData = data
        },
        // 表单提交
        SubmitCategoryList() {
            console.log(this.form, 'this.form')
            this.$refs['ruleForm'].validate(async(valid) => {
                if (!valid) return
                const { fileList, ifEdit } = this.form
                if (fileList.length < 1) {
                    return
                }

                if (ifEdit) {
                    this.editCategory()
                } else {
                    this.AddCategoryList()
                }
                // 关闭弹窗
                this.resetForm()
                // 重新请求列表
                setTimeout(() => {
                    this.GetCategoryList()
                }, 100)
            })
        },
        // 新增分类
        async AddCategoryList() {
            const { categoryName, active, fileList } = this.form
            await this.$api.AddCategoryList({
                categoryName,
                merchantId: this.$store.getters.customerId,
                active: active,
                categoryPic: fileList[0].url
            })
        },
        // 修改分类
        async editCategory() {
            const { active, categoryCode, categoryName, merchantId, id, fileList } = this.form
            this.$api.SetCategory({
                active,
                merchantId,
                categoryCode,
                id,
                categoryName,
                categoryPic: fileList[0].url
            })
        },
        // 重制表单
        resetForm() {
            this.dialogFormVisible = false
            // this.$refs[formName].resetFields();
            this.$refs.UploadImage.RemovePrevFileList()
            this.form.fileList = []
        },
        // 编辑表单
        handleEdit(row) {
            const fileList = [{ url: row.categoryPic }]
            this.form = Object.assign({}, this.form, row, { fileList, ifEdit: true })
            this.dialogFormVisible = true
        },
        // 删除分类
        async handleDelCate(row) {
            const confirm = await this.$confirm('此操作将修改您类别的状态，是否继续？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(() => {})
            if (!confirm) return
            const disActive = row.active === 1 ? '0' : '1'
            const response = await this.$api.SetCategory(Object.assign(row, { active: disActive }))
            this.$notify({ title: '删除成功', message: response.errMessage || '这是一条成功的提示消息', type: 'success' })
            // 重新请求列表
            this.GetCategoryList()
        },
        // 添加分类
        handleAddCate() {
            this.dialogFormVisible = true
            this.form = Object.assign({}, this.form, { ifEdit: false })
        }
    }
}
</script>

<style lang="scss" scoped>
.app-container{
    & /deep/ .el-table {
        .warning-row {
            background: #fff;
        }
        .success-row {
            background: #fff;
        }
    }
}
</style>
