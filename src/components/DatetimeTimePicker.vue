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
      <div class="vdatetime-time-picker__list vdatetime-time-picker__list--hours" ref="hourList">
        <div class="vdatetime-time-picker__item" :key="i" v-for="(hour, i) in hours" @click="selectHour(hour)" :class="{'vdatetime-time-picker__item--selected': i === 0, 'vdatetime-time-picker__item--disabled': hour.disabled}">{{ formatHour(hour.number) }}</div>
      </div>
      <div class="vdatetime-time-picker__list vdatetime-time-picker__list--minutes" ref="minuteList">
        <div class="vdatetime-time-picker__item" :key="i" v-for="(minute, i) in minutes" @click="selectMinute(minute)" :class="{'vdatetime-time-picker__item--selected': i === 0, 'vdatetime-time-picker__item--disabled': minute.disabled}">{{ minute.number }}</div>
      </div>
      <div class="vdatetime-time-picker__list vdatetime-time-picker__list--suffix" ref="suffixList">
        <div class="vdatetime-time-picker__item" :key="i" v-for="(second, i) in seconds" @click="selectSecond(second)" :class="{'vdatetime-time-picker__item--selected': i === 0, 'vdatetime-time-picker__item--disabled': second.disabled}">{{ second.number }}</div>
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

      this.$emit('change', { hour: parseInt(hour.number) })
    },
    selectMinute (minute) {
      if (minute.disabled) {
        return
      }

      this.$emit('change', { minute: parseInt(minute.number) })
    },
    selectSecond (second) {
      if (second.disabled) {
        return
      }

      this.$emit('change', { second: parseInt(second.number) })
    },
    // selectSuffix (suffix) {
    //   if (suffix === 'am') {
    //     if (this.hour >= 12) {
    //       this.$emit('change', { hour: parseInt(this.hour - 12), suffixTouched: true })
    //     }
    //   }
    //   if (suffix === 'pm') {
    //     if (this.hour < 12) {
    //       this.$emit('change', { hour: parseInt(this.hour + 12), suffixTouched: true })
    //     }
    //   }
    // },
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
    }
  },

  mounted () {
    const selectedHour = this.$refs.hourList.querySelector('.vdatetime-time-picker__item--selected')
    const selectedMinute = this.$refs.minuteList.querySelector('.vdatetime-time-picker__item--selected')
    this.$refs.hourList.scrollTop = selectedHour ? selectedHour.offsetTop - 250 : 0
    this.$refs.minuteList.scrollTop = selectedMinute ? selectedMinute.offsetTop - 250 : 0
  }
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
  line-height: 40px;
  text-align: right;
  padding: 0 16px;
  .button{
    width: 59px;
    height: 24px;
    background: rgba(66,123,255,1);
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

  &::-webkit-scrollbar {
    width: 3px;
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
  // color: #333;
  // background: rgba(66,123,255,0.1);
  // font-size: 32px;
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
