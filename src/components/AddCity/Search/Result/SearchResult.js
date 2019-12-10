import AbstractDataCon from 'AbstractDataCon'
import arraySort from 'array-sort'

export default class SearchResult extends AbstractDataCon {
  constructor (vue) {
    super(vue)
    this.host = 'http://feed.foreca.com'
    this.path = 'obigo-apr30c/search.php'
    this.parameter = {
      lang: 'en',
      script: 'ASCII'
    }
  }
  request (q) {
    this.parameter.q = q
    this.send()
  }
  handle (data) {
    let result = data.xml.searchresults[0].loc
    if (result) {
      let resultList = []
      for (var i = 0, max = result.length; i < max; i++) {
        let city = {}
        city.id = result[i].$.id
        city.name = result[i].$.name
        city.adminarea = result[i].$.adm1
        city.country = result[i].$.country
        city.lon = result[i].$.lon
        city.lat = result[i].$.lat
        resultList.push(city)
      }
      this.vue.resultList = arraySort(resultList, ['name', 'adminarea', 'country'])
    } else {
      this.vue.resultList = null
    }
  }
}
