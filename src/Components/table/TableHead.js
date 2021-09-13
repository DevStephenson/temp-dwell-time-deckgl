
import React from "react";
import PropTypes from "prop-types";
//
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
//
const EnhancedTableHead = React.memo((props) => {
    const { classes, hasLimit } = props;
  
    const headCells = [
      {
        id: "port_un_locode",
        numeric: false,
        label: "Code",
      },
      { id: "name", numeric: false, label: "Name" },
  
      {
        id: "count",
        numeric: true,
        label: "Containers",
      },
      {
        id: "medianDwell",
        numeric: true,
        label: "Median Dwell (days)",
      },
      {
        id: "std",
        numeric: true,
        label: "Standard Deviation (avg)",
      },
    ];
  
    const sumDwellNavItem = {
      id: "sumDwell",
      numeric: true,
      label: "Total Dwell (days)",
    };
  
    if (!hasLimit) {
      headCells.push(sumDwellNavItem);
    }
  
    return (
      <TableHead>
        <TableRow>
          <TableCell
            id="unique_secret"
            align="left"
            style={{
              width: 5,
              padding: 3,
            }}
          ></TableCell>
  
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
    hasLimit: PropTypes.bool.isRequired,
  };

  export default EnhancedTableHead;