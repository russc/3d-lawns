<template>
  <div class="expenses">
   <table class="striped responsive">
        <thead>
          <tr>
              <th>Description</th>
              <th>Cost</th>
              <th>Item Price</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Alvin</td>
            <td>Eclair</td>
            <td>$0.87</td>
          </tr>
          <tr>
            <td>Alan</td>
            <td>Jellybean</td>
            <td>$3.76</td>
          </tr>
          <tr>
            <td>Jonathan</td>
            <td>Lollipop</td>
            <td>$7.00</td>
          </tr>
        </tbody>
      </table>
  </div>
</template>

<script>
export default {
  head: {
    title: 'Expenses'
  }
}
</script>

<style lang='scss'>
  .expenses {
    width: 98%;
    margin: 0 1%;
    display: flex;
    @media (max-width: 768px) {
      width: 100%;
      margin: 0;
    }
  }
</style>
