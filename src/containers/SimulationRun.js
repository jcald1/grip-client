/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import moment from 'moment';
import BarChart from '../components/d3/BarChart/BarChart';
import './App.css';
import Layout from '../components/Layout';
import Asset from './Asset';
import Assets from '../components/Assets';
import Title from '../components/Title';
import simulationRuns from '../actions/simulationRuns';
import networkTopology from '../actions/networkTopology';
import NetworkTopology from '../components/d3/NetworkTopology/NetworkTopololgy';

const DEFAULT_API_VERSION = 'v1';
const DEFAULT_DIVIDER = '__';

class SimulationRun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentAsset: null,
      assetDetailPageAsset: null,
      assets: null,
      data: [],
      networkTopologyData: {},
      getingSimulationRun: true
    };

    this.handleAssetClick = this.handleAssetClick.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.checkUnderscoreKey = this.checkUnderscoreKey.bind(this);
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
      'SimulationRun componentDidMount this.props.match.params.simulationRunId',
      this.props.match.params.simulationRunId,
      'this.props.commonProps',
      this.props.commonProps
    );

    if (this.props.commonProps) {
      this.populateSimulationRun(this.props.match.params.simulationRunId);
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

    this.populateSimulationRun(this.props.match.params.simulationRunId);
  }

  populateSimulationRun(simulationRunId) {
    console.log('1populateSimulationRun', simulationRunId, 'this.props.', this.props);

    // TODO: Move this into Redux / Thunk actions
    console.log('commonProps.apiPath', this.props.commonProps.apiPath);

    let currentAsset;
    let assets;
    let measurements;
    let assetId;
    this.setState({ getingSimulationRun: true });
    // TODO: Some of these calls may be able to be done in parallel.

    simulationRuns
      .getSimulationRunAssets({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationRunId
      })
      .then(data => {
        console.log('SimulationRun populateSimulationRun getsimulation run assets data', data);
        if (!data) {
          return Promise.reject(new Error('No simulation run data received from the API.'));
        }
        assets = data;
        currentAsset = data[0];
        assetId = data[0].id;
        this.setState({ currentAsset, assets });
        return null;
      })
      .then(() => simulationRuns.getSimulationRunAsset({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationRunId,
        assetId
      }))
      .then(data => {
        console.log('SimulationRun populateSimulationRun getsimulation run asset data', data);
        if (!data) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        measurements = data.recordings;
        this.setState({ measurements });

        return null;
      })
      .then(() => simulationRuns.getSimulationRunResults({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationRunId
      }))
      // TODO: This may belong in the API container
      .then(data => {
        console.log('SimulationRun populateSimulationRun get simulation run data', data);
        if (!data) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        const originalData = data;
        console.log('populateSimulationRun asset', currentAsset);
        const measurement = measurements[0].name;
        console.log('populateSimulationRun measurement', measurement);
        const assetMeasurement = this.getAssetMeasurement(currentAsset, measurement);
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
      .then(() => networkTopology.getNetworkTopology({
        baseUrl: this.props.commonProps.topologyApiPath,
        apiVersion: DEFAULT_API_VERSION
      }))
      .then(data => {
        console.log('Topology network data', data);
        if (!data) {
          return Promise.reject(new Error('No network topology data received from the API.'));
        }

        this.setState({ networkTopologyData: data });
        return null;
      })
      .catch(err => {
        console.error(err);
        console.log('Error', err);
        if (err.response && err.response.data && err.response.data.message) {
          err = new verror.VError(err, err.response.data.message);
        }
        this.props.commonProps.handleError(err);
      })
      .finally(() => {
        this.setState({ getingSimulationRun: false });
      });
  }

  getBarChart({ commonProps, data }) {
    console.log('SimulationRun getBarChart data', data);
    return (
      <div>
        <BarChart
          style={{ marginTop: '20px' }}
          // handleError={this.renderErrorMessage}
          commonProps={commonProps}
          data={data}
        />
      </div>
    );
  }

  getAssetMeasurement(asset, measurement) {
    return `${asset.name}${DEFAULT_DIVIDER}${measurement}`;
  }

  handleAssetClick(e) {
    console.log('handleAssetClick', 'e.currentTarget', e.currentTarget);
    // console.log('App handleAssetClick value', e.currentTarget.getAttribute('value'));
    console.log('App handleAssetClick value', e.currentTarget.getAttribute('data-row-key'));
    // console.log('*** this.props.match.params', this.props.match);
    // const assetDetailPageAssetId = parseInt(e.currentTarget.getAttribute('value'), 10);
    const assetDetailPageAssetId = parseInt(e.currentTarget.getAttribute('data-row-key'), 10);
    // const assetDetailPageAssetId = e;

    console.log('state', this.state, 'assetDetailPageAssetId', assetDetailPageAssetId);

    const assetDetailPageAsset = this.state.assets.find(asset => asset.id === assetDetailPageAssetId);
    console.log('*** assetDetailPageAsset', assetDetailPageAsset, '');
    simulationRuns
      .getSimulationRunAsset({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        //  TODO: Clean Up.  THese should be Simulation Run IDs not Simulation IDs.
        simulationRunId: this.props.match.params.simulationRunId,
        assetId: assetDetailPageAsset.id
      })
      .then(data => {
        console.log('SimulationRun populateSimulationRun getsimulation run asset data', data);
        if (!data) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        const measurements = data.recordings;
        const newState = { measurements, assetDetailPageAsset };
        this.setState(newState);
        const newUrl = `${this.props.location.pathname}/assets/${assetDetailPageAsset.id}`;
        console.log('** NEW PUSH', newUrl);
        console.log('newUrl', newUrl);
        this.props.history.push({
          pathname: newUrl
        });
      });
  }

  checkUnderscoreKey(row, assetMeasurement) {
    console.log(
      'rowrowrowrow data',
      row,
      'assetMeasurement',
      assetMeasurement,
      'both',
      row[assetMeasurement],
      'both1',
      row[`_${assetMeasurement}`]
    );
    if (row[assetMeasurement]) {
      return row[assetMeasurement];
    }
    return row[`_${assetMeasurement}`];
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
    const charts = [];
    if (!data || !data.length || data.length === 0) {
      return null;
    }
    console.log('SimulationRun renderCharts', 'data', data, 'this.props', this.props);
    charts.push(
      this.getBarChart({
        commonProps: this.props.commonProps,
        data
      })
    );
    return charts;
  }

  renderPoleVulnerabilityTable() {
    return <Assets data={this.state.assets} handleAssetClick={this.handleAssetClick} />;
  }

  renderNetworkTopologyGraph() {
    return (
      <div>
        <NetworkTopology
          style={{ marginTop: '20px' }}
          // handleError={this.renderErrorMessage}
          commonProps={this.props.commonProps}
          data={this.state.networkTopologyData}
        />
      </div>
    );
  }

  render() {
    console.log('SimulationRun render props', this.props);
    console.log('SimulationRun render state', this.state);

    const { data } = this.state;

    if (!data || !data.length || data.length === 0) {
      return null;
    }

    const leftNavItems = null;

    const defaultMeasurement =
      this.state.measurements && this.state.measurements[0] && this.state.measurements[0].name;
    
    
      const mainItems = (
      <div>
        <Title text={`${this.state.currentAsset.name} (${
                this.state.currentAsset.properties.class
              }) - ${defaultMeasurement}`} />
        <div>
          {this.renderCharts({
            data
          })}
        </div>
        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            maxWidth: '100%',
            flexWrap: 'wrap',
            WebkitFlexWrap: 'wrap' /* Safari 6.1+ */
          }}
        >
          <div style={{ display: 'inline-block', width: '50%' }}>
            {this.renderPoleVulnerabilityTable()}
          </div>
          <div style={{ display: 'inline-block' }}>{this.renderNetworkTopologyGraph()}</div>
        </div>
      </div>
    );
    console.log('current asset', this.state.currentAsset);
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
                currentAsset={this.state.assetDetailPageAsset}
                assetData={this.state.originalData}
                assets={this.state.assets}
                mapResponseToBarChartData={this.mapResponseToBarChartData}
                getAssetMeasurement={this.getAssetMeasurement}
                renderCharts={this.renderCharts}
                measurements={this.state.measurements}
                /* data={this.state.data} */
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(SimulationRun);
