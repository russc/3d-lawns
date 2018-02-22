<template>
  <div>
    <div class="row">
      <div class="col offset-s1 s10 m4 xl3">
        <div class="card">
          <div class="card-content center-align">
            <div class="avatar circle">
              <i class="material-icons large">face</i>
              <span class="card-title grey-text text-darken-4">{{event.client.name}}<i class="material-icons right tiny activator">edit</i></span>
            </div>
            <a v-bind:href="`https://www.google.com/maps/search/?api=1&query=${event.client.address}})`">{{event.client.address}}</a>
          </div>
          <div class="card-reveal">
            <!-- <span class="card-title grey-text text-darken-4"><i class="material-icons right tiny">close</i></span> -->
            <div class="avatar circle">
              <i class="material-icons large">face</i>
              <input type="text" :value="event.client.name" />
              <span class="card-title grey-text text-darken-4"><i class="material-icons right tiny">check</i></span>
              <span class="card-title grey-text text-darken-4"><i class="material-icons right tiny">close</i></span>
            </div>
            <input type="text" :value="event.client.address">
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div v-if="!edit" class="col offset-s1 s10 m4 x13">
        <h4><i @click="edit = true" class="material-icons right small left">edit</i>Services</h4>
        <div class="selected" v-for="service in event.services" :key="service.id">
          <h5>{{service.name}}</h5>
          <h5>${{service.price}}</h5>
        </div>
      </div>
      <div v-else class="col offset-s1 s10 m4 x13">
        <h4><i @click="edit = false" class="material-icons right small left">close</i>Edit Services</h4>
        <!-- <div class="services" v-for="service in event.services" :key="service.id">
          <h5>{{service.name}}</h5>
          <h5>${{service.price}}</h5>
        </div> -->
        <fieldset v-for="service in allServices" v-bind:key="service.id">
          <input type="checkbox" :id="service.id" :value="service.id" v-model="servicesSelected"/>
          <label :for="service.id">{{service.name}}</label>
        </fieldset>
      </div>
    </div>

  </div>
  
  <!-- <div class="event">
    <h5>{{date}} - {{event.datetime | formatTime}}</h5>
    <div class="client-info">
      <div class="avatar circle">
        <i class="material-icons large">face</i>
      </div>
        <h4>{{event.client.name}}</h4>
        
    </div>
    <a v-bind:href="`https://www.google.com/maps/search/?api=1&query=${event.client.address}})`">{{event.client.address}}</a>
    
    <h4>Services</h4>
    <div v-for="service in event.services" :key="service.id">
      <h5>{{service.name}}</h5>
      <h5>${{service.price}}</h5>
    </div>

    <h3 class="total">
      Total: {{event.services.map(service => service.price).reduce((acc, curr) => acc + curr) | formatMoney}}
    </h3>
    <div class="tools">
      <a class="waves-effect waves-light" @click="$router.push({ path: `/calendar/${day}` })">Back</a>
      <a class="waves-effect waves-light btn" @click="$router.go(-1)"><i class="material-icons">check</i></a>
      <a class="waves-effect waves-light btn" @click="$router.go(-1)"><i class="material-icons">edit</i></a>
    </div>
  </div> -->
</template>

<script>
import moment from 'moment'
import Event from '~/apollo/Event.graphql'
import allServices from '~/apollo/allServices.graphql'

export default {
  head () {
    return {
      title: 'Event'
    }
  },
  data () {
    return {
      page: this.$route.params.event,
      day: this.$route.params.day,
      date: moment(this.$route.params.day).format('ll'),
      edit: false,
      servicesSelected: []
    }
  },
  mounted () {
    this.event.services.map(service => this.servicesSelected.push(service.id))
    console.log(this.servicesSelected)
  },
  apollo: {
    event: {
      query: Event,
      prefetch: ({ route }) => ({ id: route.params.event }),
      variables () {
        return { id: this.$route.params.event }
      },
      update: data => data.Event
    },
    allServices: {
      query: allServices,
      prefetch: true
    }
  }
}
</script>
<style lang='scss'>
  h4 {
    color: #fff;
  }
  .avatar {
    display: flex;
  }
  .selected {
    color: #fff;
    display: grid;
    grid-template-columns: 80% auto; 
  }
</style>

