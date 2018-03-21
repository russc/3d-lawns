<template>
  <div>
    <div v-if="event && loading == 0">
      <div class="row">
        <div class="col offset-s1 s10">
          <div class="card">
            <div class="card-content center-align">
                <h3>{{eventDateTime(event.datetime)}}</h3>
              <span class="card-title grey-text text-darken-4">{{event.client.name}}</span>
              <a v-bind:href="`https://www.google.com/maps/search/?api=1&query=${event.client.address}})`">{{event.client.address}}</a>
              <div class="progress">
                  <div class="light-blue accent-3" v-bind:class="[event.status, progressStatus]"></div>
              </div>
              <div v-if="!paused" class="steps">
                <div>
                  <p>1</p>
                  <h5>scheduled</h5>
                </div>
                <div>
                  <p>2</p>
                  <h5>started</h5>
                </div>
                <div>
                  <p>3</p>
                  <h5>completed</h5>
                </div>
                <div>
                  <p>4</p>
                  <h5>paid</h5>
                </div>
              </div>
              <div v-else class="paused">
                <p>&nbsp;</p>
                <h5>job paused</h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- <div class="row" v-if="status === 'notStarted'"> -->
      <div class="flex-row" v-if="event.status === 'scheduled'">
        <a @click="changeStatus('started')" class="btn green accent-3"><i class="material-icons right tiny align-right">play_circle_outline</i>Start Job</a>
      </div>
      <div class="flex-row" v-if="event.status === 'started'">
        <a v-if="paused" class="btn cyan accent-3" @click="paused = !paused"><i class="material-icons right tiny align-right">play_circle_outline</i>Resume Job</a>
        <a v-else class="btn light-blue accent-3" @click="paused = !paused"><i class="material-icons right tiny align-right">pause_circle_outline</i>Pause Job</a>
        <a class="btn red accent-3" @click="changeStatus('completed')"><i class="material-icons right tiny align-right">stop</i>Job Done</a>
      </div>
      <div class="flex-row" v-if="event.status === 'completed'">
        <a class="btn green accent-2" @click="changeStatus('paid', total)"><i class="material-icons right tiny align-left">attach_money</i>Payment Complete</a>
      </div>
      <div class="row">
        <div v-if="!edit" class="col offset-s1 s10">
          <h4 v-if="event.status !=='paid'"><i @click="editServices()" class="material-icons right small left">edit</i>Services</h4>
          <h4 v-else>Services</h4>
          <div class="selected" v-for="service in event.services" :key="service.id">
            <h5>{{service.name}}</h5>
            <h5>${{service.price}}</h5>
          </div>
          <div class="selected">
            <h5>Total:</h5>
            <h5>${{total}}</h5>
          </div> 
          <!-- <h4>Notes</h4>
          <textarea></textarea>
          <div class="flex-row">
            <a class="btn red accent-3"><i class="material-icons right tiny">delete</i>Delete Event</a>
          </div> -->

        </div>
        <div v-else class="col offset-s1 s10">
          <h4><i @click="edit = false" class="material-icons right small left">close</i><i @click="updateServices()" class="material-icons right small left">save</i>Edit Services</h4>

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
      <div class="preloader-wrapper big active">
    <div class="spinner-layer spinner-blue-only">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div><div class="gap-patch">
          <div class="circle"></div>
        </div><div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
    </div>
  </div>
  
</template>

<script>
import { format } from 'date-fns'
// import SignaturePad from 'signature_pad'
import Event from '~/apollo/Event.graphql'
import updateEvent from '~/apollo/updateEvent.graphql'
import allServices from '~/apollo/allServices.graphql'
import createFinance from '~/apollo/createFinance.graphql'

export default {
  head () {
    return {
      title: 'Event'
    }
  },
  data () {
    return {
      page: this.$route.params.id,
      // day: this.$route.params.day,
      date: '....',
      edit: false,
      servicesSelected: [],
      event: null,
      loading: 0,
      paused: false
    }
  },
  // mounted () {
  //   let canvas = document.querySelector('#signature-pad')
  //   let signaturePad = new SignaturePad(canvas)
  // },
  computed: { 
    total () {
      return this.event.services.map(item => parseInt(item.price)).reduce((acc, cur) => acc + cur)
    },
    progressStatus () {
      return this.paused === false ? 'determinate' : 'indeterminate'
    }
  },
  apollo: {
    event: {
      query: Event,
      prefetch: ({ route }) => ({ id: route.params.id }),
      variables () {
        return { id: this.$route.params.id }
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
    eventDateTime (dt) {
      return format(dt, 'MMM Do - h:mm A')
    },
    editServices () {
      this.edit = true
      this.event.services.map(service => this.servicesSelected.push(service.id))
    },
    changeStatus (status, amt) {
      let payment = amt !== undefined ? amt : ''
      console.log(this.startTimes)
      this.$apollo.mutate({
        mutation: updateEvent,
        variables: {
          id: this.$route.params.id,
          status: status
        },
        refetchQueries: ['Event']
      }).then(data => {
        if (status === 'paid') {
          this.$apollo.mutate({
            mutation: createFinance,
            variables: {
              name: `${this.event.client.name}`,
              eventId: this.$route.params.id,
              price: payment
            }
          }).then(finance => console.log('finance', finance))
        }
        console.log(data);
      })
    },
    updateServices () {
      this.edit = !this.edit
      this.$apollo.mutate({
        mutation: updateEvent,
        variables: {
          id: this.$route.params.id,
          servicesIds: this.servicesSelected,
          type:'profit'
        },
        refetchQueries: ['Event']
      })
    },

  }
}
</script>
<style lang='scss'>

  h3 {
    color: cornflowerblue;
    font-size: 2rem;
  }
  p, .selected, .status-options, label {
    color: #fff;
  }

  .flex-row {
    display: flex;
    flex-flow: center;
    flex-wrap: nowrap;
    justify-content: space-around;
  }
  .steps {
    display: grid;
    grid-template-columns: repeat(4, 25%);
    justify-content: center;
    h5 {
      font-size: .7rem;
      @media (min-width: 900px) {
        font-size: 1.4rem;
      }
      color: cornflowerblue;
    }
  }
  .paused, .steps {
    text-transform: uppercase;
  }
  .scheduled {
    width: 25%;
  }
  .started {
    width: 50%;
  }
  .completed {
    width: 75%;
  }
  .paid {
    width: 100%;
  }
  .avatar {
    display: flex;
  }
  .selected {
    display: grid;
    grid-template-columns: 80% auto; 
  }
  .in-progress {
    width: 50%;
  }
  .status-options {
    display: grid;
    grid-template-columns: repeat(3, 33%);
  }
  // .signature-pad {
  //   background: #fff;
  //   width: 100%;
  // }
  fieldset {
    border: none;
  }
  textarea {
    width: 100%;
    height: 5rem;
    background-color: #f1eded;
    border: none;
    padding: 1rem;
    color: #000;
    line-height: 1.5;
    margin-bottom: 40px;
  }
</style>

