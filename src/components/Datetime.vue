<template>
  <div class="vdatetime" ref="vdatetime">
    <slot name="before"></slot>
    <input class="vdatetime-input" v-clickOutside="handleClose"
          :class="{'is-disabled': disabled , [inputClass]: true}"
            ref="reference"
           :style="inputStyle"
           :id="inputId"
           type="text"
           :placeholder="placeholder"
           :value="inputValue"
           v-bind="$attrs"
           v-on="$listeners"
           @click="handleFocus">
    <input type="hidden" v-if="hiddenName" :name="hiddenName" :value="value" @input="setValue">
    <span class="icon-clear" @click="clearValue" v-if="clearable && !disabled">
      <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M-73.14-73.14h1170.28v1170.28h-1170.28z" fill="#ffffff" p-id="0"></path><path d="M512 0c283.06 0 512 228.94 512 512s-228.94 512-512 512-512-228.94-512-512 228.94-512 512-512z m-84.11 378.88a44.62 44.62 0 0 0-62.18 0c-16.82 16.82-16.82 44.62 0 61.44l84.12 84.85-84.12 84.11a44.62 44.62 0 0 0 0 62.17c16.82 16.82 44.62 16.82 62.18 0l84.11-84.84 84.11 84.84c16.82 16.82 44.62 16.82 62.18 0a44.62 44.62 0 0 0 0-62.17l-84.12-84.11 84.12-84.85c16.82-16.82 16.82-44.62 0-61.44a44.62 44.62 0 0 0-62.18 0l-84.11 84.11z" fill="#dddddd" p-id="1"></path></svg>
    </span>
    <div class="prefix-box">
      <slot name="prefix">
        <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M-73.14-73.14h1170.28v1170.28h-1170.28z" fill="#ffffff" p-id="0"></path><path d="M732.16 36.57c24.14 0 43.89 19.75 43.89 43.89v21.94h145.55c37.3 0 68.75 28.53 72.41 64.37l0.73 8.77v746.06c0 40.23-32.91 73.14-73.14 73.14h-819.2c-40.23 0-73.14-32.91-73.14-73.14v-746.06c0-40.23 32.91-73.14 73.14-73.14h147.02v-21.94c0-24.14 19.75-43.89 43.88-43.89 24.14 0 43.89 19.75 43.89 43.89v21.94h351.08v-21.94c0-24.14 19.75-43.89 43.89-43.89z m174.81 374.49h-789.94v495.91h789.94v-495.91z m-219.43 204.8c24.14 0 43.89 19.75 43.89 43.89 0 24.14-19.75 43.89-43.89 43.88h-351.08c-24.14 0-43.89-19.75-43.89-43.88 0-24.14 19.75-43.89 43.89-43.89h351.08z m-438.12-425.69h-132.39v133.12h789.94v-133.12h-130.92v21.94c0 24.14-19.75 43.89-43.89 43.89-24.14 0-43.89-19.75-43.89-43.89v-21.94h-351.08v21.94c0 24.14-19.75 43.89-43.89 43.89-24.14 0-43.89-19.75-43.88-43.89v-21.94z" fill="#dddddd" p-id="1"></path></svg>
      </slot>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { DateTime } from 'luxon'
import DatetimePopup from './DatetimePopup'
import Popper from './date-popper'
import { datetimeFromISO, startOfDay, weekStart } from './util'

const formatMap = {
  'datetime': 'yyyy-MM-dd HH:mm:ss',
  'date': 'yyyy-MM-dd',
  'time': 'HH:mm:ss',
}

const PLACEMENT_MAP = {
  left: 'bottom-start',
  center: 'bottom',
  right: 'bottom-end'
}

const NewPopper = {
  props: {
    appendToBody: Popper.props.appendToBody,
    offset: Popper.props.offset,
    boundariesPadding: Popper.props.boundariesPadding,
    arrowOffset: Popper.props.arrowOffset
  },
  methods: Popper.methods,
  data() {
    return _.assign({ visibleArrow: false }, Popper.data);
  },
  beforeDestroy: Popper.beforeDestroy,
};

export default {
  name: 'dateTime',
  components: {
    DatetimePopup
  },

  mixins: [ NewPopper ],

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
    placeholder: {
      type: String,
      default: '请选择日期'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    disabled: {
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
    },
    align: {
        type: String,
        default: 'left'
    }
  },

  data () {
    return {
      isOpen: false,
      pickerVisible: false,
      datetime: this.value ? DateTime.fromFormat(this.value, formatMap[this.type] || 'yyyy-MM-dd HH:mm:ss') : datetimeFromISO(this.value),
      picker: null
    }
  },

  watch: {
    value: {
      immediate: true,
      handler (newValue) {
        this.datetime = newValue ? DateTime.fromFormat(newValue, formatMap[this.type] || 'yyyy-MM-dd HH:mm:ss') : datetimeFromISO(newValue)
      }
    },
    pickerVisible (val) {
      if (val) {
        this.showPicker()
      } else {
        this.hidePicker()
      }
    },
    inputValue: {
      handler (value, oldValue) {
        if (value !== oldValue) {
          this.$emit('change', value)
        }
      }
    }
  },

  created () {
    this.popperOptions = {
      boundariesPadding: 0,
      gpuAcceleration: false
    }
    this.placement = PLACEMENT_MAP[this.align] || PLACEMENT_MAP.left
    this.emitInput()
  },

  computed: {
    reference() {
      const reference = this.$refs.reference;
      return reference.$el || reference;
    },

    inputValue () {
      let format = this.format

      if (!format) {
        format = formatMap[this.type] || 'yyyy-MM-dd HH:mm:ss'
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
    // document.addEventListener('click', this.bodyCloseMenus)
    // this.$once('hook:beforeDestroy',  () => {
    //   document.removeEventListener('click', this.bodyCloseMenus)
    // })
  },
  methods: {
    clearValue () {
      this.datetime = ''
      this.emitInput()
      // this.$emit('change', this.inputValue)
    },
    emitInput () {
      let format = this.format
      if (!format) {
        format = formatMap[this.type] || 'yyyy-MM-dd HH:mm:ss'
      }
      let datetime = this.datetime ? DateTime.fromISO(this.datetime).setZone(this.zone).toFormat(format) : null

      // if (datetime && this.type === 'date') {
      //   datetime = startOfDay(datetime)
      // }

      this.$emit('input', datetime ? datetime : '')
    },
    handleFocus () {
      if (this.disabled) return 
      this.pickerVisible = true
    },
    showPicker () {
      if (!this.picker) {
        this.mountPicker()
      }
      this.picker.newDatetime = this.datetime || DateTime.local()
      this.picker.type = this.type
      this.pickerVisible = this.picker.visible = true

      this.updatePopper()

    },
    hidePicker() {
      if (this.picker) {
        this.pickerVisible = this.picker.visible = false
        this.destroyPopper()
      }
    },
    mountPicker () {
      this.picker = new Vue(DatetimePopup).$mount()
      this.popperElm = this.picker.$el
      this.picker.newDatetime = this.datetime || DateTime.local()
      let props = ['type', 'format', 'minDatetime', 'maxDatetime', 'placeholder', 'clearable', 'disabled', 'weekStart']
      props.forEach(prop => this[prop] && (this.picker[prop] = this[prop]))
      if (!this.appendToBody) {
        this.$el.appendChild(this.picker.$el)
      }
      this.picker.$on('confirm', this.confirm)
      this.picker.$on('change', datetime => {
        this.datetime = datetimeFromISO(datetime)
        this.emitInput()
        if (this.type === 'date') {
            this.handleClose()
        }
      })
      return 
    },
    handleClose () {
      if (!this.pickerVisible) return 
      this.pickerVisible = this.picker.visible = false
      this.$emit('close')
    },
    confirm (datetime) {
      this.datetime = datetimeFromISO(datetime)
      this.emitInput()
      this.$emit('input', _.cloneDeep(this.inputValue))
      this.handleClose()
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
      // this.emitInput()
      if (this.type === 'date') {
        this.confirm(datetime)
      }
      // this.$emit('change', this.inputValue)
    }
  },
}
</script>

<style lang="scss">

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
    padding-left: 8px;
    padding-right: 32px;
    background-color: #fff;
    background-image: none;
    border-radius: 2px;
    border: 1px solid #D1D9E4;
    box-sizing: border-box;
    color: #606266;
    display: inline-block;
    height: 24px;
    width: 100%;
    &:hover {
      border: 1px solid #C0C4CC;
    }
    &:focus{
      border: 1px solid #2A6ECD;
    }
    &.is-disabled{
      background-color: #f5f7fa;
      border-color: #e4e7ed;
      color: #c0c4cc;
      cursor: not-allowed;
      &::placeholder {
        color: #86909c;
      }
    }
  }
  &:hover, &:focus{
    .icon-clear{
      display: inline-block;
    }
  }
  .icon-clear{
    display: none;
    position: absolute;
    right: 32px;
    width: 13px;
    top: 3px;
    cursor: pointer;
  }
}

.prefix-box{
  position: absolute;
  right: 10px;
  width: 15px;
  top: 3px;
}


</style>
