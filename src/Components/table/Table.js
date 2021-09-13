import React, { useContext, useCallback } from "react";
import { DataContext } from "../../Data.context";

//
import PropTypes from "prop-types";

//
import { FlyToInterpolator } from "deck.gl";

//
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import TablePagination from '@material-ui/core/TablePagination';
import Paper from "@material-ui/core/Paper";

//
import EnhancedTableHead from './TableHead';
import EnhancedTableRow from './TableRow';


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
  gridWrapper: {
    display: "flex",
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

/* TABLE MAIN  */
export const TableUI = React.memo(
  ({
    order,
    categoryFilter,
    showPagination,
    limit,
  }) => {
    const { dataset, selectedPort, onUpdateSelectedPort, onSetMapViewState } = useContext(DataContext);

    const classes = useStyles();
    const [page, setPage] = React.useState(0);

    const goToLatLon = useCallback((port) => {
      onUpdateSelectedPort(port);
      onSetMapViewState({
        longitude: port.longitude,
        latitude: port.latitude,
        zoom: 5,
        pitch: 0,
        bearing: 0,
        transitionDuration: 1000,
        transitionInterpolator: new FlyToInterpolator({speed: 2}),
      });
    }, []);

    const handleRowClick = (event, port) => {
      onUpdateSelectedPort && onUpdateSelectedPort(port);
    };

    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
      // setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    function stableSort(array, order, categoryFilter) {
      if(!array) return []; // TOD

      const stabilizedThis = [];
      let i = array.length;
      while (i--) stabilizedThis[i] = array[i];

      if (order === "asc") {
        return stabilizedThis.sort((a, b) =>
          a[categoryFilter] > b[categoryFilter]
            ? -1
            : a[categoryFilter] == b[categoryFilter]
            ? 0
            : 1
        );
      } else {
        return stabilizedThis.sort((a, b) =>
          a[categoryFilter] < b[categoryFilter]
            ? -1
            : a[categoryFilter] == b[categoryFilter]
            ? 0
            : 1
        );
      }
    }


    return (
      <Paper className={classes.paper}>
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"medium"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead classes={classes} hasLimit={!!limit} />
            <TableBody>
              {stableSort([...dataset], order, categoryFilter)
                .slice(page * limit, page * limit + limit)
                .map((port, index) => {
                  return (
                    <EnhancedTableRow
                      row={port}
                      selected={selectedPort}
                      index={index}
                      handleClick={handleRowClick}
                      goToLatLon={goToLatLon}
                      selectedCategory={categoryFilter}
                      hasLimit={!!limit}
                    />
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        
        {showPagination ? <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={dataset.length}
          rowsPerPage={limit}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}/> : null }
        
      </Paper>
    );
  }
);

TableUI.propTypes = {
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  limit: PropTypes.bool,
  showPagination: PropTypes.bool.isRequired,
};

/* TABLE MAIN  */
