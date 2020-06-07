export function getSummary(
    airRecords,
    waterRecords,
    pollenRecords,
) {

    let summary = [];
    let polenStatus = {
        message: "No hay polen",
        status: 1,
    };
    let waterStatus = {
        message: "Apta",
        status: 1,
    };
    let airStatus = {
        message: "Bajo",
        status: 1,
    };

    //Pollen
    let pollenCounter = [0, 0, 0, 0];

    for (let record of pollenRecords.map((element) => ({
        ...element.observation[0],
    }))) {
        switch (record.value) {
            case 'nulo':
                pollenCounter[0] = pollenCounter[0] + 1;
                break;
            case 'bajo':
                pollenCounter[1] = pollenCounter[1] + 1;
                break;
            case 'alto':
                pollenCounter[3] = pollenCounter[3] + 1;
                break;
            default:
                pollenCounter[2] = pollenCounter[2] + 1;
                break;
        }
    }
    /*
    let biggerPolen = 0;
    for (var i = 0; i < pollenCounter.length; i++) {
        if (pollenCounter[i] > biggerPolen) {
            biggerPolen = pollenCounter[i];
            switch (i) {
                case 0:
                    polenStatus = {
                        message: "Bajo",
                        status: 1,
                    };
                    break;
                case 1:
                    polenStatus = {
                        message: "Bajo",
                        status: 1,
                    };
                    break;
                case 2:
                    polenStatus = {
                        message: "Moderado",
                        status: 2,
                    };
                    break;
                case 3:
                    polenStatus = {
                        message: "Alto",
                        status: 3,
                    };
                    break;
                default:
                    break;
            }
        }
    }*/

    if (pollenCounter[3] > 0) {
        polenStatus = {
            message: "Alto",
            status: 3,
        };
    } else if (pollenCounter[2] > 0) {
        polenStatus = {
            message: "Moderado",
            status: 2,
        };
    } else if (pollenCounter[1] > 0) {
        polenStatus = {
            message: "Moderado",
            status: 2,
        };
    } else {
        polenStatus = {
            message: "Bajo",
            status: 1,
        };
    }


    //Water
    function datediff(first, second) {
        return Math.round((second - first) / (1000 * 60 * 60 * 24));
    }

    let waterRecordsFilt = waterRecords.filter(
        (station) =>
            datediff(
                new Date(station.results[0].creationDate),
                new Date()
            ) <= 365
    );
    for (let result of waterRecordsFilt.map((station) => ({
        ...station.results,
    }))) {
        if (result === "NO APTA PARA EL CONSUMO") {
            waterStatus = {
                message: "No apta",
                status: 3,
            };

        }
    }

    //Air
    let airCounter = [0, 0, 0];

    for (let station of airRecords.map((station) => ({
        ...station,
    }))) {
        let recordsToDisplay = {};
        for (let record of station.records) {
            let currentRecord = recordsToDisplay[record.contaminant];
            if (currentRecord === undefined) {
                recordsToDisplay[record.contaminant] = record;
            } else {
                if (
                    Date.parse(record.date) > Date.parse(currentRecord.date)
                ) {
                    recordsToDisplay[record.contaminant] = record;
                }
            }
        }
        recordsToDisplay = Object.values(recordsToDisplay);

        for (let airStatus of recordsToDisplay.map((airRecord) => ({
            ...airRecord.status,
        }))) {
            switch (airStatus) {
                case 'LOW':
                    airCounter[0] = airCounter[0] + 1;
                    break;
                case 'MEDIUM':
                    airCounter[1] = airCounter[1] + 1;
                    break;
                case 'HIGH':
                    airCounter[2] = airCounter[3] + 1;
                    break;
                default:
                    break;
            }

        }

    }

    if (airCounter[2] > 0) {
        airStatus = {
            message: "Mala calidad",
            status: 3,
        };
    } else if (airCounter[1] > 0) {
        airStatus = {
            message: "Calidad media",
            status: 2,
        };
    } else {
        airStatus = {
            message: "Buena calidad",
            status: 1,
        };
    }


    summary[0] = polenStatus;
    summary[1] = waterStatus;
    summary[2] = airStatus;
    return summary;
}
