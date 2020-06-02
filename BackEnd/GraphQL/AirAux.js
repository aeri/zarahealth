const NodeCache = require("node-cache");
const myCache = new NodeCache();
var gas = {
  "http://es.dbpedia.org/resource/%C3%93xidos_de_nitr%C3%B3geno": "NOx",
  "http://es.dbpedia.org/resource/Di%C3%B3xido_de_azufre": "SO2",
  "http://es.dbpedia.org/resource/Di%C3%B3xido_de_nitr%C3%B3geno": "NO2",
  "http://es.dbpedia.org/resource/Mon%C3%B3xido_de_carbono": "CO",
  "http://es.dbpedia.org/resource/Ozono": "O3",
  "http://es.dbpedia.org/resource/PM10": "PM10",
  "http://es.dbpedia.org/resource/PM-2.5": "PM2.5",
  "http://es.dbpedia.org/resource/Sulfuro_de_hidr%C3%B3geno": "SH2",
}


var searchGas = async function(pollutant) {

  console.log(pollutant);
  const SparqlClient = require('sparql-http-client')

  const endpointUrl = 'http://es.dbpedia.org/sparql'
  const query = `
	PREFIX esdbp: <http://es.dbpedia.org/property/>
	select distinct ?formula
	where {
		<${pollutant}> esdbp:fórmula ?formula .}
		`

  var nai = await new Promise((res, rej) => {
    const client = new SparqlClient({
      endpointUrl
    })
    client.query.select(query).then(stream => {
      result = []
      stream.on('data', row => {
        Object.entries(row).forEach(([key, value]) => {
          result.push(value.value)
        })
      })
      stream.on('error', err => {
        rej(err)
      })
      stream.on('end', err => {
        res(result)
      })
    })
  })


  console.log(nai.slice(-1)[0]);

  return 0;

}


var retrieveStations = async function() {


  var data = myCache.get("airstations");

  if (data == undefined) {

  const SparqlClient = require('sparql-http-client')
  const ParsingClient = require('sparql-http-client/ParsingClient')

  const endpointUrl = 'http://datos.zaragoza.es/sparql'
  const query = `
	PREFIX ssn:<http://vocab.linkeddata.es/datosabiertos/def/medio-ambiente/meteorologia#>
	PREFIX esairq:<http://vocab.linkeddata.es/datosabiertos/def/medio-ambiente/calidad-aire#>
	PREFIX loc:<http://www.w3.org/ns/locn#>
	PREFIX geo:<http://www.w3.org/2003/01/geo/wgs84_pos#>
	select distinct ?uri ?label ?distancia ?via ?trafico ?zona ?address ?latitud ?longitud
	where {
	  ?uri a ssn:Estacion;
	  rdfs:label ?label;
	  esairq:distanciaObstaculos ?distancia;
	  esairq:distanciaVia ?via;
	  esairq:trafico ?trafico;
	  esairq:zona ?zona;
	  loc:address ?address

    optional {
        ?uri geo:geometry ?coordenadas.
            ?coordenadas geo:lat ?latitud;
            geo:long ?longitud.
    }
	}
		`

  const client = new ParsingClient({
    endpointUrl
  })

  // Executing select query
  const bindings = await client.query.select(query);

  // Mapping the result to a new cleaned JSON
  data = bindings.map(result => ({
    id: getStation(result.uri.value),
    title: result.label.value,
    address: result.address.value,
    point: {
      x: result.latitud.value,
      y: result.longitud.value
    }
  }))

  myCache.set("airstations", data, 864000);

}

  return data;

}


var convertGas = function(id) {
  return (gas[id]);
}


var getStation = function(uri) {

  return Number(uri.substring(uri.lastIndexOf('/') + 1));


}

module.exports = {
  convertGas: convertGas,
  getStation: getStation,
  retrieveStations: retrieveStations
};
