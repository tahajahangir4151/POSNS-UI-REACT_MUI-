import "date-fns";
import React from "react";
import Grid from "@material-ui/core/Grid";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  input: (props) => ({
    color: props.color,
  }),
  label: (props) => ({
    color: props.color,
  }),
  icon: (props) => ({
    color: props.color,
  }),
}));

export default function MaterialUIPickers(props) {
  const { name, required, setValue, value, color } = props;
  const classes = useStyles({ color });

  const handleDateChange = (date) => {
    setValue(date);
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Grid container justifyContent="space-around">
        <KeyboardDatePicker
          className="mt-0 w-30"
          required={required}
          margin="normal"
          id="date-picker-dialog"
          format="dd/MM/yyyy"
          value={value}
          onChange={handleDateChange}
          InputProps={{
            className: classes.input,
          }}
          InputLabelProps={{
            className: classes.label,
          }}
          KeyboardButtonProps={{
            className: classes.icon,
            "aria-label": "change date",
          }}
        />
      </Grid>
    </MuiPickersUtilsProvider>
  );
}