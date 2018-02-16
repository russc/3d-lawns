<template>
  <div>
    <h5>Time</h5>
    <h5>Clients</h5>
    <form id="newEvent">
      <fieldset v-for="client in clients" v-bind:key="client.id">
        <input type="radio" :id="client.id" :value="client.id" v-model="clientSelected"/>
        <label :for="client.id">{{client.name}}</label>
      </fieldset>
      <!-- <span>{{clientSelected}}</span> -->
      <h5>Services</h5>
      <fieldset v-for="service in services" v-bind:key="service.id">
        <input type="checkbox" :id="service.id" :value="service.id" v-model="servicesSelected"/>
        <label :for="service.id">{{service.name}}</label>
      </fieldset>
      <!-- <span>{{servicesSelected}}</span> -->
      <input type="button" v-on:click="newEvent()" value="save" />
    </form>
  </div>
</template>

<script>
import allServices from '~/apollo/allServices.graphql'
import allClients from '~/apollo/allClients.graphql'
import createEvent from '~/apollo/createEvent.graphql'

export default {
  data () {
    return {
      clientSelected: '',
      servicesSelected: []
    }
  },
  head () {
    return {
      title: 'New Event'
    }
  },
  apollo: {
    services: {
      query: allServices,
      update: data => data.allServices
    },
    clients: {
      query: allClients,
      update: data => data.allClients
    }
  },
  methods: {
    toggleDrawer () {
      document.querySelector('.drawer').classList.toggle('open')
    },
    newEvent () {
      this.$apollo.mutate({
        mutation: createEvent,
        variables: {
          date: this.$route.params.day,
          datetime: `${this.$route.params.day}T06:00:00.000Z`,
          servicesIds: this.servicesSelected,
          clientId: this.clientSelected
        },
        refetchQueries: ['allEvents']
      }).then(data => {
        // Result
        console.log(data)
        this.servicesSelected = []
        this.clientSelected = ''
        this.$router.push(`/calendar/${this.$route.params.day}`)
      }).catch(error => {
        // Error
        console.error(error)
      })
    }
  }
}
</script>
