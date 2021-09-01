import React, { useState, useEffect } from "react";
import DeckGL from "@deck.gl/react";
import { StaticMap } from "react-map-gl";
import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import { _MapContext as MapContext, NavigationControl } from "react-map-gl";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { makeStyles } from "@material-ui/core/styles";




import {
  AmbientLight,
  PointLight,
  DirectionalLight,
  LightingEffect,
} from "@deck.gl/core";

// create ambient light source
const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});
// create point light source
const pointLight = new PointLight({
  color: [255, 255, 255],
  intensity: 2.0,
  // use coordinate system as the same as view state
  position: [-125, 50.5, 5000],
});
// create directional light source
const directionalLight = new DirectionalLight({
  color: [255, 255, 255],
  intensity: 1.0,
  direction: [-3, -9, -1],
});
// create lighting effect with light sources
const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight,
  directionalLight,
});
const NAVIGATION_CONTROL_STYLES = {
    position: "absolute", right: 40, top: 20
};

const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // eslint-disable-line

const views = [new MapView({ id: "map", width: "100%", controller: true })];

const useStyles = makeStyles((theme) => ({
    filter: {
      color: "white",
      borderColor: "white",
    },
    filterWrap :{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '10px'
    },
    chart: {
        width:'100%',
        marginTop: '10px',
        marginBottom: '20px'
    },
    icon: {
        fill: 'white',
    },
    select: {
        color: 'white',
        padding: 0,

        '& > select' : {
            paddingTop: '10px',
            paddingBottom: '10px',
        },
        '&:before': {
            borderColor: 'white',
        },
        '&:after': {
            borderColor: 'white',
        },
        '&:not(.Mui-disabled):hover::before': {
            borderColor: 'white',
        },

        svg : {
            color : 'white'
        },

        '&>fieldset' : {
            borderColor: 'white !important'
        }
    },
  }));

const getP44FillColor = (d, filter, segments, colorChart) => {
  let i = 0;

  for (i = 0; i < colorChart.length - 1; i++) {
    if (d[filter] > segments[i]) {
      return colorChart[i];
    }
  }
};

const MapComponent = React.memo(
  ({ selectedPort, dataSource, initialView, onLoad, goToLatLon }) => {
      let layers;
      let plot;
      const classes = useStyles();
    const [isMapLoading, setMapLoading] = useState(true);
    // controls radius
    const [categoryFilter, setCategoryMain] = useState("count");
    // controls color
    const [categoryFilterSub, setCategoryFilterSub] = useState("maxDwell");
    const [tooltipInfo, setTooltipInfo] = useState({});
    const [scatterPlotLayer, setScatterPlotLayer] = useState({});
    
    const handleColorChange = (event) => {
        const value = event.target.value;
        setCategoryFilterSub(value);
      };

      const handleSizeChange = (event) => {
        const value = event.target.value;
        setCategoryMain(value);
      };
    const segments = [];
    const colorChart = [
      [55, 83, 94],
      [58, 116, 138],
      [75, 154, 149],
      [94, 171, 139],
      [115, 188, 132],
      [146, 204, 139],
      [190, 221, 165],
      [229, 238, 193],
    ];

    

    const totalRecords = dataSource.length;

    const ascSort = (a, b) => a[categoryFilterSub] - b[categoryFilterSub];
    dataSource.sort(ascSort);

    const high = Math.ceil(
      (dataSource[totalRecords - 1] || {})[categoryFilterSub] || 0
    );

    // categoryFilter
    const differentiator = Math.ceil(high / colorChart.length);
    let i;
    for (i = 0; i < colorChart.length - 1; i++) {
      const increment = i * differentiator;
      segments.push(increment);
    }

    segments.reverse();
    
    plot = new ScatterplotLayer({
      id: "scatterplot-layer",
      data: dataSource,
      pickable: true,
      opacity: 0.8,
      stroked: true,
      filled: true,
      maxZoom: 16,
      radiusScale: 30,
      radiusMinPixels: 5,
      radiusMaxPixels: 500,
      lineWidthMinPixels: 1,
      getRadius: (d) => d[categoryFilter] * 10,
      getPosition: (d) => d.coordinates,
      getFillColor: (d) =>
        getP44FillColor(d, categoryFilterSub, segments, colorChart),
      getLineColor: (d) =>
        selectedPort.port_un_locode == d.port_un_locode
          ? [220, 20, 60]
          : [0, 0, 0],
          getTooltip: (d) => d && {
            html: `<h2>${d.name}</h2><div>${d.port_un_locode}</div>`,
            style: {
              backgroundColor: '#f00',
              fontSize: '0.8em'
            }
          },
          updateTriggers: {
            getRadius: [categoryFilter],
            getFillColor : [categoryFilterSub]
        }
      //   onHover: (d) => setTooltipInfo(d),
    });

    // setScatterPlotLayer(plot)
    layers = [plot];

    return (
      <div className="map-wrapper">
        <DeckGL
          initialViewState={initialView}
          controller={true}
          layers={layers}
          ContextProvider={MapContext.Provider}
          views={views}
          onLoad={onLoad}
          effects={[lightingEffect]}
        >
          {tooltipInfo.object && (
            <div
              className="map-tooltip"
              style={{
                position: "absolute",
                zIndex: 1,
                pointerEvents: "none",
                left: tooltipInfo.x,
                top: tooltipInfo.y,
              }}
            >
              <h1>{tooltipInfo.object.port_un_locode}</h1>
              <div>Count: {tooltipInfo.object.count}</div>
              <div>
                {categoryFilter}: {tooltipInfo.object[categoryFilter]}
              </div>
              <div>
                {categoryFilterSub}: {tooltipInfo.object[categoryFilterSub]}
              </div>
            </div>
          )}
          <div style={NAVIGATION_CONTROL_STYLES}>
            <NavigationControl />
          </div>

          <MapView id="map" width="100%" height="100%" controller={true}>
            <StaticMap
              mapStyle="mapbox://styles/mapbox/dark-v9"
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            />
          </MapView>
        </DeckGL>
        <div className="legend-wrapper">
          <h2>Legend</h2>
          
          <section className={classes.filterWrap}>
              <p>Color </p>
              <div className={classes.filter}>
            <FormControl>
              <Select
                native
                variant="outlined"
                value={categoryFilterSub}
                onChange={handleColorChange}
                inputProps={{
                  name: "category",
                  id: "category-native-simple",
                  classes: {
                    icon: classes.icon,
                },
                }}
                className={classes.select}
              >
                <option aria-label="None" value="" />
                {Object.keys(dataSource[0] || {}).map((key) => <option value={key}>{key}</option>)}
              </Select>
            </FormControl>
          </div>
              </section>

            <section className={classes.chart}>
          {colorChart.map((value, i) =>
            i == 0 ? (
              <div className="legend-key" key={JSON.stringify(value) + i}>
                <p
                  className={"legend-key__color"}
                  style={{
                    "background-color": "rgba(" + value + ", 1)",
                    width: "100px",
                  }}
                ></p>
                <p>
                  {" "}
                  <span className="legend-key-count">{segments[i]} +</span>
                </p>
              </div>
            ) : i == colorChart.length - 1 ? (
              <div className="legend-key" key={JSON.stringify(value) + i}>
                <p
                  className={"legend-key__color"}
                  style={{
                    "background-color": "rgba(" + value + ", 1)",
                    width: "100px",
                  }}
                ></p>
                <p>
                  {" "}
                  <span className="legend-key-count">{segments[i - 1]}</span>
                </p>
              </div>
            ) : (
              <div className="legend-key" key={JSON.stringify(value) + i}>
                <p
                  className={"legend-key__color"}
                  style={{
                    "background-color": "rgba(" + value + ", 1)",
                    width: "100px",
                  }}
                ></p>
                <p>
                  {" "}
                  <span className="legend-key-count">
                    {segments[i]} - {segments[i - 1] - 1}
                  </span>
                </p>
              </div>
            )
          )}
          </section>

          <section className={classes.filterWrap}>
             <p>Size </p> <div className={classes.filter}>
            <FormControl>
              <Select
                native
                variant="outlined"
                value={categoryFilter}
                onChange={handleSizeChange}
                inputProps={{
                  name: "category",
                  id: "category-native-simple",
                  classes: {
                    icon: classes.icon,
                    },
                }}
                className={classes.select}
              >
                <option aria-label="None" value="" />
                {Object.keys(dataSource[0] || {}).map((key) => <option value={key}>{key}</option>)}
              </Select>
            </FormControl>
          </div>

          </section>

        </div>
      </div>
    );
  }
);

export default MapComponent;
