<template>
  <div>
    <div class="header">
      <router-link class="header__logo" to="/">
        <span>3D Lawns</span>
      </router-link>
      <!-- <search></search> -->
      <div class="header__menu">
        <router-link class="link" :to="{ name: 'index' }" exact>
          <i class="material-icons">dashboard</i> <span>Dashboard</span>
        </router-link>
        <router-link class="link" :to="{ name: 'calendar' }">
          <i class="material-icons">event_note</i> <span>Calendar</span>
        </router-link>
        <router-link class="link" :to="{ name: 'clients' }">
          <i class="material-icons">people</i> <span>Clients</span>
        </router-link>
        <router-link class="link" :to="{ name: 'services' }">
          <i class="material-icons">local_offer</i> <span>Services</span>
        </router-link>
        <router-link class="link" :to="{ name: 'finances' }">
          <i class="material-icons">attach_money</i> <span>Finances</span>
        </router-link>
        <!-- <span class="spacer"></span> -->
        <!-- <a class="link" href="https://nuxtjs.org">
          Nuxt.js
        </a>
        <a class="link" href="https://vuejs.org">
          Vue.js
        </a> -->
      </div>
    </div>

    <section class="main">
      <div class="main__content">
        <nuxt/>
      </div>
      <!-- <div class="main__panel">
        <panel></panel>
      </div> -->
    </section>
  </div>
</template>

<script>
export default {
  
}
</script>

<style lang="scss">
@import 'assets/variables.scss';
html, body {
  background: linear-gradient(#333, #006380);
}

.main {
  width: 100%;
  min-height: calc(100vh - 60px);
  display: flex;
  &__content {
    width: inherit;
    // padding: 16px;
    flex: 1;
  }
  &__panel {
    width: 300px;
    min-height: 100%;
    background: #F3F3F3;
  }
}

.header {
  background-color: transparent;
  height: 90px;
  padding: 10px 16px;
  position: relative;
  display: flex;
  align-items: center;
  z-index: 2;
  // border-bottom: 1px solid #eee;
  @media (max-width: 768px) {
    justify-content: center;
  }
  &__menu {
    display: flex;
    align-items: center;
    margin-left: auto;
    @media (max-width: 768px) {
      margin-left: 0;
    }
    .spacer {
      width: 1px;
      height: 30px;
      margin: 16px;
      background: #eee;
    }
    .link {
      display: flex;
      padding: 18px;
      color: #fff;
      &:hover {
        color: mistyrose;
      }
      &.nuxt-link-active {
        color: darken($primary, 3%);
      }
      span {
        @media (max-width: 768px) {
          display: none;
        }
      }
    }
    .material-icons {
      margin-right: 3px;
    }
  }
  &__logo {
    display: inline-block;
    font-size: 1.5em;
    color: orange;
    font-family: 'Dosis', 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
    font-weight: 500;
    @media (max-width: 992px) {
      display: none;
    }
  }
}

.page-enter-active, .page-leave-active {
  transition: all .2s;
}
.page-enter {
  opacity:   0;
}
</style>
