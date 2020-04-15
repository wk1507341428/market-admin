import HttpServe from './httpServe'
import { Loading } from 'element-ui'
import { Notification } from 'element-ui';

let loadingInstance = null

const http = new HttpServe({
    // 使用统一的catch 如果不想使用可以 http.get().catch_http_error() 即可以自己catch
    onNetworkError(err) {
        const { message, status } = err
        console.log('catch错误', err)
        Notification.error({
            title: `错误提示-${status}`,
            message: message
        });
        return
    },

    // 统一处理code码错误， 如果不想使用 dispose_server_error() 可以自己处理
    onServerError(error_data) {
        console.log('code码错误', error_data)
        const { errMessage, errCode } = error_data
        Notification.error({
            title: `错误提示-${errCode}`,
            message: errMessage
        });
        return
    },

    defaultLoading: {
        show() {
            console.log('开始～')
            loadingInstance = Loading.service({ fullscreen: true })
        },
        hide() {
            loadingInstance.close();
            console.log('结束～')
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
    AddGategoryList(data){
        return http.post(`/market/mall/product/v1/category`,data).withLoading().exec()
    }

}
