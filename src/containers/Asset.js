/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import './App.css';
import { Col, Row } from 'antd';
import Layout from '../components/Layout';
import Measurements from '../components/Measurements';
import AssetRelationships from '../components/AssetRelationships';
import SimpleMapAsset from '../components/SimpleMapAsset';
import AssetProperties from '../components/AssetProperties';
import Title from '../components/Title';
import SubTitle from '../components/SubTitle';

const DEFAULT_YAXIS_DOMAIN = [0, 1.2];
const DEFAULT_POLE_STRESS_MEASUREMEMENT = 'pole_stress';

class Asset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedMeasurement: null,
      selectedMeasurementChartData: null,
      selectedRightYAxisMeasurement: null,
      asset: null
    };

    this.handleMeasurementClick = this.handleMeasurementClick.bind(this);
    this.handleSimulationRunAssetRequestClick = this.handleSimulationRunAssetRequestClick.bind(
      this
    );
    this.navigateToSimulationRunAsset = this.navigateToSimulationRunAsset.bind(this);
    this.populateFullAsset = this.populateFullAsset.bind(this);
    this.navigateToSimulationRun = this.navigateToSimulationRun.bind(this);
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
      this.props.match.params.assetId,
      'this.state.asset',
      this.state.asset
    );

    console.log(
      'Asset change populateFullAsset updating',
      this.props.match.params.assetId,
      this.state.asset
    );
    if (this.state.asset) {
      if (parseInt(this.props.match.params.assetId, 10) !== parseInt(this.state.asset.id, 10)) {
        this.populateFullAsset(this.props.match.params.assetId);
      } else {
        return null;
      }
    } else {
      this.populateFullAsset(this.props.match.params.assetId);
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
    if (!this.props.allRunAssets) {
      return;
    }
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

    const defaultMeasurementForAsset = this.props.getDefaultMeasurementForAsset(
      assetDetailPageAsset,
      this.props.chartsConfiguration
    );
    const newState = {
      asset: assetDetailPageAsset,
      selectedMeasurement: defaultMeasurementForAsset
    };

    console.log('setting state', newState, assetDetailPageAsset);
    this.setState(newState);
    const selectedMeasurementChartData = this.getMeasurementDataForChart(
      assetDetailPageAsset,
      defaultMeasurementForAsset
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

    const selectedRightYAxisMeasurement = e.currentTarget.getAttribute('value');

    console.log('handleMeasurementClick setting currentMeasurement', selectedRightYAxisMeasurement);
    this.setState({ selectedRightYAxisMeasurement });
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

  navigateToSimulationRun(e) {
    const simulationRunId = e.currentTarget.getAttribute('value');
    console.log('navigateToSimulationRunClicked', simulationRunId, 'this.props', this.props);
    // Clear out simulation runs, force whole new re-render of app
    /* const newState = {simulationRunRequestsMetadata:[] }; */
    this.props.history.push({
      pathname: `/simulation-runs/${simulationRunId}`
    });
  }

  render() {
    console.log('render============================================================Asset');
    console.log('Asset render props', this.props);
    console.log('Asset render state', this.state);

    const { runResultsData, asset } = this.state;

    console.log('Asset render data', runResultsData);

    if (!asset || !asset.recordings) {
      return null;
    }
    let measurements = asset.recordings;
    measurements = this.props.addGlobalMeasurements(measurements, this.props.chartsConfiguration);

    console.log('Continue Rendering', this.props);
    const leftNavItems = this.props.commonProps.leftNavItems;
    const columnStyle = {
      backgroundColor: '#ffffff'
    };

    const columnStyleMap = {
      backgroundColor: '#ffffff'
    };

    const innerColumnStyle = {
      backgroundColor: '#ffffff',
      marginLeft: 'auto',
      marginRight: 'auto',
      paddingTop: '0px',
      width: '100%'
    };

    const measurementColumnStyle = {
      backgroundColor: '#ffffff',
      paddingTop: '20px',
      marginLeft: '-30px',
      width: '80%',
      fontSize: '10px'
    };

    let assetMeasurement = '';
    const globalMeasurement = this.props.getGlobalMeasurement(
      this.state.selectedMeasurement,
      this.props.chartsConfiguration
    );
    console.log('globalMeasurement:', globalMeasurement);
    if (globalMeasurement) {
      assetMeasurement = globalMeasurement.fullName;
    } else {
      assetMeasurement = this.props.getAssetMeasurement(
        this.state.asset,
        this.state.selectedMeasurement
      );
    }

    console.log(
      'Asset assetMeasurementchart',
      assetMeasurement,
      this.state.selectedMeasurement,
      this.props.runResultsData
    );

    let title = this.state.asset.name;
    let poleStaticValues = null;
    let criticalPoleStressLine = null;

    const linesToAdd = [];
    let assetRightYAxisMeasurement = null;

    console.log(
      'this.state.selectedRightYAxisMeasurement',
      this.state.selectedRightYAxisMeasurement,
      'assetRightYAxisMeasurement',
      assetRightYAxisMeasurement
    );

    console.log(
      'his.state.selectedRightYAxisMeasurement',
      this.state.selectedRightYAxisMeasurement,
      'linesToAdd----',
      linesToAdd
    );

    if (this.state.selectedRightYAxisMeasurement) {
      const globalMeasurementRight = this.props.getGlobalMeasurement(
        this.state.selectedRightYAxisMeasurement,
        this.props.chartsConfiguration
      );
      console.log('globalMeasurement:', globalMeasurementRight);
      if (globalMeasurementRight) {
        assetRightYAxisMeasurement = globalMeasurementRight.fullName;
      } else {
        assetRightYAxisMeasurement = this.props.getAssetMeasurement(
          this.state.asset,
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

    // add primary Asset metric
    linesToAdd.push({
      assetMeasurement,
      measurement: this.state.selectedMeasurement,
      stroke: '#A9A9A9',
      strokeWidth: 3,
      yAxisId: 'left',
      type: 'Line'
    });
    let poleVulnerabilitySubTitle = '';
    if (this.state.selectedMeasurement === 'pole_stress') {
      title = `${title}`;
      poleVulnerabilitySubTitle = (
        <div>
          <SubTitle
            style={{ color: '#A9A9A9' }}
            // style={{ color: 'blue'}}
            text="Pole Failure and Fault when Vulnerability Index >= Vulnerability Index of 1"
          />
        </div>
      );
      if (this.state.selectedMeasurement === 'pole_stress') {
        poleStaticValues = [
          {
            name: 'critical_pole_stress',
            value: this.state.asset.calculated_recordings.find(
              obj => obj.name === 'critical_pole_stress'
            ).value
          }
        ];
      }
      criticalPoleStressLine = {
        yAxisId: 'left',
        assetMeasurement: 'critical_pole_stress',
        measurement: 'critical_pole_stress',
        stroke: '#A9A9A9',
        strokeDasharray: '5 5',
        strokeWidth: 3,
        type: 'Line'
      };

      if (this.state.selectedMeasurement === DEFAULT_POLE_STRESS_MEASUREMEMENT) {
        linesToAdd.push(criticalPoleStressLine);
      }
    } else {
      console.log('not a pole');
      title = `${title}`;
    }

    const combinedData = this.props.mapResponseToChartData(
      this.props.runResultsData,
      poleStaticValues
    );

    console.log('combinedData', combinedData, 'poleStaticValues', poleStaticValues);

    console.log(
      'combinedData',
      combinedData,
      'this.props.simulationMetaData',
      this.props.simulationMetaData
    );

    let simulationName = '';
    let simulationId = null;
    if (this.props.simulationMetaData) {
      simulationName = this.props.simulationMetaData.simulation_submission.name;
      simulationId = this.props.simulationMetaData.id;
    }
    const mainItems = (
      <div>
        <Row>
          <Col span={18}>
            <div className="assetdetail-title">
              <div className="asset-simulation-nav">
                <div onClick={this.navigateToSimulationRun} value={simulationId} key={simulationId}>
                  {simulationName}
                </div>
              </div>
              <div className="asset-title">
                <Title text={`${title}`} />
              </div>
            </div>
          </Col>
          <Col span={6} />
        </Row>
        <Row>
          <Col span={20}>
            {/* `- ${this.props.getAliasForRecording(
                this.state.selectedMeasurement,
                this.props.chartsConfiguration
              )` */}

            {/* {poleVulnerabilitySubTitle} */}
            <div>
              {this.props.renderLineChartAssetDetail({
                // data: renderPoleData,
                data: combinedData,
                lines: linesToAdd,
                // TODO: In the API, calculate the max values for each asset,
                // then don't set the domain if the max is higher than the DEFAULT_YAXIS_DOMAIN
                domain: DEFAULT_YAXIS_DOMAIN,
                chartsConfiguration: this.props.chartsConfiguration,
                selectedMeasurement: this.state.selectedMeasurement,
                selectedRightYAxisMeasurement: this.state.selectedRightYAxisMeasurement
              })}
            </div>
          </Col>
          <Col span={4}>
            <div style={measurementColumnStyle}>
              <Measurements
                measurements={measurements}
                handleMeasurementClick={this.handleMeasurementClick}
                getAliasForRecording={this.props.getAliasForRecording}
                chartsConfiguration={this.props.chartsConfiguration}
                asset={this.state.asset}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={2} style={columnStyle} />
          <Col span={7} style={columnStyle}>
            <div style={innerColumnStyle}>
              <AssetProperties
                asset={this.state.asset}
                props={this.props}
                chartsConfiguration={this.props.chartsConfiguration}
              />
            </div>
          </Col>
          <Col span={4} style={columnStyle}>
            <div style={innerColumnStyle}>
              <AssetRelationships
                asset={this.state.asset}
                handleSimulationRunAssetRequestClick={this.handleSimulationRunAssetRequestClick}
              />
            </div>
          </Col>
          <Col span={11} style={columnStyleMap}>
          Asset Location
            <SimpleMapAsset asset={this.state.asset} />
          </Col>
        </Row>
      </div>
    );

    return <Layout leftNavItems={leftNavItems} mainItems={mainItems} />;
  }
}

export default withRouter(Asset);
