import HttpServe from './httpServe'
import { Loading, Notification } from 'element-ui'
import store from '@/store'
// import qs from 'qs'

let loadingInstance = null

const http = new HttpServe({
    // 使用统一的catch 如果不想使用可以 http.get().catch_http_error() 即可以自己catch
    onNetworkError(err) {
        const { errMessage, errCode } = err
        console.log('catch错误', err)
        Notification.error({
            title: `错误提示-${errCode}`,
            message: errMessage
        })
        return
    },

    // 统一处理code码错误， 如果不想使用 dispose_server_error() 可以自己处理
    onServerError(error_data) {
        console.log('code码错误', error_data)
        const { errMessage, errCode } = error_data
        Notification.error({
            title: `错误提示-${errCode}`,
            message: errMessage
        })
        return
    },

    defaultLoading: {
        show() {
            console.log(store.getters.customerId, 'storestorestore')
            loadingInstance = Loading.service({ fullscreen: true })
        },
        hide() {
            loadingInstance.close()
        }
    }

})

export default {

    /**
     * @description: 获取类目列表
     * @param {type}
     * @return:
     */
    GetCategoryList(data = store.getters.customerId) {
        return http.get(`/market/mall/product/v1/categories/${data}`).withLoading().exec()
    },

    /**
     * @description: 新增类目列表
     * @param {type}
     * @return:
     */
    AddCategoryList(data) {
        return http.post(`/market/mall/product/v1/category`, data).withLoading().exec()
    },

    /**
     * @description: 修改类别信息
     * @param {type}
     * @return:
     */
    SetCategory(data) {
        return http.post(`/market/mall/product/v1/categories/category`, data).withLoading().exec()
    },

    /**
     * @description: 文件上传接口
     * @param {type}
     * @return:
     */
    UploadFile(data) {
        return http.post(`/market/mall/file/v1/`, data).setHeaders({
            'Content-Type': 'multipart/form-data'
        }).withLoading().exec()
    },

    UploadFileUrl: '/market/mall/file/v1/',

    /**
     * @description: 查询商家所有的规格
     * @param {type}
     * @return:
     */
    GetShopSpecifications(params = store.getters.customerId) {
        return http.get(`/market/mall/product/v1/specs/${params}`).withLoading().exec()
    },

    /**
     * @description: 新增规格尺寸
     * @param {type}
     * @return:
     */
    AddShopSpecifications(data) {
        return http.post(`/market/mall/product/v1/spec`, data).withLoading().exec()
    },

    /**
     * @description: 列出规格下面所有的属性
     * @param { specId - id }
     * @return:
     */
    GetShopSpecListBySpecId(params) {
        return http.get(`/market/mall/product/v1/property/${params}`).withLoading().exec()
    },

    /**
     * @description: 列出该商家的所有规格属性
     * @param { specId - id }
     * @return:
     */
    GetShopSpecListByAll(params) {
        return http.get(`/market/mall/product/v1/specs`, params).withLoading().exec()
    },

    /**
     * @description: 新增规格属性
     * @param {type}
     * @return:
     */
    AddShopSpecProperty(data) {
        return http.post(`/market/mall/product/v1/property`, data).withLoading().exec()
    },

    /**
     * @description: 图片验证码
     * @param {type}
     * @return:
     */
    GetImgVerifyCode() {
        return http.post(`/market/mall/backend/v1/captcha`).exec()
    },

    /**
     * @description: 获取手机验证码
     * @param {type}
     * @return:
     */
    SendMobileSms(phone) {
        return http.post(`/market/mall/sms/v1?phone=${phone}`).withLoading().exec()
    },

    /**
     * @description: 注册的手机验证码
     * @param {type}
     * @return:
     */
    SendMobileSmsByRegister(mobile) {
        return http.get(`/market/mall/backend/v1/register/sms/${mobile}`).withLoading().exec()
    },

    /**
     * @description: 手机号注册商户
     * @param {type}
     * @return:
     */
    register(data) {
        return http.post(`/market/mall/backend/v1/merchant/register`, data)
            .withLoading()
            .exec()
    },

    /**
     * @description: 修改登录密码/
     * @param {type}
     * @return:
     */
    SetUserPassword(data, captha) {
        return http.post(`/market/mall/merchant/v1/password`, data).withLoading().setHeaders({
            captha
        }).exec()
    },

    /**
     * @description: 后台登陆
     * @param {type}
     * @return:
     */
    UserLogin(data) {
        return http.post(`/market/mall/web/v1/login`, data).withLoading().dispose_server_error().exec()
    },

    /**
     * @description: delete规格属性:必须带上ID主键
     * @param {type}
     * @return:
     */
    DeleteProperty(id) {
        return http.post(`/market/mall/product/v1/property/delete/${id}`).withLoading().exec()
    },

    /**
     * @description: 删除规格 把整个规格＋下面的属性都删了
     * @param {type}
     * @return:
     */
    DeleteSpec(params) {
        return http.post(`/market/mall/product/v1/spec/delete`, params).withLoading().exec()
    },

    /**
     * @description: 根据类别、关键字分页查询商品列表
     * @param {type}
     * @return:
     */
    GetGoodsByCategory(data) {
        return http.get(`/market/mall/product/v1/products/pagenation`, data).withLoading().exec()
    },

    /**
     * @description: 新增产品
     * @param {type}
     * @return:
     */
    AddGoods(data) {
        return http.post(`/market/mall/product/v1/product/add`, data).withLoading().exec()
    },

    /**
     * @description: 新增产品
     * @param {type}
     * @return:
     */
    DeleteGoods(data) {
        return http.post(`/market/mall/product/v1/product/delete`, data).withLoading().exec()
    },

    /**
     * @description: 获取商品详情
     * @param {type}
     * @return:
     */
    GetProductDetail(productCode) {
        return http.get(`/market/mall/product/v1/product/${productCode}`).withLoading().exec()
    },

    /**
     * @description: 修改商品
     * @param {type}
     * @return:
     */
    SetGoods(data) {
        return http.post(`/market/mall/product/v1/product/update`, data).withLoading().exec()
    }

}
