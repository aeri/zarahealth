const fetch = require('node-fetch');

var retrievePollenMeasure = function ({ startDate, endDate, idPollenMeasure }, context) {
    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen/${idPollenMeasure}.json`;

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            if (startDate && endDate) {
                const startDateISO = new Date(startDate);
                const endDateISO = new Date(endDate);

                for (var i = 0; i < json.observation.length; i++) {
                    const creationDate = new Date(json.observation[i].publicationDate);

                    if (!(creationDate >= startDateISO && creationDate <= endDateISO)) {
                        delete json.observation[i]
                    }
                }
            }  

            return (json);
    });

}

var retrieveAllPollenMeasures = function (context) {
    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen.json`;
    return fetch(url)
        .then(res => res.json())
        .then(json => {
            return json.result;
        });
}
    
module.exports = {
    retrievePollenMeasure: retrievePollenMeasure,
    retrieveAllPollenMeasures: retrieveAllPollenMeasures
};

