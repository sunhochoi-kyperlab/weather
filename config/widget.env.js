const fs = require('fs')
const xml2js = require('xml2js')
const parser = new xml2js.Parser();

const widget = { }

const data = fs.readFileSync('./config/config.xml');
parser.parseString(data, function (err, result) {
  if (result.widget.name) {
    const appName = result.widget.name[0];
    widget.appName = typeof appName == "object" ? appName._ : appName;
  } else {
    widget.appName = 'No title'
  }
  widget.widgetInfo = result.widget;
});

module.exports = widget;
