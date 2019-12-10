<template>
  <div :id="view" class="contents">
    <div class="updated">
      {{ updated }}
    </div>
    <div class="info-area" v-touch:swipe="onSwipe">
      <p class="location" 
        :class="{
          'mark': isCurrentLocation && !isLoading,
          'comma': location.name && location.adminarea
        }">
        <span>{{ location.name }}</span>
        <span>{{ location.adminarea }}</span>
      </p>
      <router-view />
    </div>
    <div class="indicator">
      <i :class="{'sel': isCurrentLocation}" />
      <i :class="{'sel': currentCity === city}" v-for="city in cityList.length" :key=city />
    </div>
    <current-location-info v-if="requiresGps" />
  </div>
</template>

<script>
import AbstractVue from 'AbstractVue'
import CurrentLocationInfo from './CurrentLocationInfo'

export default {
  name: 'weather',
  extends: AbstractVue,
  components: {
    'current-location-info': CurrentLocationInfo
  },
  data () {
    return {
      init: false,
      view: null,
      requiresGps: false,
      updated: null,
      location: {name: null, adminarea: null}
    }
  },
  computed: {
    isLoading () { return this.$store.getters.isLoading },
    cityList () { return this.$store.getters.abstractGet.cityList },
    currentCity () { return this.$store.getters.abstractGet.currentCity },
    isCurrentLocation () { return this.currentCity === CURRENT_LOCATION }
  },
  watch: {
    currentCity () { this.fetchData() }
  },
  methods: {
    fetchData (loc) {
      this.location.name = null
      this.location.adminarea = null
      this.isCurrentLocation
      ? this.requiresGps = true
      : loc = this.cityList[this.currentCity - 1]

      if (loc) {
        let params = { index: this.currentCity }
        let query = { lon: loc.lon, lat: loc.lat }
        this.location.name = loc.name
        this.location.adminarea = loc.adminarea
        this.init
        ? this.$router.replace({params, query})
        : this.$router.push({params, query})
        this.init = false
      }
    },
    onSwipe (e) {
      switch (e.direction) {
        case 2: this.onSwipeLeft(); break
        case 4: this.onSwipeRight(); break
      }
    },
    onSwipeLeft () {
      let isLast = this.currentCity === this.cityList.length
      this.set('currentCity', isLast ? CURRENT_LOCATION : this.currentCity + 1)
    },
    onSwipeRight () {
      let isFirst = this.isCurrentLocation
      this.set('currentCity', isFirst ? this.cityList.length : this.currentCity - 1)
    }
  },
  beforeRouteEnter: function (to, from, next) {
    next(vm => {
      vm.view = to.name
      vm.init = true
      vm.fetchData()
    })
  }
}
</script>