import axios from 'axios'

const GET = 'GET'
const POST = 'POST'

// const loadCount = 0

var server = axios.create({
    // timeout: 8000
})
server.interceptors.request.use((config) => {
    return config
}, (error) => {
    throw new Error(error)
})

server.interceptors.response.use((response) => {
    return response.data
}, (error) => {
    throw new Error(error)
})

class Call {
    constructor(client, method, path) {
        // 是否使用内置Loading
        this.useLoading = false
        // 请求路径
        this.path = path
        // 请求方法
        this.method = method

        // 请求发送前的Hook
        this.beforeRequestFn = null
        // 请求发送后的hook
        this.afterRequestFn = null
        // 请求发送成功的hook
        this.successRequestFn = null
        // 请求发送失败的hook
        this.failRequestFn = null

        // 请求参数
        this.params = client.params
        this.body = client.body

        // 公共模块
        this.headers = JSON.parse(JSON.stringify(client.headers))
        this.baseUrl = client.baseUrl
        this.checkCode = client.checkCode
        this.defaultLoading = client.defaultLoading
        this.beforeSend = client.beforeSend
        this.complete = client.complete

        //  true 自己catch错误   false 使用统一catch
        this.catch_error = false
        this.onNetworkError = client.onNetworkError

        // true 统一处理code码错误   false 使用统一处理
        this.server_error = false
        this.onServerError = client.onServerError
    }

    // 是否使用内置Loading
    withLoading() {
        const defaultLoading = this.defaultLoading
        if (Object.prototype.toString.call(defaultLoading) === '[object Object]') {
            if (typeof defaultLoading.show === 'function' && typeof defaultLoading.hide === 'function') {
                this.useLoading = true
            }
        }
        return this
    }

    // 使用自己的loading
    custom_loading(customLoading) {
        if (Object.prototype.toString.call(customLoading) === '[object Object]') {
            if (typeof customLoading.show === 'function' && typeof customLoading.hide === 'function') {
                this.defaultLoading = customLoading
                this.useLoading = true
            }
        }
        return this
    }

    // 使用自己的catch / 不走统一catch
    catch_http_error() {
        this.catch_error = true
        return this
    }

    // 自己处理code码错误 / 不走统一处理
    dispose_server_error() {
        this.server_error = true
        return this
    }

    // 请求发送前的Hook
    before(fun) {
        this.beforeRequestFn = typeof fun === 'function' && fun
        return this
    }

    // 请求发送后的hook
    after(fun) {
        this.afterRequestFn = typeof fun === 'function' && fun
        return this
    }

    // 请求发送成功的hook
    success(fun) {
        this.successRequestFn = typeof fun === 'function' && fun
        return this
    }

    // 请求发送失败的hook
    fail(fun) {
        this.failRequestFn = typeof fun === 'function' && fun
        return this
    }

    // 设置请求头
    setHeaders(headers = {}) {
        this.headers = Object.assign(this.headers, headers)
        return this
    }

    exec() {
        const url = `${this.baseUrl}${this.path}`

        return new Promise((resolve, reject) => {
            const request = {
                url,
                method: this.method,
                data: this.body,
                params: this.params,
                headers: this.headers,
                baseUrl: this.baseUrl
            }

            // 发送请求前的hook - 针对整个模块
            this.beforeSend && typeof this.beforeSend === 'function' && this.beforeSend(request)
            // 发送请求前的hook - 针对单一模块
            this.beforeRequestFn && typeof this.beforeRequestFn === 'function' && this.beforeRequestFn(request)

            if (this.useLoading) {
                this.defaultLoading.show()
            }

            server(request).then(response => {
                if (this.useLoading) {
                    this.defaultLoading.hide()
                }

                // 请求结束后的hook - 针对单一模块
                this.afterRequestFn && typeof this.afterRequestFn === 'function' && this.afterRequestFn(response)
                // 请求成功后的hook - 针对单一模块
                this.successRequestFn && typeof this.successRequestFn === 'function' && this.successRequestFn(response)
                // 请求成功后的hook - 针对整个模块
                this.complete && typeof this.complete === 'function' && this.complete(response)

                const { success } = response
                if (success) {
                    resolve(response)
                } else {
                    if (!this.server_error && typeof this.onServerError === 'function') {
                        this.onServerError(response)
                    } else {
                        resolve(response)
                    }
                }
            }).catch(err => {
                if (this.useLoading) {
                    this.defaultLoading.hide()
                }

                // 请求结束后的hook - 针对单一模块
                this.afterRequestFn && typeof this.afterRequestFn === 'function' && this.afterRequestFn(err)
                // 请求失败后的hook - 针对单一模块
                this.failRequestFn && typeof this.failRequestFn === 'function' && this.failRequestFn(err)
                // 请求失败后的hook - 针对整个模块
                this.complete && typeof this.complete === 'function' && this.complete(err)

                if (this.catch_error) {
                    reject(err)
                } else {
                    typeof this.onNetworkError === 'function' ? this.onNetworkError(err) : reject(err)
                }
            })
        })
    }
}

class HttpServe {
    constructor(options = {}) {
        this.params = {}
        this.body = {}

        const { baseUrl = '', checkCode, headers, complete, defaultLoading, beforeSend, onNetworkError, onServerError } = options

        // 公用模块
        this.beforeSend = beforeSend
        this.complete = complete
        this.headers = Object.assign({}, headers)
        this.checkCode = checkCode
        this.baseUrl = baseUrl
        this.defaultLoading = defaultLoading
        this.onNetworkError = onNetworkError // catch统一方法
        this.onServerError = onServerError // 统一处理 code 码错误处理
    }

    get(path, params = {}) {
        this.params = params
        this.body = {}
        return new Call(this, GET, path)
    }

    post(path, body = {}) {
        this.body = body
        this.params = {}
        return new Call(this, POST, path)
    }

    // 设置请求头
    setHeaders(headers = {}) {
        this.headers = Object.assign(this.headers, headers)
        return this
    }
}

export default HttpServe
