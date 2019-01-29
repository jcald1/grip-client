import React from 'react';
// import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { shallow, mount } from 'enzyme';
// import App from '../App';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import configureStore from '../../store/configureStore';
const util = require('util')
const barChartPath = '../../components/d3/BarChart/BarChart';

/* describe('App', () => {
  beforeEach(() => {
    const mockBarChart = require('../../components/d3/BarChart/__mocks__/BarChart').default;
    // jest.mock(barChartPath, () => mockBarChart);
    // jest.mock(barChartPath, () => jest.fn(() => mockBarChart));
    // jest.mock('../../components/d3/BarChart/BarChart', () => jest.fn(() => mockBarChart));
    jest.mock('../../components/d3/BarChart/BarChart');
  });

  it('renders without crashing - deep', () => {
    const App = require('../App').default;
    mount(<App />);
  });
});  */

it('App', () => {
  jest.doMock('../SimulationRun', () => {
    const SimulationRun = () => <div />;
    return SimulationRun;
  });

  // const SimulationRun = require('../SimulationRun').default;
  const App = require('../App').default;

  // const store = configureStore();

  // shallow(<App />, { disableLifecycleMethods: true });
  const appWrapper = shallow(
    <Router>
      {/* <Provider store={store}> */}
      <div>
        {/* <Route path="/" component={App} > */}
        <Route path="/">
          {/* <App store={store} /> */}
          <App />
        </Route>
      </div>
      {/*  </Provider> */}
    </Router>
  ); // .dive()

  // expect(appWrapper.contains('Simulation')).toBe(true);
});

it('SimulationRunRequests', () => {
  /*   jest.doMock('../SimulationRunRequests', () => {
    const SimulationRunRequests = () => <div />;
    return SimulationRunRequests;
  }); */

  // const SimulationRun = require('../SimulationRun').default;
  const SimulationRunRequests = require('../SimulationRunRequests').default;

  // const store = configureStore();

  // shallow(<App />, { disableLifecycleMethods: true });
  const simulationRunWrapper = shallow(
    <Router>
      {/* <Provider store={store}> */}
      <div>
        {/* <Route path="/" component={App} > */}
        <Route path="/">
          {/* <App store={store} /> */}
          <SimulationRunRequests data={{}} />
        </Route>
      </div>
      {/*  </Provider> */}
    </Router>
  ); // .dive()

  expect(simulationRunWrapper.html()).toEqual('<div></div>');
});
