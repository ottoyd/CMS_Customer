<template>
  <div>
    <div class="parallax"></div>
    <div v-if="isLoading" class="spinner">
      <div class="cube1"></div>
      <div class="cube2"></div>
    </div>
    <div v-if="globalTags" class="tags-spot">
      <div class="tags">
        <button @click="remove" class="remove">X</button>
        <h5>{{globalTags}}</h5>
      </div>
    </div>
    <div class="card-con">
      <Card v-for="(product, id) in products" :key="id" :product="product"/>
    </div>
    <div class="parallax"></div>
  </div>
</template>
<script>
import Card from '../components/Card'
export default {
  data () {
    return {
      isLoading: false
    }
  },
  components: {
    Card
  },
  methods: {
    remove () {
      this.$store.dispatch('getProduct')
    }
  },
  created () {
    this.isLoading = true
    this.$store.dispatch('getProduct')
      .then((result) => {
        this.isLoading = false
      })
    if (localStorage.access_token) {
      this.$store.commit('SET_LOGIN', true)
      this.$store.dispatch('getCart')
    }
  },
  computed: {
    products () {
      return this.$store.state.products
    },
    isLogin () {
      return this.$store.state.isLogin
    },
    globalTags () {
      return this.$store.state.globalTags
    }
  }
}
</script>

<style scoped>
.tags-spot {
  height: 40px;
  background-color: rgb(249, 255, 126);
}
.tags {
  margin: 10px;
  padding: 5px;
  background-color: rgb(222, 233, 7);
  border-radius: 15px;
  max-width: 120px;
}
.tags .remove {
  float: right;
  border: none;
  border-radius: 10px;
  background-color: rgb(235, 240, 151);
}
.card-con {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

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

body, html {
  height: 100%;
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

</style>
