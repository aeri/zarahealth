const SparqlClient = require('sparql-http-client')
const AirAux = require('./AirAux.js');
const ParsingClient = require('sparql-http-client/ParsingClient')
var _ = require('underscore');
const transformation = require('transform-coordinates')
const transform = transformation('EPSG:23030', 'EPSG:4326')

const endpointUrl = 'http://datos.zaragoza.es/sparql'

async function execute(since, until) {
  const query = `
  PREFIX ssn:<http://purl.oclc.org/NET/ssnx/ssn#>
  PREFIX dul:<http://www.loa-cnr.it/ontologies/DUL.owl#>
  PREFIX ssnext:<http://vocab.linkeddata.es/datosabiertos/def/medio-ambiente/calidad-aire/ssn-ext#>
  select distinct ?magnitud ?estacion ?fecha ?valor ?verif
  where {
    ?uri a ssn:Observation;
    ssn:observedBy ?estacion;
    ssn:observationResult ?res;
    ssn:observedProperty ?magnitud;
    ssnext:observationStatus ?verif;
    ssn:observationResultTime ?fecha.
    ?res ssn:hasValue/dul:hasDataValue ?valor.

    filter  (

      ?fecha>="${since}"^^xsd:dateTime
      and ?fecha<"${until}"^^xsd:dateTime
      and regex(?uri, "horaria")
    )
  }
    order by ?magnitud ?estacion DESC(?fecha)`

  const client = new ParsingClient({
    endpointUrl
  })

  // Executing select query
  const bindings = await client.query.select(query);

  // Mapping the result to a new cleaned JSON
  var data = bindings.map(result => ({
    contaminant: AirAux.convertGas(result.magnitud.value),
    station: AirAux.getStation(result.estacion.value),
    date: result.fecha.value,
    value: result.valor.value
  }))

  // Grouping the result by station
  var output = _.groupBy(data, f => {
    return f.station
  });

  return output;

}



var retrieveAllAirStations = async function(context) {

  // To retrieve the actual status from today until tomorrow
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)

  // Reset the today and tomorrow days
  today.setUTCHours(0, 0, 0, 0);
  tomorrow.setUTCHours(0, 0, 0, 0);

  // Retrieve the results
  var output = await execute(today.toISOString(), tomorrow.toISOString());

  // Retrieving information about the air stations
  var stationsData = await AirAux.retrieveStations();

  var keys = Object.keys(output)


  var o = [] // empty Object
  // For each station in data retrieved
  keys.forEach(function(key) {
    // Fetch the object about the "key" station
    var arina = _.where(stationsData.result, {
      id: Number(key)
    });
    // Inject in stationsData the pollution records about this station
    arina[0].records = output[key];

    // Converting UTM zone 30N coordinates to GPS standard
    var gps = transform.forward({
      x: arina[0].geometry.coordinates[0],
      y: arina[0].geometry.coordinates[1]
    })

    arina[0].geometry = {
      "x": gps.y,
      "y": gps.x
    };

    // Adding the processed station to the list
    o.push(arina[0]);
  })
  return o;

}



var retrieveAirStation = async function({
  idAirStation,
  since,
  until
}, context) {

  console.log(await AirAux.retSta());


  var output = await execute(since, until);

  var stationsData = await AirAux.retrieveStations();

  // Fetch the object about the "idAirStation" station
  var arina = _.where(stationsData.result, {
    id: Number(idAirStation)
  });
  // Inject in stationsData the pollution records about this station
  arina[0].records = output[idAirStation];

  // Converting UTM30 coordinates to GPS standard
  var gps = transform.forward({
    x: arina[0].geometry.coordinates[0],
    y: arina[0].geometry.coordinates[1]
  })

  arina[0].geometry = {
    "x": gps.y,
    "y": gps.x
  };

  return (arina[0]);

}

module.exports = {
  retrieveAllAirStations: retrieveAllAirStations,
  retrieveAirStation: retrieveAirStation
};
