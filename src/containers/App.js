/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Explore from '../components/Explore';
import BarChart from '../components/d3/BarChart/BarChart';
import { resetErrorMessage } from '../actions';
import simulations from '../actions/simulations';
import moment from 'moment';
import Button from 'antd/lib/button';
import './App.css';
import { Route } from 'react-router-dom';
import SimulationRunRequests from '../components/SimulationRunRequests';
import Assets from '../components/Assets';
import SimulationResults from './SimulationResults';
import _ from 'lodash';

const DEFAULT_SIMULATION_VERSION = 1;
const DEFAULT_SIMULATION_ID = 1;
const DEFAULT_API_VERSION = 'v1';
const DEFAULT_SWING_BUS = 'HVMV_Sub_HSB__measured_real_power';
// TODO: Generalize
const DEFAULT_ASSETS = [
  'HVMV_Sub_HSB__measured_real_power',
  'HVMV_Sub_HSB__measured_voltage_A__real',
  'HVMV_Sub_HSB__measured_voltage_B__real',
  'HVMV_Sub_HSB__measured_voltage_C__real',
  'SX2673305B_1__measured_real_power',
  'SX2673305B_1__measured_voltage_1__real',
  'SX2673305B_1__measured_voltage_2__real',
  'SX2673305B_1__measured_voltage_N__real',
  'SX3048196B_1__measured_real_power',
  'SX3048196B_1__measured_voltage_1__real',
  'SX3048196B_1__measured_voltage_2__real',
  'SX3048196B_1__measured_voltage_N__real'
];

class App extends Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
    // Injected by React Router
    children: PropTypes.node
  };

  constructor(props) {
    super(props);

    this.state = {
      error: {},
      simulationRunRequestsMetadata: [],
      latestSimulationRunRequest: null,
      currentSimulationRun: {},

      sendingSimulationRunRequest: false,
      getingSimulationRuns: true,
      getingSimulationRun: true,
      currentAsset: DEFAULT_SWING_BUS,
      assets: DEFAULT_ASSETS
    };

    this.handleAssetClick = this.handleAssetClick.bind(this);
    this.handleSimulationRunRequestClick = this.handleSimulationRunRequestClick.bind(this);
    this.handleGetSimulationRunsClick = this.handleGetSimulationRunsClick.bind(this);
    this.handleRunSimulationClick = this.handleRunSimulationClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.commonProps = { apiPath: process.env.REACT_APP_API_PATH, handleError: this.handleError };
  }

  componentDidMount() {
    console.log('BarChart componentDidMount');

    this.setState({ getingSimulationRuns: true, getingSimulationRun: true });

    this.getSimulationRuns()
      // TODO: We need to add the simulation run request fetch first.  Going straight for the Simulation Runs for now
      // but keeping the UI references the Requests to avoid having to change the UI later.saI
      .then(simulationRuns => this.getLatestSimulationRun(simulationRuns))
      .then(lastestSimulationRunId => {
        console.log('lastestSimulationRunId', lastestSimulationRunId);
        return this.getSimulationRun(lastestSimulationRunId, DEFAULT_SWING_BUS);
      })
      .then(simulationRun => {
        this.setState({ currentSimulationRun: simulationRun });
      })
      .catch(err => {
        this.handleError(err);
      })
      .finally(() => {
        this.setState({ getingSimulationRuns: false, getingSimulationRun: false });
        // To continue the promise chain in componentDidMount
        return null;
      });
  }

  handleSimulationRunRequestClick(e) {
    console.log('App handleSimulationRunRequestClick');
    console.log('App handleSimulationRunRequestClick value', e.currentTarget.getAttribute('value'));

    const simulationRunId = e.currentTarget.getAttribute('value');
    this.getSimulationRun(simulationRunId, DEFAULT_SWING_BUS);
    // TODO: Set based on the simulation
    // this.setState({ assets: {} });
  }

  handleAssetClick(e) {
    if (_.isEmpty(this.state.currentSimulationRun)) {
      return null;
    }
    console.log('App handleAssetClick value', e.currentTarget.getAttribute('value'));

    const currentAsset = e.currentTarget.getAttribute('value');
    console.log('this.state', this.state);
    console.log('state', this.state, 'currentAsset', currentAsset);
    this.setState({
      currentAsset,
      currentSimulationRun: {
        ...this.state.currentSimulationRun,
        data: this.mapResponseToBarChartData(
          [...this.state.currentSimulationRun.originalData],
          currentAsset
        )
      }
    });
  }

  handleRunSimulationClick(e) {
    console.log('App handleRunSimulationClick e.target', e.target);
    // TODO: Add message to user
    this.setState({ sendingSimulationRunRequest: true });
    simulations
      .postSimulationRunRequest({
        path: this.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationId: DEFAULT_SIMULATION_ID,
        simulationVersion: DEFAULT_SIMULATION_VERSION
      })
      // TODO: Add error to page
      .catch(err => {
        this.handleError(err);
      })
      .finally(() => {
        this.setState({ sendingSimulationRunRequest: false });
      });
  }

  getSimulationRun(simulationRunId, asset) {
    // TODO: Move this into Redux / Thunk actions
    console.log('this.commonProps.apiPath', this.commonProps.apiPath);
    console.log('getSimulationRun simulationRunId', simulationRunId);
    this.setState({ getingSimulationRun: true });
    simulations
      // TODO: Get the latest
      .getSimulationRun({
        path: this.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationId: DEFAULT_SIMULATION_ID,
        simulationVersion: DEFAULT_SIMULATION_VERSION,
        simulationRunId: simulationRunId
      })
      // TODO: This belongs in the API container
      .then(data => {
        if (!data) {
          return Promise.reject('No data received from the API.');
        }
        const originalData = data;
        data = this.mapResponseToBarChartData(data, asset);
        return { data, originalData };
      })
      .then(({ data, originalData }) => {
        console.log('Get Simulation Run Results data', data, 'simulationRunId', simulationRunId);
        // D3 Code to create the chart
        this.setState({
          currentSimulationRun: { data, config: null, simulationRunId, originalData }
        });

        return data;
      })
      .finally(() => {
        this.setState({ getingSimulationRun: false });
      });
  }

  getLatestSimulationRun(simulationRuns) {
    let max = -1;
    simulationRuns.forEach(simulationRun => {
      if (simulationRun.id > max) {
        max = simulationRun.id;
      }
    });
    if (max <= 0) {
      return null;
    }
    return max;
  }

  getSimulationRuns() {
    console.log('App handlegetingSimulationRuns e.target');
    // TODO: Add message to user
    this.setState({ getingSimulationRuns: true });
    return (
      simulations
        .getSimulationRuns({
          path: this.commonProps.apiPath,
          apiVersion: DEFAULT_API_VERSION,
          simulationId: DEFAULT_SIMULATION_ID
          //simulationVersion: DEFAULT_SIMULATION_VERSION
        })
        // TODO: For now, just passing the simulation runs directly. EventSoon we'll neeed to submit the call to get simulation run request here that has more data such as request time and eventually possible grouping of multiple simulation runs in a single request (Monte Carlo method)
        .then(data => {
          this.setState({
            simulationRunRequestsMetadata: data
          });
          return data;
        })
        .catch(err => {
          this.handleError(err);
        })
        .finally(() => {
          this.setState({ getingSimulationRuns: false });
        })
    );
  }

  handleGetSimulationRunsClick() {
    console.log('App handlegetingSimulationRuns e.target');
    this.getSimulationRuns()
      // End the promise chain
      .then(simulationRuns => {})
      // TODO: Add error to page
      .catch(err => {
        this.handleError(err);
      });
  }

  // TODO: Display Error
  handleError(err) {
    this.setState({ error: err });
    console.error(err);
  }

  //HVMV_Sub_HSB__measured_real_power
  // TODO: Conversion should be in the API
  mapResponseToBarChartData(data, measurement) {
    console.log('App data', data, 'measurement', measurement);
    // debugger;
    const mappedData = data.map(row => ({
      // timestamp: moment(row.timestamp).format('HH:mm'),
      timestamp: moment(row.timestamp).format('YY-MM-DD HH:mm:ss'),
      // value: row[measurement] / 1000000
      value: row[measurement]
    }));
    // console.log('App mapResponseToBarChartData', mappedData);
    return mappedData;
  }

  handleDismissClick = e => {
    this.props.resetErrorMessage();
    e.preventDefault();
  };

  handleChange = nextValue => {
    this.props.history.push(`/${nextValue}`);
  };

  renderErrorMessage() {
    const { errorMessage } = this.props;
    if (!errorMessage) {
      return null;
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b> <button onClick={this.handleDismissClick}>Dismiss</button>
      </p>
    );
  }

  render() {
    console.log('App render commonProps', this.commonProps, 'this.state', this.state);
    const { children, inputValue } = this.props;
    // TODO: Move to Redux
    // <Route path="/simulation-results" component={simulationRunRequestsMetadata} />
    return (
      <div className="App">
        <div style={{ display: 'flex' }} className="simulation-controls">
          <div style={{ width: '20%', display: 'inline-block' }} className="simulation-buttons">
            <div style={{ flexDirection: 'column', width: '20%' }}>
              <Button type="primary" onClick={this.handleRunSimulationClick}>
                Run Simulation
              </Button>
              <Button
                style={{ marginTop: '20px' }}
                type="primary"
                onClick={this.handleGetSimulationRunsClick}
              >
                Get Simulation Runs
              </Button>
            </div>
          </div>
          <div style={{ width: '80%', display: 'inline-block' }}>
            <SimulationRunRequests
              commonProps={this.commonProps}
              data={this.state.simulationRunRequestsMetadata}
              handleSimulationRunRequestClick={this.handleSimulationRunRequestClick}
            />
            <Assets
              commonProps={this.commonProps}
              data={this.state.assets}
              handleAssetClick={this.handleAssetClick}
              readyToLoad={!this.state.getingSimulationRun && this.state.currentSimulationRun}
            />
            <SimulationResults
              commonProps={this.commonProps}
              visualization={this.state.currentSimulationRun}
            />
          </div>
        </div>

        {/*         <Explore value={inputValue} onChange={this.handleChange} />*/}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    errorMessage: state.errorMessage,

    inputValue: ownProps.location.pathname.substring(1)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      resetErrorMessage
    }
  )(App)
);
