import AbstractDataCon from 'AbstractDataCon'

export default class LocationInfoByGps extends AbstractDataCon {
  constructor (vue) {
    super(vue)
    this.host = 'http://fnw2.foreca.com'
    this.path = 'findloc.php'
    this.parameter = {
      format: 'xml/obigo-apr30c',
      radius: 10,
      lang: 'en'
    }
  }
  request (args) {
    this.parameter.lon = args.lon
    this.parameter.lat = args.lat
    this.send()
  }
  handle (data) {
    if (data.error) {
      this.vue.gpsErrorHandle()
    } else {
      let location = data.searchdata.location[0]
      let locationInfo = {
        name: location.name[0],
        adminarea: location.admin1_code[0],
        lon: location.longitude[0],
        lat: location.latitude[0]
      }
      this.vue.retry = 0
      this.vue.$parent.fetchData(locationInfo)
      this.vue.$parent.requiresGps = false
    }
  }
}
