<template>
  <div class="finances-container">
    <h2 class="center-align">Expenses</h2>
    <table class="responsive">
      <thead>
        <tr>
          <td>Name</td>
          <td>Amount</td>
          <td>Edit</td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="finances in finances" v-bind:key="finances.id" v-if="finances.type === 'expense'">
            <td v-if="edit === finances.id"><input type="text" v-model="editName"></td>
            <td v-else>{{finances.name}}</td>
            
            <td v-if="edit === finances.id"><input type="number" v-model="editPrice"></td>
            <td v-else>${{finances.price}}</td>

            <td v-if="edit === false">
              <i @click="editMode(finances.id, finances.name, finances.price)" class="material-icons tiny">edit</i>
            </td>
            <td v-else class="align-right">
              <i @click="editFinance(finances.id)" class="material-icons tiny">save</i>
              
            </td>
            <td>
              <i v-if="edit === finances.id" @click="edit = false" class="material-icons tiny">close</i>
              <i v-else @click="deleteFinance(finances.id)" class="material-icons tiny">delete</i>
            </td>
        </tr>
        <tr>
          <td>
            <input type="text" placeholder="Name" v-model="name">
          </td>
          <td>
            <input type="number" placeholder="Price" v-model="price">
          </td>
          <td colspan="2">
            <a class="btn btn-submit" @click="newFinance()">Save</a>
          </td>
        </tr>
      </tbody>
    </table>
    <h2 class="center-align">Profits</h2>
    <table class="responsive profits">
      <thead>
        <tr>
          <td>Name</td>
          <td>Amount</td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="finances in finances" v-bind:key="finances.id" v-if="finances.type === 'profit'">
            <td>
              {{finances.name}}
              <router-link :to="{path: `event/${finances.eventId}`}"> 
                <i class="material-icons">event_note</i>
              </router-link>
            </td>
            
            <td>${{finances.price}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import allFinances from '~/apollo/allFinances.graphql'
import createFinance from '~/apollo/createFinance.graphql'
import updateFinance from '~/apollo/updateFinance.graphql'
import deleteFinance from '~/apollo/deleteFinance.graphql'

export default {
  head: {
    title: 'Finances'
  },
  data () {
    return {
      finances: [],
      name: '',
      price: null,
      edit: false,
      editName: null,
      editPrice: null,
      editDate: null
    }
  },
  apollo: {
    finances: {
      query: allFinances,
      prefetch: true,
      update: data => data.allFinances
    }
  },
  methods: {
    editMode (id, name, price) {
      this.edit = id
      this.editName = name
      this.editPrice = price
    },
    editFinance (id) {
      this.$apollo.mutate({
        mutation: updateFinance,
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
     deleteFinance (id, name) {
      let yes = confirm(`Are you sure you want to delete ${name}?`)
      if (yes === true) {
        this.$apollo.mutate({
          mutation: deleteFinance,
          variables: {
            id,
          }
        }).then(() => {
          location.reload()
        })
      }
    },
    newFinance () {
      this.$apollo.mutate({
        mutation: createFinance,
        variables: {
          name: this.name,
          price: parseInt(this.price),
          type: 'expense',
        }
      }).then(data => {
        location.reload()
      })
    }
  }

}
</script>

<style lang="scss">
  .finances-container {
    padding: 0 2rem;
    color: #fff;
  }
  input {
    color: #fff;
  }
  .profits {
    margin-bottom: 50px;
  }
  a {
    color: #fff;
  }
  a:hover {
    color: cyan;
  }
</style>
