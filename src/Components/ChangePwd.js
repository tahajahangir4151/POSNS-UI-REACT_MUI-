import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
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

const ChangePwd = ({
  open,
  handleClose,
  handleChangePassword,
  handleCloseMenu,
}) => {
  const classes = useStyles();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  return (
    <>
      {showAlert && (
        <MuiAlert
          className={classes.alert}
          elevation={6}
          variant="filled"
          severity="success"
        >
          Password changed successfully!
        </MuiAlert>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        classes={{ paper: classes.dialogPaper }}
      >
        <DialogTitle style={{ textAlign: "center", fontWeight: "bold" }}>
          Change Password
        </DialogTitle>
        <DialogContent>
          {passwordError && (
            <Typography color="error" variant="body2">
              {passwordError}
            </Typography>
          )}
          <TextField
            autoFocus
            margin="dense"
            id="password"
            label="New Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={password}
            className={classes.inputField}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            margin="dense"
            id="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? "text" : "password"}
            fullWidth
            className={classes.inputField}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!confirmPasswordError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle confirm password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </DialogContent>
        <DialogActions className={classes.actionButtons}>
          <Button onClick={handleClose} variant="outlined" color="secondary">
            Cancel
          </Button>
          <Button
            onClick={() =>
              handleChangePassword(
                password,
                confirmPassword,
                setPasswordError,
                setConfirmPasswordError,
                setShowAlert,
                handleCloseMenu
              )
            }
            className={classes.saveButton}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChangePwd;
