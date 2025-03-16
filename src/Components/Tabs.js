import React, { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Grid, Tab, Tabs, AppBar, Button } from "@material-ui/core";
import Card from "../Components/Card";
import CircularIndeterminate from "../Components/CircularLoader";

function TabPanel(props) {
  const { children, value, index, isLoading, ...other } = props;
  if (isLoading) return <CircularIndeterminate />;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      style={{ minHeight: "10vh" }}
      {...other}
    >
      {value === index && <Box item="div">{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: "100%",
    backgroundColor: theme.palette.background.paper,
   
  },
  categoryContainer: {
    height: "500px",
    overflowX: "scroll",
  },
  backBtnContainer: {
    margin: "10px",
    display: "flex",
    justifyContent: "flex-start",
  },
  subCategoryTabPanel: {
    height: "450px",
    overflowX: "scroll",
  },
  backBtn: {
    backgroundColor: "#3f51b5",
    color: "white",
  },
}));

const ScrollableTabsButtonAuto = (props) => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  const {
    categories,
    onClick,
    subCategories,
    subCategoryFetching,
    handleSelectedSubCategoryItem,
    selectedItems,
  } = props;

  useEffect(() => {
    onClick(categories.data[0].id);
    // eslint-disable-next-line
  }, []);

  const handleChange = (newValue) => {
    setValue(newValue);
    onClick(newValue.id);
    setIsCategorySelected(true);
  };

  const handleSubCategorySelection = (selectedSubCategoryItem) => {
    delete selectedSubCategoryItem.quantity;
    const selectedSubCategoryQuantity = selectedItems.find(
      (item) => item.id === selectedSubCategoryItem.id
    );
    handleSelectedSubCategoryItem({
      ...selectedSubCategoryItem,
      quantity: selectedSubCategoryQuantity
        ? selectedSubCategoryQuantity.quantity
        : 0,
    });
  };

  const renderTabPanel = (selectedTabIndx) => {
    return (
      <TabPanel
        value={value}
        index={selectedTabIndx}
        isLoading={subCategoryFetching}
        className={classes.subCategoryTabPanel}
      >
        <Grid container spacing={0}>
          {subCategories &&
            subCategories.map((subCategory) => {
              return (
                <Grid key={subCategory.id} item md={4} lg={4} xs={4} sm={4} >
                  <Card
                    subCategory={subCategory}
                    handleSelection={handleSubCategorySelection}
                    isCardSelected={
                      selectedItems
                        ? !!selectedItems.find(
                            (item) => item.id === subCategory.id
                          )
                        : false
                    }
                    customStyle={true}
                  />
                </Grid>
              );
            })}
        </Grid>
      </TabPanel>
    );
  };

  const handleBackBtn = () => {
    setIsCategorySelected(false);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="transparent">
        {isCategorySelected && (
          <Box className={classes.backBtnContainer}>
            <Button
              variant="outlined"
              className={classes.backBtn}
              onClick={handleBackBtn}
            >
              Back
            </Button>
          </Box>
        )}
        {!isCategorySelected ? (
          <Box className={classes.categoryContainer}>
            <Grid container>
              {categories.data.map((category) => {
                return (
                  <Grid item xs={12} key={category.id}>
                    <Card
                      subCategory={category}
                      handleSelection={handleChange}
                      isCardSelected={category.id === value.id}
                    />
                  </Grid>
                );
              })}
            </Grid>
          </Box>
        ) : (
          renderTabPanel(value)
        )}
      </AppBar>
    </div>
  );
};

export default memo(ScrollableTabsButtonAuto);
