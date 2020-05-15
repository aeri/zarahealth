var settingsModel = require('../mongo/model/settings.js');
const fetch = require('node-fetch');
const {
    GraphQLError
} = require('graphql')

//Function to check if water data is availabe
function isWaterAvailable() {
    
    return settingsModel.findOne({
        _id: '5ebd8a20934189c057ef873c'
    })
    .then(function (settings) {
        if (!settings.water) {
            throw new GraphQLError(`The Data Water is not available at the moment`, null, null, null, null, {
                extensions: {
                    code: "NOT_FOUND",
                }
            });
        }
        
    });

    
}

var retrieveWaterStation = async function ({ startDate, endDate, idWaterStation }, context) {
    const url = `https://www.zaragoza.es/sede/servicio/calidad-agua/${idWaterStation}.json?srsname=wgs84`;
    await isWaterAvailable();

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
                    json.geometry.x = json.geometry.coordinates[1];
                    json.geometry.y = json.geometry.coordinates[0];
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

var retrieveAllWaterStations = async function (context) {
    await isWaterAvailable();
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
    retrieveAllWaterStations: retrieveAllWaterStations,
    isWaterAvailable: isWaterAvailable
};
