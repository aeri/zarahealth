const fetch = require('node-fetch');
const {
    GraphQLError
} = require('graphql')

var retrievePollenMeasure = function ({ startDate, endDate, idPollenMeasure }, context) {
    const url = `https://www.zaragoza.es/sede/servicio/informacion-polen/${idPollenMeasure}.json`;

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
