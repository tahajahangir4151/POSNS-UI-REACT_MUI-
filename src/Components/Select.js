import React, { memo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(0),
    minWidth: 120,
    width: '100%',

  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const SimpleSelect = (props) => {
  const classes = useStyles();
  //const [value, setValue] = React.useState('');
  const { data, handleSelect, value } = props;
  const handleChange = (event) => {
    //setValue(event.target.value);
    handleSelect(event.target.value);
  };

  return (
    <div>
      <FormControl variant='outlined' className={classes.formControl} size='small'>
        <InputLabel id='demo-simple-select-outlined-label'>
          {data.name}
        </InputLabel>
        <Select
          labelId='demo-simple-select-outlined-label'
          id='demo-simple-select-outlined'
          value={value || ''}
          onChange={handleChange}
          label={data.name}
          
        >
          <MenuItem value=''>
            <em>--Select--</em>
          </MenuItem>
          {data.data.map((item) => {
            return (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </div>
  );
};
export default memo(SimpleSelect);
