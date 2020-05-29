<template>
  <div>
    <h1>-</h1>
    <h1>-</h1>
    <table>
      <thead>
        <tr>
          <th>Item Name</th>
          <th>Sub Total</th>
          <th>Quantity</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in history" :key="key">
          <td>{{item.Product.name}}</td>
          <td>{{item.subTotal  | currency}}</td>
          <td>{{item.demand}}</td>
          <td>{{item.createdAt}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  created () {
    this.$store.dispatch('history')
      .then((result) => {
      })
    if (localStorage.access_token) {
      this.$store.commit('SET_LOGIN', true)
    }
  },
  computed: {
    history () {
      return this.$store.state.history
    }
  }
}
</script>

<style>
td {
  text-align: center;
}
</style>
