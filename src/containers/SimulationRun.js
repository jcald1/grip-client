/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import moment from 'moment';
import {
  LineChart, ComposedChart, Bar, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend
} from 'recharts';
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
const FILTERED_ASSETS = ['meter', 'overhead_line', 'pole'];
const DEFAULT_YAXIS_DOMAIN = [0, 1.2];
const VULNERABILITY_MEASUREMENT = 'vulnerability';

class SimulationRun extends Component {
  constructor(props) {
    super(props);

    this.state = {
      simulationRunId: null,
      currentAsset: null,
      selectedAssetDetailId: null,
      allRunAssets: null,
      runResultsData: [],
      networkTopologyData: {},
      gettingSimulationRun: true,
      selectNode: null,
      chartVulrunAggResultsResponseDatanerabilityAggData: [],
      chartData: [],
    };

    this.handleAssetClick = this.handleAssetClick.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.checkUnderscoreKey = this.checkUnderscoreKey.bind(this);
    this.mapResponseToBarChartData = this.mapResponseToBarChartData.bind(this);
    this.getAssetMeasurement = this.getAssetMeasurement.bind(this);
    this.navigateToAsset = this.navigateToAsset.bind(this);
    this.handleAssetHoverOver = this.handleAssetHoverOver.bind(this);
    this.handleAssetRowMouseEnter = this.handleAssetRowMouseEnter.bind(this);
    this.handleAssetRowMouseOut = this.handleAssetRowMouseOut.bind(this);
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
    let selectedAssetDetailId;
    this.setState({ getingSimulationRun: true });
    // TODO: Some of these calls may be able to be done in parallel.

    simulationRuns
      .getSimulationRunAssets({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationRunId
      })
      .then(allRunAssets => {
        console.log(
          'SimulationRun populateSimulationRun getsimulation run assets data',
          allRunAssets
        );
        if (!allRunAssets) {
          return Promise.reject(new Error('No simulation run data received from the API.'));
        }
        currentAsset = allRunAssets[0];
        selectedAssetDetailId = allRunAssets[0].id;
        this.setState({ currentAsset, allRunAssets, selectedAssetDetailId });
        return null;
      })
      .then(() => simulationRuns.getSimulationRunResults({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationRunId
      }))
      // TODO: This may belong in the API container
      .then(runResultsData => {
        console.log(
          'SimulationRun populateSimulationRun get simulation run originalData',
          runResultsData
        );
        if (!runResultsData) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        console.log('populateSimulationRun asset', currentAsset);
        const measurement = currentAsset.recordings[0].name;
        console.log('populateSimulationRun measurement', measurement);
        const assetMeasurement = this.getAssetMeasurement(currentAsset, measurement);
        return { runResultsData };
      })
      .then(({ runResultsData }) => {
        console.log(
          'Get Simulation Run Results data',
          'simulationRunId',
          simulationRunId
        );
        this.setState({
          runResultsData,
          simulationRunId
        });
        return runResultsData;
      })
      .then(() => networkTopology.getNetworkTopology({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION
      }))
      .then(topologyData => {
        console.log('Topology network data', topologyData);
        if (!topologyData) {
          return Promise.reject(new Error('No network topology data received from the API.'));
        }

        this.setState({ networkTopologyData: topologyData });
        return null;
      })
   .then(() => simulationRuns.getSimulationRunVulnerabilityAggByTimeStepResults({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        simulationRunId
      }))
      // TODO: This may belong in the API container
      .then(runAggResultsResponseData => {
        console.log(
          'SimulationRun getSimulationRunVulnerabilityAggByTimeStepResults ',
          runAggResultsResponseData
        );
        if (!runAggResultsResponseData) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        const chartData = this.mapResultsAndVulnerabilityToChartData(
          this.state.runResultsData,
          runAggResultsResponseData
        );
        this.setState({
          chartData
        });
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
    this.navigateToAsset(assetDetailPageAssetId);
  }

  handleAssetHoverOver(record) {
    console.log('SimulationRun', 'handleAssetClick', 'record', record);
  }

  navigateToAsset(assetDetailPageAssetId) {
    const selectedAssetDetailId = parseInt(assetDetailPageAssetId, 10);
    console.log('*** assetDetailPageAsset', selectedAssetDetailId, '');
    this.setState({ selectedAssetDetailId });
    const newUrl = `/simulation-runs/${
      this.props.match.params.simulationRunId
    }/assets/${selectedAssetDetailId}`;
    console.log('** NEW PUSH', newUrl);
    console.log('newUrl', newUrl);
    this.props.history.push({
      pathname: newUrl
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

  mapResponseToBarChartData(data, assetMeasurement) {
    console.log(
      'mapResponseToBarChartData data',
      data,
      'typedata',
      typeof data,
      'assetMeasurement',
      assetMeasurement
    );
    // debugger;
    const mappedData = data.map(row => ({
      timestamp: moment(row.timestamp).format('YY-MM-DD HH:mm'),

      value: row[assetMeasurement]
    }));
    return mappedData;
  }

  // TODO: Probably should be doing this in the API
  mapResponseToChartData(data, staticValues) {
    console.log('App data', data, 'staticValues', staticValues);
    const mappedData = data.map(row => {
      const newRow = {
        ...row,
        timestamp: moment(row.timestamp).format('MM-DD-YY HH:mm')
      };
      if (staticValues) {
        staticValues.forEach(valueObj => {
          newRow[valueObj.name] = valueObj.value;
        });
      }
      return newRow;
    });

    return mappedData;
  }

  // This might could be done on the server but not sure
  // we might be coupling what the line chart woudl need with
  // what the API on the server is for.
  mapResultsAndVulnerabilityToChartData(data, aggResultsValues) {
    console.log('App data', data, 'aggResultsValues', aggResultsValues);
    const mappedData = data.map(row => {
      const newRow = {
        ...row,
        timestamp: moment(row.timestamp).format('MM-DD-YY HH:mm')
      };
      if (aggResultsValues) {
        let vulnDataforTimestep = aggResultsValues.find(o => o.timestamp === row.timestamp);
        console.log('vuln timestamp', row.timestamp);
        if (vulnDataforTimestep) {
          newRow[VULNERABILITY_MEASUREMENT] = vulnDataforTimestep.pole_stress;
          newRow[VULNERABILITY_MEASUREMENT + '_recording'] = vulnDataforTimestep.recording;    
        } 
      }
      return newRow;
    });

    return mappedData;
  }

  renderCharts(chartData) {
    console.log('SimulationRun renderCharts', 'data', chartData, 'this.props', this.props);
    const charts = [];
    if (!chartData || !chartData.length || chartData.length === 0) {
      return null;
    }

    charts.push(this.getBarChart(this.props.commonProps, chartData, ''));
    return charts;
  }

  renderLineChart({
    data, lines, domain, renderXaxis
  }) {
    if (!data || !data.length || data.length === 0) {
      return null;
    }

    console.log('renderLineChart', 'data', data, 'lines', lines);

    const linesToRender = lines.map(line => (
      <Line
        key={line.assetMeasurement}
        type="monotone"
        dataKey={line.assetMeasurement}
        stroke={line.stroke}
        strokeDasharray={line.strokeDasharray}
        strokeWidth={line.strokeWidth}
        yAxisId={line.yAxisId}
      />
    ));
    // const bottomMargin = renderXaxis || renderXaxis == null ? 100 : 20;
    const bottomMargin = 100;

    console.log('***bottomMargin', bottomMargin);
    return (
      <div>
        <LineChart
          style={{ margin: '0 auto' }}
          margin={{
            top: 5,
            right: 60,
            bottom: bottomMargin,
            left: 40
          }}
          width={1100}
          height={600}
          data={data}
        >
          {linesToRender}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis interval={0} tick={{ dy: 40 }} angle={-65} dataKey="timestamp" />
          <YAxis
            domain={domain}
            yAxisId="left"
            label={{ value: 'Peak Vulnerability ', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: 'Wind Speed - meters/sec',
              angle: -90,
              position: 'outside',
              dx: 10
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Tooltip />
        </LineChart>
      </div>
    );
  }


  renderLineChartSimulationRun({
    data, lines, domain, renderXaxis
  }) {
    if (!data || !data.length || data.length === 0) {
      return null;
    }

    console.log('renderLineChart', 'data', data, 'lines', lines);

    const linesToRender = lines.map(line => {
      let lineToAdd = null;
      if (line.type === 'Line') {
        lineToAdd =
        (
          <Line
            key={line.assetMeasurement}
            type="monotone"
            dataKey={line.assetMeasurement}
            stroke={line.stroke}
            strokeDasharray={line.strokeDasharray}
            strokeWidth={line.strokeWidth}
            yAxisId={line.yAxisId}
          />
        );
      } else {
        lineToAdd =
        (
          <Bar
            key={line.assetMeasurement}
            type="monotone"
            dataKey={line.assetMeasurement}
            fill={line.fill}
            barSize={line.barSize}
            fillOpacity={line.fillOpacity}
            yAxisId={line.yAxisId}
          />
        );
      }
      return lineToAdd;
    });
    // const bottomMargin = renderXaxis || renderXaxis == null ? 100 : 20;
    const bottomMargin = 100;

    console.log('***bottomMargin', bottomMargin);
    return (
      <div>
        <ComposedChart
          style={{ margin: '0 auto' }}
          margin={{
            top: 5,
            right: 60,
            bottom: bottomMargin,
            left: 40
          }}
          width={1300}
          height={650}
          data={data}
        >
          {linesToRender}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis interval={0} tick={{ dy: 40 }} angle={-65} dataKey="timestamp" />
          <YAxis
            domain={domain}
            yAxisId="left"
            label={{ value: 'Peak Vulnerability', angle: -90, position: 'insideLeft' }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: 'Measured Real Power - W',
              angle: -90,
              position: 'outside',
              dx: 30
            }}
          />
          <Legend verticalAlign="top" height={36} />
          <Tooltip />
        </ComposedChart>
      </div>
    );
  }

  filterAssetsTable(assets) {
    console.log('**assets', assets);
    return assets.filter(asset => {
      console.log('**asset', asset);
      return FILTERED_ASSETS.includes(asset.properties.class) ? asset.properties.class : null;
    });
  }

  renderPoleVulnerabilityTable() {
    return (
      <Assets
        data={this.filterAssetsTable(this.state.allRunAssets)}
        handleAssetClick={this.handleAssetClick}
        assetsList={FILTERED_ASSETS}
        handleAssetRowMouseEnter={this.handleAssetRowMouseEnter}
        handleAssetRowMouseOut={this.handleAssetRowMouseOut}
      />
    );
  }

  renderNetworkTopologyGraph() {
    const configuration = {
      nodeSelect: this.state.selectNode,
      //nodeUnselect: this.state.unselectNode
    };
    return (
      <div>
        <NetworkTopology
          style={{ marginTop: '20px' }}
          // handleError={this.renderErrorMessage}
          commonProps={this.props.commonProps}
          data={this.state.networkTopologyData}
          configuration={configuration}
        />
      </div>
    );
  }

  getWindData(data, assetMeasurements) {
    console.log('getWindData', 'data', data, 'assetMeasurements', assetMeasurements);
    const windSpeedData = this.mapResponseToBarChartData(data, assetMeasurements);
    console.log('getWindData', 'returning windSpeedData', windSpeedData);
    return windSpeedData;
  }

  handleAssetRowMouseEnter(record) {
    console.log('handleAssetRowMouseEnter', 'record', record);
    this.setState({ selectNode: record.name });
  }

  handleAssetRowMouseOut(record) {
    console.log('handleAssetRowMouseOut', 'record', record);
    //this.setState({ unselectNode: record.name });
  }

  render() {
    console.log('render============================================================SimulationRun');
    console.log('SimulationRun render props', this.props);
    console.log('SimulationRun render state', this.state);

    const { chartData } = this.state;

    if (!chartData || !chartData.length || chartData.length === 0) {
      return null;
    }

    const leftNavItems = null;

    const defaultMeasurement =
      this.state.currentAsset.recordings &&
      this.state.currentAsset.recordings[0] &&
      this.state.currentAsset.recordings[0].name;

    const assetMeasurement = this.getAssetMeasurement(
      this.state.currentAsset,
      defaultMeasurement
    );

    console.log('combinedData');      


    const linesToAdd = ([
      {
        yAxisId: 'right',
        assetMeasurement,
        fill: '#4682b4',
        barSize: '20',
        type: 'Bar',
        fillOpacity: '.7'
      },
      {
        assetMeasurement: VULNERABILITY_MEASUREMENT,
        stroke: '#008000',
        strokeWidth: 3,
        yAxisId: 'left',
        type: 'Line'
      },
    ]);

    const mainItems = (
      <div>
        <Title
          text={`${this.state.currentAsset.name} (${
            this.state.currentAsset.properties.class
          }) - ${defaultMeasurement}`}
        />
        <div>{this.renderLineChartSimulationRun({
          // data: renderPoleData,
          data: chartData,
          lines: linesToAdd,
          // TODO: In the API, calculate the max values for each asset, 
          // then don't set the domain if the max is higher than the DEFAULT_YAXIS_DOMAIN
          domain: DEFAULT_YAXIS_DOMAIN
        })}</div>
        <div
          style={{
            marginTop: '30px',
            display: 'flex',
            flexWrap: 'wrap',
            WebkitFlexWrap: 'wrap' /* Safari 6.1+ */
          }}
        >
          <div style={{ flexGrow: 1, flexBasis: 0, minWidth: '600px' }}>
            {this.renderPoleVulnerabilityTable()}
          </div>
          <div style={{ flexGrow: 1, flexBasis: 0, minWidth: '600px' }}>
            {this.renderNetworkTopologyGraph()}
          </div>
        </div>
      </div>
    );

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
                selectedAssetDetailId={this.state.selectedAssetDetailId}
                allRunAssets={this.state.allRunAssets}
                runResultsData={this.state.runResultsData}
                simulationRunId={this.state.simulationRunId}
                mapResponseToBarChartData={this.mapResponseToBarChartData}
                mapResponseToChartData={this.mapResponseToChartData}
                getAssetMeasurement={this.getAssetMeasurement}
                renderLineChart={this.renderLineChart}
                getWindData={this.getWindData}
                navigateToAsset={this.navigateToAsset}
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(SimulationRun);
