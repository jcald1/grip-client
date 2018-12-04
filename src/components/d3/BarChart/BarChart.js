/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import D3_BarChart from './D3_BarChart';

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.setBarChartContainerRef = this.setBarChartContainerRef.bind(this);
  }

  // Load the V3 from a CDN to avoid Create React APp Babel adding use strict
  /*   loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';

      if (script.readyState) {
        // IE
        script.onreadystatechange = function () {
          if (script.readyState == 'loaded' || script.readyState == 'complete') {
            script.onreadystatechange = null;
            resolve();
          }
        };
      } else {
        // Others
        script.onload = function () {
          resolve();
        };
      }

      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  } */

  componentDidMount() {
    console.log('BarChart componentDidMount');

    console.log('Get Simulation Run Results this.props.data', this.props.data);
    // D3 Code to create the chart
    if (this.props.data) {
      try {
        this.d3_barChart = D3_BarChart.create(
          this.d3_barChartContainerRef,
          this.props.data,
          this.props.config
        );
        console.log('componentDidMount this.d3_barChart', this.d3_barChart);
      } catch (err) {
        this.props.commonProps.handleError(err);
      }
    }
  }

  componentWillUnmount() {
    console.log('BarChart componentWillUnmount this.d3_barChart', this.d3_barChart);
    if (this.d3_barChart) {
      console.log('BarChart removing this.d3_barChart', this.d3_barChart);
      D3_BarChart.destroy(this.d3_barChart);
    }
  }

  componentDidUpdate() {
    console.log('BarChart componentDidUpdate this.props.data', this.props.data);
    // D3 Code to update the chart
    if (this.props.data) {
      this.d3_barChart = D3_BarChart.update(
        this.d3_barChartContainerRef,
        this.props.data,
        this.props.config,
        this.d3_barChart
      );
    }
  }

  setBarChartContainerRef(element) {
    this.d3_barChartContainerRef = element;
  }

  render() {
    console.log('BarChart render');
    const { children, inputValue } = this.props;
    return <div className="d3-container" ref={this.setBarChartContainerRef.bind(this)} />;
  }
}

export default BarChart;
