<template>
  <div id="setting" class="contents">
    <div class="fix-item">
      <p>Please select a unit</p>
    </div>
    <ul class="list">
      <li class="radio list-item">
        <label :for="cel">
          <input type="radio" :id="cel" :value="cel" v-model="selected" />
          <span>℃</span>
        </label>
      </li>
      <li class="radio list-item">
        <label :for="fah">
          <input type="radio" :id="fah" :value="fah" v-model="selected" />
          <span>℉</span>
        </label>
      </li>
      <li class="gps list-item" @click="setLatitude">
        <span>Set Latitude</span>
        <input id="latInput" class="coords" type="number" v-model="lat">
      </li>
      <li class="gps list-item" @click="setLongitude">
        <span>Set Longitude</span>
        <input id="lonInput" class="coords" type="number" v-model="lon">
      </li>
    </ul>
  </div>
</template>

<script>
import { VK } from 'utils'
import AbstractVue from 'AbstractVue'

export default {
  name: SETTING,
  extends: AbstractVue,
  data () {
    return {
      cel: CELSIUS,
      fah: FAHRENHEIT,
      selected: this.$store.state.tempUnit,
      lat: this.$store.state.currentGps.latitude,
      lon: this.$store.state.currentGps.longitude
    }
  },
  methods: {
    setLatitude () {
      VK.show('Enter a Latitude', this.lat, lat => { this.lat = lat })
    },
    setLongitude () {
      VK.show('Enter a Longitude', this.lon, lon => { this.lon = lon })
    }
  },
  mounted: function () {
    let latInput = this.$el.querySelector('#latInput')
    let lonInput = this.$el.querySelector('#lonInput')
    if (window.applicationFramework) {
      latInput.addEventListener('focus', latInput.blur)
      lonInput.addEventListener('focus', lonInput.blur)
    }
  },
  beforeDestroy: function () {
    this.set('tempUnit', this.selected)
    this.set('latitude', this.lat)
    this.set('longitude', this.lon)
  }
}
</script>
