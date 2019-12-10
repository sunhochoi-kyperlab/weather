<template>
  <div id="delete" class="contents">
    <div class="message" v-if="cityList.length === 0">
      <span>No City to Delete</span>
    </div>
    <list v-else>
      <list-item v-for="(city, index) in cityList" :key="index" @click="confirmDelete(city.name, index)">
        <h3>{{ city.name }}, {{ city.adminarea }}</h3>
        <i class="close"></i>
      </list-item>
    </list>
  </div>
</template>

<script>
import { Notice } from 'utils'
import AbstractVue from 'AbstractVue'
import {list, listItem} from 'components/Shared/list'

export default {
  name: DELETE_CITY,
  extends: AbstractVue,
  components: {
    'list': list,
    'list-item': listItem
  },
  computed: {
    cityList () { return this.$store.getters.abstractGet.cityList }
  },
  methods: {
    confirmDelete (city, index) {
      Notice.twoBtnPopup({
        title: 'DELETE',
        content: `Do you really want to delete ${city}?`,
        cancel: () => { console.log('canceled') },
        confirm: () => {
          this.set('deleteCity', index)
          this.set('currentCity', CURRENT_LOCATION)
        }
      })
    }
  }
}
</script>