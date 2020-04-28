const fetch = require('node-fetch');

var retrievePollenStation = function ({ idPollenStation }, context) {
    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen/${idPollenStation}.json`;

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            return (json);
    });

}
    
module.exports = {
    retrievePollenStation: retrievePollenStation
};

