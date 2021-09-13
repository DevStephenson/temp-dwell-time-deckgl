import React, { useContext, useEffect } from "react";

//
import "./App.css";
import { makeStyles } from "@material-ui/core/styles";
//
import MapComponent from "./Components/Map";
import TabsTableComponent from "./Components/TabsTable";

import Header from "./Components/header/Header";
// const MapComponent = React.lazy(() => import('./Components/Map'));
// const TabsTableComponent = React.lazy(() => import('./Components/TabsTable'));
import { DataContext } from "./Data.context";

const useStyles = makeStyles((theme) => ({
  selectWrapper: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  filterLabel: {
    fontWeight: 800,
    color: theme.primary,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 200,
  },
  chips: {
    display: "flex",
    flexWrap: "wrap",
    textTransform: "capitalize",
    background: "transparent !important",
  },
  appDetails: {
    display: "flex",
    justifyContent: "space-between",
    paddingLeft: 40,
    paddingRight: 40,
  },
  appDetailsDate: {
    minWidth: 250,
    margin: "20px auto 0",
    position: "absolute",
    top: "110px",
    left: "40px",
    width: "340px",
  },
  appDetailsRecordCount: {
    fontStyle: "italic",
  },
  chip: {
    margin: 2,
    height: 35,
    borderRadius: 30,
    border: "2px solid rgba(0,0,0,.1)",
  },
  noLabel: {
    marginTop: theme.spacing(3),
  },
}));


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
};

function App() {
  const { filterList, onUpdateDataset } = useContext(DataContext);

  useEffect(() => {
    fetchMyData(filterList);
  }, []);

  const fetchMyData = async (filters) => {
    postData("http://localhost:3001/csv", { categoryList: filters }).then(
      (res) => {
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
        onUpdateDataset(resultArr);
      }
    );
  };

  const classes = useStyles();

  return (
    <div className="App">
      <Header />
      {/* <Suspense fallback={<div className="center">
                      <div className="circle">
                        <div className="wave"></div>
                      </div>
                    </div>}> */}

      <div className="topGraph">
        <MapComponent />
      </div>

      <div className="bottomGraph">
        <TabsTableComponent />
      </div>
      {/* </Suspense> */}
    </div>
  );
}

export default App;
