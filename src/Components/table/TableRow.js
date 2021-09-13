import React from "react";
import PropTypes from "prop-types";
//
import { makeStyles, useTheme } from "@material-ui/core/styles";

import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";

import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import Box from "@material-ui/core/Box";
import Collapse from "@material-ui/core/Collapse";
import RoomSharpIcon from "@material-ui/icons/RoomSharp";
import blue from "@material-ui/core/colors/blue";
import UpdateIcon from "@material-ui/icons/Update";
import DirectionsBoatIcon from "@material-ui/icons/DirectionsBoat";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

const useRowStyles = makeStyles({
  root: {
    "& > *": {
      borderBottom: "unset",
    },
  },
  rowCat: {
    position: "relative",

    "&:before": {
      position: "absolute",
      zIndex: 99999,
      width: 20,
      top: 0,
      bottom: 0,
      border: "1px solid",
    },
  },
});

const EnhancedTableRow = React.memo((props) => {
  const { row, selected, selectedCategory, index, hasLimit, goToLatLon } =
    props;
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const classes = useRowStyles();
  const isSelected = (port) =>
    (selected || {}).port_un_locode == port.port_un_locode;
  const isItemSelected = isSelected(row || {});
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
        <TableCell
          className={labelId}
          align="left"
          style={{
            width: 40,
            padding: '0 10px',
            color: '#f7f7f7',
            backgroundColor: theme.palette.grey.light
          }}
        >

          {row.category.includes("berthing") ?  <DirectionsBoatIcon style={{fontSize:20, color: theme.palette.primary.dark}} /> : null } 
          {row.category.includes("loading") ?  <UpdateIcon style={{fontSize:20, color : theme.palette.primary.light }} /> : null } 
          {row.category.includes("discharge") ?  <ExitToAppIcon style={{fontSize:20, color: theme.palette.primary.main}} /> : null } 
        </TableCell>
        <TableCell
          id={labelId}
          align="left"
          style={{
            backgroundColor:
              selectedCategory == "port_un_locode"
                ? "rgba(0, 0, 0, 0.1);"
                : "inherit",
          }}
        >
          {row.port_un_locode}
        </TableCell>

        <TableCell
          component="th"
          scope="row"
          style={{
            backgroundColor:
              selectedCategory == "name" ? "rgba(0, 0, 0, 0.1)" : "inherit",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "170px",
          }}
        >
          {row.name}
        </TableCell>
        <TableCell
          align="center"
          style={{
            backgroundColor:
              selectedCategory == "count" ? "rgba(0, 0, 0, 0.1)" : "inherit",
          }}
        >
          {row.count || 0}
        </TableCell>

        <TableCell
          align="center"
          style={{
            backgroundColor:
              selectedCategory == "medianDwell"
                ? "rgba(0, 0, 0, 0.1)"
                : "inherit",
            width: 80,
          }}
        >
          {(row.medianDwell || 0).toFixed(2)}
        </TableCell>

        <TableCell
          align="center"
          style={{
            backgroundColor:
              selectedCategory == "std" ? "rgba(0, 0, 0, 0.1)" : "inherit",
            width: 80,
          }}
        >
          {(row.std || 0).toFixed(2)}
        </TableCell>

        {hasLimit ? null : (
          <TableCell
            align="center"
            style={{
              backgroundColor:
                selectedCategory == "sumDwell"
                  ? "rgba(0, 0, 0, 0.1)"
                  : "inherit",
              width: 80,
            }}
          >
            {(row.sumDwell || 0).toFixed(2)}
          </TableCell>
        )}

        <TableCell align="center" style={{ width: 50 }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={(event) => goToLatLon(row)}
          >
            <RoomSharpIcon />
          </IconButton>
        </TableCell>
        <TableCell align="center" style={{ width: 50 }}>
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
                <TableBody>//</TableBody>
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
  hasLimit: PropTypes.bool.isRequired,
};
/* END TABLE ROW */

export default EnhancedTableRow;
