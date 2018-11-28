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

const WIND_SPEED_ASSET_MEASUREMENT = 'weather__wind_speed';
const CRITICAL_WIND_SPEED_MEASUREMENT = 'critical_wind_speed';

// TODO: Generalize

class Asset extends Component {
  constructor(props) {
    super(props);
    const currentMeasurement =
      this.props.measurements && this.props.measurements[0] && this.props.measurements[0].name;
    this.state = {
      currentMeasurement,
      data: []
    };

    this.handleMeasurementClick = this.handleMeasurementClick.bind(this);
  }

  componentDidMount() {
    console.log(
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
      this.props.getAssetMeasurement &&
      this.props.renderLineChart &&
      this.props.measurements
      /* this.props.data */
    ) {
      const currentData = this.populateAsset(this.state.currentMeasurement);
      this.setState({ data: currentData });
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
      this.state.currentMeasurement
    );

    if (
      this.props.commonProps.shallowEquals(this.props.commonProps, prevProps.commonProps) &&
      this.props.commonProps.shallowEquals(this.props.currentAsset, prevProps.currentAsset) &&
      this.props.commonProps.shallowEquals(this.props.assetData, prevProps.assetData) &&
      this.props.commonProps.shallowEquals(this.props.assets, prevProps.assets) &&
      this.props.commonProps.shallowEquals(
        this.props.mapResponseToBarChartData,
        prevProps.mapResponseToBarChartData
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
      )
      /* this.props.commonProps.shallowEquals(this.state.data, prevState.data) */
    ) {
      return;
    }

    const currentData = this.populateAsset(this.state.currentMeasurement);
    this.setState({ data: currentData });
  }

  populateAsset(measurement) {
    console.log('Assets populateAsset', 'this.props.', this.props, 'measurement', measurement);

    const assetMeasurement = this.props.getAssetMeasurement(this.props.currentAsset, measurement);
    console.log('*** assetMeasurement', assetMeasurement);
    console.log('*** this.props.assetData', this.props.assetData);
    const data = this.props.mapResponseToBarChartData(this.props.assetData, assetMeasurement);
    console.log('*** data', data);
    return data;
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

  render() {
    console.log('Asset render props', this.props);
    console.log('Asset render state', this.state);

    const { data } = this.state;
    const { measurements } = this.props;
    if (!data || !data.length || data.length === 0) {
      return null;
    }
    if (!measurements || !measurements.length || measurements.length === 0) {
      return null;
    }

    const leftNavItems = null;
    const columnStyle = { border: '3px solid white', backgroundColor: '#d3d3d3' };
    const assetMeasurement = this.props.getAssetMeasurement(
      this.props.currentAsset,
      this.state.currentMeasurement
    );
    console.log('Asset assetMeasurement', assetMeasurement);
    const mainItems = (
      <div>
        <Row>
          <Col span={24}>
            <Title
              text={`${this.props.currentAsset.name} (${
                this.props.currentAsset.properties.class
              }) - ${this.state.currentMeasurement}`}
            />
            {/* The dynamic data based on the measurement selection */}
            <div>{this.props.renderLineChart({ data: this.props.assetData, assetMeasurements: [assetMeasurement] })}</div>
            <Title text="Wind Speed and Critical Wind Speed" />
            <div>
              {this.props.renderLineChart({
                /* data: this.props.getWindData(this.props.assetData, WIND_SPEED_ASSET_MEASUREMENT) */
                /* data: this.props.mapResponseToBarChartData(this.props.assetData), */
                data: this.props.assetData,
                assetMeasurements: [WIND_SPEED_ASSET_MEASUREMENT, this.props.getAssetMeasurement(this.props.currentAsset, CRITICAL_WIND_SPEED_MEASUREMENT)]
              })}
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={8} style={columnStyle}>
            <AssetProperties
              data={this.props.currentAsset}
              handleAssetClick={this.handleAssetClick}
              asset={this.props.asset}
            />
          </Col>
          <Col span={8} style={columnStyle}>
            <Measurements
              data={measurements}
              handleMeasurementClick={this.handleMeasurementClick}
              asset={this.props.asset}
            />
          </Col>
          <Col span={8} style={columnStyle}>
            <AssetRelationships
              data={this.props.currentAsset}
              handleAssetClick={this.handleAssetClick}
              asset={this.props.asset}
            />
          </Col>
        </Row>
      </div>
    );

    return <Layout leftNavItems={leftNavItems} mainItems={mainItems} />;
  }
}

export default withRouter(Asset);
