<template>
  <div id="search-main">
    <div class="fix-item">
      <input type="text" placeholder="Enter a city Name" v-model="inputVal">
      <button :class="['close', {'dis': disableClearBtn}]" @click="clear" :disabled="disableClearBtn"></button>
      <span :class="['search-bar', {'dis': disableClearBtn}]"></span>
      <button :class="['search', {'dis': disableSearchBtn}]" @click="search" :disabled="disableSearchBtn"></button>
    </div>
  </div>
</template>

<script>
import { VK } from 'utils'
import AbstractVue from 'AbstractVue'

export default {
  name: SEARCH_MAIN,
  extends: AbstractVue,
  data () {
    return {
      inputVal: '',
      inputEl: null
    }
  },
  computed: {
    disableClearBtn () { return this.inputVal.length === 0 },
    disableSearchBtn () { return !/[a-z|A-Z|0-9]{3,}/.test(this.inputVal) }
  },
  methods: {
    clear () {
      this.inputVal = ''
      this.inputEl.focus()
    },
    search () {
      this.route(SEARCH_RESULT, {keyword: this.inputVal})
    }
  },
  mounted: function () {
    this.inputEl = this.$el.querySelector('input')

    window.applicationFramework
    ? this.inputEl.addEventListener('focus', () => {
      VK.show('Enter a city Name', this.inputVal, val => { this.inputVal = val })
    })
    : this.inputEl.addEventListener('blur', () => { this.inputEl.focus() })
    this.inputEl.focus()
  }
}
</script>