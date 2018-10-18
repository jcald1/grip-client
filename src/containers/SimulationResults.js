/* eslint-disable no-undef */

import React, { Component } from 'react';
import BarChart from '../components/d3/BarChart/BarChart';
import './App.css';
import _ from 'lodash';
import Title from '../components/Title';

class SimulationResults extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {}

  shouldComponentUpdate(nextProps, nextState) {
    // TODO: We may need to do a shallow comparison instead and directly check the values.
    if (_.isEqual(nextProps, this.props)) {
      console.log('SimulationResults shouldComponentUpdate false');
      return false;
    }
    console.log('SimulationResults shouldComponentUpdate true');
    return true;
  }

  getBarChart({ commonProps, visualization }) {
    console.log('SimulationResults getBarChart visualization', visualization);
    return (
      <div key={visualization.data.id}>
        <BarChart
          style={{ marginTop: '20px' }}
          // handleError={this.renderErrorMessage}
          commonProps={commonProps}
          {...visualization}
        />
      </div>
    );
  }

  // renderCharts({ visualization, visualizeNetwork, handleSimulationRunRequestClick }) {
  renderCharts({ visualization }) {
    const charts = [];
    if (!visualization || !visualization.data) {
      return null;
    }
    charts.push(
      this.getBarChart({
        commonProps: this.props.commonProps,
        visualization
      })
    );
    return charts;
  }

  render() {
    console.log('props', this.props);
    console.log(
      'SimulationResults render commonProps',
      this.props.commonProps,
      'visualization',
      this.props.visualization
    );

    if (!this.props.visualization) {
      return null;
    }

    return (
      <div>
        <Title text={this.props.visualization.text} />
        <div>
          {this.renderCharts({
            visualization: this.props.visualization
            // visualizeNetwork: this.props.visualizeNetwork,
          })}
        </div>
      </div>
    );
  }
}

export default SimulationResults;
