import React, { useContext, useState } from "react";
//
import DeckGL from "@deck.gl/react";
import { MapView } from "@deck.gl/core";
import { ScatterplotLayer } from "@deck.gl/layers";
import {
  StaticMap,
  _MapContext as MapContext,
  NavigationControl,
  Popup,
} from "react-map-gl";
//
import { makeStyles } from "@material-ui/core/styles";
import { DataContext } from "../Data.context";
import Typography from "@material-ui/core/Typography";
import CircularProgress from '@material-ui/core/CircularProgress';
import Fade from "@material-ui/core/Fade";

//
import Legend, { generateSegments, LEGEND_COLORS } from "./Legend";
//
const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN; // eslint-disable-line
const SCATTER_PROPS = {
  id: "scatterplot-layer",
  pickable: true,
  opacity: 0.8,
  stroked: true,
  filled: true,
  maxZoom: 16,
  radiusScale: 100,
  radiusMinPixels: 4,
  radiusMaxPixels: 1000,
  lineWidthMinPixels: 2,
  getPosition: (d) => d.coordinates,
};
const views = [new MapView({ id: "map", width: "100%", controller: true })];

const MAP_STYLE_SATELITE = "mapbox://styles/drew44/cktb0x1h40a4w17le5972dlzk";
const MAP_STYLE_MINIMAL_NO_LBL =
  "mapbox://styles/drew44/cktb17cxy08s317negu6d8nai";
// const MAP_STYLE_LIGHT = 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json';
// const MAP_STYLE_DARK = 'mapbox://styles/mapbox/dark-v9';
const MAP_STYLE_MONOCHROME = "mapbox://styles/drew44/cktbpec8o0xzd17le9oxftfeu";
const useStyles = makeStyles((theme) => ({
  navigationControl: {
    position: "absolute",
    right: "60px",
    bottom: 120,
  },
  filter: {
    color: "white",
    borderColor: "white",
    paddingLeft: 20,
  },
  filterWrap: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  chart: {
    width: "100%",
    marginTop: "10px",
    marginBottom: "20px",
  },
  icon: {
    fill: "white",
  },
  select: {
    color: "white",
    padding: 0,

    "& > select": {
      paddingTop: "10px",
      paddingBottom: "10px",
    },
    "&:before": {
      borderColor: "white",
    },
    "&:after": {
      borderColor: "white",
    },
    "&:not(.Mui-disabled):hover::before": {
      borderColor: "white",
    },

    svg: {
      color: "white",
    },

    "&>fieldset": {
      borderColor: "white !important",
    },
  },
  popUp: {
    textAlign: "left",
  },
  popUpSection: {
    span: {
      fontWeight: "bold",
      marginLeft: 20,
    },
  },
}));

const MapComponent = React.memo(({ onLoad }) => {
  const classes = useStyles();
  const { dataset, mapViewState, selectedPort, mapSizeFilter, mapColorFilter } =
    useContext(DataContext);

  const [isLoading, setIsLoading] = useState(true)
  const legendSegments = generateSegments(dataset, mapColorFilter);

  const showMap = () => {
    setIsLoading(false)
  }
  const plot = new ScatterplotLayer({
    ...SCATTER_PROPS,
    data: dataset,
    getRadius: (d) => d[mapSizeFilter],
    getFillColor: (d) => {
      for (let i = 0; i < LEGEND_COLORS.length - 1; i++) {
        if (d[mapColorFilter] > legendSegments[i]) {
          return LEGEND_COLORS[i];
        }
      }
    },
    autoHighlight: true,
    // highlightedObjectIndex: (d) => indexOf(selectedPort, dataset),
    getLineColor: (d) =>
      selectedPort.port_un_locode === d.port_un_locode
        ? [220, 20, 60]
        : [0, 0, 0],

    updateTriggers: {
      getRadius: mapSizeFilter,
      getFillColor: mapColorFilter,
      getLineColor: selectedPort,
    },
    transitions: {
      getRadius: 1000,
      getFillColor: 500,
      selectedPort: 1000,
    },
  });

  const layers = [plot];

  const getHoverTooltip = ({ object }) =>
  object && {
    html: `<p><b>${object.name}</b></p><div>${object.port_un_locode}</div>`,
    style: {
      backgroundColor: "rgba(0,0,0,.5)",
      borderRadius: 5,
      fontSize: "0.8em",
    },
  };

  return (
    <>
        <div className="map-wrapper animate__fadeIn">
        <Fade in={isLoading || ( !!(legendSegments || []).length < 1  )} timeout={1000}>
         <div className="map-loader">
              <div className="content">
              <div className="inner_content">
                    <div className="center">
                      <div className="number">44</div>
                      <div className="circle">
                        <div className="wave"></div>
                      </div>
                    </div>
                </div>
              </div>
          </div>
          </Fade>

          <DeckGL
            initialViewState={mapViewState}
            controller={{scrollZoom : false, inertia : 1000}}
            layers={layers}
            getTooltip={getHoverTooltip}
            ContextProvider={MapContext.Provider}
            views={views}
            onLoad={showMap}
          >
            {selectedPort && selectedPort.coordinates ? (
              <Popup
                className="map-pop-up"
                closeOnClick={true}
                longitude={selectedPort.coordinates[0]}
                latitude={selectedPort.coordinates[1]}
              >
                <div className={classes.popUp}>
                  <Typography
                    variant="h4"
                    component="h3"
                    align="left"
                    style={{ padding: "0 0 20px 0" }}
                  >
                    {selectedPort.name}
                    <small style={{ fontSize: 14, marginLeft: 10 }}>
                      {selectedPort.port_un_locode}
                    </small>
                  </Typography>
                  <section className={classes.popUpSection}>
                    {/* <p>State, Country</p> */}
                    <p>
                      <span>Standard Deviation</span>{" "}
                      {selectedPort.std.toFixed(2)}
                    </p>
                  </section>

                  <section className={classes.popUpSection}>
                    <p>
                      <span>Median Dwell</span>{" "}
                      {selectedPort.medianDwell.toFixed(2)}
                    </p>
                    {/* <p>
                  <span>Standard Deviation</span> {selectedPort.std.toFixed(2)}
                </p> */}
                  </section>
                </div>
              </Popup>
            ) : null}

            <div className={classes.navigationControl}>
              <NavigationControl />
            </div>

            <MapView id="map" width="100%" height="100%" controller={true}>
              <StaticMap
                mapStyle={MAP_STYLE_MONOCHROME}
                mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
              />
            </MapView>
          </DeckGL>

          { isLoading || ( !!(legendSegments || []).length < 1  ) ?  null : <Legend /> }
        </div>
      )
    </>
  );
  //
});

export default MapComponent;
