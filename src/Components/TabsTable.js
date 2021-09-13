import React, { useContext } from "react";

import { TableUI } from "./table/Table";
import { DataContext } from "../Data.context";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@material-ui/icons/TrendingDownOutlined";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CompareArrowsSharpIcon from "@material-ui/icons/CompareArrowsSharp";
import TocSharpIcon from "@material-ui/icons/TocSharp";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import blue from "@material-ui/core/colors/blue";
import TabPanel from './TabPanel';


const FILTER_WHITELIST = [
  "std",
  "count",
  "medianDwell",
  "minDwell",
  "maxDwell",
  "q25",
  "q75",
];

//
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  gridLoader : {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 480,
    flex: "1",
  },
  selectCategoryWrap: {
    display: "flex",
    justifyContent: "flex-end",
    marginRight: "40px",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  gridWrapper: {
    display: "flex",
  },
  gridWrapperSection: {
    flex: "1",
    padding: "15px 6px 0",
    marginBottom: "0px",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  tabWrapper : {
    width:'calc(100% - 80px)',
    maxWidth: 1400,
    margin: '0 auto'
  },
  tabPanel : {
    backgroundColor: "#eeeeee",
    borderRadius: '0 6px 6px',
    background: 'linear-gradient(to top, rgba(0,0,0,0.2) 0px, rgba(0,0,0,0.2) 1px, rgba(0,0,0,0.1) 1px, rgba(0,0,0,0) 100% );',
    borderLeft: '1px solid rgba(144,144,144,.2)',
    borderTop: '1px solid rgba(255,255,255,.6)',
    boxShadow: '0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)',
    padding:0,
    width:'calc(100% - 80px)',
    margin: '-1px auto 30px',
    maxWidth: 1440
  },
  tab : {
    '.Mui-selected' : {
      backgroundColor: "#eeeeee"
    }
  }
}));

const TabsTableComponent = React.memo((_props) => {
  const theme = useTheme();
  const classes = useStyles();
  const [categoryFilter, setCategoryFilter] = React.useState("std");
  const [value, setValue] = React.useState(0);
  const {
    dataset,
    selectedPort,
  } = useContext(DataContext);

  const mapDataKey = (key) => {
    switch (key) {
      case "std":
        return "Standard Deviation";
      case "count":
        return "Containers";
      case "medianDwell":
        return "Median Dwell ( days )";
      case "minDwell":
        return "Min Dwell ( days )";
      case "maxDwell":
        return "Max Dwell ( days )";
      case "q25":
        return "Quantile 25% Dwell ( days )";
      case "q75":
        return "Quantile 75%  Dwell ( days )";
      default:
        return key;
        break;
    }
  };


  // Local
  const handleCategoryFilterChange = (event) => {
    const value = event.target.value;
    setCategoryFilter(value);
  };

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <div className="animate__fadeIn">
      {dataset && dataset.length < 1 ? <div className={classes.gridLoader}><div class="dot-flashing"></div></div> : <div className={classes.root}>
        <div>
          <div className={classes.selectCategoryWrap}>
            <FormControl className={classes.formControl}>
              <Select
                native
                variant="outlined"
                value={categoryFilter}
                onChange={handleCategoryFilterChange}
                inputProps={{
                  name: "category",
                  id: "category-native-simple",
                }}
              >
                <option aria-label="None" value="" />
                {Object.keys(dataset[0] || {})
                  .map((key) => <option value={key}>{mapDataKey(key)}</option>)
                  .filter((opt) => {
                    const isInArr = FILTER_WHITELIST.includes(opt.props.value);
                    return isInArr;
                  })}
              </Select>
            </FormControl>
          </div>
        </div>

        <Paper className={classes.paper} elevation={0}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            indicatorColor={blue[800]}
            textColor={blue[900]}
            className={classes.tabWrapper}
          >
            <Tab
              label=""
              icon={<CompareArrowsSharpIcon style={{ fontSize: 40 }} className={classes.tab} />}
            />
            <Tab
              label=""
              icon={<TocSharpIcon style={{ fontSize: 40 }} className={classes.tab} />}
            />
          </Tabs>

          <TabPanel value={value} index={0} className={classes.tabPanel}>
            <div className={classes.gridWrapper}>
              <section className={classes.gridWrapperSection}>
              <Typography variant="p" component="p" align="left" style={{ padding:'0 0 20px 0', display: 'flex', alignItems: 'center' }}>
              <TrendingUpOutlinedIcon style={{ fontSize: 22, marginLeft: 10, marginRight: 30, color: theme.palette.success.main  }} /> Top 10
                </Typography>
                <TableUI
                  dataset={[...dataset]}
                  order="desc"
                  categoryFilter={categoryFilter}
                  selected={selectedPort}
                  hasLimit={true}
                  limit={10}
                  showPagination={false}
                />
              </section>
              <section className={classes.gridWrapperSection}>
              <Typography variant="p" component="p" align="left" style={{ padding:'0 0 20px 0', display: 'flex', alignItems: 'center'}}>
              <TrendingDownOutlinedIcon style={{ fontSize: 22, marginLeft: 10, marginRight: 30, color: theme.palette.error.main }} /> Bottom 10
                </Typography>
                <TableUI
                  dataset={[...dataset]}
                  order="asc"
                  categoryFilter={categoryFilter}
                  selected={selectedPort}
                  hasLimit={true}
                  limit={10}
                  showPagination={false}
                />
              </section>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} className={classes.tabPanel}>
            <TableUI
              dataset={[...dataset]}
              order="asc"
              categoryFilter={categoryFilter}
              selected={selectedPort}
              limit={10}
              showPagination={true}
            />
          </TabPanel>
        </Paper>
      </div>}
    </div>
  );
});

TabsTableComponent.propTypes = {};

export default TabsTableComponent;
