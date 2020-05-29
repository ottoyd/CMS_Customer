<template>
  <div class="card-container">
    <Detail> </Detail>
    <div class="row">
      <div class="card">
        <div class="card-image">
          <img class="image" :src="product.image_url">
          <span class="card-title">{{product.name}}</span>
          <a v-if="isLogin" class="btn-floating halfway-fab waves-effect waves-light red" @click="addToCart(product)"><i class="material-icons">+</i></a>
        </div>
        <div class="card-content">
          <p>{{product.price | currency}}</p>
          <p>{{product.stock}}</p>
          <a class="modal-trigger" href="#modal1"> <img class="detail" src="https://image.freepik.com/free-icon/view-details_318-1493.jpg"></a>
          <p class="tags"><a class="btn-flat" @click="category(product.tags)">{{product.tags}}</a></p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Detail from '../components/Detail'
import axios from 'axios'
export default {
  props: ['product'],
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    carts () {
      return this.$store.state.carts
    }
  },
  components: {
    Detail
  },
  methods: {
    makeToast (variant, msg) {
      this.$bvToast.toast(
        msg + ' Added to your Cart', {
          variant: variant,
          solid: true
        })
    },
    category (tags) {
      this.$store.dispatch('getProduct', tags)
    },
    addToCart (product) {
      console.log(product.name)
      const temp = this.$store.state.carts
      const check = function (id) {
        for (const i in temp) {
          if (temp[i].ProductId === id) {
            return false
          }
        }
        return true
      }
      if (check(product.id)) {
        this.makeToast('success', product.name)
        axios({
          method: 'POST',
          url: 'https://hidden-beyond-51968.herokuapp.com/product/cart',
          data: {
            id: product.id
          },
          headers: {
            access_token: localStorage.getItem('access_token')
          }
        })
          .then((result) => {
            // console.log(result)
            this.$store.dispatch('getCart')
          }).catch((err) => {
            console.log(err)
          })
      } else {
        this.makeToast('warning', `${product.name} already`)
      }
    }
  }
}
</script>

<style scoped>
.detail {
  width: 30px;
  float: left
}
.tags {
  text-align: right;
  font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
}
.image {
  height: 200px;
  filter: brightness(60%)
}
.card-container {
  max-width: 300px;
  font-size:18px;
  padding: 30px;
}
</style>
