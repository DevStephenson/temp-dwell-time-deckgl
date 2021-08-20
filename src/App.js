import logo from './logo.svg';
import './App.css';
import DeckGL from '@deck.gl/react';
import {StaticMap} from 'react-map-gl';
import {MapView, FirstPersonView} from '@deck.gl/core';
import { ScatterplotLayer, LineLayer} from '@deck.gl/layers';
import {_MapContext as MapContext, NavigationControl} from 'react-map-gl';


const INITIAL_VIEW_STATE = {
  longitude: -0.41669,
  latitude: 37.7853,
  zoom: 2,
  pitch: 0,
  bearing: 0
};

const NAVIGATION_CONTROL_STYLES = {

}
// Data to be used by the LineLayer
const data = [
  {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]}
];


const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // eslint-disable-line

const views = [
  new MapView({id: 'map', width: '100%', controller: true})
];

 /**
   * Data format:
   * [
   *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
   *   ...
   * ]
   */

  
  const scatterPlotLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/bart-stations.json',
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: d => d.coordinates,
    getRadius: d => Math.sqrt(d.exits),
    getFillColor: d => [255, 140, 0],
    getLineColor: d => [0, 0, 0]
  });

  const layers = [
    scatterPlotLayer
  ];

function App() {

  // new LineLayer({id: 'line-layer', data}),  

  return (
    <div className="App">
      <header className="App-header">
        Hello World
      </header>

      <div className="map-wrapper">
      {/* <DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers}
    >
      <StaticMap mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
    </DeckGL> */}

<DeckGL
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      layers={layers} ContextProvider={MapContext.Provider}
      views={views} getTooltip={({object}) => object && `${object.name}\n${object.address}`}>

<div style={NAVIGATION_CONTROL_STYLES}>
    <NavigationControl />
  </div>

      {/* <MapView id="map" width="50%" controller={true}> */}
        <StaticMap mapStyle="mapbox://styles/mapbox/dark-v9" mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN} />
      {/* </MapView>
      <FirstPersonView width="50%" x="50%" fovy={50} /> */}
    </DeckGL>
      </div>
    </div>
  );
}

export default App;
