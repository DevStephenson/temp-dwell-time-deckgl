import React, { useState, useEffect } from "react";
import "./App.css";

// import { dwellTimeCSV } from "./data/dwell_port_times";
import { dwell_times_raw } from "./data/dwell_times";
import { CSVLoader } from "@loaders.gl/csv";
import MapComponent from "./Components/graphs/Map";
import LineChartComponent from "./Components/graphs/LineChart";
import { dwell_times_raw as csv_data } from "./data/dwell_times";


function App() {

  // const [lineChartData, setGridData] = useState([]);

  // const [secret, setSecret] = useState({ value: "", countSecrets: 0 });

  // useEffect(() => {
  //   const gridData = formatGridData();
  
  //   if (!lineChartData) {
  //     setGridData(gridData);
  //     console.log(gridData);
  //     // setGridData(s => ({...s, countSecrets: s.countSecrets + 1}));
  //   }
  // }, [lineChartData]);

  // const formatGridData = () => {
  //   console.log("Firing.. .")
  //   const list = [];
  //   const dataStringLines = csv_data.split(/\r\n|\n/);
  //   const headers = dataStringLines[0].split(
  //     /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
  //   );
  
  //   for (let i = 1; i < dataStringLines.length; i++) {
  //     const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
  //     if (headers && row.length == headers.length) {
  //       const obj = {};
  //       for (let j = 0; j < headers.length; j++) {
  //         let d = row[j];
  //         if (d.length > 0) {
  //           if (d[0] == '"') d = d.substring(1, d.length - 1);
  //           if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
  //         }
  //         if (headers[j]) {
  //           obj[headers[j]] = d;
  //         }
  //       }
  
  //       // remove the blank rows
  //       if (Object.values(obj).filter((x) => x).length > 0) {
  //         if (obj[`Name`] !== "" && obj[`Longitude`] && obj[`Latitude`]) {
  //           const newObj = {
  //             name: obj.Name,
  //             count: obj.Count,
  //             coordinates: [parseFloat(obj.Longitude), parseFloat(obj.Latitude)],
  //             dwell_d: obj[`Median Dwell (days)`],
  //           };
  //           list.push(newObj);
  //         }
  //       }
  //     }
  //   }
  //   const result = list.reduce(function (r, a) {
  //     r[a.port_un_locode] = r[a.port_un_locode] || [];
  //     r[a.port_un_locode].push(a);
  //     return r;
  //   }, Object.create(null));
  //   return result;
  // };


  
 
  // let data;
  // let scatterPlotLayer;
  // const [formattedScatterPlotData, setMapData] = useState([]);
  // const [isMapLoading, setMapLoading] = useState(true);

//   const formatTimeChartData = () => {
//     console.log("running time chrt ");
//     const list = [];
//     const dataStringLines = dwell_times_raw.split(/\r\n|\n/);
//     const headers = dataStringLines[0].split(
//       /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
//     );

//     for (let i = 1; i < dataStringLines.length; i++) {
//       const row = dataStringLines[i].split(
//         /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
//       );
//       if (headers && row.length == headers.length) {
//         const obj = {};
//         for (let j = 0; j < headers.length; j++) {
//           let d = row[j];
//           if (d.length > 0) {
//             if (d[0] == '"') d = d.substring(1, d.length - 1);
//             if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
//           }
//           if (headers[j]) {
//             obj[headers[j]] = d;
//           }
//         }

//         // remove the blank rows
//         if (Object.values(obj).filter((x) => x).length > 0) {
//           // console.log("obj => ", obj);
//           // if (obj[`Port Code`] === "USLAX") {
//           //   console.log("Time obj => ", obj);
//           // }
//           // if(obj[`Name`] !== '' && obj[`Longitude`] && obj[`Latitude`]){
//           //   const newObj = {
//           //     name: obj.Name,
//           //     count: obj.Count,
//           //     coordinates: [parseFloat(obj.Longitude), parseFloat(obj.Latitude)],
//           //     dwell_d: obj[`Median Dwell (days)`],
//           //   };
//           list.push(obj);
//           // }
//         }
//         // Highest Dwell Time
//         // const maxDwellDays = Math.max.apply(Math, mapData.map(function(o) { return o[`Median Dwell (days)`]; }))
//       }
//     }
//     // setMapLoading(false);

//     /*
//     category: "container POD discharge to gate-out"
// departed: "2021-07-02 19:00:00.123"
// dwell_d: "3.000000"
// latitude: "46.4"
// longitude: "-72.383333"
// name: "Port De Becancour"
// port_un_locode: "CAVAN"

//     */
//     const result = list.reduce(function (r, a) {
//       r[a.port_un_locode] = r[a.port_un_locode] || [];
//       r[a.port_un_locode].push(a);
//       return r;
//     }, Object.create(null));

//     console.log(result);

//     return result;
//   };

  // const timeChartDataFormatted = formatTimeChartData();

  return (
    <div className="App">
      <header className="App-header">Hello World</header>
      <div className="topGraph">
        <div className="topGraph--left">
          <MapComponent />
        </div>
        <div className="topGraph--right">Graph Whisker Plot Here</div>
      </div>

      <div className="bottomGraph">
        <LineChartComponent/>
      </div>
    </div>
  );
}

export default App;
