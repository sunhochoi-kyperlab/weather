import * as types from './actionTypes'
export default {
  [types.SWITCH_LOADING_STATE] (state, /* boolean */ value) {
    state.isLoading = value
  },
  [types.ABSTRACT_SET] (state, /* Any */ args) {
    switch (args.action) {
      case 'gpsState':
        state.isGpsAvailable = args.value
        break
      case 'cityList':
        state.cityList = args.value
        break
      case 'currentCity':
        state.currentCity = args.value
        break
      case 'deleteCity':
        state.cityList.splice(args.value, 1)
        break
      case 'addCity':
        state.cityList.push(args.value)
        break
      case 'tempUnit':
        state.tempUnit = args.value
        break
      case 'latitude':
        state.currentGps.latitude = args.value
        break
      case 'longitude':
        state.currentGps.longitude = args.value
        break
    }
  }
}
