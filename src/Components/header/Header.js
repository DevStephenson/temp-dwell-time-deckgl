import React, { useState, useContext, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { DataContext } from "../../Data.context";

//
import { useTheme } from '@material-ui/core/styles';
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";

import UpdateIcon from "@material-ui/icons/Update";
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { DateRangePicker } from "rsuite";
import moment from "moment";
import DateRangeIcon from "@material-ui/icons/DateRange";
import Fade from "@material-ui/core/Fade";

const CUSTOM_DATE_RANGES = [
  {
    label: "today",
    value: [moment().startOf("day"), moment().endOf("day")],
  },
  {
    label: "yesterday",
    value: [
      moment().startOf(moment().subtract(1, "days")),
      moment().endOf(moment().subtract(1, "days")),
    ],
  },
  {
    label: "last7Days",
    value: [moment().subtract(6, "days").startOf("day"), moment().endOf("day")],
  },
  {
    label: "last 14 Days",
    value: [
      moment().subtract(13, "days").startOf("day"),
      moment().endOf("day"),
    ],
  },
  {
    label: "last 30 Days",
    value: [
      moment().subtract(29, "days").startOf("day"),
      moment().endOf("day"),
    ],
  },
];

const MenuProps = {
  style: {
    top: 80,
    backgroundColor: "rgba(0,0,0,.7)",
    color: "white",
  },
  PaperProps: {
    style: {
      maxHeight: 48 * 4.5 + 8,
      width: 250,
      top: "80px",
    },
  },
};

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

const useStyles = makeStyles((theme, props) => ({
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
    margin: "0 auto",
    position: "absolute",
    left: "50%",
    width: "350px",
    transform: 'translate(-50%, 0)'
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

const AppHeader = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const filterOpt = ["loading", "discharge", "berthing"];
  const { filterList, onUpdateDataset, onUpdateFilterList } = useContext(DataContext);

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
          r[i].group = a.group;
          i++;
          return r;
        }, Object.create(null));
        const resultArr = [];
        Object.keys(mapFormattedData).map((key) => {
          resultArr.push(mapFormattedData[key]);
        });
        console.log("PBS = > ", resultArr);
        onUpdateDataset(resultArr);
      }
    );
  };

  const handleGlobalFilterChange = (event) => {
    onUpdateFilterList(event.target.value);
    fetchMyData(event.target.value);
  };

  return (
    <Fade in={true} timeout={1000}>
    <header className="App-header">
      <figure className="App-Logo">
        <img src="./p44Logo_Circle_Blue.svg" alt="Project 44" />
      </figure>

      
      <div className={classes.appDetailsDate}>
        <DateRangePicker
          placeholder="Select Date Range"
          size="large"
          showWeekNumbers
          appearance="subtle"
          ranges={CUSTOM_DATE_RANGES}
          defaultValue={CUSTOM_DATE_RANGES[3].value}
          renderValue={(value) => {
            return moment(value[0]).format("MMM Do YYYY") + ' - ' + moment(value[1]).format('MMM Do YYYY');
          }}
        />
      </div>

      <div className={classes.selectWrapper}>
        <FormControl className={classes.formControl}>
          <Select
            labelId="mutiple-chip-label"
            id="mutiple-chip"
            multiple
            disableUnderline
            value={filterList}
            onChange={handleGlobalFilterChange}
            input={<Input id="select-multiple-chip" placeholder="filter" />}
            renderValue={(selected) => (
              <div className={classes.chips}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    label={value}
                    className={classes.chip}
                    avatar={
                      value === "berthing" ? (
                        <DirectionsBoatIcon />
                      ) : value === "loading" ? (
                        <UpdateIcon />
                      ) : (
                        <ExitToAppIcon />
                      )
                    }
                    style={{
                      svg: { fill: "currentColor" },
                      color: "white",
                      backgroundColor:
                        value === "berthing"
                          ? theme.palette.primary.dark
                          : value === "loading"
                          ? theme.palette.primary.light
                          : theme.palette.primary.main,
                      color: "white",
                      letterSpacing: ".06285rem",
                      fontWeight: "bold",
                      fontSize: "14px",
                      paddingLeft: 12,
                      paddingRight: 12,
                    }}
                  />
                ))}
              </div>
            )}
            MenuProps={MenuProps}
          >
            {filterOpt.map((name) => (
              <MenuItem key={name} value={name}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </header>
    </Fade>
  );
};

AppHeader.propTypes = {};

export default AppHeader;
