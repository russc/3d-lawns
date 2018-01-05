import Vuex from 'vuex'
import moment from 'moment'

const createStore = () => {
  return new Vuex.Store({
    state: {
      month: moment().month(),
      year: moment().year()
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
        state.month = moment().month()
        state.year = moment().year()
      }
    }
  })
}

export default createStore

