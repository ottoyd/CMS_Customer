<template>
  <div>
    <div class="fling-minislide">
      <img src="https://news.nus.edu.sg/sites/default/files/resources/research%20blog/2019/2019-03/Mushroom%20banner.jpg"/>
      <img src="https://www.digregoriofoods.com/wp-content/uploads/2012/08/sausage.jpg"/>
      <img src="https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/grill-royalty-free-image-475200354-1554432211.jpg?crop=0.961xw:0.961xh;0.0391xw,0.0391xh&resize=480:*"/>
      <img src="https://breakawayexperiences.com/content/images/thumbs/0010314_bbq-cooking-class-toronto.jpeg"/>
    </div>
    <div v-if="isLoading" class="spinner">
      <div class="cube1"></div>
      <div class="cube2"></div>
    </div>
    <h2>{{total | currency}}</h2>
    <button @click="buy">Buy All</button>
    <h3>{{globalMsg}}</h3>
    <table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Item Price</th>
          <th>Sub Total</th>
          <th>Quantity</th>
          <th>Kurir</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in carts" :key="key">
          <td>{{item.Product.name}}</td>
          <td>{{item.Product.price | currency}}</td>
          <td>{{item.subTotal | currency}}</td>
          <td>
            <button class="btn-audit" @click="demand(item, 'up')">+</button>
            {{item.demand}}
            <button class="btn-audit" v-if="item.demand > 0" @click="demand(item, 'down')">-</button>
            <button class="btn-audit" v-else>-</button>
          </td>
          <td v-if="item.demand > 0">
            <b-form-select class="select" @change="selectCour(item, $event)">
              <b-form-select-option v-if="item.cour == 2" value="2" selected>2 Hari Rp 30000</b-form-select-option>
              <b-form-select-option v-else value="2">2 Hari Rp 30000</b-form-select-option>
              <b-form-select-option v-if="item.cour == 3" value="3" selected>3 Hari Rp 20000</b-form-select-option>
              <b-form-select-option v-else value="3">3 Hari Rp 20000</b-form-select-option>
            </b-form-select>
          </td>
          <td v-else>
            <b-form-select class="select">
              <b-form-select-option v-if="item.cour == 2" value="2" disabled>2 Hari Rp 30000</b-form-select-option>
              <b-form-select-option v-else disabled value="2">2 Hari Rp 30000</b-form-select-option>
              <b-form-select-option v-if="item.cour == 3" value="3" disabled>3 Hari Rp 20000</b-form-select-option>
              <b-form-select-option v-else disabled value="2">3 Hari Rp 20000</b-form-select-option>
            </b-form-select>
          </td>
          <td>
            <button class="btn-audit" @click="dropItem(item), makeToast('danger'  , item.Product.name, ' Removed')">Remove</button>
            <button class="btn-audit" v-if="item.select === false" @click="selected(item), makeToast('info', item.Product.name, ' Check')">Check</button>
            <button class="btn-audit" v-if="item.select === true" variant="Uncheck" @click="selected(item), makeToast('danger', item.Product.name, ' Uncheck')">Uncheck</button>
          </td>
        </tr>
      </tbody>
    </table>
    <h1>{{courier}}</h1>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      isLoading: false,
      check: true,
      courier: ''
    }
  },
  created () {
    this.isLoading = true
    this.$store.dispatch('getCart')
      .then((result) => {
        this.isLoading = false
      })
    if (localStorage.access_token) {
      this.$store.commit('SET_LOGIN', true)
    }
  },
  computed: {
    carts () {
      return this.$store.state.carts
    },
    isLogin () {
      return this.$store.state.isLogin
    },
    globalMsg () {
      return this.$store.state.globalMsg
    },
    total () {
      return this.$store.state.total
    }
  },
  methods: {
    selectCour (item, event) {
      return axios({
        method: 'PUT',
        url: 'https://hidden-beyond-51968.herokuapp.com/product/cart/cour',
        headers: {
          access_token: localStorage.getItem('access_token')
        },
        data: {
          duration: event,
          item
        }
      })
        .then((rese) => {
          this.$store.dispatch('getCart')
        }).catch((err) => {
          console.log(err)
          this.$store.dispatch('getCart')
        })
    },
    makeToast (variant, msg, status) {
      if (status) {
        this.$bvToast.toast(
          msg + status + ' from your Cart', {
            variant: variant,
            solid: true
          }
        )
      } else {
        this.$bvToast.toast(
          msg, {
            variant: variant,
            solid: true
          }
        )
      }
    },
    buy () {
      return axios({
        method: 'PUT',
        url: 'https://hidden-beyond-51968.herokuapp.com/product/cart/buy',
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((rese) => {
          this.makeToast('info', 'thank you come again !!')
          this.$store.dispatch('getBal')
          this.$store.dispatch('getCart')
        }).catch((err) => {
          this.makeToast('danger', err.response.data.errors[0].msg)
          console.log(err.response.data.errors[0].msg)
          this.$store.dispatch('getCart')
        })
    },
    selected (item) {
      return axios({
        method: 'PUT',
        url: 'https://hidden-beyond-51968.herokuapp.com/product/cart/check',
        data: {
          idCart: item.idCart,
          select: !item.select
        },
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((result) => {
          this.$store.dispatch('getCart')
          console.log('object')
        }).catch((err) => {
          console.log(err)
        })
    },
    dropItem (item) {
      return axios({
        method: 'DELETE',
        url: 'https://hidden-beyond-51968.herokuapp.com/product/cart/delete',
        data: {
          idCart: item.idCart
        },
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((result) => {
          this.$store.dispatch('getCart')
          console.log('object')
        }).catch((err) => {
          console.log(err)
        })
    },
    demand (item, step) {
      return axios({
        method: 'PUT',
        url: 'https://hidden-beyond-51968.herokuapp.com/product/cart/update',
        data: {
          item,
          idCart: item.idCart,
          ProductId: item.ProductId,
          demand: item.demand,
          step
        },
        headers: {
          access_token: localStorage.getItem('access_token')
        }
      })
        .then((result) => {
          console.log('result')
          this.$store.dispatch('getCart')
        }).catch((err) => {
          console.log(err)
        })
    }
  }
}
</script>

<style scoped>
.select {
  width: 200px;
}
table {
  border: rgb(224, 96, 96) solid 2px;
}
.btn-audit {
  margin: 0px 10px;
}
td {
  text-align: center;
}
  .parallax {
  /* The image used */
  background-image: url("../assets/parlax.jpg");
  filter: brightness(30%);
  min-height: 400px;

  /* Create the parallax scrolling effect */
  background-attachment: fixed;
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  }
  .fling-minislide {width:65%; height:0px; padding-bottom: 17%; overflow:hidden; position:relative; }
  .fling-minislide img{ position:absolute; animation:fling-minislide 20s infinite; opacity:0; width: 50%; background-size: cover; border: red solid 3px;}
  @keyframes fling-minislide {25%{opacity:1;} 40%{opacity:0;}}
  .fling-minislide img:nth-child(4){animation-delay:0s;}
  .fling-minislide img:nth-child(3){animation-delay:5s;}
  .fling-minislide img:nth-child(2){animation-delay:10s;}
  .fling-minislide img:nth-child(1){animation-delay:15s;}

  .spinner {
  margin: 100px auto;
  width: 40px;
  height: 40px;
  position: relative;
}

.cube1, .cube2 {
  background-color: #333;
  width: 15px;
  height: 15px;
  position: absolute;
  top: 0;
  left: 0;
  -webkit-animation: sk-cubemove 1.8s infinite ease-in-out;
  animation: sk-cubemove 1.8s infinite ease-in-out;
}

.cube2 {
  -webkit-animation-delay: -0.9s;
  animation-delay: -0.9s;
}

@-webkit-keyframes sk-cubemove {
  25% { -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5) }
  50% { -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg) }
  75% { -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5) }
  100% { -webkit-transform: rotate(-360deg) }
}

@keyframes sk-cubemove {
  25% {
    transform: translateX(42px) rotate(-90deg) scale(0.5);
    -webkit-transform: translateX(42px) rotate(-90deg) scale(0.5);
  } 50% {
    transform: translateX(42px) translateY(42px) rotate(-179deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-179deg);
  } 50.1% {
    transform: translateX(42px) translateY(42px) rotate(-180deg);
    -webkit-transform: translateX(42px) translateY(42px) rotate(-180deg);
  } 75% {
    transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
    -webkit-transform: translateX(0px) translateY(42px) rotate(-270deg) scale(0.5);
  } 100% {
    transform: rotate(-360deg);
    -webkit-transform: rotate(-360deg);
  }
}
</style>
