import React from 'react';
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    cursor: 'pointer',
    // height: '40px',
    height: '40px',
    marginTop: 10,
    backgroundColor: '#EEEEEE',
    borderRadius: '0px',
    color: '#484848',
    marginRight: 5,
    '&:hover': {
      backgroundColor: '#BDBDBD',
      color: 'white',
    },
    '& > .MuiCardContent-root': {
      padding: 8,
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent:'center'
  },

  title: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  pos: {
    marginBottom: 12,
  },
  selected: {
    backgroundColor: '#757575',
    color: 'white',
  },
  customStyle:{
  
    height:'60px'
  }
});

const Cards = (props) => {
  const classes = useStyles();
  const { handleSelection, subCategory, isCardSelected, customStyle } = props;

  const rootStyle = classNames({
    [classes.root]: true,
    [classes.selected]: isCardSelected,
    [classes.customStyle]: !!customStyle
  });

  const handleSelectedItem = (event, value) => {
    event.stopPropagation();
    handleSelection(value);
  };
  return (
    <aside>
      <Card
        className={rootStyle}
        onClick={(event) => handleSelectedItem(event, subCategory)}
      >
        <CardContent>
          <Typography className={classes.title} component='h1'>
            {subCategory.name}
          </Typography>
        </CardContent>
      </Card>
    </aside>
  );
};

export default Cards;
