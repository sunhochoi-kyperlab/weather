<script>
export default {
  methods: {
    spin: function () { this.$store.dispatch('switchLoadingState', true) },
    despin: function () { this.$store.dispatch('switchLoadingState', false) },
    route: function (name, query) { this.$router.push({name, query}) },
    replace: function (name, query) { this.$router.replace({name, query}) },
    set: function (action, value) { this.$store.dispatch('abstractSet', {action, value}) },
    globalBack () {
      var appInit = this.$router.history.stack.length === 1
      var currentPage = this.$router.currentRoute.name
      switch (currentPage) {
        case SEARCH_MAIN: appInit ? this.goLauncher() : this.route(NOW); break
        case SEARCH_RESULT: this.route(NOW); break
        default: this.goLauncher()
      }
    },
    localBack () {
      let prevPage = this.$router.history.stack.slice(-1)[0]
      let name = prevPage.name
      let params = prevPage.params
      let query = prevPage.query
      if (params.index && query.lon && query.lat) {
        this.set('currentCity', params.index)
        this.$router.push({name, params, query})
      } else {
        this.$router.back()
      }
    },
    setItems () {
      window.localStorage.setItem('foreca-weather-cityList', JSON.stringify(this.$store.state.cityList))
      // eslint-disable-next-line no-useless-escape
      if (/^(\-?\d+(\.\d+)?)$/.test(this.$store.state.currentGps.latitude)) {
        window.localStorage.setItem('foreca-lat', this.$store.state.currentGps.latitude)
      }
      // eslint-disable-next-line no-useless-escape
      if (/^(\-?\d+(\.\d+)?)$/.test(this.$store.state.currentGps.longitude)) {
        window.localStorage.setItem('foreca-lon', this.$store.state.currentGps.longitude)
      }
    },
    goLauncher () {
      this.setItems()
      if (window.applicationFramework) {
        const app = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
        app.destroyApplication()
        app.back()
      } else {
        console.log('Destroy Application')
      }
    }
  }
}
</script>
