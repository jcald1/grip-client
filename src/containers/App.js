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
import SiteLayout from '../components/SiteLayout';
import Admin from './Admin';
import { Redirect } from 'react-router-dom';
/* import './App.css';
 */
import simulationRuns from '../actions/simulationRuns';
import util from 'util'
import path from 'path';
var qs = require('qs');

const DEFAULT_ENABLED_CATEGORIES = {
  anticipation: true,
  data: true
};
const DEFAULT_HEADER_NAME = 'Dashboard';

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
  /*   window.console = {
    log: (...args) => { },
    warn: (...args) => { },
    error: (...args) => (...args) => window_console.error(...args),
    debug: (...args) => { },
    info: (...args) => { },
    trace: (...args) => { },
  }; */

  window.console = {
    ...window_console,
    log: (...args) => { },
    warn: (...args) => { },
    error: (...args) => (...args) => window_console.error(...args),
    debug: (...args) => { },
    info: (...args) => { },
    trace: (...args) => { }
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
    this.closedCategories = {
      anticipation: false,
      absorption: false,
      recovery: false,
      data: false
    };
    this.state = {
      pageHeaderName: DEFAULT_HEADER_NAME,
      error: null,
      gettingSimulationRuns: true,
      selectedSimulationRunId: null,
      open: {
        ...this.closedCategories,
        anticipation: true
      },
      commonProps: {
        simulationRunRequestsMetadata: [],
        apiPath: process.env.REACT_APP_API_PATH,
        handleError: this.handleError
      },
      forceRefreshSimulationRun: false,
      loggedInUser: { name: "Test User" }
    };

    this.setForceRefreshSimulationRun = this.setForceRefreshSimulationRun.bind(this);
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
    this.setPageHeaderName = this.setPageHeaderName.bind(this);
    this.updateSelectedSimulationRunId = this.updateSelectedSimulationRunId.bind(this);

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

  setPageHeaderName(name) {
    if (!_.isEqual(name, this.state.pageHeaderName)) {
      this.setState({ pageHeaderName: name });
    }
  }

  updateSelectedSimulationRunId(selectedSimulationRunId) {
    console.log('App updateSelectedSimulationRunId', selectedSimulationRunId);
    if (selectedSimulationRunId !== this.state.selectedSimulationRunId) {
      this.setState({ selectedSimulationRunId });
    }
  }

  setForceRefreshSimulationRun(val) {
    this.setState({ forceRefreshSimulationRun: val });
  }

  handleSimulationRunRequestClick(e) {
    console.log('App handleSimulationRunRequestClick', 'e.currentTarget', e.currentTarget);

    const simulationRunId = e.currentTarget.getAttribute('data-row-key');
    this.refreshSimulationRuns();
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
    this.setState({ selectedSimulationRunId: simulationRunIdInt, forceRefreshSimulationRun: true });
    // this.setState({ selectedSimulationRunId: simulationRunIdInt });
    this.handleError(null);
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
    console.log(
      'App refreshSimulationRuns simulationRuns',
      simulationRuns.getSimulationRuns({
        baseUrl: this.state.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION
      })
    );
    // TODO: Add message to user
    this.setState({ gettingSimulationRuns: true });
    return simulationRuns
      .getSimulationRuns({
        baseUrl: this.state.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION
      })
      .then(data => {
        console.log('!***',util.inpsect(data))
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
    let error = null;
    if (err) {
      console.error('handleError', err);
      let errStr;
      if (err && err.message) {
        errStr = err.message;
      } else if (err) {
        errStr = err;
      } else {
        errStr = 'Unknown Error';
      }
      const errorMsg = this.state.error ? `${this.state.error}\n${errStr}` : errStr;
      console.log('handleError setting error', error);
      error = new Error(errorMsg);
    }
    if (!_.isEqual(error, this.state.error)) {
      this.setState({ error });
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
    console.log('App renderErrorMessage', this.state.error);
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
          fontSize: '30px'
        }}
      >
        <div style={{ paddingLeft: '20px' }}> Error Occured: {this.state.error.message}</div>
      </div>
    );
  }

  handleCategoryClick(e) {
    const id = e.currentTarget.getAttribute('id');

    if (!DEFAULT_ENABLED_CATEGORIES[id]) {
      return;
    }
    console.log(
      'SiteLayout handleCategoryClick',
      id,

    );
    this.handleError(null);
    this.refreshSimulationRuns();

    if (this.state.open[id]) {
      return
    }

    this.setState({
      open: { ...this.closedCategories, [e.currentTarget.getAttribute('id')]: true }
    });
  }

  openCategory(category) {
    console.log('App openCategory this state', this.state, category, 'current open status');
    if (!this.state.open[category]) {
      const newState = { open: { ...this.state.open, [category]: true } };
      //console.log('SiteLayout openCategory newState',newState);
      this.setState(newState);
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

    const simulationRunRequests =
      (<div>
        <div onClick={e => {
          this.props.history.push({
            pathname: '/simulation-runs'
          })
        }}>Create New Simulation Run</div>
        <SimulationRunRequests
          data={this.state.commonProps.simulationRunRequestsMetadata}
          handleSimulationRunRequestClick={this.handleSimulationRunRequestClick}
          key="main-items-1"
        />
      </div >)

    const simulationRun = (
      <SimulationRun
        commonProps={this.state.commonProps}
        refreshSimulationRuns={this.refreshSimulationRuns}
        getCurrentSimulationRunRequestMetadata={this.getCurrentSimulationRunRequestMetadata}
        updateSelectedSimulationRunId={this.updateSelectedSimulationRunId}
        openCategory={this.openCategory}
        setForceRefreshSimulationRun={this.setForceRefreshSimulationRun}
        forceRefreshSimulationRun={this.state.forceRefreshSimulationRun}
        setPageHeaderName={this.setPageHeaderName}
      />
    );
    return (
      <SiteLayout
        commonProps={this.state.commonProps}
        pageHeaderName={this.state.pageHeaderName}
        refreshSimulationRuns={this.refreshSimulationRuns}
        handleRunSimulationClick={this.handleRunSimulationClick}
        anticipationItemClick={this.handleSimulationRunRequestClick}
        selectedSimulationRunId={this.state.selectedSimulationRunId}
        open={this.state.open}
        handleCategoryClick={this.handleCategoryClick}
        renderErrorMessage={this.renderErrorMessage}
        loggedInUser={this.state.loggedInUser}
      >
        <Route exact path="/" render={() => simulationRunRequests} />
        <Route path="/simulation-runs/:simulationRunId?" render={() => simulationRun} />
        <Route
          path="/admin"
          render={props => (
            <div>
              <Admin commonProps={this.state.commonProps} />
            </div>
          )}
        />
      </SiteLayout>
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
