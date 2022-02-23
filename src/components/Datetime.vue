<template>
  <div class="vdatetime" ref="vdatetime">
    <slot name="before"></slot>
    <input class="vdatetime-input"
            ref="input"
           :class="inputClass"
           :style="inputStyle"
           :id="inputId"
           type="text"
           :value="inputValue"
           v-bind="$attrs"
           v-on="$listeners"
           @click="open"
           @focus="open">
    <input v-if="hiddenName" type="hidden" :name="hiddenName" :value="value" @input="setValue">
    <div class="prefix-box">
      <slot name="prefix">
        <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M-73.14-73.14h1170.28v1170.28h-1170.28z" fill="#ffffff" p-id="0"></path><path d="M732.16 36.57c24.14 0 43.89 19.75 43.89 43.89v21.94h145.55c37.3 0 68.75 28.53 72.41 64.37l0.73 8.77v746.06c0 40.23-32.91 73.14-73.14 73.14h-819.2c-40.23 0-73.14-32.91-73.14-73.14v-746.06c0-40.23 32.91-73.14 73.14-73.14h147.02v-21.94c0-24.14 19.75-43.89 43.88-43.89 24.14 0 43.89 19.75 43.89 43.89v21.94h351.08v-21.94c0-24.14 19.75-43.89 43.89-43.89z m174.81 374.49h-789.94v495.91h789.94v-495.91z m-219.43 204.8c24.14 0 43.89 19.75 43.89 43.89 0 24.14-19.75 43.89-43.89 43.88h-351.08c-24.14 0-43.89-19.75-43.89-43.88 0-24.14 19.75-43.89 43.89-43.89h351.08z m-438.12-425.69h-132.39v133.12h789.94v-133.12h-130.92v21.94c0 24.14-19.75 43.89-43.89 43.89-24.14 0-43.89-19.75-43.89-43.89v-21.94h-351.08v21.94c0 24.14-19.75 43.89-43.89 43.89-24.14 0-43.89-19.75-43.88-43.89v-21.94z" fill="#dddddd" p-id="1"></path></svg>
      </slot>
    </div>
    <transition-group name="vdatetime-fade" tag="div" @click="clickOutside">
      <!-- <div key="overlay" v-if="isOpen && !hideBackdrop" class="vdatetime-overlay" @click.self="clickOutside"></div> -->
      <datetime-popup
          ref="datetimePopup"
          key="popup"
          v-if="isOpen"
          :type="type"
          :datetime="popupDate"
          :phrases="phrases"
          :use12-hour="use12Hour"
          :minute-step="minuteStep"
          :min-datetime="popupMinDatetime"
          :max-datetime="popupMaxDatetime"
          @confirm="confirm"
          @cancel="cancel"
          @setDateTime="setDateTime"
          :auto="auto"
          :week-start="weekStart"
          :flow="flow"
          :title="title">
        <template name="button-cancel__internal" v-slot="scope">
          <slot name="button-cancel" v-bind:step="scope.step">{{ phrases.cancel }}</slot>
        </template>
        <template name="button-confirm__internal" v-slot="scope">
          <slot name="button-confirm" v-bind:step="scope.step">{{ phrases.ok }}</slot>
        </template>
      </datetime-popup>
    </transition-group>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import DatetimePopup from './DatetimePopup'
import { datetimeFromISO, startOfDay, weekStart } from './util'

export default {
  components: {
    DatetimePopup
  },

  inheritAttrs: false,

  props: {
    value: {
      type: String
    },
    valueZone: {
      type: String,
      default: 'UTC'
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [Object, Array, String],
      default: ''
    },
    inputStyle: {
      type: [Object, Array, String],
      default: ''
    },
    hiddenName: {
      type: String
    },
    zone: {
      type: String,
      default: 'local'
    },
    format: {
      type: [Object, String],
      default: null
    },
    type: {
      type: String,
      default: 'date'
    },
    phrases: {
      type: Object,
      default () {
        return {
          cancel: 'Cancel',
          ok: 'Ok'
        }
      }
    },
    use12Hour: {
      type: Boolean,
      default: false
    },
    minuteStep: {
      type: Number,
      default: 1
    },
    minDatetime: {
      type: String,
      default: null
    },
    maxDatetime: {
      type: String,
      default: null
    },
    auto: {
      type: Boolean,
      default: false
    },
    weekStart: {
      type: Number,
      default () {
        return 0
      }
    },
    flow: {
      type: Array
    },
    title: {
      type: String
    },
    hideBackdrop: {
      type: Boolean,
      default: false
    },
    backdropClick: {
      type: Boolean,
      default: true
    }
  },

  data () {
    return {
      isOpen: false,
      datetime: datetimeFromISO(this.value)
    }
  },

  watch: {
    value (newValue) {
      this.datetime = datetimeFromISO(newValue)
    }
  },

  created () {
    this.emitInput()
  },

  computed: {
    inputValue () {
      let format = this.format

      if (!format) {
        switch (this.type) {
          case 'date':
            format = 'yyyy-MM-dd' // DateTime.DATE_MED
            break
          case 'time':
            format = 'HH:mm:ss' // DateTime.TIME_24_SIMPLE
            break
          case 'datetime':
          case 'default':
            format = 'yyyy-MM-dd HH:mm:ss' //DateTime.DATETIME_MED
            break
        }
      }

      if (typeof format === 'string') {
        return this.datetime ? DateTime.fromISO(this.datetime).setZone(this.zone).toFormat(format) : ''
      } else {
        return this.datetime ? this.datetime.setZone(this.zone).toLocaleString(format) : ''
      }
    },
    popupDate () {
      return this.datetime ? this.datetime.setZone(this.zone) : this.newPopupDatetime()
    },
    popupMinDatetime () {
      return this.minDatetime ? DateTime.fromISO(this.minDatetime).setZone(this.zone) : null
    },
    popupMaxDatetime () {
      return this.maxDatetime ? DateTime.fromISO(this.maxDatetime).setZone(this.zone) : null
    }
  },
  mounted () {
    document.addEventListener('click', this.bodyCloseMenus)
  },
  methods: {
    emitInput () {
      let datetime = this.datetime ? this.datetime.setZone(this.valueZone) : null

      if (datetime && this.type === 'date') {
        datetime = startOfDay(datetime)
      }

      this.$emit('input', datetime ? datetime.toISO() : '')
    },
    open (event) {
      event.target.blur()

      this.isOpen = true
    },
    close () {
      this.isOpen = false
      this.$emit('close')
    },
    confirm (datetime) {
      this.datetime = datetime.toUTC()
      this.emitInput()
      this.close()
    },
    cancel () {
      this.close()
    },
    clickOutside () {
      // if (this.backdropClick === true) { this.cancel() }
    },
    bodyCloseMenus (e) {
      this.$nextTick(() => {
        if (this.$refs.datetimePopup && !this.$refs.datetimePopup.$el.contains(e.target) && this.$refs.vdatetime && this.$refs.input !== e.target) {
          this.cancel()
        }
      })
    },
    newPopupDatetime () {
      let datetime = DateTime.utc().setZone(this.zone).set({ seconds: 0, milliseconds: 0 })

      if (this.popupMinDatetime && datetime < this.popupMinDatetime) {
        datetime = this.popupMinDatetime.set({ seconds: 0, milliseconds: 0 })
      }

      if (this.popupMaxDatetime && datetime > this.popupMaxDatetime) {
        datetime = this.popupMaxDatetime.set({ seconds: 0, milliseconds: 0 })
      }

      if (this.minuteStep === 1) {
        return datetime
      }

      const roundedMinute = Math.round(datetime.minute / this.minuteStep) * this.minuteStep

      if (roundedMinute === 60) {
        return datetime.plus({ hours: 1 }).set({ minute: 0 })
      }

      return datetime.set({ minute: roundedMinute })
    },
    setValue (event) {
      this.datetime = datetimeFromISO(event.target.value)
      this.emitInput()
    },
    // 设置时间
    setDateTime(datetime) {
      this.datetime = datetime.toUTC()
      this.emitInput()
      if (this.type === 'date') {
        this.close()
      }
    }
  },
  beforeDestroy () {
    document.removeEventListener('click', this.bodyCloseMenus)
  }
}
</script>

<style lang="scss">
.vdatetime-fade-enter-active,
.vdatetime-fade-leave-active {
  transition: opacity .4s;
}

.vdatetime-fade-enter,
.vdatetime-fade-leave-to {
  opacity: 0;
}

.vdatetime-overlay {
  z-index: 999;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity .5s;
}

.vdatetime{
  position: relative;
  width: 100%;
  .vdatetime-input{
    outline: none;
    padding-left: 16px;
    padding-right: 32px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    height: 24px;
    width: 100%;
    &:hover, &:focus{
      border: 1px solid #548BD7;
    }
  }
}

.prefix-box{
  position: absolute;
  right: 10px;
  width: 15px;
  top: 3px;
}


</style>
