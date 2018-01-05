<template>
  <div class="container">
    <div class="panel">
      <div class="panel__title">Clients</div>
        <div v-for="code in allClients" :key="code.id" class="panel__item" >
          <h6>
            <input name="group1" type="radio" v-bind:id="code.id" />
            <label v-bind:for="code.id">{{ code.name }}</label>
          </h6>
          <!-- <small> {{ code.datetime | formatDate }}</small> -->
      </div>
    </div>
  </div>
</template>

<script>
import allClients from '~/apollo/allClients.graphql'

export default {
  apollo: {
    allClients: {
      query: allClients,
      prefetch: true
    }
  }
}
</script>

<style lang="scss">
.panel {
  &__title {
    padding: 16px;
    font-size: 14px;
    color: #fff;
    text-transform: uppercase;
  }
  &__item {
    padding: 8px 16px;
    cursor: pointer;
    h6 {
      color: teal;
      font-size: 14px;
    }
    &:hover {
      background: #e5e5e5;
    }
    small {
      color: #333;
    }
  }
}
</style>
