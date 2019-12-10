<template />

<script>
import { Geo, Notice } from 'utils'
import AbstractVue from 'AbstractVue'
import LocationInfo from './LocationInfoByGps'

export default {
  extends: AbstractVue,
  data () {
    return {
      retry: 0
    }
  },
  computed: {
    appInit () { return this.$router.history.stack.length === 1 },
    cityList () { return this.$store.getters.abstractGet.cityList }
  },
  methods: {
    getCurrentLocationInfo () {
      this.spin()
      this.Geo.getCurrentPosition({
        scb: geo => {
          this.LocationInfo.request({
            lon: geo.coords.longitude,
            lat: geo.coords.latitude
          })
        },
        ecb: this.gpsErrorHandle
      })
    },
    gpsErrorHandle () {
      this.despin()
      this.$parent.init = false
      this.$parent.requiresGps = false
      this.retry < 3
      ? Notice.twoBtnPopup({
        title: 'GPS ERROR',
        content: 'GPS Unavailable.\nWould you like to retry?',
        label: 'Retry',
        cancel: () => { this.appInit ? this.globalBack() : this.localBack() },
        confirm: () => { this.retry += 1; this.getCurrentLocationInfo() }
      })
      : this.cityList.length > 0
        ? Notice.oneBtnPopup({
          title: 'GPS FAILED',
          content: 'GPS Unavailable! Display the next city.',
          confirm: () => { this.set('currentCity', FIRST_CITY) }
        })
        : Notice.twoBtnPopup({
          title: 'GPS FAILED',
          content: 'GPS Unavailable!\nWould you like to add city?',
          cancel: () => { this.appInit ? this.globalBack() : this.localBack() },
          confirm: () => { this.replace(ADD_CITY) }
        })
    }
  },
  created: function () {
    this.Geo = new Geo(this)
    this.LocationInfo = new LocationInfo(this)
  },
  beforeMount: function () {
    if (!window.lbs.getWs()) {
      this.Geo.init({
        scb: s => {
          console.info('websocket - opened')
          this.getCurrentLocationInfo()
        },
        ecb: e => {
          console.error('websocket - error')
          console.error(e)
        },
        ccb: c => {
          console.warn('websocket - closed')
          console.warn(c)
        }
      })
    } else {
      this.getCurrentLocationInfo()
    }
  }
}
</script>