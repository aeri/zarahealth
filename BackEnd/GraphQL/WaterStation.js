const fetch = require('node-fetch');

var retrieveWaterStation = function ({ idWaterStation }, context) {
    const url = `https://www.zaragoza.es/sede/servicio/calidad-agua/${idWaterStation}.json`;

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            return (json);
    });

}

module.exports = {
    retrieveWaterStation: retrieveWaterStation
};
