<template>
  <div>  
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
        <div v-for="index in numDays" v-bind:key="'mobileDay'+index" class="mobile-day">
          <router-link :to="{path: `${month}/${reformat(index)}`}">
            {{index}}
            <p v-if="hasEvents(index).length > 0" class="smile">
              <i class="material-icons xsmall">face</i>
            </p>
            <section class="events-list">
              <ul>
                <li v-for="event in hasEvents(index).slice(0, 3)" v-bind:key="event.id">
                  <small class="event-details">
                    <!-- <div> -->
                      <span>{{event.datetime | formatTime}} {{event.client.name}}</span>
                    <!-- </div> -->
                  </small>
                </li>
                <li class="center-align" v-if="hasEvents(index).length > 3">
                  <small class="event-more">
                    {{hasEvents(index).length}} more ...
                  </small>
                </li>
              </ul>
            </section>
          </router-link>
        </div>
      </div>
      <!-- <div class="mobile-events">
        <p v-for="event in allEvents" :key="'mobile'+event.id">
          {{event.client.name}}
        </p>
      </div> -->
      <div class="mobile toolbar">
        <a class="waves-effect waves-teal btn center-align" @click="monthChange(-1)"><i class="material-icons large">arrow_back</i></a>

        <div class="month-title">
          <h2>{{currentMonth}}</h2>  
          <a class="waves-effect waves-teal btn" @click="now()">Now</a>  
        </div> 
        <a class="waves-effect waves-teal btn" @click="monthChange(1)"><i class="material-icons large">arrow_forward</i></a>
      </div>
    </div>
  </div>
</template>

<script>
import { format } from 'date-fns'
import allEvents from '~/apollo/allEvents.graphql'
// import Panel from '~/components/Panel.vue'

export default {
  data () {
    return {
      eventsInMonth: [],
      events: [],
      month: this.$route.params.month,
      selected: new Date(this.$route.params.year, this.$route.params.month - 1, 1),
      daysInMonth: new Date(this.$route.params.year, this.$route.params.month, 0).getDate(),
      lastDay: new Date(this.$route.params.year, this.$route.params.month, 0)
    }
  },
  // components: {
  //   Panel
  // },
  apollo: {
    events: {
      query: allEvents,
      variables () {
        return { datetime_gte: this.selected, datetime_lte: this.lastDay }
      },
      prefetch: ({ route }) => ({ date_contains: this.date }),
      update: data => data.allEvents
    },
  },
  head () {
    return {
      title: 'Calendar'
    }
  },
  computed: {
    currentMonth () {
      return format(this.selectedYearMonth, 'MMM')
    },
    selectedYearMonth () {
      return new Date(this.$route.params.year, this.$route.params.month - 1, 1)
    },
    numDays () {
      return new Date(this.$route.params.year, this.$route.params.month, 0).getDate()
    },
    offSet () {
      return 4 // moment(new Date(`${this.$route.params.year}-${this.$route.params.month}-01`)).day()
    },
    daysWithClients () {
      console.log('events', this.events)
      let clientDays = this.events.map(event => event.date)
      console.log(clientDays)
      return clientDays
    },
  },
  methods: {
    reformat (num) {
      return num < 10 ? `0${num}` : num
    },
    hasEvents (day) {
      let formated = day < 10 ? `0${day}` : day
      let date = `${this.$route.params.year}-${this.$route.params.month}-${formated}`
      let filter = this.events.filter(event => event.date === date)
      // return this.daysWithClients.includes(date)
      return filter
    },
    now () {
      this.$router.push(`/calendar/${this.$store.state.year}/${this.$store.state.month}`)
    }, 
    monthChange (num) {
      let next,
      current = parseInt(this.$route.params.month),
      newYear,
      year = parseInt(this.$route.params.year)
      next = current + num

      switch (next) {
        case 0: 
          next = 12
          newYear = true
          break
        case 13:
          next = 1
          newYear = true
          break
        default: 
          newYear = false
          break
      }
      if (newYear) {
        this.$router.push(next < 10 ? `/calendar/${year + num}/0${next}` : `/calendar/${year + num}/${next}`)
      } else {
        console.log(next)
        let route = 
        this.$router.push(next < 10 ? `0${next}` : next.toString())
      }
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
      // display: none;
      margin: 0 150px;
      grid-template-rows: repeat(7, 7rem);
      .smile {
        display: none;
      }
    }
    @media (max-width: 479px) {
      .events-list {
        display: none;
      }
    }
    color: #fff;
    padding: 1rem;
    display: grid;
    flex-wrap: wrap;
    grid-template-columns: repeat(7, auto);
    grid-template-rows: repeat(7, 5rem);
    justify-content: space-between;
    div {
      // background:mistyrose;
      // width: calc(100%/7);
      text-align: center;
      .events-list {
        text-align: left;
      }
      vertical-align: top;
      a {
        color: #fff;
      }
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
    display: grid;
    flex-wrap: wrap;
    grid-template-columns: repeat(7, auto);
    grid-template-rows: repeat(7, 5rem);
    width: 98%;
    margin: 0 1%;
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
    color: lime;
    overflow: hidden;
    white-space: nowrap;  
    text-overflow: ellipsis;
    width: 100%;
  }

  .event-more {
    color: orange;
    text-align: right;
  }
  
  .date {
    display: flex;
    width: calc(100/7);
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
