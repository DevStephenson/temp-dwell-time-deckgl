import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { _MapContext as MapContext, NavigationControl } from "react-map-gl";
import { mapData } from "../../data/mapdata";

const NAVIGATION_CONTROL_STYLES = {};

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // eslint-disable-line

const views = [new MapView({ id: "map", width: "100%", controller: true })];



/**
  * Data format for map:
  * [
  *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
  *   ...
  * ]
  * 
  * 
  * 
  * {
  *   category: "container POD discharge to gate-out",
  *   departed: "2021-08-12 11:47:00.000",
  *   dwell_d: "7.511111",
  *   name: "Put In Bay",
  *   port_un_locode: "NLRTM",
  *   week: "2021-08-09 00:00:00.000",
  *   latitude: "41.65",
  *   longitude: "-82.816667"
  *   ...
  * ]
  * 
  *
  */

const formatMapData = () => {
  const list = [];
  const dataStringLines = mapData.split(/\r\n|\n/);
  const headers = dataStringLines[0].split(
    /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
  );

  for (let i = 1; i < dataStringLines.length; i++) {
    const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
    if (headers && row.length == headers.length) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        let d = row[j];
        if (d.length > 0) {
          if (d[0] == '"') d = d.substring(1, d.length - 1);
          if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
        }
        if (headers[j]) {
          obj[headers[j]] = d;
        }
      }

      // remove the blank rows
      if (Object.values(obj).filter((x) => x).length > 0) {
        if (obj[`Name`] !== "" && obj[`Longitude`] && obj[`Latitude`]) {
          const newObj = {
            name: obj.Name,
            count: obj.Count,
            coordinates: [parseFloat(obj.Longitude), parseFloat(obj.Latitude)],
            dwell_d: obj[`Median Dwell (days)`],
          };
          list.push(newObj);
        }
      }
      
    }
  }
  return list;
};

// Highest Dwell Time
// const maxDwellDays = Math.max.apply(Math, list.map(function(o) { return o[`Median Dwell (days)`]; }))

const MapComponent = React.memo((props) => {
  const [formattedScatterPlotData, setMapData] = useState([]);
  const [isMapLoading, setMapLoading] = useState(true);

  const INITIAL_VIEW_STATE = {
    longitude: -0.41669,
    latitude: 37.7853,
    zoom: 2,
    pitch: 0,
    bearing: 0,
  };

  console.time("Loading Map Data");
  const mapDataFormatted = formatMapData();
  // const mapDataFormatted = [];
  console.timeEnd();

  const colorChart = [
    [229, 238, 193],
    [146, 204, 187],
    [255, 196, 34],
    [58, 116, 138],
    [55, 83, 94],
  ];

  const scatterPlotLayer = new ScatterplotLayer({
    id: "scatterplot-layer",
    data: mapDataFormatted,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 50,
    radiusMinPixels: 5,
    radiusMaxPixels: 500,
    lineWidthMinPixels: 0,
    getRadius: (d) => d.count * 10,
    getPosition: (d) => d.coordinates,
    getFillColor: (d) =>
      d.dwell_d < 0.5
        ? colorChart[4]
        : d.dwell_d < 1
        ? colorChart[3]
        : d.dwell_d < 1.5
        ? colorChart[2]
        : d.dwell_d < 2
        ? colorChart[1]
        : colorChart[0],
    getLineColor: (d) => [0, 0, 0],
  });

  const layers = [scatterPlotLayer];

  return (
    <div className="map-wrapper">
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        ContextProvider={MapContext.Provider}
        views={views}
        getTooltip={({ object }) => object && `${object.name} ${object.count}`}
      >
        <div style={NAVIGATION_CONTROL_STYLES}>
          <NavigationControl />
        </div>

        <MapView id="map" width="50%" height="50%" controller={true}>
          <StaticMap
            mapStyle="mapbox://styles/mapbox/dark-v9"
            mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
          />
        </MapView>
      </DeckGL>
    </div>
  );
});

export default MapComponent;
