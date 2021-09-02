import React, { useState, useEffect, useCallback } from "react";
import DeckGL, { FlyToInterpolator, LinearInterpolator } from "deck.gl";

import { createTheme, makeStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";

import "./App.css";
import "./rsuite.default.css";
import MapComponent from "./Components/graphs/Map";
import LineChartComponent from "./Components/graphs/LineChart";
import red from "@material-ui/core/colors/red";
import yellow from "@material-ui/core/colors/yellow";
import gree from "@material-ui/core/colors/green";
import blue from "@material-ui/core/colors/blue";
import { ThemeProvider } from "@material-ui/core";
import Box from '@material-ui/core/Box';
import { DateRangePicker } from 'rsuite';
import UpdateIcon from '@material-ui/icons/Update';
import DirectionsBoatIcon from '@material-ui/icons/DirectionsBoat';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
function App() {
  const MAP_INITIAL_VIEW_STATE = {
    longitude: -20.41669,
    latitude: 45.7853,
    zoom: 2,
    minZoom: 1,
    maxZoom: 12,
    pitch: 0,
    bearing: 0,
  };

 

  const theme = createTheme({
    palette: {
      primary: {
        main: blue[500],
      },
      secondary: {
        main: blue[800],
      },
    },
  });


  const useStyles = makeStyles((theme, props) => ({
    selectWrapper : {
      display:'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    filterLabel: {
      fontWeight: 800,
      color: theme.primary
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    chips: {
      display: "flex",
      flexWrap: "wrap",
      textTransform:'capitalize'
    },
    appDetails : {
      display: "flex",
      justifyContent: "space-between",
      paddingLeft: 40,
      paddingRight: 40
    },
    appDetailsDate : {
      minWidth:300,
      margin: '20px auto 0'
    },
    appDetailsRecordCount : {
      fontStyle: 'italic'
    },
    chip: {
      margin: 2,
      height:35,
      borderRadius: 30
    },
    noLabel: {
      marginTop: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const filterOpt = ["loading", "discharge", "berthing"];
  const [selectedPort, setSelectedPort] = useState({});
  const [formatedMapData, setMapData] = useState([]);
  const [formattedGraphData, setGraphData] = useState([]);
  const [initialViewState, setInitialViewState] = useState(
    MAP_INITIAL_VIEW_STATE
  );
  const transitionInterpolator = new LinearInterpolator(["bearing"]);

  const [filterList, setFilterList] = useState(["discharge", 'loading']);
  const [value, setValue] = React.useState([null, null]);


  const postData = async (url = "", data = {}) => {
    // Default options are marked with *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      mode: "cors", // no-cors, *cors, same-origin
      cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
      // credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: "follow", // manual, *follow, error
      referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
  }

  const fetchMyData = async (filters) => {
    postData("http://localhost:3001/csv", { categoryList: filters }).then(
      (res) => {
        // console.log(data); // JSON data parsed by `data.json()` call

        let i = 0;
        const mapFormattedData = res.reduce(function (r, a) {
          r[i] = r[i] || {};
          r[i] = a.value;
          i++;
          return r;
        }, Object.create(null));
        const resultArr = [];
        Object.keys(mapFormattedData).map((key) => {
          resultArr.push(mapFormattedData[key]);
        });
        console.log("Data ", resultArr);
        setGraphData(resultArr);
        setMapData(resultArr);
      }
    );
  }

  useEffect(() => {
    fetchMyData(filterList);
  }, []);

 
  const getStyles = (name, personName, theme) => {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  const handleChange = (event) => {
    setFilterList(event.target.value);
    fetchMyData(event.target.value);
  };

  const goToLatLon = useCallback((port) => {
    setInitialViewState({
      longitude: port.longitude,
      latitude: port.latitude,
      zoom:3,
      pitch: 0,
      bearing: 0,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }, []);

  // const setMapSelectedPort = useCallback((selectedPort) => {
    
  //   console.log("CB => ", selectedPort);
  //   // setSelectedPort();
  //   setInitialViewState({
  //     longitude: selectedPort.longitude,
  //     latitude: selectedPort.latitude,
  //     zoom: 6,
  //     pitch: 0,
  //     bearing: 0,
  //     transitionDuration: 3000,
  //     transitionInterpolator: new FlyToInterpolator(),
  //   });
  // }, []);

  const setMapSelectedPort = function(){
    console.log('CB')
  }

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <header className="App-header">
          <figure className="App-Logo">
            <img src="./p44Logo_Blue.png" alt="Project 44" />
          </figure>
          <p className={classes.appDetailsDate}><DateRangePicker placeholder="Select Date Range" showWeekNumbers /></p>
          {/* <LocalizationProvider dateAdapter={AdapterDateFns}> */}
      {/* <DateRangePicker
        startText="Check-in"
        endText="Check-out"
        value={value}
        onChange={(newValue) => {
          setValue(newValue);
        }}
        renderInput={(startProps, endProps) => (
          <React.Fragment>
            <TextField {...startProps} />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField {...endProps} />
          </React.Fragment>
        )}
      /> */}
    {/* </LocalizationProvider> */}

          <div className={classes.selectWrapper}>
            {/* <label className={classes.filterLabel}>Filter </label> */}
            <FormControl className={classes.formControl}>
              <Select
                labelId="mutiple-chip-label"
                id="mutiple-chip"
                multiple
                disableUnderline
                value={filterList}
                onChange={handleChange}
                input={<Input id="select-multiple-chip" placeholder="filter" />}
                renderValue={(selected) => (
                  <div className={classes.chips}>
                    {selected.map((value) => (
                      <Chip
                        key={value}
                        label={value}
                        className={classes.chip}
                        avatar={value === "berthing" ? <DirectionsBoatIcon/> : value === "loading" ? <UpdateIcon/> : <ExitToAppIcon/> }
                        style={{ 'svg' : { fill : 'currentColor' }, color: 'white' ,backgroundColor:value === "berthing" ? blue[900] : value === "loading" ? blue[300] : blue[600], color: 'white', letterSpacing:'.06285rem', fontWeight: "bold", fontSize:"14px", paddingLeft: 12, paddingRight:12 }}
                      />
                    ))}
                  </div>
                )}
                MenuProps={MenuProps}
              >
                {filterOpt.map((name) => (
                  <MenuItem
                    key={name}
                    value={name}
                    style={getStyles(name, filterList, theme)}
                  >
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </header>

        {/* <div className={classes.appDetails}>
          <p className={classes.appDetailsDate}><DateRangePicker placeholder="Select Date Range" showWeekNumbers /></p>
          <p className={classes.appDetailsRecordCount}>512,000 Records</p>
        </div> */}
        <div className="topGraph">
          <div className="topGraph--left">
            <MapComponent
              selectedPort={selectedPort}
              dataSource={formatedMapData}
              onLoad={() => {}}
              initialView={initialViewState}
              goToLatLon={setMapSelectedPort}
            />
          </div>
          {/* <div className="topGraph--right">
            New Chart Here ( Polar )
            
          </div> */}
        </div>

        <div className="bottomGraph">
          <LineChartComponent
            selectedPort={selectedPort}
            dataSource={formattedGraphData}
            handlePortClicked={goToLatLon}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
