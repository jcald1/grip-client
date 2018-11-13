/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import './App.css';
import Layout from '../components/Layout';
import Measurements from '../components/Measurements';
import AssetRelationships from '../components/AssetRelationships';
import AssetProperties from '../components/AssetProperties';
import Title from '../components/Title';

// const queryString = require('query-string');
// const querySearch = require('stringquery');
const qs = require('qs');

// const DEFAULT_SWING_BUS = 'HVMV_Sub_HSB__measured_real_power';
const DEFAULT_MEASUREMENT = 'measured_real_power';

// TODO: Generalize

class Asset extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentMeasurement: DEFAULT_MEASUREMENT,
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
      this.props.renderCharts &&
      this.props.measurements
      /* this.props.data */
    ) {
      this.populateAsset();
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
      this.props.commonProps.shallowEquals(this.props.renderCharts, prevProps.renderCharts) &&
      /* this.props.commonProps.shallowEquals(this.props.data, prevProps.data) && */
      this.props.commonProps.shallowEquals(this.props.measurements, prevProps.measurements) &&
      this.props.commonProps.shallowEquals(
        this.state.currentMeasurement,
        prevState.currentMeasurement
      )
      /* this.props.commonProps.shallowEquals(this.state.data, prevState.data) */
    ) {
      return;
    }

    this.populateAsset();
  }

  populateAsset() {
    console.log(
      'Assets populateAsset',
      'this.props.',
      this.props,
      'this.state.currentMeasurement',
      this.state.currentMeasurement
    );

    const assetMeasurement = this.props.getAssetMeasurement(
      this.props.currentAsset,
      this.state.currentMeasurement
    );
    console.log('*** assetMeasurement', assetMeasurement);
    console.log('*** this.props.assetData', this.props.assetData);
    const data = this.props.mapResponseToBarChartData(this.props.assetData, assetMeasurement);
    console.log('*** data', data);
    this.setState({ data });
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

    const mainItems = (
      <div>
        <Title text={`${this.props.currentAsset.name} - ${this.state.currentMeasurement}`} />
        <div>{this.props.renderCharts({ data })}</div>
        <Measurements
          data={measurements}
          handleMeasurementClick={this.handleMeasurementClick}
          asset={this.props.asset}
        />
        <AssetRelationships
          data={this.props.currentAsset}
          handleAssetClick={this.handleAssetClick}
          asset={this.props.asset}
        />
        <AssetProperties
          data={this.props.currentAsset}
          handleAssetClick={this.handleAssetClick}
          asset={this.props.asset}
        />
        </div>
    );

    return <Layout leftNavItems={leftNavItems} mainItems={mainItems} />;
  }
}

export default withRouter(Asset);
