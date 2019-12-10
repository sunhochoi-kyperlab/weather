import {Misc} from 'utils'
import AbstractDataCon from 'AbstractDataCon'

export default class HourlyWeatherData extends AbstractDataCon {
  constructor (vue) {
    super(vue)
    this.host = 'http://fnw2.foreca.com'
    this.path = 'showdata.php'
    this.parameter = {
      format: 'xml/obigo-apr30c',
      ftimes: '1/1m,4/1h'
    }
  }
  request (args) {
    this.parameter.lon = args.lon
    this.parameter.lat = args.lat
    this.parameter.tempunit = args.tempunit
    this.send()
  }
  handle (data) {
    let date = new Date()
    let forecast = []
    let current = {}
    let hourly = data.weather.loc[0].fc

    current.time = 'Now'
    current.temp = `${hourly[0].$.t}°`
    current.icon = require(`assets/icons/${hourly[0].$.s}.png`)
    current.pp = `${hourly[0].$.pp}%`
    forecast.push(current)

    for (let i = 4, max = hourly.length; i < max; i++) {
      let item = {}
      item.time = Misc.hourFormat(hourly[i].$.dt)
      item.temp = `${hourly[i].$.t}°`
      item.icon = require(`assets/icons/${hourly[i].$.s}.png`)
      item.pp = `${hourly[i].$.pp}%`
      forecast.push(item)
    }

    this.vue.forecast = forecast
    this.vue.fixedTime = date.getHours() === 23 ? 0 : date.getHours() + 1
    this.vue.$parent.updated = `Updated: ${Misc.dateFormat(new Date())}`
    this.vue.setTimer()
  }
}
