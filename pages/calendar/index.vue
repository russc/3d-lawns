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
                  <li v-for="event in day.current.slice(0, 3)" v-bind:key="event.id">
                    <small class="event-details">
                      <div>
                        <span>{{event.datetime | formatTime}} {{event.client.name}}</span>
                      </div>
                    </small>
                  </li>
                  <li class="center-align" v-if="day.current.length > 3">
                    <small class="event-more">
                      {{day.current.length}} more ...
                    </small>
                  </li>
                </ul>
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
      <div v-for="item in offSet" v-bind:key="'mobileOffset'+item"></div>
      <div v-for="index in numDays" v-bind:key="'mobileDay'+index" class="mobile-day" @click="reformat(index, true)">
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
        <a class="waves-effect waves-teal btn" @click="$store.commit('now')">Now</a>  
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
      eventsInMonth: [],
      events: []
    }
  },
  components: {
    Panel
  },
  apollo: {
    events: {
      query: allEvents,
      prefetch: true,
      update: data => data.allEvents
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
      var current = this.events !== null ? this.events.filter(event => moment(event.datetime).isSame(this.month, 'month')) : null
      if (current !== null) {
        return current.map(event => event.datetime.slice(0, 10))
      }
    },
    weeksInMonth () {
      var start = moment(new Date(`${this.$store.state.year}-${this.$store.state.month + 1}-01`))
      var end = this.month.endOf('month')
      var data = []
      var day = start
      var index = 0

      while (day <= end && this.events !== null) {
        var current = this.events.filter(event => moment(event.datetime).isSame(day, 'day'))

        if (data[index] === undefined) {
          data[index] = Array(7)
        }
        var classes = day.day() === 6 || day.day() === 0 ? ['day', 'weekend'] : ['day', 'weekday']

        data[index][day.day()] = {
          classes,
          date: day,
          current,
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
      var yearMonth = this.month.format('YYYY-MM')
      var format = day.toString().length > 1 ? `${yearMonth}-${day}` : `${yearMonth}-0${day}`
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
    @media (min-width: 480px) {
      display: none;
    }
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
    .mobile-day:hover {
      color: orangered;
      cursor: pointer;
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
        font-size: 2rem;
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
      @media (min-width: 480px) {
        display: none;
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
  .event-details span {
    display: block;
    justify-content: space-between;
    color: #006380;
    overflow: hidden;
    white-space: nowrap;  
    text-overflow: ellipsis;
    width: 100%;
  }

  .event-more {
    color: navy;
    text-align: right;
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
    margin: 2px;
    overflow: hidden;
    font-size: 16px;
    font-weight: 700;
    width: calc(100% / 7);
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
