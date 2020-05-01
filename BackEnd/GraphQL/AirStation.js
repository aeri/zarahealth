const SparqlClient = require('sparql-http-client')
const AirAux = require('./AirAux.js');
const ParsingClient = require('sparql-http-client/ParsingClient')
var _ = require('underscore');
const {
  GraphQLError
} = require('graphql')
const NodeCache = require("node-cache");
const myCache = new NodeCache();
var schedule = require('node-schedule');

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

var j = schedule.scheduleJob('*/1 * * * *', function(){
  console.log('Today is recognized by Rebecca Black!');
});



var retrieveAllAirStations = async function(context) {

  // To retrieve the actual status from today until tomorrow
  const today = new Date()
  const tomorrow = new Date(today)
  const yesterday = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  yesterday.setDate(today.getDate() - 1)

  // Reset the today and tomorrow days
  yesterday.setUTCHours(22, 0, 0, 0);
  tomorrow.setUTCHours(0, 0, 0, 0);

  // Retrieve the results
  var output = await execute(yesterday.toISOString(), tomorrow.toISOString());

  var stationsData = myCache.get("airstations");

  if (stationsData == undefined) {

    // Retrieving information about the air stations
    var stationsData = await AirAux.retrieveStations();

    myCache.set("airstations", stationsData, 864000);

  }

  var keys = Object.keys(output)


  var o = [] // empty Object
  // For each station in data retrieved
  keys.forEach(function(key) {
    // Fetch the object about the "key" station
    var arina = _.where(stationsData, {
      id: Number(key)
    });
    arina[0].records = output[key];
    arina[0].geometry = arina[0].point;

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

  if (!Date.parse(since) || !Date.parse(until)) {

    throw new GraphQLError(`The dates provided are not valid`, null, null, null, null, {
      extensions: {
        code: "BAD_REQUEST",
      }
    })

  }

  var output = await execute(since, until);

  var stationsData = myCache.get("airstations");

  if (stationsData == undefined) {

    // Retrieving information about the air stations
    var stationsData = await AirAux.retrieveStations();

    myCache.set("airstations", stationsData, 864000);

  }

  // Fetch the object about the "idAirStation" station
  var arina = _.where(stationsData, {
    id: idAirStation
  });

  if (arina === undefined || arina.length == 0) {
    throw new GraphQLError(`The AirStation ${idAirStation} not found`, null, null, null, null, {
      extensions: {
        code: "NOT_FOUND",
      }
    })
  }

  // Inject in stationsData the pollution records about this station
  arina[0].records = output[idAirStation];
  arina[0].geometry = arina[0].point;

  return (arina[0]);

}

module.exports = {
  retrieveAllAirStations: retrieveAllAirStations,
  retrieveAirStation: retrieveAirStation
};
