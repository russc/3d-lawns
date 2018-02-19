<template>
<div>
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
          <div class="day left-align">Sun</div>
          <div class="day left-align">Mon</div>
          <div class="day left-align">Tue</div>
          <div class="day left-align">Wed</div>
          <div class="day left-align">Thu</div>
          <div class="day left-align">Fri</div>
          <div class="day left-align">Sat</div>
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
              <!-- </router-link> -->
                  
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
  <div class="mobile-frame">
    <div class="mobile-calendar">
      <div>Sun</div>
      <div>Mon</div>
      <div>Tue</div>
      <div>Wed</div>
      <div>Thu</div>
      <div>Fri</div>
      <div>Sat</div>
      <div v-for="item in offSet" :key="'mobileOffset'+item"></div>
      <div v-for="index in numDays" :key="'mobileDay'+index" @click="reformat(index, true)">
        {{index}}
        <p v-if="hasEvents(index)">
          <i class="material-icons xsmall">face</i>
        </p>
      </div>
    </div>
    <!-- <div class="mobile-events">
      <p v-for="event in allEvents" :key="'mobile'+event.id">
        {{event.client.name}}
      </p>
    </div> -->
    <div class="mobile toolbar">
      <a class="waves-effect waves-teal btn center-align" @click="$store.commit('prevMonth')"><i class="material-icons large">arrow_back</i></a>
      <div class="month-title">
        <h2>{{month.format('MMMM YYYY')}}</h2>  
      </div> 
      <a class="waves-effect waves-teal btn" @click="$store.commit('nextMonth')"><i class="material-icons large">arrow_forward</i></a>
    </div>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import allEvents from '~/apollo/allEvents.graphql'
import Panel from '~/components/Panel.vue'

export default {
  data () {
    return {
      eventsInMonth: []
    }
  },
  components: {
    Panel
  },
  apollo: {
    allEvents: {
      query: allEvents,
      prefetch: true
    }
  },
  head () {
    return {
      title: 'Calendar'
    }
  },
  computed: {
    month () {
      return moment(new Date()).year(this.$store.state.year).month(this.$store.state.month)
    },
    numDays () {
      return this.month.daysInMonth()
    },
    offSet () {
      return moment(new Date(`${this.$store.state.year}-${this.$store.state.month + 1}-01`)).day()
    },
    currentEvents () {
      let events = this.allEvents !== null ? this.allEvents.filter(event => moment(event.datetime).isSame(this.month, 'month')) : ''
      return events.map(event => event.datetime.slice(0, 10))
    },

    weeksInMonth () {
      let start = moment(new Date(`${this.$store.state.year}-${this.$store.state.month + 1}-01`))
      let end = this.month.endOf('month')
      let data = []
      let day = start
      let index = 0

      while (day <= end && this.allEvents !== null) {
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
    reformat (day, redirect) {
      let yearMonth = this.month.format('YYYY-MM')
      let format = day.toString().length > 1 ? `${yearMonth}-${day}` : `${yearMonth}-0${day}`
      if (redirect) {
        this.$router.push('calendar/' + format)
      } else {
        return format
      }
    },
    hasEvents (date) {
      return this.currentEvents.includes(this.reformat(date))
    }
  }
}
</script>

<style lang="scss">
  *, *:before, *:after {
    box-sizing: inherit;
  }
  
  .mobile-calendar {
    padding: 1rem;
    display: grid;
    grid-template-columns: repeat(7, auto);
    grid-template-rows: repeat(7, 5rem);
    justify-content: space-between;
    div {
      // background:mistyrose;
      text-align: center;
      vertical-align: top;
      color: #fff;
      p {
        color: #0ad97c;
        position: relative;
        // right: 4px;
      }
    }
  }
  .calendar {
    width: 98%;
    margin: 0 1%;
    display: flex;
    @media (max-width: 768px) {
      width: 100%;
      margin: 0;
    }
    @media (max-width: 480px) {
      display: none;
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
    &.mobile {
      bottom: 0;
      position: fixed;
      width: 100%;
      .month-title {
        margin-top: 20px;
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
    background: lightblue;
    color: #333;
    opacity: .9;
    .tools {
      display: inline;
      right:0;
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
