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
import CompareArrowsSharpIcon from '@material-ui/icons/CompareArrowsSharp';
import TocSharpIcon from '@material-ui/icons/TocSharp';
import TableChartSharpIcon from '@material-ui/icons/TableChartSharp';

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
    display: 'flex',
    justifyContent: 'flex-end',
    marginRight: '20px'
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
    marginBottom: "12px"
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
}));

const LineChartComponent = React.memo((props) => {
  const { selectedPort, dataSource, handlePortClicked } = props;
  const [isDataLoading, setDataLoading] = useState(true);
  const classes = useStyles();
  const [selected, setSelected] = React.useState(selectedPort || "");
  const [categoryFilter, setCategoryFilter] = React.useState("medianDwell");

  const handleClick = (event, port) => {
    setSelected(port);
    // onUpdateselectedPort(port);
    // console.log("onUpdateselectedPort => ", onUpdateselectedPort);
  };

  const handleChange = (event) => {
    const value = event.target.value;
    console.log("upadte category ", value);
    

    setCategoryFilter(value)

    // setState({
    //   ...state,
    //   [name]: event.target.value,
    // });
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
                {Object.keys(dataSource[0] || {}).map((key) => <option value={key}>{key}</option>)}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className={classes.gridWrapper}>
          <section className={classes.gridWrapperSection}>
            <Typography variant="h1" component="h2">
              <TrendingUpOutlinedIcon style={{ fontSize: 100 }} />
            </Typography>
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
            <Typography variant="h1" component="h2">
              <TrendingDownOutlinedIcon style={{ fontSize: 100 }} />
            </Typography>
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
