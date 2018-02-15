<template>
  <div class="row">
    <div class="col offset-s1 s10 m4 xl3" v-for="client in allClients" v-bind:key="client.id">
        <div class="card">
          <div class="card-content center-align">
            <img :src="client.avatar" class="circle responsive-img medium" />
            <h5 class="center-align">{{client.name}}</h5>
            <p>{{client.email}}</p>
            <h6><i class="material-icons small activator">more_horiz</i></h6>
          </div>
          <div class="card-reveal">
            <span class="card-title grey-text text-darken-4">{{client.name}}<i class="material-icons right">close</i></span>
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
  apollo: {
    allClients: {
      query: allClients,
      prefetch: true
    }
  }
}
</script>

<style lang="scss">
  
</style>
