/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import { Tabs, Row, Col } from 'antd';
import moment from 'moment';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './App.css';
import SimpleMap from '../components/SimpleMap';
import OMFTopologyMap from '../components/OMFTopologyMap';
import Asset from './Asset';
import Assets from '../components/Assets';
import simulationRuns from '../actions/simulationRuns';
import Measurements from '../components/Measurements';
import omf from '../actions/omf';
import networkTopology from '../actions/networkTopology';
import NetworkTopology from '../components/d3/NetworkTopology/NetworkTopololgy';
import SimulationRunHeader from './SimulationRunHeader';
import SimulationRunNotCompleted from '../components/SimulationRunNotCompleted';
import chartsConfiguration from './Configuration';

const DEFAULT_DIVIDER = '__';
const DEFAULT_YAXIS_DOMAIN = [0, 1.2];
const DEFAULT_SIMULATION_RUN_STATUS_COMPLETED = 4;
const DEFAULT_ANTICIPATION = 'anticipation';

const TabPane = Tabs.TabPane;

class SimulationRun extends Component {
  constructor(props) {
    super(props);

    this.emptyState = {
      calledApi_omfTopologyImage: false,
      calledApi_allModelAssets: false,
      calledApi_currentAsset: false,
      calledApi_allRunAssets: false,
      calledApi_selectedAssetDetailId: false,
      calledApi_chartData: false,
      calledApi_networkTopologyData: false,
      selectedRightYAxisMeasurement: null,
      currentAsset: null,
      selectedAssetDetailId: null,
      allRunAssets: null,
      runResultsData: [],
      networkTopologyData: {},
      selectNode: null,
      chartVulrunAggResultsResponseDatanerabilityAggData: [],
      chartData: [],
      chartsConfiguration,
      topologyMapSelectNode: null,
      omfTopologyImage: null,
      vulnerabilityBands: {
        low: [],
        medium: [],
        high: []
      }
      /* currentSimulationRunRequestMetadata: null */
    };
    this.state = { ...this.emptyState };

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
    this.getUnitForRecording = this.getUnitForRecording.bind(this);
    this.getGlobalMeasurement = this.getGlobalMeasurement.bind(this);
    this.addGlobalMeasurements = this.addGlobalMeasurements.bind(this);
    this.postSimulationSubmission = this.postSimulationSubmission.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.roundToTwo = this.roundToTwo.bind(this);
    this.getChartInterval = this.getChartInterval.bind(this);
    this.handleMeasurementClick = this.handleMeasurementClick.bind(this);
    this.formatYAxis = this.formatYAxis.bind(this);
  }

  componentDidMount() {
    console.log('SimulationRun componentDidMount');
    console.log('SimulationRun componentDidMount');

    // Only force open the category on the initial load
		/*     if (this.props.match.params.simulationRunId) {
					this.props.openCategory(DEFAULT_ANTICIPATION);
				}
				if (_.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
					return null;
				}
				if (
					!this.props.getCurrentSimulationRunRequestMetadata(this.props.match.params.simulationRunId)
				) {
					return;
				}
	
				this.populateSimulationRun(); */
  }

  checkAllApiStates(status) {
    if (
      this.state.calledApi_omfTopologyImage === status &&
      this.state.calledApi_allModelAssets === status &&
      this.state.calledApi_currentAsset === status &&
      this.state.calledApi_allRunAssets === status &&
      this.state.calledApi_selectedAssetDetailId === status &&
      this.state.calledApi_chartData === status &&
      this.state.calledApi_networkTopologyData === status
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      'SimulationRun 1componentDidUpdate this.props',
      this.props,
      'this.state.currentAsset',
      this.state.currentAsset,
      'this.state',
      this.state
    );

    // When creating a simulation, don't try to pull one up
    if (!this.props.match.params.simulationRunId) {
      console.log('SimulationRun 1componentDidUpdate 1', 'New simulation being created');
      if (!this.checkAllApiStates(false)) {
        // Good proxy for checking whether everything has already been cleared out
        return this.clearState(); // Clear out previous simulation run when creating a new one
      }
    }

    if (this.props.match.params.simulationRunId !== prevProps.match.params.simulationRunId) {
      console.log(
        'SimulationRun 1componentDidUpdate 2',
        'Simulation Run ID has changed, clearing state'
      );
      return this.clearState();
    }
    if (this.checkAllApiStates(true) && this.props.forceRefreshSimulationRun) {
      console.log(
        'SimulationRun 1componentDidUpdate 3',
        'Simulation Run ID is the same and all API calls have completed. This must be a refresh request'
      );
      return this.clearState();
    }

    if (_.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
      console.log('SimulationRun 1componentDidUpdate 4', 'Metadata is empty');
      return;
    }

    const currentSimulationRunRequestMetadata = this.props.getCurrentSimulationRunRequestMetadata(
      this.props.match.params.simulationRunId
    );
    if (!currentSimulationRunRequestMetadata) {
      console.log(
        'SimulationRun 1componentDidUpdate 5',
        'Current simulation run metadata is empty'
      );
      return;
    }
    // / Simulation Run ID populated at this point

    if (!(this.checkAllApiStates(false) || this.checkAllApiStates(true))) {
      console.log(
        'SimulationRun 1componentDidUpdate 6',
        'Not all API calls have returned',
        this.state
      );
      return;
    }

    this.updateSelectedSimulationRunId();
    if (currentSimulationRunRequestMetadata.status !== DEFAULT_SIMULATION_RUN_STATUS_COMPLETED) {
      console.log(
        'SimulationRun 1componentDidUpdate 7',
        'The simulation run status is not completed'
      );
      return null;
    }

    console.log(
      'SimulationRun componentDidUpdate this.props',
      this.props,
      'this.state.currentAsset',
      this.state.currentAsset,
      'this.state',
      this.state
    );

    console.log('SimulationRun 1componentDidUpdate 8', 'Attempt to call APIs');
    this.populateSimulationRun();
  }

  updateSelectedSimulationRunId() {
    console.log(
      'SimulationRun updateSelectedSimulationRunId',
      this.props.match.params.simulationRunId
    );
    if (!this.props.match.params.simulationRunId) {
      return this.props.updateSelectedSimulationRunId(null);
    }
    const parsedSimulationRunId = parseInt(this.props.match.params.simulationRunId, 10);
    if (isNaN(parsedSimulationRunId)) {
      return this.props.commonProps.handleError(new Error('Simulation Run ID must be numeric'));
    }
    console.log('***', parsedSimulationRunId);
    this.props.updateSelectedSimulationRunId(parsedSimulationRunId);
  }

  clearState(stateChanges) {
    console.log('SimulationRun clearState');
    this.props.commonProps.handleError(null);
    this.updateSelectedSimulationRunId(null);
    if (this.props.forceRefreshSimulationRun) {
      this.props.setForceRefreshSimulationRun(false);
    }
    stateChanges = stateChanges || {};
    this.setState({ ...this.emptyState, ...stateChanges });
  }

  populateSimulationRun() {
    let currentAsset;
    let selectedAssetDetailId;

    this.props.openCategory(DEFAULT_ANTICIPATION);

    if (this.props.forceRefreshSimulationRun) {
      this.props.setForceRefreshSimulationRun(false);
    }

    const { simulationRunId } = this.props.match.params;
    console.log(
      '1populateSimulationRun',
      simulationRunId,
      'this.props.',
      this.props,
      'this.state',
      this.state
    );

    if (!this.state.calledApi_omfTopologyImage) {
      this.setState({ calledApi_omfTopologyImage: true });
      console.log('SimulationRun omfTopologyImage1', this.state);
      omf
        .getOMFTopologyImage({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: this.state.chartsConfiguration.api.version,
          simulationRunId
        })
        // TODO: This may belong in the API container
        .then(omfTopologyImage => {
          console.log('SimulationRun omfTopologyImage1 result this.state', this.state);
          if (!omfTopologyImage) {
            return Promise.reject(
              new Error('No data received from the API for the OMF Topology graph.')
            );
          }
          this.setState({
            omfTopologyImage
          });
        })
        .catch(err => {
          console.error(err);
          console.log('Error', err);
          if (err.response && err.response.data && err.response.data.message) {
            err = new verror.VError(err, err.response.data.message);
          }
          this.props.commonProps.handleError(err);
        });
    }

    if (!this.state.calledApi_allModelAssets) {
      this.setState({ calledApi_allModelAssets: true });
      // TODO: Get the Simulation Run / Update the Status/details
      simulationRuns
        .getSimulationRunAllModelAssets({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: this.state.chartsConfiguration.api.version,
          simulationRunId
        })
        // TODO: This may belong in the API container
        .then(allModelAssets => {
          console.log('SimulationRun allModelAssets ', allModelAssets, this.state);
          if (!allModelAssets) {
            return Promise.reject(new Error('No data received from the API.'));
          }
          this.setState({
            allModelAssets
          });
        })
        .catch(err => {
          console.error(err);
          console.log('Error', err);
          if (err.response && err.response.data && err.response.data.message) {
            err = new verror.VError(err, err.response.data.message);
          }
          this.props.commonProps.handleError(err);
        });
    }

    if (
      !this.state.calledApi_currentAsset ||
      !this.state.calledApi_allRunAssets ||
      !this.state.calledApi_selectedAssetDetailId
    ) {
      this.setState({
        calledApi_currentAsset: true,
        calledApi_allRunAssets: true,
        calledApi_selectedAssetDetailId: true
      });
      simulationRuns
        .getSimulationRunAssets({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: this.state.chartsConfiguration.api.version,
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
          this.createVulnerabilityBands(allRunAssets);
          console.log(
            ' this.state.chartsConfiguration',
            this.state.chartsConfiguration,
            allRunAssets
          );
          const defaultAsset = this.findDefaultAsset(allRunAssets, this.state.chartsConfiguration);
          console.log('defaultAsset', defaultAsset);
          currentAsset = defaultAsset;

          selectedAssetDetailId = currentAsset.id;

          const defaultMeasurementForAsset = this.getDefaultMeasurementForAsset(
            currentAsset,
            this.state.chartsConfiguration
          );
          console.log('populateSimulationRun defaultMeasurement', defaultMeasurementForAsset);
          this.setState({
            currentAsset,
            allRunAssets,
            selectedAssetDetailId,
            selectedRightYAxisMeasurement: defaultMeasurementForAsset
          });

          return null;
        })
        .catch(err => {
          console.error(err);
          console.log('Error', err);
          if (err.response && err.response.data && err.response.data.message) {
            err = new verror.VError(err, err.response.data.message);
          }
          this.props.commonProps.handleError(err);
        });
    }

    if (!this.state.calledApi_chartData) {
      this.setState({ calledApi_chartData: true });
      simulationRuns
        .getSimulationRunResults({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: this.state.chartsConfiguration.api.version,
          simulationRunId
        })
        // TODO: This may belong in the API container
        .then(runResultsData => {
          console.log(
            'SimulationRun populateSimulationRun get simulation run results',
            runResultsData
          );
          if (!runResultsData) {
            return Promise.reject(new Error('No data received from the API.'));
          }
          this.setState({
            runResultsData
          });
          return runResultsData;
        })
        .then(runResultsData => simulationRuns
          .getSimulationRunVulnerabilityAggByTimeStepResults({
            baseUrl: this.props.commonProps.apiPath,
            apiVersion: this.state.chartsConfiguration.api.version,
            simulationRunId
          })
          .then(runAggResultsResponseData => ({ runAggResultsResponseData, runResultsData })))
        // TODO: This may belong in the API container
        .then(({ runAggResultsResponseData, runResultsData }) => {
          console.log(
            'SimulationRun getSimulationRunVulnerabilityAggByTimeStepResults ',
            runAggResultsResponseData
          );
          if (!runAggResultsResponseData) {
            return Promise.reject(new Error('No data received from the API.'));
          }
          const chartData = this.mapResultsAndVulnerabilityToChartData(
            runResultsData,
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
        });
    }

    // TODO: This could be combined with the parsed GLM model call (all_model_assets) since the table is the same
    if (!this.state.calledApi_networkTopologyData) {
      this.setState({ calledApi_networkTopologyData: true });
      networkTopology
        .getNetworkTopology({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: this.state.chartsConfiguration.api.version,
          simulationRunId
        })
        .then(topologyData => {
          console.log('Topology network data', topologyData);
          if (!topologyData) {
            return Promise.reject(new Error('No network topology data received from the API.'));
          }

          this.setState({ networkTopologyData: topologyData });
          return null;
        })
        .catch(err => {
          console.error(err);
          console.log('Error', err);
          if (err.response && err.response.data && err.response.data.message) {
            err = new verror.VError(err, err.response.data.message);
          }
          this.props.commonProps.handleError(err);
        });
    }
  }

  createVulnerabilityBands(allRunAssets) {
    console.log('SimulationRun createVulnerabilityBands allRunAssets', allRunAssets);
    const vulnerabilityBands = {
      low: [],
      medium: [],
      high: []
    };
    allRunAssets.forEach(asset => {
      // console.log('1Adding asset',asset)
      const peakVulnerabilityObj = asset.calculated_recordings.find(obj => {
        if (obj.name === 'peak_vulnerability') {
          return obj;
        }
      });
      console.log('1Adding peakVulnerabilityObj', peakVulnerabilityObj);
      if (!peakVulnerabilityObj || !peakVulnerabilityObj.value) {
        // console.log('1Adding no vulnerability', asset, asset.name);
        return;
      }
      if (peakVulnerabilityObj.value < this.state.chartsConfiguration.vulnerabilityBands.low) {
        // vulnerabilityBands.low.push(asset.name);
      } else if (
        peakVulnerabilityObj.value < this.state.chartsConfiguration.vulnerabilityBands.medium
      ) {
        // console.log('1Adding medium asset',asset, asset.name)
        vulnerabilityBands.medium.push(asset.name);
      } else {
        // console.log('1Adding high asset',asset, asset.name)
        vulnerabilityBands.high.push(asset.name);
      }
    });
    console.log('1Adding Setting state vulnerabilityBands', vulnerabilityBands);
    this.setState({ vulnerabilityBands });
  }

  getAssetMeasurement(asset, measurement) {
    if (!asset || !measurement) {
      return null;
    }
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
    console.log(
      'getLabelForRecording',
      lines,
      yAxisLocation,
      selectedMeasurement,
      'chartConfiguration',
      chartConfiguration,
      'chartConfiguration.recordingLabels',
      chartConfiguration.recordingLabels
    );
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

  getUnitForRecording(lines, yAxisLocation, selectedMeasurement, chartConfiguration) {
    console.log('getLabelForRecording', lines, yAxisLocation, selectedMeasurement);
    const yAxisLeftLine = lines.find(line => line.yAxisId === yAxisLocation);
    const recordingLabel = chartConfiguration.recordingLabels.find(
      labelObj => labelObj.name === selectedMeasurement && labelObj.YAxisPosition === yAxisLocation
    );
    console.log(
      'getLabelForRecording default found',
      recordingLabel,
      yAxisLeftLine.assetMeasurement
    );
    if (recordingLabel && recordingLabel.unit) {
      return ` ${recordingLabel.unit}`;
    }
    return '';
  }

  getGlobalMeasurement(measurement, chartsConfiguration) {
    return chartsConfiguration.globalRecordings.find(recording => recording.name === measurement);
  }

  addGlobalMeasurements(measurements, chartsConfiguration) {
    return measurements.concat(chartsConfiguration.globalRecordings);
  }

  postSimulationSubmission(data) {
    console.log('SimulationRun data', data);
    // TODO: Add message to user
    // this.clearState();
    this.setState({ sendingSimulationRunRequest: true });
    return (
      simulationRuns
        .postSimulationRunSubmission({
          baseUrl: this.props.commonProps.apiPath,
          apiVersion: this.state.chartsConfiguration.api.version,
          data
        })
        .then(response => this.props
          .refreshSimulationRuns()
          .then(refreshRunResponse => ({ response, refreshRunResponse })))
        .then(({ response }) => {
          console.log('Simulation Run Submission Response', response);
          this.props.openCategory(DEFAULT_ANTICIPATION);
          this.props.history.push({
            pathname: `/simulation-runs/${response.simulation_run_id.toString()}`
          });
        })
        // TODO: Add error to page
        .catch(err => {
          this.props.commonProps.handleError(err);
        })
        .finally(() => {
          this.setState({ sendingSimulationRunRequest: false });
        })
    );
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
    console.log('SimulationRun mapResponseToChartData data', data, 'staticValues', staticValues);
    const mappedData = data.map(row => {
      const newRow = {
        ...row,
        timestamp: moment(row.timestamp).format('MM-DD-YY HH:mm'),
        timestamp_unix_epoch: moment(row.timestamp).unix()
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
    console.log(
      'SimulationRun mapResultsAndVulnerabilityToChartData data',
      data,
      'aggResultsValues',
      aggResultsValues
    );
    const mappedData = data.map(row => {
      const newRow = {
        ...row,
        timestamp: moment(row.timestamp).format('MM-DD-YY HH:mm')
      };
      if (aggResultsValues) {
        const vulnDataforTimestep = aggResultsValues.find(o => o.timestamp === row.timestamp);
        // console.log('vuln timestamp', row.timestamp);
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

  formatXAxis(tickItem) {
    console.log('formatXAxis');
    return moment(tickItem).format('MMM Do YY');
  }

  roundToTwo(num) {
    return +`${Math.round(`${num}e+2`)}e-2`;
  }

  getChartInterval(data) {
    const tickNumberToShow = 4;
    const tickOffset = data.length - tickNumberToShow;
    const xaxisInterval = Math.round(tickOffset / tickNumberToShow);
    return xaxisInterval;
  }

  formatYAxis(e) {
    if (
      selectedRightYAxisMeasurement === 'measured_real_power' ||
      selectedRightYAxisMeasurement === 'measured_reactive_power' ||
      selectedRightYAxisMeasurement === 'power_out___real' ||
      selectedRightYAxisMeasurement === 'power_in___real'
    ) {
      return (value / 1000).toFixed(3);
    }
    console.log('{measureUnitRightvalue}', value);
    return value;
  }

  renderLineChartAssetDetail({
    data,
    lines,
    domain,
    renderXaxis,
    chartsConfiguration,
    selectedMeasurement,
    selectedRightYAxisMeasurement
  }) {
    if (!data || !data.length || data.length === 0) {
      return null;
    }

    console.log('renderLineChartAssetDetail', 'data', data, 'lines', lines, chartsConfiguration);
    const linesToRender = lines.map(line => {
      let lineToAdd = null;
      if (line.type === 'Line') {
        lineToAdd = (
          <Line
            key={line.assetMeasurement}
            type="monotone"
            dot={false}
            dataKey={line.assetMeasurement}
            stroke={line.stroke}
            strokeDasharray={line.strokeDasharray}
            strokeWidth={line.strokeWidth}
            yAxisId={line.yAxisId}
            name={this.getLabelForRecording(
              lines,
              line.yAxisId,
              line.measurement,
              chartsConfiguration
            )}
          />
        );
      } else {
        console.log('renderLineChartAssetDetail', 'line', line);
        lineToAdd = (
          <Bar
            key={line.assetMeasurement}
            type="monotone"
            dataKey={line.assetMeasurement}
            fill={line.fill}
            barSize={30}
            fillOpacity={line.fillOpacity}
            yAxisId={line.yAxisId}
            name={this.getLabelForRecording(lines, 'right', line.measurement, chartsConfiguration)}
          />
        );
      }
      return lineToAdd;
    });
    // const bottomMargin = renderXaxis || renderXaxis == null ? 100 : 20;
    const bottomMargin = 100;

    console.log('***bottomMargin', bottomMargin);
    console.log('***linesToRender', linesToRender, 'chartsConfiguration', chartsConfiguration);
    let leftYAxis = '';
    let rightYAxis = '';

    const measureLabelLeft = this.getLabelForRecording(
      lines,
      'left',
      selectedMeasurement,
      chartsConfiguration
    );

    const measureUnitLeft = this.getUnitForRecording(
      lines,
      'left',
      selectedMeasurement,
      chartsConfiguration
    );

    console.log('***measureLabelLeft', measureLabelLeft, selectedMeasurement);

    leftYAxis = (
      <YAxis
        yAxisId="left"
        orientation="left"
        unit={measureUnitLeft}
        tickFormatter={value => {
          console.log(`tickFormatterLeft: ${selectedMeasurement}`);
          if (
            selectedMeasurement === 'measured_real_power' ||
            selectedMeasurement === 'measured_reactive_power' ||
            selectedMeasurement === 'power_out_real' ||
            selectedMeasurement === 'power_out___real' ||
            selectedMeasurement === 'power_in___real'
          ) {
            return (value / 1000).toFixed(3);
          }
          if (
            selectedMeasurement.indexOf('vulnerability') > -1 ||
            selectedMeasurement.indexOf('pole_stress') > -1
          ) {
            console.log('{tickFormatterLeft}', value);
            return value.toFixed(2);
          }
          return value;
        }}
        tick={{ fontSize: 9 }}
        label={{
          value: measureLabelLeft,
          position: 'top',
          dx: 2,
          dy: -4
        }}
      />
    );
    let measureLabelRight = '';
    let measureUnitRight = '';
    if (selectedRightYAxisMeasurement) {
      measureLabelRight = this.getLabelForRecording(
        lines,
        'right',
        selectedRightYAxisMeasurement,
        chartsConfiguration
      );

      measureUnitRight = this.getUnitForRecording(
        lines,
        'right',
        selectedRightYAxisMeasurement,
        chartsConfiguration
      );

      rightYAxis = (
        <YAxis
          yAxisId="right"
          width={100}
          orientation="right"
          tick={{ fontSize: 10 }}
          unit={measureUnitRight}
          tickFormatter={value => {
            console.log(
              '{measureUnitRight}|',
              measureUnitRight,
              '|',
              selectedRightYAxisMeasurement
            );
            if (
              selectedRightYAxisMeasurement === 'measured_real_power' ||
              selectedRightYAxisMeasurement === 'measured_reactive_power' ||
              selectedRightYAxisMeasurement === 'power_out___real' ||
              selectedRightYAxisMeasurement === 'power_in___real'
            ) {
              console.log('{measureUnitRightconvert}', measureUnitRight);
              return (value / 1000).toFixed(3);
            }
            console.log('{measureUnitRightvalue}', value);
            return value;
          }}
          label={{
            value: measureLabelRight,
            position: 'top',
            dx: -10,
            dy: -2
          }}
        />
      );
    } else {
      // this is to prevent chart jumping around when we select a measure for th efirst time!
      rightYAxis = (
        <YAxis
          yAxisId="right"
          width={100}
          orientation="right"
          tick={{ fontSize: 10 }}
          label={{
            value: '',
            position: 'top',
            dx: -10,
            dy: -2
          }}
        />
      );
    }

    console.log(
      '{linesToRender}',
      linesToRender,
      'leftYAxis',
      leftYAxis,
      'rightYAxis',
      rightYAxis,
      'measureLabelRight',
      measureLabelRight
    );
    console.log('data to render', data, data.length);

    // 4 ticks is the first one that is hidden plus the 3 we want to show.
    const tickNumberToShow = 4;
    const tickOffset = data.length - tickNumberToShow;
    const xaxisInterval = Math.round(tickOffset / tickNumberToShow);
    console.log('data to render', data, data.length, 'xaxisInterval', xaxisInterval);
    return (
      <div>
        <ResponsiveContainer width="98%" height={260}>
          <ComposedChart
            margin={{
              left: 15,
              top: 20,
              bottom: 30
            }}
            data={data}
          >
            {linesToRender}
            <XAxis
              domain={['auto', 'auto']}
              interval={xaxisInterval}
              tickFormatter={unixTime => `${+`${Math.round(
                `${moment
                  .duration(moment(unixTime).diff(moment(data[0].timestamp)))
                  .asHours()}e+2`
              )}e-2`} Hours`
              }
              dataKey="timestamp"
              label={{
                value: 'Elapsed Time',
                dx: 60,
                dy: -4,
                position: 'left'
              }}
              fontSize={10}
              padding={{ left: 0, right: 0 }}
            />
            {leftYAxis}
            {rightYAxis}
            <Legend
              iconType="plainline"
              verticalAlign="bottom"
              align="left"
              height={26}
              wrapperStyle={{
                fontSize: '10px',
                paddingLeft: '60px'
              }}
            />
            <Tooltip
              formatter={(value, b, c) => {
                console.log('{TooltipmeasureUnitRight}|', measureUnitRight, '|');
                console.log('{TooltipmeasureUnitRightValues}|', value, '|b', b, 'c', c);
                if (
                  c.dataKey.indexOf('measured_real_power') > -1 ||
                  c.dataKey.indexOf('measured_reactive_power') > -1 ||
                  c.dataKey.indexOf('power_out___real') > -1 ||
                  c.dataKey.indexOf('power_in___real') > -1
                ) {
                  console.log('{TooltipmeasureUnitRightconvert}', measureUnitRight);
                  let formValue = (value / 1000).toFixed(3);
                  formValue = `${formValue} ${measureUnitRight}`;
                  return formValue;
                }
                if (c.dataKey.indexOf('vulnerability') > -1) {
                  console.log('{TooltipmeasureUnitRightvalue}', value);
                  return value.toFixed(2);
                }
                return value;
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  renderLineChartSimulationRun({
    data,
    lines,
    domain,
    yAxisLeft,
    chartsConfiguration,
    selectedRightYAxisMeasurement
  }) {
    console.log('renderLineChart', 'data', data, 'lines', lines);

    const linesToRender = lines.map(line => {
      let lineToAdd = null;
      if (line.type === 'Line') {
        lineToAdd = (
          <Line
            key={line.assetMeasurement}
            type="monotone"
            dot={false}
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
            yAxisId={line.yAxisId}
            type="monotone"
            dataKey={line.assetMeasurement}
            fill={line.fill}
            barSize={30}
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

    const assetMeasurement = this.getAssetMeasurement(
      this.state.currentAsset,
      this.state.selectedMeasurement
    );

    let measureLabelRight = '';
    let measureUnitRight = '';
    if (this.state.selectedRightYAxisMeasurement) {
      measureLabelRight = this.getLabelForRecording(
        lines,
        'right',
        this.state.selectedRightYAxisMeasurement,
        chartsConfiguration
      );

      measureUnitRight = this.getUnitForRecording(
        lines,
        'right',
        this.state.selectedRightYAxisMeasurement,
        chartsConfiguration
      );
    }

    const combinedData = this.mapResponseToChartData(data);

    console.log(
      'combinedData',
      combinedData,
      'this.props.chartsConfiguration',
      this.state.chartsConfiguration,
      this.state.chartsConfiguration.recordingLabels
    );

    // console.log('***bottomMargin', bottomMargin);
    return (
      <div>
        <ResponsiveContainer width="98%" height={260}>
          <ComposedChart
            style={{ margin: '0 auto' }}
            margin={{
              left: 15,
              top: 20,
              bottom: 30
            }}
            width={1200}
            height={260}
            data={data}
          >
            {linesToRender}
            <XAxis
              domain={['auto', 'auto']}
              interval={this.getChartInterval(data)}
              tickFormatter={unixTime => `${+`${Math.round(
                `${moment
                  .duration(moment(unixTime).diff(moment(data[0].timestamp)))
                  .asHours()}e+2`
              )}e-2`} Hours`
              }
              dataKey="timestamp"
              label={{
                value: 'Elapsed Time',
                dx: 60,
                dy: -4,
                position: 'left'
              }}
              fontSize={10}
              padding={{ left: 0, right: 0 }}
            />
            <YAxis
              domain={domain}
              yAxisId="left"
              tickFormatter={value => value.toFixed(2)}
              label={{
                value: 'Peak Vulnerability',
                dx: 2,
                dy: -4,
                position: 'top'
              }}
            />
            <YAxis
              yAxisId="right"
              width={100}
              orientation="right"
              tick={{ fontSize: 10 }}
              unit={measureUnitRight}
              tickFormatter={value => {
                console.log(
                  '{measureUnitRight}|',
                  measureUnitRight,
                  '|',
                  this.state.selectedRightYAxisMeasurement
                );
                if (
                  this.state.selectedRightYAxisMeasurement === 'measured_real_power' ||
                  this.state.selectedRightYAxisMeasurement === 'measured_reactive_power'
                ) {
                  console.log('{measureUnitRightconvert}', measureUnitRight);
                  return (value / 1000).toFixed(3);
                }
                if (this.state.selectedRightYAxisMeasurement.indexOf('vulnerability') > -1) {
                  console.log('{TooltipmeasureUnitRightvalue}', value);
                  return value.toFixed(2);
                }
                return value;
              }}
              label={{
                value: measureLabelRight,
                position: 'top',
                dx: -10,
                dy: -2
              }}
            />
            <Legend
              iconType="plainline"
              verticalAlign="bottom"
              align="left"
              height={26}
              wrapperStyle={{
                fontSize: '10px',
                paddingLeft: '60px'
              }}
            />
            <Tooltip
              formatter={(value, b, c) => {
                console.log('{TooltipmeasureUnitRight}|', measureUnitRight, '|');
                console.log('{TooltipmeasureUnitRightValues}|', value, '|b', b, 'c', c);
                if (
                  c.dataKey.indexOf('measured_real_power') > -1 ||
                  c.dataKey.indexOf('measured_reactive_power') > -1 ||
                  c.dataKey.indexOf('power_out___real') > -1 ||
                  c.dataKey.indexOf('power_in___real') > -1
                ) {
                  console.log('{TooltipmeasureUnitRightconvert}', measureUnitRight);
                  let formValue = (value / 1000).toFixed(3);
                  formValue = `${formValue} ${measureUnitRight}`;
                  return formValue;
                }
                if (c.dataKey.indexOf('vulnerability') > -1) {
                  console.log('{TooltipmeasureUnitRightvalue}', value);
                  return value.toFixed(2);
                }
                return value;
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  filterAssetsTable(assets) {
    // console.log('**assets', assets);
    return assets.filter(asset => (this.state.chartsConfiguration.filtered_assets.includes(asset.properties.class)
      ? asset.properties.class
      : null));
  }

  renderPoleVulnerabilityTable() {
    if (!this.state.allRunAssets || !this.state.chartsConfiguration.filtered_assets) {
      return null;
    }
    return (
      <Assets
        // className="border"
        // style={{height:'468px'}}
        data={this.filterAssetsTable(this.state.allRunAssets)}
        handleAssetClick={this.handleAssetClick}
        assetsList={this.state.chartsConfiguration.filtered_assets}
        handleAssetRowMouseEnter={this.handleAssetRowMouseEnter}
        handleAssetRowMouseOut={this.handleAssetRowMouseOut}
        selectNode={this.state.topologyMapSelectNode}
        selectionBands={this.state.vulnerabilityBands}
      />
    );
  }

  renderNetworkTopologyGraph() {
    if (!this.state.networkTopologyData) {
      return null;
    }
    const configuration = {
      nodeSelect: this.state.selectNode,
      selectionBands: this.state.vulnerabilityBands
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
    console.log(
      'handleTopologyMapAssetHover setting topologyMapSelectNode assetNodeName',
      assetNodeName
    );
    this.setState({ topologyMapSelectNode: assetNodeName });
  }

  handleMeasurementClick(e) {
    console.log('Run handleMeasurementClick value', e.currentTarget.getAttribute('value'));

    const selectedRightYAxisMeasurement = e.currentTarget.getAttribute('value');

    console.log('handleMeasurementClick setting currentMeasurement', selectedRightYAxisMeasurement);
    this.setState({ selectedRightYAxisMeasurement });
  }

  renderSimulationRunHeader(currentSimulationRunRequestMetadata) {
    // We need the header if:
    // 1) We're on the simulation create page (no current metadata)
    // 2) We on a current simulation and it has completed
    if (
      !_.isEmpty(currentSimulationRunRequestMetadata) &&
      currentSimulationRunRequestMetadata.status !== DEFAULT_SIMULATION_RUN_STATUS_COMPLETED
    ) {
      return null;
    }
    const simulationRunId = this.props.match.params.simulationRunId
      ? parseInt(this.props.match.params.simulationRunId, 10)
      : null;
    return (
      <SimulationRunHeader
        commonProps={this.props.commonProps}
        postSimulationSubmission={this.postSimulationSubmission}
        simulationRunId={simulationRunId}
      />
    );
  }

  renderAssetDetails() {
    if (!this.state.allModelAssets || !this.props.match.params.simulationRunId) {
      return null;
    }
    return (
      <div>
        <Row className="responsive-row">
          <Col span={12} className="column-style column-asset-detail responsive-column">
            <div className="run-detail-assets-inner-column-style">
              <div className="run-border">{this.renderPoleVulnerabilityTable()}</div>
            </div>
          </Col>
          <Col span={12} className="column-style column-asset-detail responsive-column">
            <div className="">
              <div className="run-border">
                <Tabs tabPosition="top" type="card" style={{ textAlign: 'left' }}>
                  <TabPane tab="Map" key="1">
                    <SimpleMap
                      allModelAssets={this.state.allModelAssets}
                      selectedNode={this.state.selectNode}
                      selectionBands={this.state.vulnerabilityBands}
                    />
                  </TabPane>
                  <TabPane tab="Network" key="2" style={{ textAlign: 'left ' }}>
                    {this.renderNetworkTopologyGraph()}
                  </TabPane>
                  <TabPane tab="OMF" key="3" style={{ textAlign: 'left' }}>
                    <OMFTopologyMap
                      simulationRunId={this.props.match.params.simulationRunId}
                      omfTopologyImage={this.state.omfTopologyImage}
                    />
                  </TabPane>
                </Tabs>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }

  renderBelowHeader(currentSimulationRunRequestMetadata, combinedData, linesToAdd, measurements) {
    if (_.isEmpty(combinedData) || _.isEmpty(linesToAdd)) {
      return null;
    }

    if (_.isEmpty(currentSimulationRunRequestMetadata)) {
      return null;
    }
    if (currentSimulationRunRequestMetadata.status !== DEFAULT_SIMULATION_RUN_STATUS_COMPLETED) {
      return null;
    }

    console.log(
      'renderBelowHeader this.state.selectedRightYAxisMeasurement',
      this.state.selectedRightYAxisMeasurement
    );
    return (
      <div style={{ paddingTop: '20px' }}>
        <Row>
          <Col span={20}>
            {this.renderLineChartSimulationRun({
              // data: renderPoleData,
              data: combinedData,
              lines: linesToAdd,
              // TODO: In the API, calculate the max values for each asset,
              // then don't set the domain if the max is higher than the DEFAULT_YAXIS_DOMAIN
              domain: DEFAULT_YAXIS_DOMAIN,
              chartsConfiguration: this.state.chartsConfiguration,
              yAxisLeft: { dy: 40 }
            })}
          </Col>
          <Col span={4}>
            <div className="measurement-column-style">
              <Measurements
                measurements={measurements}
                handleMeasurementClick={this.handleMeasurementClick}
                getAliasForRecording={this.getAliasForRecording}
                chartsConfiguration={this.state.chartsConfiguration}
                asset={this.state.currentAsset}
                selectedMeasurement={this.state.selectedRightYAxisMeasurement}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={24}>{this.renderAssetDetails()}</Col>
        </Row>
      </div>
    );
  }

  renderSimulationRunNotCompleted(currentSimulationRunRequestMetadata, combinedData) {
    console.log(
      '1SimulationRun renderSimulationRunNotCompleted this.props',
      this.props,
      'this.state',
      this.state,
      'combinedData',
      combinedData
    );

    if (_.isEmpty(currentSimulationRunRequestMetadata)) {
      return null;
    }
    // Only render if it's not completed
    if (!_.isEmpty(combinedData)) {
      return null;
    }
    // Don't show the COMPLETED or ERROR status, just let the detailed page show
    if (currentSimulationRunRequestMetadata.status === DEFAULT_SIMULATION_RUN_STATUS_COMPLETED) {
      return null;
    }
    console.log('SimulationRun renderSimulationRunNotCompleted combinedData', combinedData);
    return (
      <SimulationRunNotCompleted
        configuration={this.state.chartsConfiguration}
        /* simulationMetaData={{ ...this.state.currentSimulationRunRequestMetadata }} */
        simulationMetaData={currentSimulationRunRequestMetadata}
      />
    );
  }

  render() {
    console.log('render============================================================SimulationRun');
    console.log('SimulationRun render props', this.props);
    console.log('SimulationRun render state', this.state);

    const measurementColumnStyle = {
      backgroundColor: '#ffffff',
      paddingTop: '20px',
      marginLeft: '-30px',
      width: '80%',
      fontSize: '10px'
    };

    const { chartData } = this.state;

    const leftNavItems = this.props.commonProps.leftNavItems;

    const assetMeasurement = this.getAssetMeasurement(
      this.state.currentAsset,
      this.state.selectedMeasurement
    );

    console.log('combinedData selectedmeasurement', this.selectedMeasurement);

    const linesToAdd = [];
    let assetRightYAxisMeasurement = null;

    if (this.state.selectedRightYAxisMeasurement) {
      const globalMeasurementRight = this.getGlobalMeasurement(
        this.state.selectedRightYAxisMeasurement,
        this.state.chartsConfiguration
      );
      console.log('globalMeasurement:', globalMeasurementRight);
      if (globalMeasurementRight) {
        assetRightYAxisMeasurement = globalMeasurementRight.fullName;
      } else {
        assetRightYAxisMeasurement = this.getAssetMeasurement(
          this.state.currentAsset,
          this.state.selectedRightYAxisMeasurement
        );
      }
      console.log(
        'this.state.selectedRightYAxisMeasurement',
        this.state.selectedRightYAxisMeasurement,
        'assetRightYAxisMeasurement',
        assetRightYAxisMeasurement
      );

      linesToAdd.push({
        assetMeasurement: assetRightYAxisMeasurement,
        measurement: this.state.selectedRightYAxisMeasurement,
        stroke: '#D3D3D3',
        strokeWidth: 3,
        yAxisId: 'right',
        fill: '#D3D3D3',
        // barSize: '20',
        type: 'Bar',
        fillOpacity: '.6'
      });
    }

    linesToAdd.push({
      assetMeasurement: this.state.chartsConfiguration.vulnerability_measurement,
      measurement: this.state.chartsConfiguration.vulnerability_measurement,
      stroke: '#A9A9A9',
      strokeWidth: 3,
      yAxisId: 'left',
      type: 'Line'
    });

    console.log(
      'this.state.currentAsset.calculated_recordings',
      this.state.currentAsset && this.state.currentAsset.calculated_recordings
    );
    const poleStaticValues = [
      {
        name: 'critical_pole_stress',
        value: this.state.chartsConfiguration.criticalVulnerability
      }
    ];
    const combinedData = this.mapResponseToChartData(chartData, poleStaticValues);
    const criticalPoleStressLine = {
      yAxisId: 'left',
      assetMeasurement: 'critical_pole_stress',
      measurement: 'critical_pole_stress',
      stroke: '#D3D3D3',
      strokeDasharray: '5 5',
      strokeWidth: 3,
      type: 'Line'
    };

    linesToAdd.push(criticalPoleStressLine);

    const currentSimulationRunRequestMetadata = this.props.getCurrentSimulationRunRequestMetadata(
      this.props.match.params.simulationRunId
    );

    let measurements = [];
    if (this.state.currentAsset) {
      measurements = this.state.currentAsset.recordings;
    }

    if (this.state.selectedRightYAxisMeasurement) {
      measurements.push(this.state.selectedRightYAxisMeasurement);
    }
    measurements = this.addGlobalMeasurements(measurements, this.state.chartsConfiguration);

    const mainItems = (
      <div>
        <Row>
          <Col span={24}>{this.renderSimulationRunHeader(currentSimulationRunRequestMetadata)}</Col>
        </Row>
        {this.renderSimulationRunNotCompleted(currentSimulationRunRequestMetadata, combinedData)}
        {this.renderBelowHeader(
          currentSimulationRunRequestMetadata,
          combinedData,
          linesToAdd,
          measurements
        )}
      </div>
    );
    console.log('chartsConfiguration before render', chartsConfiguration);
    return (
      <div>
        <Route exact path={`${this.props.match.path}`} render={props => mainItems} />
        <Route
          exact
          path={`${this.props.match.path}/assets/:assetId`}
          render={props => (
            <div>
              <Asset
                commonProps={this.props.commonProps}
                selectedAssetDetailId={this.state.selectedAssetDetailId}
                allRunAssets={this.state.allRunAssets}
                runResultsData={this.state.runResultsData}
                mapResponseToBarChartData={this.mapResponseToBarChartData}
                mapResponseToChartData={this.mapResponseToChartData}
                getAssetMeasurement={this.getAssetMeasurement}
                renderLineChartAssetDetail={this.renderLineChartAssetDetail}
                getWindData={this.getWindData}
                navigateToAsset={this.navigateToAsset}
                chartsConfiguration={this.state.chartsConfiguration}
                getDefaultMeasurementForAsset={this.getDefaultMeasurementForAsset}
                getLabelForRecording={this.getLabelForRecording}
                getUnitForRecording={this.getUnitForRecording}
                getGlobalMeasurement={this.getGlobalMeasurement}
                addGlobalMeasurements={this.addGlobalMeasurements}
                getAliasForRecording={this.getAliasForRecording}
                getChartInterval={this.getChartInterval}
                getCurrentSimulationRunRequestMetadata={
                  this.props.getCurrentSimulationRunRequestMetadata
                }
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(SimulationRun);
