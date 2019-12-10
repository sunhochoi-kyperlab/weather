<template>
  <div class="spot" v-if="!isLoading">
    <div class="img">
      <h2><img :src="weather.icon"></h2>
    </div>
    <div class="temp">
      <h3>{{ weather.temp }}</h3>
      <p>{{ weather.realfeel }}</p>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AbstractVue from 'AbstractVue'
import NowWeather from './Weather'

export default {
  name: NOW,
  extends: AbstractVue,
  data () {
    return {
      timer: null,
      weather: {temp: null, realfeel: null, icon: null}
    }
  },
  computed: mapGetters([
    'isLoading'
  ]),
  methods: {
    request () {
      this.NowWeather.request({
        lon: this.$route.query.lon,
        lat: this.$route.query.lat,
        tempunit: this.$store.state.tempUnit
      })
    },
    setTimer () {
      clearTimeout(this.timer)
      this.timer = setTimeout(this.request, 1000 * 15 * 60)
    }
  },
  created: function () {
    this.NowWeather = new NowWeather(this)
  },
  beforeDestroy: function () {
    clearTimeout(this.timer)
  },
  beforeRouteUpdate: function (to, from, next) {
    if (to.query.lon && to.query.lat) {
      next()
      this.request()
    }
  }
}
</script>
