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

const DEFAULT_SIMULATION_ID = 1;
const DEFAULT_SIMULATION_VERSION = 1;
const DEFAULT_SIMULATION_RUN_ID = 1;
const DEFAULT_API_VERSION = 'v1';

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

    this.state = { error: {}, visualizations: { swingBus: { data: null, config: null } } };

    this.commonProps = { apiPath: process.env.REACT_APP_API_PATH };
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.handleError = this.handleError.bind(this);
  }

  componentDidMount() {
    console.log('BarChart componentDidMount');
    // TODO: Move this into Redux / Thunk actions
    console.log('this.commonProps.apiPath', this.commonProps.apiPath);
    simulations
      .getSimulationRunResults({
        path: this.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationId: DEFAULT_SIMULATION_ID,
        simulationVersion: DEFAULT_SIMULATION_VERSION,
        simulationRunId: DEFAULT_SIMULATION_RUN_ID
      })
      // TODO: This belongs in the API container
      .then(data => this.mapResponseToBarChartData(data))
      .then(data => {
        console.log('Get Simulation Run Results data', data);
        // D3 Code to create the chart
        this.setState({ visualizations: { swingBus: { data, config: null } } });
      })
      .catch(err => {
        this.handleError(err);
      });
  }

  // TODO: Display Error
  handleError(err) {
    this.setState({ error: err });
    console.error(err);
  }

  // TODO: Conversion should be in the API
  mapResponseToBarChartData(data) {
    // console.log('App mapResponseToBarChartData data', data);
    const mappedData = data.map(row => ({
      // timestamp: moment(row.timestamp).format('HH:mm'),
      timestamp: moment(row.timestamp).format('YY-MM-DD HH:mm:ss'),
      value: row.measured_real_power / 1000000
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
    console.log('App render');
    console.log('App commonProps', this.commonProps, 'this.state', this.state);
    const { children, inputValue } = this.props;
    // TODO: Move to Redux
    console.log('apiPath', process.env.REACT_APP_API_PATH);
    return (
      <div>
        <BarChart
          // handleError={this.renderErrorMessage}
          handleError={this.handleError}
          {...this.commonProps}
          {...this.state.visualizations.swingBus}
        />
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
