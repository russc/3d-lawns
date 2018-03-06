<template>
  <div>
    <div v-if="event && loading == 0">
      <div class="row">
        <div class="col offset-s1 s10">
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
        <div v-if="!edit" class="col offset-s1 s10">
          <h4><i @click="editServices()" class="material-icons right small left">edit</i>Services</h4>
          <div class="selected" v-for="service in event.services" :key="service.id">
            <h5>{{service.name}}</h5>
            <h5>${{service.price}}</h5>
          </div>
        </div>
        <div v-else class="col offset-s1 s10">
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
    <div v-else>
      loading..
    </div>
  </div>
  
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
      servicesSelected: [],
      event: null,
      loading: 0
    }
  },
  apollo: {
    event: {
      query: Event,
      prefetch: ({ route }) => ({ id: route.params.event }),
      variables () {
        return { id: this.$route.params.event }
      },
      loadingKey: 'loading',
      update: data => data.Event
    },
    allServices: {
      query: allServices,
      prefetch: true
    }
  },
  methods: {
    editServices () {
      this.edit = true
      this.event.services.map(service => this.servicesSelected.push(service.id))
      console.log(this.servicesSelected)
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
  fieldset {
    border: none;
  }
</style>

