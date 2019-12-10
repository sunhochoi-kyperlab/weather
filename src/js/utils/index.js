import popup from 'obigo-js-ui/components/popup'

export class Misc {
  static dateFormat (date) {
    let DD = date.getDate()
    let MMM = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()]
    let HH = (date.getHours() >= 10 ? '' : '0') + date.getHours()
    let MM = (date.getMinutes() >= 10 ? '' : '0') + date.getMinutes()
    return `${DD}-${MMM}, ${HH}:${MM}`
  }
  static hourFormat (date) {
    let d = new Date(date).getHours()
    let type = d >= 12 ? 'PM' : 'AM'
    let hour = d > 12 ? d - 12 : d
    return `${hour === 0 ? 12 : hour}${type}`
  }
  static dayFormat (date) {
    let d = new Date(date).getDay()
    return ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][d]
  }
}

export class Notice {
  static oneBtnPopup (args) {
    let {title, content, confirm} = args
    let _ = popup.show({
      title,
      content,
      buttons: [ { label: args.label || 'OK', onClick: () => { confirm(); _.close() } } ]
    })
  }
  static twoBtnPopup (args) {
    let {title, content, confirm, cancel} = args
    let _ = popup.show({
      title,
      content,
      buttons: [
        { label: args.label || 'OK', onClick: () => { _.confirm() } },
        { label: 'Cancel', onClick: () => { _.cancel() } }
      ]
    })
    _.confirm = () => { confirm(); _.close() }
    _.cancel = () => { cancel(); _.close() }
  }
  static toast (title, content) {
    popup.show({title, content, timeout: 3000})
  }
}

export class VK {
  constructor () {
    this.keypad = null
  }
  static getReady () {
    return new Promise((resolve, reject) => {
      if (window.applicationFramework) {
        console.warn('create VK')
        let app = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
        let link = window.document.createElement('link')
        let js = window.document.createElement('script')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('href', app.getDescriptor().localURI + '../resources/vk-csp/vk.css')
        js.setAttribute('src', app.getDescriptor().localURI + '../resources/vk-csp/vk.js')
        js.setAttribute('type', 'text/javascript')
        window.document.head.appendChild(js)
        window.document.head.appendChild(link)
        js.addEventListener('load', () => {
          try {
            this.keypad = new window.VirtualKeypad()
            resolve()
          } catch (err) {
            console.log(err.message)
            reject(err)
          }
        })
      } else {
        console.warn('no VK')
        resolve()
      }
    })
  }
  static show (placeholder, text, onComplete) {
    this.keypad.container.querySelector('#input_area').placeholder = placeholder
    this.keypad.open({keyType: 1, text, onComplete})
  }
}

export class Geo {
  constructor (vue) {
    this.vue = vue
    this.type = {
      GEOLOCATION_CURRENTPOSITION: 'geolocation_currentPosition'
    }
    this.hasAf = window.applicationFramework
  }
  /* Number */ getId () {
    if (this.hasAf) {
      let application = window.applicationFramework.applicationManager.getOwnerApplication(window.document)
      return application.getDescriptor().id
    }
    return -1
  }
  init (/* Object */ args) {
    // if (this.hasAf) {
    //   window.lbs.init(this.getId(), args.scb, args.ccb, args.ecb)
    // } else {
    //   args.scb()
    // }
    args.scb()
  }
  getCurrentPosition (/* Object */ args) {
    // if (this.hasAf) {
    //   window.lbs.get(this.type.GEOLOCATION_CURRENTPOSITION, null, args.scb, args.ecb)
    // } else {
    //   setTimeout(function () {
    //     args.scb({
    //       coords: {
    //         latitude: 35.424472,
    //         longitude: 139.317261
    //       }
    //     })
    //   }, 500)
    // }
    setTimeout(() => {
      let obj = {
        coords: {
          latitude: this.vue.$store.state.currentGps.latitude,
          longitude: this.vue.$store.state.currentGps.longitude
        }
      }
      args.scb(obj)
    }, 500)
  }
}

export class XHR {
  static setParameter (/* Object */ parameter) {
    return Object.keys(parameter).map(key => {
      return key + '=' + parameter[key]
    }).join('&')
  }
  static request (/* Object */ obj) {
    let option = {
      host: null,
      path: null,
      parameter: null,
      scb: Function,
      ecb: Function,
      tcb: null
    }
    option = Object.assign(option, obj)
    const xhr = new XMLHttpRequest()
    const url = `${option.host}/${option.path}?${this.setParameter(option.parameter)}`
    xhr.open('GET', url, true)

    if (option.tcb) {
      xhr.timeout = TIME_OUT
      xhr.ontimeout = function (e) {
        console.error(e)
        option.tcb(e)
      }
    }
    xhr.onload = function (e) {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          option.scb(xhr.responseText)
        } else if (xhr.status === 404) {
          const $404 = '404 Error\n요청한 페이지 없습니다.'
          console.error($404)
          option.ecb($404)
        } else if (xhr.status === 500) {
          const $500 = '500 Error\nServer Error 입니다.'
          console.error($500)
          option.ecb($500)
        } else {
          option.ecb(xhr.statusText)
        }
      }
    }
    xhr.onerror = function (e) {
      option.ecb(e)
    }
    try {
      xhr.send()
    } catch (error) {
      console.error(error)
      option.ecb(error)
    }

    return xhr
  }
}
