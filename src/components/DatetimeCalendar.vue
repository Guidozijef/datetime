<template>
  <div class="vdatetime-calendar">
    <div class="vdatetime-calendar__navigation">
      <div class="vdatetime-calendar__navigation--previous-year" @click="previousYear">
        <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Icon/12/控件/左切/normal" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g>
                  <rect id="矩形" opacity="0.40114008" x="0" y="0" width="12" height="12"></rect>
                  <path d="M10.8714989,1.01489719 C11.0252679,1.16866613 11.044489,1.40603237 10.9291623,1.58070064 L10.8714989,1.6512933 L6.5233961,6.00009524 L10.8714989,10.3487067 C11.0252679,10.5024756 11.044489,10.7398419 10.9291623,10.9145101 L10.8714989,10.9851028 C10.71773,11.1388717 10.4803637,11.1580929 10.3056955,11.0427662 L10.2351028,10.9851028 L5.56819805,6.31819805 C5.41442911,6.16442911 5.39520799,5.92706287 5.5105347,5.75239461 L5.56819805,5.68180195 L10.2351028,1.01489719 C10.4108387,0.839161261 10.695763,0.839161261 10.8714989,1.01489719 Z M6.37149891,1.01489719 C6.52526785,1.16866613 6.54448897,1.40603237 6.42916226,1.58070064 L6.37149891,1.6512933 L2.0233961,6.00009524 L6.37149891,10.3487067 C6.52526785,10.5024756 6.54448897,10.7398419 6.42916226,10.9145101 L6.37149891,10.9851028 C6.21772997,11.1388717 5.98036373,11.1580929 5.80569547,11.0427662 L5.73510281,10.9851028 L1.06819805,6.31819805 C0.914429112,6.16442911 0.895207994,5.92706287 1.0105347,5.75239461 L1.06819805,5.68180195 L5.73510281,1.01489719 C5.91083874,0.839161261 6.19576298,0.839161261 6.37149891,1.01489719 Z" id="形状结合" fill="#666666"></path>
              </g>
          </g>
        </svg>
      </div>
      <div class="vdatetime-calendar__navigation--previous" @click="previousMonth">
        <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Icon/12/控件/左一/normal" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g>
                  <rect id="矩形" opacity="0.40114008" x="0" y="0" width="12" height="12"></rect>
                  <path d="M7.93180195,1.01489719 C8.10753788,0.839161261 8.39246212,0.839161261 8.56819805,1.01489719 C8.74393398,1.19063312 8.74393398,1.47555736 8.56819805,1.6512933 L8.56819805,1.6512933 L4.22009524,6.00009524 L8.56819805,10.3487067 C8.72196699,10.5024756 8.74118811,10.7398419 8.6258614,10.9145101 L8.56819805,10.9851028 C8.39246212,11.1608387 8.10753788,11.1608387 7.93180195,10.9851028 L7.93180195,10.9851028 L3.26489719,6.31819805 C3.08916126,6.14246212 3.08916126,5.85753788 3.26489719,5.68180195 L3.26489719,5.68180195 Z" id="形状结合" fill="#666666"></path>
              </g>
          </g>
        </svg>
      </div>
      <div class="vdatetime-calendar__current--month">{{ `${newYear}年` }} &nbsp;&nbsp;{{ `${monthName}月` }}</div>
      <div class="vdatetime-calendar__navigation--next" @click="nextMonth">
        <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="控件" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="Icon/12/控件/右一/normal">
                  <rect id="矩形" opacity="0.40114008" x="0" y="0" width="12" height="12"></rect>
                  <path d="M4.06819805,1.01489719 L8.73510281,5.68180195 L8.73510281,5.68180195 C8.91083874,5.85753788 8.91083874,6.14246212 8.73510281,6.31819805 L4.06819805,10.9851028 C3.89246212,11.1608387 3.60753788,11.1608387 3.43180195,10.9851028 C3.25606602,10.8093669 3.25606602,10.5244426 3.43180195,10.3487067 L7.78,6.00009524 L3.43180195,1.6512933 C3.25606602,1.47555736 3.25606602,1.19063312 3.43180195,1.01489719 C3.60753788,0.839161261 3.89246212,0.839161261 4.06819805,1.01489719 Z" id="形状结合" fill="#666666"></path>
              </g>
          </g>
      </svg>
      </div>
      <div class="vdatetime-calendar__navigation--next-year" @click="nextYear">
        <svg width="12px" height="12px" viewBox="0 0 12 12" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Icon/12/控件/右切/normal" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g>
                  <rect id="矩形" opacity="0.40114008" x="0" y="0" width="12" height="12"></rect>
                  <path d="M6.31819805,1.01489719 L10.9851028,5.68180195 C11.1608387,5.85753788 11.1608387,6.14246212 10.9851028,6.31819805 L6.31819805,10.9851028 C6.14246212,11.1608387 5.85753788,11.1608387 5.68180195,10.9851028 C5.50606602,10.8093669 5.50606602,10.5244426 5.68180195,10.3487067 L10.03,6.00009524 L5.68180195,1.6512933 C5.50606602,1.47555736 5.50606602,1.19063312 5.68180195,1.01489719 C5.85753788,0.839161261 6.14246212,0.839161261 6.31819805,1.01489719 Z M1.81819805,1.01489719 L6.48510281,5.68180195 C6.66083874,5.85753788 6.66083874,6.14246212 6.48510281,6.31819805 L1.81819805,10.9851028 C1.64246212,11.1608387 1.35753788,11.1608387 1.18180195,10.9851028 C1.00606602,10.8093669 1.00606602,10.5244426 1.18180195,10.3487067 L5.53,6.00009524 L1.18180195,1.6512933 C1.00606602,1.47555736 1.00606602,1.19063312 1.18180195,1.01489719 C1.35753788,0.839161261 1.64246212,0.839161261 1.81819805,1.01489719 Z" id="形状结合" fill="#666666"></path>
              </g>
          </g>
        </svg>
      </div>
    </div>
    <div class="vdatetime-calendar__month">
      <div class="vdatetime-calendar__month__weekday" v-for="weekday in weekdays" :key="weekday">{{ weekday }}</div>
      <div class="vdatetime-calendar__month__day" :key="i" v-for="(day, i) in days" @click="selectDay(day)" :class="{'vdatetime-calendar__month__day--selected': day.selected, 'vdatetime-calendar__month__day--disabled': day.disabled, 'vdatetime-calendar__month__day--notCurrDay': day.flag !== 'curr' }">
        <span><span>{{ pad(day.number) }}</span></span>
      </div>
    </div>
    <div class="vdatetime-calendar__button">
      <span class="button_text" @click="setDateTime">今天</span>
      <!-- <span class="button_text">时间</span> -->
    </div>
  </div>
</template>

<script>
import { DateTime } from 'luxon'
import { monthDayIsDisabled, monthDays, months, weekdays, pad } from './util'

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
      default: null
    },
    disabled: {
      type: Array
    },
    minDate: {
      type: DateTime,
      default: null
    },
    maxDate: {
      type: DateTime,
      default: null
    },
    weekStart: {
      type: Number,
      default: 0
    }
  },

  data () {
    return {
      newDate: DateTime.fromObject({ year: this.year, month: this.month,  }),// zone: 'UTC'
      weekdays: weekdays(this.weekStart),
      months: months(),
      pad: pad
    }
  },

  computed: {
    newYear () {
      return this.newDate.year
    },
    newMonth () {
      return this.newDate.month
    },
    monthName () {
      return this.months[this.newMonth - 1]
    },
    days () {
      return monthDays(this.newYear, this.newMonth, this.weekStart).map(days => ({
        number: days.day,
        flag: days.flag,
        selected: days.day && days.flag === 'curr' && this.year === this.newYear && this.month === this.newMonth && this.day === days.day,
        disabled: !days.day || monthDayIsDisabled(this.minDate, this.maxDate, this.newYear, this.newMonth, days.day)
      }))
    }
  },

  methods: {
    selectDay (day) {
      if (day.disabled) {
        return
      }
      if (day.flag === 'prev') {
        this.previousMonth()
      } else if (day.flag === 'next') {
        this.nextMonth()
      }
      this.$emit('change', this.newYear, this.newMonth, day.number)
    },
    previousYear () {
      this.newDate = this.newDate.minus({ year: 1 })
    },
    nextYear () {
      this.newDate = this.newDate.plus({ year: 1 })
    },
    previousMonth () {
      this.newDate = this.newDate.minus({ months: 1 })
    },
    nextMonth () {
      this.newDate = this.newDate.plus({ months: 1 })
    },
    setDateTime () {
      this.newDate = DateTime.local()
      this.$emit('setDateTime', 'currDate')
    }
  }
}
</script>

<style lang="scss">
.vdatetime-calendar__navigation,
.vdatetime-calendar__navigation * {
  box-sizing: border-box;
}

.vdatetime-calendar__navigation {
  height: 40px;
  position: relative;
  line-height: 40px;
  padding: 0 30px;
  width: 100%;
  border-bottom: 1px solid #F5F5F5;
}

.vdatetime-calendar__navigation--previous,
.vdatetime-calendar__navigation--next {
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 16px;
  cursor: pointer;

  &.svg {
    width: 8px;
    height: 13px;

    &.path {
      transition: stroke .3s;
    }
  }

  &:hover svg path {
    // stroke: #888;
  }
}

.vdatetime-calendar__navigation--previous {
  left: 30px;
}

.vdatetime-calendar__navigation--next {
  right: 30px;
}
.vdatetime-calendar__navigation--previous-year {
  left: 14px;
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 18px;
  cursor: pointer;
}

.vdatetime-calendar__navigation--next-year {
  right: 14px;
  position: absolute;
  top: 0;
  padding: 0 5px;
  width: 18px;
  cursor: pointer;
}

.vdatetime-calendar__current--month {
  color: #333;
  font-weight: 600;
  font-size: 12px;
  text-align: center;
  text-transform: capitalize;
}

.vdatetime-calendar__month {
  padding: 10px 16px;
  transition: height .2s;
  height: 224px;
}

.vdatetime-calendar__month__weekday,
.vdatetime-calendar__month__day {
  display: inline-block;
  width: 22px;
  height: 22px;
  line-height: 22px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  margin-right: 8px;
  margin-bottom: 8px;
  color: #333;
  &:nth-child(7n){
    margin-right: 0px;
  }

  & > span {
    display: block;
    width: 100%;
    position: relative;
    height: 0;
    padding: 0 0 100%;
    overflow: hidden;

    & > span {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      border: 0;
      // border-radius: 50%;
      transition: background-color .3s, color .3s;
    }
  }
}

.vdatetime-calendar__month__weekday {
  font-weight: bold;
}

.vdatetime-calendar__month__day:hover > span > span {
  background: #eee;
}

.vdatetime-calendar__month__day--selected {
  & > span > span,
  &:hover > span > span {
    color: #fff;
    background: #548BD7;
    border-radius: 2px;
  }
}

.vdatetime-calendar__month__day--disabled {
  opacity: 0.4;
  cursor: default;

  &:hover > span > span {
    color: inherit;
    background: transparent;
  }
}

.vdatetime-calendar__month__day--notCurrDay{
  opacity: 0.4;
  // &:hover > span > span {
  //   color: inherit;
  //   background: transparent;
  // }
}

.vdatetime-calendar__button{
  height: 40px;
  border-top: 1px solid #F5F5F5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
  .button_text{
    cursor: pointer;
    color: #548BD7;
    font-size: 12px;
  }
}
</style>
