export function getAlerts(
  waterStation,
  airRecords,
  userAirStation,
  pollenRecords,
  pollenThresholds
) {
  let alerts = [];
  if (waterStation !== undefined && waterStation !== null) {
    if (
      waterStation.results.length > 0 &&
      waterStation.results[0] !== "APTA PARA EL CONSUMO"
    ) {
      alerts.push({
        title: "Agua no apta para el consumo",
        location: waterStation.title,
      });
    }
  }
  if (
    airRecords !== undefined &&
    airRecords !== null &&
    userAirStation !== undefined &&
    userAirStation !== null &&
    userAirStation.thresholds !== undefined &&
    userAirStation.thresholds !== null
  ) {
    const stationRecords = airRecords.find(
      (station) => station.id === userAirStation.id
    ).records;
    let recordsToDisplay = {};
    for (let record of stationRecords) {
      let currentRecord = recordsToDisplay[record.contaminant];
      if (currentRecord === undefined || currentRecord === null) {
        recordsToDisplay[record.contaminant] = record;
      } else {
        if (Date.parse(record.date) > Date.parse(currentRecord.date)) {
          recordsToDisplay[record.contaminant] = record;
        }
      }
    }
    Object.entries(recordsToDisplay).forEach(([contaminant, record]) => {
      const threshold = userAirStation.thresholds.find(
        (element) => element.contaminant === contaminant
      );
      if (
        threshold !== undefined &&
        threshold !== null &&
        record.value > threshold.value
      ) {
        alerts.push({
          title: "Nivel alto de " + contaminant,
          location: userAirStation.title,
        });
      }
    });
  }
  if (pollenThresholds !== undefined && pollenThresholds !== null) {
    for (let record of pollenRecords.map((element) => ({
      ...element.observation[0],
      id: element.id,
    }))) {
      const threshold = pollenThresholds.find(
        (element) => element.id === record.id
      );
      if (
        threshold !== undefined &&
        pollenThresholds !== undefined &&
        pollenThresholds !== null
      ) {
        if (
          threshold.value === "BAJO" &&
          (record.value === "bajo" ||
            record.value === "moderado" ||
            record.value === "alto")
        ) {
          
          alerts.push({
            title: "Nivel de polen de " + record.id,
            location: "Bajo",
          });
        }
        if (
          threshold.value === "MODERADO" &&
          (record.value === "moderado" || record.value === "alto")
        ) {
          alerts.push({
            title: "Nivel de polen de " + record.id,
            location: "Moderado",
          });
        }
        if (threshold.value === "ALTO" && record.value === "alto") {
          alerts.push({
            title: "Nivel de polen de " + record.id,
            location: "Alto",
          });
        }
      }
    }
  }

  return alerts;
}
