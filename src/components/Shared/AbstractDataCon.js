import {XHR, Notice} from 'utils'
import xml2js from 'xml2js'

export default class AbstractDataCon {
  constructor (vue) {
    this.vue = vue
    this.host = null
    this.path = null
    this.parameter = null
    this.retry = 0
  }
  send () {
    this.vue.spin()
    XHR.request({
      scb: this.scb,
      ecb: this.ecb,
      tcb: this.tcb,
      host: this.host,
      path: this.path,
      parameter: this.parameter
    })
  }
  get scb () {
    return d => {
      let p = new xml2js.Parser()
      p.parseString(d, (err, result) => {
        err === null
        ? this.handle(result)
        : this.errHandle(err)
        this.vue.despin()
      })
    }
  }
  get ecb () {
    return e => {
      console.error(e)
      let appInit = this.vue.$router.history.stack.length === 1
      this.vue.despin()
      this.retry < 3
      ? Notice.twoBtnPopup({
        title: 'NO NETWORK',
        content: 'Network Unavailable.\nWould you like to retry?',
        label: 'Retry',
        cancel: () => { appInit ? this.vue.globalBack() : this.vue.localBack() },
        confirm: () => { this.retry += 1; this.send() }
      })
      : Notice.oneBtnPopup({
        title: 'RETRY FAILED',
        content: 'You have exceeded 3 attempts.\nPlease restart the application.',
        confirm: () => { this.vue.goLauncher() }
      })
    }
  }
  get tcb () {
    return t => {
      this.vue.despin()
      this.ecb()
    }
  }
  handle (data) { console.log(data) }
  errHandle (err) { console.log(err) }
}
