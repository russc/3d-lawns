<template>
  <div class="finances-container">
    <h2 class="center-align">Finances</h2>
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
        <tr v-for="finances in finances" v-bind:key="finances.id">
            <td v-if="edit === finances.id"><input type="text" v-model="editName"></td>
            <td v-else>{{finances.name}}</td>
            
            <td v-if="edit === finances.id"><input type="number" v-model="editPrice"></td>
            <td v-else>${{finances.price}}</td>

            <td v-if="edit === false">
              <i @click="editMode(finances.id, finances.name, finances.price)" class="material-icons tiny">edit</i>
            </td>
            <td v-else>
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
          <td colspan="2">
            <input type="number" placeholder="Price" v-model="price">
          </td>
        </tr>
        <tr>
          <td></td>
          <td>
            <a class="btn btn-submit" @click="newFinance()">Save</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import allFinances from '~/apollo/allFinances.graphql'
import createFinance from '~/apollo/createFinance.graphql'
import updateFinance from '~/apollo/updateFinance.graphql'

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
      editPrice: null
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
    newFinance () {
      this.$apollo.mutate({
        mutation: createFinance,
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
  .finances-container {
    padding: 0 2rem;
    color: #fff;
  }
  input {
    color: #fff;
  }
</style>
