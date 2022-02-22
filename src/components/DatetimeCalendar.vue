<template>
  <div class="vdatetime-calendar">
    <div class="vdatetime-calendar__navigation">
      <div class="vdatetime-calendar__navigation--previous" @click="previousYear">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
      <div class="vdatetime-calendar__navigation--previous" @click="previousMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
      <div class="vdatetime-calendar__current--month">{{ `${newYear}年` }} &nbsp;&nbsp;{{ `${monthName}月` }}</div>
      <div class="vdatetime-calendar__navigation--next" @click="nextMonth">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
        </svg>
      </div>
      <div class="vdatetime-calendar__navigation--next" @click="nextYear">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 61.3 102.8">
          <path fill="none" stroke="#444" stroke-width="14" stroke-miterlimit="10" d="M56.3 97.8L9.9 51.4 56.3 5"/>
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
      <span class="button_text" @click="setCurrDate">今天</span>
      <span class="button_text">时间</span>
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
    setCurrDate () {
      this.newDate = DateTime.local()
      this.$emit('setCurrDate')
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
  width: 18px;
  cursor: pointer;

  &.svg {
    width: 8px;
    height: 13px;

    &.path {
      transition: stroke .3s;
    }
  }

  &:hover svg path {
    stroke: #888;
  }
}

.vdatetime-calendar__navigation--previous {
  left: 25px;
}

.vdatetime-calendar__navigation--next {
  right: 25px;
  transform: scaleX(-1);
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
    background: #427BFF;
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
    color: #427BFF;
    font-size: 12px;
  }
}
</style>
