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
import Category from '../components/Category';
import CategoryItem from '../components/CategoryItem';
import simulationRuns from '../actions/simulationRuns';
import moment from 'moment';
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
      getingSimulationRuns: true,
      commonProps: {
        simulationRunRequestsMetadata: [],
        apiPath: process.env.REACT_APP_API_PATH,
        handleError: this.handleError,
        shallowEquals
      }
    };

    this.handleSimulationRunRequestClick = this.handleSimulationRunRequestClick.bind(this);

    this.handleRunSimulationClick = this.handleRunSimulationClick.bind(this);
    this.handleError = this.handleError.bind(this);
    this.renderErrorMessage = this.renderErrorMessage.bind(this);
    this.refreshSimulationRuns = this.refreshSimulationRuns.bind(this);

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

    this.setState({ getingSimulationRuns: true, getingSimulationRun: true });

    this.refreshSimulationRuns()
      // TODO: We need to add the simulation run request fetch first.  Going straight for the Simulation Runs for now
      // but keeping the UI references the Requests to avoid having to change the UI later.saI
      //.then(simulationRuns => this.getLatestSimulationRun(simulationRuns))
      .catch(err => {
        this.handleError(err);
      })
      .finally(() => {
        this.setState({ getingSimulationRuns: false, getingSimulationRun: false });
        // To continue the promise chain in componentDidMount
        return null;
      });
  }

  /*   componentDidUpdate(prevProps, prevState) {
    console.log(
      'App componentDidUpdate this.props',
      this.props,
      'componentDidUpdate',
      'this.state',
      this.state,
      'prevState',
      prevState
    );

    // Don't get the simulation runs again after getting it the first time.
    if (_.isEmpty(prevState.commonProps.simulationRunRequestsMetadata)) {
      return;
    }
    if (
      _.isEqual(
        prevState.commonProps.simulationRunRequestsMetadata,
        this.state.commonProps.simulationRunRequestsMetadata
      )
    ) {
      return;
    }

    this.setState({ getingSimulationRuns: true, getingSimulationRun: true });

    this.refreshSimulationRuns()
      .catch(err => {
        this.handleError(err);
      })
      .finally(() => {
        this.setState({ getingSimulationRuns: false, getingSimulationRun: false });
        // To continue the promise chain in componentDidMount
        return null;
      });
  } */

  handleSimulationRunRequestClick(e) {
    console.log('App handleSimulationRunRequestClick', 'e.currentTarget', e.currentTarget);

    const simulationRunId = e.currentTarget.getAttribute('data-row-key');
    this.navigateToSimulationRun(simulationRunId);
  }

  handleRunSimulationClick(e) {
    console.log('App handleRunSimulationClick e.target', e.target);
    console.log('e.currentTarget', e.currentTarget);
    this.props.history.push({
      pathname: '/simulation-runs'
    });
  }

  navigateToSimulationRun(simulationRunId) {
    console.log('navigateToSimulationRun', simulationRunId);
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
    this.setState({ getingSimulationRuns: true });
    return simulationRuns
      .getSimulationRuns({
        baseUrl: this.state.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION
      })
      .then(data => {
        const simulationRuns = this.getSimulationRunMenuItems(data);
        const simulationRunRequestsLeftNavItems = [
          <Category
            key="anticipation"
            name="Anticipation"
            items={simulationRuns}
            /* handlePlusClick={this.handleRunSimulationClick} */
          >
            <div
              className="nav-item"
              style={{ display: 'inline-block', fontSize: '18px', fontWeight: 'bold' }}
              onClick={this.handleRunSimulationClick}
            >
              +
            </div>
          </Category>,
          <Category
            key="absorption"
            name="Absorption"
            style={{ marginTop: '0px' }}
            active={false}
            tooltip="Phase 2"
          />,
          <Category
            key="recovery"
            name="Recovery"
            style={{ marginTop: '0px' }}
            active={false}
            tooltip="Phase 3"
          />,
          <Category key="settings" name="Settings" style={{ marginTop: '0px' }} />
        ];
        this.setState({
          commonProps: {
            ...this.state.commonProps,
            simulationRunRequestsMetadata: data,
            leftNavItems: simulationRunRequestsLeftNavItems
          }
        });
        return data;
      })
      .catch(err => {
        this.handleError(err);
      })
      .finally(() => {
        this.setState({ getingSimulationRuns: false });
      });
  }

  // TODO: Display Error
  handleError(err) {
    this.setState({ error: err });
    console.error('handleError', err);
  }

  handleDismissClick = e => {
    this.props.resetErrorMessage();
    e.preventDefault();
  };

  /*   handleChange = nextValue => {
    this.props.history.push(`/${nextValue}`);
  }; */

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

  getSimulationRunMenuItems(simulationRunRequestsMetadata) {
    if (!simulationRunRequestsMetadata) {
      return null;
    }

    return simulationRunRequestsMetadata.map(run => {
      const runDate = moment(run.created_at).format('HH:mm:ss MM/DD/YY');
      const details = (
        <div
          className="nav-item"
          style={{ overflowWrap: 'break-word', paddingTop: '0px' }}
          data-row-key={run.id}
          onClick={this.handleSimulationRunRequestClick}
        >
        
          {run.simulation_submission.name}
        </div>
      );
      return <CategoryItem key={run.id}>{details}</CategoryItem>;
    });
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

    return (
      <div>
        {this.renderErrorMessage()}
        <Route
          exact
          path="/"
          render={props => (
            <Layout
              leftNavItems={this.state.commonProps.leftNavItems}
              /* mainItems={simulationRunRequestsMainItems} */
              mainItems={null}
            />
          )}
        />
        <Route
          exact
          path="/simulation-runs"
          render={props => (
            <div>
              <SimulationRun
                commonProps={this.state.commonProps}
                refreshSimulationRuns={this.refreshSimulationRuns}
              />
            </div>
          )}
        />
        <Route
          path="/simulation-runs/:simulationRunId"
          render={props => (
            <div>
              <SimulationRun
                commonProps={this.state.commonProps}
                refreshSimulationRuns={this.refreshSimulationRuns}
              />
            </div>
          )}
        />
        <Route
          path="/admin"
          render={props => (
            <div>
              <Admin commonProps={this.state.commonProps} />
            </div>
          )}
        />
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
