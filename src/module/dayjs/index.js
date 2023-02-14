import Vue from 'vue'
import dayjs from 'dayjs'

Vue.prototype.$formatTime = (date) => {
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
