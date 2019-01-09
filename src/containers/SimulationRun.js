/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import { Tabs, Divider } from 'antd';
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
  Legend,
  ResponsiveContainer
} from 'recharts';
import './App.css';
import Layout from '../components/Layout';
import SimpleMap from '../components/SimpleMap';
import CustomToolTip from '../components/CustomToolTip';
import OMFTopologyMap from '../components/OMFTopologyMap';
import Asset from './Asset';
import Assets from '../components/Assets';
import simulationRuns from '../actions/simulationRuns';
import omf from '../actions/omf';
import networkTopology from '../actions/networkTopology';
import NetworkTopology from '../components/d3/NetworkTopology/NetworkTopololgy';
import SimulationRunHeader from './SimulationRunHeader';

const DEFAULT_DIVIDER = '__';
const DEFAULT_YAXIS_DOMAIN = [0, 1.2];
const DEFAULT_SIMULATION_RUN_STATUS_COMPLETED = 4;

const TabPane = Tabs.TabPane;

class SimulationRun extends Component {
  constructor(props) {
    super(props);

    const chartsConfiguration = {
      api: {
        version: 'v1'
      },
      vulnerabilityBands: {
        low: 0.8,
        medium: 1,
        high: null // infinite
        /*         low: 0.005,
        medium: 0.01,
        high: null // infinite */
      },
      filtered_assets: ['meter', 'overhead_line', 'pole'],
      vulnerability_measurement: 'vulnerability',
      criticalVulnerability: 1,
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
      primaryMetricsForClasses: [
        {
          class: 'pole',
          properties: [
            {
              key: 'resisting_moment'
            },
            {
              key: 'total_moment'
            },
            {
              key: 'susceptibility'
            },
            {
              key: 'wind_speed'
            }
          ]
        },
        {
          class: 'line',
          properties: [
            {
              key: 'power_out_real'
            },
            {
              key: 'wind_speed'
            }
          ]
        },
        {
          class: 'overhead_line',
          properties: [
            {
              key: 'power_out_real'
            },
            {
              key: 'wind_speed'
            }
          ]
        },
        {
          class: 'substation_meter',
          properties: [
            {
              key: 'measured_reactive_power'
            },
            {
              key: 'measured_real_power'
            },
            {
              key: 'wind_speed'
            }
          ]
        },
        {
          class: 'meter',
          properties: [
            {
              key: 'measured_reactive_power'
            },
            {
              key: 'measured_real_power'
            },
            {
              key: 'wind_speed'
            }
          ]
        }
      ],
      primaryPropertiesForClasses: [
        {
          class: 'meter',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'nominal_voltage',
              name: 'Nominal Voltage'
            },
            {
              key: 'bustype',
              name: 'Bus Type'
            },
            {
              key: 'class',
              name: 'class'
            },
            {
              key: 'phases',
              name: 'Phases'
            },
            {
              key: 'service_status',
              name: 'Service Status'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            }
          ]
        },
        {
          class: 'triplex-meter',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'nominal_voltage',
              name: 'Nominal Voltage'
            },
            {
              key: 'bustype',
              name: 'Bus Type'
            },
            {
              key: 'class',
              name: 'class'
            },
            {
              key: 'phases',
              name: 'Phases'
            },
            {
              key: 'service_status',
              name: 'Service Status'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            }
          ]
        },
        {
          class: 'transformer',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'nominal_voltage',
              name: 'Nominal Voltage'
            },
            {
              key: 'bustype',
              name: 'Bus Type'
            },
            {
              key: 'class',
              name: 'class'
            },
            {
              key: 'phases',
              name: 'Phases'
            },
            {
              key: 'service_status',
              name: 'Service Status'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            }
          ]
        },
        {
          class: 'substation',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'nominal_voltage',
              name: 'Nominal Voltage'
            },
            {
              key: 'bustype',
              name: 'Bus Type'
            },
            {
              key: 'class',
              name: 'class'
            },
            {
              key: 'phases',
              name: 'Phases'
            },
            {
              key: 'service_status',
              name: 'Service Status'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            }
          ]
        },
        {
          class: 'substation_meter',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'nominal_voltage',
              name: 'Nominal Voltage'
            },
            {
              key: 'bustype',
              name: 'Bus Type'
            },
            {
              key: 'class',
              name: 'class'
            },
            {
              key: 'phases',
              name: 'Phases'
            },
            {
              key: 'service_status',
              name: 'Service Status'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            }
          ]
        },
        {
          class: 'pole',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'class',
              name: 'Class'
            },
            {
              key: 'pole_type',
              name: 'Type'
            },
            {
              key: 'equipment_height',
              name: 'Height'
            },
            {
              key: 'equipment_area',
              name: 'Area'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'tilt_angle',
              name: 'Tilt Angel'
            },
            {
              key: 'tilt_direction',
              name: 'Tilt Direction'
            }
          ]
        },
        {
          class: 'weather',
          properties: []
        },
        {
          class: 'line',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'configuration',
              name: 'Configurration'
            },
            {
              key: 'class',
              name: 'Class'
            },
            {
              key: 'continuous_rating',
              name: 'Continuous Rating'
            },
            {
              key: 'emergency_rating',
              name: 'Emergency Rating'
            },
            {
              key: 'flow_direction',
              name: 'Flow Direction'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            },
            {
              key: 'length',
              name: 'Length'
            }
          ]
        },
        {
          class: 'overhead_line',
          properties: [
            {
              key: 'Name',
              name: 'Name'
            },
            {
              key: 'configuration',
              name: 'Configurration'
            },
            {
              key: 'class',
              name: 'Class'
            },
            {
              key: 'continuous_rating',
              name: 'Continuous Rating'
            },
            {
              key: 'emergency_rating',
              name: 'Emergency Rating'
            },
            {
              key: 'flow_direction',
              name: 'Flow Direction'
            },
            {
              key: 'longitude',
              name: 'Longitude'
            },
            {
              key: 'latitude',
              name: 'Latitude'
            },
            {
              key: 'length',
              name: 'Length'
            }
          ]
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
          label: 'Peak Vulnerability',
          YAxisPosition: 'left'
        },
        {
          name: 'pole_stress',
          nameAlias: 'vulnerability_index',
          label: 'Vulnerability Index',
          YAxisPosition: 'left'
        },
        {
          name: 'critical_pole_stress',
          nameAlias: 'critical_vulnerability_index',
          label: 'Critical Vulnerability Index',
          unit: 'pu',
          YAxisPosition: 'left'
        },
        {
          name: 'measured_real_power',
          label: 'Measured Real Power',
          unit: 'W',
          YAxisPosition: 'right'
        },
        {
          name: 'measured_real_power',
          label: 'Measured Real Power',
          unit: 'W',
          YAxisPosition: 'left'
        },
        {
          name: 'measured_real_power',
          label: 'Measured Real Power',
          unit: 'W',
          YAxisPosition: 'right'
        },
        {
          name: 'measured_reactive_power',
          label: 'Measured Reactive Power',
          unit: 'W',
          YAxisPosition: 'right'
        },
        {
          name: 'wind_speed',
          label: 'Wind Speed',
          unit: 'meters/sec',
          YAxisPosition: 'right'
        },
        {
          name: 'resisting_moment',
          label: 'Resisting Moment',
          unit: 'ft*lb',
          YAxisPosition: 'right'
        },
        {
          name: 'total_moment',
          label: 'Total Moment',
          unit: 'ft*lb',
          YAxisPosition: 'right'
        },
        {
          name: 'critical_wind_speed',
          label: 'Critical Wind Speed',
          unit: 'meters/sec',
          YAxisPosition: 'right'
        },
        {
          name: 'susceptibility',
          label: 'Susceptibility',
          unit: 'pu*s/m',
          YAxisPosition: 'right'
        },
        {
          name: 'pole_status',
          label: 'Pole Status',
          unit: 'OK/FAILED',
          YAxisPosition: 'right'
        },
        {
          name: 'current_uptime',
          label: 'Current Uptime',
          unit: 'Minutes',
          YAxisPosition: 'right'
        },
        {
          name: 'power_out_real',
          label: 'Power Out Real',
          unit: 'W',
          YAxisPosition: 'right'
        }
      ]
    };
    this.emptyState = {
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
      topologyMapSelectNode: null,
      omfTopologyImage: null,
      vulnerabilityBands: {
        low: [],
        medium: [],
        high: []
      },
      currentSimulationRunRequestMetadata: null
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
  }


  componentDidMount() {
    console.log('SimulationRun componentDidMount');
    if (_.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) {
      return null;
    }
      this.populateSimulationRun();
    }


  componentDidUpdate(prevProps, prevState) {
    console.log(
      'SimulationRun componentDidUpdate this.props',
      this.props,
      'this.state.currentAsset',
      this.state.currentAsset,
      'this.state',
      this.state
    );
    if (_.isEmpty(this.props.commonProps.simulationRunRequestsMetadata)) { 
      return;
    }
  // If any state is empty (componentDidMount should still be finishing its calls)
  // TODO: What happens if the props change while the calls are still happening, may be best to remove this.
/*   if (_.isEmpty(this.state.omfTopologyImage) ||
  _.isEmpty(this.state.allModelAssets) ||
  _.isEmpty(this.state.currentAsset) ||
  _.isEmpty(this.state.allRunAssets) ||
  _.isEmpty(this.state.selectedAssetDetailId) ||
  _.isEmpty(this.state.runResultsData) ||
  _.isEmpty(this.state.chartData) 
  ) {
      return;
    } */
  // If Props or state haven't changed
   if (
      this.props.match.params.simulationRunId === prevProps.match.params.simulationRunId &&
      _.isEqual(this.props.commonProps.simulationRunRequestsMetadata,      prevProps.commonProps.simulationRunRequestsMetadata) &&
      _.isEqual(this.state.omfTopologyImage,      prevState.omfTopologyImage) &&
      _.isEqual(this.state.allModelAssets,      prevState.allModelAssets) &&
      _.isEqual(this.state.currentAsset,      prevState.currentAsset) &&
      _.isEqual(this.state.allRunAssets,      prevState.allRunAssets) &&     
      this.state.selectedAssetDetailId === prevState.selectedAssetDetailId &&
      _.isEqual(this.state.runResultsData,      prevState.runResultsData) &&    
      _.isEqual(this.state.chartData,      prevState.chartData)) {
        return;
    } 
    // If any of these are set, that means componentDidMount has already

    this.populateSimulationRun();
  }

  populateSimulationRun() {
    // TODO: Move this into Redux / Thunk actions

    let currentAsset;
    let selectedAssetDetailId;
    this.setState({ gettingSimulationRun: true });
    // TODO: Some of these calls may be able to be done in parallel.

    if (!this.props.match.params.simulationRunId) {
      return;
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

    const currentSimulationRunRequestMetadata = this.setCurrentSimulationRunRequestMetadata();
    if (_.isEmpty(currentSimulationRunRequestMetadata)) {
      console.log('Simulation Run data not available yet')
      return;
    }
    if (currentSimulationRunRequestMetadata.status !== DEFAULT_SIMULATION_RUN_STATUS_COMPLETED) {
      return;
    }

    omf
      .getOMFTopologyImage({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: this.state.chartsConfiguration.api.version,
        simulationRunId
      })
      // TODO: This may belong in the API container
      .then(omfTopologyImage => {
        console.log('SimulationRun omfTopologyImage1', omfTopologyImage);
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
    // TODO: Get the Simulation Run / Update the Status/details
    simulationRuns
      .getSimulationRunAllModelAssets({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: this.state.chartsConfiguration.api.version,
        simulationRunId
      })
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
      .catch(err => {
        console.error(err);
        console.log('Error', err);
        if (err.response && err.response.data && err.response.data.message) {
          err = new verror.VError(err, err.response.data.message);
        }
        this.props.commonProps.handleError(err);
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
        this.setState({ currentAsset, allRunAssets, selectedAssetDetailId });
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
      })
      .finally(() => {
        this.setState({ gettingSimulationRun: false });
      });

    networkTopology
      .getNetworkTopology({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: this.state.chartsConfiguration.api.version
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


  setCurrentSimulationRunRequestMetadata() {
    console.log(
      'SimulationRun setCurrentSimulationRunRequestMetadata',
      'this.props.commonProps.simulationRunRequestsMetadata',
      this.props.commonProps
    );
    if (!this.props.match.params.simulationRunId) {
      return;
    }
    const simulationRunIdStr = parseInt(this.props.match.params.simulationRunId, 10);
    if (isNaN(simulationRunIdStr)) {
      return this.props.commonProps.handleError('Simulation Run ID must be numeric');
    }
    const currentSimulationRunRequestMetadata = this.props.commonProps.simulationRunRequestsMetadata.find(
      simulation => simulation.id === simulationRunIdStr
    );

    this.setState({ currentSimulationRunRequestMetadata });
    return currentSimulationRunRequestMetadata;
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
    console.log('SimulationRun data',data);
    // TODO: Add message to user
    this.setState({ sendingSimulationRunRequest: true });
    simulationRuns
      .postSimulationRunSubmission({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: this.state.chartsConfiguration.api.version,
        data
      })
      .then(response => {
        return this.props.refreshSimulationRuns()
        .then(refreshRunResponse => ({response, refreshRunResponse}));
      })
      .then( ({response}) => {
        console.log('Simulation Run Submission Response', response);
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
      });
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
            barSize={20}
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
    console.log('***linesToRender', linesToRender);
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
            {/* <CartesianGrid stroke="#ccc" strokeDasharray="5 5" /> */}
            {/* <XAxis
          domain = {['auto', 'auto']}
          name='time'
          type='number'
          scale="time"
          tickCount={2}
          tickFormatter = {(unixTime) => moment(unixTime).format('HH:mm Do')}
          dataKey="timestamp_unix_epoch" fontSize={10} padding={{ left: 0, right: 0 }}/> */}
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
            <Tooltip />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    );
  }

  renderLineChartSimulationRun({
    data, lines, domain, yAxisLeft, chartsConfiguration
  }) {


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

    // console.log('***bottomMargin', bottomMargin);
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
          width={1200}
          height={260}
          data={data}
        >
          {linesToRender}
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis interval={0} tick={{ dy: 20 }} angle={-90} dataKey="timestamp" />
          <YAxis
            domain={domain}
            yAxisId="left"
            label={{
              value: 'Peak Vulnerability',
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

  renderSimulationRunHeader() {
    const simulationRunId = this.props.match.params.simulationRunId
      ? parseInt(this.props.match.params.simulationRunId, 10)
      : null;
    return (
      <SimulationRunHeader
        commonProps={this.props.commonProps}
        postSimulationSubmission={this.postSimulationSubmission}
        simulationRunId={this.props.match.params.simulationRunId}
      />
    );
  }

  renderAssetDetails() {
    if (!this.state.allModelAssets || !this.props.match.params.simulationRunId) {
      return null;
    }
    return (
      <div
        className="border"
        style={{
          height: '460px',
          marginTop: '0px',
          display: 'flex',
          flexWrap: 'wrap',
          WebkitFlexWrap: 'wrap' /* Safari 6.1+ */
        }}
      >
        <div
          style={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: '600px',
            height: '460px'
          }}
        >
          {this.renderPoleVulnerabilityTable()}
        </div>
        <div
          style={{
            flexGrow: 1,
            flexBasis: 0,
            minWidth: '600px',
            height: '460px'
          }}
        >
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
    );
  }
  renderBelowHeader(combinedData, linesToAdd) {
    if (_.isEmpty(combinedData)) {
      return null;
    }

    return (
      <div>
      <div>
      {this.renderLineChartSimulationRun({
        data: combinedData,
        lines: linesToAdd,
        // TODO: In the API, calculate the max values for each asset,
        // then don't set the domain if the max is higher than the DEFAULT_YAXIS_DOMAIN
        domain: DEFAULT_YAXIS_DOMAIN,
        chartsConfiguration: this.state.chartsConfiguration,
        yAxisLeft: { dy: 40 }
      })}
    </div>
    {this.renderAssetDetails()}
    </div>)
  }

  render() {
    console.log('render============================================================SimulationRun');
    console.log('SimulationRun render props', this.props);
    console.log('SimulationRun render state', this.state);

    const { chartData } = this.state;

    const leftNavItems = this.props.commonProps.leftNavItems;

    const defaultMeasurement =
      this.state.currentAsset &&
      this.state.currentAsset.recordings &&
      this.state.currentAsset.recordings[0] &&
      this.state.chartsConfiguration.defaultFirstMetricSelected;

    const assetMeasurement = this.getAssetMeasurement(this.state.currentAsset, defaultMeasurement);

    console.log('combinedData defaultMeasurement', defaultMeasurement);

    const linesToAdd = [
      {
        yAxisId: 'right',
        assetMeasurement,
        measurement: defaultMeasurement,
        fill: '#4682b4',
        // barSize: '20',
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
      stroke: '#008000',
      strokeDasharray: '5 5',
      strokeWidth: 3,
      type: 'Line'
    };

    linesToAdd.push(criticalPoleStressLine);

    const mainItems = (
      <div>
        {this.renderSimulationRunHeader()}
        {this.renderBelowHeader(combinedData, linesToAdd)}
      </div>
    ); 


    return (
      <div>
        <Route
          exact
          path={`${this.props.match.path}`}
          render={props => mainItems}
        />
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
                simulationMetaData={this.state.currentSimulationRunRequestMetadata}
              />
            </div>
          )}
        />
      </div>
    );
  }
}

export default withRouter(SimulationRun);
