<template>
  <div class="row">
    <div class="col offset-s1 s10 m4 xl3" v-for="client in clients" v-bind:key="client.id">
        <div class="card">
          <div class="card-content center-align">
            <i class="material-icons large">face</i>
            <h5 class="center-align">{{client.name}}</h5>
            <p>{{client.email}}</p>
            <p>{{client.address}}</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import allClients from '~/apollo/allClients.graphql'

export default {
  head: {
    title: 'Clients'
  },
  data () {
    return {
      clients: []
    }
  },
  apollo: {
    clients: {
      query: allClients,
      prefetch: true,
      update: data => data.allClients
    }
  }
}
</script>

<style lang="scss">
  
</style>
