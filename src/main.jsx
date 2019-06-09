import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import Store from './store';
import App from './App.js';


require('../scss/main.scss');

render(
  <Provider store={Store}>
    <App />
  </Provider>,
  document.getElementById('app-container'),
);
