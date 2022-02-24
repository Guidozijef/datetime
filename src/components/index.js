import Vue from 'vue'
import Datetime from './Datetime.vue'
import DatetimePopup from './DatetimePopup.vue'

function plugin (Vue) {
  Vue.component('datetime', Datetime)
  Vue.component('datetime-popup', DatetimePopup)
}

// Install by default if using the script tag
Vue.use(plugin)

export default plugin

// Export all components too
export {
  Datetime,
  DatetimePopup,
}
