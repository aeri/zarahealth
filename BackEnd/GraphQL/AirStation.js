const SparqlClient = require('sparql-http-client')
const AirAux = require('./AirAux.js');
const ParsingClient = require('sparql-http-client/ParsingClient')
var _ = require('lodash');

const endpointUrl = 'http://datos.zaragoza.es/sparql'

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

  filter  (?fecha>="2020-04-27"^^xsd:date
  and ?fecha<"2020-04-28"^^xsd:date
  and regex(?uri, "horaria")
)}

order by ?magnitud ?estacion ?fecha`

var retrieveAirStation = async function (context) {
  const client = new ParsingClient({ endpointUrl })
  //console.log (stream);
  const bindings = await client.query.select(query);

  var data = bindings.map(result => ({
   contaminant: AirAux.convertGas(result.magnitud.value),
   station: AirAux.getStation(result.estacion.value),
   date: new Date(result.fecha.value),
   value: result.valor.value
  }))

//var groupedData = _.groupBy(data, f=>{return f.station});



var output = data.reduce((result, item) => {

  // Get station object corresponding to current item from result (or insert if not present)
  var app = result[item.station] = result[item.station] || {};

  // Get contaminant array corresponding to current item from app object (or insert if not present)
  var type = app[item.contaminant] = app[item.contaminant] || [];

  // Add current item to current type array
  type.push(item);

  // Return the result object for this iteration
  return result;

}, {});

  console.log(output)


  //var date = new Date();

  //var formatted = date.toISOString();

  //AirAux.gas(data[1000].s);

  const transformation = require('transform-coordinates')

  const transform = transformation('EPSG:3042', 'EPSG:4326') // WGS 84 to Soldner Berlin

  //console.log(transform.forward({x: 675899.44, y: 4615874.15}))

  var jsaz = await AirAux.retrieveAll();



    return {
      id: AirAux.IdToReal(7),
      title: "asa",
      address: "aas"

    };

}



module.exports = {
    retrieveAirStation: retrieveAirStation
};
