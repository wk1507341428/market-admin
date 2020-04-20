import HttpServe from './httpServe'
import { Loading, Notification } from 'element-ui'
// import qs from 'qs'

let loadingInstance = null

const http = new HttpServe({
    // 使用统一的catch 如果不想使用可以 http.get().catch_http_error() 即可以自己catch
    onNetworkError(err) {
        const { message, status } = err
        console.log('catch错误', err)
        Notification.error({
            title: `错误提示-${status}`,
            message: message
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
    GetGategoryList(data = 'c123123123') {
        return http.get(`/market/mall/product/v1/categories/${data}`).withLoading().exec()
    },

    /**
     * @description: 新增类目列表
     * @param {type}
     * @return:
     */
    AddGategoryList(data) {
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

    /**
     * @description: 查询商家所有的规格
     * @param {type}
     * @return:
     */
    GetShopSpecifications(params = 'c123123123') {
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
     * @param {type}
     * @return:
     */
    GetShopSpecListBySpecId(params) {
        return http.get(`/market/mall/product/v1/property/${params}`).withLoading().exec()
    },

    /**
     * @description: 新增规格属性
     * @param {type}
     * @return:
     */
    AddShopSpecProperty(data) {
        return http.post(`/market/mall/product/v1/property`, data).withLoading().exec()
    }

}
