import React, { useState, useEffect, useRef } from "react";
// import DeckGL from "@deck.gl/react";
// import { StaticMap } from "react-map-gl";
// import { MapView } from "@deck.gl/core";
// import { ScatterplotLayer } from "@deck.gl/layers";
// import { _MapContext as MapContext, NavigationControl } from "react-map-gl";
// import { dwell_times_raw as csv_data } from "../../data/dwell_times";
import { dwell_times_june_raw as csv_data } from "../../data/dwell_times_june";

import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { Delete as DeleteIcon } from "@material-ui/icons";
import FilterListIcon from "@material-ui/icons/FilterList";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import Moment from "react-moment";
import moment from "moment";
// import { Timeline } from 'vis-timeline';
// import { DataSet } from 'vis-data';
import Timeline from "react-visjs-timeline";

/**
 * Data format for map:
 * [
 *   {name: 'Colma (COLM)', code:'CM', address: '365 D Street, Colma CA 94014', exits: 4214, coordinates: [-122.466233, 37.684638]},
 *   ...
 * ]
 *
 *
 *
 * {
 *   category: "container POD discharge to gate-out",
 *   departed: "2021-08-12 11:47:00.000",
 *   dwell_d: "7.511111",
 *   name: "Put In Bay",
 *   port_un_locode: "NLRTM",
 *   week: "2021-08-09 00:00:00.000",
 *   latitude: "41.65",
 *   longitude: "-82.816667"
 *   ...
 * ]
 *
 *
 */

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// TODO

const headCells = [
  { id: "name", numeric: false, disablePadding: true, label: "Name" },
  {
    id: "port_un_locode",
    numeric: false,
    disablePadding: true,
    label: "Port Code",
  },
  {
    id: "total_timeline",
    numeric: false,
    disablePadding: true,
    label: "Timeline (weeks)",
  },

  // { id: 'dwell_d_total', numeric: true, disablePadding: false, label: 'Dwell Times' },
  // { id: 'total_time', numeric: true, disablePadding: false, label: 'Y' }
];

// Highest Dwell Time
// const result = Math.max.apply(Math, list.map(function(o) { return o[`Median Dwell (days)`]; }))

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all ports" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {


  const classes = useToolbarStyles();
  const { numSelected, selectedArr } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected,
          {selectedArr.map((port_code) => {
            return <div>{port_code}</div>;
          })}
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Port ( Dwell Times )
        </Typography>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
  selectedArr: PropTypes.array.isRequired,
};

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});



const EnhancedTableRow = React.memo((props) => {
  const _timelineOptions = {
    width: '100%',
    // height: '100px',
    clickToUse: true, 
    editable: false,
  }


  const { row, selected, index, handleClick } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const isSelected = (name) => selected.indexOf(name) !== -1;
  const isItemSelected = isSelected((row["value"] || {})["port_un_locode"]);
  const labelId = `enhanced-table-checkbox-${index}`;

  const visJsRef = useRef<HTMLDivElement>(null);
	// const [timelineData, setTimelineData] = React.useState({});
  // const [timelineOptions, setTimelineOptions] = React.useState(_timelineOptions);

  // useEffect(() => {
  //   var timeline = visJsRef.current &&  new Timeline(visJsRef.current, timelineData, timelineOptions);
	// 	// Once the ref is created, we'll be able to use vis
	// }, [visJsRef]);

  

  const generateTimelineRow = (row) => {
    const date = Object.keys(row)[0];
    const times = Object.values(row)[0];
  // console.log("Object, values ", times);

  // let items = new DataSet({ type: { start: 'ISODate', end: 'ISODate'}});
    // let items = new DataSet({ type: { start: 'ISODate', end: 'ISODate' }});
  // const items = [{
  //   start: new Date(2021, 8, 1),
  //   end: new Date(2021, 8, 2),  // end is optional
  //   content: 'Trajectory A',
  // }]

  const groups = [{
    id: 1,
    content: 'Berthing',
  },
  {
    id: 2,
    content: 'Discharge',
    subgroupOrder: "sborder"
  },
  {
    id: 3,
    content: ' Loading',
  }]

  let items = [];
  let i;
  for(i = 0; i < times.length; i++){
    const time = times[i];
    const outObj = {
      id: time.departed + "_" + i,
      start: new Date(time.departed),
      end: moment(time.departed).add(time.dwell_d, 'days').toDate(),
      content: time.category === "container TSP1 discharge to loading" ? "L" : time.category === "container POD discharge to gate-out" ? "D" : "B",
      group: time.category === "container TSP1 discharge to loading" ? "3" : time.category === "container POD discharge to gate-out" ? "2" : "1"
    }
    items.push(outObj);
  }

  // const groups = [
  //   {
  //     id: "a1",
  //     content: "Sergei Action Plan"
  //     /*     subgroupOrder: (a, b) => {
  //       console.log("What are we doing here??");
  //       console.log("A:", a, "B:", b);
  //       let r = 0;
  //       if (a.subgroup === 2) return (r = 1);
  //       if (b.subgroup === 5) return (r = -1);
  //       console.log("Result:", r);
  //       return r;
  //     } */
  //   },
  //   {
  //     id: "a2",
  //     content: "Group 2",
  //     subgroupOrder: "sborder"
  //   }
  // ];
  const options = {
    // editable: {
    //   add: true,
    //   remove: false,
    //   updateGroup: false,
    //   updateTime: true
    // },
    ..._timelineOptions,
    margin: {
      axis: 5,
      item: {
        vertical: 5,
        horizontal: 0
      }
    },
    orientation: {
      axis: "both",
      item: "top"
    },
    start: moment()
      .subtract(120, "days")
      .format(),
    end: moment()
      .add(0, "days")
      .format(),
    stack: false,
    stackSubgroups: false,
    type: "range",
    width: "100%",
    zoomable: true,
    zoomMin: 147600000,
    zoomMax: 51840000000
  };
  // const items = [
  //   {
  //     start: moment()
  //       .subtract(4, "days")
  //       .format(),
  //     end: moment()
  //       .subtract(3, "days")
  //       .format(), // end is optional
  //     content: "Step1",
  //     group: "a1"
  //   },
  //   {
  //     start: moment()
  //       .subtract(3, "days")
  //       .format(),
  //     end: moment().format(), // end is optional
  //     content: "Step2",
  //     group: "a2"
  //   }
  // ];


  // setTimelineData(items);
  // var timeline = visJsRef.current &&  new Timeline(visJsRef.current, items, _timelineOptions);

  // const items2 = [
  //   {id: 1, content: 'item 1', start: '2021-04-20'},
  //   {id: 2, content: 'item 2', start: '2021-04-14'},
  //   {id: 3, content: 'item 3', start: '2021-04-18'},
  //   {id: 4, content: 'item 4', start: '2021-04-16', end: '2021-04-19'},
  //   {id: 5, content: 'item 5', start: '2021-04-25'},
  //   {id: 6, content: 'item 6', start: '2021-04-27'}
  // ]

  // console.log(items);

  //   const timesHTML = times.map((time, index) => {
  //   //   return (<TableRow key={time.departed + index}>
  //   //     <TableCell component="th" scope="row">
  //   //     <Moment format="YYYY/MM/DD hh:mm:s a">{time.departed}</Moment>
  //   //     </TableCell>
  //   //     <TableCell>
  //   //       <Moment format="YYYY/MM/DD">{time.week}</Moment>
  //   //     </TableCell>
  //   //     <TableCell align="right">
  //   //       {time.category}
  //   //     </TableCell>
  //   //     <TableCell align="right">
  //   //       {time.dwell_d}
  //   //     </TableCell>
  //   //   </TableRow>)
  //   // }
  //    return ( <Timeline options={options} initialItems={items} /> )
  //  });
  
    return (<>
    <TableRow key={row.date}>
                          <TableCell component="th" scope="row">
                           
                          <Typography variant="h6" gutterBottom component="div">
                            {date}
                          </Typography>
                          </TableCell>
                        </TableRow>
                        {/* <Timeline options={_timelineOptions} initialItems={items} /> */}
                        <Timeline key={date} options={options} items={items} groups={groups} />
    </>)
  
  }

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.name}
        selected={isItemSelected}
      >
        <TableCell
          padding="checkbox"
          onClick={(event) => handleClick(event, row.value.port_un_locode)}
        >
          <Checkbox
            checked={isItemSelected}
            inputProps={{ "aria-labelledby": labelId }}
          />
        </TableCell>

        <TableCell component="th" id={labelId} scope="row" padding="none">
          {row.value.name}
        </TableCell>
        <TableCell align="left">{row.value.port_un_locode}</TableCell>

        <TableCell align="left">{row.timeline.length}</TableCell>

        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              {/* <Typography variant="h6" gutterBottom component="div">
                Timeline
              </Typography> */}
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    {/* <TableCell>Week</TableCell>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Dwell ( days )</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.timeline &&
                    row.timeline.map((times) => (
                      generateTimelineRow(times)
                      // const date = Object.keys(historyRow)[0]
                      // <>
                      // <TableRow key={Object.keys(times)[0]}>
                      //     <TableCell component="th" scope="row">
                      //       {Object.keys(times)[0]}
                      //     </TableCell>
                      //     <TableCell>
                      //     </TableCell>
                      //     <TableCell align="right">
                      //     </TableCell>
                      //     <TableCell align="right">
                      //     </TableCell>
                      //   </TableRow>
                    
                      // { Object.values(times).map((time, index) => {
                      //   return (<TableRow key={time + index}>
                      //     <TableCell component="th" scope="row">
                      //     <Moment format="YYYY/MM/DD hh:mm:s a">{time.departed}</Moment>
                      //     </TableCell>
                      //     <TableCell>
                      //       <Moment format="YYYY/MM/DD">{time.week}</Moment>
                      //     </TableCell>
                      //     <TableCell align="right">
                      //       {time.category}
                      //     </TableCell>
                      //     <TableCell align="right">
                      //       {time.dwell_d}
                      //     </TableCell>
                      //   </TableRow>)
                      //   })}
                      // </>
                      ))};
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
});

EnhancedTableRow.propTypes = {
  row: PropTypes.object.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
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
  const [isDataLoading, setDataLoading] = useState(true);
  const classes = useStyles();
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [formattedGridData, setGridData] = useState([]);
  const [portList, setPortArray] = useState([]);
  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    async function fetchMyData() {
      const arrayOfPorts = formatTimeChartData();
      setGridData(arrayOfPorts);
    }

    fetchMyData();
  }, []);

  const options: Highcharts.Options = {
    title: {
      text: "My chart",
    },
    series: [
      {
        type: "line",
        data: [1, 2, 3],
      },
    ],
  };

  const formatTimeChartData = () => {
    const list = [];
    const dataStringLines = csv_data.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(
      /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
    );

    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(
        /,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/
      );
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          if (obj.port_un_locode && obj.port_un_locode !== "") {
            list.push(obj);
          }
        }
        // Highest Dwell Time
        // const maxDwellDays = Math.max.apply(Math, mapData.map(function(o) { return o[`Median Dwell (days)`]; }))
      }
    }
    // setMapLoading(false);

    /*
    category: "container POD discharge to gate-out"
departed: "2021-07-02 19:00:00.123"
dwell_d: "3.000000"
latitude: "46.4"
longitude: "-72.383333"
name: "Port De Becancour"
port_un_locode: "CAVAN"

    */
    const result = list.reduce(function (r, a) {
      r[a.port_un_locode] = r[a.port_un_locode] || {};
      r[a.port_un_locode].value = r[a.port_un_locode].value || a;
      r[a.port_un_locode].timeline = r[a.port_un_locode].timeline || [];
      r[a.port_un_locode].timeline.push(a);
      return r;
    }, Object.create(null));

    const arrayOfPorts = Object.entries(result).map((e) => ({
      [e[0]]: e[1],
    }));

    arrayOfPorts.map((port, index, array) => {
      const currPort = port[Object.keys(arrayOfPorts[index])[0]];
      currPort.timeline = groupTimeline(currPort.timeline);
    });

    // console.log("arrayOfPorts 2 => ", arrayOfPorts);
    // const timelineMapped = arrayOfPorts.reduce(function (r, a) {
    //   const currPort = Object.keys(a)[0];

    //   if(currPort==='AEDAS'){
    //     console.log("R => ", r)
    //     console.log("A => ", a)
    //   }

    //   r[currPort] = r[currPort] || {};

    //   r[currPort].timeline = r[currPort].timeline || [];
    //   // r[currPort].timeline.push(a[currPort].timeline);
    //   const grouppedTimeline = groupTimeline([...a[currPort].timeline, r[currPort].timeline]);
    //   const timelineArr = Object.entries(grouppedTimeline).map((e) => ({
    //     [e[0]]: e[1],
    //   }));

    // if(currPort==='AEDAS'){
    //   console.log("Timeline : => ", r[currPort].timeline);
    //   console.log("Timeline Arr : => ", timelineArr);
    // }
    // r[currPort].timeline = grouppedTimeline;

    // if(currPort==='AEDAS'){
    //   console.log(r[currPort].timeline)
    // }

    // console.log("a => ", timeline);
    // const groupedTimeline = groupTimeline(timeline);
    // console.log("r curr => ", r);
    // console.log("port curr => ", a);
    // return r
    // }, Object.create(null));
    // console.log("timelineMapped => ", timelineMapped);
    return arrayOfPorts;
  };

  const groupTimeline = (timelineArr) => {
    const outObj = {};

    let i;
    for (i = 0; i < timelineArr.length; i++) {
      const a = timelineArr[i];
      const formattedWk = moment(a.week).format("MMM-DD-YY");
      outObj[formattedWk] = outObj[formattedWk] || [];
      outObj[formattedWk].push({
        week: a.week,
        category: a.category,
        dwell_d: a.dwell_d,
        departed: a.departed,
        port_un_locode: a.port_un_locode,
      });
    }

    const outObjtArray = Object.entries(outObj).map((e) => ({
      [e[0]]: e[1],
    }));

    return outObjtArray;
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      console.log("formattedGridData", formattedGridData);
      const newSelecteds = formattedGridData.map((n) => n.value.port_un_locode);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, portList.length - page * rowsPerPage);

  const stableSort = (comparator) => {
    const array = Object.keys(formattedGridData);
    console.log("groupedObj =>? ", formattedGridData);
    const stabilizedThis = array.map((key, index) => [
      formattedGridData[key],
      index,
    ]);

    console.log("stabilizedThis =>? ", stabilizedThis);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  return (
    <>
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            selectedArr={selected}
          />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? "small" : "medium"}
              aria-label="enhanced table"
            >
              <EnhancedTableHead
                classes={classes}
                numSelected={selected.length}
                selectedArr={selected}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={portList.length}
              />
              <TableBody>
                {
                  // stableSort(getComparator(order, orderBy))
                  formattedGridData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((port, index) => {
                      const row = Object.values(port)[0] || {};
                      return (
                        <EnhancedTableRow
                          row={row}
                          selected={selected}
                          index={index}
                          handleClick={handleClick}
                        />
                      );
                    })
                }
                {/* {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={Object.keys(formattedGridData).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Dense padding"
        />
      </div>

      {/* <div className="linechart-wrapper">
        <HighchartsReact highcharts={Highcharts} options={options} {...props} />
      </div> */}
    </>
  );
});

// LineChartComponent.propTypes = {
//   gridData: PropTypes.object.isRequired,
// };

export default LineChartComponent;
