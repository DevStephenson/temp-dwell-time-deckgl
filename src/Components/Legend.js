import React, { useContext } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { DataContext } from "../Data.context";
import { makeStyles } from "@material-ui/core/styles";
import Fade from "@material-ui/core/Fade";
import Grow from '@material-ui/core/Grow';

export const LEGEND_COLORS = [
  [55, 83, 94],
  [58, 116, 138],
  [75, 154, 149],
  [94, 171, 139],
  [115, 188, 132],
  [146, 204, 139],
  [190, 221, 165],
  [229, 238, 193],
];
const FILTER_WHITELIST = [
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

export const generateSegments = (arr, colorFilterParam) => {
  const segments = [];
  const totalRecords = arr && arr.length;
  if (totalRecords && totalRecords > 10) {
    const ascSort = (a, b) => a[colorFilterParam] - b[colorFilterParam];
    arr.sort(ascSort);

    const high = Math.ceil(
      (arr[totalRecords - 1] || {})[colorFilterParam] || 0
    );

    // categoryFilter
    const differentiator = Math.ceil(high / LEGEND_COLORS.length);
    let i;
    for (i = 0; i < LEGEND_COLORS.length - 1; i++) {
      const increment = i * differentiator;
      segments.push(increment);
    }

    return segments.reverse();
  }
  return [];
};

const useStyles = makeStyles((theme) => ({
    navigationControl:{
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

const Legend = React.memo((props) => {
  const classes = useStyles();
  const {
    dataset,
    mapSizeFilter,
    onUpdateMapSizeFilter,
    mapColorFilter,
    onUpdateMapColorFilter,
  } = useContext(DataContext);

  const handleColorChange = (event) => {
    const value = event.target.value;
    console.log("handleColorChange ", value);
    onUpdateMapColorFilter(value);
  };

  const handleSizeChange = (event) => {
    const value = event.target.value;
    console.log("handleSizeChange  ", value);
    onUpdateMapSizeFilter(value);
  };

  const legendSegments = generateSegments(dataset, mapColorFilter);

  return (
    <Grow in={legendSegments && legendSegments.length > 0} timeout={1200}>
    <div className="legend-wrapper">
      <h2 style={{ marginBottom: 20 }}>Legend</h2>

      <section className={classes.filterWrap}>
        <p>Color </p>
        <div className={classes.filter}>
          <FormControl>
            <Select
              native
              variant="outlined"
              value={mapColorFilter}
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
              {Object.keys(dataset[0] || {})
                .map((key) => <option value={key}>{mapDataKey(key)}</option>)
                .filter((opt) => {
                  const isInArr = FILTER_WHITELIST.includes(opt.props.value);
                  return isInArr;
                })}
            </Select>
          </FormControl>
        </div>
      </section>

      <section className={classes.chart}>
        {LEGEND_COLORS.map((value, i) =>
          i == 0 ? (
            <div className="legend-key" key={JSON.stringify(value) + i}>
              <p
                className={"legend-key__color"}
                style={{
                  backgroundColor: "rgba(" + value + ", 1)",
                  width: "100px",
                }}
              ></p>
              <p>
                {" "}
                <span className="legend-key-count">{legendSegments[i]} +</span>
              </p>
            </div>
          ) : i == LEGEND_COLORS.length - 1 ? (
            <div className="legend-key" key={JSON.stringify(value) + i}>
              <p
                className={"legend-key__color"}
                style={{
                  backgroundColor: "rgba(" + value + ", 1)",
                  width: "100px",
                }}
              ></p>
              <p>
                {" "}
                <span className="legend-key-count">
                  {legendSegments[i - 1]}
                </span>
              </p>
            </div>
          ) : (
            <div className="legend-key" key={JSON.stringify(value) + i}>
              <p
                className={"legend-key__color"}
                style={{
                  backgroundColor: "rgba(" + value + ", 1)",
                  width: "100px",
                }}
              ></p>
              <p>
                {" "}
                <span className="legend-key-count">
                  {legendSegments[i]} - {legendSegments[i - 1] - 1}
                </span>
              </p>
            </div>
          )
        )}
      </section>

      <hr></hr>

      <section className={classes.filterWrap}>
        <p>Size </p>{" "}
        <div className={classes.filter}>
          <FormControl>
            <Select
              native
              variant="outlined"
              value={mapSizeFilter}
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
              {Object.keys(dataset[0] || {})
                .map((key) => <option value={key}>{mapDataKey(key)}</option>)
                .filter((opt) => {
                  const isInArr = FILTER_WHITELIST.includes(opt.props.value);
                  return isInArr;
                })}
            </Select>
          </FormControl>
        </div>
      </section>
    </div>
    </Grow>
  );
});

Legend.propTypes = {};

export default Legend;
