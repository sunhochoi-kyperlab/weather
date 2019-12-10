<template>
  <div id="add" class="contents full">
    <router-view />
  </div>
</template>

<script>
import store from 'src/store'
import { Notice } from 'utils'
import AbstractVue from 'AbstractVue'

export default {
  name: ADD_CITY,
  extends: AbstractVue,
  created: function () {
    this.replace(SEARCH_MAIN)
  },
  beforeRouteEnter: function (to, from, next) {
    store.getters.abstractGet.cityList.length < 5 ? next()
    : Notice.oneBtnPopup({
      title: 'LIMIT LIST',
      content: 'You can save up to 5 cities.\nDelete one more cities to add new city.',
      confirm: () => { console.log('closed') }
    })
  }
}
</script>