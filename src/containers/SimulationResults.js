/* eslint-disable no-undef */

import React, { Component } from 'react';
import BarChart from '../components/d3/BarChart/BarChart';
import './App.css';

class SimulationResults extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  getBarChart({ commonProps, visualization, key }) {
    return (
      <div key>
        <BarChart
          style={{ marginTop: '20px' }}
          // handleError={this.renderErrorMessage}
          commonProps={commonProps}
          {...visualization}
        />
      </div>
    );
  }

  renderCharts({ visualizations, visualizeNetwork }) {
    const charts = [];

    if (visualizeNetwork) {
      charts.push(
        this.getBarChart({
          commonProps: this.props.commonProps,
          visualization: visualizations.overallNetwork,
          key: 'network'
        })
      );
    }

    return charts;
  }

  render() {
    console.log('props', this.props);
    console.log(
      'SimulationResults render commonProps',
      this.props.commonProps,
      'visualizations',
      this.props.visualizations,
      'visualizeNetwork',
      this.props.visualizeNetwork
    );

    return this.renderCharts({
      visualizations: this.props.visualizations,
      visualizeNetwork: this.props.visualizeNetwork
    });
  }
}

export default SimulationResults;
