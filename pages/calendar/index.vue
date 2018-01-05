<template>
  <div class="calendar">
    <div class="container">
      <div class="toolbar">
        <a class="waves-effect waves-teal btn center-align" @click="$store.commit('prevMonth')"><i class="material-icons large">arrow_back</i></a>
        <div class="month-title">
          <h2>{{month.format('MMMM YYYY')}}</h2>  
        </div> 
        <a class="waves-effect waves-teal btn" @click="$store.commit('nextMonth')"><i class="material-icons large">arrow_forward</i></a>
      </div>
      <div class="month">
        <div class="week header">
          <div class="day center-align">Sun</div>
          <div class="day center-align">Mon</div>
          <div class="day center-align">Tue</div>
          <div class="day center-align">Wed</div>
          <div class="day center-align">Thu</div>
          <div class="day center-align">Fri</div>
          <div class="day center-align">Sat</div>
        </div>
        <div class="week"
          v-for="week in weeksInMonth" 
          v-bind:key="week.id">
            <div class="left-align"
              v-for="day in week"
              v-bind:key="day.id" 
              v-if="day"
              v-bind:class="[day.classes]"> 
                <div class="date">
                  {{day.date.format('D')}}
                  <router-link class="link" :to="{ path: `calendar/${day.date.format('YYYY-MM-DD')}` }">  
                    <i class="tools material-icons">list</i>
                  </router-link>
                </div>
                <ul>
                  <li v-for="event in day.events" v-bind:key="event.id">
                    <small class="event-details">
                      <div>
                        <!-- <img src="./images/image-3.png" alt="Contact Person"> -->
                        <span>{{event.datetime | formatTime}} </span>
                        <span class="client-name">{{event.client.name}}</span>
                      </div>
                    </small>
                  </li>
                </ul>
              </router-link>
                  
            </div>
            <div class="day outter-month left-align" v-else></div>
        </div>
      </div>
      <div class="last-row">
       <a class="waves-effect waves-teal btn" @click="$store.commit('now')">Now</a>  
      </div>
    </div>
    <!-- <div class="panel-container">
      <panel></panel>
    </div> -->
  </div>
</template>

<script>
import moment from 'moment'
import allEvents from '~/apollo/allEvents.graphql'
import Panel from '~/components/Panel.vue'

export default {
  components: {
    Panel
  },
  apollo: {
    allEvents: {
      query: allEvents,
      prefetch: true
    }
  },
  computed: {
    month () {
      return moment().year(this.$store.state.year).month(this.$store.state.month)
    },
    weeksInMonth () {
      let start = moment(`${this.$store.state.year}-${this.$store.state.month + 1}-01`)
      let end = this.month.endOf('month')
      let data = []
      let day = start
      let index = 0

      console.log('All Events', this.allEvents)

      while (day <= end) {
        let events = this.allEvents.filter(event => moment(event.datetime).isSame(day, 'day'))

        if (data[index] === undefined) {
          data[index] = Array(7)
        }
        let classes = day.day() === 6 || day.day() === 0 ? ['day', 'weekend'] : ['day', 'weekday']

        data[index][day.day()] = {
          classes,
          date: day,
          events,
          week: day.week()
        }

        if (day.day() === 6) {
          index++
        }

        day = day.clone().add(1, 'd')
      }
      return data
    }
  },
  methods: {

  }
}
</script>

<style lang="scss">
  *, *:before, *:after {
    box-sizing: inherit;
  }
  .calendar {
    width: 98%;
    margin: 0 1%;
    display: flex;
    @media (max-width: 768px) {
      width: 100%;
      margin: 0;
    }
    
  }
  .toolbar{
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    margin-top: 5px;
    .month-title {
      width: 340px;
      text-align: center;
       h2{
        color: mistyrose;
        font-size: 2em;
        margin-top: 0;
        padding: 0;
      }
    }
    .btn {
      background-color: lightslategray;
    }
  }
  .container {
    // margin: 0 5%;
    flex: 1;
  }
  a.waves-effect {
    color: #fff !important;
    &:hover {
      cursor: pointer;
    }
  }
  .event-details {
    display: flex;
    justify-content: space-between;
    color: #006380;
    .client-nae {
      color: rgba(0,0,0,.4);
      white-space: nowrap;
      @media (max-width: 768px) {
        display: none;
      }
    }
  }
  
  .date {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .tools {
      display: none;
      // font-size: 20px;
    }
    &:hover {
      background: lightblue;
      color: #333;
      opacity: .9;
      .tools {
        display: inline;
        right:0;
      }
    }

  }
  .last-row {
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
  }
  .month {
    padding: 2px;
    background: #26a69a;
    margin-bottom: 20px;
    
  }
  .week {
    display: flex;
    flex-wrap: nowrap;
    height: 7rem;
  }
  .header {
    height: 2rem;
    font-weight:bolder;
    color: #fff;
  }
  .day {
    width: calc(100% / 7);
    margin: 2px;
    font-size: 16px;
    font-weight: 700;
  }
  .today {
    background-color: cyan;
  }
  .weekday {
    background-color: mistyrose;
  }
  .weekend {
    background-color: #ddd;
  }
  .outter-month {
    background-color: rgba(0,0,0,.4);
  }
</style>
