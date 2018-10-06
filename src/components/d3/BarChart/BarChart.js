/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import D3_BarChart from './D3_BarChart';
import simulations from '../../../actions/simulations';

const DEFAULT_SIMULATION_ID = 1;
const DEFAULT_SIMULATION_VERSION = 1;
const DEFAULT_SIMULATION_RUN_ID = 1;

class BarChart extends Component {
  constructor(props) {
    super(props);

    this.setBarChartContainerRef = this.setBarChartContainerRef.bind(this);
  }

  componentDidMount() {
    // TODO: Move this into Redux / Thunk actions
    console.log('this.props.apiPath', this.props.apiPath);
    simulations
      .getSimulationRunResults({
        path: this.props.apiPath,
        simulationId: DEFAULT_SIMULATION_ID,
        simulationVersion: DEFAULT_SIMULATION_VERSION,
        simulationRunId: DEFAULT_SIMULATION_RUN_ID
      })
      .then(data => {
        // D3 Code to create the chart
        this.d3_barChart = D3_BarChart.create(
          this.d3_barChartContainerRef,
          data,
          this.props.config
        );
      })
      .catch(err => {
        this.props.handleError(err);
      });

    // Updates
    /* D3_BarChart.update(
        this.d3_barChartContainerRef,
        this.props.data,
        this.props.config,
        this.d3_barChart
      ); */
  }

  componentWillUnmount() {
    D3_BarChart.destroy(this.d3_barChartContainerRef);
  }

  componentDidUpdate() {
    // D3 Code to update the chart
    D3Line.update(
      this.d3_barChartContainerRef,
      this.props.data,
      this.props.config,
      this.d3_barChart
    );
  }

  setBarChartContainerRef(element) {
    this.d3_barChartContainerRef = element;
  }

  render() {
    const { children, inputValue } = this.props;
    return <div className="d3-container" ref={this.setBarChartContainerRef.bind(this)} />;
  }
}

export default BarChart;
