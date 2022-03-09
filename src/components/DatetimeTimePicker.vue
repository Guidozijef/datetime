<template>
  <div :class="{'vdatetime-time-picker': true, 'vdatetime-time-picker__with-suffix': true }">
    <div class="vdatetime-time-picker_title">
      <div class="vdatetime-time-input-box">
        <input class="vdatetime-time-input" type="text" :value="dateValue" >
        <span class="icon-clear">
          <svg version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path d="M-73.14-73.14h1170.28v1170.28h-1170.28z" fill="#ffffff" p-id="0"></path><path d="M512 0c283.06 0 512 228.94 512 512s-228.94 512-512 512-512-228.94-512-512 228.94-512 512-512z m-84.11 378.88a44.62 44.62 0 0 0-62.18 0c-16.82 16.82-16.82 44.62 0 61.44l84.12 84.85-84.12 84.11a44.62 44.62 0 0 0 0 62.17c16.82 16.82 44.62 16.82 62.18 0l84.11-84.84 84.11 84.84c16.82 16.82 44.62 16.82 62.18 0a44.62 44.62 0 0 0 0-62.17l-84.12-84.11 84.12-84.85c16.82-16.82 16.82-44.62 0-61.44a44.62 44.62 0 0 0-62.18 0l-84.11 84.11z" fill="#dddddd" p-id="1"></path></svg>
        </span>
      </div>
    </div>
    <div class="date-active"></div>
    <div class="vdatetime-time-picker_container">
      <div class="vdatetime-time-picker__list vdatetime-time-picker__list--hours"  ref="hourList" @scroll="handleScrollHour">
        <div class="vdatetime-time-picker__item" :key="i" v-for="(hour, i) in hours" @click="selectHour(hour)" :class="{'vdatetime-time-picker__item--selected': currHour == hour.number, 'vdatetime-time-picker__item--disabled': hour.disabled}">{{ formatHour(hour.number) }}</div>
        <div style="height:192px"></div>
      </div>
      <div class="vdatetime-time-picker__list vdatetime-time-picker__list--minutes" ref="minuteList" @scroll="handleScrollMinute">
        <div class="vdatetime-time-picker__item" :key="i" v-for="(minute, i) in minutes" @click="selectMinute(minute)" :class="{'vdatetime-time-picker__item--selected': currMinute == minute.number, 'vdatetime-time-picker__item--disabled': minute.disabled}">{{ minute.number }}</div>
        <div style="height:192px"></div>
      </div>
      <div class="vdatetime-time-picker__list vdatetime-time-picker__list--suffix" ref="secondList" @scroll="handleScrollSecond">
        <div class="vdatetime-time-picker__item" :key="i" v-for="(second, i) in seconds" @click="selectSecond(second)" :class="{'vdatetime-time-picker__item--selected': currSecond == second.number, 'vdatetime-time-picker__item--disabled': second.disabled}">{{ second.number }}</div>
        <div style="height:192px"></div>
      </div>
    </div>
    <div class="vdatetime-time-picker__button">
      <button class="button" @click="confirm">确定</button>
    </div>
  </div>
</template>

<script>
import { hours, minutes, pad, timeComponentIsDisabled } from './util'

export default {
  props: {
    year: {
      type: Number,
      required: true
    },
    month: {
      type: Number,
      required: true
    },
    day: {
      type: Number,
      required: true
    },
    hour: {
      type: Number,
      required: true
    },
    minute: {
      type: Number,
      required: true
    },
    second: {
      type: Number,
      required: true
    },
    use12Hour: {
      type: Boolean,
      default: false
    },
    minTime: {
      type: String,
      default: null
    },
    maxTime: {
      type: String,
      default: null
    }
  },

  data () {
    return {
      currHour: '00',
      currMinute: '00',
      currSecond: '00',
      hoursTop: this.$refs.hourList,
      minuteTop: this.$refs.minuteList,
      secondTop: this.$refs.secondList
    }
  },

  mounted () {
    if (!this.hoursTop){
      this.hoursTop = this.$refs.hourList
    }
    this.hoursTop.scrollTop = this.hour * 32
    if (!this.minuteTop){
      this.minuteTop = this.$refs.minuteList
    }
    this.minuteTop.scrollTop = this.minute * 32
    if (!this.secondTop){
      this.secondTop = this.$refs.secondList
    }
    this.secondTop.scrollTop = this.second * 32
  },

  watch: {
    hour: {
      immediate: true,
      handler(hour = 0) {
        this.$nextTick(() => {
          if (!this.hoursTop){
            this.hoursTop = this.$refs.hourList
          }
          this.hoursTop.scrollTop = hour * 32
        })
      },
    },
    minute: {
      immediate: true,
      handler(minute = 0) {
        this.$nextTick(() => {
          if (!this.minuteTop){
            this.minuteTop = this.$refs.minuteList
          }
          this.minuteTop.scrollTop = minute * 32
        })
      },
    },
    second: {
      immediate: true,
      handler(second = 0) {
        this.$nextTick(() => {
          if (!this.secondTop){
            this.secondTop = this.$refs.secondList
          }
          this.secondTop.scrollTop = second * 32
        })
      }
    }
  },

  computed: {
    dateValue () {
      return `${pad(this.year)}-${pad(this.month)}-${pad(this.day)} ${pad(this.hour)}:${pad(this.minute)}:${pad(this.second)}`
    },
    hours () {
      return hours().filter(hour => {
        if (!this.use12Hour) {
          return true
        } else {
          if (this.hour < 12) {
            return hour < 12
          } else {
            return hour >= 12
          }
        }
      }).map(hour => ({
        number: pad(hour),
        selected: hour === this.hour,
        disabled: timeComponentIsDisabled(this.minHour, this.maxHour, hour)
      }))
    },
    minutes () {
      return minutes().map(minute => ({
        number: pad(minute),
        selected: minute === this.minute,
        disabled: timeComponentIsDisabled(this.minMinute, this.maxMinute, minute)
      }))
    },
    seconds () {
      return minutes().map(second => ({
        number: pad(second),
        selected: second === this.second,
        disabled: timeComponentIsDisabled(this.minMinute, this.maxMinute, second)
      }))
    },
    minHour () {
      return this.minTime ? parseInt(this.minTime.split(':')[0]) : null
    },
    minMinute () {
      return this.minTime && this.minHour === this.hour ? parseInt(this.minTime.split(':')[1]) : null
    },
    maxHour () {
      return this.maxTime ? parseInt(this.maxTime.split(':')[0]) : null
    },
    maxMinute () {
      return this.maxTime && this.maxHour === this.hour ? parseInt(this.maxTime.split(':')[1]) : null
    }
  },

  methods: {
    selectHour (hour) {
      if (hour.disabled) {
        return
      }
      if (!this.hoursTop){
        this.hoursTop = this.$refs.hourList
      }
      this.hoursTop.scrollTop = parseInt(hour.number) * 32

      this.$emit('change', { hour: parseInt(hour.number) })
    },
    selectMinute (minute) {
      if (minute.disabled) {
        return
      }
      if (!this.minuteTop){
        this.minuteTop = this.$refs.minuteList
      }
      this.minuteTop.scrollTop = parseInt(minute.number) * 32

      this.$emit('change', { minute: parseInt(minute.number) })
    },
    selectSecond (second) {
      if (second.disabled) {
        return
      }
      if (!this.secondTop){
        this.secondTop = this.$refs.secondList
      }
      this.secondTop.scrollTop = parseInt(second.number) * 32

      this.$emit('change', { second: parseInt(second.number) })
    },

    formatHour (hour) {
      const numHour = Number(hour)
      if (this.use12Hour) {
        if (numHour === 0) {
          return 12
        }
        if (numHour > 12) {
          return numHour - 12
        }
        return numHour
      }
      return hour
    },
    confirm () {
      this.$emit('confirm')
    },
    debounce(fun, delay) {
        return function (...args) {
            let that = this
            let _args = args
            clearTimeout(fun.id)
            fun.id = setTimeout(function () {
                fun.call(that, _args)
            }, delay)
        }
    },
    debounceScrollHour (args) {
      if (this.currHour === pad(args[1])) {
        args[0].target.scrollTop = args[1] * 32
        this.selectHour({ number: this.currHour })
      }
    },
    debounceScrollMinute (args) {
      if (this.currMinute === pad(args[1])) {
        args[0].target.scrollTop = args[1] * 32
        this.selectMinute({ number: this.currMinute })
      }
    },
    debounceScrollSecond (args) {
      if (this.currSecond === pad(args[1])) {
        args[0].target.scrollTop = args[1] * 32
        this.selectSecond({ number: this.currSecond })
      }
    },
    handleScrollHour (event) {
        this.hoursTop = event.target
        let currHour = Math.round(event.target.scrollTop / 32)
        let fn = this.debounce(this.debounceScrollHour, 200)
        fn(event, currHour)
        this.currHour = pad(currHour)
    },
    handleScrollMinute (event) {
      this.minuteTop = event.target
      let currMinute = Math.round(event.target.scrollTop / 32)
      let fn = this.debounce(this.debounceScrollMinute, 200)
      fn(event, currMinute)
      this.currMinute = pad(currMinute)
    },
    handleScrollSecond (event) {
      this.secondTop = event.target
      let currSecond = Math.round(event.target.scrollTop / 32)
      let fn = this.debounce(this.debounceScrollSecond, 200)
      fn(event, currSecond)
      this.currSecond = pad(currSecond)
    },
  },
}
</script>

<style lang="scss">
.vdatetime-time-picker_title{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #F5F5F5;
  border-left: 1px solid #F5F5F5;
  position: relative;
  .vdatetime-time-input-box {
     .vdatetime-time-input{
      outline: none;
      height: 22px;
      font-size: 12px;
      font-weight: 600;
      color: #333;
      width: 100%;
      border: none;
      padding-left: 16px;
    }
    .icon-clear{
      display: none;
      position: absolute;
      height: 14px;
      width: 14px;
      top: 2px;
      right: 10px;
      cursor: pointer;
    }
    &:hover .icon-clear, &:focus .icon-clear{
      display: inline-block;
    }
  }
}
.vdatetime-time-picker_container{
  overflow: hidden;
  border-left: 1px solid #F5F5F5;
}
.vdatetime-time-picker {
  box-sizing: border-box;
  position: relative;
  &::after {
    content: '';
    display: table;
    clear: both;
  }

  & * {
    box-sizing: border-box;
  }
}
.vdatetime-time-picker__button{
  border-top: 1px solid #F5F5F5;
  border-left: 1px solid #F5F5F5;
  height: 40px;
  text-align: right;
  padding: 0 16px;
  .button{
    width: 59px;
    height: 24px;
    background: #2A6ECD;
    border-radius: 2px;
    border: none;
    color: #fff;
    margin-top: 8px;
    cursor: pointer;
  }
}

.vdatetime-time-picker__list {
  float: left;
  width: 50%;
  height: 224px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  border-right: 1px solid #f5f5f5;

  &::-webkit-scrollbar {
    width: 3px;
    display: none;
  }

  &::-webkit-scrollbar-track {
    background: #efefef;
  }

  &::-webkit-scrollbar-thumb {
    background: #ccc;
  }
}

.vdatetime-time-picker__with-suffix .vdatetime-time-picker__list {
  width: 33.3%;
}

.vdatetime-time-picker__item {
  height: 24px;
  line-height: 24px;
  margin-bottom: 8px;
  font-size: 12px;
  text-align: center;
  cursor: pointer;
  transition: font-size .3s;
  &:hover{
    background: #f5f5f5;
    color: #333;
  }
}

.vdatetime-time-picker__item--selected {
  color: #333333;
  font-weight: 700;
}

.vdatetime-time-picker__item--disabled {
  opacity: 0.4;
  cursor: default;
  font-size: 20px !important;
}

.date-active{
  position: absolute;
  top: 40px;
  width: 100%;
  height: 24px;
  color: #333;
  background: rgba(66,123,255,0.1);
}
</style>
