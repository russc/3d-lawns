<template>
<div class="container">
  <a v-if="!add" v-on:click="addForm()" class="add btn-floating btn-medium waves-effect waves-light green accent-3">
    <i class="material-icons">add</i>
  </a>
  <a v-else v-on:click="addForm()" class="add btn-floating btn-medium waves-effect waves-light red accent-3">
    <i class="material-icons">close</i>
  </a>
  <div v-if="add" class="row">
    <div class="col offset-s1 s10">
        <div class="card">
          <div class="card-content center-align">
            <i class="material-icons large">face</i>
            <h5 class="center-align">
              <input type="text" placeholder="Name" v-model="name"/>
            </h5>
            <p><input type="email" placeholder="Email" v-model="email"/></p>
            <p><input type="text" placeholder="Phone" v-model="phone"/></p>
            <p><input type="text" placeholder="Address" v-model="address"/></p>
            <p class="flex-row">
              <input type="button" v-on:click="newClient()" value="Save" />     
            </p>
          </div>
      </div>
    </div>
  </div>
  <div v-else class="row">
    <div class="col offset-s1 s10" v-for="client in clients" v-bind:key="client.id">
        <div class="card">
          <div class="card-content center-align">
            <div v-if="edit === client.id">
              <input type="text" v-model="editName" placeholder="name"/>
              <input type="text" v-model="editPhone" placeholder="phone"/>
              <input type="email" v-model="editEmail" placeholder="email"/>
              <input type="text" v-model="editAddress" placeholder="address"/>
              <p class="flex-row">
                <a class="btn btn-small" @click="editClient()">Save</a>
                <a class="btn btn-small red" @click="edit = false">cancel</a>
              </p>
            </div>
            <div v-else>
              <i class="material-icons medium">face</i>  
              <h4 class="center-align">{{client.name}}</h4>
              <p>{{client.phone}}</p>
              <p>{{client.email}}</p>
              <p>{{client.address}}</p>
              <p class="flex-row">
                <a class="btn btn-small" @click="editMode(client.id, client.name, client.address, client.email, client.phone)">Edit</a>
                <router-link :to="{path: `clients/${client.id}`}" class="btn orange">
                  Client Jobs
                </router-link>
              </p>
            </div>
          </div>
      </div>
    </div>
  </div>

</div>
</template>

<script>
import allClients from '~/apollo/allClients.graphql'
import createClient from '~/apollo/createClient.graphql'
import updateClient from '~/apollo/updateClient.graphql'

export default {
  head: {
    title: 'Clients'
  },
  data () {
    return {
      clients: [],
      add: false,
      name: null,
      email: null,
      phone: null,
      address: null,
      edit: false,
      editEmail: null,
      editName: null,
      editAddress: null,
      editPhone: null

    }
  },
  apollo: {
    clients: {
      query: allClients,
      prefetch: true,
      update: data => data.allClients
    }
  },
  methods: {
    addForm () {
      this.add = !this.add
    },
    newClient () {
      this.$apollo.mutate({
        mutation: createClient,
        variables: {
          name: this.name,
          email: this.email,
          phone: this.phone,
          address: this.address
        }
      }).then(() => {
        this.add = false
        this.name = null
        this.email = null
        this.phone = null
        this.address = null
        location.reload()
      })
    },
    editMode (id, name, address, email, phone) {
      this.edit = id
      this.editName = name
      this.editAddress = address
      this.editEmail = email
      this.editPhone = phone
    },
    editClient () {
      this.$apollo.mutate({
        mutation: updateClient,
        variables: {
          id: this.edit,
          name: this.editName,
          email: this.editEmail,
          address: this.editAddress,
          phone: this.editPhone
        }
      }).then(() => {
        this.edit = false
        this.editName = null
        this.editEmail = null
        this.editAddress = null
        this.editPhone = null
      })
    }
  }
}
</script>

<style lang="scss">
  input {
    color: #333;
  }
  .flex-row {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-around;
  }
</style>
