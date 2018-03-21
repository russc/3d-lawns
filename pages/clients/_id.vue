<template>
  <div v-if="client && loading == 0" class="container">
    <h3>{{client.name}}</h3>
    <div v-for="event in client.events" :key="event.id">
      <router-link :to="{path: `/event/${event.id}`}">
        <i class="material-icons">event_note</i> {{dateFormat(event.datetime)}}
      </router-link>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import Client from '~/apollo/Client.graphql'
export default {
  head () {
    return {
      title: 'Client Jobs'
    }
  },
  data() {
    return {
      client: null,
      loading: 0
    }
  },
  methods: {
    dateFormat (date) {
      return format(date, 'MMM Do YYYY - h:mm A')
    }
  },
  apollo: {
    client:{
      query: Client,
      prefetch: ({ route }) => ({ id: route.params.id }),
      variables () {
        return { id: this.$route.params.id }
      },
      loadingKey: 'loading',
      update: data => data.Client
    }
  }
  
}
</script>

<style lang="scss">
  table, a {
    color: #fff;
  }
  
  a:hover {
    text-decoration: none;
  }
</style>
