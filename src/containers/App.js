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
const { Header } = Layout;

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
      simulationRunRequestsMetadata: [],
      getingSimulationRuns: true,
      commonProps: {
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

  componentDidUpdate(prevProps, prevState) {
    console.log(
      'App componentDidUpdate this.props',
      this.props,
      'componentDidUpdate',
      'this.state',
      this.state,
      'prevState',
      prevState
    );

    if (
      _.isEqual(prevState.simulationRunRequestsMetadata, this.state.simulationRunRequestsMetadata)
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
  }

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
    // Clear out simulation runs, force whole new re-render of app
    /* const newState = {simulationRunRequestsMetadata:[] }; */
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
    return (
      simulationRuns
        .getSimulationRuns({
          baseUrl: this.state.commonProps.apiPath,
          apiVersion: DEFAULT_API_VERSION
        })
        // TODO: For now, just passing the simulation runs directly. EventSoon we'll neeed to submit the call to get simulation run request here that has more data such as request time and eventually possible grouping of multiple simulation runs in a single request (Monte Carlo method)
        .then(data => {
          const simulationRuns = this.getSimulationRunMenuItems(data);
          const simulationRunRequestsLeftNavItems = [
            <Category
              key="anticipation"
              name="Anticipation"
              items={simulationRuns}
              handlePlusClick={this.handleRunSimulationClick}
            />,
            <Category
              key="absorption"
              name="Absorption"
              style={{ marginTop: '20px' }}
              active={false}
            />,
            <Category
              key="recovery"
              name="Recovery"
              style={{ marginTop: '20px' }}
              active={false}
            />,
            <Category key="settings" name="Settings" style={{ marginTop: '20px' }} />
          ];
          this.setState({
            simulationRunRequestsMetadata: data,
            commonProps: {
              ...this.state.commonProps,
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
        })
    );

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
          style={{ overflowWrap: 'break-word' }}
          data-row-key={run.id}
          onClick={this.handleSimulationRunRequestClick}
        >
          {runDate}
          <br />
          {run.simulation_filename}
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


    /* const simulationRunRequestsMainItems = [
      <SimulationRunRequests
        data={this.state.simulationRunRequestsMetadata}
        handleSimulationRunRequestClick={this.handleSimulationRunRequestClick}
        key="main-items-1"
      />
    ]; */

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
                simulationRunRequestsMetadata={this.state.simulationRunRequestsMetadata}
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
                simulationRunRequestsMetadata={this.state.simulationRunRequestsMetadata}
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
