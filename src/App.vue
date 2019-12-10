<template>
  <div id="app">
    <gnb-area />
    <lnb-area />
    <router-view />
    <div class="overlay" v-if="isLoading">
      <div class="loader">
        <div class="spinner"></div>
        <p class="text">Loading...</p>
      </div>
    </div>
  </div>
</template>

<script>
import { VK } from 'utils'
import AbstractVue from 'AbstractVue'
import GnbArea from 'components/GnbArea'
import LnbArea from 'components/LnbArea'

export default {
  name: 'home',
  extends: AbstractVue,
  components: {
    'gnb-area': GnbArea,
    'lnb-area': LnbArea
  },
  computed: {
    isLoading () {
      return this.$store.getters.isLoading
    }
  },
  methods: {
    getCityList () {
      if (window.localStorage.hasOwnProperty('foreca-weather-cityList')) {
        let cityList = JSON.parse(window.localStorage.getItem('foreca-weather-cityList'))
        if (Array.isArray(cityList)) this.set('cityList', cityList)
      }
    },
    getGpsCoords () {
      const lat = window.localStorage.getItem('foreca-lat')
      const lon = window.localStorage.getItem('foreca-lon')
      if (lat && lon) {
        this.set('latitude', lat)
        this.set('longitude', lon)
      }
    }
  },
  mounted: function () {
    VK.getReady().then(() => {
      this.getCityList()
      this.getGpsCoords()
      this.route(NOW)
    })
  }
}
</script>

<style lang="scss">
@import 'styles/main';
</style>