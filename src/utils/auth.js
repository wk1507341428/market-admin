import Cookies from 'js-cookie'

const TokenKey = 'market_token'
const customerIdKey = 'market_customerId' // 这里记一个商家id 迟早要改

export function getToken() {
    return Cookies.get(TokenKey)
}

export function getCustomerId() {
    return Cookies.get(customerIdKey)
}

export function setToken(token, customerId) {
    Cookies.set(TokenKey, token)
    Cookies.set(customerIdKey, customerId)
    return
}

export function removeToken() {
    Cookies.remove(TokenKey)
    Cookies.remove(customerIdKey)
    return
}
