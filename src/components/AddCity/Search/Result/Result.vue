<template>
  <div id="search-result">
    <div class="fix-item">
      <input type="text" placeholder="Enter a city Name" v-model="inputVal">
      <button :class="['close', {'dis': disableClearBtn}]" @click="clear" :disabled="disableClearBtn"></button>
      <span :class="['search-bar', {'dis': disableClearBtn}]"></span>
      <button :class="['search', {'dis': disableSearchBtn}]" @click="search" :disabled="disableSearchBtn"></button>
    </div>
    <list class="result-list" v-if="Array.isArray(resultList)">
      <list-item v-for="(city, index) in resultList" :key="index" @click="confirmAdd(city)">
        <h3>
          <span>{{city.name}},</span>
          <span v-if="city.adminarea">{{city.adminarea}},</span>
          <span v-if="city.country">{{city.country}}</span>
        </h3>
      </list-item>
    </list>
    <p class="message" v-else>
      No Results Found
    </p>
  </div>
</template>

<script>
import { Notice, VK } from 'utils'
import AbstractVue from 'AbstractVue'
import SR from './SearchResult'
import {list, listItem} from 'components/Shared/list'

export default {
  name: SEARCH_RESULT,
  extends: AbstractVue,
  components: {
    'list': list,
    'list-item': listItem
  },
  data () {
    return {
      inputVal: '',
      inputEl: null,
      resultList: []
    }
  },
  computed: {
    cityList () { return this.$store.getters.abstractGet.cityList },
    disableClearBtn () { return this.inputVal.length === 0 },
    disableSearchBtn () { return !/[a-z|A-Z|0-9]{3,}/.test(this.inputVal) }
  },
  methods: {
    clear () {
      this.inputVal = ''
      this.inputEl.focus()
    },
    search () {
      this.resultList = []
      this.SR.request(this.inputVal)
    },
    confirmAdd (city) {
      if (this.cityList.map(city => { return city.id }).includes(city.id)) {
        Notice.toast('DUPLICATION', `${city.name} is already added.`)
      } else {
        this.set('addCity', city)
        this.set('currentCity', this.cityList.length)
        this.route(NOW)
      }
    }
  },
  created: function () {
    this.SR = new SR(this)
  },
  mounted: function () {
    this.inputEl = this.$el.querySelector('input')
    if (window.applicationFramework) {
      this.inputEl.addEventListener('focus', () => {
        VK.show('Enter a city Name', this.inputVal, val => { this.inputVal = val })
      })
    }
    this.inputVal = this.$route.query.keyword
    this.SR.request(this.inputVal)
  }
}
</script>