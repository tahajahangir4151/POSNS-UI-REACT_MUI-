import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { v1 as uuid } from "uuid";
import MomentUtils from "@date-io/moment";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import moment from "moment";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import TableRow from "@material-ui/core/TableRow";
import { actions } from "../../redux/user";
import Loader from "../../Components/Loader";

const columns = [
  { id: "scono", label: "Order no", minWidth: 100 },
  { id: "scodate", label: "Order Date", minWidth: 100, format: "date" },
  { id: "tableName", label: "Table Name", minWidth: 100 },
  {
    id: "remarks",
    label: "Remarks",
    minWidth: 170,
    align: "left",
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
  },
  container: {
    maxHeight: 440,
  },
  tableRow: {
    cursor: "pointer",
  },
}));

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.grey[600],
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 12,
  },
}))(TableCell);

const ViewOrders = () => {
  const classes = useStyles();
  const history = useHistory();
  const [page, setPage] = useState(0);

  const [selectedDate, setSelectedDate] = React.useState(
    moment(new Date()).format("L")
  );
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const isLoading = useSelector((state) => {
    return state.user.isFetching;
  });

  const loggedInUserId = useSelector((state) => {
    return state.user.loggedInUserId;
  });

  const orders = useSelector((state) => {
    return state.user.orders;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.getOrdersByLoggedInWaiter(loggedInUserId, selectedDate));
  }, [dispatch, loggedInUserId, selectedDate]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleClick = (id) => {
    dispatch(actions.setEditMode(true));
    dispatch(actions.getOrderDetails(id));
    history.push("/");
  };

  const handleDateChange = (date) => {
    setSelectedDate(moment(date).format("L"));
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Paper className={classes.root}>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container justify="space-evenly">
          <KeyboardDatePicker
            margin="normal"
            id="date-picker-dialog"
            label="Order Date"
            views={["year", "month", "date"]}
            value={selectedDate}
            format="MM/DD/YYYY"
            onChange={handleDateChange}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>
      </MuiPickersUtilsProvider>

      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders &&
              orders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={uuid()}
                      className={classes.tableRow}
                    >
                      {columns.map((column) => {
                        const value = row[column.id];
                        return (
                          <StyledTableCell
                            key={uuid()}
                            align={column.align}
                            onClick={() => handleClick(row.scono)}
                          >
                            {column.format && column.format === "date"
                              ? moment(value).format("L LT")
                              : value}
                          </StyledTableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={orders ? orders.length : 0}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
export default ViewOrders;
