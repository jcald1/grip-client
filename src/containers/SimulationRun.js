/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import BarChart from '../components/d3/BarChart/BarChart';
import './App.css';
import Layout from '../components/Layout';
import Asset from './Asset';
import Assets from '../components/Assets';
import Title from '../components/Title';
import simulations from '../actions/simulations';
import moment from 'moment';

// const queryString = require('query-string');
// const querySearch = require('stringquery');
const qs = require('qs');

// const DEFAULT_SWING_BUS = 'HVMV_Sub_HSB__measured_real_power';
const DEFAULT_SWING_BUS = 'HVMV_Sub_HSB';
const DEFAULT_SIMULATION_VERSION = 1;
const DEFAULT_SIMULATION_ID = 1;
const DEFAULT_API_VERSION = 'v1';
const DEFAULT_DIVIDER = '__';
// TODO: Generalize
const DEFAULT_ASSETS = {
  HVMV_Sub_HSB: [
    'measured_real_power',
    'measured_voltage_A__real',
    'measured_voltage_B__real',
    'measured_voltage_C__real'
  ],
  SX2673305B_1: [
    'measured_real_power',
    'measured_voltage_1__real',
    'measured_voltage_2__real',
    'measured_voltage_N__real'
  ],
  SX3048196B_1: [
    'measured_real_power',
    'measured_voltage_1__real',
    'measured_voltage_2__real',
    'measured_voltage_N__real'
  ]
};

class SimulationRun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentAsset: DEFAULT_SWING_BUS,
      assets: DEFAULT_ASSETS,
      data: [],
      getingSimulationRun: true
    };

    this.handleAssetClick = this.handleAssetClick.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.mapResponseToBarChartData = this.mapResponseToBarChartData.bind(this);
    this.getAssetMeasurement.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props || !this.props.commonProps) {
      return false;
    }
    return true;
  }

  componentDidMount() {
    console.log(
      'SimulationRun componentDidMount this.props.match.params.simulationId',
      this.props.match.params.simulationId,
      'this.props.commonProps',
      this.props.commonProps
    );

    if (this.props.commonProps) {
      this.populateSimulationRun(this.props.match.params.simulationId, this.state.currentAsset);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      'SimulationRun componentDidUpdate this.props.match',
      this.props.match,
      'this.state.currentAsset',
      this.state.currentAsset
    );
    if (this.props.commonProps.shallowEquals(this.props.commonProps, prevProps.commonProps)) {
      return;
    }

    this.populateSimulationRun(this.props.match.params.simulationId, this.state.currentAsset);
  }

  populateSimulationRun(simulationRunId, asset) {
    console.log('populateSimulationRun', simulationRunId, 'this.props.', this.props);

    // TODO: Move this into Redux / Thunk actions
    console.log('commonProps.apiPath', this.props.commonProps.apiPath);

    this.setState({ getingSimulationRun: true });
    simulations
      // TODO: Get the latest
      .getSimulationRunResults({
        path: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationId: DEFAULT_SIMULATION_ID,
        simulationVersion: DEFAULT_SIMULATION_VERSION,
        simulationRunId
      })
      // TODO: This may belong in the API container
      .then(data => {
        console.log('SimulationRun populateSimulationRun data', data);
        if (!data) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        const originalData = data;
        console.log('populateSimulationRun asset', asset);
        const measurement = this.assetToFirstMeasurement(asset);
        console.log('populateSimulationRun measurement', measurement);
        const assetMeasurement = this.getAssetMeasurement(asset, measurement);
        data = this.mapResponseToBarChartData(data, assetMeasurement);
        return { data, originalData };
      })
      .then(({ data, originalData }) => {
        console.log('Get Simulation Run Results data', data, 'simulationRunId', simulationRunId);
        this.setState({
          data,
          originalData
        });
        return data;
      })
      .finally(() => {
        this.setState({ getingSimulationRun: false });
      });
  }

  getBarChart({ commonProps, data }) {
    console.log('SimulationRun getBarChart data', data);
    return (
      <div key={data.id}>
        <BarChart
          style={{ marginTop: '20px' }}
          // handleError={this.renderErrorMessage}
          commonProps={commonProps}
          data={data}
        />
      </div>
    );
  }

  assetToFirstMeasurement(currentAsset) {
    console.log('App assetToFirstMeasurement currentAsset', currentAsset);
    //  debugger;
    return DEFAULT_ASSETS[currentAsset][0];
  }

  getAssetMeasurement(asset, measurement) {
    return `${asset}${DEFAULT_DIVIDER}${measurement}`;
  }

  handleAssetClick(e) {
    console.log('App handleAssetClick value', e.currentTarget.getAttribute('value'));

    const currentAsset = e.currentTarget.getAttribute('value');
    console.log('state', this.state, 'currentAsset', currentAsset);
    this.setState({
      currentAsset
    });

    const newUrl = `${this.props.location.pathname}/assets/${currentAsset}`;
    console.log('newUrl', newUrl);
    this.props.history.push({
      pathname: newUrl
    });
  }

  // HVMV_Sub_HSB__measured_real_power
  // TODO: Conversion should be in the API
  mapResponseToBarChartData(data, assetMeasurement) {
    console.log('App data', data, 'assetMeasurement', assetMeasurement);
    // debugger;
    const mappedData = data.map(row => ({
      // timestamp: moment(row.timestamp).format('HH:mm'),
      timestamp: moment(row.timestamp).format('YY-MM-DD HH:mm:ss'),
      // value: row[measurement] / 1000000
      value: row[assetMeasurement]
    }));
    return mappedData;
  }

  renderCharts({ data }) {
    console.log('SimulationRun renderCharts', 'data', data, 'this.props', this.props);
    const charts = [];
    if (!data || !data.length || data.length === 0) {
      return null;
    }
    charts.push(
      this.getBarChart({
        commonProps: this.props.commonProps,
        data
      })
    );
    return charts;
  }

  render() {
    console.log('SimulationRun render props', this.props, 'this.state', this.state);

    const { data } = this.state;

    if (!data || !data.length || data.length === 0) {
      return null;
    }

    const leftNavItems = null;

    const mainItems = (
      <div>
        <Title text={this.state.currentAsset} />
        <div>
          {this.renderCharts({
            data
          })}
        </div>
        <Assets
          data={Object.getOwnPropertyNames(this.state.assets)}
          handleAssetClick={this.handleAssetClick}
        />
      </div>
    );
    console.log('###', DEFAULT_ASSETS);
    console.log('//', this.state.currentAsset);
    console.log('***', Object.getOwnPropertyNames(DEFAULT_ASSETS));
    return (
      <div>
        <Route
          exact
          path={`${this.props.match.url}`}
          render={props => <Layout leftNavItems={leftNavItems} mainItems={mainItems} />}
        />
        <Route
          exact
          path={`${this.props.match.url}/assets/:assetId`}
          render={props => (
            <div>
              <Asset
                commonProps={this.props.commonProps}
                currentAsset={this.state.currentAsset}
                assetData={this.state.originalData}
                assets={DEFAULT_ASSETS}
                mapResponseToBarChartData={this.mapResponseToBarChartData}
                getAssetMeasurement={this.getAssetMeasurement}
                renderCharts={this.renderCharts}
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(SimulationRun);
