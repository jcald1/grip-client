import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router, Route } from 'react-router-dom';

global.Promise = require("bluebird")

import configureStore from '../../store/configureStore';
// import App from '../App';

const util = require('util');

jest.mock('../../actions/simulationRuns');
let App;

describe('App', () => {
  beforeEach(() => {
    // Set up some mocked out file info before each test
    App = require('../App').default;

    const simulationRuns = require('../../actions/simulationRuns');

    const getSimulationRun = simulationRuns.default
      .getSimulationRuns({ baseUrl: null, apiVersion: null })
      .then(r => {})
      .catch(e => {})
      .finally(() => {});

    console.log(util.inspect(getSimulationRun));
  });

  it('renders without crashing - mount', () => {
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
    );
  });
});
