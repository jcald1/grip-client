import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import bluebird from 'bluebird';
import Root from './containers/Root';
import configureStore from './store/configureStore';

global[Promise] = bluebird;
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

const store = configureStore();

render(
  <Router>
    <Root store={store} />
  </Router>,
  document.getElementById('root')
);
