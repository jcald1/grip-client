import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { JSDOM } from 'jsdom';

import configureStore from '../../store/configureStore';

/* const dom = new JSDOM();
global.document = dom.window.document;
global.window = dom.window;
console.log('&&&&', document); */

global.Promise = require('bluebird');
// import App from '../App';

const util = require('util');

jest.mock('../../actions/simulationRuns');
let App;

describe('App', () => {
  beforeEach(() => {
    Object.defineProperty(document, 'currentScript', {
      value: document.createElement('script')
    });
    console.log('^^^^^^^^^^^^^^^', document);

    // Set up some mocked out file info before each test
    App = require('../App').default;
  });

  it('renders without crashing - mount', () => {
    console.log('%%%%%%%%%%%%%%%%%%%', document);

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
