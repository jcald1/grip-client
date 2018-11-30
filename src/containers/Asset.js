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

// TODO: Generalize

class Asset extends Component {
  constructor(props) {
    super(props);
    const currentMeasurement =
      this.props.measurements && this.props.measurements[0] && this.props.measurements[0].name;

    this.state = {
      currentMeasurement,
      currentAsset: {},
      measurements: [],
      data: []
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
      this.props.currentAsset,
      'assets',
      this.props.assets
      /* 'data',
      this.props.data */
    );

    // Parent mounted first, and so props were passed in.  Safe to continue
    if (
      this.props.commonProps &&
      this.props.currentAsset &&
      this.props.assetData &&
      this.props.assets &&
      this.props.mapResponseToBarChartData &&
      this.props.mapResponseToChartData &&
      this.props.getAssetMeasurement &&
      this.props.renderLineChart &&
      this.props.measurements
      /* this.props.data */
    ) {
      this.setState(this.props);
    } else {
      console.log('Asset componentDidMount need to look in URL and update');
      this.populateFullAsset(this.props.match.params.assetId);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!this.props || !this.props.commonProps) {
      return false;
    }
    return true;
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(
      'Asset componentDidUpdate',
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

    if (
      this.props.commonProps.shallowEquals(this.props.commonProps, prevProps.commonProps) &&
      this.props.commonProps.shallowEquals(this.props.assetData, prevProps.assetData) &&
      this.props.commonProps.shallowEquals(this.props.assets, prevProps.assets) &&
      this.props.commonProps.shallowEquals(
        this.props.mapResponseToBarChartData,
        prevProps.mapResponseToBarChartData
      ) &&
      this.props.commonProps.shallowEquals(
        this.props.mapResponseToChartData,
        prevProps.mapResponseToChartData
      ) &&
      this.props.commonProps.shallowEquals(
        this.props.getAssetMeasurement,
        prevProps.getAssetMeasurement
      ) &&
      this.props.commonProps.shallowEquals(this.props.renderLineChart, prevProps.renderLineChart) &&
      /* this.props.commonProps.shallowEquals(this.props.data, prevProps.data) && */
      this.props.commonProps.shallowEquals(this.props.measurements, prevProps.measurements) &&
      this.props.commonProps.shallowEquals(this.props.windData, prevProps.windData) &&
      this.props.commonProps.shallowEquals(
        this.state.currentMeasurement,
        prevState.currentMeasurement
      ) &&
      this.props.commonProps.shallowEquals(this.state.currentAsset, prevState.currentAsset) &&
      /* this.props.commonProps.shallowEquals(this.props.data, prevProps.data) && */
      this.props.commonProps.shallowEquals(this.state.measurements, prevState.measurements)
      /* this.props.commonProps.shallowEquals(this.state.data, prevState.data) */
    ) {
      console.log('Asset change not updating');
      return;
    }
    console.log('Asset change updating', this.props.match.params.assetId);

    // this.props.navigateToAsset(this.props.match.params.assetId);
    if (this.state.currentAsset != null) {
      const currentData = this.populateAsset(this.state.currentMeasurement);
      this.setState({ currentData, data: currentData });
    }
    console.log(
      'Asset change populateFullAsset updating',
      this.props.match.params.assetId,
      this.state.currentAsset.id
    );

    if (
      this.state.currentAsset != null &&
      this.props.currentAsset != null &&
      parseInt(this.props.currentAsset.id, 10) !== parseInt(this.state.currentAsset.id, 10)
    ) {
      this.populateFullAsset(this.props.match.params.assetId);
    }
  }

  populateAsset(measurement) {
    console.log(
      'Assets populateAsset',
      'this.state.',
      this.state,
      'this.props.',
      this.props,
      'measurement',
      measurement
    );

    const assetMeasurement = this.props.getAssetMeasurement(this.state.currentAsset, measurement);
    console.log('*** assetMeasurement', assetMeasurement);
    console.log('*** this.props.assetData', this.props.assetData);
    const data = this.props.mapResponseToBarChartData(this.props.assetData, assetMeasurement);
    console.log('*** data', data);
    return data;
  }

  populateFullAsset(assetDetailPageAssetId) {
    assetDetailPageAssetId = parseInt(assetDetailPageAssetId, 10);
    console.log('navigateToAsset assetid', assetDetailPageAssetId, 'assets', this.props.assets);
    const assetDetailPageAsset = this.props.assets.find(
      asset => asset.id === assetDetailPageAssetId
    );
    console.log('*** populateFullAsset', assetDetailPageAsset, '');
    simulationRuns
      .getSimulationRunAsset({
        baseUrl: this.props.commonProps.apiPath,
        apiVersion: DEFAULT_API_VERSION,
        //  TODO: Clean Up.  THese should be Simulation Run IDs not Simulation IDs.
        simulationRunId: this.props.simulationRunId,
        assetId: assetDetailPageAsset.id
      })
      .then(data => {
        console.log('Asset populateFullAsset getsimulation run asset data', data);
        if (!data) {
          return Promise.reject(new Error('No data received from the API.'));
        }
        const measurements = data.recordings;

        console.log('Asset currentData', currentData, measurements[0]);
        const newState = {
          measurements,
          assetDetailPageAsset,
          currentAsset: assetDetailPageAsset,
          currentMeasurement: measurements[0].name
        };
        console.log('setting state', newState);
        this.setState(newState);
        const currentData = this.populateAsset(measurements[0].name);
        this.setState({ data: currentData, assetData: currentData });
        console.log('setting state currentData', currentData);
      });
  }

  handleMeasurementClick(e) {
    console.log(
      'Asset handleMeasurementClick value',
      e.currentTarget.getAttribute('value'),
      'this.props.match.assetId',
      this.props.match.assetId
    );

    const currentMeasurement = e.currentTarget.getAttribute('value');

    console.log('handleMeasurementClick setting currentMeasurement', currentMeasurement);
    this.setState({ currentMeasurement });
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

    if(this.props.history && this.props.history.action === 'POP' &&
    parseInt(this.props.match.params.assetId,10) !== parseInt(this.state.currentAsset.id,10)){
       this.populateFullAsset(this.props.match.params.assetId);
    }

    const { data } = this.state;
    const { measurements } = this.state;

    console.log('Asset render data', data);
    console.log('Asset render measurements', measurements);

    if (!data || !data.length || data.length === 0) {
      return null;
    }
    if (!measurements || !measurements.length || measurements.length === 0) {
      return null;
    }

    console.log('Continue Rendering', this.props);
    const leftNavItems = null;
    const columnStyle = {
      border: '3px solid white',
      backgroundColor: '#d3d3d3'
    };
    const assetMeasurement = this.props.getAssetMeasurement(
      this.state.currentAsset,
      this.state.currentMeasurement
    );
    console.log('Asset assetMeasurementchart', assetMeasurement, this.state.data);
    
    let assetTitle = this.state.currentAsset.name;
    if (this.state.currentAsset.properties.class === 'pole') {
      assetTitle = 'Pole Vulnerability - ' + assetTitle;
    }
    const mainItems = (
      <div>
        <Row>
          <Col span={24}>
          <Title text={assetTitle} />
            <SubTitle
              text={`${this.state.currentAsset.name} (${
                this.state.currentAsset.properties.class
              }) - ${this.state.currentMeasurement}`}
            />
           {/* <SubTitle
              text={`${this.state.currentMeasurement} (${this.props.currentAsset.properties.class})`}
            /> */}
            {/* <SubTitle text="Pole failure and fault when Pole Stress >= 1" /> */}
            {/* The dynamic data based on the measurement selection */}
            <div>
              {this.props.renderLineChart({
                data: this.props.mapResponseToChartData(this.props.assetData),
                assetMeasurementObjArr: [{ assetMeasurement, stroke: '#8884d8' }]
              })}
            </div>
            <Title text="Wind Speed and Critical Wind Speed (meters/second)" />
            <SubTitle text="Forecasted Pole failure when Wind Speed >= Critical Wind Speed" />
            <div>
              {this.props.renderLineChart({
                data: this.props.mapResponseToChartData(this.props.assetData),
                assetMeasurementObjArr: [
                  { assetMeasurement: WIND_SPEED_ASSET_MEASUREMENT, stroke: '#8884d8' },
                  {
                    assetMeasurement: this.props.getAssetMeasurement(
                      this.state.currentAsset,
                      CRITICAL_WIND_SPEED_MEASUREMENT,
                    ),
                    stroke: '#FF0000',
                    strokeDasharray: '5 5'
                  }
                ],
                renderXaxis: false
              })}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8} style={columnStyle}>
            <AssetProperties data={this.state.currentAsset} asset={this.state.asset} />
          </Col>
          <Col span={8} style={columnStyle}>
            <Measurements
              data={measurements}
              handleMeasurementClick={this.handleMeasurementClick}
              asset={this.state.asset}
            />
          </Col>
          <Col span={8} style={columnStyle}>
            <AssetRelationships
              data={this.state.currentAsset}
              handleSimulationRunAssetRequestClick={this.handleSimulationRunAssetRequestClick}
              asset={this.state.asset}
              simulation_run_id={this.props.simulation_run_id}
            />
          </Col>
        </Row>
      </div>
    );

    return <Layout leftNavItems={leftNavItems} mainItems={mainItems} />;
  }
}

export default withRouter(Asset);
