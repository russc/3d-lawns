<template>
  <div class="splash">
    <img src="~assets/logo.jpg" alt="Dixon lawns logo">
  </div>
</template>

<script>
export default {
  head: {
    title: 'Dashboard'
  },
  data () {
    return {
      data: {
        name: '',
        private: false,
        content: ''
      }
    }
  }
}
</script>
<style>
.splash {
  height: 100vh;
  background: #fff;
}
img {
  width: 100%;
  height: auto;
}
</style>

