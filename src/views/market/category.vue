<template>
  <div class="app-container">
    <!-- 头部过滤 -->
    <div class="filter-container">
      <el-button type="success" @click="dialogFormVisible=true">添加分类</el-button>
    </div>
    <!-- 表格主体 -->
    <div class="table-wrapper">
      <el-table
        :data="tableData"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          prop="categoryName"
          label="类目名称"
        />
        <el-table-column
          prop="categoryCode"
          label="categoryCode"
        />
        <el-table-column
          prop="merchantId"
          label="merchantId"
        >
          <template slot-scope="scope">
            <el-tag type="success">启用</el-tag>
            <el-tag type="warning">下架</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="state"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text">编辑</el-button>
            <el-button class="red" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹窗提示 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form :model="form">
        <el-form-item label="分类名称" :label-width="formLabelWidth">
          <el-input v-model="form.categoryName" autocomplete="off" placeholder="请输入分类名称" clearable />
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select v-model="form.categoryState" placeholder="请选择状态">
            <el-option label="上架" value="shanghai" />
            <el-option label="下架" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" :label-width="formLabelWidth">
          <el-input v-model="form.order" autocomplete="off" placeholder="排序" clearable />
        </el-form-item>
        <el-form-item label="上传图标" :label-width="formLabelWidth">
          <!-- 图片上传组件 -->
          <el-upload
            action="#"
            list-type="picture-card"
            :limit="1"
            :auto-upload="false"
          >
            <i slot="default" class="el-icon-plus" />
            <div slot="file" slot-scope="{file}">
              <img
                class="el-upload-list__item-thumbnail"
                :src="file.url"
                alt=""
              >
              <span class="el-upload-list__item-actions">
                <span
                  class="el-upload-list__item-preview"
                  @click="handlePictureCardPreview(file)"
                >
                  <i class="el-icon-zoom-in" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleDownload(file)"
                >
                  <i class="el-icon-download" />
                </span>
                <span
                  v-if="!disabled"
                  class="el-upload-list__item-delete"
                  @click="handleRemove(file)"
                >
                  <i class="el-icon-delete" />
                </span>
              </span>
            </div>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddGategoryList">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name: 'Category',
    data() {
        return {
            dialogFormVisible: false,
            form: {
                categoryName: '',
                categoryState: '',
                order: ''
            },
            formLabelWidth: '120px',
            dialogImageUrl: '',
            dialogVisible: false,
            disabled: false,
            tableData: [],
        }
    },
    mounted() {
        this.init()
    },
    methods: {
        tableRowClassName({ row, rowIndex }) {
            if (rowIndex === 1) {
                return 'warning-row'
            } else if (rowIndex === 3) {
                return 'success-row'
            }
            return ''
        },
        handleRemove(file) {
            console.log(file)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        handleDownload(file) {
            console.log(file)
        },
        init(){
            this.GetGategoryList()
        },
        async GetGategoryList(){
            const response = await this.$api.GetGategoryList()
            const { data } = response
            this.tableData = data
        },
        async AddGategoryList(){
            const { categoryName } = this.form
            console.log(categoryName)
            // this.dialogFormVisible = false
            const response = await this.$api.AddGategoryList({
                categoryName,
                merchantId: "c123123123"
            })
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
    .table-wrapper{
        margin-top: 20px;
    }
}
</style>
