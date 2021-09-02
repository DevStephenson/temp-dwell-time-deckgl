import React, { useState } from "react";
import { TableUI } from "./../Table";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TrendingUpOutlinedIcon from "@material-ui/icons/TrendingUpOutlined";
import TrendingDownOutlinedIcon from "@material-ui/icons/TrendingDownOutlined";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CompareArrowsSharpIcon from "@material-ui/icons/CompareArrowsSharp";
import TocSharpIcon from "@material-ui/icons/TocSharp";
import TableChartSharpIcon from "@material-ui/icons/TableChartSharp";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import blue from "@material-ui/core/colors/blue";


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

// TODO
const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 550,
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
    padding: "15px 6px",
    marginBottom: "12px",
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
    padding:0,
    width:'calc(100% - 80px)',
    margin: '0 auto 30px',
    maxWidth: 1440,
  },
  tab : {
    '.Mui-selected' : {
      backgroundColor: "#eeeeee"
    }
  }
}));

const LineChartComponent = React.memo((props) => {
  const { selectedPort, dataSource, handlePortClicked } = props;
  const [isDataLoading, setDataLoading] = useState(true);
  const classes = useStyles();
  const [selected, setSelected] = React.useState(selectedPort || "");
  const [categoryFilter, setCategoryFilter] = React.useState("std");
  const [value, setValue] = React.useState(0);

  const handleClick = (event, port) => {
    setSelected(port);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    setCategoryFilter(value);
  };

  const filterWhitelist = [
    "std",
    "count",
    "medianDwell",
    "minDwell",
    "maxDwell",
    "q25",
    "q75",
  ];

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

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className={classes.root}>
        <div>
          <div className={classes.selectCategoryWrap}>
            <FormControl className={classes.formControl}>
              <Select
                native
                variant="outlined"
                value={categoryFilter}
                onChange={handleChange}
                inputProps={{
                  name: "category",
                  id: "category-native-simple",
                }}
              >
                <option aria-label="None" value="" />
                {Object.keys(dataSource[0] || {})
                  .map((key) => <option value={key}>{mapDataKey(key)}</option>)
                  .filter((opt) => {
                    const isInArr = filterWhitelist.includes(opt.props.value);
                    return isInArr;
                  })}
              </Select>
            </FormControl>
          </div>
        </div>

        <Paper className={classes.root}>
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
              <Typography variant="p" component="p" align="left" style={{ padding:'0 0 20px 0'}}>
                  Top 10
                </Typography>
                {/* <Typography variant="h1" component="h2">
                  <TrendingUpOutlinedIcon style={{ fontSize: 100 }} />
                </Typography> */}
                <TableUI
                  dataSource={[...dataSource]}
                  order="desc"
                  handleClick={handleClick}
                  categoryFilter={categoryFilter}
                  selected={selected}
                  selectPort={handlePortClicked}
                />
              </section>
              <section className={classes.gridWrapperSection}>
              <Typography variant="p" component="p" align="left" style={{ padding:'0 0 20px 0'}}>
                  Bottom 10
                </Typography>
                {/* <Typography variant="h1" component="h2">
                  <TrendingDownOutlinedIcon style={{ fontSize: 100 }} />
                </Typography> */}
                <TableUI
                  dataSource={[...dataSource]}
                  order="asc"
                  handleClick={handleClick}
                  categoryFilter={categoryFilter}
                  selected={selected}
                  selectPort={handlePortClicked}
                />
              </section>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1} className={classes.tabPanel}>
            <TableUI
              dataSource={[...dataSource]}
              order="asc"
              handleClick={handleClick}
              categoryFilter={categoryFilter}
              selected={selected}
              selectPort={handlePortClicked}
            />
          </TabPanel>
        </Paper>
      </div>
    </>
  );
});

LineChartComponent.propTypes = {
  selectedPort: PropTypes.array.isRequired,
  handlePortClicked: PropTypes.func.isRequired,
  selectedPort: PropTypes.object.isRequired,
};

export default LineChartComponent;
