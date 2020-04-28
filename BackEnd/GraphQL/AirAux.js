
var realStations = {
	"stations": [
	{
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

var IdToReal = function (id) {

	var arrFound = realStations.stations.filter(function(item) {
  	return item.id == id;
});

	return (arrFound[0].real);

}

var RealToId = function (real) {

	var arrFound = realStations.stations.filter(function(item) {
  	return item.real == real;
});

	return (arrFound[0].id);

}


var list = function () {

	var array = [];

	for(var item in realStations.stations){
		array.push(realStations.stations[item].id);
}

return array;

}


var searchGas = async function (pollutant) {

	console.log (pollutant);
	const SparqlClient = require('sparql-http-client')

	const endpointUrl = 'http://es.dbpedia.org/sparql'
	const query =`
	PREFIX esdbp: <http://es.dbpedia.org/property/>
	select distinct ?formula
	where {
		<${pollutant}> esdbp:fórmula ?formula .}
		`

  var nai = await new Promise((res,rej)=>{
	const client = new SparqlClient({ endpointUrl })
	client.query.select(query).then(stream=>{
		result = []
		stream.on('data', row => {
		  Object.entries(row).forEach(([key, value]) => {
		    result.push(value.value)
		  })
		})
		stream.on('error', err => {
		  rej(err)
		})
		stream.on('end', err=>{
		  res(result)
		})
	})
  })


console.log(nai.slice(-1)[0]);

return 0;

}


var convertGas = function (id) {
	return (gas[id]);
}

var retrieveAll = function (){

const fetch = require('node-fetch');
const stationsUri = 'http://www.zaragoza.es/api/recurso/medio-ambiente/calidad-aire/estacion.json'

return fetch(stationsUri)
    .then(res => res.json())
    .then(json => {
			return (json)
		});

}



var getStation = function (uri){

	real = uri.substring(uri.lastIndexOf('/') + 1);
	return RealToId(real);

}

module.exports = {
    IdToReal: IdToReal,
		list:list,
		convertGas:convertGas,
		retrieveAll: retrieveAll,
		getStation: getStation
};
