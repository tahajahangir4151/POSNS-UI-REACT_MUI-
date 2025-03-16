import user from './posns.reducer';
import counter from './counter';
import { combineReducers } from 'redux';

export default combineReducers({
  user,
  counter,
});
