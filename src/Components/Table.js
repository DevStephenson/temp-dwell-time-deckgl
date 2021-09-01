import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import RoomSharpIcon from '@material-ui/icons/RoomSharp';
/* TABLE ROW */
const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
});

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
    flex: '1'
  },
  gridWrapper: {
    display:'flex',
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


const EnhancedTableRow = React.memo((props) => {
  const _timelineOptions = {
    width: "100%",
    clickToUse: true,
    editable: false,
  };

  const { row, selected, selectedCategory, index, handleClick } = props;
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const isSelected = (port) => (selected || {}).port_un_locode == port.port_un_locode;
  const isItemSelected = isSelected((row || {})["port_un_locode"]);
  const labelId = `enhanced-table-checkbox-${index}`;

  return (
    <>
      <TableRow
        hover
        role="checkbox"
        aria-checked={isItemSelected}
        tabIndex={-1}
        key={row.port_un_locode}
        selected={isItemSelected}
        // onClick={(event) => handleClick(event, row)}
      >

        <TableCell id={labelId} align="left" style={{ backgroundColor: selectedCategory == "port_un_locode" ? "rgba(255,255,255,.7)" : "inherit" }}>
          {row.port_un_locode}
        </TableCell>

        <TableCell component="th" scope="row" style={{ backgroundColor: selectedCategory == "name" ? "rgba(255,255,255,.7)" : "inherit" }}>
          {row.name}
        </TableCell>
        <TableCell align="center" style={{ backgroundColor: selectedCategory == "medianDwell" ? "rgba(255,255,255,.7)" : "inherit" }}>{(row.medianDwell || 0).toFixed(2)}</TableCell>

        <TableCell align="center" style={{ backgroundColor: selectedCategory == "count" ? "rgba(255,255,255,.7)" : "inherit" }}>{(row.count || 0)}</TableCell>
        <TableCell align="center" style={{ backgroundColor: selectedCategory == "std" ? "rgba(255,255,255,.7)" : "inherit" }}>{(row.std || 0).toFixed(2)}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => handleClick(event, row)}
          >
           <RoomSharpIcon />
          </IconButton>
        </TableCell>
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
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  //
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
  selected: PropTypes.object.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  handleClick: PropTypes.func.isRequired
};
/* END TABLE ROW */

/* TABLE HEAD */
const EnhancedTableHead = React.memo((props) => {
  const {
    classes
  } = props;

  const headCells = [
    {
      id: "port_un_locode",
      numeric: false,
      label: "Code",
    },
    { id: "name", numeric: false, label: "Name" },
    {
      id: "medianDwell",
      numeric: true,
      label: "Median Dwell (days)",
    },
    {
      id: "count",
      numeric: true,
      label: "Count",
    },
    {
      id: "std",
      numeric: true,
      label: "Standard Deviation (avg)",
    }
  ];

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "center" : "left"}
            padding={"normal"}
            sortDirection={false}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
});

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  rowCount: PropTypes.number.isRequired,
};

/* END TABLE HEAD */


/* TABLE MAIN  */
export const TableUI = React.memo((props) => {

  const { order, dataSource , categoryFilter, selected, handleClick, selectPort } = props;
  const [gridArray, setGridArray] = React.useState(dataSource || []);
  const classes = useStyles();

  const handleRowClick = (event, port) => {
    selectPort(port);
  };

  function stableSort(array, order, categoryFilter) {
    const stabilizedThis = []; 
    let i = array.length;
    while(i--) stabilizedThis[i] = array[i];

    if(order === 'asc'){
      return stabilizedThis.sort((a, b) => ((a[categoryFilter] > b[categoryFilter]) ? -1 : ((a[categoryFilter] == b[categoryFilter]) ? 0 : 1)))
    } else {
      return stabilizedThis.sort((a, b) => ((a[categoryFilter] < b[categoryFilter]) ? -1 : ((a[categoryFilter] == b[categoryFilter]) ? 0 : 1)))
    }
  }
    return (
          <Paper className={classes.paper}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={ "medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                />
                <TableBody>
                  {stableSort(dataSource, order, categoryFilter)
                    .slice(0, 10)
                    .map((port, index) => {
                      return (
                        <EnhancedTableRow
                          row={port}
                          selected={selected}
                          index={index}
                          handleClick={handleRowClick}
                          selectedCategory={categoryFilter}
                        />
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
    );
  });

TableUI.propTypes = {
  dataSource: PropTypes.array.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  selectPort:PropTypes.func.isRequired
};

/* TABLE MAIN  */