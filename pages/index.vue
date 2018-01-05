<template>
  <div>
    <h1>Dashboard</h1>
  </div>
</template>

<script>
import createCodeGql from '~/apollo/createCode.graphql'
import allCodes from '~/apollo/allCodes.graphql'
import detectLang from 'lang-detector'

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
  },
  methods: {
    createCode () {
      if (this.data.content) {
        const type = detectLang(this.data.content)
        this.$apollo.mutate({
          mutation: createCodeGql,
          variables: {
            ...this.data,
            type: type || null
          },
          update: (store, { data: { createCode } }) => {
            const data = store.readQuery({
              query: allCodes,
              variables: {
                orderBy: 'createdAt_DESC',
                first: 20,
                private: createCode.private
              }
            })
            data.allCodes.unshift(createCode)
            store.writeQuery({
              query: allCodes,
              variables: {
                orderBy: 'createdAt_DESC',
                first: 20,
                private: createCode.private
              },
              data
            })
          }
        }).then((response) => {
          this.$router.push({ name: 'code', params: { code: response.data.createCode.id } })
        }).catch((error) => {
          console.error(error)
        })
      }
    }
  }
}
</script>

<style lang="scss">
.code {
  position: relative;
  height: 100%;
  &__actions {
    position: absolute;
    top: 0px;
    right: 0px;
    .checkbox {
      cursor: pointer;
      margin-right: 16px;
      label {
        cursor: pointer;
      }
    }
  }
  textarea {
    font-size: 16px;
    color: #555;
    border: 0;
    width: 100%;
    height: 100%;
    resize: none;
  }
}

</style>
