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
    <slot name="after"></slot>
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
          :hour-step="hourStep"
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
    hourStep: {
      type: Number,
      default: 1
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
        return weekStart()
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
            format = DateTime.DATE_MED
            break
          case 'time':
            format = DateTime.TIME_24_SIMPLE
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
    setDateTime(datetime) {
      this.datetime = datetime.toUTC()
      this.emitInput()
      // this.close()
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
    padding: 0 16px;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    height: 24px;
    width: 100%;
  }
}


</style>
