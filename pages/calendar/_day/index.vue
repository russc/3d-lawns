<template>
  <div class="container">
    <div class="row">
      <h4 class="center-align">{{date}}</h4>  
    </div>
    <div class="row day-details">
      <div class="col s8">
        <div class="row" v-for="event in allEvents" v-bind:key="event.id">
          <div class="col s2 weekday">
            <p>{{event.datetime | formatTime}}</p>
          </div>
          <div class="col s10 client">
            <p>{{event.client.name}}</p>
            
            <p v-for="service in event.services" v-bind:key="service.id">
                {{service.name}} {{service.price | formatMoney}}
            </p>
          </div>
        </div>
      </div>
      <div class="col s4 services">
        <table class="responsive" title="Totals">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in totals" v-bind:key="item.id">
              <td>{{item.name}}</td>
              <td>{{item.total | formatMoney}}</td>
            </tr>
            <tr class="total">
              <td>TOTAL:</td>
              <td>{{total | formatMoney}}</td>
            </tr>
          </tbody>
        </table> 
      </div>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'
import moment from 'moment'
import VueTimepicker from 'vue2-timepicker'
import Panel from '~/components/Panel'
import allEvents from '~/apollo/allEvents.graphql'

export default {
  data () {
    return {
      date: moment(this.$route.params.day).format('ddd, MMMM Do, YYYY'),
      edit: false,
      total: 0
    }
  },
  apollo: {
    allEvents: {
      query: allEvents,
      variables () {
        return { date_contains: this.$route.params.day }
      },
      prefetch: true
    }
  },
  components: {
    Panel,
    VueTimepicker
  },
  mounted: () => {
    console.log($)
  },
  computed: {
    allServices () {
      let services = []
      this.allEvents.map(event => {
        event.services.map(service => {
          services.push(service)
        })
      })
      return services
    },
    totals () {
      let totalsArray = []
      this.allServices.map(curr => {
        this.total += curr.price
        let index = totalsArray.findIndex(el => el.name === curr.name)
        if (index !== -1) {
          totalsArray[index].total += curr.price
        } else {
          totalsArray.push({name: curr.name, total: curr.price})
        }
      })
      return totalsArray
    }
  }
}
</script>

<style lang='scss'>
  .day-details {
    background: #26a69a;
    padding: 4px;
  }
  .client {
    background:#fff;
    display: flex;
    justify-content: space-between;
  }
  .services {
    background: #175d75;
    color: #fff;
    .total {
      font-weight: bold;
    }
  }

  .time-picker {
    background: #fff;
    .display-time {
      border: none !important;
    }
    .dropdown {
      display: block !important;
    }
  }
</style>
