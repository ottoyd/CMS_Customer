import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    isLogin: false,
    products: [],
    carts: [],
    globalMsg: '',
    total: 0,
    globalTags: null,
    history: [],
    balance: 110
  },
  mutations: {
    GET_BALANCE (state, status) {
      state.balance = status
    },
    SET_LOGIN (state, status) {
      state.isLogin = status
    },
    GET_PRODUCT (state, status) {
      state.products = status
    },
    GET_CART_UNPAYED (state, status) {
      state.carts = status
    },
    GET_CART_PAYED (state, status) {
      state.history = status
    },
    SET_GLOBAL (state, status) {
      state.globalMsg = status
    },
    SET_TOTAL (state, status) {
      state.total = status
    },
    SET_TAGS (state, status) {
      state.globalTags = status
    }
  },
  actions: {
    getProduct: function (context, tags) {
      console.log(tags)
      if (tags) {
        return axios({
          method: 'GET',
          url: `https://hidden-beyond-51968.herokuapp.com/product?tags=${tags}`
        })
          .then((result) => {
            context.commit('GET_PRODUCT', result.data)
            context.commit('SET_TAGS', tags)
          }).catch((err) => {
            console.log(err)
          })
      } else {
        return axios({
          method: 'GET',
          url: 'https://hidden-beyond-51968.herokuapp.com/product'
        })
          .then((result) => {
            context.commit('GET_PRODUCT', result.data)
            context.commit('SET_TAGS', '')
          }).catch((err) => {
            console.log(err)
          })
      }
    },
    getCart: function (context) {
      return axios({
        method: 'GET',
        url: 'https://hidden-beyond-51968.herokuapp.com/product/cart',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((result) => {
          if (result.data.length === 0) {
            context.commit('SET_GLOBAL', 'Cart Anda Masih Kosong')
          }
          let newTotal = 0
          for (const i in result.data) {
            if (result.data[i].select === true) {
              newTotal += result.data[i].subTotal
            }
          }
          context.commit('SET_TOTAL', newTotal)
          context.commit('GET_CART_UNPAYED', result.data)
        }).catch((err) => {
          console.log(err)
        })
    },
    history: function (context) {
      return axios({
        method: 'GET',
        url: 'https://hidden-beyond-51968.herokuapp.com/product/history',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((result) => {
          context.commit('GET_CART_PAYED', result.data)
        }).catch((err) => {
          console.log(err)
        })
    },
    getBal: function (context) {
      return axios({
        method: 'GET',
        url: 'https://hidden-beyond-51968.herokuapp.com/',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((result) => {
          context.commit('GET_BALANCE', result.data.result.balance)
        }).catch((err) => {
          console.log(err)
        })
    }
  }
})
