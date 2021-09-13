import React from "react";
import { createTheme } from "@material-ui/core/styles";
import "./rsuite.default.css";
import blue from "@material-ui/core/colors/blue";
import { ThemeProvider } from "@material-ui/core";
import DataContextProvider, { DataContext } from "./Data.context";
import App from './App';

const MAP_INITIAL_VIEW_STATE = {
  longitude: -30.41669,
  latitude: 45.7853,
  zoom: 2,
  minZoom: 1,
  maxZoom: 12,
  pitch: 0,
  bearing: 0,
};

const DATA_INITIAL_CONTEXT_STATE = [];

function Root() {
  const theme = createTheme({
    palette: {
      primary: {
        main: '#005690',
      },
      secondary: {
        main: '#0a191f',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <DataContextProvider dataInitialState={DATA_INITIAL_CONTEXT_STATE} mapInitialState={MAP_INITIAL_VIEW_STATE}>
        <App/>
      </DataContextProvider>
    </ThemeProvider>
  );
}

export default Root;
