import {Misc} from 'utils'
import AbstractDataCon from 'AbstractDataCon'

export default class NowWeatherData extends AbstractDataCon {
  constructor (vue) {
    super(vue)
    this.host = 'http://fnw2.foreca.com'
    this.path = 'showdata.php'
    this.parameter = {
      format: 'xml/obigo-apr30c',
      ftimes: '1/1m'
    }
  }
  request (args) {
    this.parameter.lon = args.lon
    this.parameter.lat = args.lat
    this.parameter.tempunit = args.tempunit
    this.send()
  }
  handle (data) {
    let weather = data.weather.loc[0].fc[0].$
    this.vue.weather.temp = `${weather.t}°`
    this.vue.weather.realfeel = `Real Feel ${weather.tf}°`
    this.vue.weather.icon = require(`assets/icons/${weather.s}.png`)
    this.vue.$parent.updated = `Updated: ${Misc.dateFormat(new Date())}`
    this.vue.setTimer()
  }
}
