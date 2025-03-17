import React, { useState, useEffect, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Box,
  TextField,
  Button,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  Divider,
  makeStyles,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { moment } from "moment";
import { useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircle from "@material-ui/icons/AccountCircle";
import RefreshIcon from "@material-ui/icons/Refresh";
import { useDispatch, useSelector } from "react-redux";
import { actions, getDataFromDashboard } from "../../redux/user";
import ChangePwd from "../../Components/ChangePwd";
import DatePicker from "../../Components/DatePicker";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { get } from "lodash";

const useStyles = makeStyles((theme) => ({
  inputMarginDense: {
    textAlign: "center",
  },
  menuPaper: {
    marginTop: theme.spacing(1),
    top: "48px !important",
    boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#fff5f0",
    },
  },
  card: {
    marginTop: theme.spacing(2),
  },
  drawerPaper: {
    width: 180,
  },

  drawerHeader: {
    display: "flex",
    padding: theme.spacing(1),
    backgroundColor: "#F8F8F8",
    color: "#000000",
    fontSize: "1.1rem",
  },

  backIcon: {
    color: "#FF5800",
    display: "flex",
    justifyContent: "flex-start",
  },
  menuHeading: {
    fontSize: "1.1rem",
    fontWeight: "500",
    fontStyle: "italic",
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    marginLeft: "5px",
    fontFamily: "Roboto sans-serif",
  },
  listItem: {
    "&:hover": {
      backgroundColor: "#fff5f0",
    },
  },
}));

const Header = ({ data }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [toDate, setToDate] = useState(new Date().toISOString().split("T")[0]);
  const [dateError, setDateError] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const [open, setOpen] = useState(false);
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const initialLoadRef = useRef(false);

  const theme = useTheme();
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.loggedInUserId);
  const branchCode = useSelector((state) => state.user.branchCode);

  const handleChangePassword = (
    password,
    confirmPassword,
    setPasswordError,
    setConfirmPasswordError,
    setShowAlert
  ) => {
    if (!password || !confirmPassword) {
      setPasswordError("Password fields cannot be empty");
      setConfirmPasswordError("Password fields cannot be empty");
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setConfirmPasswordError("Passwords do not match");
      return;
    }

    if (!userId) {
      setPasswordError("User ID is missing");
      return;
    }

    const payload = { userId, Pwd: password };
    dispatch(actions.updatePasswordBegin(payload));
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setOpen(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const validateDates = () => {
    setDateError("");

    if (!fromDate || !toDate) {
      setDateError("Please select both dates");
      return false;
    }

    const startDate = new Date(fromDate);
    const endDate = new Date(toDate);

    if (startDate > endDate) {
      setDateError("To Date must be after From Date");
      return false;
    }

    return true;
  };

  const formatDate = (date, isFromDate = true) => {
    const d = new Date(date);
    const day = `${d.getDate()}`.padStart(2, "0");
    const month = `${d.getMonth() + 1}`.padStart(2, "0");
    const year = d.getFullYear();
    const time = isFromDate ? "05:00:00 AM" : "04:59:59 AM";
    return `${month}-${day}-${year} ${time}`;
  };

  const handleRefresh = () => {
    const formattedFromDate = formatDate(fromDate, true);
    const formattedToDate = formatDate(
      new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1)),
      false
    );
    dispatch(
      getDataFromDashboard(
        formattedFromDate,
        formattedToDate,
        userId,
        branchCode
      )
    );
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === "visible") {
      const currentDate = new Date().toISOString().split("T")[0];
      setFromDate(currentDate);
      setToDate(currentDate);
    }
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const interval = setInterval(() => {
      if (fromDate && toDate) {
        handleRefresh();
      }
    }, 300000); // 5 minutes

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(interval);
    };
  }, [fromDate, toDate]);

  const commonTextFieldStyles = {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 4,
    width: "160px",
    "& .MuiInputBase-root": {
      height: "40px",
      color: "#333333",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: dateError ? "#d32f2f" : "transparent",
      },
      "&:hover fieldset": {
        borderColor: dateError ? "#d32f2f" : "rgba(255, 255, 255, 0.3)",
      },
      "&.Mui-focused fieldset": {
        borderColor: dateError ? "#d32f2f" : "#ffffff",
      },
    },
  };

  useEffect(() => {
    if (isMobile === true) {
      if (validateDates()) {
        const formattedFromDate = formatDate(fromDate, true);
        const formattedToDate = formatDate(
          new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1)),
          false
        );
        dispatch(
          getDataFromDashboard(
            formattedFromDate,
            formattedToDate,
            userId,
            branchCode
          )
        );
      }
    } else {
      if (validateDates()) {
        const formattedFromDate = formatDate(fromDate, true);
        const formattedToDate = formatDate(
          new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1)),
          false
        );
        dispatch(
          getDataFromDashboard(
            formattedFromDate,
            formattedToDate,
            userId,
            branchCode
          )
        );
      }
    }
  }, [isMobile, fromDate, toDate, dispatch]);

  const handleBranchClick = (branchCode) => {
    const formattedFromDate = formatDate(fromDate, true);
    const formattedToDate = formatDate(
      new Date(new Date(toDate).setDate(new Date(toDate).getDate() + 1)),
      false
    );
    dispatch(
      getDataFromDashboard(
        formattedFromDate,
        formattedToDate,
        userId,
        branchCode
      )
    );
    setMobileOpen(false);
  };

  const compInfo = Array.isArray(data?.companyInfo) ? data.companyInfo : [];

  // const compInfo = data?.companyInfo;
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        style={{
          backgroundColor: "#FF5800",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              onClick={handleDrawerToggle}
              style={{
                color: "#ffffff",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography
            variant="h6"
            component="div"
            style={{
              flexGrow: 1,
              color: "#ffffff",
              textAlign: isMobile ? "center" : "left",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            {compInfo?.length > 0 && compInfo[0].compName}
          </Typography>

          {!isMobile && (
            <Box
              style={{
                display: "flex",
                gap: 24,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                alignItems: "center",
              }}
            >
              <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Typography style={{ color: "#ffffff", minWidth: "45px" }}>
                  From:
                </Typography>
                {/* <TextField
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setDateError("");
                  }}
                  size="small"
                  error={!!dateError}
                  style={commonTextFieldStyles}
                  InputProps={{
                    classes: {
                      inputMarginDense: classes.inputMarginDense,
                    },
                  }}
                /> */}
                <DatePicker
                  color="#ffffff"
                  setValue={setFromDate}
                  value={fromDate}
                />
              </Box>
              <Box style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Typography style={{ color: "#ffffff", minWidth: "45px" }}>
                  To:
                </Typography>
                {/* <TextField
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setDateError("");
                  }}
                  size="small"
                  error={!!dateError}
                  style={commonTextFieldStyles}
                  InputProps={{
                    classes: {
                      inputMarginDense: classes.inputMarginDense,
                    },
                  }}
                /> */}
                <DatePicker
                  color="#ffffff"
                  setValue={setToDate}
                  value={toDate}
                />
              </Box>
              {dateError && (
                <Typography style={{ color: "#ffffff", fontSize: "0.75rem" }}>
                  {dateError}
                </Typography>
              )}
            </Box>
          )}

          <IconButton
            size="large"
            onClick={handleRefresh}
            style={{
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <RefreshIcon />
          </IconButton>

          <IconButton
            size="large"
            onClick={handleMenu}
            style={{
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <AccountCircle />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            classes={{ paper: classes.menuPaper }}
          >
            <MenuItem onClick={() => setOpen(true)}>Change Password</MenuItem>
            <ChangePwd
              open={open}
              handleClose={() => setOpen(false)}
              handleChangePassword={handleChangePassword}
              handleCloseMenu={handleClose}
            />
            <Divider style={{ margin: "5px 0" }} />
            <MenuItem
              component={RouterLink}
              to="/"
              onClick={() => dispatch(actions.logOut(), handleClose())}
            >
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{ paper: classes.drawerPaper }}
      >
        <IconButton className={classes.backIcon} onClick={handleDrawerToggle}>
          <ArrowBackIcon />
        </IconButton>
        {/* Company Name at the top */}
        <Box className={classes.drawerHeader}>
          <Typography variant="h6">
            {compInfo?.length > 0 && compInfo[0].compName}
          </Typography>
        </Box>
        <Divider />
        {/* Menu Items */}
        <Box>
          <Typography
            className={classes.menuHeading}
            variant="subtitle1"
            gutterBottom
          >
            Branches
          </Typography>
          <Divider />
          <List
            style={{
              marginLeft: theme.spacing(1.5),
              padding: "0",
            }}
          >
            {[
              ...(compInfo?.length > 1 ? ["All"] : []),
              ...compInfo
                ?.sort((a, b) => a.branchCode - b.branchCode)
                .map((item, index) => item.branchName),
            ].map((menuItem, index, array) => (
              <React.Fragment key={index}>
                <ListItem
                  className={classes.listItem}
                  button
                  onClick={() =>
                    handleBranchClick(
                      menuItem === "All"
                        ? 0
                        : compInfo.find(
                            (branch) => branch.branchName === menuItem
                          )?.branchCode
                    )
                  }
                >
                  <Typography style={{ fontSize: "12px" }}>
                    {menuItem}
                  </Typography>
                </ListItem>
                {index < array.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Drawer>

      {isMobile && (
        <Box
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            textAlign: "center",
            justifyContent: "center",
            gap: 2,
            mt: 3,
          }}
        >
          <Box style={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography style={{ color: "#333333", minWidth: "45px" }}>
              From:
            </Typography>
            <DatePicker setValue={setFromDate} value={fromDate} />
          </Box>
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              marginLeft: 4,
            }}
          >
            <Typography sx={{ color: "#333333", minWidth: "45px" }}>
              To:
            </Typography>
            <DatePicker setValue={setToDate} value={toDate} />
          </Box>
          {dateError && (
            <Typography style={{ color: "#d32f2f", fontSize: "0.75rem" }}>
              {dateError}
            </Typography>
          )}
        </Box>
      )}
    </>
  );
};

export default Header;
