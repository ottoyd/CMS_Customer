<template>
  <div>
    <b-modal ref="my-modal" hide-footer>
      <h4>{{this.request.toUpperCase()}}</h4>
      <h5>{{topMsg}}</h5>
      <div class="modal-content">
        <input type="text" placeholder="Email" v-model="email">
        <input type="password" placeholder="Password" v-model="password">
      </div>
      <div class="modal-footer">
        <a class="btn-flat" @click="cancle">Cancle</a>
        <a class="btn-flat" @click="login">{{this.request.toUpperCase()}}</a>
        <p><a class="btn-flat" @click="togle">{{msg}}</a></p>
      </div>
    </b-modal>
    <CardDetail> </CardDetail>
    <nav class="white">
      <div class="nav-wrapper container">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li v-if="isLogin && carts.length === 0"><router-link to="/cart">MyCart</router-link></li>
          <li class="have-cart" v-if="isLogin && carts.length > 0"><router-link to="/cart">MyCart</router-link></li>
          <li v-if="isLogin"><router-link to="/history">History</router-link></li>
          <li v-if="!isLogin"><a @click="showModal">Login</a></li>
          <li v-if="isLogin"><a @click="logout">Logout</a></li>
        </ul>
        <ul class="right hide-on-med-and-down">
          <!--  -->
          <li v-if="isLogin">
            <b-dropdown id="dropdown-form" text="Top Up" ref="dropdown" class="m-2">
              <b-dropdown-form class="form-top">
                <b-form-group>
                  <b-form-input
                    v-model="topUpEmail"
                    id="dropdown-form-email"
                    placeholder="email@example.com"
                  ></b-form-input>
                </b-form-group>
                  <b-form-radio-group
                    v-model="nominal"
                    :options="options"
                    class="radio"
                    value-field="item"
                    text-field="name"
                    disabled-field="notEnabled"
                  ></b-form-radio-group>
                <b-button variant="primary" size="sm" @click="topUp">Send Code</b-button>
              </b-dropdown-form>
            </b-dropdown>
          </li>
          <li v-if="isLogin">
            <b-dropdown id="dropdown-form" text="Rendem Code" ref="dropdown" class="m-2">
              <b-dropdown-form class="form-top">
                <b-form-group>
                  <b-form-input
                    v-model="code"
                  ></b-form-input>
                </b-form-group>
                <b-button variant="primary" size="sm" @click="rendem">Rendem</b-button>
              </b-dropdown-form>
            </b-dropdown>
          </li>
          <!--  -->
          <li class="cate">
            <div>
              <b-dropdown text="Category">
                <b-dropdown-item class="drop" @click="getByTags()">All Items</b-dropdown-item>
                <b-dropdown-item class="drop" @click="getByTags('Meat')">Meat</b-dropdown-item>
                <b-dropdown-item class="drop" @click="getByTags('Herbs')">Herbs</b-dropdown-item>
                <b-dropdown-item class="drop" @click="getByTags('Fruit')">Fruit</b-dropdown-item>
                <b-dropdown-item class="drop" @click="getByTags('Other')">Other</b-dropdown-item>
              </b-dropdown>
            </div>
          </li>
          <li v-if="isLogin" class="balance">{{balance | currency}}</li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import axios from 'axios'
import CardDetail from '../components/Detail'
export default {
  created () {
    if (localStorage.access_token) {
      this.$store.dispatch('getBal')
    }
  },
  data () {
    return {
      code: '',
      topUpEmail: '',
      nominal: 0,
      topMsg: '',
      email: '',
      password: '',
      request: 'login',
      msg: 'Dint Have Account ?',
      options: [
        { item: '1000000', name: '1000000' },
        { item: '500000', name: '500000' },
        { item: '200000', name: '200000' },
        { item: '100000', name: '100000' },
        { item: '50000', name: '50000' },
        { item: '10000', name: '10000' }
      ]
    }
  },
  components: {
    CardDetail
  },
  methods: {
    rendem () {
      axios({
        method: 'PUT',
        url: 'https://hidden-beyond-51968.herokuapp.com/rendem',
        data: {
          code: this.code,
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((result) => {
          this.makeToast('success', `Succes fully Rendem ${result.data}`)
          this.$store.dispatch('getBal')
        }).catch((err) => {
          this.makeToast('danger', err.response.data.errors[0].msg)
        })
    },
    topUp () {
      axios({
        method: 'POST',
        url: 'https://hidden-beyond-51968.herokuapp.com/topUp',
        data: {
          topUpEmail: this.topUpEmail,
          nominal: this.nominal
        }
      })
        .then((result) => {
          this.makeToast('success', `Top Up Succes Code Sent To ${this.topUpEmail}`)
          this.topUpEmail = ''
          this.nominal = 0
        }).catch((err) => {
          console.log(err)
          this.makeToast('danger', 'Email or Nominal Cannot be Null')
        })
    },
    makeToast (variant, msg) {
      this.$bvToast.toast(
        msg, {
          variant: variant,
          solid: true
        }
      )
    },
    showModal () {
      this.$refs['my-modal'].show()
    },
    hideModal () {
      this.$refs['my-modal'].hide()
    },
    logout () {
      localStorage.clear()
      this.$store.commit('SET_LOGIN', false)
      this.$router.push('/')
      this.email = ''
      this.password = ''
      this.topMsg = ''
      this.request = 'login'
      this.msg = 'Dint Have Account ?'
    },
    getByTags (tags) {
      this.$store.dispatch('getProduct', tags)
    },
    login () {
      axios({
        method: 'POST',
        url: `https://hidden-beyond-51968.herokuapp.com/${this.request}`,
        data: {
          email: this.email,
          password: this.password
        }
      }).then((result) => {
        if (result) {
          localStorage.setItem('access_token', result.data.access_token)
          this.$store.commit('SET_LOGIN', true)
          this.makeToast('success', `Helo ${result.data.email}`)
          this.$store.dispatch('getCart')
          this.$store.dispatch('getBal')
          this.hideModal()
        }
      }).catch((err) => {
        this.topMsg = err.response.data.errors[0].msg
      })
    },
    cancle () {
      this.email = ''
      this.password = ''
    },
    togle () {
      if (this.request === 'login') {
        this.request = 'register'
        this.msg = 'Already Have Account ?'
      } else if (this.request === 'register') {
        this.request = 'login'
        this.msg = 'Dint Have Account ?'
      }
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    carts () {
      return this.$store.state.carts
    },
    balance () {
      return this.$store.state.balance
    }
  }
}
</script>

<style scoped>
.radio {
  color: aqua;
}
.form-top {
  min-width: 300px;
}
.balance {
  color: black;
}
.have-cart {
  border: solid #9c1f1f 0.1px;
  box-shadow: 1px 1px 1px 1px #888888;
}
.cate {
  padding: 0px 40px;
}
.drop {
  width: 150px;
}
.img-src {
  width: 50px;
}
nav {
  position: fixed;
  z-index: 10;
}
nav ul a,
nav .brand-logo {
  color: #444;
}

p {
  line-height: 2rem;
}
</style>
