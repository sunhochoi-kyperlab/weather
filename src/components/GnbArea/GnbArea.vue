<template>
  <nav class="gnb">
    <ul class="gnb_li">
      <li class="back" @click="globalBack"></li>
      <li class="home" @click="goHome"></li>
    </ul>
  </nav>
</template>

<script>
import AbstractVue from 'AbstractVue'

export default {
  name: 'gnb',
  extends: AbstractVue,
  methods: {
    goHome () {
      this.setItems()
      window.applicationFramework
      ? window.applicationFramework.applicationManager.getOwnerApplication(window.document).home()
      : console.log('call: applicationManager.getOwnerApplication(window.document).home()')
    }
  }
}
</script>
