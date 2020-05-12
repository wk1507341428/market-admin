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
            <!-- 轮播图上传 -->
            <el-row>
                <el-col :span="18">
                    <el-form-item label="轮播图上传">
                        <UploadImage :defaultList='swiperFilesList' color="#1890ff" class="editor-upload-btn" :limit="3" @delCallBack="imageSuccessBySwiper" @successCBK="imageSuccessBySwiper" />
                    </el-form-item>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
            <!-- 缩略图上传 -->
            <el-row>
                <el-col :span="18">
                    <el-form-item label="缩略图上传">
                        <UploadImage :defaultList="dialogImageUrlAvatar" color="#1890ff" class="editor-upload-btn" @delCallBack="handleDelCaverCallBack" @successCBK="imageSuccessByCover" />
                    </el-form-item>
                </el-col>
                <el-col :span="6">

                </el-col>
            </el-row>
            <!-- 产品规格 -->
            <el-row>
                <el-col :span="24">
                    <el-form-item label="产品规格">
                        <el-collapse v-model="activeNames">
                            <el-collapse-item v-for="item in shopSpecList" :key="item.id"  :title="item.specName" :name="item.id">
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
import UploadImage from '@/components/UploadImage/UploadImage'
export default {
    data() {
        return {
            ruleForm: {
                productName: '',
                categoryCode: '',
                soldPrice: '',
                price: '', // 商品现价
                stock: ''
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
                ]
            },
            categoryList: [], // 分类列表
            dialogImageUrl: '',
            dialogVisible: false,
            pics: [], // 图片都放在这里 这是最后给后端的   图片列表:0:列表页缩略图；1:详情页轮播图；2:详情页详细介绍图片 ,
            swiperFilesList: [], // swiper image list
            // 规格属性 -- 开始
            activeNames: [],
            shopSpecList: [], // 商品规格列表
            goodsCheckedProperty: [], // 商品已经选择的属性
            // 规格属性 -- 结束
            content: '',
            dialogImageUrlAvatar: [], // 头像的list
            id: null // 编辑的时候用得到
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
            this.GetProductDetail()
        },
        // 获取商品详情-编辑用
        async GetProductDetail() {
            const { productCode } = this.$route.query
            if (!productCode) return
            const { data } = await this.$api.GetProductDetail(productCode)

            this.id = data.id

            this.ruleForm = Object.assign(this.ruleForm, {
                productName: data.productName,
                categoryCode: data.categoryCode,
                soldPrice: data.soldPrice,
                price: data.price,
                stock: data.stock
            })

            this.content = data.detailDesc
            Array.isArray(data.specDTOS) && data.specDTOS.map(item => {
                Array.isArray(item.properties) && item.properties.map(info => {
                    this.goodsCheckedProperty.push(info.id)
                })
            })

            this.dialogImageUrlAvatar.push({ picUrl: data.pic, url: data.pic })

            Array.isArray(data.pics) && data.pics.map(item => {
                item.picFUn == '1' && this.swiperFilesList.push({ picUrl: item.picUrl, url: item.picUrl, id: item.id })
            })
        },
        resetForm(formName) {
            this.$refs[formName].resetFields()
        },
        async GetCategoryList() {
            const { data } = await this.$api.GetCategoryList()
            this.categoryList = data
        },
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
        async handleSubmit() {
            const { swiperFilesList, dialogImageUrlAvatar, goodsCheckedProperty, id } = this.$data
            const { categoryCode, soldPrice, stock, productName, price } = this.ruleForm
            // 收集数据阶段
            const defaultData = {
                productName,
                active: 1,
                categoryCode,
                detailDesc: this.content,
                merchantId: this.$store.getters.customerId,
                price, // 商品现价
                soldPrice, // 商品原价
                soldStock: 0,
                stock
            }
            // 做图片上传处理
            swiperFilesList.map(item => {
                item.picUrl = item.url
            })
            const pics = [...swiperFilesList, ...dialogImageUrlAvatar]

            // 这里做规格处理
            const specPropertyIds = goodsCheckedProperty
            // 组装数据
            const params = Object.assign(defaultData, { specPropertyIds, pics })

            const { productCode } = this.$route.query
            if (!productCode) {
                await this.$api.AddGoods(params)
                this.$notify({ title: '添加成功', message: '添加成功', type: 'success' })
                this.$router.push({ path: '/market/shopGoods' })
            } else {
                await this.$api.SetGoods({ ...params, productCode, id })
                this.$notify({ title: '修改成功', message: '修改成功', type: 'success' })
                this.$router.push({ path: '/market/shopGoods' })
            }
        },
        // 封面上传的回调函数
        imageSuccessByCover(arr) {
            arr.forEach(item => {
                item.picFUn = 0
                item.picUrl = item.url
            })
            this.dialogImageUrlAvatar = arr
        },
        handleDelCaverCallBack(arr) {
            this.dialogImageUrlAvatar = arr
        },
        imageSuccessBySwiper(list) {
            list.forEach(item => {
                item.picFUn = 1
                item.picUrl = item.url
            })
            this.swiperFilesList = list
        }
    },
    components: {
        Tinymce,
        UploadImage
    }
}
</script>
