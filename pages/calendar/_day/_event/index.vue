<template>
  <div class="event">
    <h5>{{date}} - {{event.datetime | formatTime}}</h5>
    <div class="client-info">
      <div class="avatar circle">
        <i class="material-icons large">face</i>
      </div>
      <div class="address">
        <h4>{{event.client.name}}</h4>
        <a v-bind:href="`https://www.google.com/maps/search/?api=1&query=${event.client.address}})`"><i class="material-icons left">location_on</i>{{event.client.address}}</a>
      </div>
    </div>
    
    <ul>
      <li v-for="service in event.services" :key="service.id">
        {{service.name}} ${{service.price}}
      </li>
    </ul>
    <h3 class="total">
      Total: {{event.services.map(service => service.price).reduce((acc, curr) => acc + curr) | formatMoney}}
    </h3>
    <div class="tools">
      <a class="waves-effect waves-light btn" @click="$router.push({ path: `/calendar/${day}` })"><i class="material-icons">arrow_backward</i></a>
      <a class="waves-effect waves-light btn" @click="$router.go(-1)"><i class="material-icons">check</i></a>
      <a class="waves-effect waves-light btn" @click="$router.go(-1)"><i class="material-icons">edit</i></a>
    </div>
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
      day: this.$route.params.day,
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
<style lang='scss'>
  .client-info {
    display: grid;
    grid-template-columns: auto auto;
    justify-content: center;
    align-items: center;
    a {
      color: #fff;
    }
    .address
    i {
      width: 10px;
    }
  }
  .event {
    color: #fff;
    display: grid;
    grid-template-rows: repeat(4, auto);
    justify-content: center;
    text-align: center;
  }
  .tools {
    background: #26a69a;
    bottom: 0;
    display: flex;
    // flex-flow: row nowrap;
    // grid-template-columns: repeat(4, auto);
    // grid-template-rows: auto;
    justify-content: space-between;
    position: fixed;
    width: 100%;
    a {
      background: #26a69a;
      color: #fff;
      width: 20%;
    }
  }
  .total {
    position: fixed;
    bottom: 20px;
    font-style: italic;
    color: #fff;
  }

</style>

