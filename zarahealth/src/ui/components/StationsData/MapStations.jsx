import React, {useEffect, useRef, useState} from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const styles = {
    width: "100%",
    height: "100%",
    position: "absolute"
};

const MapboxGLMap = () => {
    const [map, setMap] = useState(null);
    const mapContainer = useRef(null);

    useEffect(() => {
        mapboxgl.accessToken =
            "pk.eyJ1IjoiamF2aWVybWl4dHVyZSIsImEiOiJjazk0a2ExenAwMXUzM2xueDZzdjA0MmhhIn0.WzvN6ta6Zux2obpUYz_yFw";
        const initializeMap = ({setMap, mapContainer}) => {
            const map = new mapboxgl.Map({
                container: mapContainer.current,
                style: "mapbox://styles/javiermixture/ck7t9nmo415o51iobc79zmu8b", // stylesheet location
                center: [-0.87734, 41.6560593],
                zoom: 11
            });

            map.on("load", () => {
                setMap(map);
                map.resize();
            });
        };

        if (!map) initializeMap({setMap, mapContainer});
    }, [map]);

    return <div ref={el => (mapContainer.current = el)} style={styles}/>;
};

export default MapboxGLMap;
