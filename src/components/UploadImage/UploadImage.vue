<template>
    <div class="upload-container">
        <el-button :style="{background:color,borderColor:color}" icon="el-icon-upload" type="primary" @click="handleShowDialog">
            上传
        </el-button>
        <!-- 图片列表 -->
        <ul v-if="showList" style="marginTop:20px;display:block;" class="el-upload-list el-upload-list--picture-card">
            <div>
                <li tabindex="0" v-for="(item,i) in prevFileList" :key="i" class="el-upload-list__item is-success">
                    <img :src="item.url" class="el-upload-list__item-thumbnail">
                    <span class="el-upload-list__item-actions">
                        <span class="el-upload-list__item-delete">
                            <i @click="handleMoveFileList(i)" class="el-icon-delete"></i>
                        </span>
                    </span>
                </li>
            </div>
        </ul>
        <el-dialog :visible.sync="dialogVisible" :append-to-body='true'>
            <el-upload
                :limit="limit"
                :multiple="true"
                :file-list="fileList"
                :show-file-list="true"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                class="editor-slide-upload"
                :action="UploadFileUrl"
                list-type="picture-card"
            >
                <el-button size="small" type="primary">
                    点击上传
                </el-button>
            </el-upload>
            <el-button @click="dialogVisible = false">
                取消
            </el-button>
            <el-button type="primary" @click="handleSubmit">
                确认
            </el-button>
        </el-dialog>
    </div>
</template>

<script>
// import { getToken } from 'api/qiniu'

export default {
    props: {
        color: {
            type: String,
            default: '#1890ff'
        },
        showList: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 1
        },
        defaultList: {
            type: Array,
            default: () => []
        }
    },
    data() {
        const UploadFileUrl = this.$api.UploadFileUrl
        const defaultList = this.defaultList
        return {
            dialogVisible: false,
            listObj: {},
            fileList: defaultList,
            UploadFileUrl,
            prevFileList: defaultList // 外面预览的时候的列表
        }
    },
    methods: {
        checkAllSuccess() {
            return Object.keys(this.listObj).every(item => this.listObj[item].hasSuccess)
        },
        handleSubmit() {
            const arr = Object.keys(this.listObj).map(v => this.listObj[v])
            if (!this.checkAllSuccess()) {
                this.$message('Please wait for all images to be uploaded successfully. If there is a network problem, please refresh the page and upload again!')
                return
            }
            this.$emit('successCBK', arr)
            this.listObj = {}
            this.fileList = []
            Array.isArray(arr) && this.prevFileList.push(...arr)
            this.dialogVisible = false
        },
        handleSuccess(response, file) {
            const uid = file.uid
            const objKeyArr = Object.keys(this.listObj)
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    this.listObj[objKeyArr[i]].url = response.data
                    this.listObj[objKeyArr[i]].hasSuccess = true
                    return
                }
            }
        },
        handleRemove(file) {
            const uid = file.uid
            const objKeyArr = Object.keys(this.listObj)
            for (let i = 0, len = objKeyArr.length; i < len; i++) {
                if (this.listObj[objKeyArr[i]].uid === uid) {
                    delete this.listObj[objKeyArr[i]]
                    return
                }
            }
        },
        beforeUpload(file) {
            const _self = this
            const _URL = window.URL || window.webkitURL
            const fileName = file.uid
            this.listObj[fileName] = {}
            return new Promise((resolve) => {
                const img = new Image()
                img.src = _URL.createObjectURL(file)
                img.onload = function() {
                    _self.listObj[fileName] = { hasSuccess: false, uid: file.uid, width: this.width, height: this.height }
                }
                resolve(true)
            })
        },
        handleMoveFileList(i) {
            this.prevFileList.splice(i, 1)
            this.$emit('delCallBack', this.prevFileList)
        },
        handleExceed() {
            this.$notify.error({
                title: '错误提示',
                message: `最多可以上传${this.limit}张图片`
            })
        },
        // 显示隐藏上传文件框
        handleShowDialog() {
            const { prevFileList } = this.$data
            if (prevFileList.length >= this.limit) {
                this.$notify.error({
                    title: '错误提示',
                    message: `最多可以上传${this.limit}张图片`
                })
                return
            }
            this.dialogVisible = true
        },
        // 移除外面预览的时候的列表
        RemovePrevFileList() {
            this.prevFileList = []
        }
    }
}
</script>

<style lang="scss" scoped>
.editor-slide-upload {
  margin-bottom: 20px;
  /deep/ .el-upload--picture-card {
    width: 100%;
  }
}
</style>
