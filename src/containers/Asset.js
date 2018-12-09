/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import './App.css';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Layout from '../components/Layout';
import Measurements from '../components/Measurements';
import AssetRelationships from '../components/AssetRelationships';
import AssetProperties from '../components/AssetProperties';
import Title from '../components/Title';
import SubTitle from '../components/SubTitle';
import simulationRuns from '../actions/simulationRuns';

const WIND_SPEED_ASSET_MEASUREMENT = 'weather__wind_speed';
const CRITICAL_WIND_SPEED_MEASUREMENT = 'critical_wind_speed';
const qs = require('qs');

const DEFAULT_API_VERSION = 'v1';
const DEFAULT_YAXIS_DOMAIN = [0, 1.2];
const DEFAULT_POLE_STRESS_MEASUREMEMENT = 'pole_stress'

// TODO: Generalize

class Asset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMeasurement: null,
      selectedMeasurementChartData: null,
      asset: null
    };

    this.handleMeasurementClick = this.handleMeasurementClick.bind(this);
    this.handleSimulationRunAssetRequestClick = this.handleSimulationRunAssetRequestClick.bind(
      this
    );
    this.navigateToSimulationRunAsset = this.navigateToSimulationRunAsset.bind(this);
    this.populateFullAsset = this.populateFullAsset.bind(this);
  }

  componentDidMount() {
    console.log(
      'componentDidMountAllPropsCompare',
      this.props,
      'commonProps',
      this.props.commonProps,
      'currentAsset',
      this.props.selectedAssetDetailId,
      'allRunAssets',
      this.props.allRunAssets
      /* 'data',
      this.props.data */
    );

    // Parent mounted first, and so props were passed in.  Safe to continue
    console.log('Asset componentDidMount need to look in URL and update');
    this.populateFullAsset(this.props.match.params.assetId);
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      'AssetcomponentDidUpdate',
      'this.state.currentMeasurement',
      this.state,
      'prevstate',
      prevState,
      'AllPropsCompare',
      this.props,
      'prevprops',
      prevProps,

      'props assetid',
      this.props.match.params.assetId
    );

    console.log(
      'Asset change populateFullAsset updating',
      this.props.match.params.assetId,
      this.state.asset.id
    );

    if (parseInt(this.props.match.params.assetId, 10) !== parseInt(this.state.asset.id, 10)) {
      this.populateFullAsset(this.props.match.params.assetId);
    } else {
      return null;
    }
  }

  getMeasurementDataForChart(asset, measurement) {
    console.log(
      'Assets populateAsset',
      'this.state.',
      this.state,
      'this.props.',
      this.props,
      'measurement',
      measurement
    );

    const assetMeasurement = this.props.getAssetMeasurement(asset, measurement);
    console.log('*** assetMeasurement', assetMeasurement);
    console.log('*** this.props.asset', this.props.asset);
    const chartData = this.props.mapResponseToBarChartData(
      this.props.runResultsData,
      assetMeasurement
    );
    console.log('*** data', chartData);
    return chartData;
  }

  populateFullAsset(assetDetailPageAssetId) {
    assetDetailPageAssetId = parseInt(assetDetailPageAssetId, 10);
    console.log(
      'navigateToAsset assetid',
      assetDetailPageAssetId,
      'assets',
      this.props.allRunAssets
    );
    const assetDetailPageAsset = this.props.allRunAssets.find(
      asset => asset.id === assetDetailPageAssetId
    );
    console.log('*** populateFullAsset', assetDetailPageAsset, '');

    const measurements = assetDetailPageAsset.recordings;

    const newState = {
      asset: assetDetailPageAsset,
      selectedMeasurement: measurements[0].name
    };
    console.log('setting state', newState, assetDetailPageAsset);
    this.setState(newState);
    const selectedMeasurementChartData = this.getMeasurementDataForChart(
      assetDetailPageAsset,
      measurements[0].name
    );
    this.setState({ selectedMeasurementChartData });
    console.log('setting state currentData', selectedMeasurementChartData);
  }

  handleMeasurementClick(e) {
    console.log(
      'Asset handleMeasurementClick value',
      e.currentTarget.getAttribute('value'),
      'this.props.match.assetId',
      this.props.match.assetId
    );

    const selectedMeasurement = e.currentTarget.getAttribute('value');

    console.log('handleMeasurementClick setting currentMeasurement', selectedMeasurement);
    this.setState({ selectedMeasurement });
  }

  handleSimulationRunAssetRequestClick(e) {
    console.log('App handleSimulationRunAssetRequestClick');
    console.log(
      'App handleSimulationRunAssetRequestClick value',
      e.currentTarget.getAttribute('value'),
      this.props,
      'currentasset',
      this.props.currentAsset
    );

    const simulationRunAssetId = e.currentTarget.getAttribute('value');
    const simulationRunId = this.props.simulationRunId;
    this.navigateToSimulationRunAsset(simulationRunId, simulationRunAssetId);
    console.log('App simulationRun.handleAssetClick');
  }

  navigateToSimulationRunAsset(simulationRunId, simulationRunAssetId) {
    const assetDetailPageAssetId = parseInt(simulationRunAssetId, 10);
    // const assetDetailPageAssetId = e;

    console.log('assetdetailprops', this.props, 'assetDetailPageAssetId', assetDetailPageAssetId);
    this.props.navigateToAsset(assetDetailPageAssetId);
  }

  render() {
    console.log('render============================================================Asset');
    console.log('Asset render props', this.props);
    console.log('Asset render state', this.state);

    const { runResultsData, asset } = this.state;

    console.log('Asset render data', runResultsData);
    console.log('Asset render measurements', measurements);

    if (!asset || !asset.recordings) {
      return null;
    }
    const measurements = asset.recordings;

    console.log('Continue Rendering', this.props);
    const leftNavItems = null;
    const columnStyle = {
      border: '3px solid white',
      backgroundColor: '#d3d3d3'
    };
    const assetMeasurement = this.props.getAssetMeasurement(
      this.state.asset,
      this.state.selectedMeasurement
    );
    console.log(
      'Asset assetMeasurementchart',
      this.state.selectedMeasurement,
      this.state.runResultsData
    );

    let title = this.state.asset.name;
    let poleVulnerabilitySubTitle = null;
    let poleStaticValues = null;
    let criticalPoleStressLine = null;
    const criticalWindSpeedAssetMeasurement = this.props.getAssetMeasurement(
      this.state.asset,
      CRITICAL_WIND_SPEED_MEASUREMENT
    );
    //console.log('**criticalWindSpeedAssetMeasurement',criticalWindSpeedAssetMeasurement)
    let linesToAdd = ([
      {
        assetMeasurement,
        stroke: '#8884d8',
        strokeWidth: 3,
        yAxisId: 'left'
      },
      {
        yAxisId: 'right',
        assetMeasurement: WIND_SPEED_ASSET_MEASUREMENT,
        stroke: '#008000'
      },
      {
        yAxisId: 'right',
        assetMeasurement: criticalWindSpeedAssetMeasurement,
        //stroke: 'darkorange',
        stroke: '#008000',
        strokeDasharray: '5 5'
      }
    ]);
    if (this.state.asset.properties.class === 'pole') {
      title = `Pole Vulnerability - ${title}`;
      poleVulnerabilitySubTitle = (
        <div>
          <SubTitle
            style={{ color: '#8884d8'}}
            //style={{ color: 'blue'}}
            text="Pole Failure and Fault when Pole Stress >= 1"
          />
          <div
            style={{ color: '#008000', fontWeight: 'normal' }} >
            Forecasted Pole Failure when Wind Speed >= Critical Wind Speed
          </div>
        </div>
      );
      poleStaticValues = [
        {
          name: 'critical_pole_stress',
          value: this.state.asset.calculated_recordings.find(
            obj => obj.name === 'critical_pole_stress'
          ).value
        }
      ];
      criticalPoleStressLine = {
        yAxisId: 'left',
        assetMeasurement: 'critical_pole_stress',
        stroke: '#8884d8',
        strokeDasharray: '5 5',
        strokeWidth: 3
      };
      if (this.state.selectedMeasurement === DEFAULT_POLE_STRESS_MEASUREMEMENT) {
        linesToAdd.push(criticalPoleStressLine);
      }
      console.log('linesToAdd', linesToAdd);
    } else {
      console.log('not a pole');
      title = `${title} (${this.state.asset.properties.class}) `;
    }

    const combinedData = this.props.mapResponseToChartData(
      this.props.runResultsData,
      poleStaticValues
    );
    console.log('combinedData', combinedData, 'poleStaticValues', poleStaticValues);

    console.log('combinedData', combinedData);
    const mainItems = (
      <div>
        <Row>
          <Col span={24}>
            <Title text={`${title} - ${this.state.selectedMeasurement}`} />
            {poleVulnerabilitySubTitle}
            <div>
              {this.props.renderLineChart({
                // data: renderPoleData,
                data: combinedData,
                lines: linesToAdd,
                // TODO: In the API, calculate the max values for each asset, then don't set the domain if the max is higher than the DEFAULT_YAXIS_DOMAIN
                domain: DEFAULT_YAXIS_DOMAIN
              })}
            </div>
            {/*
  <SubTitle text="Wind Speed and Critical Wind Speed (meters/second)" />
  <div>
              {this.props.renderLineChart({
                data: renderWindData,
                lines: [
                  {
                    yAxisId: 'right',
                    assetMeasurement: WIND_SPEED_ASSET_MEASUREMENT,
                    stroke: '#8884d8'
                  },
                  {
                    yAxisId: 'right',
                    assetMeasurement: criticalWindSpeedAssetMeasurement,
                    stroke: 'darkorange',
                    strokeDasharray: '5 5'
                  }
                ]
              })}
            </div> */}
          </Col>
        </Row>
        <Row>
          <Col span={8} style={columnStyle}>
            <AssetProperties asset={this.state.asset} />
          </Col>
          <Col span={8} style={columnStyle}>
            <Measurements
              measurements={measurements}
              handleMeasurementClick={this.handleMeasurementClick}
            />
          </Col>
          <Col span={8} style={columnStyle}>
            <AssetRelationships
              asset={this.state.asset}
              handleSimulationRunAssetRequestClick={this.handleSimulationRunAssetRequestClick}
            />
          </Col>
        </Row>
      </div>
    );

    return <Layout leftNavItems={leftNavItems} mainItems={mainItems} />;
  }
}

export default withRouter(Asset);
