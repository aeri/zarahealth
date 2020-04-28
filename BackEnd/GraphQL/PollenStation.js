var request = require("request-promise");

var retrievePollenStation = function ({ idPollenStation }, context) {
    var body;
    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen/${idPollenStation}.json`;

    return new Promise((resolve, reject) => {
        request(url)
        .then((response) => {
            resolve(JSON.parse(response));
        }).catch((err) => {
            logger.error(err);
        });
    });

}
    
module.exports = {
    retrievePollenStation: retrievePollenStation
};

