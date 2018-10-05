/* eslint-disable no-undef */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import Explore from '../components/Explore';
import D3_BarChart from '../components/d3/D3_BarChart';
import { resetErrorMessage } from '../actions';

class App extends Component {
  static propTypes = {
    // Injected by React Redux
    errorMessage: PropTypes.string,
    resetErrorMessage: PropTypes.func.isRequired,
    inputValue: PropTypes.string.isRequired,
    // Injected by React Router
    children: PropTypes.node
  };

  constructor(props) {
    super(props);
    this.d3_barChartContainerRef = React.createRef();
  }

  componentDidMount() {
    // D3 Code to create the chart
    this.d3_barChart = D3_BarChart.create(
      this.d3_barChartContainerRef.current,
      this.props.data,
      this.props.config
    );
  }

  handleDismissClick = e => {
    this.props.resetErrorMessage();
    e.preventDefault();
  };

  handleChange = nextValue => {
    this.props.history.push(`/${nextValue}`);
  };

  renderErrorMessage() {
    const { errorMessage } = this.props;
    if (!errorMessage) {
      return null;
    }

    return (
      <p style={{ backgroundColor: '#e99', padding: 10 }}>
        <b>{errorMessage}</b> <button onClick={this.handleDismissClick}>Dismiss</button>
      </p>
    );
  }

  render() {
    const { children, inputValue } = this.props;
    return (
      <div className="d3-container" ref={this.d3_barChartContainerRef}>
        {/*  <D3_BarChart value={inputValue} onChange={this.handleChange} /> */}
        {/*         <Explore value={inputValue} onChange={this.handleChange} />*/}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    errorMessage: state.errorMessage,

    inputValue: ownProps.location.pathname.substring(1)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    {
      resetErrorMessage
    }
  )(App)
);
