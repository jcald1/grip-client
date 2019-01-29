import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from '../App';
import configureStore from '../../store/configureStore';

const util = require('util');

const barChartPath = '../../components/d3/BarChart/BarChart';

describe('App', () => {
  it('renders without crashing - mount', () => {

/* 
    const div = document.createElement('div');
    ReactDOM.render(
      <Router>
        <Provider store={configureStore()}>
          <Route path="/">
            <App />
          </Route>
        </Provider>
      </Router>,
      div
    ); */
  });
});
