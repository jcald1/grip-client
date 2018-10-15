/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import D3_BarChart from './D3_BarChart';

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.setBarChartContainerRef = this.setBarChartContainerRef.bind(this);
  }

  componentDidMount() {
    console.log('BarChart componentDidMount');

    console.log('Get Simulation Run Results data', this.props.data);
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
        this.props.handleError(err);
      }
    }
    // Updates
    /* D3_BarChart.update(
        this.d3_barChartContainerRef,
        this.props.data,
        this.props.config,
        this.d3_barChart
      ); */
  }

  componentWillUnmount() {
    console.log('BarChart componentWillUnmount this.d3_barChart', d3_barChart);
    if (this.d3_barChart) {
      console.log('BarChart removing this.d3_barChart', this.d3_barChart);
      D3_BarChart.destroy(this.d3_barChart);
    }
  }

  componentDidUpdate() {
    console.log('BarChart componentDidUpdate this.props.data', this.props.data);
    // D3 Code to update the chart
    if (this.props.data) {
      D3_BarChart.update(
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
