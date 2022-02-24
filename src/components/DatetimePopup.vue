<template>
  <div class="vdatetime-popup" :style="positionStyle">
    <div class="vdatetime-popup__body" :style="{ 'width': this.popWidth}">
      <datetime-year-picker
          v-if="type === 'year'"
          @change="onChangeYear"
          :min-date="minDatetime"
          :max-date="maxDatetime"
          :year="year"></datetime-year-picker>
      <datetime-month-picker
          v-if="type === 'month'"
          @change="onChangeMonth"
          :min-date="minDatetime"
          :max-date="maxDatetime"
          :year="year"
          :month="month"></datetime-month-picker>
      <div class="calendar-container">
        <datetime-calendar
          v-if="type === 'datetime' || type === 'date'"
          @change="onChangeDate"
          @setDateTime="setDateTime"
          :year="year"
          :month="month"
          :day="day"
          :min-date="minDatetime"
          :max-date="maxDatetime"
          :week-start="weekStart"
      ></datetime-calendar>
      </div>
      <div class="time-container">
        <datetime-time-picker
          v-if="type === 'datetime' || type === 'time'"
          @change="onChangeTime"
          @confirm="confirm"
          :year="year"
          :month="month"
          :day="day"
          :hour="hour"
          :minute="minute"
          :second="second"
          :use12-hour="use12Hour"
          :min-time="minTime"
          :max-time="maxTime"></datetime-time-picker>
      </div>
    </div>
    <!-- <div class="vdatetime-popup__actions">
      <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--cancel" @click="cancel">
        <slot name="button-cancel__internal" v-bind:step="step">{{ phrases.cancel }}</slot>
      </div>
      <div class="vdatetime-popup__actions__button vdatetime-popup__actions__button--confirm" @click="confirm">
        <slot name="button-confirm__internal" v-bind:step="step">{{ phrases.ok }}</slot>
      </div>
    </div> -->
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import DatetimeCalendar from './DatetimeCalendar'
import DatetimeTimePicker from './DatetimeTimePicker'
import DatetimeYearPicker from './DatetimeYearPicker'
import DatetimeMonthPicker from './DatetimeMonthPicker'

const KEY_TAB = 9
const KEY_ENTER = 13
const KEY_ESC = 27

export default {
  components: {
    DatetimeCalendar,
    DatetimeTimePicker,
    DatetimeYearPicker,
    DatetimeMonthPicker
  },

  props: {
    datetime: {
      type: DateTime,
      required: true
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
    type: {
      type: String,
      default: 'date'
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
      type: DateTime,
      default: null
    },
    maxDatetime: {
      type: DateTime,
      default: null
    },
    auto: {
      type: Boolean,
      default: false
    },
    weekStart: {
      type: Number,
      default: 1
    },
    flow: {
      type: Array
    },
    title: {
      type: String
    },
    right: {
      type: Number,
      default: -295
    },
    top: {
      type: Number,
      default: 30
    }
  },

  data () {
    return {
      newDatetime: this.datetime,
      timePartsTouched: [],
    }
  },

  created () {
    document.addEventListener('keydown', this.onKeyDown)
  },

  beforeDestroy () {
    document.removeEventListener('keydown', this.onKeyDown)
  },

  computed: {
    year () {
      return this.newDatetime.year
    },
    month () {
      return this.newDatetime.month
    },
    day () {
      return this.newDatetime.day
    },
    hour () {
      return this.newDatetime.hour
    },
    minute () {
      return this.newDatetime.minute
    },
    second () {
      return this.newDatetime.second
    },
    dateFormatted () {
      return this.newDatetime.toLocaleString({
        month: 'long',
        day: 'numeric'
      })
    },
    minTime () {
      return (
        this.minDatetime &&
        this.minDatetime.year === this.year &&
        this.minDatetime.month === this.month &&
        this.minDatetime.day === this.day
      ) ? this.minDatetime.toFormat('HH:mm:ss') : null
    },
    maxTime () {
      return (
        this.maxDatetime &&
        this.maxDatetime.year === this.year &&
        this.maxDatetime.month === this.month &&
        this.maxDatetime.day === this.day
      ) ? this.maxDatetime.toFormat('HH:mm:ss') : null
    },
    popWidth () {
      let map = {
        'date': '234px',
        'time': '180px',
        'datetime': '414px'
      }
      return map[this.type]
    },
    positionStyle () {
      return {
        right: this.right + 'px',
        top: this.top + 'px',
      }
    }
  },

  methods: {
    showYear () {
      this.flowManager.diversion('date')
    },
    showMonth () {
      this.flowManager.diversion('date')
    },
    confirm () {
        this.$emit('confirm', this.newDatetime)
    },
    cancel () {
      this.$emit('cancel')
    },
    // 改变年
    onChangeYear (year) {
      this.newDatetime = this.newDatetime.set({ year })
      this.setDateTime()
    },
    // 改变月
    onChangeMonth (month) {
      this.newDatetime = this.newDatetime.set({ month })
      this.setDateTime()
    },
    // 改变年、月、日事件
    onChangeDate (year, month, day) {
      this.newDatetime = this.newDatetime.set({ year, month, day })
      this.setDateTime()
    },
    // 改变时、分、秒事件
    onChangeTime ({ hour, minute, second }) {
      if (Number.isInteger(hour)) {
        this.newDatetime = this.newDatetime.set({ hour })
      }

      if (Number.isInteger(minute)) {
        this.newDatetime = this.newDatetime.set({ minute })
      }

      if (Number.isInteger(second)) {
        this.newDatetime = this.newDatetime.set({ second })
      }

      this.setDateTime()
    },
    // 设置时间日期并暴露到外面， 有currFlag表示设置当前时间
    setDateTime (currFlag) {
      if (currFlag) {
        let dt = DateTime.local()
        this.newDatetime = this.newDatetime.set({ year: dt.year, month: dt.month, day: dt.day, hour: dt.hour, minute: dt.minute, second: dt.second })
      }
      this.$emit('setDateTime', this.newDatetime)
    },
    onKeyDown (event) {
      switch (event.keyCode) {
        case KEY_ESC:
        case KEY_TAB:
          this.cancel()
          break

        case KEY_ENTER:
          // this.nextStep()
          break
      }
    }
  }
}
</script>

<style lang="scss">
.vdatetime-popup {
  box-sizing: border-box;
  z-index: 1000;
  position: absolute;
  // top: 30px;
  // left: 50%;
  // transform: translate(-50%, -50%);
  // // width: 340px;
  // max-width: calc(100% - 30px);
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  color: #444;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  line-height: 1.18;
  background: #fff;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);

  & * {
    box-sizing: border-box;
  }
  .vdatetime-popup__body{
    overflow: hidden;
    height: 304px;
    // width: 414px;
    .calendar-container{
      float: left;
      width: 234px;
    }
    .time-container{
      float: left;
      width: 180px;
    }
  }
}

.vdatetime-popup__header {
  padding: 18px 30px;
  background: #3f51b5;
  color: #fff;
  font-size: 32px;
}

.vdatetime-popup__title {
  margin-bottom: 8px;
  font-size: 21px;
  font-weight: 300;
}

.vdatetime-popup__year {
  font-weight: 300;
  font-size: 14px;
  opacity: 0.7;
  cursor: pointer;
  transition: opacity .3s;

  &:hover {
    opacity: 1;
  }
}

.vdatetime-popup__date {
  line-height: 1;
  cursor: pointer;
}

.vdatetime-popup__actions {
  padding: 0 20px 10px 30px;
  text-align: right;
}

.vdatetime-popup__actions__button {
  display: inline-block;
  border: none;
  padding: 10px 20px;
  background: transparent;
  font-size: 16px;
  color: #3f51b5;
  cursor: pointer;
  transition: color .3s;

  &:hover {
    color: #444;
  }
}
</style>
