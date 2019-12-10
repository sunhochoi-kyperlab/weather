import {Misc} from 'utils'
import AbstractDataCon from 'AbstractDataCon'

export default class DailyWeatherData extends AbstractDataCon {
  constructor (vue) {
    super(vue)
    this.host = 'http://fnw2.foreca.com'
    this.path = 'showdata.php'
    this.parameter = {
      format: 'xml/obigo-apr30c',
      ftimes: '120/24h/0'
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
    let today = {}
    let daily = data.weather.loc[0].fc

    today.day = 'Today'
    today.highTemp = `${daily[0].$.tx}°`
    today.lowTemp = `${daily[0].$.tn}°`
    today.icon = require(`assets/icons/${daily[0].$.s}.png`)
    forecast.push(today)

    for (let i = 1, max = daily.length; i < max; i++) {
      let item = {}
      item.day = Misc.dayFormat(daily[i].$.dt)
      item.highTemp = `${daily[i].$.tx}°`
      item.lowTemp = `${daily[i].$.tn}°`
      item.icon = require(`assets/icons/${daily[i].$.s}.png`)
      forecast.push(item)
    }

    this.vue.forecast = forecast
    this.vue.fixedTime = date.getHours() === 23 ? 0 : date.getHours() + 1
    this.vue.$parent.updated = `Updated: ${Misc.dateFormat(new Date())}`
    this.vue.setTimer()
  }
}
