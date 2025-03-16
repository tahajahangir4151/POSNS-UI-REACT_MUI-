import ACTIONS from './app.constants';

// Reducer
const counter = (state = 1, action) => {
  switch (action.type) {
    case ACTIONS.INCREMENT:
      return state + 1;
    case ACTIONS.DECREMENT:
      return state - 1;
    default:
      return state;
  }
};

export default counter;

// Action Creators
const increment = () => {
  return {
    type: ACTIONS.INCREMENT,
  };
};

const decrement = () => {
  return {
    type: ACTIONS.DECREMENT,
  };
};

export const actions = {
  increment,
  decrement,
};
