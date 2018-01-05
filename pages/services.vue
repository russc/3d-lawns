<template>
  <div>
    <h1>Services</h1>
    <ul class="collection">
      <li v-for="service in allServices" :key="service.id" class="collection-item">
        {{service.name}} {{service.price | formatMoney}}
      </li>
    </ul>
  </div>
</template>

<script>
import allServices from '~/apollo/allServices.graphql'

export default {
  head: {
    title: 'Services'
  },
  apollo: {
    allServices: {
      query: allServices,
      prefetch: true
    }
  },
  mounted: () => {

  }

}
</script>

