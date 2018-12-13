/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import { Tabs } from 'antd';
import moment from 'moment';
import {
  LineChart,
  ComposedChart,
  Bar,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from 'recharts';
import './App.css';
import Layout from '../components/Layout';
import SimpleMap from '../components/SimpleMap';
import Asset from './Asset';
import Assets from '../components/Assets';
import Title from '../components/Title';
import simulationRuns from '../actions/simulationRuns';
import networkTopology from '../actions/networkTopology';
import NetworkTopology from '../components/d3/NetworkTopology/NetworkTopololgy';

const DEFAULT_API_VERSION = 'v1';
const DEFAULT_DIVIDER = '__';
const DEFAULT_YAXIS_DOMAIN = [0, 1.2];

const TabPane = Tabs.TabPane;
class SimulationRun extends Component {
  constructor(props) {
    super(props);

    const chartsConfiguration = {
      filtered_assets: ['meter', 'overhead_line', 'pole'],
      vulnerability_measurement: 'vulnerability',
      // The substation has to be mapped here
      selectionMappings: {
        substation_meter: 'node_14', // Asset List to Network Topology
        node_14: 'substation_meter' // Network Topology to Asset List
      },
      defaultFirstAssetSelected: 'substation_meter',
      defaultFirstMetricSelected: 'measured_real_power',
      defaultMetricClasses: [
        {
          class: 'meter',
          recording: 'measured_real_power'
        },
        {
          class: 'triplex-meter',
          recording: 'measured_real_power'
        },
        {
          class: 'transformer',
          recording: 'measured_real_power'
        },
        {
          class: 'substation',
          recording: 'measured_real_power'
        },
        {
          class: 'substation_meter',
          recording: 'measured_real_power'
        },
        {
          class: 'pole',
          recording: 'pole_stress'
        },
        {
          class: 'weather',
          recording: 'wind_speed'
        },
        {
          class: 'line',
          recording: 'power_out_real'
        }
      ],
      globalRecordings: [
        {
          id: 10000,
          is_measure: true,
          name: 'wind_speed',
          asset: 'weather',
          fullName: 'weather__wind_speed'
        }
      ],
      recordingLabels: [
        {
          name: 'vulnerability',
          label: 'Vulnerability Index  - pu',
          YAxisPosition: 'left'
        },
        {
          name: 'pole_stress',
          nameAlias: 'vulnerability_index',
          label: 'Vulnerability Index  - pu',
          YAxisPosition: 'left'
        },
        {
          name: 'critical_pole_stress',
          nameAlias: 'critical_vulnerability_index',
          label: 'Critical Vulnerability Index - pu',
          YAxisPosition: 'left'
        },
        {
          name: 'measured_real_power',
          label: 'Measured Real Power - W',
          YAxisPosition: 'left'
        },
        {
          name: 'measured_real_power',
          label: 'Measured Real Power - W',
          YAxisPosition: 'right'
        },
        {
          name: 'measured_reactive_power',
          label: 'Measured Reactive Power - W',
          YAxisPosition: 'left'
        },
        {
          name: 'wind_speed',
          label: 'Wind Speed - meters/sec',
          YAxisPosition: 'left'
        },
        {
          name: 'resisting_moment',
          label: 'Resisting Moment - ft*lb',
          YAxisPosition: 'left'
        },
        {
          name: 'total_moment',
          label: 'Total Moment - ft*lb',
          YAxisPosition: 'left'
        },
        {
          name: 'critical_wind_speed',
          label: 'Critical Wind Speed - meters/sec',
          YAxisPosition: 'left'
        },
        {
          name: 'susceptibility',
          label: 'Susceptibility - pu*s/m',
          YAxisPosition: 'left'
        },
        {
          name: 'pole_status',
          label: 'Pole Status - OK/FAILED',
          YAxisPosition: 'left'
        },
        {
          name: 'current_uptime',
          label: 'Current Uptime in Minutes',
          YAxisPosition: 'left'
        },
        {
          name: 'power_out_real',
          label: 'Power Out Real - W',
          YAxisPosition: 'left'
        }
      ]
    };
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
      chartsConfiguration,
      topologyMapSelectNode: null
    };

    this.handleAssetClick = this.handleAssetClick.bind(this);
    this.renderCharts = this.renderCharts.bind(this);
    this.checkUnderscoreKey = this.checkUnderscoreKey.bind(this);
    this.mapResponseToBarChartData = this.mapResponseToBarChartData.bind(this);
    this.getAssetMeasurement = this.getAssetMeasurement.bind(this);
    this.navigateToAsset = this.navigateToAsset.bind(this);
    this.handleAssetRowMouseEnter = this.handleAssetRowMouseEnter.bind(this);
    this.handleAssetRowMouseOut = this.handleAssetRowMouseOut.bind(this);
    this.handleTopologyMapAssetHover = this.handleTopologyMapAssetHover.bind(this);
    this.findDefaultAsset = this.findDefaultAsset.bind(this);
    this.getDefaultMeasurementForAsset = this.getDefaultMeasurementForAsset.bind(this);
    this.getLabelForRecording = this.getLabelForRecording.bind(this);
    this.getGlobalMeasurement = this.getGlobalMeasurement.bind(this);
    this.addGlobalMeasurements = this.addGlobalMeasurements.bind(this);
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
        console.log(
          ' this.state.chartsConfiguration',
          this.state.chartsConfiguration,
          allRunAssets
        );
        const defaultAsset = this.findDefaultAsset(allRunAssets, this.state.chartsConfiguration);
        console.log('defaultAsset', defaultAsset);
        currentAsset = defaultAsset;

        selectedAssetDetailId = currentAsset.id;
        this.setState({ currentAsset, allRunAssets, selectedAssetDetailId });
        return null;
      })
      .then(() =>
        simulationRuns.getSimulationRunResults({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: DEFAULT_API_VERSION,
          simulationRunId
        })
      )
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
        return { runResultsData };
      })
      .then(({ runResultsData }) => {
        console.log('Get Simulation Run Results data', 'simulationRunId', simulationRunId);
        this.setState({
          runResultsData,
          simulationRunId
        });
        return runResultsData;
      })
      .then(() =>
        networkTopology.getNetworkTopology({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: DEFAULT_API_VERSION
        })
      )
      .then(topologyData => {
        console.log('Topology network data', topologyData);
        if (!topologyData) {
          return Promise.reject(new Error('No network topology data received from the API.'));
        }

        this.setState({ networkTopologyData: topologyData });
        return null;
      })
      .then(() =>
        simulationRuns.getSimulationRunAllModelAssets({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: DEFAULT_API_VERSION,
          simulationRunId
        })
      )
      // TODO: This may belong in the API container
      .then(allModelAssets => {
        console.log('SimulationRun allModelAssets ', allModelAssets);
        if (!allModelAssets) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        this.setState({
          allModelAssets
        });
      })
      .then(() =>
        simulationRuns.getSimulationRunVulnerabilityAggByTimeStepResults({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: DEFAULT_API_VERSION,
          simulationRunId
        })
      )
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

  findDefaultAsset(assets, chartConfiguration) {
    return assets.find(asset => asset.name === chartConfiguration.defaultFirstAssetSelected);
  }

  getDefaultMeasurementForAsset(asset, chartConfiguration) {
    const recordingClass = chartConfiguration.defaultMetricClasses.find(
      classObj => classObj.class === asset.properties.class
    );
    console.log('recordingClass default found', recordingClass, asset.properties.class);
    if (recordingClass) {
      return recordingClass.recording;
    }
    return asset.recordings[0].name;
  }

  getAliasForRecording(selectedMeasurement, chartConfiguration) {
    const recordingLabel = chartConfiguration.recordingLabels.find(
      labelObj => labelObj.name === selectedMeasurement
    );
    console.log('getAliasForRecording default found', recordingLabel, selectedMeasurement);

    if (recordingLabel && recordingLabel.label) {
      return recordingLabel.label;
    }
    return selectedMeasurement;
  }

  getLabelForRecording(lines, yAxisLocation, selectedMeasurement, chartConfiguration) {
    const yAxisLeftLine = lines.find(line => line.yAxisId === yAxisLocation);
    const recordingLabel = chartConfiguration.recordingLabels.find(
      labelObj => labelObj.name === selectedMeasurement && labelObj.YAxisPosition === yAxisLocation
    );
    console.log(
      'getLabelForRecording default found',
      recordingLabel,
      yAxisLeftLine.assetMeasurement
    );
    if (recordingLabel && recordingLabel.label) {
      return recordingLabel.label;
    }
    return selectedMeasurement;
  }

  getGlobalMeasurement(measurement, chartsConfiguration) {
    return chartsConfiguration.globalRecordings.find(recording => recording.name === measurement);
  }

  addGlobalMeasurements(measurements, chartsConfiguration) {
    return measurements.concat(chartsConfiguration.globalRecordings);
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
        const vulnDataforTimestep = aggResultsValues.find(o => o.timestamp === row.timestamp);
        console.log('vuln timestamp', row.timestamp);
        if (vulnDataforTimestep) {
          newRow[this.state.chartsConfiguration.vulnerability_measurement] =
            vulnDataforTimestep.pole_stress;
          newRow[`${this.state.chartsConfiguration.vulnerability_measurement}_recording`] =
            vulnDataforTimestep.recording;
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

  renderLineChartAssetDetail({
    data,
    lines,
    domain,
    renderXaxis,
    chartsConfiguration,
    selectedMeasurement
  }) {
    if (!data || !data.length || data.length === 0) {
      return null;
    }

    console.log('renderLineChartAssetDetail', 'data', data, 'lines', lines, chartsConfiguration);

    const linesToRender = lines.map(line => (
      <Line
        key={line.assetMeasurement}
        type="monotone"
        dataKey={line.assetMeasurement}
        stroke={line.stroke}
        strokeDasharray={line.strokeDasharray}
        strokeWidth={line.strokeWidth}
        yAxisId="left"
        name={this.getLabelForRecording(lines, 'left', line.measurement, chartsConfiguration)}
      />
    ));
    // const bottomMargin = renderXaxis || renderXaxis == null ? 100 : 20;
    const bottomMargin = 100;

    console.log('***bottomMargin', bottomMargin);
    console.log('***linesToRender', linesToRender);
    let leftYAxis = '';
    const measureLabelLeft = this.getLabelForRecording(
      lines,
      'left',
      selectedMeasurement,
      chartsConfiguration
    );

    leftYAxis = (
      <YAxis
        yAxisId="left"
        orientation="left"
        label={{
          value: measureLabelLeft,
          angle: -90,
          position: 'outside',
          dx: -40
        }}
      />
    );
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
          <XAxis interval={0} tick={{ dy: 40 }} angle={-30} dataKey="timestamp" />
          {leftYAxis}
          <Legend verticalAlign="top" height={36} />
          <Tooltip />
        </LineChart>
      </div>
    );
  }

  renderLineChartSimulationRun({
    data, lines, domain, yAxisLeft, chartsConfiguration
  }) {
    if (!data || !data.length || data.length === 0) {
      return null;
    }

    console.log('renderLineChart', 'data', data, 'lines', lines);

    const linesToRender = lines.map(line => {
      let lineToAdd = null;
      if (line.type === 'Line') {
        lineToAdd = (
          <Line
            key={line.assetMeasurement}
            type="monotone"
            dataKey={line.assetMeasurement}
            stroke={line.stroke}
            strokeDasharray={line.strokeDasharray}
            strokeWidth={line.strokeWidth}
            yAxisId={line.yAxisId}
            name={this.getLabelForRecording(lines, 'left', line.measurement, chartsConfiguration)}
          />
        );
      } else {
        lineToAdd = (
          <Bar
            key={line.assetMeasurement}
            type="monotone"
            dataKey={line.assetMeasurement}
            fill={line.fill}
            barSize={line.barSize}
            fillOpacity={line.fillOpacity}
            yAxisId={line.yAxisId}
            name={this.getLabelForRecording(lines, 'right', line.measurement, chartsConfiguration)}
          />
        );
      }
      return lineToAdd;
    });
    // const bottomMargin = renderXaxis || renderXaxis == null ? 100 : 20;
    const bottomMargin = 60;

    console.log('***bottomMargin', bottomMargin);
    return (
      <div>
        <ComposedChart
          style={{ margin: '0 auto' }}
          margin={{
            top: 5,
            right: 40,
            bottom: bottomMargin,
            left: 20
          }}
          width={1300}
          height={260}
          data={data}
        >
          {linesToRender}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis interval={0} tick={{ dy: 40 }} angle={-30} dataKey="timestamp" />
          <YAxis
            domain={domain}
            yAxisId="left"
            label={{
              value: 'Vulnerability Index',
              dy: yAxisLeft.dy,
              angle: -90,
              position: 'insideLeft'
            }}
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
    //console.log('**assets', assets);
    return assets.filter(asset => (this.state.chartsConfiguration.filtered_assets.includes(asset.properties.class)
      ? asset.properties.class
      : null));
  }

  renderPoleVulnerabilityTable() {
    return (
      <Assets
       //className="border"
       //style={{height:'468px'}}
        data={this.filterAssetsTable(this.state.allRunAssets)}
        handleAssetClick={this.handleAssetClick}
        assetsList={this.state.chartsConfiguration.filtered_assets}
        handleAssetRowMouseEnter={this.handleAssetRowMouseEnter}
        handleAssetRowMouseOut={this.handleAssetRowMouseOut}
        selectNode={this.state.topologyMapSelectNode}
      />
    );
  }

  renderNetworkTopologyGraph() {
    const configuration = {
      nodeSelect: this.state.selectNode
      // nodeUnselect: this.state.unselectNode
    };
    return (
        <NetworkTopology
          style={{ marginTop: '0px' }}
          // handleError={this.renderErrorMessage}
          commonProps={this.props.commonProps}
          data={this.state.networkTopologyData}
          configuration={configuration}
          handleTopologyMapAssetHover={this.handleTopologyMapAssetHover}
        />
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
    this.setState({
      selectNode: this.state.chartsConfiguration.selectionMappings[record.name] || record.name
    });
  }

  handleAssetRowMouseOut(record) {
    console.log('handleAssetRowMouseOut', 'record', record);
    this.setState({
      selectNode: null
    });
  }

  handleTopologyMapAssetHover(assetNode) {
    console.log('handleTopologyMapAssetHover', 'assetNode', assetNode);
    let assetNodeName = null;
    if (assetNode && assetNode.name) {
      assetNodeName =
        this.state.chartsConfiguration.selectionMappings[assetNode.name] || assetNode.name;
    }
    this.setState({ topologyMapSelectNode: assetNodeName });
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
      this.state.chartsConfiguration.defaultFirstMetricSelected;

    const assetMeasurement = this.getAssetMeasurement(this.state.currentAsset, defaultMeasurement);

    console.log('combinedData');

    const linesToAdd = [
      {
        yAxisId: 'right',
        assetMeasurement,
        measurement: defaultMeasurement,
        fill: '#4682b4',
        //barSize: '20',
        type: 'Bar',
        fillOpacity: '.7'
      },
      {
        assetMeasurement: this.state.chartsConfiguration.vulnerability_measurement,
        measurement: this.state.chartsConfiguration.vulnerability_measurement,
        stroke: '#008000',
        strokeWidth: 3,
        yAxisId: 'left',
        type: 'Line'
      }
    ];

    const mainItems = (
      <div>
        {/* <Title
          text={`${this.state.currentAsset.name} (${
            this.state.currentAsset.properties.class
          }) - ${defaultMeasurement}`}
        /> */}
        <Title
          text="
          Network Power and Vulnerability"
        />
        <div>
          {this.renderLineChartSimulationRun({
            // data: renderPoleData,
            data: chartData,
            lines: linesToAdd,
            // TODO: In the API, calculate the max values for each asset,
            // then don't set the domain if the max is higher than the DEFAULT_YAXIS_DOMAIN
            domain: DEFAULT_YAXIS_DOMAIN,
            chartsConfiguration: this.state.chartsConfiguration,
            yAxisLeft: { dy: 40 }
          })}
        </div>
        <div
        className="border"
          style={{
            height: '532px',
            marginTop: '0px',
            display: 'flex',
            flexWrap: 'wrap',
            textAlign: 'left',
            WebkitFlexWrap: 'wrap' /* Safari 6.1+ */
          }}
        >
          <div style={{ flexGrow: 1, flexBasis: 0, minWidth: '800px', minHeight: '600px', maxHeight: '600px', maxWidth: '800px' }}>
            {this.renderPoleVulnerabilityTable()}
          </div>
          <div style={{ flexGrow: 1, flexBasis: 0, minWidth: '800px', minHeight: '600px', maxHeight: '600px', maxWidth: '800px'}}>
            <Tabs tabPosition="top" type="card" style={{ textAlign: 'left'}}>
              <TabPane tab="Map" key="1">
                <SimpleMap allModelAssets={this.state.allModelAssets} />    
              </TabPane>
              <TabPane tab="Network" key="2">
                {this.renderNetworkTopologyGraph()}
              </TabPane>
              <TabPane tab="OMF" key="3">
              &nbsp;&nbsp;&nbsp;OMF Rendered Image goes here
              </TabPane>
            </Tabs>
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
                renderLineChartAssetDetail={this.renderLineChartAssetDetail}
                getWindData={this.getWindData}
                navigateToAsset={this.navigateToAsset}
                chartsConfiguration={this.state.chartsConfiguration}
                getDefaultMeasurementForAsset={this.getDefaultMeasurementForAsset}
                getLabelForRecording={this.getLabelForRecording}
                getGlobalMeasurement={this.getGlobalMeasurement}
                addGlobalMeasurements={this.addGlobalMeasurements}
                getAliasForRecording={this.getAliasForRecording}
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(SimulationRun);
