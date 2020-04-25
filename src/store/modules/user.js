import { getToken, setToken, removeToken, getCustomerId } from '@/utils/auth'
import { resetRouter } from '@/router'
import api from '@/http'

const getDefaultState = () => {
    return {
        token: getToken(),
        name: '',
        avatar: '',
        customerId: getCustomerId() // 商家id其实这个是用不上的
    }
}

const state = getDefaultState()

const mutations = {
    RESET_STATE: (state) => {
        Object.assign(state, getDefaultState())
    },
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_CUSTOMERID: (state, customerId) => {
        state.customerId = customerId
    }
}

const actions = {
    // user login
    login({ commit }, userInfo) {
        const { username, password } = userInfo
        return new Promise((resolve, reject) => {
            api.UserLogin({ userName: username.trim(), password: password }).then(response => {
                const { data, success } = response
                if (success) {
                    commit('SET_TOKEN', data.token)
                    commit('SET_CUSTOMERID', data.customerId)
                    setToken(data.token, data.customerId)
                    resolve()
                } else {
                    reject(response)
                }
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({ commit, state }) {
        return new Promise((resolve, reject) => {
            const data = {
                roles: ['admin'],
                introduction: 'I am a super administrator',
                avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
                name: 'Super Admin'
            }
            if (!data) {
                reject('Verification failed, please Login again.')
            }
            commit('SET_NAME', '默认姓名')
            commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
            resolve(data)
        })
    },

    // user logout
    logout({ commit, state }) {
        return new Promise((resolve, reject) => {
            // logout(state.token).then(() => {
            removeToken() // must remove  token  first
            resetRouter()
            commit('RESET_STATE')
            resolve()
            // }).catch(error => {
            //     reject(error)
            // })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            removeToken() // must remove  token  first
            commit('RESET_STATE')
            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

