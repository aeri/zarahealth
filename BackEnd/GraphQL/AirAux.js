var realStations = {
  "stations": [{
      "id": 12,
      "title": "Actur",
      "real": 40,
      "red": "Nacional"

    },
    {
      "id": 1,
      "title": "El Picarral",
      "real": 26,
      "red": "EUROAIRNET"

    },
    {
      "id": 2,
      "title": "Roger de Flor",
      "real": 29,
      "red": "EUROAIRNET"

    },
    {
      "id": 8,
      "title": "Renovales",
      "real": 36,
      "red": "EUROAIRNET"

    },
    {
      "id": 11,
      "title": "Avda de Soria",
      "real": 39,
      "red": "Nacional"

    },
    {
      "id": 10,
      "title": "Centro",
      "real": 38,
      "red": "Nacional"

    },
    {
      "id": 7,
      "title": "Jaime Ferrán",
      "real": 32,
      "red": "Nacional"

    },
    {
      "id": 9,
      "title": "Las Fuentes",
      "real": 37,
      "red": "Nacional"

    }

  ]
}

var gas = {
  "http://es.dbpedia.org/resource/%C3%93xidos_de_nitr%C3%B3geno": "NOx",
  "http://es.dbpedia.org/resource/Di%C3%B3xido_de_azufre": "SO2",
  "http://es.dbpedia.org/resource/Di%C3%B3xido_de_nitr%C3%B3geno": "NO2",
  "http://es.dbpedia.org/resource/Mon%C3%B3xido_de_carbono": "CO",
  "http://es.dbpedia.org/resource/Ozono": "O3",
  "http://es.dbpedia.org/resource/PM10": "PM10",
  "http://es.dbpedia.org/resource/Sulfuro_de_hidr%C3%B3geno": "SH2",
}

var IdToReal = function(id) {

  var arrFound = realStations.stations.filter(function(item) {
    return item.id == id;
  });

  return (arrFound[0].real);

}

var RealToId = function(real) {

  var arrFound = realStations.stations.filter(function(item) {
    return item.real == real;
  });

  return (arrFound[0].id);

}


var listStations = function() {

  var array = [];

  for (var item in realStations.stations) {
    array.push(realStations.stations[item].id);
  }

  return array;

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


var retSta = async function() {

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
  var data = bindings.map(result => ({
    id: result.uri.value,
    label: result.label.value,
    address: result.address.value,
    point: {
			x: result.latitud.value,
			y: result.longitud.value
		}
  }))



  return data;

}





var convertGas = function(id) {
  return (gas[id]);
}

var retrieveStations = function() {

  const fetch = require('node-fetch');
  const stationsUri = 'http://www.zaragoza.es/api/recurso/medio-ambiente/calidad-aire/estacion.json'

  return fetch(stationsUri)
    .then(res => res.json())
    .then(json => {
      return (json)
    });

}



var getStation = function(uri) {

  real = uri.substring(uri.lastIndexOf('/') + 1);
  return RealToId(real);

}

module.exports = {
  IdToReal: IdToReal,
  listStations: listStations,
  convertGas: convertGas,
  retrieveStations: retrieveStations,
  getStation: getStation,
	retSta: retSta
};
