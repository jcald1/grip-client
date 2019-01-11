/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Explore from '../components/Explore';
import { resetErrorMessage } from '../actions';

import Button from 'antd/lib/button';
import { Route } from 'react-router-dom';
import SimulationRunRequests from './SimulationRunRequests';
import SimulationRun from './SimulationRun';
import _ from 'lodash';
import Layout from '../components/Layout';
import Admin from './Admin';
import { Redirect } from 'react-router-dom';
import './App.css';

import simulationRuns from '../actions/simulationRuns';

import path from 'path';
var qs = require('qs');

const log = process.env.REACT_APP_LOG;
const window_console = console;
console.log('Logging', log);
if (log && log.toUpperCase() !== 'OFF') {
  // TODO: Implement actual logging level functionality
  /*  
  window.console = {
    log: (...args) => {
        return window_console.log(...args);
    },
    warn: (...args) => {
        return window_console.warn(...args);
    },
    error: (...args) => {
        return window_console.error(...args);
    },
    debug: (...args) => {
        return window_console.debug(...args);
    },
    info: (...args) => {
        return window_console.info(...args);
    }
  }; */
} else {
  window.console = {
    log: (...args) => {},
    warn: (...args) => {},
    error: (...args) => (...args) => window_console.error(...args),
    debug: (...args) => {},
    info: (...args) => {}
  };
}

const DEFAULT_API_VERSION = 'v1';

const shallowEquals = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true;
  }
  return (
    Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key => obj1[key] === obj2[key])
  );
};

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

    this.handleError = this.handleError.bind(this);
    this.state = {
      error: null,
      gettingSimulationRuns: true,
      selectedSimulationRunId: null,
      open: {
        anticipation: false,
        absorption: false,
        recovery: false,
        settings: false
      },
      commonProps: {
        simulationRunRequestsMetadata: [],
        apiPath: process.env.REACT_APP_API_PATH,
        handleError: this.handleError
      }
    };

    this.handleSimulationRunRequestClick = this.handleSimulationRunRequestClick.bind(this);
    this.handleCategoryClick = this.handleCategoryClick.bind(this);
    this.openCategory = this.openCategory.bind(this);
    this.handleRunSimulationClick = this.handleRunSimulationClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.refreshSimulationRuns = this.refreshSimulationRuns.bind(this);
    this.getCurrentSimulationRunRequestMetadata = this.getCurrentSimulationRunRequestMetadata.bind(
      this
    );
    this.selectSimulationRunId = this.selectSimulationRunId.bind(this);

    if (!process.env.REACT_APP_API_PATH) {
      const err = Error('Configuration file has not been set up.');
      console.log(err);
      throw err;
    }
  }

  // TODO: Refactor App so that the dashboard elements are rendered in a different container.
  // Get simulation runs should not be getting run on subroutes.  App.js should be very light
  // and only have common functionality.
  componentDidMount() {
    console.log('App componentDidMount');

    this.setState({ gettingSimulationRuns: true });

    this.refreshSimulationRuns()
      // TODO: We need to add the simulation run request fetch first.  Going straight for the Simulation Runs for now
      // but keeping the UI references the Requests to avoid having to change the UI later.saI
      //.then(simulationRuns => this.getLatestSimulationRun(simulationRuns))
      .catch(err => {
        this.handleError(err);
      })
      .finally(() => {
        this.setState({ gettingSimulationRuns: false });
        // To continue the promise chain in componentDidMount
        return null;
      });
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('App 1componentDidUpdate this.props', this.props, 'this.state', this.state);
  }

  selectSimulationRunId(selectedSimulationRunId) {
    console.log('App selectSimulationRunId',selectedSimulationRunId)
    if (selectedSimulationRunId !== this.state.selectedSimulationRunId) {
      this.setState({ selectedSimulationRunId });
    }
  }

  handleSimulationRunRequestClick(e) {
    console.log('App handleSimulationRunRequestClick', 'e.currentTarget', e.currentTarget);

    const simulationRunId = e.currentTarget.getAttribute('data-row-key');
    this.navigateToSimulationRun(simulationRunId);
  }

  handleRunSimulationClick(e) {
    console.log('App handleRunSimulationClick e.target', e.target);
    console.log('e.currentTarget', e.currentTarget);
    this.setState({ error: null });
    this.props.history.push({
      pathname: '/simulation-runs'
    });
  }

  navigateToSimulationRun(simulationRunId) {
    console.log('App navigateToSimulationRun', simulationRunId);
    const simulationRunIdInt = parseInt(simulationRunId, 10);
    if (isNaN(simulationRunIdInt)) {
      return this.handleError(new Error('Simulation Run ID must be numeric'));
    }
    this.setState({ selectedSimulationRunId: simulationRunIdInt });
    this.props.history.push({
      pathname: `/simulation-runs/${simulationRunId}`
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

  refreshSimulationRuns() {
    console.log('App refreshSimulationRuns');
    // TODO: Add message to user
    this.setState({ gettingSimulationRuns: true });
    return simulationRuns
      .getSimulationRuns({
        baseUrl: this.state.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION
      })
      .then(data => {
        this.setState({
          commonProps: {
            ...this.state.commonProps,
            simulationRunRequestsMetadata: data
          }
        });
      })
      .catch(err => {
        this.handleError(err);
      })
      .finally(() => {
        this.setState({ gettingSimulationRuns: false });
      });
  }
  handleError(err) {
    console.log('handleError', err);
    let error;
    if (err) {
      console.error('handleError', err);
      let errStr;
      if (err && err.message) {
        errStr = err.message;
      } else if (err) {
        errStr = err;
      } else {
        errStr = '';
      }
      error = this.state.error ? `${this.state.error}<br/>\n${errStr}` : errStr;
      console.log('handleError setting error', error);
      this.setState({ error: new Error(error) });
    }
  }

  handleDismissClick = e => {
    this.props.resetErrorMessage();
    e.preventDefault();
  };

  getCurrentSimulationRunRequestMetadata(simulationRunIdUrlStr) {
    console.log(
      'App getCurrentSimulationRunRequestMetadata',
      'this.props.commonProps.simulationRunRequestsMetadata',
      this.props.commonProps
    );
    if (!simulationRunIdUrlStr) {
      return;
    }
    const simulationRunIdUrl = parseInt(simulationRunIdUrlStr, 10);
    if (isNaN(simulationRunIdUrl)) {
      return this.handleError(new Error('Simulation Run ID must be numeric'));
    }
    const currentSimulationRunRequestMetadata = this.state.commonProps.simulationRunRequestsMetadata.find(
      simulation => simulation.id === simulationRunIdUrl
    );

    return currentSimulationRunRequestMetadata;
  }

  renderErrorMessage() {
    /*    const { errorMessage } = this.props;
    if (!errorMessage) {
      return null;
    } */
    if (!this.state.error) {
      return null;
    }

    /* return (
             <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b> <button onClick={this.handleDismissClick}>Dismiss</button>
      </p> 

    ); */

    return (
      <div
        style={{
          width: '100%',
          backgroundColor: 'red',
          color: 'white',
          fontSize: '30px',
          paddingLeft: '130px'
        }}
        className="logo"
      >
        <div style={{ paddingLeft: '20px' }}> Error Occured - {this.state.error.message}</div>
      </div>
    );
  }

  handleCategoryClick(e) {
    const id = e.currentTarget.getAttribute('id');
    console.log(
      'Layout handleCategoryClick',
      id,
      'current: ',
      this.state.open[id],
      'change to: ',
      this.state.open[id]
    );
    this.setState({
      open: { ...this.state.open, [e.currentTarget.getAttribute('id')]: !this.state.open[id] }
    });
  }

  openCategory(category) {
    console.log('Layout openCategory', category);
    if (!this.state.open.id) {
      this.setState({ open: { ...this.state.open, [category]: true } });
    }
  }

  render() {
    console.log(
      'App render this.state.commonProps',
      this.state.commonProps,
      'this.state',
      this.state
    );
    const { children, inputValue } = this.props;

    const mainItems = <div />;

    const simulationRun = (
      <SimulationRun
        commonProps={this.state.commonProps}
        refreshSimulationRuns={this.refreshSimulationRuns}
        getCurrentSimulationRunRequestMetadata={this.getCurrentSimulationRunRequestMetadata}
        selectSimulationRunId={this.selectSimulationRunId}
        openCategory={this.openCategory}
      />
    );
    return (
      <Layout
        commonProps={this.state.commonProps}
        handleRunSimulationClick={this.handleRunSimulationClick}
        anticipationItemClick={this.handleSimulationRunRequestClick}
        selectedSimulationRunId={this.state.selectedSimulationRunId}
        open={this.state.open}
        handleCategoryClick={this.handleCategoryClick}
        renderErrorMessage={this.renderErrorMessage}
      >
        <Route exact path="/simulation-runs/:simulationRunId?" render={() => simulationRun} />
        <Route
          path="/admin"
          render={props => (
            <div>
              <Admin commonProps={this.state.commonProps} />
            </div>
          )}
        />
      </Layout>
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
