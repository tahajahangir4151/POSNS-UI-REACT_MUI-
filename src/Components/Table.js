import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames";
import { useReactToPrint } from "react-to-print";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import RemoveCircleOutlineRoundedIcon from "@material-ui/icons/RemoveCircleOutlineRounded";
import PrintOrder from "../Containers/PrintOrder/PrintOrder";


const useStyles = makeStyles({
  root: {
    "&:hover ": {
      backgroundColor: "#eeeeee",
      transition: "ease-in 200ms",
      cursor: "pointer",
      "& button": {
        opacity: 1,
        transition: "ease-in 200ms",
      },
    },
  },
  customRows: {
    "&> .MuiTableCell-root": {
      borderBottom: "0px solid rgba(224, 224, 224, 1)",
    },
  },
  table: {
    minWidth: 650,
  },
  button: {
    padding: 10,
    display: "flex",
    justifyContent: "flex-start",
  },
  enable: {
    color: "red",
  },
  disabled: {
    color: "disabled",
  },
});

export default function DenseTable(props) {
  const classes = useStyles();
  const componentRef = useRef();
  const {
    kot,
    remarks,
    isError,
    tablesList,
    noOfGuests,
    resetState,
    isEditMode,
    handleSave,
    handleCancel,
    isOrderSaved,
    selectedItems,
    selectedTable,
    loggedInUserName,
    selectedSalePerson,
    deleteSelectedItem,
    handleQuantityChange,
  } = props;
  const [quantity, setQuantity] = useState(0);
 
  const orderNo = useSelector((state) => {
    return state.user.orderNo;
  });
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (!!orderNo && selectedItems && selectedItems.length) {
      handlePrint();
    }
  }, [orderNo, handlePrint, selectedItems, isEditMode]);

  useEffect(() => {
    if (isEditMode && isOrderSaved) {
      handlePrint();
      resetState();
    } else if (isError) {
      // resetState();
    }
  }, [isEditMode, isOrderSaved]);

  const totalAmount =
    selectedItems &&
    selectedItems.length &&
    selectedItems.reduce(
      (accumulator, current) =>
        accumulator + current.quantity * current.tagRate,
      0
    );
  const discountedAmount =
    totalAmount *
    (selectedItems &&
      selectedItems.length &&
      selectedItems?.[0].discPerc / 100) || 0;

      console.log(discountedAmount)
  const handleDelete = (event, item) => {
    if (!isEditMode) {
      deleteSelectedItem(item);
    } else if (!item.isItemOld) {
      deleteSelectedItem(item);
    }
  };

  const handleSaveRecord = () => {
    handleSave();
    // !!isEditMode && handlePrint();
  };

  useEffect(() => {}, [quantity]);

  const handleChange = (value, row) => {
    const re = /^[0-9\b]+$/;
    if (value === "" || re.test(value)) {
      setQuantity(value);
      handleQuantityChange(value, row.id);
    }
  };

  const handleDecrement = (quantity, selectedRow) => {
    const updatedItemQuantity = selectedRow.updatedQuantity;
    if (!isEditMode) {
      setQuantity(--quantity);
      handleQuantityChange(quantity, selectedRow.id);
    } else if (updatedItemQuantity) {
      const updatedNumber = selectedRow.isItemOld
        ? selectedRow.originalQuantity + --selectedRow.updatedQuantity
        : --selectedRow.updatedQuantity;
      setQuantity(--quantity);
      handleQuantityChange(updatedNumber, selectedRow.id);
    }
  };
  
  console.log("Hello", kot)

  console.log(selectedItems);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell
              width="5%"
              style={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Name
            </TableCell>
            <TableCell
              width="1%"
              align="left"
              style={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Quantity
            </TableCell>
            <TableCell
              align="left"
              width="2%"
              style={{ fontWeight: "bold", fontSize: "14px" }}
            >
              Price
            </TableCell>
            <TableCell
              align="left"
              width="1%"
              style={{ fontWeight: "bold", fontSize: "13px" }}
            >
              Amount
            </TableCell>
            <TableCell width="1%"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {selectedItems && selectedItems.length ? (
            selectedItems
              // .sort((a, b) => a.name.localeCompare(b.name))
              .map((row) => {
                return (
                  <TableRow key={row.id} className={classes.root}>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">
                      <Box style={{ display: "flex" }}>
                        <TextField
                          style={{ width: "100%" }}
                          id="outlined-basic"
                          variant="outlined"
                          value={row.quantity}
                          size="small"
                          color="primary"
                          disabled={isEditMode}
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(e) => {
                            handleChange(e.target.value, row);
                          }}
                        />
                        <IconButton
                          onClick={() => handleDecrement(row.quantity, row)}
                          className={classNames({
                            [classes.enable]: row.updatedQuantity > 0,
                            [classes.disabled]: row.updatedQuantity < 0,
                          })}
                        >
                          <RemoveCircleOutlineRoundedIcon />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="left">{row.tagRate}</TableCell>
                    <TableCell align="left">
                      {row.quantity * row.tagRate}
                    </TableCell>
                    <TableCell align="center">
                      <DeleteIcon
                        onClick={(event) => handleDelete(event, row)}
                        className={classNames({
                          [classes.disabled]: row.isItemOld,
                          [classes.enable]: !row.isItemOld,
                        })}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
          ) : (
            <></>
          )}
          {selectedItems && selectedItems.length ? (
            <>
              <TableRow className={classes.customRows}>
                <TableCell scope="row">
                  <Box></Box>
                </TableCell>
                <TableCell scope="row"></TableCell>
                <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "#ff0c0033",
                  }}
                >
                  Total :
                </TableCell>
                <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "#ff0c0033",
                  }}
                >
                  {`Rs ${Math.round(totalAmount -discountedAmount) }`}
                </TableCell>
                <TableCell scope="row"></TableCell>
              </TableRow>
              <TableRow className={classes.customRows}>
                <TableCell scope="row">
                  <Box></Box>
                </TableCell>
                <TableCell scope="row"></TableCell>

                {/* ***** For Service Charges ******** */}
                {/* <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "lightgrey",
                  }}
                >
                  Service Chgs :
                </TableCell>
                <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "lightgrey",
                  }}
                >
                  {`Rs ${Math.floor(totalAmount * 0.05)}`}
                </TableCell> */}
                {/* **************************************************************** */}

                <TableCell scope="row"></TableCell>
              </TableRow>
              <TableRow className={classes.customRows}>
                <TableCell scope="row">
                  <Box></Box>
                </TableCell>
                <TableCell scope="row"></TableCell>
                <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "#17cf6a40",
                  }}
                >
                  {/* FOR TAX EXLUDE COMMENT BELOW LINE */}
                  INC GST (16%):
                </TableCell>
                <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "#17cf6a40",
                  }}
                >
                  {`Rs ${
                    // Math.floor ((totalAmount * 0.16)+totalAmount)
                    Math.round(totalAmount + (totalAmount * 0.16) - discountedAmount)
                    //Math.floor(totalAmount)
                  }`}
                </TableCell>
                <TableCell scope="row"></TableCell>
              </TableRow>

              {/* FOR TAX EXCLUDE COMMENT FROM HERE */}

              <TableRow className={classes.customRows}>
                <TableCell scope="row">
                  <Box></Box>
                </TableCell>
                <TableCell scope="row"></TableCell>
                <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "#5f6d5a52",
                  }}
                >
                  INC GST (5%):
                </TableCell>
                <TableCell
                  scope="row"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    backgroundColor: "#5f6d5a52",
                  }}
                >
                  {`Rs ${
                    //Math.floor (totalAmount * 0.05)
                    Math.round(totalAmount + (totalAmount * 0.05) - discountedAmount)
                    //totalAmount
                  }`}
                </TableCell>
                <TableCell scope="row"></TableCell>
              </TableRow>

              {/* FOR TAX EXCLUDE COMMENT TILL HERE */}
            </>
          ) : (
            <></>
          )}
        </TableBody>
      </Table>
      {selectedItems && selectedItems.length ? (
        <>
          <Box className={classes.button}>
            <Button
              style={{ marginRight: "10px" }}
              color="primary"
              variant="contained"
              onClick={handleSaveRecord}
              disabled={
                !isEditMode
                  ? !(
                      !!selectedSalePerson &&
                      !!selectedTable &&
                      !!+noOfGuests > 0
                    )
                  : !(
                      !!selectedSalePerson &&
                      !!selectedTable &&
                      !!+noOfGuests > 0 &&
                      (!!selectedItems.some(
                        (item) => item.originalQuantity !== item.quantity
                      ) ||
                        selectedItems.some((item) => !item.isItemOld))
                    )
              }
            >
              {isEditMode ? "Update" : "Save"}
            </Button>

            <Box>
              <Button
                color="default"
                variant="contained"
                onClick={handleCancel}
              >
                {"Cancel"}
              </Button>
            </Box>
          </Box>
        </>
      ) : (
        <></>
      )}
      <div style={{ display: "none" }}>
         <PrintOrder
          orderNo={orderNo}
          ref={componentRef}
          tablesList={tablesList}
          noOfGuests={noOfGuests}
          isEditMode={isEditMode}
          selectedTable={selectedTable}
          selectedItems={selectedItems}
          loggedInUserName={loggedInUserName}
          remarks={remarks}
          kot={kot}
        />
      </div>
    </TableContainer>
  );
}
