const NodeCache = require("node-cache");
const myCache = new NodeCache();
var secret = require('../Secret.js');
var weather = require('openweather-apis');
weather.setLang('es');
weather.setCity('Zaragoza');
// 'metric'  'internal'  'imperial'
weather.setUnits('metric');
// check http://openweathermap.org/appid#get for get the APPID
weather.setAPPID(secret.openWeatherKey);

var retrieveWeather = async function(context) {

  var wout = myCache.get("weather");

  if (wout == undefined) {

    var wout = await new Promise(function(resolve, reject) {
      weather.getSmartJSON(function(err, JSONObj) {
        if (err) {
          reject(err);
        } else {
          resolve(JSONObj);
        }
      });
    });
    myCache.set("weather", wout, 300);
  }

  return (wout)

}


module.exports = {

  retrieveWeather: retrieveWeather

}
