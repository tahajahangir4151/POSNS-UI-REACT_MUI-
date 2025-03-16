import React, { memo, useEffect, useState } from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import { useSelector, useDispatch } from "react-redux";
import { Box, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { actions } from "../../redux/user";
import Loader from "../../Components/Loader";
import Tabs from "../../Components/Tabs";
import Select from "../../Components/Select";
import Table from "../../Components/Table";
import { getDataFromJson } from "../../utils/getDataFromJson";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(0),
      marginBottom: "5px",
      width: "100%",
    },
  },
  container: {
    padding: 10,
    backgroundColor: theme.palette.primary.light,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    height: "500px",
    overflowX: "scroll",
  },
  "& > *": {
    margin: theme.spacing(1),
    width: "25ch",
  },
  alert: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Home = () => {
  const classes = useStyles();
  const [list, setList] = useState([]);

  const isLoading = useSelector((state) => {
    return state.user.isFetching;
  });

  const loggedInUserName = useSelector((state) => {
    return state.user.profileName;
  });

  const mainCategoriesList = useSelector((state) => {
    return state.user.mainCategories;
  });

  const salePersonsList = useSelector((state) => {
    return state.user.salePersons;
  });

  const waitersList = useSelector((state) => {
    return state.user.waiters;
  });

  const tablesList = useSelector((state) => {
    return state.user.tables;
  });

  const selectedCategoryId = useSelector((state) => {
    return state.user.selectedCategory;
  });

  const subCategoryFetching = useSelector((state) => {
    return state.user.subCategories?.subCategoryFetching;
  });

  const subCategories = useSelector((state) => {
    return state.user.subCategories;
  });

  const selectedSubCategoriesById = useSelector((state) => {
    return state.user.subCategories?.[selectedCategoryId];
  });

  const selectedItems = useSelector((state) => {
    return state.user.selectedItems;
  });

  const selectedSalePerson = useSelector((state) => {
    return state.user.selectedSalePerson;
  });

  const selectedTable = useSelector((state) => {
    return state.user.selectedTable;
  });

  const selectedTableName = useSelector((state) => {
    return state.user.selectedTableName;
  });

  const remarks = useSelector((state) => {
    return state.user.remarks;
  });

  const noOfGuests = useSelector((state) => {
    return state.user.noOfGuests;
  });

  const isOrderSaved = useSelector((state) => {
    return state.user.isOrderSaved;
  });

  const loggedInUserId = useSelector((state) => {
    return state.user.loggedInUserId;
  });

  const isEditMode = useSelector((state) => {
    return state.user.isEdit;
  });

  const isRefresh = useSelector((state) => {
    return state.user.isRefresh;
  });

  const isError = useSelector((state) => {
    return state.user.isError;
  });

  const alertMessage = useSelector((state) => {
    return state.user.message;
  });

  const [kot, setKot] = useState('')

  const dispatch = useDispatch();
  useEffect(() => {
    if (isRefresh) {
      dispatch(actions.getMainCategoriesBegin());
      dispatch(actions.getTablesBegin());
      dispatch(actions.getWaitersBegin());
      dispatch(actions.getSalesPersonBegin());
    }
  }, [dispatch, isRefresh]);

  useEffect(() => {
    if (
      mainCategoriesList &&
      mainCategoriesList.data.length &&
      tablesList &&
      tablesList.data.length &&
      waitersList &&
      waitersList.data.length &&
      salePersonsList &&
      salePersonsList.data.length
    ) {
      setList(() => [
        mainCategoriesList,
        waitersList,
        tablesList,
        salePersonsList,
      ]);
    }
  }, [mainCategoriesList, waitersList, tablesList, salePersonsList]);

  useEffect(()=>{
    console.log("selectedItems", selectedItems)
    getDataFromJson().then((configData) => {
      console.log("Fetched KOT_PRINT:", configData?.KOT_PRINT); // Debugging

      if (configData?.KOT_PRINT) {
        setKot(configData.KOT_PRINT)
      } else {
        console.warn("KOT_PRINT is missing in fetched data!");
      }
    });
  },[])

  const handleOnChange = (categoryId) => {
    return !subCategories || !subCategories[categoryId]
      ? mainCategoriesList.data.forEach((category) => {
          dispatch(
            actions.getSubCategoriesByIdBegin(
              category.id,
              mainCategoriesList.data[0].id
            )
          );
        })
      : dispatch(actions.setSelectedCategory(categoryId));
  };

  const handleSelectedSubCategoryItem = (selectedSubCategoryItem) => {
    dispatch(actions.setSelectedSubCategoryItems(selectedSubCategoryItem));
  };

  const handleQuantityChange = (quantity, rowId) => {
    dispatch(actions.setItemsQuantity(+quantity, rowId));
  };

  const handleRemarksChange = (event) => {
    dispatch(actions.setRemarks(event.target.value));
  };

  const handleNoOfGuestsChange = (event) => {
    if (event.target.value >= 0) {
      dispatch(actions.setGuests(event.target.value));
    }
  };

  const handleSave = () => {
    const totalQuantity = selectedItems.reduce(
      (accumulator, current) => accumulator + current.quantity,
      0
    );
    const totalAmount = selectedItems.reduce(
      (accumulator, current) =>
        accumulator + current.quantity * current.tagRate,
      0
    );

    const filteredItems = selectedItems.map((element) => {
      return {
        ItemCode: element.itemCode,
        QtyPcs: element.quantity,
        RatePcs: element.tagRate,
        Amount: element.quantity * element.tagRate,
      };
    });
    const scoNo = selectedItems[0].scono;
    const payload = {
      Waiter: loggedInUserId,
      Remarks: remarks,
      TotalQty: totalQuantity,
      TotalNetAmount: totalAmount,
      TableCode: selectedTable,
      EmpNo: selectedSalePerson,
      items: filteredItems,
      noOfGuests,
    };

    isEditMode
      ? dispatch(actions.updateOrderBegin({ ...payload, scono: scoNo }))
      : dispatch(actions.saveOrderBegin(payload));
  };

  const handleWaiterSelect = (value) => {
    dispatch(actions.setSelectedSalePerson(value));
  };

  const handleTableSelect = (value) => {
    dispatch(actions.setSelectedTable(value));
  };

  const deleteSelectedItem = (item) => {
    dispatch(actions.deleteSelectedItem(item));
  };

  const resetState = (item) => {
    dispatch(actions.resetState(item));
  };

  const handleCancel = () => {
    dispatch(actions.resetState());
  };

  if (isLoading) {
    return <Loader />;
  }

  console.log({ isError, isOrderSaved });
  return (
    <aside>
      {
        <div className={classes.alert}>
          <Snackbar
            open={isOrderSaved || isError}
            autoHideDuration={3000}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            {isError ? (
              <Alert severity="error">{alertMessage}</Alert>
            ) : (
              isOrderSaved && (
                <Alert severity="success">
                  Your order has been {isEditMode ? "updated" : "saved"}
                  successfully
                </Alert>
              )
            )}
          </Snackbar>
        </div>
      }
      <Grid container spacing={1}>
        <Grid item xs={12} sm={6}>
          {list.length ? (
            <Select
              data={list[3]}
              handleSelect={handleWaiterSelect}
              value={selectedSalePerson}
            />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={12} sm={6}>
          {isEditMode ? (
            <Box
              style={{ padding: "20px", display: "flex", alignItems: "center" }}
            >
              <Typography variant="h4">Table</Typography> ________
              <Typography variant="h6">{selectedTableName}</Typography>
            </Box>
          ) : list.length ? (
            <Select
              data={list[2]}
              handleSelect={handleTableSelect}
              value={selectedTable}
            />
          ) : (
            <></>
          )}
        </Grid>
        <Grid item xs={3} sm={3} lg={3}>
          <Box className={classes.root}>
            <TextField
              id="no-of-guests-basic"
              label="No of Guests"
              variant="outlined"
              value={noOfGuests}
              inputProps={{ min: 0 }}
              size="small"
              onChange={handleNoOfGuestsChange}
            />
          </Box>
        </Grid>
        <Grid item xs={9} sm={9} lg={9}>
          <Box className={classes.root}>
            <TextField
              id="remarks-basic"
              label="Remarks"
              variant="outlined"
              value={remarks}
              size="small"
              onChange={handleRemarksChange}
            />
          </Box>
        </Grid>
      </Grid>
      <Box className={classes.container}>
        <Grid container spacing={3}>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Paper className={classes.paper}>
              {list.length ? (
                <Tabs
                  categories={list[0]}
                  subCategories={selectedSubCategoriesById}
                  subCategoryFetching={subCategoryFetching}
                  onClick={handleOnChange}
                  handleSelectedSubCategoryItem={handleSelectedSubCategoryItem}
                  selectedItems={selectedItems}
                />
              ) : (
                <></>
              )}
            </Paper>
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6}>
            <Paper className={classes.paper}>
              <Table
              kot={kot}
                remarks={remarks}
                isError={isError}
                isOrderSaved={isOrderSaved}
                noOfGuests={noOfGuests}
                tablesList={tablesList}
                isEditMode={isEditMode}
                resetState={resetState}
                handleSave={handleSave}
                handleCancel={handleCancel}
                selectedTable={selectedTable}
                selectedItems={selectedItems}
                loggedInUserName={loggedInUserName}
                deleteSelectedItem={deleteSelectedItem}
                selectedSalePerson={selectedSalePerson}
                handleQuantityChange={handleQuantityChange}
              />
            </Paper>
          </Grid>
        </Grid>
        {/* {list.map((item, index) => (
        <Accordion
          name={item.name}
          key={index}
          data={item.data}
          onClick={handleOnChange}
          subCategories={selectedSubCategoriesById}
          subCategoryFetching={subCategoryFetching}
        />
      ))} */}
      </Box>
    </aside>
  );
};
export default memo(Home);
