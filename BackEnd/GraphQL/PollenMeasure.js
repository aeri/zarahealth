const fetch = require('node-fetch');
var settingsModel = require('../mongo/model/settings.js');
var tracker = require('../tracker.js');
const {
    GraphQLError
} = require('graphql')

//Function to check if pollen is availabe
function isPollenAvailable() {

    return settingsModel.findOne({
        _id: '5ebd8a20934189c057ef873c'
    })
    .then(function (settings) {
        if (!settings.pollen) {
            throw new GraphQLError(`The Data Pollen is not available at the moment`, null, null, null, null, {
                extensions: {
                    code: "UNAVAILABLE",
                }
            });
        }

    });


}

var retrievePollenMeasure = async function ({ startDate, endDate, idPollenMeasure }, context) {
    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen/${idPollenMeasure}.json`;

    await isPollenAvailable();

    tracker.track("retrievePollenMeasure", context);

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

                    for (var i = 0; i < json.observation.length; i++) {
                        const creationDate = new Date(json.observation[i].publicationDate);

                        if (!(creationDate >= startDateISO && creationDate <= endDateISO)) {
                            delete json.observation[i]
                        }
                    }
                }

                return (json);
            }
            else {
                throw new GraphQLError(`The PollenMeasure ${idPollenMeasure} could not found`, null, null, null, null, {
                    extensions: {
                        code: "NOT_FOUND",
                    }
                })
            }

    });

}

var retrieveAllPollenMeasures = async function ({}, context) {
    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen.json`;

    await isPollenAvailable();

    tracker.track("retrieveAllPollenMeasures", context);

    return fetch(url)
        .then(res => res.json())
        .then(json => {
            return json.result;
        });
}

module.exports = {
    retrievePollenMeasure: retrievePollenMeasure,
    retrieveAllPollenMeasures: retrieveAllPollenMeasures,
    isPollenAvailable: isPollenAvailable
};
