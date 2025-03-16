import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popover from "@material-ui/core/Popover";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { actions } from "../redux/user";
import { getDataFromJson } from "../utils/getDataFromJson";
import ChangePwd from "./ChangePwd";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
    },
    li: {
      listStyle: "none",
    },
  },
  appBar: {
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  toolbar: {
    flexWrap: "wrap",
    minHeight: "0px",
    margin: "1px 0px",
  },
  toolbarTitle: {
    flexGrow: 1,
  },
  link: {
    margin: theme.spacing(1, 1.5),
  },
  refreshBtnMargin: {
    marginRight: 10,
  },
  alert: {
    position: "fixed",
    top: theme.spacing(2),
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: theme.zIndex.snackbar,
  },
  dialogPaper: {
    width: "90%",
    maxWidth: "400px",
    padding: theme.spacing(2),
    borderRadius: "12px",
  },
  inputField: {
    marginBottom: theme.spacing(2),
  },
  actionButtons: {
    display: "flex",
    justifyContent: "space-between",
    padding: theme.spacing(2),
  },
  saveButton: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

export default function Header({ isLoggedIn }) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const [compName, setCompName] = useState("");

  // Use State for Change Password Dialogue
  const [open, setOpen] = useState(false);

  const loggedInUser = useSelector((state) => {
    return state.user.profileName;
  });

  const loginStatus = () => {
    return isLoggedIn ? (
      <>
        <Button
          variant="contained"
          color="default"
          className={classes.refreshBtnMargin}
          onClick={() => dispatch(actions.setRefreshStatus(true))}
        >
          {"Refresh"}
        </Button>
        <Button
          to="/ViewOrders"
          component={RouterLink}
          color="primary"
          variant="outlined"
          className={classes.link}
        >
          View Orders
        </Button>
        <PopupState variant="popover" popupId="demo-popup-popover">
          {(popupState) => (
            <div>
              <Button
                variant="contained"
                color="primary"
                {...bindTrigger(popupState)}
              >
                {loggedInUser}
              </Button>
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "5px",
                  }}
                >
                  <Button
                    color="primary"
                    variant="outlined"
                    className={classes.link}
                    onClick={() => setOpen(true)}
                  >
                    Change Password{" "}
                  </Button>
                  <ChangePwd
                    open={open}
                    handleClose={() => setOpen(false)}
                    handleChangePassword={handleChangePassword}
                    popupState={popupState}
                  />
                  <Button
                    component={RouterLink}
                    to="/"
                    onClick={() => dispatch(actions.logOut())}
                    color="primary"
                    variant="outlined"
                    className={classes.link}
                  >
                    Logout
                  </Button>
                </div>
              </Popover>
            </div>
          )}
        </PopupState>
      </>
    ) : (
      <Button
        component={RouterLink}
        to="/"
        color="primary"
        variant="outlined"
        className={classes.link}
      >
        Login
      </Button>
    );
  };

  getDataFromJson().then((configData) => {
    let COMP_NAME;
    COMP_NAME = configData?.COMP_NAME;
    setCompName(COMP_NAME);
  });

  const userId = useSelector((state) => state.user.loggedInUserId);

  const handleChangePassword = (password, confirmPassword, setPasswordError, setConfirmPasswordError, setShowAlert) => {
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

    console.log("Payload:", payload); // Debugging line to check payload

    dispatch(actions.updatePasswordBegin(payload));
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
    setOpen(false);
  };

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        className={classes.appBar}
      >
        <Toolbar className={classes.toolbar}>
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            className={classes.toolbarTitle}
          >
            <Link component={RouterLink} to="/">
              {compName}
            </Link>
          </Typography>
          <nav>
            {/* <Link
            component={RouterLink}
            to='/Home'
            variant='button'
            color='textPrimary'
            href='#'
            className={classes.link}
          >
            Home
          </Link> */}
          </nav>
          {loginStatus()}
        </Toolbar>
      </AppBar>
    </>
  );
}
