<template>
    <div class="app-container">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品名称" prop="productName">
                        <el-input v-model="ruleForm.productName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品分类" prop="categoryCode">
                        <el-select v-model="ruleForm.categoryCode" placeholder="商品分类">
                            <el-option v-for="item in categoryList" :key="item.id" :label="item.categoryName" :value="item.categoryCode"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品原价" prop="soldPrice">
                        <el-input v-model="ruleForm.soldPrice"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品现价" prop="price">
                        <el-input v-model="ruleForm.price"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品库存" prop="stock">
                        <el-input v-model="ruleForm.stock"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="商品描述" prop="productDesc">
                        <el-input v-model="ruleForm.productDesc"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
            <!-- 轮播图上传 -->
            <el-row>
                <el-col :span="18">
                    <el-form-item label="轮播图上传">
                        <el-upload
                            :drag="true"
                            action=""
                            list-type="picture-card"
                            :file-list="filesList"
                            :on-success="uploadSuccess"
                            multiple
                            :http-request="handleUploadSwiperImage"
                            :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <!-- 缩略图上传 -->
            <el-row>
                <el-col :span="18">
                    <el-form-item label="缩略图上传">
                        <el-upload
                            action="#"
                            list-type="picture-card"
                            :http-request="handleUploadAvatarImage">
                            <i slot="default" class="el-icon-plus"></i>
                            <div slot="file" slot-scope="{file}">
                                <img
                                    class="el-upload-list__item-thumbnail"
                                    :src="dialogImageUrlAvatar.picUrl"
                                    alt=""
                                >
                                <span class="el-upload-list__item-actions">
                                    <span
                                        class="el-upload-list__item-preview"
                                        @click="handlePictureCardPreview(file)"
                                    >
                                        <i class="el-icon-zoom-in"></i>
                                    </span>
                                    <span
                                        v-if="!disabled"
                                        class="el-upload-list__item-delete"
                                        @click="handleRemoveAvatar(file)"
                                    >
                                        <i class="el-icon-delete"></i>
                                    </span>
                                </span>
                            </div>
                        </el-upload>
                        <el-dialog :visible.sync="dialogVisibleAvatar">
                            <img width="100%" :src="dialogImageUrlAvatar.picUrl" alt="">
                        </el-dialog>
                    </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <!-- 产品规格 -->
            <el-row>
                <el-col :span="24">
                    <el-form-item label="产品规格">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item v-for="item in shopSpecList" :key="item.id"  :title="item.spcName" :name="item.id">
                                <div v-if="Array.isArray(item.childrens) && item.childrens.length > 0" class="wrapper">
                                    <el-checkbox-group v-model="goodsCheckedProperty">
                                        <el-checkbox
                                            @change="handleCheckedPropertyChange"
                                            v-for="property in item.childrens"
                                            :label="property.id"
                                            :key="property.id">
                                            {{property.propertyName}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </div>
                                <div v-else>暂无记录</div>
                            </el-collapse-item>
                        </el-collapse>
                    </el-form-item>
                </el-col>
                <el-col :span="0"></el-col>
            </el-row>
            <!-- 产品详情 -->
            <el-row>
                <el-col :span="24">
                    <el-form-item label="产品详情">
                        <tinymce v-model="content" :height="300" />
                        <div class="editor-content" v-html="content" />
                    </el-form-item>
                </el-col>
                <el-col :span="0"></el-col>
            </el-row>
            <!-- 提交按钮 -->
            <el-row>
                <el-col :span="12">
                    <el-button @click="handleSubmit" type="success">提交</el-button>
                </el-col>
                <el-col :span="12"></el-col>
            </el-row>
        </el-form>
    </div>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
    data() {
        return {
            ruleForm: {
                productName: '',
                categoryCode: '',
                soldPrice: '',
                price: '', // 商品现价
                stock: '',
                productDesc: '' // 商品描述
            },
            rules: {
                productName: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                categoryCode: [
                    { required: true, message: '请选择活动区域', trigger: 'change' }
                ],
                soldPrice: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                price: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                stock: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ],
                productDesc: [
                    { required: true, message: '请输入', trigger: 'blur' }
                ]
            },
            categoryList: [], // 分类列表
            dialogImageUrl: '',
            dialogVisible: false,
            pics: [], // 图片都放在这里 这是最后给后端的   图片列表:0:列表页缩略图；1:详情页轮播图；2:详情页详细介绍图片 ,
            filesList: [
                { picFUn: 1, url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' },
                { picFUn: 1, url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg' }
            ], // swiper image list
            // 缩略图 -- 开始
            dialogImageUrlAvatar: {
                picFUn: 0,
                picUrl: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg'
            },
            dialogVisibleAvatar: false,
            disabled: false,
            // 缩略图 -- 结束

            /** -----详情页详细介绍图 开始------ */

            /** -----详情页详细介绍图 结束------ */
            // 规格属性 -- 开始
            activeNames: [],
            shopSpecList: [], // 商品规格列表
            goodsCheckedProperty: [], // 商品已经选择的属性
            // 规格属性 -- 结束
            content: '这个富文本暂时没什么用'
        }
    },
    mounted() {
        this.$nextTick(() => {
            this.init()
            this.GetShopSpecifications()
        })
    },
    methods: {
        init() {
            this.GetCategoryList()
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!')
                } else {
                    console.log('error submit!!')
                    return false
                }
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        async GetCategoryList() {
            const response = await this.$api.GetCategoryList()
            const { data } = response
            this.categoryList = data
        },
        handleRemove(file, filesList) {
            console.log(file)
            this.filesList = filesList
        },
        handlePictureCardPreview(file) {
            console.log(file, '<<<handlePictureCardPreview<<<')
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        // 轮播图图片上传
        async handleUploadSwiperImage(files) {
            console.log(files, '<<<<<<', this.filesList)
            const formData = new FormData()
            formData.append('file', files.file)
            const response = await this.$api.UploadFile(formData)
            this.filesList.push({ url: response.data, picFUn: 1 })
        },
        uploadSuccess(res, file) {
            console.log(this.filesList, 'uploadSuccessuploadSuccess', res, file)
        },
        // 缩略图上传 -- 开始
        handleRemoveAvatar() {
            // this.dialogImageUrlAvatar = {
            //     picFUn: 0,
            //     picUrl: ''
            // }
        },
        async handleUploadAvatarImage(files) {
            const formData = new FormData()
            formData.append('file', files.file)
            const response = await this.$api.UploadFile(formData)
            this.dialogImageUrlAvatar = Object.assign({}, this.dialogImageUrlAvatar, { picUrl: response.data })
        },
        // 缩略图上传 -- 结束
        // 规格属性 -- 开始
        // handleChange(ids) {
        //     console.log(ids, '<<<<<')
        //     const { shopSpecList } = this.$data
        //     const filterList = []
        //     Array.isArray(ids) && ids.map(id => {
        //         Array.isArray(shopSpecList) && shopSpecList.filter(async item => {
        //             if (item.id == id && !item.childrens) {
        //                 const result = await this.$api.GetShopSpecListBySpecId(id)
        //                 this.$set(item, 'childrens', result.data)
        //             }
        //         })
        //     })
        // },
        /**
         * @description: 列出规格下面所有的属性
         * @param {type}
         * @return:
         */
        async GetShopSpecListBySpecId() {
            const response = await this.$api.GetShopSpecListBySpecId()
            this.shopSpecList = response.data
        },
        /**
         * @description: 查询商家所有的规格和属性
         * @param {type}
         * @return:
         */
        async GetShopSpecifications() {
            const response = await this.$api.GetShopSpecListByAll({
                merchantId: this.$store.getters.customerId
            })
            this.shopSpecList = response.data
        },
        handleCheckedPropertyChange(val) {
            console.log(val)
        },
        // 规格属性 -- 结束
        handleSubmit() {
            const { filesList, dialogImageUrlAvatar, goodsCheckedProperty, shopSpecList } = this.$data
            const { categoryCode, soldPrice, stock, productName, productDesc, price } = this.ruleForm
            // 收集数据阶段
            const defaultData = {
                productName,
                active: 1,
                categoryCode,
                detailDesc: productDesc,
                merchantId: this.$store.getters.customerId,
                price, // 商品现价
                soldPrice, // 商品原价
                soldStock: 0,
                stock
            }
            // 做图片上传处理
            filesList.map(item => {
                item.picUrl = item.url
            })
            const pics = [...filesList, dialogImageUrlAvatar]

            // 这里做规格处理
            const specs = []
            Array.isArray(shopSpecList) && shopSpecList.forEach(item => {
                Array.isArray(goodsCheckedProperty) && goodsCheckedProperty.forEach(id => {
                    Array.isArray(item.childrens) && item.childrens.forEach(property => {
                        if (id == property.id) {
                            specs.push(property)
                        }
                    })
                })
            })

            // 组装数据
            const params = Object.assign(defaultData, { specs, pics })
            console.log(defaultData, 'defaultData')

            this.$api.AddGoods(params)
        }
    },
    components: {
        Tinymce
    }
}
</script>
