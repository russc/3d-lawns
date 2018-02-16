<template>
  <div>
    <div class="drawer">
      <div>        
        <form id="newEvent">
          <div>
            <h5>Clients</h5>
            <fieldset v-for="client in allClients" v-bind:key="client.id">
              <input type="radio" :id="client.id" :value="client.id" v-model="clientSelected"/>
              <label :for="client.id">{{client.name}}</label>
            </fieldset>
            <!-- <span>{{clientSelected}}</span> -->
          </div>
          <div>
            <h5>Services</h5>
            <fieldset v-for="service in allServices" v-bind:key="service.id">
              <input type="checkbox" :id="service.id" :value="service.id" v-model="servicesSelected"/>
              <label :for="service.id">{{service.name}}</label>
            </fieldset>
          <!-- <span>{{servicesSelected}}</span> -->
          </div>     
          <div>
            <h5>Time</h5>
            <fieldset>
              <input id="time" type="time" step="60" value="09:00"/>
              <input type="button" v-on:click="newEvent()" value="save" />
              <a v-on:click="toggleDrawer()" class="add btn-floating btn-medium waves-effect waves-light red"><i class="material-icons">close</i></a>
            </fieldset>
          </div>
        </form>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col s11">
          <h5 class="left-align">{{date}}</h5>  
          <a v-on:click="toggleDrawer()" class="add btn-floating btn-medium waves-effect waves-light green accent-3"><i class="material-icons">add</i></a>
          <!-- <router-link class="add btn-floating btn-medium waves-effect waves-light green accent-3" :to="{ path: `${page}/new-event` }">  
            <i class="material-icons">add</i>
          </router-link> -->
        </div>
      </div>
      <div class="row">
        <!-- <div>events...{{events}}</div> -->
        <div class="gridContainer">
          <div class="titles">
            <p>Time</p>
            <p>Client</p>
            <p>Services</p>
            <p>Total</p>
          </div>
          <div v-for="event in allEvents" v-bind:key="event.id">
            <p>{{event.datetime | formatTime}}</p>
            <p>{{event.client.name}}</p>
            <p><span v-for="service in event.services" v-bind:key="service.id">
                    {{service.name}} {{service.price | formatMoney}},</span></p>
            <p>$......</p>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import moment from 'moment'
import Panel from '~/components/Panel'
import allServices from '~/apollo/allServices.graphql'
import allEvents from '~/apollo/allEvents.graphql'
import allClients from '~/apollo/allClients.graphql'
import createEvent from '~/apollo/createEvent.graphql'

export default {
  data () {
    return {
      page: this.$route.params.day,
      date: moment(this.$route.params.day).format('ddd, MMMM Do, YYYY'),
      edit: false,
      total: 0,
      clientSelected: '',
      servicesSelected: []
    }
  },
  apollo: {
    allEvents: {
      query: allEvents,
      variables () {
        return { date_contains: this.$route.params.day }
      },
      prefetch: ({ route }) => ({ date_contains: route.params.day })
      // update: data => data.allEvents
    },
    allClients: {
      query: allClients,
      prefetch: true
    },
    allServices: {
      query: allServices,
      prefetch: true
    }
  },
  head () {
    return {
      title: 'Day'
    }
  },
  components: {
    Panel
  },
  mounted () {
    // this.newEvent()
  },
  methods: {
    toggleDrawer () {
      document.querySelector('.drawer').classList.toggle('open')
    },
    newEvent () {
      let time = document.querySelector('#time').value
      let datetime = `${this.$route.params.day}${time}:00-0600`
      // 2018-02-1300:09:00-0600
      console.log(datetime)

      this.$apollo.mutate({
        mutation: createEvent,
        variables: {
          date: this.$route.params.day,
          datetime,
          servicesIds: this.servicesSelected,
          clientId: this.clientSelected
        },
        refetchQueries: ['allEvents']
      }).then(data => {
        this.toggleDrawer()
        // Result
        console.log(data)
        this.servicesSelected = []
        this.clientSelected = ''
      }).catch(error => {
        this.toggleDrawer()
        // Error
        console.error(error)
      })
    }
  },
  computed: {
    services () {
      let services = []
      if (this.allEvents !== null) {
        this.allEvents.map(event => {
          if (event.services !== null) {
            event.services.map(service => {
              services.push(service)
            })
          }
        })
      }

      return services
    },
    totals () {
      let totalsArray = []
      if (this.services !== null) {
        this.services.map(curr => {
          this.total += curr.price
          let index = totalsArray.findIndex(el => el.name === curr.name)
          if (index !== -1) {
            totalsArray[index].total += curr.price
          } else {
            totalsArray.push({name: curr.name, total: curr.price})
          }
        })
      }
      return totalsArray
    },
    clientTotal () {
      console.log('total!')
    }
  }
}
</script>

<style lang='scss'>
  h5 {
    color: #fff;
  }
  .add {
    margin-top: -7px;
    position: relative;
    right: 0;
  }
  .day-details {
    background: #26a69a;
    padding: 4px;
  }
  .client {
    background:#fff;
    display: flex;
    justify-content: space-between;
  }
  input[type=time]:not(.browser-default) {
    border-bottom: none;
    font-size: 3em;
    color: #fff;
  }
  
  .services {
    background: #175d75;
    color: #fff;
    .total {
      font-weight: bold;
    }
  }
  .drawer {
    background: rgba(0,0,0,.5);
    display: none;
    height: 100%;
    padding:90px 30px 0 30px;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 10;
    fieldset {
      border: none;
    }
  
    #newEvent {
      display: flex;
      flex-flow: row wrap;
      justify-content: space-between;
      [type="radio"]:not(:checked)+label:before, [type="checkbox"]:not(:checked)+label:before {
        border: 2px solid #fff;
      }
      
      // display: grid;
      // grid-template-columns: repeat(3, auto) 100px;

    }
    div {
      background: #175d75;
      padding: 20px;
      
    }
    label {
      color: #fff;
    }
  }
  .open {
    display: block;
  }
  .gridContainer {
    background: #175d75;
    color:#fff;
    display: grid;
      div {
        // background:#26a69a;
        display: grid;
        grid-template-columns: 100px 100px auto 100px;
        grid-gap: 10px;
        padding: 3px;
        // border-bottom: 1px solid mistyrose;
       
      }
      .titles {
        border-bottom: 1px dashed mistyrose;
        font-size: 18px;
        font-weight: bold;
      }
    grid-auto-rows: 5%;
    grid-gap: 10px;
    // @media (min-width: 768px) {
    //   grid-template-columns: auto;
    // }
    padding: 5px;
  }


</style>
