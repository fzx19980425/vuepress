export function formatDate(date, format) {
  if (!date) return ''
  if (typeof date === 'string') {
    date = new Date(date)
  }
  if (!isValidDate(date)) return ''

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  format = format.replace(/yyyy/g, year)
  format = format.replace(/MM/g, padZero(month))
  format = format.replace(/dd/g, padZero(day))
  format = format.replace(/HH/g, padZero(hours))
  format = format.replace(/mm/g, padZero(minutes))
  format = format.replace(/ss/g, padZero(seconds))

  return format
}

export function parseDate(dateStr, format) {
  if (!dateStr) return null
  if (typeof dateStr === 'object') return dateStr

  const formatObj = {
    yyyy: 0,
    MM: 0,
    dd: 0,
    HH: 0,
    mm: 0,
    ss: 0
  }

  let date = new Date()
  format.replace(/(yyyy|MM|dd|HH|mm|ss)/g, (match, key) => {
    const index = dateStr.indexOf(match)
    if (index > -1) {
      formatObj[key] = parseInt(dateStr.substr(index, match.length))
    }
  })

  date.setFullYear(formatObj.yyyy)
  date.setMonth(formatObj.MM - 1)
  date.setDate(formatObj.dd)
  date.setHours(formatObj.HH)
  date.setMinutes(formatObj.mm)
  date.setSeconds(formatObj.ss)

  return isValidDate(date) ? date : null
}

export function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime())
}

export function getWeekDays(locale = 'zh-CN') {
  const weekDays = {
    'zh-CN': ['日', '一', '二', '三', '四', '五', '六'],
    'en-US': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  }
  return weekDays[locale] || weekDays['zh-CN']
}

export function getMonthDays(year, month) {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

export function getLastDayOfMonth(year, month) {
  return new Date(year, month + 1, 0).getDay()
}

export function getPrevMonthDays(year, month, firstDay) {
  const prevMonthDays = new Date(year, month, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.unshift(prevMonthDays - i)
  }
  return days
}

export function getNextMonthDays(year, month, lastDay) {
  const days = []
  for (let i = 1; i <= 6 - lastDay; i++) {
    days.push(i)
  }
  return days
}

function padZero(num) {
  return num < 10 ? '0' + num : num
} 