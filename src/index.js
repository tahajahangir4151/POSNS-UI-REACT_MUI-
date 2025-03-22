import React from 'react';
import ReactDOM from 'react-dom';
import thunkMiddleware from 'redux-thunk';
import persistState from 'redux-localstorage';

import { HashRouter as Router } from 'react-router-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import rootReducer from './redux';

import App from './Containers/App';
import * as serviceWorker from './serviceWorker';

//**************************** */
//import ReactDOM from 'react-dom/client';
//import App from './App';
// import { loadConfig } from './config';

// const initializeApp = async () => {
//   await loadConfig(); // Load config.json before rendering the app
//   ReactDOM.createRoot(document.getElementById('root')).render(<App />);
// };

// initializeApp();
//****************************** */

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunkMiddleware), persistState('user'))
);

const rootElement = document.getElementById('root');

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  rootElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
