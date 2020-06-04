import React, {useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import gql from "graphql-tag";
import {useQuery} from "@apollo/react-hooks";

const styles = {
    width: "100%",
    height: "100%",
    position: "absolute"
};

const GET_WATER_STATION = gql`
  {
    retrieveAllWaterStations {
      title
      geometry{
        x
        y
      }
      results {
        result
      }
    }
  }
`;


const WaterStationsMap = () => {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);
    const {loading, data, error} = useQuery(GET_WATER_STATION);

    useEffect(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoiamF2aWVybWl4dHVyZSIsImEiOiJjazk0a2ExenAwMXUzM2xueDZzdjA0MmhhIn0.WzvN6ta6Zux2obpUYz_yFw";

        if (error) {
            const initializeMap = ({setMap, mapContainer}) => {
                const map = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: "mapbox://styles/javiermixture/ck7t9nmo415o51iobc79zmu8b", // stylesheet location
                    center: [-0.87734, 41.6560593],
                    zoom: 11
                });
                var popup = new mapboxgl.Popup({ closeOnClick: false })
                    .setLngLat([-0.87734, 41.6560593])
                    .setHTML('<h2>Datos no disponibles</h2>')
                    .addTo(map);

                map.on("load", () => {
                    setMap(map);
                    map.resize();
                });
            };
            if (!map) initializeMap({setMap, mapContainer});
        }


        if (data && !error) {
            let stations = data.retrieveAllWaterStations.sort((a, b) => a.title.localeCompare(b.title))

            let points = []
            stations.map((station, index) => {

                let recordsHTML = '<ul>';

                for (let result of station.results) {
                    recordsHTML = recordsHTML + "<li>" + result.result +  "</li>";
                }

                recordsHTML = recordsHTML + '</ul>';

                if(station.geometry != null) {
                    points.push(
                        {
                            'type': 'Feature',
                            'geometry': {
                                'type': 'Point',
                                'coordinates': [
                                    station.geometry.x,
                                    station.geometry.y
                                ]
                            },
                            'properties': {
                                'title': station.title,
                                'description': recordsHTML,
                                'icon': 'campsite'
                            }
                        }
                    )
                }
            })

            const initializeMap = ({setMap, mapContainer}) => {
                const map = new mapboxgl.Map({
                    container: mapContainer.current,
                    style: "mapbox://styles/javiermixture/ck7t9nmo415o51iobc79zmu8b",
                    center: [-0.87734, 41.6560593],
                    zoom: 11
                });
                map.on("load", () => {
                    setMap(map);
                    map.resize();
                    map.addSource('points', {
                        'type': 'geojson',
                        'data': {
                            'type': 'FeatureCollection',
                            'features': points
                        }
                    });
                    map.addLayer({
                        'id': 'points',
                        'type': 'symbol',
                        'source': 'points',
                        'layout': {
                            'icon-image': ['concat', ['get', 'icon'], '-15'],
                            'text-field': ['get', 'title'],
                            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                            'text-offset': [0, 0.6],
                            'text-anchor': 'top'
                        }
                    });

                    map.on('click', 'points', function (e) {
                        console.log('LLEGA')
                        var coordinates = e.features[0].geometry.coordinates.slice();
                        var description = e.features[0].properties.description;


                        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                        }

                        new mapboxgl.Popup()
                            .setLngLat(coordinates)
                            .setHTML(description)
                            .addTo(map);
                    });
                });
            };
            if (!map) initializeMap({setMap, mapContainer});
        }
    }, [data, error, loading, map]);

    return (
        <div ref={el => (mapContainer.current = el)} style={styles}>
        </div>
    );


}


export default WaterStationsMap;
