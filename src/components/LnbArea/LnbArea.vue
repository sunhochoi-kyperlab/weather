<template>
  <list class="lnb" :class="{'invisible': isAddCity}">
    <list-item :class="{'sel': pageName === routes[0].to}" @click="route(routes[0].to)">{{ routes[0].name }}</list-item>
    <list-item :class="{'sel': pageName === routes[1].to}" @click="route(routes[1].to)">{{ routes[1].name }}</list-item>
    <list-item :class="{'sel': pageName === routes[2].to}" @click="route(routes[2].to)">{{ routes[2].name }}</list-item>
    <list-item :class="{'sel': pageName === routes[3].to}" @click="route(routes[3].to)">{{ routes[3].name }}</list-item>
    <list-item :class="{'sel': pageName === routes[4].to}" @click="route(routes[4].to)">{{ routes[4].name }}</list-item>
    <list-item :class="{'sel': pageName === routes[5].to}" @click="route(routes[5].to)">{{ routes[5].name }}</list-item>
  </list>
</template>

<script>
import AbstractVue from 'AbstractVue'
import {list, listItem} from 'components/Shared/list'

export default {
  name: 'lnb',
  extends: AbstractVue,
  components: {
    'list': list,
    'list-item': listItem
  },
  data () {
    return {
      pageName: null,
      isAddCity: false
    }
  },
  computed: {
    cityList () { return this.$store.getters.abstractGet.cityList },
    routes () {
      return [
        {to: NOW, name: 'Now'},
        {to: HOURLY, name: 'Hourly'},
        {to: DAILY, name: 'Daily'},
        {to: ADD_CITY, name: `Add City (${this.cityList.length}/5)`},
        {to: DELETE_CITY, name: 'Delete City'},
        {to: SETTING, name: 'Setting'}
      ]
    }
  },
  watch: {
    $route (to, from) {
      this.pageName = to.name
      this.isAddCity = to.matched.some(record => record.name === ADD_CITY)
    }
  }
}
</script>