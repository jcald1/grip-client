/* eslint-disable no-undef */

import React, { Component } from 'react';
import _ from 'lodash';
import { withRouter, Route } from 'react-router-dom';
import BarChart from '../components/d3/BarChart/BarChart';
import './App.css';
import Layout from '../components/Layout';
import Measurements from '../components/Measurements';
import Title from '../components/Title';
import moment from 'moment';

// const queryString = require('query-string');
// const querySearch = require('stringquery');
const qs = require('qs');

// const DEFAULT_SWING_BUS = 'HVMV_Sub_HSB__measured_real_power';
const DEFAULT_MEASUREMENT = 'measured_real_power';
const DEFAULT_DIVIDER = '__';
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
      this.props.assets,
      'data',
      this.props.data
    );

    // Parent mounted first, and so props were passed in.  Safe to continue
    if (
      this.props.commonProps &&
      this.props.currentAsset &&
      this.props.assetData &&
      this.props.assets &&
      this.props.mapResponseToBarChartData &&
      this.props.getAssetMeasurement &&
      this.props.renderCharts
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
      this.state.currentMeasurement === prevState.currentMeasurement
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

    /*     this.props.history.replace({
      pathname: this.props.match.url
    }, { currentMeasurement });
 */
    // this.populateAsset(this.props.match.params.simulationId, currentMeasurement);
  }

  getMeasurements(assets, currentAsset) {
    return assets[currentAsset];
  }

  render() {
    console.log(
      'Assets commonProps render',
      this.props.commonProps,
      'this.props.assetData',
      this.props.assetData,
      'this.props.assets',
      this.props.assets,
      'this.state.data',
      this.state.data
    );

    const { data } = this.state;

    if (!data || !data.length || data.length === 0) {
      return null;
    }

    const measurements = this.getMeasurements(this.props.assets, this.props.match.params.assetId);

    if (!measurements || _.isEmpty(measurements)) {
      return null;
    }

    const leftNavItems = null;

    const mainItems = (
      <div>
        <Title text={`${this.props.currentAsset} - ${this.state.currentMeasurement}`} />
        <div>{this.props.renderCharts({ data })}</div>
        <Measurements
          data={measurements}
          handleMeasurementClick={this.handleMeasurementClick}
          asset={this.props.asset}
        />
      </div>
    );

    return <Layout leftNavItems={leftNavItems} mainItems={mainItems} />;
  }
}

export default withRouter(Asset);
