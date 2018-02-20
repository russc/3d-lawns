<template>
  <div>
    <a @click="$router.go(-1)"><i class="material-icons medium">arrow_backward</i></a>
    <h1>{{date}}</h1>
    <h1>{{event.datetime | formatTime}}</h1>
    <h1>{{event.client.name}}</h1>
    <ul>
      <li v-for="service in event.services" :key="service.id">
        {{service.name}} ${{service.price}}
      </li>
    </ul>
    <h3>
      Total:{{event.services.map(service => service.price).reduce((acc, curr) => acc + curr) | formatMoney}}
    </h3>
  </div>
</template>

<script>
import moment from 'moment'
import Event from '~/apollo/Event.graphql'

export default {
  head () {
    return {
      title: 'Event',
      event: null
    }
  },
  data () {
    return {
      page: this.$route.params.event,
      date: moment(this.$route.params.day).format('ll')

    }
  },
  apollo: {
    event: {
      query: Event,
      prefetch: ({ route }) => ({ id: route.params.event }),
      variables () {
        return { id: this.$route.params.event }
      },
      update: data => data.Event
    }
  }
}
</script>
