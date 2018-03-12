import Vuex from 'vuex'
// import moment from 'moment'
const today = new Date()
let month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1

const createStore = () => {
  return new Vuex.Store({
    state: {
      today,
      month,
      year: today.getFullYear()
    },
    mutations: {
      nextMonth (state) {
        if (state.month === 11) {
          state.month = 0
          state.year = state.year + 1
        } else {
          state.month++
        }
      },
      prevMonth (state) {
        if (state.month === 0) {
          state.month = 11
          state.year = state.year - 1
        } else {
          state.month--
        }
      },
      now (state) {
        state.month = state.month
        state.year = state.month
      }
    }
  })
}

export default createStore

