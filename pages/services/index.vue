<template>
  <div class="services-container">
    <h2 class="center-align">Services</h2>
    <table class="responsive">
      <thead>
        <tr>
          <td>Name</td>
          <td>Price</td>
          <td>Edit</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="service in services" v-bind:key="service.id">
            <td v-if="edit === service.id"><input type="text" v-model="editName"></td>
            <td v-else>{{service.name}}</td>
            
            <td v-if="edit === service.id"><input type="number" v-model="editPrice"></td>
            <td v-else>${{service.price}}</td>

            <td v-if="edit === false">
              <i @click="editMode(service.id, service.name, service.price)" class="material-icons tiny">edit</i>
            </td>
            <td v-else>
              <i @click="editService(service.id)" class="material-icons tiny">save</i>
              
            </td>
            <td>
              <i v-if="edit === service.id" @click="edit = false" class="material-icons tiny">close</i>
              <i v-else @click="deleteService(service.id, service.name)" class="material-icons tiny">delete</i>
            </td>
        </tr>
        <tr>
          <td>
            <input type="text" placeholder="Name" v-model="name">
          </td>
          <td colspan="2">
            <input type="number" placeholder="Price" v-model="price">
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <a class="btn btn-submit" @click="newService()">Save</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import allServices from '~/apollo/allServices.graphql'
import createService from '~/apollo/createService.graphql'
import updateService from '~/apollo/updateService.graphql'
import deleteService from '~/apollo/deleteService.graphql'

export default {
  head: {
    title: 'Services'
  },
  data () {
    return {
      services: [],
      name: '',
      price: null,
      edit: false,
      editName: null,
      editPrice: null
    }
  },
  apollo: {
    services: {
      query: allServices,
      prefetch: true,
      update: data => data.allServices,
    }
  },
  methods: {
    editMode (id, name, price) {
      this.edit = id
      this.editName = name
      this.editPrice = price
    },
    editService (id) {
      this.$apollo.mutate({
        mutation: updateService,
        variables: {
          id,
          name: this.editName,
          price: parseInt(this.editPrice)
        }
      }).then(() => {
        this.edit = false
        this.editName = null
        this.editPrice = null
      })
    },
    deleteService (id, name) {
      let yes = confirm(`Are you sure you want to delete ${name}?`)
      if (yes === true) {
        this.$apollo.mutate({
          mutation: deleteService,
          variables: {
            id,
          }
        }).then(() => {
          location.reload()
        })
      }
    },
    newService () {
      this.$apollo.mutate({
        mutation: createService,
        variables: {
          name: this.name,
          price: parseInt(this.price)
        }
      }).then(data => {
        location.reload()
      })
    }
  }

}
</script>

<style lang="scss">
  .services-container {
    padding: 0 2rem;
    color: #fff;
  }
  input {
    color: #fff;
  }
</style>
