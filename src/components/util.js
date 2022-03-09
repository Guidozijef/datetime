import { DateTime, Info } from 'luxon'

export function capitalize (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function datetimeFromISO (string) {
  const datetime = DateTime.fromISO(string).setZone('local')//.toUTC()

  return datetime.isValid ? datetime : null
}

export function monthDays (year, month, weekStart) {
  let prevMonthDate = DateTime.local(year, month - 1, 1)
  if (month === 1) {
    prevMonthDate = DateTime.local(year - 1, 12, 1)
  }
  const prevSumDay = prevMonthDate.daysInMonth
  const monthDate = DateTime.local(year, month, 1)
  let firstDay = monthDate.weekday - weekStart

  if (firstDay < 0) {
    firstDay += 7
  }
  let lastDay = (weekStart - monthDate.weekday - monthDate.daysInMonth) % 7
  if (lastDay < 0) {
    lastDay += 7
  }

  return Array.apply(null, Array(42)) //monthDate.daysInMonth + firstDay + lastDay + 7
    // .map((value, index) => (index + 1 <= firstDay || index >= firstDay + monthDate.daysInMonth) ? null : (index + 1 - firstDay)
    // )
    .map((value, index) => {
      if (index + 1 - firstDay < 1) {
        return {
          day: prevSumDay + (index + 1 - firstDay),
          flag: 'prev'
        }
      } else if ((index + 1 - firstDay) > monthDate.daysInMonth) {
         return {
           day: (index + 1 - firstDay) - monthDate.daysInMonth,
           flag: 'next'
         }
      } else {
        return {
          day: (index + 1 - firstDay),
          flag: 'curr'
        }
      }
    })
}

export function monthDayIsDisabled (minDate, maxDate, year, month, day) {
  const date = DateTime.fromObject({ year, month, day,  }) // zone: 'UTC'

  minDate = minDate ? startOfDay(minDate.setZone('UTC', { keepLocalTime: true })) : null
  maxDate = maxDate ? startOfDay(maxDate.setZone('UTC', { keepLocalTime: true })) : null

  return (minDate && date < minDate) ||
         (maxDate && date > maxDate)
}

export function monthIsDisabled (minDate, maxDate, year, month) {
  return (minDate && minDate > DateTime.utc(year, month, DateTime.utc(year, month).daysInMonth)) ||
         (maxDate && maxDate < DateTime.utc(year, month, 1))
}

export function yearIsDisabled (minDate, maxDate, year) {
  const minYear = minDate ? minDate.year : null
  const maxYear = maxDate ? maxDate.year : null

  return (minYear && year < minYear) ||
         (maxYear && year > maxYear)
}

export function timeComponentIsDisabled (min, max, component) {
  return (min !== null && component < min) ||
         (max !== null && component > max)
}

export function weekdays (weekStart) {
  if (--weekStart < 0) {
    weekStart = 6
  }

  let weekDays = Info.weekdays('narrow').map(weekday => capitalize(weekday)) // "narrow", "short", "long".
  weekDays = weekDays.concat(weekDays.splice(0, weekStart))
  return weekDays
}

export function months () {
  return Info.months('numeric').map(month => capitalize(month)) //  "numeric", "2-digit", "narrow", "short", "long"
}

export function hours (step = 1) {
  return Array.apply(null, Array(Math.ceil(24 / step))).map((item, index) => index * step)
}

export function minutes (step = 1) {
  return Array.apply(null, Array(Math.ceil(60 / step))).map((item, index) => index * step)
}

export function years (current) {
  return Array.apply(null, Array(201)).map((item, index) => current - 100 + index)
}

export function pad (number) {
  return number < 10 ? '0' + number : number
}

export function startOfDay (datetime) {
  return datetime.startOf('day')
}
