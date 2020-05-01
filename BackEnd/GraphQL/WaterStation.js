const fetch = require('node-fetch');
const {
    GraphQLError
} = require('graphql')

var retrieveWaterStation = function ({ startDate, endDate, idWaterStation }, context) {
    const url = `https://www.zaragoza.es/sede/servicio/calidad-agua/${idWaterStation}.json?srsname=wgs84`;

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            if (!Date.parse(startDate) || !Date.parse(endDate)) {

                throw new GraphQLError(`The dates provided are not valid`, null, null, null, null, {
                    extensions: {
                        code: "BAD_REQUEST",
                    }
                })
            }

            if (json.id) {
                if (startDate && endDate) {
                    const startDateISO = new Date(startDate);
                    const endDateISO = new Date(endDate);

                    for (var i = 0; i < json.results.length; i++) {
                        const creationDate = new Date(json.results[i].creationDate);

                        if (!(creationDate >= startDateISO && creationDate <= endDateISO)) {
                            delete json.results[i]
                        }
                    }
                }

                if (json.geometry) {
                    json.geometry.x = json.geometry.coordinates[0];
                    json.geometry.y = json.geometry.coordinates[1];
                }
                return json;
            }
            else {
                throw new GraphQLError(`The WaterStation ${idWaterStation} could not be found`, null, null, null, null, {
                    extensions: {
                        code: "NOT_FOUND",
                    }
                })
            }
            
    });

}

var retrieveAllWaterStations = function (context) {
    const url = `https://www.zaragoza.es/sede/servicio/calidad-agua.json?srsname=wgs84`;
    return fetch(url)
        .then(res => res.json())
        .then(json => {
            for (var i = 0; i < json.result.length; i++) {
                if (json.result[i].geometry) {
                    json.result[i].geometry.x = json.result[i].geometry.coordinates[0];
                    json.result[i].geometry.y = json.result[i].geometry.coordinates[1];
                }
                json.result[i].results = [json.result[i].lastResult];
            }
            
            
            return json.result;
    });
}

module.exports = {
    retrieveWaterStation: retrieveWaterStation,
    retrieveAllWaterStations: retrieveAllWaterStations
};
