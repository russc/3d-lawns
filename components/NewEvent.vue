<template>
  <div>
      <a v-on:click="toggleDrawer()" class="add btn-floating btn-medium waves-effect waves-light red"><i class="material-icons">close</i></a>
      <h5>Time</h5>
      <h5>Clients</h5>
      <form id="newEvent">
        <fieldset v-for="client in allClients" v-bind:key="client.id">
          <input type="radio" :id="client.id" :value="client.id" v-model="clientSelected"/>
          <label :for="client.id">{{client.name}}</label>
        </fieldset>
        <!-- <span>{{clientSelected}}</span> -->
        <h5>Services</h5>
        <fieldset v-for="service in allServices" v-bind:key="service.id">
          <input type="checkbox" :id="service.id" :value="service.id" v-model="servicesSelected"/>
          <label :for="service.id">{{service.name}}</label>
        </fieldset>
        <!-- <span>{{servicesSelected}}</span> -->
        <input type="button" v-on:click="newEvent()" value="save" />
      </form>
    </div>
</template>

<script>
import allEvents from '~/apollo/allEvents.graphql'

export default {
  data () {
    return {
      events: null
    }
  },
  apollo: {
    events: {
      query: allEvents
    }
  }
}
</script>
