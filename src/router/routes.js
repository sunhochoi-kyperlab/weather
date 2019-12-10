const weatherComponent = r => require(['components/Weather'], r)
const nowComponent = r => require(['components/Weather/Now'], r)
const dailyComponent = r => require(['components/Weather/Daily'], r)
const hourlyComponent = r => require(['components/Weather/Hourly'], r)
const addCityComponent = r => require(['components/addCity'], r)
const deleteCityComponent = r => require(['components/DeleteCity'], r)
const settingComponent = r => require(['components/Setting'], r)
const searchComponent = r => require(['components/AddCity/Search/Main'], r)
const resultComponent = r => require(['components/AddCity/Search/Result'], r)

const routes = [
  {
    path: '/',
    component: weatherComponent,
    children: [{path: `/${NOW}`, name: NOW, component: nowComponent}]
  },
  {
    path: '/',
    component: weatherComponent,
    children: [{path: `/${DAILY}`, name: DAILY, component: dailyComponent}]
  },
  {
    path: '/',
    component: weatherComponent,
    children: [{path: `/${HOURLY}`, name: HOURLY, component: hourlyComponent}]
  },
  {
    path: `/${ADD_CITY}`,
    name: ADD_CITY,
    component: addCityComponent,
    children: [
      {path: SEARCH_MAIN, name: SEARCH_MAIN, component: searchComponent},
      {path: SEARCH_RESULT, name: SEARCH_RESULT, component: resultComponent}
    ]
  },
  {
    path: `/${DELETE_CITY}`,
    name: DELETE_CITY,
    component: deleteCityComponent
  },
  {
    path: `/${SETTING}`,
    name: SETTING,
    component: settingComponent
  }
]

export default routes
