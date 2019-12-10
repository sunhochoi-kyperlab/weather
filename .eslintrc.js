// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  // https://github.com/standard/standard/blob/master/docs/RULES-en.md
  extends: 'standard',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  },
  "globals": {
    TIME_OUT: false,
    NOW: false,
    HOURLY: false,
    DAILY: false,
    DELETE_CITY: false,
    SETTING: false,
    ADD_CITY: false,
    SEARCH_MAIN: false,
    SEARCH_RESULT: false,
    CURRENT_LOCATION: false, 
    FIRST_CITY: false, 
    SECOND_CITY: false, 
    THIRD_CITY: false, 
    FORTH_CITY: false, 
    FIFTH_CITY: false,
    FAHRENHEIT: false,
    CELSIUS: false
  }
}
