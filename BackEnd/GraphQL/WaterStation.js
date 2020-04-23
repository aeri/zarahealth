var request = require("request-promise");

var retrieveWaterStation = function ({ idWaterStation }, context) {
    var body;
    const url = `https://www.zaragoza.es/sede/servicio/calidad-agua/${idWaterStation}.json`;

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
    retrieveWaterStation: retrieveWaterStation
};

