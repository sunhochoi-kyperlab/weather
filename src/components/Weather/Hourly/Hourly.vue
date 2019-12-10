<template>
  <div class="table" v-if="!isLoading">
    <ol>
      <li :class="{'sel': index === 0}" v-for="(weather, index) in forecast" :key="index">
        <dl>
          <dt>{{ weather.time }}</dt>
          <dd class="icon"><img :src="weather.icon"></dd>
          <dd class="temperature">{{ weather.temp }}</dd>
          <dd class="precipitation"><i></i>{{ weather.pp }}</dd>
        </dl>
      </li>
    </ol>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AbstractVue from 'AbstractVue'
import HourlyWeather from './Weather'

export default {
  name: HOURLY,
  extends: AbstractVue,
  data () {
    return {
      timer: null,
      fixedTime: null,
      realTime: null,
      forecast: []
    }
  },
  computed: mapGetters([
    'isLoading'
  ]),
  methods: {
    request (args) {
      this.HourlyWeather.request({
        lon: this.$route.query.lon,
        lat: this.$route.query.lat,
        tempunit: this.$store.state.tempUnit
      })
    },
    setTimer () {
      if (this.fixedTime === this.realTime) {
        this.request()
      } else {
        this.realTime = new Date().getHours()
        this.timer = setTimeout(this.setTimer, 1000)
      }
    }
  },
  created: function () {
    this.HourlyWeather = new HourlyWeather(this)
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