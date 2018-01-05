import Vue from 'vue'
import moment from 'moment'

Vue.filter('truncate', function (text, length = 30, clamp = '...') {
  if (text.length <= length) {
    return text
  }
  return text.substring(0, length) + clamp
})

Vue.filter('placeholder', function (value, placeholder) {
  return value || placeholder || ''
})

Vue.filter('formatDate', function (value, format = 'LLL') {
  return moment(value).format(format)
})

Vue.filter('formatDateMoment', function (value, format = 'YYYY-MM-DD') {
  return moment(value).format(format)
})

Vue.filter('formatTime', function (value, format = 'LT') {
  return moment(value).format(format)
})

Vue.filter('formatMoney', function (value) {
  return `$${value}`
})

Vue.filter('matchingDates', function (value1, value2) {
  let v1 = moment(value1).format('YYYY-MM-DD')
  let v2 = moment(value2).format('YYYY-MM-DD')

  return v1 === v2
})
